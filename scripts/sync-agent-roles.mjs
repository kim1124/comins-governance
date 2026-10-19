import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const failure = 'comins-agent-roles: failed\n';
const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sha = content => createHash('sha256').update(content).digest('hex');
function noSymlink(path) {
  try { if (lstatSync(path).isSymbolicLink()) throw new Error('symlink'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}

try {
  const args = process.argv.slice(2);
  if (args[0] !== '--target' || !args[1] || args.length > 3 || (args[2] && args[2] !== '--reviewed-migration')) throw new Error('args');
  const target = realpathSync(args[1]);
  const root = execFileSync('git', ['-C', target, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
  if (realpathSync(root) !== target) throw new Error('not root');
  for (const path of [join(target,'.codex'), join(target,'.codex','agents')]) noSymlink(path);
  const version = readFileSync(join(sourceRoot,'COMINS_CONTRACT.md'),'utf8').match(/^# Comins Contract (v\d+\.\d+)$/m)?.[1];
  if (!version) throw new Error('version');
  const receiptPath = join(target,'.codex','comins-role-installation.json');
  noSymlink(receiptPath);
  const oldReceipt = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath,'utf8')) : null;
  const files = [
    ...readdirSync(join(sourceRoot,'.codex','agents')).filter(file => /^comins_[a-z_]+\.toml$/.test(file)).map(file => ({ source: join('.codex','agents',file), destination: join('.codex','agents',file) })),
    { source: 'docs/agent-roles.md', destination: '.codex/agent-roles.md' },
    { source: 'docs/agent-handoff.md', destination: '.codex/agent-handoff.md' },
  ];
  const writes = files.map(file => {
    const path = join(target,file.destination);noSymlink(path);
    const content = readFileSync(join(sourceRoot,file.source),'utf8');
    const original = existsSync(path) ? readFileSync(path,'utf8') : null;
    if (original !== null && original !== content && !args[2]) {
      const recorded = oldReceipt?.files?.find(item => item.file === file.destination);
      if (!recorded || recorded.sha256 !== sha(original)) throw new Error('unreviewed drift');
    }
    return { path, content, original };
  });
  const receipt = {
    schemaVersion: 1, source: 'comins-governance', contractVersion: version,
    sourceRevision: execFileSync('git',['-C',sourceRoot,'rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim(),
    sourceState: 'checkout-profile',
    files: files.map((file,index) => ({ file: file.destination, sha256: sha(writes[index].content) })),
    activation: 'requires repository trust and a fresh supported session; not runtime verified',
  };
  writes.push({ path: receiptPath, content: JSON.stringify(receipt,null,2)+'\n', original: existsSync(receiptPath) ? readFileSync(receiptPath,'utf8') : null });
  // Preflight every managed destination before the first write.
  const applied = [];
  try {
    for (const write of writes) {
      if (write.original === write.content) continue;
      mkdirSync(dirname(write.path),{recursive:true});
      writeFileSync(write.path,write.content,{encoding:'utf8',flag:write.original===null?'wx':'w'});applied.push(write);
    }
  } catch (error) {
    for (const write of applied.reverse()) {
      if (write.original===null) rmSync(write.path,{force:true});
      else writeFileSync(write.path,write.original,'utf8');
    }
    throw error;
  }
  process.stdout.write(`comins-agent-roles: synchronized ${files.length-2} roles\n`);
} catch {
  process.stderr.write(failure);process.exitCode=1;
}

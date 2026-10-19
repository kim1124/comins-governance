import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const script=join(root,'scripts/sync-agent-roles.mjs');
const expected={comins_orchestrator:['gpt-6-astra','high'],comins_planner:['gpt-6-astra','high'],comins_architect:['gpt-6-astra','high'],comins_explorer:['gpt-6.1-sol','medium'],comins_worker:['gpt-6.1-sol','high'],comins_debugger:['gpt-6-astra','high'],comins_verifier:['gpt-6.1-sol','medium'],comins_reviewer:['gpt-6-astra','high'],comins_integrator:['gpt-6-astra','high'],comins_operator:['gpt-6.1-sol','medium']};
function fixture(fn){const path=mkdtempSync(join(tmpdir(),'comins-roles-'));try{execFileSync('git',['init','--quiet',path],{stdio:'ignore'});fn(path)}finally{rmSync(path,{recursive:true,force:true})}}
function run(target,...args){return spawnSync(process.execPath,[script,'--target',target,...args],{encoding:'utf8'});}

test('explicit task profiles separate execution from independent review',()=>{
 const files=readdirSync(join(root,'.codex/agents')).filter(f=>f.startsWith('comins_')&&f.endsWith('.toml'));
 assert.deepEqual(files.sort(),Object.keys(expected).map(n=>n+'.toml').sort());
 for(const [name,[model,effort]] of Object.entries(expected)){
  const text=readFileSync(join(root,'.codex/agents',name+'.toml'),'utf8');
  assert.ok(text.includes(`name = "${name}"`));assert.ok(text.includes(`model = "${model}"`));assert.ok(text.includes(`model_reasoning_effort = "${effort}"`));assert.ok(text.includes(`plan_mode_reasoning_effort = "${effort}"`));assert.match(text,/\.codex\/agent-handoff\.md/);
 }
 assert.match(readFileSync(join(root,'.codex/agents/comins_reviewer.toml'),'utf8'),/sandbox_mode = "read-only"/);
 assert.match(readFileSync(join(root,'.codex/agents/comins_verifier.toml'),'utf8'),/do not edit the product, weaken assertions/i);
 assert.match(readFileSync(join(root,'.codex/agents/comins_operator.toml'),'utf8'),/existing authorization/i);
});

test('installs idempotent project roles and receipts without touching unrelated agents',()=>fixture(target=>{
 const dir=join(target,'.codex/agents');mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'user.toml'),'# unrelated\n');
 assert.equal(run(target).status,0);
 const receiptPath=join(target,'.codex/comins-role-installation.json'),first=readFileSync(receiptPath,'utf8'),receipt=JSON.parse(first);
 assert.equal(receipt.contractVersion,'v1.12');assert.equal(receipt.sourceState,'checkout-profile');assert.equal(receipt.files.length,12);
 for(const file of receipt.files)assert.equal(createHash('sha256').update(readFileSync(join(target,file.file))).digest('hex'),file.sha256);
 assert.equal(run(target).status,0);assert.equal(readFileSync(receiptPath,'utf8'),first);assert.equal(readFileSync(join(dir,'user.toml'),'utf8'),'# unrelated\n');
}));

test('refuses unreviewed or locally drifted roles before partially installing other files',()=>fixture(target=>{
 const role=join(target,'.codex/agents/comins_worker.toml');mkdirSync(dirname(role),{recursive:true});writeFileSync(role,'# custom existing role\n');
 assert.equal(run(target).status,1);assert.equal(readFileSync(role,'utf8'),'# custom existing role\n');assert.equal(existsSync(join(target,'.codex/agent-roles.md')),false);
 assert.equal(run(target,'--reviewed-migration').status,0);writeFileSync(role,'# local drift\n');assert.equal(run(target).status,1);assert.equal(readFileSync(role,'utf8'),'# local drift\n');
}));

test('rejects symlinked destinations and non-root targets without writing through them',()=>fixture(target=>{
 const outside=mkdtempSync(join(tmpdir(),'comins-roles-outside-'));
 try{mkdirSync(join(target,'.codex'));symlinkSync(outside,join(target,'.codex/agents'),'dir');assert.equal(run(target,'--reviewed-migration').status,1);assert.deepEqual(readdirSync(outside),[]);mkdirSync(join(target,'nested'));assert.equal(run(join(target,'nested')).status,1);assert.equal(existsSync(join(target,'nested/.codex')),false)}finally{rmSync(outside,{recursive:true,force:true})}
}));

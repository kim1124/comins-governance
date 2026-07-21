import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const checker = join(root, 'scripts', 'check-public-identities.mjs');
const failure = 'public-identity-check: failed\n';
const email = (local, domain) => [local, '@', domain].join('');
const safeName = 'comins-ci';
const safeEmail = email(safeName, 'users.noreply.github.com');
const unsafeName = ['Local', 'Author'].join(' ');
const unsafeEmail = email('local.author', 'example.test');

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

function git(cwd, ...args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function createRepository() {
  const cwd = mkdtempSync(join(tmpdir(), 'comins-identity-'));
  git(cwd, 'init', '--quiet');
  configureIdentity(cwd, safeName, safeEmail);
  return cwd;
}

function configureIdentity(cwd, name, address) {
  git(cwd, 'config', 'user.name', name);
  git(cwd, 'config', 'user.email', address);
}

function commit(cwd, message) {
  writeFileSync(join(cwd, 'change.txt'), `${message}\n`, { flag: 'a' });
  git(cwd, 'add', 'change.txt');
  git(cwd, 'commit', '--quiet', '-m', message);
  return git(cwd, 'rev-parse', 'HEAD');
}

function run(cwd, ...args) {
  return spawnSync(process.execPath, [checker, ...args], {
    cwd,
    encoding: 'utf8',
  });
}

function assertConstantFailure(result) {
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, failure);
}

test('accepts a matching GitHub noreply handle for local identity', () => {
  const cwd = createRepository();

  const result = run(cwd);

  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});

test('accepts approved GitHub Actions and Dependabot service identities', () => {
  const cwd = createRepository();
  const identities = [
    ['github-actions[bot]', email('action', 'github.com')],
    ['dependabot[bot]', email('49699333+dependabot[bot]', 'users.noreply.github.com')],
  ];

  for (const [name, address] of identities) {
    configureIdentity(cwd, name, address);
    const result = run(cwd);
    assert.equal(result.status, 0);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, '');
  }
});

test('accepts GitHub service committer on a Dependabot commit', () => {
  const cwd = createRepository();
  const base = commit(cwd, 'base');
  configureIdentity(
    cwd,
    'dependabot[bot]',
    email('49699333+dependabot[bot]', 'users.noreply.github.com'),
  );
  writeFileSync(join(cwd, 'change.txt'), 'dependency update\n', { flag: 'a' });
  git(cwd, 'add', 'change.txt');
  const committed = spawnSync('git', ['commit', '--quiet', '-m', 'dependency update'], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_COMMITTER_NAME: 'GitHub',
      GIT_COMMITTER_EMAIL: email('noreply', 'github.com'),
    },
  });
  assert.equal(committed.status, 0, committed.stderr);
  const head = git(cwd, 'rev-parse', 'HEAD');

  const result = run(cwd, base, head);

  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});

test('stores only allowlisted noreply email literals in the checker source', () => {
  const source = read('scripts/check-public-identities.mjs');
  const literals = source.match(/[a-z0-9._+%[\]-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) ?? [];

  assert.equal(
    literals.every((address) => address.endsWith('@users.noreply.github.com')),
    true,
  );
});

test('rejects a non-public local identity without echoing its values', () => {
  const cwd = createRepository();
  configureIdentity(cwd, unsafeName, unsafeEmail);

  const result = run(cwd);

  assertConstantFailure(result);
  assert.equal(result.stderr.includes(unsafeName), false);
  assert.equal(result.stderr.includes(unsafeEmail), false);
});

test('rejects a range containing an unsafe commit identity', () => {
  const cwd = createRepository();
  const base = commit(cwd, 'safe');
  configureIdentity(cwd, unsafeName, unsafeEmail);
  const head = commit(cwd, 'unsafe');

  const result = run(cwd, base, head);

  assertConstantFailure(result);
});

test('rejects an unsafe commit identity hidden by a mailmap rewrite', () => {
  const cwd = createRepository();
  const base = commit(cwd, 'safe');
  configureIdentity(cwd, unsafeName, unsafeEmail);
  commit(cwd, 'unsafe');
  configureIdentity(cwd, safeName, safeEmail);
  writeFileSync(
    join(cwd, '.mailmap'),
    `${safeName} <${safeEmail}> ${unsafeName} <${unsafeEmail}>\n`,
  );
  git(cwd, 'add', '.mailmap');
  const head = commit(cwd, 'mailmap');

  const result = run(cwd, base, head);

  assertConstantFailure(result);
});

test('rejects malformed and missing SHA input', () => {
  const cwd = createRepository();
  const head = commit(cwd, 'safe');

  assertConstantFailure(run(cwd, 'not-a-sha', head));
  assertConstantFailure(run(cwd, 'a'.repeat(40), head));
});

test('rejects a base that is not an ancestor of head', () => {
  const cwd = createRepository();
  const rootCommit = commit(cwd, 'root');
  const left = commit(cwd, 'left');
  git(cwd, 'checkout', '--quiet', '--detach', rootCommit);
  const right = commit(cwd, 'right');

  const result = run(cwd, left, right);

  assertConstantFailure(result);
});

test('pins the minimal Gitleaks rule contract without global suppressions', () => {
  const config = read('.gitleaks.toml');

  assert.match(config, /^minVersion = "v8\.30\.1"$/m);
  assert.match(config, /^\[extend\]\nuseDefault = true$/m);
  for (const id of [
    'comins-non-placeholder-email',
    'comins-local-account-path',
    'comins-korean-sensitive-number',
    'comins-sensitive-filename',
  ]) {
    assert.match(config, new RegExp(`^id = "${id}"$`, 'm'));
  }
  assert.doesNotMatch(config, /^\[\[allowlists\]\]$/m);
  assert.doesNotMatch(config, /commits\s*=|\.gitleaksignore|gitleaks:allow/);
  assert.match(config, /Approved npm package version coordinates/);
});

test('keeps the local hook pinned, staged, redacted, and value-free', () => {
  const hook = read('.githooks/pre-commit');

  assert.match(hook, /node scripts\/check-public-identities\.mjs/);
  assert.match(hook, /gitleaks version/);
  assert.match(hook, /8\.30\.1/);
  assert.match(hook, /gitleaks git --pre-commit/);
  assert.match(hook, /--staged/);
  assert.match(hook, /--redact/);
  assert.match(hook, /--ignore-gitleaks-allow/);
  assert.match(hook, /mktemp/);
  assert.match(hook, /trap .*rm -f/);
  assert.match(hook, /sensitive-data-check: failed/);
  assert.doesNotMatch(hook, /cat .*output|set -x/);
});

test('pins the credential-free Node 24 security workflow and Gitleaks asset', () => {
  const workflow = read('.github/workflows/verify.yml');

  assert.match(workflow, /permissions:\n\s+contents: read/);
  assert.match(workflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /fetch-depth: 0/);
  assert.match(workflow, /actions\/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38/);
  assert.match(workflow, /node-version: 24/);
  assert.match(workflow, /package-manager-cache: false/);
  assert.match(workflow, /gitleaks_8\.30\.1_linux_x64\.tar\.gz/);
  assert.match(workflow, /551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb/);
  assert.match(workflow, /check-public-identities\.mjs "\$BASE_SHA" "\$HEAD_SHA"/);
  assert.match(workflow, /--log-opts="\$BASE_SHA\.\.\$HEAD_SHA"/);
  for (const flag of ['--redact', '--ignore-gitleaks-allow', '--no-banner', '--no-color', '--log-level error']) {
    assert.match(workflow, new RegExp(flag));
  }
  assert.match(workflow, /mktemp/);
  assert.match(workflow, /trap .*rm -f/);
  assert.doesNotMatch(workflow, /upload-artifact|set -x/);
});

test('ignores only local scanner artifacts', () => {
  const gitignore = read('.gitignore');

  for (const entry of ['.local/', '.gitleaks-output/', 'gitleaks']) {
    assert.match(gitignore, new RegExp(`^${entry.replace('.', '\\.')}$`, 'm'));
  }
  assert.doesNotMatch(gitignore, /^\.gitleaks\.toml$/m);
});

#!/usr/bin/env node

const { execa } = require('execa');
const { resolve, join } = require('path');
const { existsSync, mkdirSync, writeFileSync, chmodSync } = require('fs');

const GHCUP_INSTALL_SCRIPT_URL = 'https://get-ghcup.haskell.org';

async function installGhcup() {
  const ghcupDir = resolve(__dirname);
  if (!existsSync(ghcupDir)) {
    mkdirSync(ghcupDir, { recursive: true });
  }

  const installScript = join(ghcupDir, 'install-ghcup.sh');
  const scriptResponse = await execa('curl', ['-sSL', GHCUP_INSTALL_SCRIPT_URL], {
    stdio: 'pipe',
  });

  writeFileSync(installScript, scriptResponse.stdout);
  chmodSync(installScript, 0o755);

  console.log('Installing ghcup...');
  await execa(installScript, [], {
    stdio: 'inherit',
    env: {
    GHCUP_INSTALL_BASE_PREFIX: ghcupDir,
    BOOTSTRAP_HASKELL_NONINTERACTIVE: '1',
    BOOTSTRAP_HASKELL_MINIMAL: '1',
    },
  }).then(({ stdout }) => console.log(stdout));

  await execa(join(ghcupDir, '.ghcup/bin/ghcup'), ['config', 'add-release-channel', 'cross'], {
    stdio: 'inherit',
    env: {
      GHCUP_INSTALL_BASE_PREFIX: ghcupDir
    }
  }).then(({ stdout }) => console.log(stdout));

  console.log(`ghcup installed locally at ${ghcupDir}`);
}

installGhcup();

const { execa } = require('execa');
const { resolve, join } = require('path');
const { existsSync } = require('fs');

const ghcupDir = resolve(__dirname);
const ghcupBin = join(__dirname, '.ghcup/bin/ghcup');

const emsdk_mapping = {
  "9.12.1": "3.1.74"
}

async function run(component, args) {
  const ghcupBinDir = join(__dirname, '.ghcup/bin/');
  const bin = join(ghcupBinDir, component);
  if (!existsSync(bin)) {
    console.error(`${component} not installed, use ghcup-npm install ${component} <version> first`);
    process.exit(1);
  }

  await execa(bin, args, { stdio: 'inherit', env: { PATH: `${ghcupBinDir}:${process.env.PATH}` } });
}

async function install(component, version) {
  console.log(`Installing ${component} ${version} using ghcup at ${ghcupDir}`);

  if (component == 'ghc') {
    const emsdk_version = emsdk_mapping[version];
    if (!emsdk_version) {
      console.error(`Unsupported GHC version: ${version}`);
      process.exit(1);
    }

    console.log(`Activating Emscripten SDK ${emsdk_version}`);
    await execa('emsdk', ['install', emsdk_version], { stdio: 'inherit' });
    await execa('emsdk', ['activate', emsdk_version], { stdio: 'inherit' });

    console.log(`Installing ${component} ${version}`);
    await execa('emconfigure', [ghcupBin, 'install', component, '--set', "javascript-unknown-ghcjs-" + version], { stdio: 'inherit', env: { GHCUP_INSTALL_BASE_PREFIX: ghcupDir } });
  }
  else {
    console.log(`Installing ${component} ${version}`);    
    await execa(ghcupBin, ['install', component, version], { stdio: 'inherit', env: { GHCUP_INSTALL_BASE_PREFIX: ghcupDir } });
  }
}

module.exports = { install, run };

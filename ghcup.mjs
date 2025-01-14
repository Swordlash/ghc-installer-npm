import { execa } from 'execa';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import lodash from 'lodash';

const ghcupDir = resolve(import.meta.dirname);
const ghcupBin = join(import.meta.dirname, '.ghcup/bin/ghcup');

const emsdk_mapping = {
  "9.12.1": "3.1.74"
}

export async function run(component, args = [], opts = {}) {
  const ghcupBinDir = join(import.meta.dirname, '.ghcup/bin/');
  const bin = join(ghcupBinDir, component);
  if (!existsSync(bin)) {
    console.error(`${component} not installed, use ghcup-npm install ${component} <version> first`);
    process.exit(1);
  }

  return execa(bin, args, lodash.merge({ env: { PATH: `${ghcupBinDir}:${process.env.PATH}` } }, opts));
}

export async function install(component, version) {
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
    return execa('emconfigure', [ghcupBin, 'install', component, '--set', "javascript-unknown-ghcjs-" + version], { stdio: 'inherit', env: { GHCUP_INSTALL_BASE_PREFIX: ghcupDir } });
  }
  else {
    console.log(`Installing ${component} ${version}`);    
    return execa(ghcupBin, ['install', component, version], { stdio: 'inherit', env: { GHCUP_INSTALL_BASE_PREFIX: ghcupDir } });
  }
}

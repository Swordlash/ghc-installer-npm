#!/usr/bin/env node

import { program } from 'commander';
import { version } from './package.json';
import { install, run } from './ghcup';

program
  .name('ghc-installer')
  .description('An NPM wrapper for managing GHC, Cabal, and Stack via ghcup')
  .version(version);

program
  .command('install <component> [version]')
  .description('Install & set a GHC, Cabal, or Stack version')
  .action(install);

program
  .command('run <command> [args...]')
  .description('Run installed command (e.g., ghc, cabal, stack)')
  .allowUnknownOption(true)
  .action(run);

program.showHelpAfterError();
program.parse(process.argv);
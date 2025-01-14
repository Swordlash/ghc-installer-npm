# ghc-installer
NPM wrapper for [ghcup-hs](https://github.com/haskell/ghcup-hs).

## Usage

At postinstall, the minimal installation of `ghcup` is being made in your local `node_modules`. 
The library exposes two functions:
```js
// run the given currently-set component (ghc / cabal) with args and additional options for `execa`
async function run(component, args = [], opts = {})

// install and set a given component (ghc / cabal).
async function install(component, version)
```

Note installing `ghc` requires `emsdk/emconfigure` in `PATH`. The needed version is installed and activated accordingly.
Similar functionality is also exposed if you use the package as executable.
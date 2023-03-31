# typescript-transformer-esm

[![ci](https://github.com/carlocorradini/typescript-transformer-esm/actions/workflows/ci.yml/badge.svg)](https://github.com/carlocorradini/typescript-transformer-esm/actions/workflows/ci.yml)

> Inspired by [`@zoltu/typescript-transformer-append-js-extension`](https://github.com/Zoltu/typescript-transformer-append-js-extension) and [`@nvandamme/typescript-transformer-append-js-extension`](https://github.com/nvandamme/typescript-transformer-append-js-extension)

Make `import`/`export` ESM compatible by appending `.js` (_file_) or `/index.js` (_directory_).

Why? TypeScript's issues [`783`](https://github.com/TypeStrong/ts-node/issues/783) and [`16577`](https://github.com/microsoft/TypeScript/issues/16577) have been closed.

## Example

Source (_TypeScript_):

```ts
import a from "./file";
import b from "./directory";
```

Compiled (_JavaScript_):

```js
import a from "./file.js";
import b from "./directory/index.js";
```

## Usage

> **Warning**: Make sure `"module": "esnext"` is present in `tsconfig.json`

> **Note**: Compatible with [`typescript-transform-paths`](https://github.com/LeDDGroup/typescript-transform-paths)

1. Install

   ```sh
   npm install --save-dev typescript-transformer-esm
   ```

1. Install dependencies

   [`ts-patch`](https://github.com/nonara/ts-patch) or [`ttypescript`](https://github.com/cevek/ttypescript)

   - `ts-patch`

     ```sh
     npm install --save-dev ts-patch && npx ts-patch install -s
     ```

   - `ttypescript`

     ```sh
     npm install --save-dev ttypescript
     ```

1. Update `tsconfig.json`

   ```jsonc
   {
     "compilerOptions": {
       "module": "esnext",
       // ...
       "plugins": [
         {
           "transform": "typescript-transformer-esm",
           "after": true
         }
       ]
     }
   }
   ```

1. Compile

   - `ts-patch`

     ```sh
     npx tsc --build tsconfig.json
     ```

   - `ttypescript`

     ```sh
     npx ttsc --build tsconfig.json
     ```

## Contributing

I would love to see your contribution :heart:

See [CONTRIBUTING](./CONTRIBUTING.md) guidelines.

## License

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) License. \
See [LICENSE](./LICENSE) file for details.

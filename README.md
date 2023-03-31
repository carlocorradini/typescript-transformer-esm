# typescript-transformer-esm-modules

> Inspired by [`@zoltu/typescript-transformer-append-js-extension`](https://github.com/Zoltu/typescript-transformer-append-js-extension) and [`@nvandamme/typescript-transformer-append-js-extension`](https://github.com/nvandamme/typescript-transformer-append-js-extension)

<!-- TODO -->

## Usage

1. Install

   ```sh
   npm install --save-dev typescript-transformer-esm-modules
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
       // ...
       "plugins": [
         {
           "transform": "typescript-transformer-esm-modules",
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

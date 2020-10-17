import pkg from "./package.json"
import typescript from "@wessberg/rollup-plugin-ts"
import commonjs from "rollup-plugin-commonjs"
import external from "rollup-plugin-peer-deps-external"
import resolve from "rollup-plugin-node-resolve"

const common = {
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    "react",
    "react-dom",
    "next",
    "fs",
    "path",
  ],
  plugins: [
    external(),
    resolve({ preferBuiltins: true }),
    typescript({
      transformers: [],
    }),
    commonjs({
      include: /node_modules/,
      namedExports: {},
    }),
  ],
}

const lib = {
  input: "./index.ts",
  output: {
    file: pkg["main"],
    exports: "named",
    sourcemap: "true",
    format: "cjs",
  },
  ...common,
}

// eslint-disable-next-line
export default [lib]

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import babel from 'rollup-plugin-babel';
import postcss from "rollup-plugin-postcss";

// const packageJson = require("./package.json");

export default [
  {
    input: "src/components/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "esm"
      },
    ],
    plugins: [
      commonjs(),
      resolve(),
      babel({
        exclude: "node_modules/**"
      }),
      typescript({ tsconfig: "./tsconfig.lib.json" }),
      postcss()
    ],
  },
  {
    input: "dist/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];

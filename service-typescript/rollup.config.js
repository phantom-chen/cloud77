import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";

export default {
    input: 'src/index.ts',
    output: [
        {
            name: 'cloud77',
            file: 'dist/index.js',
            format: 'umd'
        }
    ],
    plugins: [
        typescript(),
        copy({
            targets: [
            { src: 'package.json', dest: 'dist' },
            { src: 'README.md', dest: 'dist' },
            { src: 'assets/**/*', dest: 'dist/assets' }
            ]
        })
    ]
}
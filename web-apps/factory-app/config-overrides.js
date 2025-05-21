const { override, addWebpackPlugin } = require('customize-cra');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = override(
    addWebpackPlugin(
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'node_modules/monaco-editor/min/vs'),
                    to: path.resolve(__dirname, 'public/monaco/vs'),
                },
                {
                    from: path.resolve(__dirname, 'node_modules/monaco-editor/min/vs'),
                    to: path.resolve(__dirname, 'build/monaco/vs'),
                }
            ],
        })
    )
);

import { editor } from 'monaco-editor';
import Editor, { loader, OnChange } from '@monaco-editor/react';

import 'monaco-editor/min/vs/editor/editor.main.css';

loader.config({ paths: { vs: "vs" } });

const Code = `// some comment
// some comment"
// some comment"`;

export function CodeEditor() {
    const OnChangeHandler: OnChange = (value: string | undefined, ev: editor.IModelContentChangedEvent) => {
        console.log(value);
    };

    return (
        <Editor
        height={'300px'}
        theme='vs-dark'
        loading='welcome to ST editor!!!'
        defaultLanguage="javascript"
        defaultValue={Code}
        onChange={OnChangeHandler}
    />
    )
}
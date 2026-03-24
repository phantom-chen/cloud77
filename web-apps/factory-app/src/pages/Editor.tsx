import { editor } from 'monaco-editor';
import Editor, { loader, OnChange } from '@monaco-editor/react';
import { AgGridReact } from 'ag-grid-react';
import { themeBalham } from 'ag-grid-community';
// import 'monaco-editor/min/vs/editor/editor.main.css';
loader.config({ paths: { vs: "monaco/vs" } });
const myTheme = themeBalham.withParams({ accentColor: 'red' });

export function CodeEditor(props: {
    code: string
}) {

    const { code } = props;
    const OnChangeHandler: OnChange = (value: string | undefined, ev: editor.IModelContentChangedEvent) => {
        console.log(value);
    };

    return (
        <Editor
        height={'300px'}
        theme='vs-dark'
        loading='welcome to ST editor!!!'
        defaultLanguage="markdown"
        defaultValue={code}
        onChange={OnChangeHandler}
    />
    )
}

export function GridEditor() {

    const columnDefs = [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" }
    ];

    const rowData = [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000 }
    ];

    return (
        <div
            style={{
                height: '350px',
                width: '100%'
            }}>

            <AgGridReact theme={myTheme} columnDefs={[
                { headerName: "Make", field: "make" },
                { headerName: "Model", field: "model" },
                { headerName: "Price", field: "price" }
            ]} rowData={rowData}>
            </AgGridReact>
        </div>
    )
}
import { AgGridReact } from 'ag-grid-react';

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
        <div className="ag-theme-alpine"
            style={{
                height: '600px',
                width: '100%'
            }}>

            <AgGridReact columnDefs={[
                { headerName: "Make", field: "make" },
                { headerName: "Model", field: "model" },
                { headerName: "Price", field: "price" }
            ]} rowData={rowData}>
            </AgGridReact>
        </div>
    )
}
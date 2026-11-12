import { Button } from "@mui/material";
import { getFiles, getGateway, uploadFile } from "../models/service";
import { useState, useRef } from "react";

export default function Files() {

    const [files, setFiles] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    return <div>
        <p>Files</p>
        <input ref={fileRef} type='file' style={{ height: '100px', border: "1px solid black" }} placeholder='upload file' />
        <Button onClick={() => {
            getGateway().then(res => console.log(res));
            getFiles().then(res => setFiles(res));
        }}>
            Files
        </Button>

        <button onClick={(e) => {
            if (!fileRef.current?.files) {
                return;
            }
            const file = fileRef.current?.files[0];
            const data = new FormData();
            data.append('file', file);
            uploadFile(data);
        }}>Upload file</button>
        <ul>
            {
                files.map((f, i) => <li key={i}>{f}</li>)
            }
        </ul>
    </div>;
}
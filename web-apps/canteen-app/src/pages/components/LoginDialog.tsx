import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export interface LoginDialogProps {
    open: boolean,
    onClose: (userName: string, password: string) => void
}

export function LoginDialog(props: LoginDialogProps) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setUserName('');
    }, []);

    return (
        <Dialog open={props.open} maxWidth='xs' fullWidth style={{ width: '100%' }}>
            <DialogTitle>Login</DialogTitle>
            <TextField label="User Name" variant="standard" value={userName} onChange={e => setUserName(e.target.value)} />
            <TextField label="Password" variant="standard" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <Button variant="contained" onClick={() => {
                props.onClose(userName, password);
            }}>Submit</Button>
        </Dialog>
    )
}
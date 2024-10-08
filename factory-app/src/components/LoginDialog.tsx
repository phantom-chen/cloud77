import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export interface LoginDialogProps {
    open: boolean,
    onClose: (email: string, password: string) => void
}

export function LoginDialog(props: LoginDialogProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setEmail(localStorage.getItem('email') || '');
    }, []);

    return (
        <div style={{width:'500px', margin: '2px'}}>
            <Dialog open={props.open} style={{width:'100%'}}>
                <DialogTitle>Login</DialogTitle>
                <TextField label="Email" variant="standard" value={email} onChange={e => setEmail(e.target.value)}/>
                <TextField label="Password" variant="standard" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                <Button variant="contained" onClick={() => {
                    props.onClose(email, password);
                }}>Submit</Button>
            </Dialog>
        </div>
    )
}
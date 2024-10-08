import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { UserAccount } from "@phantom-chen/cloud77";
import { getAccounts } from "../services/manager";

export default function Users() {

    const [accounts, setAccounts] = useState<UserAccount[]>([]);
    const [size, setSize] = useState<number>(5);
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        getAccounts(page, size).then(res => setAccounts(res.data));
    }, [page, size])

    return (
        <>
            <Button onClick={() => {
                
            }}>Query</Button>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Confirmed</TableCell>
                        <TableCell align="right">Has Profile</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {accounts.map((row) => (
                        <TableRow
                        key={row.email}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.email}
                        </TableCell>
                        <TableCell align="right">{row.confirmed}</TableCell>
                        <TableCell align="right">{row.profile ? 'true' : 'false'}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                    component="div"
                    count={9999}
                    page={page}
                    rowsPerPage={size}
                    rowsPerPageOptions={[5,10,15,20]}
                    onRowsPerPageChange={(event) => { setSize(Number(event.target.value))}}
                    onPageChange={(event, newPage) => { setPage(newPage)}}
                    />
        </>
    )
}
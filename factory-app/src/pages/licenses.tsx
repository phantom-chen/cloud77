
import { useEffect, useState } from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, IconButton, TextField, FormControl, MenuItem, Select } from "@mui/material";
import { RefreshOutlined } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import { useDebounce } from "ahooks";
import { getLicenses, UserLicense } from "../services/manager";

export default function Licenses() {

    const [licenses, setLicenses] = useState<UserLicense[]>([]);
    const [query, setQuery] = useState<{
        page: number,
        size: number,
        email: string
    }>({
        page: 0,
        size: 5,
        email: ""
    });
    const [queryEmail, setQueryEmail] = useState('');
    const [queryScope, setQueryScope] = useState('cooling');
    const debouncedValue = useDebounce(queryEmail, { wait: 500 });

    useEffect(() => {
        getLicenses(query).then(res => setLicenses(res));
    }, [query])

    useEffect(() => {
        setQuery(q => Object.assign({}, q, { email: debouncedValue }));
    }, [debouncedValue])

    return (
        <>
            <div>
                <IconButton
                    size="large"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => {
                        setLicenses([]);
                        getLicenses(query).then(res => setLicenses(res));
                    }}
                    >
                    <RefreshOutlined/>
                </IconButton>
            </div>
            <div>
                <p>Query</p>
                <TextField label='Email' value={queryEmail}
                    onChange={(e) => setQueryEmail(e.target.value)}
                    />
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <Select value={queryScope} onChange={e => setQueryScope(e.target.value)}>
                        <MenuItem value=''>None</MenuItem>
                        <MenuItem value='cooling'>Cooling</MenuItem>
                        <MenuItem value='heating'>Heating</MenuItem>
                        <MenuItem value='cooling-irf'>Cooling IRF</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Template</TableCell>
                        <TableCell align="right">Region</TableCell>
                        <TableCell align="right">Scope</TableCell>
                        <TableCell align="right">State</TableCell>
                        <TableCell align="right">Edit</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {licenses.map((row) => (
                        <TableRow
                        key={row.email}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.email}
                        </TableCell>
                        <TableCell align="right">{row.license.template}</TableCell>
                        <TableCell align="right">{row.license.region}</TableCell>
                        <TableCell align="right">{row.license.scope}</TableCell>
                        <TableCell align="right">{row.license.state}</TableCell>
                        <TableCell align="right">
                            <IconButton onClick={() => {
                                console.log(row);
                                console.log("go to /users/123@.com" + row.email);
                            }}>
                                <EditIcon />
                            </IconButton>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                    component="div"
                    count={9999}
                    page={query.page}
                    rowsPerPage={query.size}
                    rowsPerPageOptions={[5,10,15,20]}
                    onRowsPerPageChange={(event) => { setQuery(
                        Object.assign({}, query, { size: Number(event.target.value) })
                    )}}
                    onPageChange={(event, newPage) => {
                        setQuery(Object.assign({}, query, { page: newPage }))
                    }}
                    />            
        </>
    )
}
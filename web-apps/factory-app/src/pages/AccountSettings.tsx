import { Box, Container, TextField, Typography } from "@mui/material";

const AccountSettings: React.FC = () => {

    return (
        <div className="account-settings">
            <div className="account-settings-container">
                <div className="account-settings-header">
                    <div style={{ display: 'flex' }}>
                        <Container maxWidth="sm">
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h4" component="h1" gutterBottom>
                                    Account Settings
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Box>
                        </Container>

                    </div>
                </div>
            </div>
        </div>
    )
};

export default AccountSettings;
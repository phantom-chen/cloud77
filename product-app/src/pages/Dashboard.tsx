import { Card, CardHeader, CardContent, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const SettingsButton = () => (
    <Link component={RouterLink} to="/settings">
        Settings
    </Link>
);

export function Dashboard() {

    return (
        <>
            <p>dashboard works</p>
            <Card>
                <CardHeader title="Welcome to Admin App" />
                <CardContent>Lorem ipsum sic dolor amet... <SettingsButton /></CardContent>
            </Card>
        </>
    )
}
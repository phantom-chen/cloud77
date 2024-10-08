import "@react-sigma/core/lib/react-sigma.min.css";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";

const drawerWidth = 240;
const navItems = ['Home', 'Login', 'Diagram', 'Dashboard'];

export function DrawerAppBar() {

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {
          navItems.map((item) => (
          <ListItem key={item}>
              <ListItemButton sx={{ textAlign: 'center' }} onClick={() => console.log("button works")}>
                <Link to={item}>
                  <ListItemText primary={item} />
                </Link>
              </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'none' }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              MUI
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {
                navItems.map((item) => (
                  <Button key={item} sx={{ color: '#fff' }}>
                    <Link to={item.toLowerCase()}>{item}</Link>
                  </Button>
                ))}
            </Box>
          </Toolbar>
        </AppBar>
        {/* <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={true}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box> */}
      </Box>
    </>
  );
}

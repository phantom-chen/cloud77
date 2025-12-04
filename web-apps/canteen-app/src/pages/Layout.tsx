import { Box, Typography, Divider, List, ListItem, ListItemButton, ListItemText, CssBaseline, AppBar, Button, Toolbar, Drawer, IconButton, Badge, Menu, MenuItem } from "@mui/material"
import React, { PropsWithChildren, useState } from "react"
import { AccountCircle, AddBoxOutlined, ArrowBackOutlined, ArrowDownward, ArrowUpward, MailOutline, MenuOutlined, Notifications } from '@mui/icons-material'
import { Link, useNavigate } from "react-router-dom"
import MenuIcon from '@mui/icons-material/Menu';

const navItems = ['Item 1', 'Item 2', 'Item 3'];
const drawerWidth = 240;

const Items: { label: string, link: string, divider?: boolean }[] = [
  { label: 'Home', link: '' },
  { label: 'Login', link: '/login' },
  { label: 'Diagram', link: '/diagram' },
  { label: 'Live Data', link: '/live-data' },
  { label: "", link: "", divider: true },
  { label: 'Sample', link: '/sample' },
  { label: 'Files', link: '/files' },
  { label: "", link: "", divider: true },
  { label: 'Graph', link: '/graph' },
  { label: "", link: "", divider: true },
  { label: 'Dashboard', link: '/dashboard' },
]

const MyDrawer: React.FC<{ onClose: () => void }> = (props: { onClose: () => void }) => {
    const navigate = useNavigate();
    const { onClose } = props;
    return <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ my: 2 }}>
            MUI MUI MUI
        </Typography>
        <Divider />
        <List>
            {
                navItems.map((item) => (
                    <ListItem key={item}>
                        <ListItemButton sx={{ textAlign: 'center' }} onClick={() => onClose()}>
                            <Link to={item}>
                                <ListItemText primary={item} />
                            </Link>
                        </ListItemButton>
                    </ListItem>
                ))}
        </List>
        <Divider />
        <nav>
            <List style={{ width: '240px', border: '1px solid rgb(224, 224, 224)' }}>
                {
                    Items.map((v, i) => {
                        if (v.divider) {
                            return <Divider key={i} />
                        } else {
                            return <ListItem key={i}>
                                <ListItemButton selected={v.link === location.pathname}>
                                    <ListItemText primary={v.label} onClick={() => {
                                        onClose();
                                        navigate(v.link)
                                    }} />
                                </ListItemButton>
                            </ListItem>
                        }
                    })
                }
            </List>
        </nav>
    </Box>
}

const ParentComponent = (props: PropsWithChildren) => {

    return (
        <div>
            <p>parent component</p>
            {props.children}
        </div>
    )
}

export default function Layout() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlerDrawer = () => { 
        setOpen(!open);
    }

    const [open, setOpen] = useState(false);

    return <>
        <Box>
            <CssBaseline />

            <AppBar position="static" component="nav">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}>
                        <AddBoxOutlined />
                    </IconButton>

                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handlerDrawer}
                    >
                        <MenuIcon />
                    </IconButton>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        sx={{ mr: 2 }}
                        onClick={handlerDrawer}
                    >
                        <MenuOutlined />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        MUI
                    </Typography>

                    <Button sx={{ color: '#fff' }}>
                        Button
                    </Button>

                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={handleMenu}
                    >
                        <AccountCircle />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '10px' }}>
                            User
                        </Typography>
                    </IconButton>

                    <IconButton>
                        <ArrowBackOutlined />
                    </IconButton>

                    <IconButton>
                        <Badge badgeContent='3' color="secondary">
                            <MailOutline />
                        </Badge>
                    </IconButton>

                    <IconButton>
                        <Badge badgeContent='3' color="warning">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {
                            navItems.map((item) => (
                                <Button key={item} sx={{ color: '#fff' }}>
                                    <Link to={item.toLowerCase()}>{item}</Link>
                                </Button>
                            ))}
                    </Box>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Menu 1</MenuItem>
                        <MenuItem>Menu 2</MenuItem>
                        <MenuItem>Menu 3</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={open}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        // display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <MyDrawer onClose={() => setOpen(false)}/>
                </Drawer>
                <div>
                    <p>layout works</p>
                    <p>layout page works</p>
                    <p>layout page works</p>
                    <p>layout page works</p>

                    <p>
                        <a
                            href="/contact"
                            onClick={(event) => {
                                // stop the browser from changing the URL and requesting the new document
                                event.preventDefault();
                                // push an entry into the browser history stack and change the URL
                                window.history.pushState({}, '', "/contact");
                            }}>contact</a>
                    </p>

                    <Link to="/user">
                        <Button variant="contained">Direct to /user</Button>
                    </Link>

                    <ParentComponent>
                        <p>children component</p>
                    </ParentComponent>

                    <div>
                        <ArrowDownward />
                        <ArrowUpward />
                    </div>
                </div>

            </Box>
        </Box>
    </>
}
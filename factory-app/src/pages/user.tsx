import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import { getAccount, getFiles, uploadFile, UserAccount } from "../services/user";
import { getUserLogs } from "../services/manager";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { AppBar, Avatar, Box, Button, Chip, Container, IconButton, Menu, MenuItem, TextField, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { deepPurple } from "@mui/material/colors";
import { Profile } from "@phantom-chen/cloud77";
import { verifyToken } from "../services/gateway";
import { AccountCircle } from "@mui/icons-material";

const Items: { label: string, link: string, divider?: boolean }[] = [
  { label: 'Account', link: '/account' },
  { label: 'Task', link: '/tasks' },
  { label: 'Post', link: '/posts' },
  { label: 'File', link: '/files' },
];

function UserProfile(props: { profile: Profile }) {
  const { profile } = props;

  return (
    <div>
      <TextField label="Surname" value={profile.surname} variant="outlined" />
      <TextField label="Surname" value={profile.givenName} variant="outlined" />
      <TextField label="Surname" value={profile.company} variant="outlined" />
      <TextField label="Surname" value={profile.companyType} variant="outlined" />
      <TextField label="Surname" value={profile.title} variant="outlined" />
      <TextField label="Surname" value={profile.city} variant="outlined" />
    </div>
  )
}

export default function User() {

  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [value, setValue] = useState('profile');
  const [account, setAccount] = useState<UserAccount | undefined>();
  const [files, setFiles] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const fileRef = useRef<HTMLInputElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!localStorage.getItem('email') && localStorage.getItem('accessToken')) {
      verifyToken().then(res => {
        localStorage.setItem('email', res.email);
        setEmail(res.email);
      })
    } else {
      setEmail(localStorage.getItem('email') || '');
    }
  }, []);

  useEffect(() => {
    if (email !== '') {
      console.log(email);
      getAccount(email).then(res => setAccount(res));    
    }
  }, [email])

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My Account
            </Typography>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
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
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem onClick={() => {
                  setAnchorEl(null);
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  navigate('/login');
                }}>Logout</MenuItem>
              </Menu>
          </Toolbar>
        </AppBar>
      </Box>

      <Container>
        <TextField sx={{minWidth:'300px',marginTop:'10px'}} disabled label="Email" value={account?.email || ''} variant="outlined" />
        <Avatar sx={{ bgcolor: deepPurple[500] }}>{account?.email.slice(0, 1)}</Avatar>
        <Chip label={account?.role || ''} variant="outlined" />
        <Chip label={account?.confirmed ? "confirmed" : "unconfirmed"} />
      </Container>

      <Container>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={(e, v) => setValue(v)} aria-label="lab API tabs example">
              <Tab label="Profile" value="profile" />
              <Tab label="Files" value="files" />
              <Tab label="Posts" value="posts" />
              <Tab label="Tasks" value="tasks" />
            </TabList>
          </Box>

          <TabPanel value="profile">
            <div style={{ margin: '20px' }}>
              {
                account?.profile ? <UserProfile profile={account?.profile} /> : undefined
              }
              <Button>
                Update
              </Button>
            </div>
          </TabPanel>

          <TabPanel value="files">
            <div>
              <input ref={fileRef} type='file' style={{ height: '100px', border: "1px solid black" }} placeholder='upload file' />
              <Button onClick={() => {
                getFiles(localStorage.getItem('email') || '').then(res => setFiles(res));
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
                uploadFile(localStorage.getItem('email') || '', data);
              }}>Upload file</button>
              <ul>
                {
                  files.map((f, i) => <li key={i}>{f}</li>)
                }
              </ul>
            </div>
          </TabPanel>
        </TabContext>
      </Container>


      <div>
        {/* <p>{email}</p> */}
        {/* <nav>
          <List style={{ width: '240px', border: '1px solid rgb(224, 224, 224)' }}>
            {
              Items.map((v,i) => {
                if (v.divider) {
                  return <Divider key={i} />
                } else {
                  return <ListItem key={i}>
                  <ListItemButton selected={v.link === location.pathname}>
                    <ListItemText primary={v.label} onClick={() => navigate(v.link)} />
                  </ListItemButton>
                </ListItem>
                }
              })
            }
          </List>
        </nav> */}
      </div>

    </>
  )
}
import { Box, Button, Container, Dialog, DialogTitle, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupIcon from '@mui/icons-material/Group';

import './Rooms.css';
import { defaultChatRoom, IChatRoom } from "../../models/chat-room";

export function Rooms(props: {
    rooms: IChatRoom[],
    getRooms: () => void,
    addRoom: (room: IChatRoom) => void,
    removeRoom: (id: string, room: string) => void,
    joinRoom?: (id: string, room: string) => void
}) {
    const { rooms, getRooms, addRoom, removeRoom, joinRoom } = props;
    const [roomInput, setRoomInput] = useState<IChatRoom>(defaultChatRoom);
    // const [rooms, setRooms] = useState<IChatRoom[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newRoom, setNewRoom] = useState('');

    useEffect(() => {
        getRooms();
    }, []);

    return (
        <div>
            <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', paddingBottom: '10px' }}>
                <Typography variant="h6" component='div'>Rooms</Typography>
                <IconButton onClick={() => {
                    // onCreateRoom(room);
                    // addRoom(roomInput);
                    getRooms();
                    setDialogOpen(true);
                }}>
                    <AddIcon />
                </IconButton>
            </Container>

            {
                rooms.length === 0 ? <Typography variant="h6" component='div'>please create your room.</Typography> : undefined
            }

            <List className="chat-rooms">
                {
                    rooms.map((r, i) => {
                        return <Box key={i} sx={{display:'flex'}} className="chat-room">
                            <ListItem>
                                <ListItemText primary={r.name} secondary={r.description} />
                            </ListItem>

                            <div style={{display:'flex',margin:'auto'}}>
                                <GroupIcon />
                                <span>999</span>
                            </div>

                            <div style={{display:'flex',margin:'auto'}}>
                                <IconButton onClick={(() => {
                                    // onJoinRoom(r);
                                    // join the room
                                    // socketRef.current?.emit('join-room', { token: sessionStorage.getItem('canteen_socket_session_token'), room: roomInput });
                                })}>
                                    <GroupsIcon />
                                </IconButton>
                                <IconButton onClick={() => {
                                    // onDeleteRoom(r);
                                    // remove the room
                                    // socketRef.current?.emit('remove-room', { token: sessionStorage.getItem('canteen_socket_session_token'), room: roomInput });
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </Box>
                    })
                }
            </List>
            
            <Dialog open={dialogOpen} maxWidth='xs' fullWidth style={{ width: '100%' }}>
                <Container sx={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px', paddingBottom: '20px' }}>
                    <DialogTitle>New Room</DialogTitle>
                    <TextField label="New room name" variant="standard" value={roomInput.name} onChange={e => {
                        setRoomInput(r => { return { ...r, name: e.target.value } })
                    }} />
                    <TextField label="Description" variant="standard" />
                    <TextField label="Capacity" variant="standard" />
                    <TextField label="Location" variant="standard" />
                    <TextField label="Amenities" variant="standard" />
                    <TextField label="Features" variant="standard" />
                    <TextField label="Monday Hours" variant="standard" />
                    <TextField label="Tuesday Hours" variant="standard" />
                    <TextField label="Wednesday Hours" variant="standard" />
                    <TextField label="Thursday Hours" variant="standard" />
                    <TextField label="Friday Hours" variant="standard" />
                    <TextField label="Saturday Hours" variant="standard" />
                    <TextField label="Sunday Hours" variant="standard" />                    
                    <Container>
                        <Button variant="contained" onClick={() => {
                            setDialogOpen(false);
                            console.log(roomInput);
                            addRoom(roomInput);
                        }}>Submit</Button>
                        <Button variant="outlined" onClick={() => {
                            setDialogOpen(false);
                        }}>Cancel</Button>
                    </Container>
                </Container>
            </Dialog>
        </div>
    );
}
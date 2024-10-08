import { Box, Container, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material"
import './ChatRoom.css';
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupIcon from '@mui/icons-material/Group';

export function ChatRoom(props: {
    rooms: string[],
    onCreateRoom:(room: string) => void, 
    onJoinRoom: (room: string) => void,
    onDeleteRoom: (room: string) => void
}) {
    const { rooms, onCreateRoom, onDeleteRoom, onJoinRoom } = props;
    const [room, setRoom] = useState<string>('');
    
    return (
        <>
            <Typography variant="h6" component='div'>Rooms</Typography>
            <Container>
                <TextField variant="standard" value={room} placeholder="type your room name" onChange={e => setRoom(e.target.value)} />
                <IconButton onClick={() => {
                    onCreateRoom(room);
                }}>
                    <AddIcon />
                </IconButton>
            </Container>
            {
                rooms.length === 0 ? <p>please create your room.</p> : undefined
            }
            <List className="chat-rooms">
                {
                    rooms.map((r, i) => {
                        return <Box key={i} sx={{display:'flex'}} className="chat-room">
                            <ListItem>
                                <ListItemText primary={r} secondary={'room description "wip"'} />
                            </ListItem>

                            <div style={{display:'flex',margin:'auto'}}>
                                <GroupIcon />
                                <span>999</span>
                            </div>
                            <div style={{display:'flex',margin:'auto'}}>
                                <IconButton onClick={(() => {
                                    onJoinRoom(r);
                                })}>
                                    <GroupsIcon />
                                </IconButton>
                                <IconButton onClick={() => {
                                    onDeleteRoom(r);
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </Box>
                    })
                }
            </List>
        </>
    )
}
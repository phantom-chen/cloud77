import { Avatar, Card, CardContent, CardHeader, Grid, List, ListItem, Link, ListItemButton, ListItemIcon, ListItemText, Paper, styled } from "@mui/material";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const data = [
    { name: "Page A", uv: 590, pv: 800, amt: 1400 },
    { name: "Page B", uv: 868, pv: 967, amt: 1506 },
    { name: "Page C", uv: 1397, pv: 1098, amt: 989 },
    { name: "Page D", uv: 1480, pv: 1200, amt: 1228 },
    { name: "Page E", uv: 1520, pv: 1108, amt: 1100 },
    { name: "Page F", uv: 1400, pv: 680, amt: 1700 }
];

const data2 = [
    { pv: 2400 },
    { pv: 1398 },
    { pv: 9800 },
    { pv: 3908 },
    { pv: 4800 },
    { pv: 3490 },
    { pv: 4300 }
];

const data3 = [
    { name: "Jan", uv: 3700 },
    { name: "Feb", uv: 3000 },
    { name: "Mar", uv: 2000 },
    { name: "Apr", uv: 2780 },
    { name: "May", uv: 2000 },
    { name: "Jun", uv: 1800 },
    { name: "Jul", uv: 2600 },
    { name: "Aug", uv: 2900 },
    { name: "Sep", uv: 3500 },
    { name: "Oct", uv: 3000 },
    { name: "Nov", uv: 2400 },
    { name: "Dec", uv: 2780 }
];

const data4 = [
    { name: "Chrome", value: 800, color: 'cyan', icon: <SendIcon /> },
    { name: "Firefox", value: 300, color: 'pink', icon: <DraftsIcon /> },
    { name: "Safari", value: 300, color: 'purple', icon: <InboxIcon /> }
];

export function AdminDashboard() {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Item>
                        <div style={{ height: '450px', textAlign: 'center' }}>
                            <ResponsiveContainer>
                                <ComposedChart
                                    layout="vertical"
                                    width={600}
                                    height={320}
                                    data={data}
                                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                >
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip />
                                    <Legend />
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <Area dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                                    <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                                    <Line dataKey="uv" stroke="#ff7300" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>
                        <div style={{
                            height: 300,
                            textAlign: 'center'
                        }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        innerRadius={80}
                                        outerRadius={130}
                                        data={data4}
                                        fill="#8884d8" dataKey={"value"}>
                                        {data4.map(item => (
                                            <Cell key={item.name} fill={item.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <List>
                                {data4.map(item => (
                                    <ListItemButton key={item.name}>
                                        <ListItemIcon>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </div>
                    </Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>xs=6</Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>xs=6</Item>
                </Grid>
                <Grid item xs={4}>
                    <Item>xs=4</Item>
                </Grid>
                <Grid item xs={8}>
                    <Item>xs=8</Item>
                </Grid>
            </Grid>

            <div style={{
                height: '95px',
                padding: '5px 15px 0 15px'
            }}>
                <ResponsiveContainer>
                    <LineChart data={data2}>
                        <Line
                            type="monotone"
                            dataKey="pv"
                            stroke="#8884d8"
                            strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "95%",
                height: 85
            }}>
                <ResponsiveContainer>
                    <BarChart data={data3}>
                        <Bar dataKey="uv" fill={'pink'} />
                        <XAxis dataKey="name" stroke="none" tick={{ fill: 'white' }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </>
    )
}

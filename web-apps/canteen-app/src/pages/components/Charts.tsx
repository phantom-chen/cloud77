import { Grid, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, Bar, Line, PieChart, Pie, Cell, BarChart, LineChart } from "recharts"
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import Item from "./Item";
import { PVData, UVData } from "../../data";

const data = [
    { name: "Page A", uv: 590, pv: 800, amt: 1400 },
    { name: "Page B", uv: 868, pv: 967, amt: 1506 },
    { name: "Page C", uv: 1397, pv: 1098, amt: 989 },
    { name: "Page D", uv: 1480, pv: 1200, amt: 1228 },
    { name: "Page E", uv: 1520, pv: 1108, amt: 1100 },
    { name: "Page F", uv: 1400, pv: 680, amt: 1700 }
];

const data4 = [
    { name: "Chrome", value: 800, color: 'cyan', icon: <SendIcon /> },
    { name: "Firefox", value: 300, color: 'pink', icon: <DraftsIcon /> },
    { name: "Safari", value: 300, color: 'purple', icon: <InboxIcon /> }
];

export function Charts() {

    return (
        <>
            <div style={{
                height: '95px',
                padding: '5px 15px 0 15px'
            }}>
                <ResponsiveContainer>
                    <LineChart data={PVData}>
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
                    <BarChart data={UVData}>
                        <Bar dataKey="uv" fill={'pink'} />
                        <XAxis dataKey="name" />
                        {/* stroke="none" tick={{ fill: 'white' }} */}
                        <YAxis />
                    </BarChart>
                </ResponsiveContainer>
            </div>
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
            </Grid>
        </>
    )
}
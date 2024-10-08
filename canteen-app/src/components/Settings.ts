

export const todos = ['task1', 'task2'];

const products = [
    {
      id: 1,
      title: "Samsung TV",
      text: "Samsung 32 1080p 60Hz LED Smart HDTV."
    },
    { id: 2, title: "Playstation 4", text: "PlayStation 3 500 GB System" },
    {
      id: 3,
      title: "Apple iPhone 6",
      text: "Apple iPhone 6 Plus 16GB Factory Unlocked GSM 4G "
    },
    {
      id: 4,
      title: "Apple MacBook",
      text: "Apple MacBook Pro MD101LL/A 13.3-Inch Laptop"
    }
  ];

  const messages = [
    {
      id: 0,
      variant: "warning",
      name: "Jane Hew",
      message: "Hey! How is it going?",
      time: "9:32",
    },
    {
      id: 1,
      variant: "success",
      name: "Lloyd Brown",
      message: "Check out my new Dashboard",
      time: "9:18",
    },
    {
      id: 2,
      variant: "primary",
      name: "Mark Winstein",
      message: "I want rearrange the appointment",
      time: "9:15",
    },
    {
      id: 3,
      variant: "secondary",
      name: "Liana Dutti",
      message: "Good news from sale department",
      time: "9:09",
    },
];
  
const notifications = [
    { id: 0, color: "warning", message: "Check out this awesome ticket" },
    {
      id: 1,
      color: "success",
      type: "info",
      message: "What is the best way to get ...",
    },
    {
      id: 2,
      color: "secondary",
      type: "notification",
      message: "This is just a simple notification",
    },
    {
      id: 3,
      color: "primary",
      type: "e-commerce",
      message: "12 new orders has arrived today",
    },
];

const lineChartData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const pieChartData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const datatableData = [
  ["Joe James", "Example Inc.", "Yonkers", "NY"],
  ["John Walsh", "Example Inc.", "Hartford", "CT"],
  ["Bob Herm", "Example Inc.", "Tampa", "FL"],
  ["James Houston", "Example Inc.", "Dallas", "TX"],
  ["Prabhakar Linwood", "Example Inc.", "Hartford", "CT"],
  ["Kaui Ignace", "Example Inc.", "Yonkers", "NY"],
  ["Esperanza Susanne", "Example Inc.", "Hartford", "CT"],
  ["Christian Birgitte", "Example Inc.", "Tampa", "FL"],
  ["Meral Elias", "Example Inc.", "Hartford", "CT"],
  ["Deep Pau", "Example Inc.", "Yonkers", "NY"],
  ["Sebastiana Hani", "Example Inc.", "Dallas", "TX"],
  ["Marciano Oihana", "Example Inc.", "Yonkers", "NY"],
  ["Brigid Ankur", "Example Inc.", "Dallas", "TX"],
  ["Anna Siranush", "Example Inc.", "Yonkers", "NY"],
  ["Avram Sylva", "Example Inc.", "Hartford", "CT"],
  ["Serafima Babatunde", "Example Inc.", "Tampa", "FL"],
  ["Gaston Festus", "Example Inc.", "Tampa", "FL"],
];

const mock = {
  tasks: [
      {
        id: 0,
        type: "Meeting",
        title: "Meeting with Andrew Piker",
        time: "9:00"
      },
      {
        id: 1,
        type: "Call",
        title: "Call with HT Company",
        time: "12:00"
      },
      {
        id: 2,
        type: "Meeting",
        title: "Meeting with Zoe Alison",
        time: "14:00"
      },
      {
        id: 3,
        type: "Interview",
        title: "Interview with HR",
        time: "15:00"
      }
    ],
    bigStat: [
      {
        product: "Light Blue",
        total: {
          monthly: 4232,
          weekly: 1465,
          daily: 199,
          percent: { value: 3.7, profit: false }
        },
        color: "primary",
        registrations: {
          monthly: { value: 830, profit: false },
          weekly: { value: 215, profit: true },
          daily: { value: 33, profit: true }
        },
        bounce: {
          monthly: { value: 4.5, profit: false },
          weekly: { value: 3, profit: true },
          daily: { value: 3.25, profit: true }
        }
      },
      {
        product: "Sing App",
        total: {
          monthly: 754,
          weekly: 180,
          daily: 27,
          percent: { value: 2.5, profit: true }
        },
        color: "warning",
        registrations: {
          monthly: { value: 32, profit: true },
          weekly: { value: 8, profit: true },
          daily: { value: 2, profit: false }
        },
        bounce: {
          monthly: { value: 2.5, profit: true },
          weekly: { value: 4, profit: false },
          daily: { value: 4.5, profit: false }
        }
      },
      {
        product: "RNS",
        total: {
          monthly: 1025,
          weekly: 301,
          daily: 44,
          percent: { value: 3.1, profit: true }
        },
        color: "secondary",
        registrations: {
          monthly: { value: 230, profit: true },
          weekly: { value: 58, profit: false },
          daily: { value: 15, profit: false }
        },
        bounce: {
          monthly: { value: 21.5, profit: false },
          weekly: { value: 19.35, profit: false },
          daily: { value: 10.1, profit: true }
        }
      }
    ],
    notifications: [
      {
        id: 0,
        icon: "thumbs-up",
        color: "primary",
        content:
          'Ken <span className="fw-semi-bold">accepts</span> your invitation'
      },
      {
        id: 1,
        icon: "file",
        color: "success",
        content: "Report from LT Company"
      },
      {
        id: 2,
        icon: "envelope",
        color: "danger",
        content: '4 <span className="fw-semi-bold">Private</span> Mails'
      },
      {
        id: 3,
        icon: "comment",
        color: "success",
        content: '3 <span className="fw-semi-bold">Comments</span> to your Post'
      },
      {
        id: 4,
        icon: "cog",
        color: "light",
        content: 'New <span className="fw-semi-bold">Version</span> of RNS app'
      },
      {
        id: 5,
        icon: "bell",
        color: "info",
        content:
          '15 <span className="fw-semi-bold">Notifications</span> from Social Apps'
      }
    ],
    table: [
      {
        id: 0,
        name: "Mark Otto",
        email: "ottoto@wxample.com",
        product: "ON the Road",
        price: "$25 224.2",
        date: "11 May 2017",
        city: "Otsego",
        status: "Sent"
      },
      {
        id: 1,
        name: "Jacob Thornton",
        email: "thornton@wxample.com",
        product: "HP Core i7",
        price: "$1 254.2",
        date: "4 Jun 2017",
        city: "Fivepointville",
        status: "Sent"
      },
      {
        id: 2,
        name: "Larry the Bird",
        email: "bird@wxample.com",
        product: "Air Pro",
        price: "$1 570.0",
        date: "27 Aug 2017",
        city: "Leadville North",
        status: "Pending"
      },
      {
        id: 3,
        name: "Joseph May",
        email: "josephmay@wxample.com",
        product: "Version Control",
        price: "$5 224.5",
        date: "19 Feb 2018",
        city: "Seaforth",
        status: "Declined"
      },
      {
        id: 4,
        name: "Peter Horadnia",
        email: "horadnia@wxample.com",
        product: "Let's Dance",
        price: "$43 594.7",
        date: "1 Mar 2018",
        city: "Hanoverton",
        status: "Sent"
      }
    ]
};
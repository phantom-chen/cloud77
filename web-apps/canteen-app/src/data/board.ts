export const board1 = {
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

export const board2 = {
    menus: [

    ],
    tablePage: {
        items: [
            { id: 1, name: "Product 1", price: "$50.00", category: "Category 1" },
            { id: 2, name: "Product 2", price: "$150.00", category: "Category 2" },
            { id: 3, name: "Product 3", price: "$250.00", category: "Category 3" },
            { id: 4, name: "Product 4", price: "$70.00", category: "Category 4" },
            { id: 5, name: "Product 5", price: "$450.00", category: "Category 5" },
            { id: 6, name: "Product 6", price: "$950.00", category: "Category 6" },
            { id: 7, name: "Product 7", price: "$550.00", category: "Category 7" },
            { id: 8, name: "Product 8", price: "$750.00", category: "Category 8" },
            { id: 9, name: "Product 6", price: "$950.00", category: "Category 6" },
            { id: 10, name: "Product 7", price: "$550.00", category: "Category 7" },
            { id: 11, name: "Product 8", price: "$750.00", category: "Category 8" }
        ]
    },
    dashBoardPage: {
        recentProducts: [
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
        ],
        monthlySales: [
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
        ],
        newOrders: [
            { pv: 2400 },
            { pv: 1398 },
            { pv: 9800 },
            { pv: 3908 },
            { pv: 4800 },
            { pv: 3490 },
            { pv: 4300 }
        ],
        lineBarChart: [
            { name: "Page A", uv: 590, pv: 800, amt: 1400 },
            { name: "Page B", uv: 868, pv: 967, amt: 1506 },
            { name: "Page C", uv: 1397, pv: 1098, amt: 989 },
            { name: "Page D", uv: 1480, pv: 1200, amt: 1228 },
            { name: "Page E", uv: 1520, pv: 1108, amt: 1100 },
            { name: "Page F", uv: 1400, pv: 680, amt: 1700 }
        ]
    }
};

export const board3 =
{
    "token": {
        "access_token": "fake-token-12345789-abcdefgh",
        "user": {
            "firstName": "Admin",
            "lastName": "",
            "email": "admin@test.com",
            "password": "password"
        }
    },
    "customers": [
        {
            "membership": false,
            "mobile": "555-555-555",
            "rewards": 21,
            "id": 2,
            "firstName": "Larsen",
            "lastName": "Shaw",
            "email": "abc@test.com",
            "avatar": "/assets/img/avatar3.png"
        },
        {
            "membership": false,
            "mobile": "555-555-555",
            "rewards": 89,
            "id": 4,
            "firstName": "Rosseta",
            "lastName": "Wilson",
            "email": "test@test.com",
            "avatar": "/assets/img/avatar4.png"
        },
        {
            "membership": false,
            "mobile": "555-555-555",
            "rewards": 38,
            "id": 5,
            "firstName": "William",
            "lastName": "Carney",
            "email": "test@test.com",
            "avatar": "/assets/img/avatar2.png"
        },
        {
            "membership": false,
            "mobile": "555-555-555",
            "rewards": 23,
            "id": 6,
            "firstName": "Sarah",
            "lastName": "Dunne",
            "email": "test@test.com",
            "avatar": "/assets/img/avatar1.png"
        },
        {
            "membership": true,
            "mobile": "555-555-555",
            "rewards": 23,
            "id": 8,
            "firstName": "Merriana",
            "lastName": "Sean",
            "email": "test@test.com",
            "avatar": "/assets/img/avatar5.png"
        },
        {
            "membership": true,
            "mobile": "555-555-555",
            "rewards": 26,
            "id": 9,
            "firstName": "Jubino",
            "lastName": "Gerret",
            "email": "test@test.com",
            "avatar": "/assets/img/avatar1.png"
        },
        {
            "membership": false,
            "mobile": "555-555-555",
            "rewards": 22,
            "id": 10,
            "firstName": "Geneva",
            "lastName": "Wilson",
            "email": "test@test.com",
            "avatar": "/assets/img/avatar2.png"
        },
        {
            "membership": true,
            "mobile": "555-555-555",
            "rewards": 38,
            "id": 11,
            "firstName": "Mark",
            "lastName": "Carney",
            "email": "test@test.com",
            "avatar": "/assets/img/avatar5.png"
        },
        {
            "membership": false,
            "mobile": "555-555-555",
            "rewards": 27,
            "id": 12,
            "firstName": "Yann",
            "lastName": "Larrel",
            "email": "test@test.com",
            "avatar": "/assets/img/avatar1.png"
        },
        {
            "membership": true,
            "firstName": "John",
            "lastName": "Doe",
            "mobile": "555-555-555",
            "rewards": 88,
            "email": "john.doe@test.com",
            "id": 13
        },
        {
            "avatar": null,
            "firstName": "sdfsdf",
            "lastName": "sdfsdf",
            "mobile": "555-555-555",
            "rewards": 22,
            "email": "sdfsdfsdfs",
            "membership": false,
            "id": 14
        }
    ],
    "orders": [
        {
            "id": 2,
            "reference": "order-2-2-1-2",
            "customerId": 2,
            "products": [
                {
                    "id": 1,
                    "productName": "Product HHYDP",
                    "categoryId": 1,
                    "unitInStock": null,
                    "unitPrice": 18
                },
                {
                    "id": 2,
                    "productName": "Product RECZE",
                    "categoryId": 1,
                    "unitInStock": null,
                    "unitPrice": 19
                }
            ],
            "amount": 9.99,
            "orderDate": "2017-01-01",
            "shippedDate": "2017-01-01",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            }
        },
        {
            "id": 3,
            "reference": "order-4-3-1-2",
            "customerId": 4,
            "products": [
                {
                    "id": 1,
                    "productName": "Product HHYDP",
                    "categoryId": 1,
                    "unitInStock": null,
                    "unitPrice": 18
                },
                {
                    "id": 2,
                    "productName": "Product RECZE",
                    "categoryId": 1,
                    "unitInStock": null,
                    "unitPrice": 19
                }
            ],
            "amount": 5.99,
            "orderDate": "2017-01-01",
            "shippedDate": "2017-01-01",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            }
        },
        {
            "id": 4,
            "reference": "order-4-4-1-2",
            "customerId": 4,
            "products": [
                {
                    "id": 3,
                    "productName": "Product IMEHJ",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 10
                },
                {
                    "id": 4,
                    "productName": "Product KSBRM",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 22
                }
            ],
            "amount": 499.99,
            "orderDate": "2017-01-01",
            "shippedDate": "2017-01-01",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            }
        },
        {
            "id": 5,
            "reference": "order-5-5-1-2",
            "customerId": 5,
            "products": [
                {
                    "id": 5,
                    "productName": "Product EPEIM",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 21.5
                }
            ],
            "amount": 399.99,
            "orderDate": "2017-01-01",
            "shippedDate": "2017-01-01",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            }
        },
        {
            "id": 6,
            "reference": "order-6-6-1-2",
            "customerId": 6,
            "products": [
                {
                    "id": 5,
                    "productName": "Product EPEIM",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 21.5
                }
            ],
            "amount": 329.99,
            "orderDate": "2017-01-01",
            "shippedDate": "2017-01-01",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            }
        },
        {
            "id": 8,
            "reference": "order-8-8-1-2",
            "customerId": 8,
            "products": [
                {
                    "id": 5,
                    "productName": "Product EPEIM",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 21.5
                }
            ],
            "amount": 89.99,
            "orderDate": "2017-01-12",
            "shippedDate": "2017-01-10",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            }
        },
        {
            "id": 9,
            "reference": "order-9-9-1-2",
            "customerId": 9,
            "products": [
                {
                    "id": 5,
                    "productName": "Product EPEIM",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 21.5
                }
            ],
            "amount": 59.99,
            "orderDate": "2017-01-01",
            "shippedDate": "2017-01-01",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            }
        },
        {
            "id": 10,
            "reference": "order-10-10-1-2",
            "customerId": 10,
            "products": [
                {
                    "id": 5,
                    "productName": "Product EPEIM",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 21.5
                }
            ],
            "amount": 49.99,
            "orderDate": "2017-01-01",
            "shippedDate": "2017-01-01",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            }
        },
        {
            "id": 12,
            "reference": "order-2-12-1-2",
            "customerId": 2,
            "products": [
                {
                    "id": 5,
                    "productName": "Product EPEIM",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 21.5
                }
            ],
            "amount": 49.99,
            "orderDate": "2017-01-01",
            "shippedDate": "2017-01-01",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            }
        },
        {
            "id": 14,
            "reference": "order-2-14-1-2",
            "customerId": 4,
            "products": [
                {
                    "id": 5,
                    "productName": "Product EPEIM",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 21.5
                }
            ],
            "amount": 19.99,
            "orderDate": "2017-01-09",
            "shippedDate": "2017-01-01",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            }
        },
        {
            "id": 15,
            "reference": "order-11-15-1-2",
            "customerId": 11,
            "products": [
                {
                    "id": 5,
                    "productName": "Product EPEIM",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 21.5
                },
                {
                    "id": 19,
                    "productName": "Product XKXDO",
                    "categoryId": 3,
                    "unitInStock": null,
                    "unitPrice": 9.2,
                    "category": {
                        "id": 3,
                        "categoryName": "Confections",
                        "description": "Desserts, candies, and sweet breads",
                        "picture": null
                    },
                    "text": "Product XKXDO",
                    "value": 19
                }
            ],
            "amount": 222,
            "orderDate": "2017-01-19",
            "shippedDate": "2017-01-16",
            "shipAddress": {
                "address": "Gran Vía, 0123",
                "city": "Madrid",
                "zipcode": "10298",
                "country": "Spain"
            },
            "quantity": 12,
            "price": 33
        },
        {
            "products": [
                {
                    "id": 4,
                    "productName": "Product KSBRM",
                    "categoryId": 2,
                    "unitInStock": 2,
                    "unitPrice": 22,
                    "category": {
                        "id": 2,
                        "categoryName": "Condiments",
                        "description": "Sweet and savory sauces, relishes, spreads, and seasonings",
                        "picture": null
                    },
                    "text": "Product KSBRM",
                    "value": 4
                },
                {
                    "id": 6,
                    "productName": "Product VAIIV",
                    "categoryId": 2,
                    "unitInStock": null,
                    "unitPrice": 25,
                    "category": {
                        "id": 2,
                        "categoryName": "Condiments",
                        "description": "Sweet and savory sauces, relishes, spreads, and seasonings",
                        "picture": null
                    },
                    "text": "Product VAIIV",
                    "value": 6
                }
            ],
            "customerId": 4,
            "orderDate": "2017-08-08",
            "shippedDate": null,
            "shipAddress": {
                "address": "sss",
                "city": "sss",
                "zipcode": "sss",
                "country": "sss"
            },
            "reference": "ss-2-22-22",
            "amount": 2323,
            "id": 16
        }
    ],
    "products": [
        {
            "id": 1,
            "productName": "Product HHYDP",
            "categoryId": 1,
            "unitInStock": 23,
            "unitPrice": 18
        },
        {
            "id": 2,
            "productName": "Product RECZE",
            "categoryId": 1,
            "unitInStock": 10,
            "unitPrice": 19
        },
        {
            "id": 3,
            "productName": "Product IMEHJ",
            "categoryId": 2,
            "unitInStock": null,
            "unitPrice": 10
        },
        {
            "id": 4,
            "productName": "Product KSBRM",
            "categoryId": 2,
            "unitInStock": 2,
            "unitPrice": 22
        },
        {
            "id": 5,
            "productName": "Product EPEIM",
            "categoryId": 2,
            "unitInStock": 333,
            "unitPrice": 21.5
        },
        {
            "id": 6,
            "productName": "Product VAIIV",
            "categoryId": 2,
            "unitInStock": null,
            "unitPrice": 25
        },
        {
            "id": 7,
            "productName": "Product HMLNI",
            "categoryId": 7,
            "unitInStock": null,
            "unitPrice": 30
        },
        {
            "id": 8,
            "productName": "Product WVJFP",
            "categoryId": 2,
            "unitInStock": null,
            "unitPrice": 40
        },
        {
            "id": 9,
            "productName": "Product AOZBW",
            "categoryId": 6,
            "unitInStock": null,
            "unitPrice": 97
        },
        {
            "id": 10,
            "productName": "Product YHXGE",
            "categoryId": 8,
            "unitInStock": null,
            "unitPrice": 31
        },
        {
            "id": 11,
            "productName": "Product QMVUN",
            "categoryId": 4,
            "unitInStock": null,
            "unitPrice": 21
        },
        {
            "id": 12,
            "productName": "Product OSFNS",
            "categoryId": 4,
            "unitInStock": null,
            "unitPrice": 38
        },
        {
            "id": 13,
            "productName": "Product POXFU",
            "categoryId": 8,
            "unitInStock": null,
            "unitPrice": 6
        },
        {
            "id": 14,
            "productName": "Product PWCJB",
            "categoryId": 7,
            "unitInStock": null,
            "unitPrice": 23.5
        },
        {
            "id": 15,
            "productName": "Product KSZOI",
            "categoryId": 2,
            "unitInStock": 33,
            "unitPrice": 15.5
        },
        {
            "id": 16,
            "productName": "Product PAFRH",
            "categoryId": 3,
            "unitInStock": null,
            "unitPrice": 17.5
        },
        {
            "id": 17,
            "productName": "Product BLCAX",
            "categoryId": 6,
            "unitInStock": null,
            "unitPrice": 39
        },
        {
            "id": 18,
            "productName": "Product CKEDC",
            "categoryId": 8,
            "unitInStock": null,
            "unitPrice": 62.5
        },
        {
            "id": 19,
            "productName": "Product XKXDO",
            "categoryId": 3,
            "unitInStock": null,
            "unitPrice": 9.2
        },
        {
            "id": 20,
            "productName": "Product QHFFP",
            "categoryId": 3,
            "unitInStock": 23,
            "unitPrice": 81
        },
        {
            "id": 21,
            "productName": "Product VJZZH",
            "categoryId": 3,
            "unitInStock": null,
            "unitPrice": 18
        },
        {
            "id": 22,
            "productName": "Product CPHFY",
            "categoryId": 5,
            "unitInStock": null,
            "unitPrice": 21
        },
        {
            "id": 23,
            "productName": "Product JLUDZ",
            "categoryId": 5,
            "unitInStock": null,
            "unitPrice": 9.5
        },
        {
            "id": 24,
            "productName": "Product QOGNU",
            "categoryId": 2,
            "unitInStock": null,
            "unitPrice": 4.5
        },
        {
            "categoryId": 3,
            "productName": "Product ABCD",
            "unitPrice": 222,
            "unitInStock": 23,
            "id": 26
        },
        {
            "id": 27,
            "productName": "asdasd",
            "categoryId": 3,
            "unitInStock": "22",
            "unitPrice": "234"
        }
    ],
    "categories": [
        {
            "id": 1,
            "categoryName": "Beverages",
            "description": "Soft drinks, coffees, teas, beers, and ales",
            "picture": null
        },
        {
            "id": 2,
            "categoryName": "Condiments",
            "description": "Sweet and savory sauces, relishes, spreads, and seasonings",
            "picture": null
        },
        {
            "id": 3,
            "categoryName": "Confections",
            "description": "Desserts, candies, and sweet breads",
            "picture": null
        },
        {
            "id": 4,
            "categoryName": "Dairy Products",
            "description": "Cheeses",
            "picture": null
        },
        {
            "id": 5,
            "categoryName": "Grains/Cereals",
            "description": "Breads, crackers, pasta, and cereal",
            "picture": null
        },
        {
            "id": 6,
            "categoryName": "Meat/Poultry",
            "description": "Prepared meats",
            "picture": null
        },
        {
            "id": 7,
            "categoryName": "Produce",
            "description": "Dried fruit and bean curd",
            "picture": null
        },
        {
            "id": 8,
            "categoryName": "Seafood",
            "description": "Seaweed and fish",
            "picture": null
        }
    ]
};

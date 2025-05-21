import fakeDataProvider from "ra-data-fakerest";

// const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

export const dataProvider = fakeDataProvider({
    posts: [
        { id: 0, title: 'Hello, world!' },
        { id: 1, title: 'FooBar' },
    ],
    comments: [
        { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
        { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
    ],
    roles: [
        { id: "4cf9d35e-30bf-479e-ab22-985da77d38b8", name: "admin", price: true, domain: "all" },
        { id: "c8c8b2b9-dd85-4ea8-ba56-71a21dbfcdb1", name: "visitor", price: false, domain: "domain1" }
    ],
    users: [
        { id: 0, name: "admin", role: "4cf9d35e-30bf-479e-ab22-985da77d38b8" },
        { id: 1, name: "demo", role: "c8c8b2b9-dd85-4ea8-ba56-71a21dbfcdb1" }
    ]
});

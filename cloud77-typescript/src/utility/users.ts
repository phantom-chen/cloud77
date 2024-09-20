import { User } from "../service";

let users: User[] = [];

export function addUser(user: User): void {
    user.name = user.name?.trim().toLowerCase();
    users.push(Object.assign({}, user));
}

export function deleteUser(name: string): void {
    const user: User | undefined = users.find((u: User) => u.name === name.toLowerCase());
    if (user) {
        user.name = undefined;
        user.role = undefined;
        user.title = undefined;
    }
}

export function deleteAllUsers(): void {
    users = [];
}

export function getUser(name: string): User | undefined {
    if (name !== "") {
        name = name.toLowerCase();
        const user: User | undefined = users.find((u: User) => u.name === name);
        if (user) {
            return Object.assign({}, user);
        }
    }
    return;
}

export function getAllUsers(): User[] | undefined {
    const allUsers: User[] = users.filter((u: User) => (u.name != null) && u.role && u.title);
    if (allUsers.length > 0) {
        return allUsers.map((u: User) => { return Object.assign({}, u); });
    } else {
        return;
    }
}
import { Role } from "../service";
import { addUser, deleteAllUsers, deleteUser, getAllUsers, getUser } from "./users";

describe("users crud", () => {
    beforeEach(() => deleteAllUsers() );

    test('add and delete user', () => {
        expect(getAllUsers()).toBeFalsy();
        addUser({ name: "user1", role: Role.Tester, title: "developer" });
        expect(getAllUsers()).toBeTruthy();
        expect(getAllUsers()?.length).toBe(1);
        expect(getUser("user1")).toBeTruthy();
        expect(getUser("user2")).toBeFalsy();

        deleteUser("user2");
        deleteUser("user1");
        expect(getAllUsers()).toBeFalsy();
        expect(getUser("user1")).toBeFalsy();
    })
})

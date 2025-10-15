import { add } from "./add"

describe("add test suite", () => {
    // beforeAll(() => {
    //     console.log('before all');
    // })
    // beforeEach(() => {
    //     console.log('before each');
    // })
    // afterAll(() => {
    //     console.log('after all');
    // })
    // afterEach(() => {
    //     console.log('after each');
    // })
    test("add function test1", () => {
        expect(add(1, 1)).toBe(2);
    })

    test("add function test2", () => {
        expect(add(1, 0)).toBe(1);
    })

    test("add function test3", () => {
        expect(add(-1, 0)).toBe(0);
    })
    
    
})
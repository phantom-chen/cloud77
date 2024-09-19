import { sayHello } from "./hello";

test('hello function', () => {
    expect(sayHello()).toBeTruthy();
})
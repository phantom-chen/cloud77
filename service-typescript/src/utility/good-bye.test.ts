import { sayGoodbye } from "./good-bye"

test('good bye function', () => {
    expect(sayGoodbye()).toBeTruthy();
})
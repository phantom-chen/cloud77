export class Person {
    constructor(public personId: number, public name: string, public city: string) {

    }
}

export const PERSONS: Person[] = [
    new Person(1, 'Mahesh', 'Varanasi'),
    new Person(2, 'Ram', 'Ayodhya'),
    new Person(3, 'Kishna', 'Mathura')
];
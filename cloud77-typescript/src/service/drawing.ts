// export namespace Drawing {

// }

export interface IShape {
    name: string
}

let count = 0;

function autoIncrement(): number {
    count++;

    return count;
}

export default { autoIncrement }
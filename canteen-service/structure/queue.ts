export  class Queue {
    private _queue: any = {};
    private _queue2: any = {};
    private _head: number;
    private _tail: number;
    private _max: number;

    constructor() {
        this._head = 0;
        this._tail = 0;
        this._max = 0;
    }

    size() {
        return this._tail - this._head;
    }

    isEmpty() {
        return this.size() === 0;
    }

    enqueue(value: any): void {
        this._queue[this._tail] = value;
        this._queue2[value] = value;
        this._tail++;
    }

    dequeue(): any {
        return;
    }

    print(): void {
        console.log(this._queue);
        console.log(this._queue2);
    }
}
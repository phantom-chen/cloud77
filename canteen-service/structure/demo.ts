import { Queue } from "./queue";

const q: Queue = new Queue();

q.enqueue(1);
q.enqueue(2);
q.enqueue(3);
q.enqueue("test1");
q.enqueue("todo1");
q.print();

const employees = new Map();
employees.set("name1", "john");
employees.set("name2", "jaaohn");

console.log(employees);
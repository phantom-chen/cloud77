import { argv } from "process";
import { dirname } from "path";

console.log('hello.ts starts');
console.log("Execution location:", __dirname);
console.log("Full script path:", __filename);

// print arguments
argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
});

console.log('');
console.log("Parent Directory:", dirname(__dirname));
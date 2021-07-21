const fs = require('fs');

const readStream = fs.createReadStream('./Docs/blog1.txt', {encoding: 'utf-8'});
const writeStream = fs.createWriteStream('./Docs/blog4.txt');

// readStream.on('data', (chunk)=>{
//     console.log("==== New chunk ====");
//     console.log(chunk);
//     writeStream.write("\nNew Chunk\n");
//     writeStream.write(chunk);
// });

readStream.pipe(writeStream);
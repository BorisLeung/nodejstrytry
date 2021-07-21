const fs = require('fs');

// fs.readFile('./hi.txt', (err, data)=>{
//     if(err)  console.log(err);
//     console.log(data.toString());
// })

// fs.writeFile('hi2.txt', '12345678', ()=>{console.log('file has been written')});

if(!fs.existsSync('./testdir')){
    fs.mkdir('./testdir', (err)=>{
        if(err)console.log(err);
    });
}else{
    fs.rmdir('./testdir', (err)=>{
        if(err) console.log(err);
    })
}
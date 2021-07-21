const http = require('http');
const fs = require('fs');
const _ = require('lodash');

const server = http.createServer((req, res)=>{
    
    //lodash
    const num = _.random(0, 20);
    console.log(num);

    const greet = _.once(()=>{
        console.log("hello there");
    });
    greet();

    res.setHeader('Content-Type', 'text/html');
    let path = "./bin/"
    switch(req.url){
        case '/':
            path+= 'index.html';
            res.statusCode = 200;
            break;
        case '/about':
            path += 'about.html';
            res.statusCode = 200;
            break;
        case '/about-you':
            res.statusCode = 301;
            res.setHeader('Location', '/about');
            break;
        case '/aboutyouandme':
            res.statusCode = 301;
            res.setHeader('Location', '/');
            break;
        default:
            path += '404.html';
            res.statusCode = 404;
            break;
    }


    fs.readFile(path, (err, data)=>{
        if(err){
            console.log(err);
            res.end();
        }
        else
            res.end(data);
        
    })
});

server.listen(3000, 'localhost', ()=>{
    console.log('listening for requests on port 3000');
});
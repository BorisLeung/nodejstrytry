const express = require('express');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// requests
app.listen(3000);

app.use(morgan('dev'));

app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/about', (req, res)=>{
    res.render('about');
});

app.get('/about-us', (req, res)=>{
    res.redirect('/about');
});

app.use((req, res)=>{
    res.status(404).render('404');
    console.log("404!");
});
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config')

// import Routes
const postRoute = require('./routes/posts');

// express app
const app = express();
const dbURL = process.env.DB_CONNECTION;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.listen(3000);
app.use(morgan('dev'));

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>console.log("Connected to db!"))
.catch((err)=>console.log(err))


app.get('/', (req, res)=>{
    res.render('index');
});

app.use('/posts', postRoute);

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

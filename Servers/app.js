const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/Users.js');
const checkLogin = require('./utils');
require('dotenv/config')

const saltRounds = 11;

// import Routes
const postRoute = require('./routes/posts');

// express app
const app = express();
const dbURL = process.env.DB_CONNECTION;

app.use(session({
    secret: "hello there",
    resave: false,
    saveUninitialized: true,}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.listen(3000);
app.use(morgan('dev'));

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>console.log("Connected to db!"))
.catch((err)=>console.log(err))

var sess;
app.get('/', (req, res)=>{
    if(req.session.username) return res.redirect('/posts');
    res.render('index');
});

app.post('/', (req, res)=>{
    bcrypt.hash(req.body.password, saltRounds)
    .then(hash=>{
        console.log(hash);
    });

    User.findOne({username: req.body.username}, (err, user)=>{
        if(!user || !bcrypt.compareSync(req.body.password, user.password)){
            res.json({status: "fail"});
        }else{
            sess = req.session;
            sess.username = req.body.username;
            sess.userid = user._id;
            console.log("login success");
            res.json({status: 'ok'});
        }
    })
});

app.get('/logout', (req, res)=>{
    req.session.destroy((err)=>{
        if(err) console.log(err);
    })
    res.redirect('/');
})

app.use('/posts', postRoute);

app.get('/register', (req, res)=>{
    if(!checkLogin(req)) return res.render('register');
    res.redirect('/logout');
});

app.post('/register', (req, res)=>{
    User.exists({username: req.body.username}, (err, result)=>{
        if(err){
            console.log(err);
        }else if(result){
            res.json({status: "error", err_msg: "Username already taken!"});
        }else{
            bcrypt.hash(req.body.password, saltRounds).then((hash)=>{
                const user = new User({
                    username: req.body.username,
                    password: hash,
                    admin: false
                })
                user.save().then((data)=>{
                    console.log(data);
                    res.json({status: "ok"});
                }).catch((err)=>{
                    console.log(err);
                    res.json({status: "error", err_msg: "Unknwon error occured while creating user."});
                })
            })
        }
    });
});

app.get('/createAdmin', (req, res)=>{
    bcrypt.hash("admin123", saltRounds).then((hash)=>{
        const user = new User({
            username: "admin",
            password: hash,
            admin: true
        })
        user.save().then((data)=>{
            console.log(data);
        }).catch((err)=>{
            console.log(err);
        })
        res.redirect('/');
    }
    );
})

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

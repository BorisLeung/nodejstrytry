const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/Users.js');
const checkLogin = require('./utils');
const { SALT_ROUNDS } = require('./Constants')
require('dotenv/config')

// import Routes
const postRoute = require('./routes/posts');
const userRoute = require('./routes/users');

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
app.listen(process.env.PORT || 3000);
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>console.log("Connected to db!"))
.catch((err)=>console.log(err))

var sess;
app.get('/', (req, res)=>{
    if(req.session.username) return res.redirect('/posts');
    res.render('index');
});

app.post('/', (req, res)=>{
    bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then(hash=>{
        // console.log(hash);
    });

    User.findOne({username: req.body.username}, (err, user)=>{
        if(!user || !bcrypt.compareSync(req.body.password, user.password)){
            res.json({status: "fail"});
        }else{
            sess = req.session;
            sess.username = req.body.username;
            sess.userid = user._id;
            sess.admin = user.admin;
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
app.use('/user', userRoute);

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
            bcrypt.hash(req.body.password, SALT_ROUNDS).then((hash)=>{
                const user = new User({
                    username: req.body.username,
                    password: hash,
                    admin: false
                })
                user.save().then((data)=>{
                    // console.log(data);
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
    bcrypt.hash("admin123", SALT_ROUNDS).then((hash)=>{
        User.findOne({username: "admin"}, (err, user)=>{
            if(err) return console.log(err);
            if(!user){
                user = new User({
                    username: "admin",
                    password: hash,
                    admin: true
                })
            }else{
                user.password = hash;
            }
            user.save().then((data)=>{
                // console.log(data);
            }).catch((err)=>{
                console.log(err);
            })
            res.redirect('/');
        })
    }
    );
})


app.use((req, res)=>{
    res.status(404).render('404');
    // console.log("404!");
});

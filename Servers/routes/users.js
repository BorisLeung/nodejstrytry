const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const checkLogin = require('../utils');
const User = require('../models/Users');
const Posts = require('../models/Posts');
const { SALT_ROUNDS } = require('../Constants')
require('dotenv/config')

router.get('/self', (req, res)=>{
    if(!checkLogin(req)) return res.redirect('/');
    Posts.countDocuments({user: req.session.userid}, (err, c)=>{
        if(err) return console.log(err);
        res.render('user', {username: req.session.username, number: c});
    });
});

router.get('/self/change', (req, res)=>{
    if(!checkLogin(req)) return res.redirect('/');
    res.render('change_user', {username: req.session.username});
});

router.post('/self/change', (req, res)=>{
    if(!checkLogin(req)) return res.redirect('/');
    console.log(req.body);
    User.findOne({username: req.session.username}, (err, user)=>{
        if(err) return console.log(err);
        if(!user || !bcrypt.compareSync(req.body.password, user.password)){
            return res.json({status: "error", err_msg: "Password incorrect!"});
        }
        if(req.session.username!=req.body.username){
            if(!req.body.username) return res.json({status: "error", err_msg: "Username is required!"});
            User.findOne({username: req.body.username}, (err, nuser)=>{
                if(err) return console.log(err);
                if(nuser) return res.json({status:"error", err_msg: "Username already taken!"});
                user.username = req.body.username;
                user.save()
                .then((data)=>{
                    req.session.username = user.username;
                    req.session.userid = user.id;
                    if(!req.body.new_password) return res.json({status: "ok"});
                })
                .catch((err)=>{
                    console.log(err);
                    return res.json({status: "error", err_msg: "Error changing username!"});
                })
            })
        }
        if(req.body.new_password){
            bcrypt.hash(req.body.new_password, SALT_ROUNDS).then((hash)=>{
                if(hash == user.password) return res.json({status: "error", err_msg: "New password cannot be the same as the original one!"});
                user.password = hash;
                user.save()
                .then((data)=>{
                    return res.json({status: "ok"});
                })
                .catch((err)=>{
                    console.log(err);
                    return res.json({status: "error", err_msg: "Error changing password"});
                })
            });
        }
    });
});

module.exports = router;
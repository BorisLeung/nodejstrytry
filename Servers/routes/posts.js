const express = require('express');
const router = express.Router();
const Post = require('../models/Posts')
const checkLogin = require('../utils');
const User = require('../models/Users');
const { isValidObjectId } = require('mongoose');

router.get('/', (req, res)=>{
    if(!checkLogin(req)) return res.redirect('/');
    // console.log(req.session);
    Post.find().sort({time: -1}).populate('user')
    .then((result)=>{
        // console.log(result);
        res.render('posts', {data: result, session: req.session});
    })
    .catch((err)=>{
        console.log(err);
        res.send("Error in fetching forum");
    })
});

router.get('/addpost', (req, res)=>{
    if(!checkLogin(req)) return res.redirect('/');
    // console.log(req.session);
    res.render('addpost', {post: '', session: req.session});
})

router.post('/addpost', (req, res)=>{
    if(checkLogin(req)){
        User.findOne({username: req.session.username}, (err, user)=>{
            const post = new Post({
                user: user,
                title: req.body.title,
                content: req.body.content,
            });
        
            if (post.title.length == 0) post.title = "No title";
        
            // console.log(post);
            post.save()
            .then(data=>{
                res.json({'status': 'ok'});
            })
            .catch(err=>{
                res.json({'status': 'error'});
            });
        })
    }
})

router.get('/edit/:pid', (req, res)=>{
    if(!checkLogin(req)) return res.redirect('/');
    var post_id = req.params.pid
    if(isValidObjectId(post_id)) {
        // console.log(post_id);
        Post.findOne({_id: post_id}, (err, post)=>{
            if(err) return console.log(err);
            console.log("user: ",  post.user.toString(), "\nuser session id:", req.session.userid);
            if(post){
                if(post.user.toString() != req.session.userid && !req.session.admin) return res.redirect('/posts');
                return res.render("addpost", {post: post, session: req.session});
            } 
            res.redirect('/posts')
        });
    }
    else {
        res.redirect('/posts');
    }
});

router.post('/edit/:pid', (req, res)=>{
    if(!checkLogin(req)) return;
    var post_id = req.params.pid
    if(isValidObjectId(post_id)) {
        // console.log(post_id);
        Post.findOne({_id: post_id}, (err, post)=>{
            if(err) return console.log(err);
            console.log("post: ", post);
            if(post){
                if(post.user.toString() != req.session.userid && !req.session.admin) return;
                post.title = req.body.title;
                post.content = req.body.content;
                post.save()
                .then(result=>{
                    return res.json({'status': 'ok'});
                })
                .catch(err=>{
                    console.log(err);
                    return res.json({'status': 'error'})
                })
            }
        });
    }
})

router.delete('/edit/:pid', (req, res)=>{
    if(!checkLogin(req)) return;
    var post_id = req.params.pid
    if(!isValidObjectId(post_id)) return;
    Post.findOne({_id: post_id}, (err, post)=>{
        if(post){
            if(post.user.toString() != req.session.userid) return;
            Post.deleteOne({_id: post_id}, (err)=>{
                console.log(err)
                return;
            });
            res.json({status: "ok"});
        }
    });
    
})

module.exports = router;
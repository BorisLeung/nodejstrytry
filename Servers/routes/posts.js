const express = require('express');
const router = express.Router();
const Post = require('../models/Posts')
const checkLogin = require('../utils');
const User = require('../models/Users');

router.get('/', (req, res)=>{
    if(!checkLogin(req)) return res.redirect('/');
    console.log(req.session);
    Post.find().populate('user')
    .then((result)=>{
        console.log(result);
        res.render('posts', {data: result});
    })
    .catch((err)=>{
        console.log(err);
        res.send("Error in fetching forum");
    })
});

// router.post('/', (req, res) => {
//     const post = new Post({
//         user: req.body.user,
//         title: req.body.title,
//         content: req.body.content,
//     });
//     // console.log(post);
//     post.save()
//     .then(data=>{
//         console.log('success');
//         res.json(data);
//     })
//     .catch(err=>{
//         console.log('error');
//         res.json({"message": err})
//     });
// });

router.get('/addpost', (req, res)=>{
    if(!checkLogin(req)) return res.redirect('/');
    console.log(req.session);
    res.render('addpost');
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

module.exports = router;
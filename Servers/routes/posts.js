const express = require('express');
const router = express.Router();
const Post = require('../models/Posts')

router.get('/', (req, res)=>{
    Post.find()
    .then((result)=>{
        console.log(result.length);
        res.render('posts', {data: result});
    })
    .catch((err)=>{
        console.log(err);
        res.send("Error in fetching forum");
    })
});

router.post('/', (req, res) => {
    const post = new Post({
        user: req.body.user,
        title: req.body.title,
        content: req.body.content,
    });

    // console.log(post);
    post.save()
    .then(data=>{
        console.log('success');
        res.json(data);
    })
    .catch(err=>{
        console.log('error');
        res.json({"message": err})
    });
});

router.get('/addpost', (req, res)=>{
    res.render('addpost');
})

router.post('/addpost', (req, res)=>{
    const post = new Post({
        user: req.body.user,
        title: req.body.title,
        content: req.body.content,
    });

    if (post.user.length == 0) post.user = "Guest";
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

module.exports = router;
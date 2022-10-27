const express = require('express');
const post = require('../controllers/post');
const {isLoggedIn,isAuthor} = require('../utils/middlewares');
const Post = require('../models/post');
const { catchAsyncErrors } = require('../utils/catchAsyncErrors');
const {validatePost} = require('../utils/validations');


const router = express.Router();

router.get('/',post.home);

router.get('/new',isLoggedIn,post.renderNewForm);

router.post('/',isLoggedIn,validatePost,catchAsyncErrors(post.createNew));

router.put('/:id',isAuthor(Post),validatePost,catchAsyncErrors(post.updatePost));

router.get('/:id/edit',isAuthor(Post),catchAsyncErrors(post.renderEditForm));

router.get('/:id',catchAsyncErrors(post.show));

router.delete('/:id',catchAsyncErrors(post.deletePost));

router.get('/user-posts/:userId',isLoggedIn,catchAsyncErrors(post.renderUserPosts));

module.exports = router;
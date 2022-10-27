const Post = require('../models/post');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

//limit of how many posts appear per page
const limit = 10;


module.exports.home = async (req, res, next) => {

    let { page } = req.query;
    page = parseInt(page);
    //if no page no defined then go to 1
    if (!page)
        page = 1;

    // start and end number of posts to be displayed
    const start = (page - 1) * limit;
    const end = page * limit;

    const results = {}

    // calculate prev page no. if there is one ; same for next page no.
    if (start > 0)
        results.prev = page - 1;
    if (end < await Post.countDocuments())
        results.next = page + 1;

    // find limited no of posts in order of date 
    results.posts = await Post.find({},{title : 1 , description : 1 , created : 1}).sort({ created: 'desc' }).limit(limit).skip(start).exec();

    res.render('posts/index.ejs', { results });
}

module.exports.renderNewForm = (req, res, next) => {
    res.render('posts/new.ejs');
}

module.exports.createNew = async (req, res, next) => {
    const post = new Post(req.body.post);
    post.author = req.session.user_id;
    await post.save();
    res.redirect('/posts?page=1');
}

module.exports.show = async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('author', ['username']);
    if (!post) {
        req.flash('error', 'Post not found');
        return res.redirect('/posts?page=1');
    }
    res.render('posts/show.ejs', { post });
}

module.exports.renderEditForm = async (req, res, next) => {
    res.render('posts/edit.ejs', { post: res.data });
}

module.exports.updatePost = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body.post);
    res.redirect(`/posts/${id}`);
}

module.exports.deletePost = async(req,res,next) =>{
    const {id} = req.params;
    const post = await Post.findByIdAndDelete(id);
    req.flash('success','Post deleted successfully');
    res.redirect('/posts');
}

module.exports.renderUserPosts = async(req,res,next)=>{
    let {userId} = req.params;
    let { page } = req.query;
    page = parseInt(page);
    if (!page)
        page = 1;

    const start = (page - 1) * limit;
    const end = page * limit;

    const results = {}


    if (start > 0)
        results.prev = page - 1;
    if (end < await Post.countDocuments({author : userId}))
        results.next = page + 1;

    results.user = await User.findById(userId); 
    if(!results.user){
        throw new ExpressError("Server error",500)
    }
    results.posts = await Post.find({author : userId},{title : 1 , description : 1 , created : 1}).sort({ created: 'desc' }).limit(limit).skip(start).exec();
    console.log(results);
    res.render('posts/user-posts',{results});
}
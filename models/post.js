const mongoose = require('mongoose');
const {Schema} = mongoose;
const sanitizeHtml = require('sanitize-html');
const marked = require('marked');

const postSchema = new Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    text : {
        type : String,
        required : true,
        trim : true

    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    created : {
        type : Date,
        default : Date.now
    }
})

// create html from markdown
postSchema.virtual('markdown').get(function(){
    return sanitizeHtml(marked.parse(this.text));
})

module.exports = mongoose.model('Post',postSchema);
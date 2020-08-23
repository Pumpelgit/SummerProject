const Comment = require("../models/comment.model")
const Project = require("../models/project.model")
const Like = require("../models/like.model")

module.exports.createComment = (req,res,next) => {
    const newComment = new Comment({
        text: req.body.addcomment,
        user: req.currentUser._id,
        project: req.body.project
    })

    newComment.save()
    .then(()=>{
        res.redirect(`${req.get('referer')}#comments`)
    })
    .catch(next)
}

module.exports.deleteComment = (req,res,next) => {
    Comment.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect(`${req.get('referer')}#comments`)
    })
    .catch(next)
}
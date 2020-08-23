const Project = require("../models/project.model")
const Like = require("../models/like.model")

module.exports.list = (req, res, next) => {

  const searchField = {}

  if(req.query.search){
    res.locals.search = req.query.search
    searchField['$or'] = [
      { name: new RegExp(req.query.search,"i") },
      { ['author.username']: new RegExp(req.query.search,"i") }
    ]
  }

  Project.find(searchField)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("author")
    .populate("comments")
    .populate("likes")
    .then((projects) => {
      res.render("projects/list", {
        projects,
        user: req.currentUser,
      })
    })
    .catch(next)
}

module.exports.like = (req, res, next) => {
  const params = { project: req.params.id, user: req.currentUser._id }
  console.log(params)
  Like.findOne(params)
    .then((like) => {
      if (like) {
        Like.findByIdAndRemove(like._id)
          .then(() => {
            res.json({ like: -1 })
          })
          .catch(next)
      } else {
        const newLike = new Like(params)
        newLike
          .save()
          .then(() => {
            res.json({ like: 1 })
          })
          .catch(next)
      }
    })
    .catch(next)
}

module.exports.newproject = (req, res, next) => {
  res.render("projects/newproject")
}

module.exports.createproject = (req, res, next) => {
  const projectParams = req.body
  projectParams.image = req.file ? req.file.path : undefined
  projectParams.author = req.currentUser._id
  const project = new Project(projectParams)
  project
    .save()
    .then((project) => {
      res.redirect(`/projects/${project._id}`)
    })
    .catch(next)
}

module.exports.showProject = (req, res, next) => {
  Project.findById(req.params.id)
    .populate("author")
    .populate({
      path: "comments",
      options: {
        sort: {
          createdAt: -1,
        },
      },
      populate: 'user'
    })
    .populate("likes")
    .then((project) => {
      res.render("projects/showproject", { project, user: req.currentUser._id })
    })
    .catch(next)
}

module.exports.editProject = (req, res, next) => {
  Project.findById(req.params.id)
  .then((project)=>{
    res.render("projects/newproject",{project})
  })
  .catch(next)
}

module.exports.updateProject = (req, res, next) => {
  const projectParams = req.body
  projectParams.image = req.file ? `/uploads/${req.file.filename}` : undefined
  projectParams.author = req.currentUser._id
  Project.findByIdAndUpdate(req.params.id, projectParams)
  .then((project)=>{
    res.redirect(`/projects/${project.id}`)
  })
  .catch(next)
}

module.exports.deleteProject = (req, res, next) => {
  Project.findByIdAndDelete(req.params.id)
  .then(()=>{
    res.redirect('/projects');
  })

}

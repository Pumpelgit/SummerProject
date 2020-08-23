const mongoose = require("mongoose");

require('./like.model')
require("./comment.model");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: [true,'Image required']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: true
    },
    url: {
      type: String,
      trim: true
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

projectSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "project",
  justOne: false,
});

projectSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "project",
  count: true
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

require("../config/db.config");

const User = require("../models/user.model");
const Project = require("../models/project.model");
const Comment = require("../models/comment.model");
const Like = require("../models/like.model.js");
const faker = require("faker");

const userIds = [];

Promise.all([
  User.deleteMany(),
  Project.deleteMany(),
  Comment.deleteMany(),
  Like.deleteMany()
])
  .then(() => {
    console.log('empty database')

    for (let i = 0; i < 400; i++) {
      const user = new User({
        name: faker.name.findName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        avatar: faker.image.avatar(),
        bio: faker.lorem.sentence(),
        createdAt: faker.date.past(),
      });

      user.save()
        .then(user => {
          userIds.push(user._id);

          for(let j = 0; j < 40; j++) {
            const project = new Project({
              name: faker.lorem.words(2),
              description: faker.lorem.paragraph(2),
              image: faker.random.image(),
              author: user._id,
              url: faker.internet.url(),
              createdAt: faker.date.past(),
            });

            project.save()
              .then(t => {
                for (let k = 0; k < 10; k++) {
                  const c = new Comment({
                    user: userIds[Math.floor(Math.random() * userIds.length)],
                    project: t._id,
                    text: faker.lorem.paragraph(),
                  });
                  c.save();

                  const l = new Like({
                    user: userIds[Math.floor(Math.random() * userIds.length)],
                    project: project._id
                  })
                  l.save();
                }
              })
          }
        })
    }
  })
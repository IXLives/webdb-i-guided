const express = require("express");

// database access using knex
const db = require("../data/db-config.js");

const router = express.Router();

router.get("/", (req, res) => {
  // SELECT * FROM POSTS
  //db.select('*').from('posts')

  db("posts")
    .then(posts => {
      res.json(posts);
    })
    .catch(error => {
      res.status(500).json({ message: "Error: " + error });
    });
});

router.get("/:id", (req, res) => {
  // Select * from posts where id = id from url

  db("posts")
    .where("id", req.params.id)
    .then(posts => {
      const post = posts[0];
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: "No such post" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error: " + err });
    });
});

router.post("/", (req, res) => {
  // Insert into posts (all of the keys from req.body) values (all the values from req.body)
  const postData = req.body;
  db("posts")
    .insert(postData)
    .then(ids => {
      res.status(201).json({ newPost: ids[0] });
    })
    .catch(err => {
      res.status(500).json({ message: "Error: " + err });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db("posts")
    .where({ id })
    .update(changes)
    .then(count => {
      if (count) {
        res.status(201).json(count);
      } else {
        res.status(404).json({ message: "Invalid edit" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error: " + err });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db("posts")
    .where({ id })
    .del()
    .then(count => {
      if (count) {
        res.status(201).json({ message: "Deleted" });
      } else {
        res.status(404).json({ message: "Delete failed" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error: " + err });
    });
});

module.exports = router;

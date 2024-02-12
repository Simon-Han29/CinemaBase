const express = require("express");
const session = require("express-session");
let router = express.Router();
let users = require("./userData");
let people = require("./peopleData");
let movies = require("./movieData");

router.get("/", (req, res) => {
  let followedUsers = users[req.session.uid].followedUsers;
  res.status(200).render("users", { users: users, uid: req.session.uid, followedUsers: followedUsers });
});

router.get("/:id", (req, res) => {
  if (!req.user) {
    res.status(404).send("This person does not exist");
  }
  res.status(200).render("profile", { user: req.user });
});

router.post("/:id/movieList", (req, res) => {
  console.log("Gets this far");
  console.log(req.body);
  if (req.user.movieList.hasOwnProperty(req.body.id)) {
    console.log("Already in list");
    res.status(409).send();
  }

  let movie = movies[req.body.id];
  let obj = {
    Title: req.body.Title,
    id: req.body.id,
    Poster: movie.Poster,
  };
  req.user.movieList[req.body.id] = obj;

  let curMovieGenres = movie.Genre;
  for (const curMovie in movies) {
    let count = 0;
    for (let i = 0; i < curMovieGenres.length; i++) {
      let currGenre = curMovieGenres[i];
      if (movies[curMovie].Genre.includes(currGenre)) {
        count++;
        if (count > 1) {
          console.log("GOOD MATCH");
          let recObj = {
            Title: movies[curMovie].Title,
            id: movies[curMovie].id,
            Poster: movies[curMovie].Poster,
          };
          req.user.recMovieList[req.body.id] = recObj;
        }
      }
    }
  }
  let numMovies = 0;
  for (let i in req.user.recMovieList) {
    numMovies++;
  }
  if (numMovies > 5) {
    for (let j in req.user.recMovieList) {
      delete req.user.recMovieList[j];
      break;
    }
  }
  console.log(numMovies);
  console.log("FROM SESSION");
  console.log(req.user);

  res.status(200).send();
});

router.delete("/:id/movieList/:mid", (req, res) => {
  if (req.user.movieList.hasOwnProperty(req.params.mid)) {
    delete req.user.movieList[req.params.mid];
    console.log(req.user);
    res.status(204).send();
  } else {
    console.log("Cannot delete since it's not in list");
    res.status(404).send();
  }
});

//FOLLOWING

router.post("/:id/followedPeople", (req, res) => {
  console.log("Gets here");
  if (req.user.followedPeople.hasOwnProperty(req.body.pid)) {
    console.log("Already following this person");
    res.status(409).send();
  }

  let p = {
    pid: req.body.pid,
    name: people[req.body.pid].name,
  };
  req.user.followedPeople[req.body.pid] = p;
  console.log(req.user);
  res.status(200).send();
});

router.delete("/:id/followedPeople/:pid", (req, res) => {
  if (req.user.followedPeople.hasOwnProperty(req.params.pid)) {
    delete req.user.followedPeople[req.params.pid];
    console.log(req.user);
    res.status(204).send();
  } else {
    console.log("Cannot delete since You are not folllowing");
    res.status(404).send();
  }
});

//== Following users
router.post("/:id/folowedUsers", (req, res) => {
  if (req.user.followedUsers.hasOwnProperty(req.body.pid)) {
    console.log("Already following this user.");
    res.status(409).send();
  }
  req.user.followedUsers[req.body.pid] = req.body;
  console.log(req.user);
  res.end();
});
router.param("id", function (req, res, next, id) {
  req.user = users[id];
  if (!req.user) {
    res.status(404).send();
  }
  next();
});

router.delete("/:id/followedUsers/:pid", (req, res) => {
  if (req.user.followedUsers.hasOwnProperty(req.params.pid)) {
    delete req.user.followedUsers[req.params.pid];
    console.log(req.user);
    res.status(204).send();
  } else {
    console.log("Cannot delete User since you are not folllowing them");
    res.status(404).send();
  }
});

module.exports = router;

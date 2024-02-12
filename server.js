const express = require("express");
const pug = require("pug");
const { urlencoded } = require("body-parser");
const session = require("express-session");
const path = require("path");

let app = express();
app.set("view engine", "pug");
app.use(session({ secret: "some secret" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(__dirname + "public/css"));
app.use(urlencoded({ extended: true }));
app.use(express.json());

let movieData = require("./movie-data-2500.json");
let movies = require("./movieData");
let people = require("./peopleData");
let reviews = require("./reviewData");
let randomId = require("./id-generator.js");

movieData.forEach((movie) => {
  movie.reviews = {};
  let id = randomId.randomId();
  movie.id = id;
  movies[id] = movie;
  let newActors = [];
  let newDirectors = [];
  let newWriters = [];

  for (let i = 0; i < movie.Actors.length; i++) {
    let exists = false;

    for (const property in people) {
      if (people[property].name == movie.Actors[i]) {
        people[property].Acted.push({ Title: movie.Title, id: id, Poster: movie.Poster });

        newActors.push({ name: movie.Actors[i], id: property, collaborated: [] });

        exists = true;
        break;
      }
    }

    if (!exists) {
      let newId = randomId.randomId();
      let newPerson = { name: movie.Actors[i], id: newId, Acted: [{ Title: movie.Title, id: id, Poster: movie.Poster }], Directed: [], Wrote: [], collaborated: [] };
      people[newId] = newPerson;
      newActors.push({ name: movie.Actors[i], id: newId, collaborated: [] });
    }
  }

  for (let i = 0; i < movie.Director.length; i++) {
    let exists = false;

    for (const property in people) {
      if (people[property].name == movie.Director[i]) {
        people[property].Directed.push({ Title: movie.Title, id: id, Poster: movie.Poster });

        newDirectors.push({ name: movie.Director[i], id: property });

        exists = true;
        break;
      }
    }

    if (!exists) {
      let newId = randomId.randomId();
      let newPerson = { name: movie.Director[i], id: newId, Acted: [], Directed: [{ Title: movie.Title, id: id, Poster: movie.Poster }], Wrote: [] };
      people[newId] = newPerson;
      newDirectors.push({ name: movie.Director[i], id: newId });
    }
  }

  for (let i = 0; i < movie.Writer.length; i++) {
    let exists = false;

    for (const property in people) {
      if (people[property].name == movie.Writer[i]) {
        people[property].Wrote.push({ Title: movie.Title, id: id, Poster: movie.Poster });

        newWriters.push({ name: movie.Writer[i], id: property });

        exists = true;
        break;
      }
    }

    if (!exists) {
      let newId = randomId.randomId();
      let newPerson = { name: movie.Writer[i], id: newId, Acted: [], Directed: [], Wrote: [{ Title: movie.Title, id: id, Poster: movie.Poster }] };
      people[newId] = newPerson;
      newWriters.push({ name: movie.Writer[i], id: newId });
    }
  }

  movie.Actors = newActors;
  movie.Director = newDirectors;
  movie.Writer = newWriters;
});

let users = require("./userData");

app.get("/", auth, (req, res) => {
  res.status(200).render("home", { movies: movies });
});

let movieRouter = require("./Movie-router");
app.use("/movies", auth, movieRouter);

let userRouter = require("./User-router");
app.use("/user", auth, userRouter);

let peopleRouter = require("./People-router");
app.use("/people", peopleRouter);

app.post("/login", login);
app.post("/signup", signup, login);
app.get("/profile", auth, (req, res) => {
  let user = users[req.session.uid];
  if (!user) {
    res.status(404).send();
  }
  res.status(200).render("profile", { user: user });
});
app.get("/account", auth, (req, res) => {
  res.render("loggedin", { isContributor: users[req.session.uid].isContributor });
});

app.post("/account/regAccount", auth, (req, res) => {
  let user = users[req.session.uid];
  if (user.isContributor) {
    user.isContributor = false;
    res.status(200).send();
  } else {
    res.status(409).send("You already have a regular account");
  }
});

app.post("/account/contributor", auth, (req, res) => {
  if (users[req.session.uid].isContributor) {
    res.status(409).send("You are already a contributor");
  } else {
    users[req.session.uid].isContributor = true;
    res.status(200).send();
  }
});

app.get("/logout", logout);

app.get("/contribute", auth, (req, res) => {
  let user = users[req.session.uid];
  if (user.isContributor) {
    res.status(200).render("contribute");
  } else {
    res.status(401).send("You are not a contributor");
  }
});

app.get("/search", auth, (req, res) => {
  res.status(200).render("search");
});

app.get("/reviews/:rid", auth, (req, res) => {
  let review = reviews[req.params.rid];
  res.status(200).render("singleReview", { review: review });
});

function auth(req, res, next) {
  if (!req.session.loggedin) {
    res.render("login");
  } else {
    next();
  }
}

function login(req, res, next) {
  if (req.session.loggedin) {
    next();
    return;
  }

  let username = req.body.username;
  let password = req.body.password;
  let account;
  let id;
  for (let user in users) {
    if (users[user].username == username) {
      account = users[user];
      id = user;
    }
  }
  console.log(account);
  console.log(id);
  if (!account) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (account.password === password) {
    req.session.loggedin = true;
    req.session.username = username;
    req.session.uid = id;
    console.log(req.session);
    res.status(200);
    res.redirect("/");
    return;
  } else {
    res.status(401).send("Incorrect Password. Try again.");
    return;
  }
}

function logout(req, res, next) {
  if (req.session.loggedin) {
    req.session.loggedin = false;
    req.session.username = undefined;
    req.session.uid = undefined;
    console.log(req.session);
    res.status(200).render("loggedOut");
  } else {
    res.status(404).send("You cannot log out because you aren't logged in.");
  }
}

function signup(req, res, next) {
  for (const property in users) {
    if (users[property].username == req.body.username) {
      res.status(409).send("Username taken.");
      return;
    }
  }
  let uid = randomId.randomId();
  while (users.hasOwnProperty(uid)) {
    uid = randomId.randomId();
  }

  let newUser = {
    username: req.body.username,
    password: req.body.password,
    movieList: {},
    recMovieList: {},
    followedPeople: {},
    followedUsers: {},
    reviews: {},
    isContributor: false,
    id: uid,
    notifications: [],
  };

  users[uid] = newUser;
  console.log("Account created");
  next();
}

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});

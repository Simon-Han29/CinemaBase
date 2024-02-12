const express = require("express");
const session = require("express-session");
let router = express.Router();
let movies = require("./movieData");
let users = require("./userData");
let people = require("./peopleData");
let reviews = require("./reviewData");
let randomId = require("./id-generator.js");

router.get("/genre/?", (req, res) => {
  console.log("Requested genre");
  console.log(req.query.genre);
  let results = [];
  for (const i in movies) {
    if (movies[i].Genre.includes(req.query.genre)) {
      results.push(movies[i]);
    }
  }
  console.log(results);
  if (results.length == 0) {
    res.status(404).send();
  }
  res.status(200).render("genre", { genre: req.query.genre, movies: results });
});
router.post("/", (req, res, next) => {
  console.log("Gets here");
  console.log(req.body);
  //find all people in the database (actors, writers, directors and add them to the new list)
  //if they are not found, then the database does not contain this person and the movie cannot be added
  //generate a new id for the movie
  let a = req.body.Actors;
  let d = req.body.Director;
  let w = req.body.Writer;
  let returnedActors = [];
  let returnedDirectors = [];
  let returnedWriters = [];
  let runtime = req.body.Runtime + " min";
  //validate the people
  let validActors = validatePeople(a, returnedActors);
  let validDirectors = validatePeople(d, returnedDirectors);
  let validWriters = validatePeople(w, returnedWriters);
  if (!validActors || !validDirectors || !validWriters) {
    res.status(404).send("Some people were not found");
    return;
  }

  //=========================
  console.log("All was valid");
  console.log(returnedActors);
  console.log(returnedDirectors);
  console.log(returnedWriters);

  let mId = randomId.randomId();
  while (movies.hasOwnProperty(mId)) {
    mId = randomId();
  }
  let newMovie = {
    Title: req.body.Title,
    Year: req.body.Year,
    Rated: "N/A",
    Released: "N/A",
    Runtime: runtime,
    Genre: req.body.Genre,
    Director: returnedDirectors,
    Writer: returnedWriters,
    Actors: returnedActors,
    Plot: req.body.Plot,
    Awards: "N/A",
    Poster: "",
    id: mId,
    reviews: {},
  };
  //notify users
  //notify users about new actor roles
  notify(returnedActors, "actor", mId);
  //notify users about new director role
  notify(returnedDirectors, "director", mId);
  //notify users about new writer role
  notify(returnedWriters, "writer", mId);

  console.log(newMovie);
  movies[mId] = newMovie;
  res.status(201).send();
});

router.get("/:id", (req, res) => {
  if (!req.movie) {
    res.status(404).send("COULD NOT FIND MOVIE, MAYBE KEY CHANGED");
  }
  let contained = false;
  if (users[req.session.uid].movieList.hasOwnProperty(req.params.id)) {
    contained = true;
  }
  let similarMovies = [];
  let curMovieGenres = req.movie.Genre;
  let curMovieActors = req.movie.Actors;
  for (const curMovie in movies) {
    if (similarMovies.length > 4) {
      break;
    }
    let count = 0;
    for (let i = 0; i < curMovieGenres.length; i++) {
      let currGenre = curMovieGenres[i];
      let currActor = curMovieActors[i];
      if (movies[curMovie].Genre.includes(currGenre)) {
        count++;
        if (count > 2) {
          let simObj = {
            Title: movies[curMovie].Title,
            id: movies[curMovie].id,
          };
          if (similarMovies.includes(simObj)) {
            break;
          } else if (simObj.id != req.movie.id) {
            similarMovies.push(simObj);
          }
        }
      } else if (movies[curMovie].Actors.includes(currActor)) {
        let simObj = {
          Title: movies[curMovie].Title,
          id: movies[curMovie].id,
        };
        if (similarMovies.includes(simObj)) {
          break;
        } else {
          similarMovies.push(simObj);
        }
      }
    }
  }
  const uniqueSimilarMovies = similarMovies.filter((thing, index) => {
    const _thing = JSON.stringify(thing);
    return (
      index ===
      similarMovies.findIndex((obj) => {
        return JSON.stringify(obj) === _thing;
      })
    );
  });

  let inList = false;
  let user = users[req.session.uid];
  if (user.movieList.hasOwnProperty(req.params.id)) {
    inList = true;
  }
  res.status(200).render("singleMovie", { movie: req.movie, uid: req.session.uid, contained: contained, username: req.session.username, uniqueSimilarMovies: uniqueSimilarMovies, inList: inList });
});

router.param("id", function (req, res, next, id) {
  console.log("Searching through movies for ID " + id);
  req.movie = movies[id];
  console.log("REQUEST's movie");
  console.log(req.movie);
  if (!req.movie) {
    res.status(404);
    res.write("Movie key may have changed");
    res.end();
  }
  next();
});

router.post("/:id/reviews", (req, res) => {
  console.log("Gets here!");
  let reviewId = randomId.randomId();
  let newReview = {
    movieId: req.movie.id,
    movieTitle: req.movie.Title,
    id: reviewId,
    uid: req.session.uid,
    username: req.session.username,
    text: req.body.reviewText,
    rating: req.body.rating,
    summary: req.body.summary,
  };
  reviews[reviewId] = newReview;
  req.movie.reviews[reviewId] = newReview;
  let user = users[req.session.uid];
  user.reviews[reviewId] = newReview;

  for (const i in users) {
    console.log("On iteration: " + users[i].username);
    if (users[i].followedUsers.hasOwnProperty(req.session.uid)) {
      let noti = {
        type: "user",
        username: users[req.session.uid].username,
        uid: req.session.uid,
        reviewId: reviewId,
      };

      users[i].notifications.push(noti);
      console.log(users[i]);
    }
  }

  res.send({ id: reviewId });
});

router.get("/?", (req, res) => {
  let list = [];

  let actors = req.query.actors.split(",");
  let genres = req.query.genres.split(",");
  let actorArr = [];
  let genreArr = [];

  let title = req.query.movieTitle.trim();
  if (actors.length > 0) {
    for (let i = 0; i < actors.length; i++) {
      if (actors[i].trim() != "" && actors[i]) {
        actorArr.push(actors[i].trim());
      }
    }
  }
  if (genres.length > 0) {
    for (let i = 0; i < genres.length; i++) {
      if (genres[i].trim() != "" && genres[i]) {
        genreArr.push(genres[i].trim());
      }
    }
  }

  console.log("after trim: ");
  console.log(actorArr);
  console.log(genreArr);
  let searchObj = {
    Title: title,
    Actors: actorArr,
    Genre: genreArr,
  };

  let attributes = {
    Title: "Title",
    Actors: "Actors",
    Genre: "Genre",
  };

  if (searchObj.Actors.length == 0) {
    console.log("empty actors");
    delete attributes["Actors"];
  }
  if (!searchObj.Title) {
    console.log("empty title");
    delete attributes["Title"];
  }
  if (searchObj.Genre.length == 0) {
    console.log("empty genre");
    delete attributes["Genre"];
  }

  for (const movie in movies) {
    let returned = true;

    if (attributes.hasOwnProperty("Title")) {
      let searchTitle = searchObj.Title.toLowerCase();
      let movieTitle = movies[movie].Title.toLowerCase();
      if (!movieTitle.includes(searchTitle)) {
        returned = false;
        continue;
      }
    }

    if (attributes.hasOwnProperty("Actors")) {
      let names = [];
      movies[movie].Actors.forEach((person) => {
        names.push(person.name);
      });
      let containsActors = searchObj.Actors.every((i) => names.includes(i));
      if (!containsActors) {
        returned = false;
      }
    }

    if (attributes.hasOwnProperty("Genre")) {
      let containsGenre = false;
      for (let i = 0; i < searchObj.Genre.length; i++) {
        for (let j = 0; j < movies[movie].Genre.length; j++) {
          let genre = movies[movie].Genre[j].toLowerCase();
          let searchedGenre = searchObj.Genre[i].toLowerCase();
          if (genre.includes(searchedGenre)) {
            containsGenre = true;
          }
        }
      }
      if (!containsGenre) {
        returned = false;
      }
    }

    if (returned) {
      list.push(movies[movie]);
    }
  }
  console.log(list);
  console.log("Non-void attributes: ");
  console.log(attributes);

  console.log(searchObj);
  if (list.length == 0) {
    res.status(404).send();
  }
  res.status(200).send({ movies: list });
});

function validatePeople(p, returned) {
  for (let i = 0; i < p.length; i++) {
    console.log(p[i]);
    let exists = false;

    for (const person in people) {
      if (people[person].name == p[i]) {
        exists = true;
        returned.push({ name: p[i], id: people[person].id });
        break;
      }
    }
    if (!exists) {
      return false;
    }
  }
  return true;
}

module.exports = router;

function notify(list, role, mid) {
  if (role == "actor") {
    for (let i = 0; i < list.length; i++) {
      for (const j in users) {
        if (users[j].followedPeople.hasOwnProperty(list[i].id)) {
          let noti = {
            type: "actor",
            name: list[i].name,
            id: list[i].id,
            movieId: mid,
          };
          users[j].notifications.push(noti);
        }
      }
    }
  } else if (role == "director") {
    for (let i = 0; i < list.length; i++) {
      for (const j in users) {
        if (users[j].followedPeople.hasOwnProperty(list[i].id)) {
          let noti = {
            type: "director",
            name: list[i].name,
            id: list[i].id,
            movieId: mid,
          };
          users[j].notifications.push(noti);
        }
      }
    }
  } else if (role == "writer") {
    for (let i = 0; i < list.length; i++) {
      for (const j in users) {
        if (users[j].followedPeople.hasOwnProperty(list[i].id)) {
          let noti = {
            type: "writer",
            name: list[i].name,
            id: list[i].id,
            movieId: mid,
          };
          users[j].notifications.push(noti);
        }
      }
    }
  }
}

const express = require("express");
const session = require("express-session");
let router = express.Router();
let people = require("./peopleData");
let randomId = require("./id-generator");
let users = require("./userData");

router.get("/?", (req, res) => {
  console.log("Search person received");
  let returned = {};
  let count = 0;
  let hasResult = false;
  for (let i in people) {
    let lowerCase = people[i].name.toLowerCase();
    let reqName = req.query.name.toLowerCase();
    if (lowerCase.includes(reqName)) {
      returned[people[i].id] = { name: people[i].name, id: people[i].id };
      count++;
      hasResult = true;
    }
    if (count >= 10) {
      break;
    }
  }

  res.status(200).send(returned);
});

router.post("/", (req, res) => {
  console.log(req.body);
  let name = req.body.name.trim();
  console.log(name);

  let exists = false;
  for (const i in people) {
    if (people[i].name == name) {
      exists = true;
      break;
    }
  }

  if (exists) {
    res.status(409).send("This person already exists.");
  } else {
    let id = randomId.randomId();
    let newPerson = {
      name: name,
      id: id,
      Acted: [],
      Directed: [],
      Wrote: [],
    };

    people[id] = newPerson;
    console.log(people);
    res.status(201).send();
  }
  res.end();
});

router.get("/:id", (req, res) => {
  if (!req.person) {
    res.status(404).send();
  }
  console.log("User ID: ");
  console.log(req.session.uid);
  console.log("Person: ");
  console.log(req.person);
  let user = users[req.session.uid];
  console.log(user);
  let alreadyFollowing = false;
  if (user.followedPeople.hasOwnProperty(req.params.id)) {
    alreadyFollowing = true;
  }
  console.log(alreadyFollowing);
  res.render("singlePerson", { person: req.person, uid: req.session.uid, following: alreadyFollowing });
});

router.param("id", (req, res, next, id) => {
  console.log("Receives request");
  req.person = people[id];
  if (!req.person) {
    console.log("No such person exists");
    res.status(404).send();
    return;
  }
  next();
});
module.exports = router;

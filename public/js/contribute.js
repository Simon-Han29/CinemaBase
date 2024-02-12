function addActor() {
  let actor = document.getElementById("name").value;
  console.log(actor);

  let formattedActor = actor.trim();

  if (formattedActor.length == 0) {
    return;
  }

  let reqBody = {
    name: formattedActor,
  };
  console.log(reqBody);
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 201) {
      alert("New Actor added!");
    } else if (this.readyState === 4 && this.status === 409) {
      alert("A person with this name already exists!");
    }
  };

  xhttp.open("POST", `/people`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(reqBody));
}

function searchActor() {
  let name = document.getElementById("actors").value;
  let formatted = name.trim();
  let results = document.getElementById("actorResults");
  console.log(formatted);
  if (formatted == "") {
    console.log("Empty");
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
    return;
  }
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      while (results.firstChild) {
        results.removeChild(results.firstChild);
      }
      let list = JSON.parse(this.responseText);
      for (let i in list) {
        let newName = document.createElement("a");
        newName.innerHTML = list[i].name;
        let br = document.createElement("br");
        newName.onclick = function () {
          let input = document.getElementById("actors");
          input.value = list[i].name;
        };
        results.append(newName, br);
      }
    } else if (this.readyState === 4 && this.status === 400) {
    }
  };

  xhttp.open("GET", `/people?name=${name}`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

function addToActorList() {
  let name = document.getElementById("actors").value;
  let nameInput = document.getElementById("actors");
  let list = document.getElementById("actorList");
  let results = document.getElementById("actorResults");
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
  nameInput.value = "";
  let formatted = name.trim();
  if (formatted == "") {
    return;
  }
  let newActor = document.createElement("label");
  let rmvButton = document.createElement("button");
  let actorDiv = document.createElement("div");
  rmvButton.onclick = function () {
    console.log(actorDiv);
    list.removeChild(actorDiv);
  };
  rmvButton.innerHTML = "Remove";
  rmvButton.className = "rmv";
  newActor.innerHTML = formatted;
  actorDiv.append(newActor, rmvButton);
  list.appendChild(actorDiv);
}

function searchDirector() {
  let name = document.getElementById("director").value;
  let formatted = name.trim();
  let results = document.getElementById("directorResults");
  console.log(formatted);
  if (formatted == "") {
    console.log("Empty");
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
    return;
  }
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log("Success!");

      while (results.firstChild) {
        results.removeChild(results.firstChild);
      }
      let list = JSON.parse(this.responseText);
      for (let i in list) {
        let newName = document.createElement("a");
        newName.innerHTML = list[i].name;
        let br = document.createElement("br");
        newName.onclick = function () {
          let input = document.getElementById("director");
          input.value = list[i].name;
        };
        results.append(newName, br);
      }
    } else if (this.readyState === 4 && this.status === 400) {
    }
  };

  xhttp.open("GET", `/people?name=${name}`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

function addToDirectorList() {
  let name = document.getElementById("director").value;
  let list = document.getElementById("directorList");

  let formatted = name.trim();
  if (formatted == "") {
    return;
  }
  let newDirector = document.createElement("label");
  let rmvButton = document.createElement("button");
  let directorDiv = document.createElement("div");

  rmvButton.onclick = function () {
    console.log(directorDiv);
    list.removeChild(directorDiv);
  };
  rmvButton.innerHTML = "Remove";
  rmvButton.className = "rmv";
  newDirector.innerHTML = formatted;
  directorDiv.append(newDirector, rmvButton);
  list.appendChild(directorDiv);
  let nameInput = document.getElementById("director");
  let results = document.getElementById("directorResults");
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
  nameInput.value = "";
}

function searchWriter() {
  let name = document.getElementById("writer").value;
  let formatted = name.trim();
  let results = document.getElementById("writerResults");
  console.log(formatted);
  if (formatted == "") {
    console.log("Empty");
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
    return;
  }
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log("Success!");

      while (results.firstChild) {
        results.removeChild(results.firstChild);
      }
      let list = JSON.parse(this.responseText);
      for (let i in list) {
        let newName = document.createElement("a");
        newName.innerHTML = list[i].name;
        let br = document.createElement("br");
        newName.onclick = function () {
          let input = document.getElementById("writer");
          input.value = list[i].name;
        };
        results.append(newName, br);
      }
    } else if (this.readyState === 4 && this.status === 400) {
    }
  };

  xhttp.open("GET", `/people?name=${name}`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

function addToWriterList() {
  let name = document.getElementById("writer").value;
  let list = document.getElementById("writerList");
  let formatted = name.trim();
  if (formatted == "") {
    return;
  }
  let newWriter = document.createElement("label");
  let rmvButton = document.createElement("button");
  let writerDiv = document.createElement("div");
  rmvButton.onclick = function () {
    console.log(writerDiv);
    list.removeChild(writerDiv);
  };
  rmvButton.innerHTML = "Remove";
  rmvButton.className = "rmv";
  newWriter.innerHTML = formatted;
  writerDiv.append(newWriter, rmvButton);
  list.appendChild(writerDiv);
  let nameInput = document.getElementById("writer");
  let results = document.getElementById("writerResults");
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
  nameInput.value = "";
}

function addMovie() {
  let movieTitle = document.getElementById("title").value;
  let release = document.getElementById("release").value;
  let runtime = document.getElementById("runtime").value;
  let plot = document.getElementById("plot").value;
  let genre = document.getElementById("genre").value;
  let actorDivs = document.getElementById("actorList").children;
  let directorDivs = document.getElementById("directorList").children;
  let writerDivs = document.getElementById("writerList").children;
  let Actors = [];
  let Director = [];
  let Writer = [];

  console.log("Runtime: ");
  console.log(runtime);

  if (isNaN(runtime)) {
    console.log("Invalid runtime");
    alert("Invalid runtime");
    return;
  }

  let formattedTitle = movieTitle.trim();
  let formattedRelease = release.trim();
  let formattedPlot = plot.trim();
  let formattedGenre = [];
  let genreArr = genre.split(",");

  for (let i = 0; i < genreArr.length; i++) {
    formattedGenre.push(genreArr[i].trim());
  }

  if (formattedTitle.length == 0) {
    alert("Invalid Title");
    return;
  }
  if (formattedRelease.length == 0) {
    alert("Invalid Release");
    return;
  }

  for (let i = 0; i < actorDivs.length; i++) {
    Actors.push(actorDivs[i].childNodes[0].innerHTML);
  }

  if (Actors.length == 0) {
    alert("Must add at least 1 actor");
    return;
  }

  for (let i = 0; i < directorDivs.length; i++) {
    Director.push(directorDivs[i].childNodes[0].innerHTML);
  }
  if (Director.length == 0) {
    alert("Must add at least 1 director");
    return;
  }

  for (let i = 0; i < writerDivs.length; i++) {
    Writer.push(writerDivs[i].childNodes[0].innerHTML);
  }
  if (Writer.length == 0) {
    alert("Must add at least 1 writer");
    return;
  }
  console.log(Actors);
  console.log(Director);
  console.log(Writer);

  let reqBody = {
    Title: formattedTitle,
    Year: formattedRelease,
    Runtime: runtime,
    Plot: formattedPlot,
    Genre: formattedGenre,
    Actors: Actors,
    Director: Director,
    Writer: Writer,
  };

  console.log(reqBody);
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 201) {
      let t = document.getElementById("title");
      t.value = "";
      let r = document.getElementById("release");
      r.value = "";
      let run = document.getElementById("runtime");
      run.value = "";
      let p = document.getElementById("plot");
      p.value = "";
      let g = document.getElementById("genre");
      g.value = "";
      let aL = document.getElementById("actorList");
      while (aL.firstChild) {
        aL.removeChild(aL.firstChild);
      }
      let dL = document.getElementById("directorList");
      while (dL.firstChild) {
        dL.removeChild(dL.firstChild);
      }
      let wL = document.getElementById("writerList");
      while (wL.firstChild) {
        wL.removeChild(wL.firstChild);
      }
      let aR = document.getElementById("actorResults");
      while (aR.firstChild) {
        aR.removeChild(aR.firstChild);
      }
      let dR = document.getElementById("directorResults");
      while (dR.firstChild) {
        dR.removeChild(dR.firstChild);
      }
      let wR = document.getElementById("writerResults");
      while (wR.firstChild) {
        wR.removeChild(wR.firstChild);
      }

      alert("Movie was created!");
    } else if (this.readyState === 4 && this.status === 404) {
      alert("404: Some actor(s), direcor(s) and/or writer(s) do not exist");
    }
  };
  xhttp.open("POST", `/movies`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(reqBody));
}

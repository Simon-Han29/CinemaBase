function search() {
  console.log("Button clicked!");
  let movieTitle = document.getElementById("titleField").value;
  let actors = document.getElementById("actors").value;
  let genres = document.getElementById("genres").value;

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let movies = JSON.parse(this.responseText).movies;
      let results = document.getElementById("allMovies");
      while (results.firstChild) {
        results.removeChild(results.firstChild);
      }
      for (let j in movies) {
        let tag = document.createElement("a");
        tag.href = `/movies/${movies[j].id}`;

        let card = document.createElement("div");
        card.className = "card";

        let imgBox = document.createElement("div");
        imgBox.className = "imgBox";

        let img = document.createElement("img");
        img.src = movies[j].Poster;

        let details = document.createElement("div");
        details.className = "details";

        let textContent = document.createElement("div");
        textContent.className = "textContent";

        let movie = document.createElement("div");
        movie.className = "movie";

        let container = document.createElement("div");
        container.className = "container";

        let link = document.createElement("a");

        let button = document.createElement("button");
        button.innerHTML = "VIEW MOVIE";

        let i = document.createElement("i");
        i.className = "fab fa-youtube";

        let title = document.createElement("h3");
        title.innerHTML = movies[j].Title;

        let description = document.createElement("div");
        description.className = "description";

        let icon = document.createElement("div");
        icon.className = "icon";

        let i2 = document.createElement("i");
        i2.className = "fas fa-info-circle";

        let contents = document.createElement("div");
        contents.className = "contents";

        let d = document.createElement("h3");
        d.innerHTML = "DESCRIPTION";

        let p = document.createElement("p");
        p.innerHTML = movies[j].Plot;

        icon.appendChild(i2);
        contents.append(d, p);
        description.append(icon, contents);

        button.appendChild(i);
        link.appendChild(button);
        container.appendChild(link);
        movie.appendChild(container);
        textContent.append(movie, title);
        details.appendChild(textContent);

        imgBox.appendChild(img);
        card.append(imgBox, details, description);
        tag.appendChild(card);
        results.append(tag);
      }
    } else if (this.readyState === 4 && this.status === 404) {
      alert("No movies match your search criteria!");
    }
  };

  xhttp.open("GET", `/movies?movieTitle=${movieTitle}&actors=${actors}&genres=${genres}`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

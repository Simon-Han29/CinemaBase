function toggleAdd(title, mid, uid) {
  if (btn.classList == "btnAdd") {
    let btn = document.getElementById("btn");
    let reqBody = {
      Title: title,
      id: mid,
    };

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log("ADD executed successfully");
      } else if (this.readyState === 4 && this.status === 400) {
        console.log("something went wrong");
      }
    };
    xhttp.open("POST", `/user/${uid}/movieList`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqBody));
    btn.classList.remove("btnAdd");
    btn.innerHTML = "Remove From List";
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 204) {
        console.log("Remove executed successfully");
      } else if (this.readyState === 4 && this.status === 400) {
        console.log("something went wrong");
      }
    };
    xhttp.open("Delete", `/user/${uid}/movieList/${mid}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
    btn.classList.add("btnAdd");
    btn.innerHTML = "Add To List";
  }
}

function submitReview(mid, uid, username) {
  console.log("button clicked!");
  let summary = document.getElementById("summary").value;
  let reviewText = document.getElementById("reviewText").value;
  let rating = document.getElementById("rating").value;
  summary = summary.trim();
  reviewText = reviewText.trim();
  if (rating > 10 || rating < 0) {
    alert("Invalid rating.");
    return;
  }
  if (!summary) {
    alert("Invalid summary");
    return;
  }
  console.log(summary);
  if (!reviewText) {
    alert("Invalid Review");
    return;
  }
  console.log(reviewText);
  if (!rating) {
    alert("Enter a rating");
    return;
  }
  console.log(rating);
  let reqBody = {
    reviewText: reviewText,
    summary: summary,
    rating: rating,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let id = JSON.parse(this.responseText).id;
      console.log(id);
      let review_wrapper = document.getElementById("reviews");
      let commentHeading = document.createElement("div");
      commentHeading.className = "commentHeading-wrapper";
      let commentBox = document.createElement("div");
      commentBox.className = "commentBox-wrapper";
      let nameTag = document.createElement("p");
      nameTag.innerHTML = username;
      let scoreTag = document.createElement("p");
      scoreTag.innerHTML = "Rating: " + rating;
      let reviewTag = document.createElement("p");
      reviewTag.innerHTML = summary;

      commentHeading.append(nameTag, scoreTag);
      commentBox.appendChild(reviewTag);
      let anchor = document.createElement("a");
      anchor.href = `/reviews/${id}`;
      anchor.id = "commentLink";
      anchor.append(commentHeading, commentBox);
      let newReview = document.createElement("div");
      newReview.className = "singleReview-wrapper";
      newReview.append(anchor);
      console.log(newReview.className);
      review_wrapper.append(newReview);

      document.getElementById("summary").value = "";
      document.getElementById("reviewText").value = "";
      document.getElementById("rating").value = "";
    } else if (this.readyState === 4 && this.status === 400) {
      console.log("something went wrong");
    }
  };
  xhttp.open("POST", `/movies/${mid}/reviews`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(reqBody));
}

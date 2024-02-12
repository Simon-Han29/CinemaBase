function toggleFollow(pid, username, uid) {
  if (btn.classList == "btnFollow") {
    let reqBody = {
      pid: pid,
      username: username,
    };

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Follow successful");
      } else if (this.readyState === 4 && this.status === 409) {
        alert("Already following this user");
      }
    };
    xhttp.open("POST", `/user/${uid}/folowedUsers`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqBody));
    btn.classList.remove("btnFollow");
    btn.innerHTML = "Following";
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log("UnFollow successful");
        // btn.setAttribute("onclick", "add(" + title + ", " + mid + ", " + uid + ")");
        // btn.innerText = "Add To List";
      } else if (this.readyState === 4 && this.status === 404) {
        // Here would be where you would handle errors from the request
        alert("Cannot unfollow since you are not following");
      }
    };
    xhttp.open("DELETE", `/user/${uid}/followedUsers/${pid}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
    btn.classList.add("btnFollow");
    btn.innerHTML = "Follow";
  }
}

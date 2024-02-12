function toggleFollow(uid, pid) {
  let btn = document.getElementById("btnState");
  if (btn.classList == "btnFollow") {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Follow successful");
      } else if (this.readyState === 4 && this.status === 404) {
        alert("Cannot delete since you are not following");
      }
    };
    xhttp.open("DELETE", `/user/${uid}/followedPeople/${pid}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();

    btn.classList.remove("btnFollow");
    btn.innerHTML = "Follow";
  } else {
    console.log("button clicked");
    console.log(uid);
    console.log(pid);
    let reqBody = {
      pid: pid,
    };
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Follow successful");
      } else if (this.readyState === 4 && this.status === 409) {
        alert("Already following this person");
      }
    };
    xhttp.open("POST", `/user/${uid}/followedPeople`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqBody));
    btn.classList.add("btnFollow");
    btn.innerHTML = "Following";
  }
}

function reqRegular() {
  let btn = document.getElementById("btn");
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      btn.innerHTML = "Change to Contributor";
      btn.onclick = reqContributor;
    } else if (this.readyState === 4 && this.status === 409) {
      alert("You already have a regular account");
    }
  };
  xhttp.open("POST", `/account/regAccount`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

function reqContributor() {
  let btn = document.getElementById("btn");
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      btn.innerHTML = "Change to Regular";
      btn.onclick = reqRegular;
    } else if (this.readyState === 4 && this.status === 409) {
      alert("You are already a contributor!");
    }
  };
  xhttp.open("POST", `/account/contributor`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

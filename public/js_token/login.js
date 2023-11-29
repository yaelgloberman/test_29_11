// 9
const init = () => {
  declareEvents();
}

const declareEvents = () => {
  let id_form = document.querySelector("#id_form");
  id_form.addEventListener("submit", (e) => {
    e.preventDefault();
    let body = {
      email: document.querySelector("#id_email").value,
      password: document.querySelector("#id_password").value
    }
    console.log(body);
    doApiPost(body);
  })

}

const doApiPost = async (_body) => {
  let myurl = "https://test-maor.onrender.com/users/login";
  try {
    let resp = await axios({
      url: myurl,
      method: "POST",
      data: JSON.stringify(_body),
      headers: {
        'content-type': "application/json"
      }
    })
    console.log(resp.data);
    if (resp.data.token) {

      // נשמור את הטוקן בלוקאל
      localStorage.setItem("tok", resp.data.token)
      // נשגר את עצמו לדף מידע
      window.location.href = "showUserInfo.html";
    }
    else {
      alert("there problem")
    }
  }
  catch (err) {
    console.log(err);
    alert("Username or password worng");
  }
}


init();
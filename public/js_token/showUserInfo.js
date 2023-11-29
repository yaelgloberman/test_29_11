// 11
const init = () => {
  doApi();
}

const doApi = async () => {
  let myurl = "https://test-maor.onrender.com/users/myInfo";
  let resp = await axios({
    url: myurl,
    method: "GET",
    // בהידר אני מוסף את הקיי של הטוקן מהלוקאל
    headers: {
      "x-api-key": localStorage["tok"],
      'content-type': "application/json"
    }
  })
  console.log(resp.data);
  if (resp.data._id) {
    let item = resp.data;
    document.querySelector("#id_name").innerHTML = item.name;
    document.querySelector("#id_email").innerHTML = item.email;
    document.querySelector("#id_role").innerHTML = item.role;
  }
}

init();
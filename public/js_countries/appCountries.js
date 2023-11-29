// 7
import CountryClass from "./countryClass.js";
import { decalreFormEvent } from "./formEvent.js";

const init = () => {
  doApi();
  decalreFormEvent(doApi);
}

const doApi = async () => {
  let url = "https://test-maor.onrender.com/countries?perPage=20&reverse=yes";
  try {

    let resp = await axios.get(url);
    console.log(resp.data);
    createTable(resp.data)
  }
  catch (err) {
    console.log(err);
    alert("There problem, come back later")
  }
}


const createTable = (_ar) => {
  document.querySelector("#tbody").innerHTML = "";
  _ar.forEach((item, i) => {
    let tr = new CountryClass("#tbody", item, i, doApi);
    tr.render();
  })
}

init();
import Web3 from "web3";
import Crud from "../build/contracts/Crud.json";

let web3, crud;
// let spinner = document.getElementById("loader");
const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      window.ethereum
        .enable()
        .then(() => resolve(new Web3(window.ethereum)))
        .catch((error) => reject(error));
    }
    if (typeof window.web3 !== "undefined") {
      return resolve(new Web3(window.web3.currentProvider));
    }
    resolve(new Web3("http://localhost:9545"));
  });
};

const initContract = () => {
  const deploymentKey = Object.keys(Crud.networks)[0];
  return new web3.eth.Contract(Crud.abi, Crud.networks[deploymentKey].address);
};

const initApp = () => {
  const $create = document.getElementById("create");
  const $createResult = document.getElementById("create-result");
  const $read = document.getElementById("read");
  const $readResult = document.getElementById("read-result");
  const $edit = document.getElementById("edit");
  const $editResult = document.getElementById("edit-result");
  const $delete = document.getElementById("delete");
  const $deleteResult = document.getElementById("delete-result");

  //get all the accounts
  let accounts = [];
  web3.eth.getAccounts().then((acc) => (accounts = acc));

  $create.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.elements[0].value;
    const designation = e.target.elements[1].value;
    const company = e.target.elements[2].value;

    const user = crud.methods
      .insertEmp(name, designation, company)
      .send({ from: accounts[0] });
    document.getElementById("loader").style.display = "block";
    user.then((result) => {
      document.getElementById("loader").style.display = "none";
      console.log(result);
      $createResult.innerHTML = `New Employee is added:<br/> Name: ${name}<br/> Designation: ${designation}<br/> Company: ${company}`;
    });
  });

  $read.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crud.methods
      .readEmpById(id)
      .call()
      .then((result) => {
        $readResult.innerHTML = `Id: ${result[0]} Name: ${result[1]}`;
      })
      .catch((_e) => {
        $readResult.innerHTML = `Ooops... there was an error while trying to read user ${id}`;
      });
  });

  $edit.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    const name = e.target.elements[1].value;
    const designation = e.target.elements[2].value;
    const company = e.target.elements[3].value;

    crud.methods
      .updateEmpById(id, name, designation, company)
      .send({ from: accounts[0] })
      .then((result) => {
        $editResult.innerHTML = `User details are Updated: <br/> ${id}- ${name}- ${designation}- ${company}`;
      })
      .catch((_e) => {
        $editResult.innerHTML = `Ooops... there was an error while trying to update name of user ${id} to ${name}`;
      });
  });

  $delete.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crud.methods
      .DeleteEmpById(id)
      .send({ from: accounts[0] })
      .then((result) => {
        $deleteResult.innerHTML = `Deleted user ${id}`;
      })
      .catch((_e) => {
        $deleteResult.innerHTML = `Ooops... there was an error while trying to delete iser ${id}`;
      });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initWeb3()
    .then((_web3) => {
      web3 = _web3;
      crud = initContract();
      initApp();
    })
    .catch((e) => console.log(e.message));
});

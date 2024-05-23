import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  //We are in the browser and metamask is running
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  //We are on the server OR the user is not running metamask
  const provider = new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/f5d322cbbaa5485696c518e6454c1b72");
  web3 = new Web3(provider);
}

export default web3;

/*
import Web3 from "web3";
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c"
  );
  web3 = new Web3(provider);
}
 
export default web3;
*/

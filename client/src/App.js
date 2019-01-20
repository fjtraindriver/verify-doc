import React, { Component } from "react";
import DocsContract from "./contracts/Docs.json";
import getWeb3 from "./utils/getWeb3";
import sha256 from "sha256";

import Docs from './components/Docs';

class App extends Component {
  state = { docs: [], web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DocsContract.networks[networkId];
      const instance = new web3.eth.Contract(
        DocsContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getDocs);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getDocs = async () => {
    const { contract } = this.state;

    let docs = [];
    const id = await contract.methods.id().call();
    for (let i=0; i<id; i++)
    {
      const doc = await contract.methods.docs(i).call();
      let date = new Date(doc.timestamp * 1000);
      console.log(date);
      doc.timestamp = date.toLocaleDateString();
      docs.push(doc);
    }

    this.setState({ docs: docs  });
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const { accounts, contract } = this.state;

    let file = document.getElementById("fileToVerify").files.item(0);
    var reader = new FileReader();
    
    const scope = this;
    reader.onload = async function(e) {
      let name = file.name;
      let timestamp = Math.floor(Date.now()/1000).toString();
      let hash = sha256(reader.result).toString();
      await contract.methods.createDoc(name, timestamp, hash).send({ from: accounts[0] });
      scope.getDocs();
    }

    reader.readAsDataURL(file);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className="form-group">
            <input type="file" className="form-control-file" id="fileToVerify" required />
          </div>
          <div className="form-group">
          <button type="submit" className="btn btn-primary btn-block">Submit</button>
          </div>
        </form>
        <Docs docs={this.state.docs} />
      </div>
    );
  }
}

export default App;

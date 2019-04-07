import Web3 from "web3";
import votingArtifact from "../../build/contracts/Voting.json";

var candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"};
var meta;

const App = {
  web3: null,
  account: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = votingArtifact.networks[networkId];

      meta = new web3.eth.Contract(
        votingArtifact.abi,
        deployedNetwork.address
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }

    // load all cadidates and votes

    // vote for a candidate
      var candidateNames = Object.keys(candidates);
  
      for (var i = 0; i < candidateNames.length; i++) {
        let name = candidateNames[i];
        // meta.deployed().then(function(f) {
        //   f.totalVotesFor.call(name).then(function(f) {
        //     $("#" + candidates[name]).html(f.toNumber());
        //   })
        // })
        meta.methods.totalVotesFor(web3.utils.asciiToHex(name)).call().then((f) => {
          $("#" + candidates[name]).html(f);
         })
      }

  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});

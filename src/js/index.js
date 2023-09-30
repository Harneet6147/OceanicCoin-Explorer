let walletAddress = "";

document.addEventListener("DOMContentLoaded", function () {
    let connectWallet = document.querySelector(".btnW.btnW--two");

    connectWallet.addEventListener("click", async function () {
        await connectWalletMetamask();
        if (walletAddress.length > 0) {
            localStorage.setItem("walletAddress", walletAddress);
            // console.log(walletAddress);
            let newPageUrl = "start_game.html";
            window.location.href = newPageUrl;
        }
    });
});

///..............................................................................................///

async function connectWalletMetamask() {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
            /* MetaMask is installed */
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            // BoContract = BoStaffContract(provider);
            walletAddress = accounts[0];
            //console.log(accounts[0]);
        } catch (err) {
            console.error(err.message);
        }
    } else {
        /* MetaMask is not installed */
        console.log("Please install MetaMask");
    }
};
async function getCurrentWalletConnected() {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_accounts", []);

            signer = provider.getSigner();

            if (accounts.length > 0) {
                walletAddress = accounts[0];
                //console.log(accounts[0]);
            } else {
                console.log("Connect to MetaMask using the Connect button");
            }
        } catch (err) {
            console.error(err.message);
        }
    } else {
        /* MetaMask is not installed */
        console.log("Please install MetaMask");
    }
};
async function addWalletListener() {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        window.ethereum.on("accountsChanged", (accounts) => {
            walletAddress = accounts[0];
            console.log(accounts[0]);
        });
    } else {
        /* MetaMask is not installed */
        walletAddress = "";
        console.log("Please install MetaMask");
    }
};
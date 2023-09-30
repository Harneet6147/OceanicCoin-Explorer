document.addEventListener("DOMContentLoaded", function () {
    let connectWallet = document.querySelector(".btnW.btnW--one");

    connectWallet.addEventListener("click", function () {
        let newPageUrl = "game.html";

        window.location.href = newPageUrl;
    });
});
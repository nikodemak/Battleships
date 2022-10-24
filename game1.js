document.querySelector(".button.play-guest").addEventListener("click", event => {
    document.querySelector("#menu").style.visibility = "hidden"
    document.querySelector("#lobby").style.visibility = "visible"
})

document.querySelector(".button.play").addEventListener("click", event => {
    document.querySelector("#lobby").style.visibility = "hidden"
    document.querySelector("#game").style.visibility = "visible"
})


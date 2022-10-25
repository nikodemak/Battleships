document.querySelector("#menu").style.visibility = "visible"

if (location.hash == "#game") {
    location.hash = "menu"
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function copyObj(obj, dst) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] == "object") {
                dst[property] = Object()
                copyObj(obj[property], dst[property])
            } else {
                dst[property] = obj[property]
            }
        }
    }
}

function handleHash(e) {
    document.querySelectorAll("#main > div").forEach(element => {
        element.style.visibility = null
    });
    if (location.hash == "" || location.hash == "#menu") {
        document.querySelector("#menu").style.visibility = "visible"
        if (getCookie("loggedIn") == "true") {
            document.querySelector(".button.login").style.visibility = "hidden"
            document.querySelector(".button.register").style.visibility = "hidden"
        }
    }
    if (location.hash == "#lobby") {
        document.querySelector("#lobby").style.visibility = "visible"
    }
    if (location.hash == "#login") {
        document.querySelector("#login").style.visibility = "visible"
    }
    if (location.hash == "#register") {
        document.querySelector("#register").style.visibility = "visible"
    }
    if (location.hash == "#game") {
        document.querySelector("#game").style.visibility = "visible"
    }
}

handleHash()

window.addEventListener('hashchange', handleHash, false)

document.querySelector(".button.play").addEventListener("click", event => {
    let percent = 100/10
    document.querySelector(".board#friendly").style.gridTemplateColumns = (percent+"% [col-start]").repeat(10);
    document.querySelector(".board#friendly").style.gridTemplateColumns = (percent+"% [col-start]").repeat(10);
    document.querySelector(".board#enemy").style.gridTemplateColumns = (percent+"% [col-start]").repeat(10);
    document.querySelector(".board#enemy").style.gridTemplateColumns = (percent+"% [col-start]").repeat(10);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let div = document.createElement("div")
            div.addEventListener("click", e => {
                document.querySelector(".board#friendly").style.width = "40vh"
                document.querySelector(".board#friendly").style.height = "40vh"
                document.querySelector(".board#enemy").style.width = "60vh"
                document.querySelector(".board#enemy").style.height = "60vh"
            })
            document.querySelector(".board#friendly").append(div)
        }
    }
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let div = document.createElement("div")
            div.addEventListener("click", e => {
                document.querySelector(".board#friendly").style.width = "60vh"
                document.querySelector(".board#friendly").style.height = "60vh"
                document.querySelector(".board#enemy").style.width = "40vh"
                document.querySelector(".board#enemy").style.height = "40vh"
            })
            document.querySelector(".board#enemy").append(div)
        }
    }
    setTimeout(() => {
        document.querySelector(".board#friendly").style.width = "60vh"
        document.querySelector(".board#friendly").style.height = "60vh"
    }, 30)
    for (let i = 1; i <= 4; i++) {
        for (let j = 4; j >= i; j--) {
            let div = document.createElement("div")
            div.style.height = i*(60/percent)+"vh"
            div.style.width = (60/percent)+"vh"
            div.draggable = true
            div.addEventListener('wheel', () => {
                div.animate([
                    {transform: "rotate(90deg) scale(0%, 0%)"},
                    {transform: "rotate(0deg) scale(100%, 100%)"}
                ], 500)
                let temp = div.style.height
                div.style.height = div.style.width
                div.style.width = temp
            });
            document.querySelector("#ships").append(div)
        }
    };
})

document.querySelector(".input.button.login").addEventListener("click", event => {
    let XHR = new XMLHttpRequest
    let params = {
        password: document.querySelector(".input.password.login").value
    }
    const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    if (re.test(document.querySelector(".input.username.login").value)) {
        params.email = document.querySelector(".input.username.login").value
    } else {
        params.username = document.querySelector(".input.username.login").value
    }
    copyObj(event, params)
    let search = new URLSearchParams(params).toString()
    XHR.open("POST", "login.php")
    XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    XHR.onload = (event) => {
        if (XHR.responseText == "logged in") {
            location.hash = "menu"
        } else {
            document.querySelector(".input.button.login").value = XHR.responseText
        }
    }
    XHR.send(search)
})

document.querySelector(".input.button.register").addEventListener("click", event => { 
    let XHR = new XMLHttpRequest
    let params = {
        username: document.querySelector(".input.username.register").value,
        email: document.querySelector(".input.email.register").value,
        password: document.querySelector(".input.password.register").value
    }
    copyObj(event, params)
    let search = new URLSearchParams(params).toString()
    XHR.open("POST", "register.php")
    XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    XHR.send(search)
})

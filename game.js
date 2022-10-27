// short for document.querySelector
function findElem(selector) {
    return document.querySelector(selector)
}

let state = {
    gameStarted: false
}

findElem("#menu").style.visibility = "visible"

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

function isInsideBoard(sizeX, sizeY, x, y, ox, oy) {
    return (x+ox < sizeX && y+oy < sizeY && x+ox > 0 && y+oy > 0)
}

// return true if position is valid
function verifyShipPos(data, sizeX, sizeY, x, y) {
    for (let o=-1; o < data.size + 1; o++) {
        for (k=-1; k < 2; k++) {
            if (data.rot > 0) {
                if (!isInsideBoard(sizeX, sizeY, x, y, o, k)) {
                    continue
                }
                if (findElem(".board#friendly > .pos"+((x+o)*10+y+k)).classList.contains("filled")) {
                    return false
                }
            } else {
                if (!isInsideBoard(sizeX, sizeY, x, y, k, o)) {
                    continue
                }
                if (findElem(".board#friendly > .pos"+((x+k)*10+y+o)).classList.contains("filled")) {
                    return false
                }
            }
        }
    }
    if (data.rot == 1 && x+data.size > sizeX) {
        return false
    }
    if (data.rot == 0 && y+data.size > sizeY) {
        return false
    }
    return true
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
        findElem("#menu").style.visibility = "visible"
        if (getCookie("loggedIn") == "true") {
            findElem(".button.login").style.visibility = "hidden"
            findElem(".button.register").style.visibility = "hidden"
        }
    }
    if (location.hash == "#lobby") {
        findElem("#lobby").style.visibility = "visible"
    }
    if (location.hash == "#login") {
        findElem("#login").style.visibility = "visible"
    }
    if (location.hash == "#register") {
        findElem("#register").style.visibility = "visible"
    }
    if (location.hash == "#game") {
        
    }
}

handleHash()

window.addEventListener('hashchange', handleHash, false)

function setupGame() {
    findElem("#game").style.visibility = "visible"
    let sizeX = 10
    let sizeY = 10
    let percentX = 100/sizeX
    let percentY = 100/sizeY
    findElem(".board#friendly").style.gridTemplateColumns = (percentX+"% [col-start]").repeat(sizeX);
    findElem(".board#friendly").style.gridTemplateRows = (percentX+"% [col-start]").repeat(sizeY);
    findElem(".board#enemy").style.gridTemplateColumns = (percentY+"% [col-start]").repeat(sizeX);
    findElem(".board#enemy").style.gridTemplateRows = (percentY+"% [col-start]").repeat(sizeY);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let div = document.createElement("div")
            div.classList.add("pos"+(10*i+j), "empty")
            div.addEventListener("dragenter", (e) => { //handle ship dragging effects
                e.preventDefault()
                let data = JSON.parse(e.dataTransfer.getData("ship"))
                if (!verifyShipPos(data, sizeX, sizeY, i, j)) {
                    return
                }
                setTimeout(data => {
                    for (let k=0; k < data.size; k++) {
                        if(data.rot > 0) {
                            findElem(".board#friendly > .pos"+((i+k)*10+j)).classList.add("hinted")
                        } else {
                            findElem(".board#friendly > .pos"+(i*10+j+k)).classList.add("hinted")
                        }
                    }
                }, 0, data)
            })
            div.addEventListener("dragleave", e => { //handle ship dragging effects
                e.preventDefault()
                let data = JSON.parse(e.dataTransfer.getData("ship"))
                if (!verifyShipPos(data, sizeX, sizeY, i, j)) {
                    return
                }
                for (let k=0; k < data.size; k++) {
                    if(data.rot > 0) {
                        findElem(".board#friendly > .pos"+((i+k)*10+j)).classList.remove("hinted")
                    } else {
                        findElem(".board#friendly > .pos"+(i*10+j+k)).classList.remove("hinted")
                    }
                }
            })
            div.addEventListener("dragover", (e) => {
                e.preventDefault()
            })
            div.addEventListener("drop", e => { // handle dropping a ship
                e.preventDefault()
                let data = JSON.parse(e.dataTransfer.getData("ship"))
                if (!verifyShipPos(data, sizeX, sizeY, i, j)) {
                    return
                }
                for (let k=0; k < data.size; k++) {
                    if(data.rot > 0) {
                        findElem(".board#friendly > .pos"+((i+k)*10+j)).classList.remove("hinted")
                    } else {
                        findElem(".board#friendly > .pos"+(i*10+j+k)).classList.remove("hinted")
                    }
                }
                let event = {
                    event: "place",
                    pos: i*10+j,
                    rot: data.rot,
                    size: data.size
                }
                send(event)
            })
            findElem(".board#friendly").append(div)
        }
    }
    for (let i = 0; i < 10; i++) { // enemy board
        for (let j = 0; j < 10; j++) {
            let div = document.createElement("div")
            div.classList.add("pos"+(10*i+j), "empty")
            div.addEventListener("click", e => {
                let event = {
                    event: "shoot",
                    pos: i*10+j
                }
                send(event)
            })
            findElem(".board#enemy").append(div)
        }
    }
    setTimeout(() => {
        findElem(".board#friendly").style.width = "60vh"
        findElem(".board#friendly").style.height = "60vh"
    }, 30)
    for (let i = 1; i <= 4; i++) {
        for (let j = 4; j >= i; j--) {
            let div = document.createElement("div")
            div.classList.add("ship", "size"+i, "rot0")
            div.style.height = i*(40/percentY)+"vh"
            div.style.width = i*(40/percentY)+"vh"
            div.draggable = true
            div.addEventListener('wheel', () => {
                if(div.classList.contains("rot1"))
                {
                    div.classList.remove("rot1")
                    div.classList.add("rot0")
                }
                else
                {
                    div.classList.remove("rot0")
                    div.classList.add("rot1")
                }
            });
            div.addEventListener("dragstart", e => {
                e.dataTransfer.setData("ship", JSON.stringify({
                    size: i,
                    rot: (div.classList.contains("rot1")) ? 0 : 1
                }))
            })
            div.addEventListener("dragend", e => {
                if (e.dataTransfer.dropEffect != "none") {
                    div.style.visibility = "hidden"
                }
            })
            findElem("#ships").append(div)
        }
    };
}

function update()
{
    if (!state.gameStarted && state.opponent) {
        setupGame()
        state.gameStarted = true
    }
    if (state.turn) {
        findElem(".board#friendly").style.width = "60vh"
        findElem(".board#friendly").style.height = "60vh"
        findElem(".board#enemy").style.width = "40vh"
        findElem(".board#enemy").style.height = "40vh"
    } else {
        findElem(".board#friendly").style.width = "40vh"
        findElem(".board#friendly").style.height = "40vh"
        findElem(".board#enemy").style.width = "60vh"
        findElem(".board#enemy").style.height = "60vh"
    }
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) { // player board
            switch (state.board[i][j]) {
                case 0:
                    findElem(".board#friendly > .pos"+((i)*10+j)).classList.remove("filled", "empty", "shot")
                    findElem(".board#friendly > .pos"+((i)*10+j)).classList.add("empty")
                    break;
                case 1:
                    findElem(".board#friendly > .pos"+((i)*10+j)).classList.remove("filled", "empty", "shot")
                    findElem(".board#friendly > .pos"+((i)*10+j)).classList.add("shot")
                    break;
                case 2:
                    findElem(".board#friendly > .pos"+((i)*10+j)).classList.remove("filled", "empty", "shot")
                    findElem(".board#friendly > .pos"+((i)*10+j)).classList.add("filled")
                    break;
                default:
                    break;
            } 
            switch (state.eboard[i][j]) {//enemy board
                case 0:
                    findElem(".board#enemy > .pos"+((i)*10+j)).classList.remove("filled", "empty", "shot")
                    findElem(".board#enemy > .pos"+((i)*10+j)).classList.add("empty")
                    break;
                case 1:
                    findElem(".board#enemy > .pos"+((i)*10+j)).classList.remove("filled", "empty", "shot")
                    findElem(".board#enemy > .pos"+((i)*10+j)).classList.add("shot")
                    break;
                default:
                    break;
            }
        }
    }
}

function recv()
{
    let XHR = new XMLHttpRequest
    XHR.open("GET", "poll.php")
    XHR.onload = (event) => {
        try {
            let resp = JSON.parse(event.target.responseText)
            copyObj(resp, state)
            update()
            recv()
        } catch(err) {
            console.log(err)
            recv()
        }
    }
    XHR.send()
}

function send(event) {
    let XHR = new XMLHttpRequest
    let params = {}
    copyObj(event, params)
    let search = new URLSearchParams(params).toString()
    XHR.open("GET", "update.php?"+search)
    XHR.send()
}

findElem(".button.play").addEventListener("click", () => {
    let XHR = new XMLHttpRequest
    XHR.open("GET", "lobby.php")
    XHR.onload = (event) => {
        recv()
    }
    XHR.send()
})

findElem(".input.button.login").addEventListener("click", event => {
    let XHR = new XMLHttpRequest
    let params = {
        password: findElem(".input.password.login").value
    }
    const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    if (re.test(findElem(".input.username.login").value)) {
        params.email = findElem(".input.username.login").value
    } else {
        params.username = findElem(".input.username.login").value
    }
    let search = new URLSearchParams(params).toString()
    XHR.open("POST", "login.php")
    XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    XHR.onload = (event) => {
        if (XHR.responseText == "logged in") {
            location.hash = "menu"
        } else {
            findElem(".input.button.login").value = XHR.responseText
        }
    }
    XHR.send(search)
})

findElem(".input.button.register").addEventListener("click", event => { 
    let XHR = new XMLHttpRequest
    let params = {
        username: findElem(".input.username.register").value,
        email: findElem(".input.email.register").value,
        password: findElem(".input.password.register").value
    }
    let search = new URLSearchParams(params).toString()
    XHR.open("POST", "register.php")
    XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    XHR.send(search)
})

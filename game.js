
let block = false
function unblock() {
    block = false
}

let state = {
    turn: false,
    started: false,
    eventType: false,
    event: {}
}

let app = new PIXI.Application({ width: 640, height: 360, resizeTo: window });
document.body.appendChild(app.view);

PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2



let table = new PIXI.Container
table.name = "eboard"
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        let td = new PIXI.Graphics
        td.beginFill(0xFFFFFF);
        td.drawRect(0*60, 0*60, 50, 1080);
        td.endFill();
        td.tint = 0x0000FF
        td.name = i*10+j
        td.interactive = true
        td.on('click' ,() => {
            state.eventType = "shoot"
            td.tint = 0xFF0000;
            state.event = Array(Number(td.name))
            //update()
        })
        table.addChild(td);
    }
}
table.position.set(100,0);
//table.scale.set(0.5,0.5);
app.stage.addChild(table);
document.body.append(table)
table = document.createElement("table")
table.id = "board"
for (let i = 0; i < 10; i++) {
    let tr = document.createElement("tr")
    for (let j = 0; j < 10; j++) {
        let td = document.createElement("td")
        td.id = i*10+j
        td.onclick = function(event) {
            state.eventType = "place"
            state.event[0] = td.id
            state.event[1] = 0
            state.event[2] = 2
        }
        tr.appendChild(td)
    }
    table.appendChild(tr)
}
document.body.append(table)




function update() {
    if (block) {return}
    block = true
    let XHR = new XMLHttpRequest
    let params = {};
    if (state.eventType == "shoot") {
        params.event = "shoot"
        params.shoot = state.event[0]
        state.eventType = false
        state.event = {}
    }
    if (state.eventType == "place") {
        params.event = "place"
        params.field = state.event[0]
        params.rot = state.event[1]
        params.size = state.event[2]
        state.eventType = false
        state.event = {}
    }
    const target = new URL(document.location +'/update.php');
    target.search = new URLSearchParams(params).toString();
    XHR.open("GET", target.toString())
    XHR.onerror = unblock
    XHR.onabort = unblock
    XHR.ontimeout = unblock
    XHR.onload = (event) => {
        try {
            let tab = JSON.parse(event.target.responseText)
            console.log(tab.opponent)
            if (tab.opponent == "waiting") {
                if(!document.getElementById("info")) {
                    let info = document.createElement("h2")
                    info.id = "info"
                    info.textContent = "Waiting"
                    document.body.append(info)
                }
                document.getElementById("eboard").hidden = true
            } else if (document.getElementById("eboard").hidden) {
                document.getElementById("eboard").hidden = false
            }
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let td = document.getElementById("e"+(i*10+j))
                    if(tab.eboard[i][j] == 1) {
                        td.style = "background-color:black;"
                    } else {
                        td.style = "background-color:red;"
                    }
                }
            }
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let td = document.getElementById((i*10+j))
                    switch (tab.board[i][j]) {
                        case 0:
                            td.style = ""
                            break;
                        case 1:
                            td.style = "background-color:black;"
                            break;
                        case 2:
                            td.style = "background-color:green;"
                            break;
                        default:
                            break;
                    }
                }
            }
            unblock()
        } catch(err) {
            console.log(err);
            unblock();
        }
    }
    XHR.send()
}
/*
setInterval(update, 500)

let table = document.createElement("table")
table.id = "eboard"
for (let i = 0; i < 10; i++) {
    let tr = document.createElement("tr")
    for (let j = 0; j < 10; j++) {
        let td = document.createElement("td")
        td.id = "e" + (i*10+j)
        td.style = "background-color:red;"
        td.onclick = function(event) {
            state.eventType = "shoot"
            state.event = [Number(td.id.slice(1))]
            update()
        }
        tr.appendChild(td)
    }
    table.appendChild(tr)
}
let shipRotation = 0
document.getElementById("rotBtn").addEventListener("click", event => {
    shipRotation = (shipRotation==0) ? 1 : 0;
})
let shipSize = 1
document.getElementById("sizeDecBtn").addEventListener("click", event => {
    shipSize = Math.min(Math.max(shipSize-1, 1), 4)
    document.getElementById("sizeDisp").innerText = shipSize
})
document.getElementById("sizeIncBtn").addEventListener("click", event => {
    shipSize = Math.min(Math.max(shipSize+1, 1), 4)
    document.getElementById("sizeDisp").innerText = shipSize
})
document.getElementById("centerDiv").append(table)
table = document.createElement("table")
table.id = "board"
for (let i = 0; i < 10; i++) {
    let tr = document.createElement("tr")
    for (let j = 0; j < 10; j++) {
        let td = document.createElement("td")
        td.id = i*10+j
        td.onclick = function(event) {
            state.eventType = "place"
            state.event = [td.id, shipRotation, shipSize]
        }
        tr.appendChild(td)
    }
    table.appendChild(tr)
}
document.getElementById("centerDiv").append(table)*/
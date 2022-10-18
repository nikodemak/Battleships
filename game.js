let state = {}

let app = new PIXI.Application({ width: 640, height: 360, resizeTo: window })
document.body.appendChild(app.view)

PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2


let etable = new PIXI.Container
etable.name = "eboard"
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        let td = new PIXI.Graphics
        td.beginFill(0xFFFFFF)
        td.drawRect(i*60, j*60, 50, 50)
        td.endFill()
        td.tint = 0xFF0000
        td.name = i*10+j
        td.interactive = true
        td.on('click', () => {
            let event = {
                event: "shoot",
                pos: i*10+j
            }
            send(event)
        })
        etable.addChild(td)
    }
}
etable.position.set(0, 0)
//table.scale.set(0.5,0.5)
app.stage.addChild(etable)
let table = new PIXI.Container
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        let td = new PIXI.Graphics
        td.beginFill(0xFFFFFF)
        td.drawRect(i*60, j*60, 50, 50)
        td.endFill()
        td.tint = 0x0000FF
        td.name = i*10+j
        td.interactive = true
        td.on('click', () => {
            let event = {
                event: "place",
                pos: i*10+j,
                rot: 1,
                size: 2
            }
            send(event)
        })
        table.addChild(td)
    }
}
table.position.set(0, etable.position.y + 10*60)
app.stage.addChild(table)


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

function update()
{
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let td = table.getChildByName(i*10+j) // player board
            switch (state.board[i][j]) {
                case 0:
                    td.tint = 0x0000FF
                    break;
                case 1:
                    td.tint = 0x000000
                    break;
                case 2:
                    td.tint = 0x00FF00
                    break;
                default:
                    break;
            }
            td = etable.getChildByName(i*10+j) //enemy board
            switch (state.eboard[i][j]) {
                case 0:
                    td.tint = 0xFF0000
                    break;
                case 1:
                    td.tint = 0x000000
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
/*    XHR.onerror = recv
    XHR.onabort = recv
    XHR.ontimeout = recv*/
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
    const target = new URL(document.location +'update.php')
    target.search = new URLSearchParams(params).toString()
    XHR.open("GET", target.toString())
    XHR.send()
}

recv()
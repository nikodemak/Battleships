
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
const vertexSrc = `

    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec2 vUvs;

    void main() {

        vUvs = aUvs;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`;


const fragmentSrc = `
//Based on this: https://www.shadertoy.com/view/wtlSWX
precision mediump float;

varying vec2 vUvs;

uniform sampler2D noise;
uniform float time;

//Distance function. Just calculates the height (z) from x,y plane with really simple length check. Its not exact as there could be shorter distances.
vec2 dist(vec3 p)
{
    float id = floor(p.x)+floor(p.y);
    id = mod(id, 2.);
    float h = texture2D(noise, vec2(p.x, p.y)*0.04).r*5.1;
    return vec2(h-p.z,id);
}

//Light calculation.
vec3 calclight(vec3 p, vec3 rd)
{
    vec2 eps = vec2( 0., 0.001);
    vec3 n = normalize( vec3(
    dist(p+eps.yxx).x - dist(p-eps.yxx).x,
    dist(p+eps.xyx).x - dist(p-eps.xyx).x,
    dist(p+eps.xxy).x - dist(p-eps.xxy).x
    ));

    vec3 d = vec3( max( 0., dot( -rd ,n)));

    return d;
}

void main()
{
    vec2 uv = vec2(vUvs.x,1.-vUvs.y);
    uv *=2.;
    uv-=1.;

    vec3 cam = vec3(0.,time -2., -3.);
    vec3 target = vec3(sin(time)*0.1, time+cos(time)+2., 0. );
    float fov = 2.2;
    vec3 forward = normalize( target - cam);
    vec3 up = normalize(cross( forward, vec3(0., 1.,0.)));
    vec3 right = normalize( cross( up, forward));
    vec3 raydir = normalize(vec3( uv.x *up + uv.y * right + fov*forward));

    //Do the raymarch
    vec3 col = vec3(0.);
    float t = 0.;
    for( int i = 0; i < 100; i++)
    {
    vec3 p = t * raydir + cam;
    vec2 d = dist(p);
    t+=d.x*0.5;//Jump only half of the distance as height function used is not really the best for heightmaps.
    if(d.x < 0.001)
    {
        vec3 bc = d.y < 0.5 ? vec3(1.0, .8, 0.) :
                vec3(0.8,0.0, 1.0);
        col = vec3( 1.) * calclight(p, raydir) * (1. - t/150.) *bc;
        break;
    }
    if(t > 1000.)
    {
        break;
    }
    }
    gl_FragColor = vec4(1.0,1.0, 1.0, 1.);
}`;


PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2
// Create the application helper and add its render target to the page


const uniforms = {
    noise: PIXI.Texture.from('examples/assets/perlin.jpg'),
    time: 0,
};

uniforms.noise.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
uniforms.noise.baseTexture.mipmap = false;


//simpleShader.program.fragmentSrc = "#version 300 es \n" + simpleShader.program.fragmentSrc
//simpleShader.program.vertexSrc = "#version 300 es \n" + simpleShader.program.vertexSrc
const geometry = new PIXI.Geometry()
    .addAttribute('aVertexPosition', // the attribute name
        [0, 0, // x, y
            1, 0, // x, y
            1, 1,
            0, 1], // x, y
        2) // the size of the attribute
    .addAttribute('aUvs', // the attribute name
        [0, 0, // u, v
            1, 0, // u, v
            1, 1,
            0, 1], // u, v
        2) // the size of the attribute
    .addIndex([0, 1, 2, 0, 2, 3]);
// Build the shader and the quad.
const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);
const quad = new PIXI.Mesh(geometry, shader);
quad.position.set(0, 0);
quad.scale.set(app.screen.width, app.screen.height);

app.stage.addChild(quad);

// start the animation..
let time = 0;
app.ticker.add((delta) => {
    time += 1 / 60;
    quad.shader.uniforms.time = time;
});

/*// Create the sprite and add it to the stage
let sprite = PIXI.Sprite.from('sample.png');
sprite.width = app.screen.width
sprite.filters = [simpleShader]
app.stage.addChild(sprite);*/
/*
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
            state.event = Array(Number(td.id.slice(1)))
            update()
        }
        tr.appendChild(td)
    }
    table.appendChild(tr)
}
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

let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta;
  sprite.x = (app.screen.width - sprite.width)/2 + (Math.cos(elapsed/50.0) * (app.screen.width - sprite.width)/2);
});



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
            state.event = Array(Number(td.id.slice(1)))
            update()
        }
        tr.appendChild(td)
    }
    table.appendChild(tr)
}
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
document.body.append(table)*/
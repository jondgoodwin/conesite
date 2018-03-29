// WebGL helper functions


// Window functions

let gl = null; // WebGL Context
let imports;

function fetchlocal(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest
    xhr.onload = function() {
      resolve(new Response(xhr.responseText, {status: xhr.status}))
    }
    xhr.onerror = function() {
      reject(new TypeError('Local request failed'))
    }
    xhr.open('GET', url)
    xhr.send(null)
  })
}

// Sets up webgl context as canvas inside #webgl element nodeName
// It initializes the scene and triggers the endless render loop
window.onload = async function() {
    let owner = document.getElementById("webgl");
    let canvas = document.createElement('canvas');
    owner.appendChild(canvas);

    try {
        gl = canvas.getContext("webgl");
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
        return;
    }
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    glResize();
    window.addEventListener( "resize", glResize );

    imports = {};
    WebAssembly.instantiateStreaming(fetchlocal('cone.wasm'), {"js": imports})
    .then(mod => {
        let rad = mod.instance.exports.degreeToRadians(45.);
    });

    initScene();
    glRenderLoop();
}

// When window is resized, recalculate webgl context dimensions
function glResize(){
    let owner = document.getElementById("webgl");
    if (owner.nodeName == "BODY") {
        // let pr = window.devicePixelRatio;
        gl.canvas.width = (window.innerWidth) | 0;
        gl.canvas.height = (window.innerHeight) | 0;
    }
    else {
        gl.canvas.width = owner.offsetWidth;
        gl.canvas.height = owner.offsetHeight;
    }
    // exports['engine_window_resize']( gl.canvas.width, gl.canvas.height );
    gl.viewportWidth = gl.canvas.width;
    gl.viewportHeight = gl.canvas.height;
}

// Call drawScene and updateScene 60fps
let lastTime = 0;
function glRenderLoop() {
    window.requestAnimationFrame(glRenderLoop);
    drawScene();
    let timeNow = new Date().getTime();
    if (lastTime != 0) {
        updateScene(timeNow - lastTime);
    }
    lastTime = timeNow;
}

// Create a store of JS objects that wasm can refer to by id
let glObjFreelist = [];
let glObjMap = [ null ];

function glNewObj(obj) {
    if( glObjFreelist.length == 0 )
    {
        glObjMap.push( obj );
        return glObjMap.length - 1;
    }
    else
    {
        let id = glObjFreelist.shift();
        glObjMap[id] = obj;
        return id;
    }
}

function glFreeObj(id) {
    delete glObjMap[id];
    glObjFreelist.push( id );
}

function getShader(type, src) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(vssrc, fssrc) {
    let vertexShader = getShader(gl.VERTEX_SHADER, vssrc);
    let fragmentShader = getShader(gl.FRAGMENT_SHADER, fssrc);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);
    return shaderProgram;
}

let gl = null;

window.onload = async function() {
    var owner = document.getElementById("webgl");
    var canvas = document.createElement('canvas');
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

    initScene();
    glRenderLoop();
}

function glResize(){
    var owner = document.getElementById("webgl");
    if (owner.nodeName == "BODY") {
        let pr = window.devicePixelRatio;
        gl.canvas.width = (pr * window.innerWidth) | 0;
        gl.canvas.height = (pr * window.innerHeight) | 0;
    }
    else {
        gl.canvas.width = owner.offsetWidth;
        gl.canvas.height = owner.offsetHeight;
    }
    // exports['engine_window_resize']( gl.canvas.width, gl.canvas.height );
    gl.viewportWidth = gl.canvas.width;
    gl.viewportHeight = gl.canvas.height;
}

function glRenderLoop() {
	window.requestAnimationFrame(glRenderLoop);
	drawScene();
	animate();
}

function getShader(type, src) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function initShader(vssrc, fssrc) {
	var vertexShader = getShader(gl.VERTEX_SHADER, vssrc);
	var fragmentShader = getShader(gl.FRAGMENT_SHADER, fssrc);

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


"use strict";
import * as THREE from 'three';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(32, 32);
let renderSize = 32;
document.getElementById("threejs_container").appendChild(renderer.domElement);
renderer.domElement.classList.add("threejs_canvas");

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0xcc2200});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 2;
/*
let renderTarget = new THREE.WebGLRenderTarget(32, 32);
window["renderTarget"] = renderTarget;

// 32 by 32 buffer, 3 bytes for each color value
let renderBuffer = new ArrayBuffer(32 * 32 * 4);
window["renderBuffer"] = renderBuffer;

// View for this buffer
let bufferView = new Uint8Array(renderBuffer);
window["bufferView"] = bufferView;
*/

let lastTime = Date.now();
function animate () {
	let newTime = Date.now();
	let deltaTime = newTime - lastTime;
	lastTime = newTime;
	// Move camera around when keys are pressed
	let xDelta = 0;
	let yDelta = 0;
	if (upPressed) {
		yDelta -= 1;
	}
	if (downPressed) {
		yDelta += 1;
	}
	if (leftPressed) {
		xDelta -= 1;
	}
	if (rightPressed) {
		xDelta += 1;
	}
	if (interactPressed) {
		renderSize += deltaTime * 0.1;
		renderer.setSize(Math.round(renderSize), Math.round(renderSize));
		resizeFor3D();
	}
	let rot = camera.rotation.y;
	let xDeltaAdj = xDelta * Math.cos(rot) + yDelta * Math.sin(rot);
	let yDeltaAdj = yDelta * Math.cos(rot) - xDelta * Math.sin(rot);
	if (xDelta !== 0 && yDelta !== 0) {
		xDeltaAdj *= 0.707;
		yDeltaAdj *= 0.707;
	}
	camera.position.x += xDeltaAdj * 0.001 * deltaTime;
	camera.position.z += yDeltaAdj * 0.001 * deltaTime;
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	//renderer.setRenderTarget(null);
	renderer.render(scene, camera);

	//renderer.setRenderTarget(renderTarget);
	//renderer.render(scene, camera);
	//renderBuffer = new ArrayBuffer(32 * 32 * 3);
	//renderer.readRenderTargetPixels(renderTarget, 0, 0, 32, 32, renderBuffer)
}
renderer.setAnimationLoop(animate);

function resizeFor3D () {
	let grid = document.getElementById("grid");
	if (grid === null) {
		setTimeout(resizeFor3D, 100);
		return;
	}
	let canvas3D = renderer.domElement;
	let rect = grid.getBoundingClientRect();
	if (rect.width > 0) {
		canvas3D.style.left = rect.x + "px";
		canvas3D.style.top = rect.y + "px";
		canvas3D.style.width = rect.width + "px";
		canvas3D.style.height = rect.height + "px";
	}
	else {
		setTimeout(resizeFor3D, 100);
		return;
	}
}
addEventListener("resize", resizeFor3D);
resizeFor3D();

function transitionInto3D () {
	console.log("Switching to 3d gameplay");
	PS.statusText("My flashlight turned off. Maybe I can [click] and get it back on.");
	window.addEventListener("click", clickFunc);
}
window.transitionInto3D = transitionInto3D;

let in3DMode = false;
function clickFunc () {
	if (!document.fullscreen) {
		// Request full screen
		let fullscreenReq = body.requestFullscreen();
		// Ask the user for one more click for the pointer lock
		PS.statusText("Ok, one more [click] should do it.");
	}
	else {
		// Request pointer lock
		let pointerLockReq = body.requestPointerLock();
		// Show 3D canvas
		document.getElementsByClassName("threejs_canvas")[0].style.opacity = 1;
		// All set on getting clicks from user
		PS.statusText("There we go. Sure is dark down here...");
		// Mouse event listener
		addEventListener("mousemove", mouseMoveFunc);
		// Enable 3d mode
		in3DMode = true;
		// Set last time
		lastTime = Date.now();
	}
}

function mouseMoveFunc (e) {
	camera.rotation.y -= e.movementX * 0.001;
	camera.rotation.x -= e.movementY * 0.001;
}

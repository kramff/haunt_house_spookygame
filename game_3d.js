"use strict";
import * as THREE from 'three';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(32, 32);
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

function animate () {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	//renderer.setRenderTarget(null);
	renderer.render(scene, camera);

	//renderer.setRenderTarget(renderTarget);
	//renderer.render(scene, camera);
	//renderBuffer = new ArrayBuffer(32 * 32 * 3);
	//renderer.readRenderTargetPixels(renderTarget, 0, 0, 32, 32, renderBuffer)
}
//renderer.setAnimationLoop(animate);

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


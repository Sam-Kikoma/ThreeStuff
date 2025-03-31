import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// Axes Helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);
// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);

//
const randomColor = (() => {
	"use strict";

	const randomInt = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	return () => {
		var h = randomInt(0, 360);
		var s = randomInt(42, 98);
		var l = randomInt(40, 90);
		return `hsl(${h},${s}%,${l}%)`;
	};
})();
//

const material = new THREE.MeshBasicMaterial({});

const posX = -20;
const posY = -20;
const spacing = 2;
const cubes = [];
let gridSize = 20;

for (let i = 0; i < gridSize; i++) {
	for (let j = 0; j < gridSize; j++) {
		const mesh = new THREE.Mesh(geometry, material);
		material.color.setStyle(randomColor());
		mesh.position.x = posX + j * spacing; // Columns
		mesh.position.y = posY + i * spacing; // Rows
		scene.add(mesh);
		cubes.push(mesh);
	}
}

gsap.to(
	cubes.map((cube) => cube.position),
	{
		duration: 1,
		z: 3,
		repeat: -1,
		yoyo: true,
		stagger: {
			grid: [20, 20], // Grid size?
			from: "center",
			axis: "",
			amount: 1.5,
		},
	}
);
// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 30;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();

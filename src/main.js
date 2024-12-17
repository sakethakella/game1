import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { color } from 'three/tsl';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import star from '../src/moon1.jpg';

//required things
const container= document.getElementById('threejs-container');
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,1000);
const orbit=new OrbitControls(camera, renderer.domElement);
camera.position.set(0,10,-25);
orbit.update();
// const axis=new THREE.AxesHelper(5);
// scene.add(axis);
// const grid=new THREE.GridHelper(30,10);
// scene.add(grid);
scene.background=new THREE.Color(0x000000);
const light2=new THREE.AmbientLight();
scene.add(light2);
const light=new THREE.DirectionalLight();
scene.add(light);
light.position.set(0,20,10);
//
// const particleCount = 5000;
// const particles = new THREE.BufferGeometry();
// const positions = [];

// for (let i = 0; i < particleCount; i++) {
//   positions.push(
//     (Math.random() - 0.5) * 100, // X
//     (Math.random() - 0.5) * 100, // Y
//     (Math.random() - 0.5) * 100  // Z
//   );
// }
// particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

// const material = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.1 });
// const pointCloud = new THREE.Points(particles, material);
// scene.add(pointCloud);
//moon
const moongeo=new THREE.SphereGeometry(8,20,20);
const moontex=new THREE.TextureLoader().load(star);
const moonmat=new THREE.MeshBasicMaterial({map:moontex});;
const moon=new THREE.Mesh(moongeo,moonmat);
scene.add(moon);
moon.position.set(20,5,80);
//player

const boxGeometry = new THREE.BoxGeometry(1,1,1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
box.position.y = 1.5;
box.position.z=-10;

const pathBlocks = [];
const blockGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x333fff });

for (let i = 0; i < 5; i++) {
  const block = new THREE.Mesh(blockGeometry, blockMaterial);
  block.position.set(Math.random() > 0.5 ? 1 : -1, 0.5, (i-5) * 2); // Positioned along x-axis
  scene.add(block);
  pathBlocks.push(block);
}


box.position.x=pathBlocks[0].position.x;
box.position.z=pathBlocks[0].position.z;
let z=0;
let jumpSpeed = 1;
let gravity = 0.1;
let velocity = 0;
const animate=(time)=>{
  moon.rotation.y+=0.02;
  renderer.render(scene,camera);
  if(z===1){
    box.position.z+=2;
    z=0;
  }

  else if(z===2){
    velocity -= gravity; // Apply gravity
    box.position.y += velocity;
    box.position.x += 0.1;
    box.position.z+=0.1;
    // End jump when back to ground level
    if (box.position.y <= 1.5) {
      box.position.y = 1.5;
      z = false;
      velocity = 0;
    }
  }
  else if(z===-2){
    velocity -= gravity; // Apply gravity
    box.position.y += velocity;
    box.position.x -= 0.1;
    box.position.z+=0.1;
    // End jump when back to ground level
    if (box.position.y <= 1.5) {
      box.position.y = 1.5;
      z = false;
      velocity = 0;
    }
  }
  else if(z===3){
    velocity -= gravity; // Apply gravity
    box.position.y += velocity;
    box.position.z += 0.1;
    // End jump when back to ground level
    if (box.position.y <= 1.5) {
      box.position.y = 1.5;
      z = false;
      velocity = 0;
    }
  }
}
renderer.setAnimationLoop(animate);
let x= document.querySelectorAll('.sco');
let score=0;
let j=5;
let k=0;
document.addEventListener('keydown',(e)=>{
  const key=e.key;
  if(key==='ArrowUp'){
    z=3;
    velocity = jumpSpeed;
  }
  else if(key==='ArrowLeft'){
    z=2;
    velocity=jumpSpeed;
  }
  else if(key==='ArrowRight'){
    z=-2;
    velocity=jumpSpeed;
  }
  const validMove = pathBlocks.some(block =>
    Math.abs(block.position.x - box.position.x) < 0.75 &&
    Math.abs(block.position.z - box.position.z) < 0.75
  );

  if(validMove){
    score++;
   x[0].innerHTML=`Score: ${score}`;
   x[1].innerHTML=`High Score:${localStorage.getItem("High_Score")}`;
 }
 
 if(!validMove){
  alert(`Game Over and your score is ${score}`);
  saveHighScore(score);
  location.reload();
 }
 if(score%5===3){
  for (let i = 0; i < 5; i++) {
    const block = new THREE.Mesh(blockGeometry, blockMaterial);
    block.position.set(Math.random() > 0.5 ? 1 : -1, 0.5, (j-5) * 2); // Positioned along x-axis
    scene.add(block);
    pathBlocks.push(block);
    j++;
  }
  camera.position.x=box.position.x;
  camera.position.y=box.position.y+5;
  camera.position.z=box.position.z-10;
 }
 
 if(score%4===0){
  for(let g=0;g<4;g++){
      const oldBlock = pathBlocks.shift(); // Remove the first block from the array
      scene.remove(oldBlock);
  }
 }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
function saveHighScore(score) {
  if(localStorage.getItem("High_Score")==="undefined") localStorage.setItem("High Score",score);
  else {if(localStorage.getItem("High_Score")<score){
    localStorage.setItem("High_Score",score);
  }
  }
}

import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { color } from 'three/tsl';

//required things
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,1000);
const orbit=new OrbitControls(camera, renderer.domElement);
camera.position.set(0,10,-25);
orbit.update();
// const axis=new THREE.AxesHelper(5);
// scene.add(axis);
// const grid=new THREE.GridHelper(30,10);
// scene.add(grid);
scene.background=new THREE.Color(0x87CEEB);
const light2=new THREE.AmbientLight();
scene.add(light2);
const light=new THREE.DirectionalLight();
scene.add(light);
light.position.set(0,20,10);
//plane geo
const planegeo=new THREE.PlaneGeometry(10,300);
const planemat=new THREE.MeshBasicMaterial({color:0xB8B8B8,side:THREE.DoubleSide});
const plane=new THREE.Mesh(planegeo,planemat);
scene.add(plane);
plane.rotation.x=0.5*Math.PI;

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
  renderer.render(scene,camera);
  if(z===1){
    box.position.z+=2;
    z=0;
  }
  else if(z===-1){
    box.position.z-=2;
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
    box.position.z+=0.1
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
const colors=[0xf77a04,0x87CEEB,0xffffff,0x333000];
const colors1=['#f77a04','#87CEEB','#ffffff','#333000'];
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
   console.log(score);
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
 if(score%10===0){
  scene.background=new THREE.Color(colors[k]);
  x[0].style.backgroundColor=colors1[k];
  x[1].style.backgroundColor=colors1[k];
  k++;
  plane.position.z=plane.position.z+10;
   if(k>=4){
    k=0;
   }
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

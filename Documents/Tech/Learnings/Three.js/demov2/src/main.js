import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// Get DOM elemen
// Setup Renderer

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);  // Initial size based on window size
renderer.setPixelRatio(window.devicePixelRatio);  // Adjust pixel ratio for better quality on high-density screens
document.body.appendChild(renderer.domElement);

// Handle window resizing
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Update camera aspect ratio and projection matrix
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  // Optionally update other things like light intensity, etc.
}

// Scenes and Cameras
const mainMenuScene = new THREE.Scene();
const gameScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Lighting


const light = new THREE.AmbientLight(0xffffff, 1);  // Ambient light for general illumination
mainMenuScene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light for shadows
directionalLight.position.set(5, 10, 5);
mainMenuScene.add(directionalLight);
mainMenuScene.add(light);
gameScene.add(light.clone()); // Add light to the game scene







const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
const listener = new THREE.AudioListener();
const backgroundMusic = new THREE.Audio(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader(loadingManager);

// Show loading screen while assets are loading
loadingManager.onStart = () => {
};

// When all assets are loaded
loadingManager.onLoad = () => {
    console.log('All assets loaded');
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none'; // Hide preloader

   
};


const progressBar = document.querySelector('#progress-bar');
// Track loading progress
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  if (progressBar) {
    // console.log(`Loaded ${itemsLoaded} of ${itemsTotal} files: ${url}`);
    const progress = (itemsLoaded / itemsTotal) * 100;
  
    document.getElementById('progress-bar').style.width = `${progress}%`;

      progressBar.style.width = `${progress}%`; // Update the progress bar width
    } else {
      console.warn('Progress bar element is not found.');
    }
   
};

// Handle loading errors
loadingManager.onError = (url) => {
    // console.error(`There was an error loading ${url}`);
};


// Ground Plane (for Main Menu)
// const groundGeo = new THREE.PlaneGeometry(50, 50);
// const groundMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
// const ground = new THREE.Mesh(groundGeo, groundMat);
// ground.rotation.x = -Math.PI / 2;
// mainMenuScene.add(ground);

// Main Menu Model

let menuModel;
let menuBG


let character, mixer, actions = {};
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/'); 
// Attach DracoLoader to GLTFLoader
gltfLoader.setDRACOLoader(dracoLoader);



gltfLoader.load('runestone.glb', (gltf) => {
  menuBG = gltf.scene;
  menuBG.scale.set(1,1,1
  );
  menuBG.position.set(0, 0, 0);
  mainMenuScene.add(menuBG);
});

gltfLoader.load('avatarland.glb', (gltf) => {
  menuModel = gltf.scene;
  menuModel.scale.set(0.9, 0.9, 0.9);
  menuModel.position.set(0, 0.7, 3);
  mainMenuScene.add(menuModel);

  
    // Animation setup
    // mixer = new THREE.AnimationMixer(menuModel);
    // gltf.animations.forEach((clip) => {
    //   actions[clip.name.toLowerCase()] = mixer.clipAction(clip);
    //   console.log(mixer, clip)
    // });
  
    // if (actions['armature|mixamo.com|layer0']) {
    //   actions['armature|mixamo.com|layer0'].play();
    // }
});
// Buttons for Main Menu
const startButton = document.createElement('button');
startButton.textContent = 'Start Game';
Object.assign(startButton.style, {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '15px 30px',
  fontSize: '18px',
  cursor: 'pointer',
  backgroundColor: 'transparent', // Transparent background
  border: '2px solid white', // Optional: border for visibility
  color: 'white', // Text color
  borderRadius: '8px', // Optional: rounded corners
  outline: 'none', // Removes focus outline
  transition: 'background-color 0.3s, color 0.3s', // Smooth hover effect
});

const musicButton = document.createElement('button');
musicButton.textContent = 'Music: Off';
Object.assign(musicButton.style, {
  position: 'absolute',
  top: '10%',
  left: '5%',
  padding: '10px 20px',
  fontSize: '14px',
  cursor: 'pointer',
  backgroundColor: 'transparent', // Transparent background
  border: '2px solid white', // Visible border
  color: 'white', // Text color
  borderRadius: '8px', // Rounded corners
  outline: 'none',
  transition: 'background-color 0.3s, color 0.3s', // Smooth transition
});

// Help Button
const helpButton = document.createElement('button');
helpButton.textContent = 'Help';
Object.assign(helpButton.style, {
  position: 'absolute',
  top: '70%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '15px 30px',
  fontSize: '18px',
  cursor: 'pointer',
  background: 'transparent',
  border: '2px solid white',
  color: 'white',
  borderRadius: '10px',
});
document.body.appendChild(helpButton);
// Create Modal Container

const overlay = document.createElement('div');
overlay.id = 'overlay';
document.body.appendChild(overlay);

// // Show Modal Function
function showModal(title, content) {
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');

  modalTitle.textContent = title;
  modalContent.innerHTML = content;

  modal.style.transform = 'translate(-50%, -50%) scale(1)';
  overlay.style.display = 'block';
}

// Hide Modal Function
function hideModal() {
  modal.style.transform = 'translate(-50%, -50%) scale(0)';
  overlay.style.display = 'none';
}



overlay.addEventListener('click', hideModal);



helpButton.addEventListener('click', () => {
  showModal(
    'Help',
    `
      <p>Use arrow keys to move your character.</p>
      <p>Collect coins to gain points.</p>
      <p>Avoid obstacles to survive as long as possible.</p>
    `
  );
});

// Close Modal Event Listener


// Audio Setup
const gameMusic = new Audio('drone-high-tension-and-suspense-background-162365.mp3'); // Replace with your music file path
gameMusic.loop = true; // Loop the music for continuous play
gameMusic.volume=0.3
// Music Toggle Functionality
let isMusicPlaying = false;

musicButton.addEventListener('click', () => {
  if (isMusicPlaying) {
    gameMusic.pause();
    musicButton.textContent = 'Music: Off';
  } else {
    gameMusic.play();
    musicButton.textContent = 'Music: On';
  }
  isMusicPlaying = !isMusicPlaying; // Toggle the music state
});

// Add the button to the DOM
document.body.appendChild(musicButton);


// Hover effect
startButton.addEventListener('mouseenter', () => {
  startButton.style.backgroundColor = 'white';
  startButton.style.color = 'black';
});
startButton.addEventListener('mouseleave', () => {
  startButton.style.backgroundColor = 'transparent';
  startButton.style.color = 'white';
});

document.body.appendChild(startButton);

// Game Scene Setup





gltfLoader.load('myavatar.glb', (gltf) => {
  character = gltf.scene;
  character.scale.set(1, 1, 1);
  character.position.set(0, 0, 0);
  character.rotation.y = Math.PI;
  gameScene.add(character);

  
    // Animation setup
    mixer = new THREE.AnimationMixer(character);
    gltf.animations.forEach((clip) => {
      actions[clip.name.toLowerCase()] = mixer.clipAction(clip);
      console.log(mixer, clip)
    });
  
    if (actions['armature|mixamo.com|layer0']) {
      actions['armature|mixamo.com|layer0'].play();
    }
});




  // // Example triggers
  // document.addEventListener("carAppear", handleCarAppearance);
  // document.addEventListener("carPass", handleCarPassing);

  // document.addEventListener("powerUpCollected", handlePowerUpCollected);
  // document.addEventListener("powerUpActivated", handlePowerUpActivated);
  // document.addEventListener("powerUpExpired", handlePowerUpExpired);




const textureTest = textureLoader.load('/luxury-vinyl-plank-light-ue/luxury-vinyl-plank-light-ue/luxury-vinyl-plank_light_albedo.png')
const textureNormal = textureLoader.load('/luxury-vinyl-plank-light-ue/luxury-vinyl-plank-light-ue/luxury-vinyl-plank_light_ao.png')
const textureM = textureLoader.load('/luxury-vinyl-plank-light-ue/luxury-vinyl-plank-light-ue/luxury-vinyl-plank_light_height.png')
const textureR = textureLoader.load('/luxury-vinyl-plank-light-ue/luxury-vinyl-plank-light-ue/luxury-vinyl-plank_light_preview.jpg')


// Constants
const groundWidth = 50;
const groundLength = 50;
const groundCount = 3; // Number of ground tiles
const tileSpacing = groundLength;
let speed = 0.7; 

// Ground material
const groundMaterial = new THREE.MeshStandardMaterial({
  map: textureTest,
  normalMap: textureNormal,
  roughnessMap: textureR,
  aoMap: textureM,
  side: THREE.DoubleSide,
  metalness: 1.0,
});

let treeModel = null;
let buildingModel = null;
const tileGroups = [];
let tilesReady = false; 

function loadModel(path, callback) {
  gltfLoader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      callback(model);
    },
    undefined,
    (error) => {
      console.error(`An error occurred while loading the model from ${path}:`, error);
      callback(null); // Pass null if loading fails
    }
  );
}

function loadAssets(callback) {
  let assetsLoaded = 0;

  const checkAssetsLoaded = () => {
    assetsLoaded++;
    if (assetsLoaded === 2) {
      callback(); // Proceed once both models are loaded
    }
  };

  loadModel('trees_and_bush_pack_lowpoly.glb', (model) => {
    treeModel = model;
    checkAssetsLoaded();
  });

  loadModel('realistic_palm_tree_free.glb', (model) => {
    buildingModel = model;
    checkAssetsLoaded()  ;
  });
}

function createTree(scale = 0.25) {
  if (!treeModel) {
    console.error('Tree model is not loaded yet.');
    return new THREE.Group(); // Return an empty placeholder
  }
  const treeInstance = treeModel.clone();
  treeInstance.scale.set(scale, scale, scale);
  treeInstance.castShadow = true;
  treeInstance.receiveShadow = true;
  return treeInstance;
}

function createBuilding(scale = 3) {
  if (!buildingModel) {
    console.error('Building model is not loaded yet.');
    return new THREE.Group(); // Return an empty placeholder
  }
  const buildingInstance = buildingModel.clone();
  buildingInstance.scale.set(scale, scale, scale);
  buildingInstance.castShadow = true;
  buildingInstance.receiveShadow = true;
  return buildingInstance;
}

function createTile(zOffset) {
  const tileGroup = new THREE.Group();

  // Ground
  const groundGeo = new THREE.PlaneGeometry(groundWidth, groundLength);
  const ground = new THREE.Mesh(groundGeo, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  tileGroup.add(ground);

  // Trees
  for (let z = -groundLength / 2; z < groundLength / 2; z += 10) {
    const treeLeft = createTree();
    treeLeft.position.set(-20, 0, z);
    tileGroup.add(treeLeft);

    const treeRight = createTree();
    treeRight.position.set(20, 0, z);
    tileGroup.add(treeRight);
  }

  // Buildings
  for (let z = -groundLength / 2; z < groundLength / 2; z += 15) {
    const buildingLeft = createBuilding();
    buildingLeft.position.set(-30, 0, z);
    tileGroup.add(buildingLeft);

    const buildingRight = createBuilding();
    buildingRight.position.set(30, 0, z);
    tileGroup.add(buildingRight);
  }

  tileGroup.position.z = zOffset;
  return tileGroup;
}

function initializeScene() {
  loadAssets(() => {
    for (let i = 0; i < groundCount; i++) {
      const zOffset = -i * tileSpacing;
      const tile = createTile(zOffset);
      gameScene.add(tile);
      tileGroups.push(tile);
    }
    tilesReady = true; // Set the flag once tiles are ready
  });
}

// Update tiles for infinite scrolling
function updateGround() {
  if (!tilesReady) return; // Ensure tiles are loaded before updating

  tileGroups.forEach((tile) => {
    tile.position.z += speed;

    // If the tile moves out of view, reposition it to the back
    if (tile.position.z > tileSpacing) {
      tile.position.z -= groundCount * tileSpacing;
    }
  });
}

let currentScene = 'mainMenu';
let gameStarted = false;

function switchToGameScene() {
  currentScene = 'gameScene';
  startButton.style.display = 'none'; // Hide main menu buttons
  helpButton.style.display='none';
  musicButton.style.display='none'
  gameStarted = true
  clock.start();
  console.log('Switched to Game Scene');
  setupJoystick()
  gamepad()
}

startButton.addEventListener('click', () => {
  switchToGameScene();
});



// Array to hold obstacles
const obstacles = [];

// Maximum number of active obstacles
const maxObstacles = 3; // Adjust as needed for performance

// Minimum distance between obstacles on the z-axis
const minZDistance = 50; // Adjust for gameplay difficulty

// GLTF Loader

// List of models for obstacles
const obstacleModels = [
  'royal_59_free__warhavoc_survival_car_pack.glb',
  // 'plymouth_fury_1958_crazy_version_draft.glb',

  // '2019_ford_gt_mkii_track.glb ',
  // '2018_nissan_leaf_nismo_rc_concept.glb',

  // Add paths to more models as needed
];


let honkCooldown = false;
// Function to create obstacles
function createObstacles() {
  if (obstacles.length >= maxObstacles) return;

  // Randomly select a model from the list
  const selectedModel = obstacleModels[Math.floor(Math.random() * obstacleModels.length)];

  gltfLoader.load(
    selectedModel,
    (gltf) => {
      const model = gltf.scene;

      // Scale and position adjustments
      model.scale.set(0.8, 0.8, 0.8);
      model.position.set(
        Math.random() * 10 - 5, // Random x position
        0.5, // y position based on model size
        obstacles.length > 0
          ? obstacles[obstacles.length - 1].position.z - minZDistance
          : -20 // Start far back on the z-axis
      );

      // Enable shadows
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Add the model to the scene
      gameScene.add(model);

      // Store the obstacle
      obstacles.push(model);


  // Play honk sound if not on cooldown
  if (!honkCooldown) {
    honkSound.play();
    honkCooldown = true;

    // Reset cooldown after 1 second
    setTimeout(() => {
      honkCooldown = false;
    }, 1000);
  }

      console.log(`Obstacle added: ${selectedModel}`); // Debugging output
    },
    undefined,
    (error) => {
      console.error(`Error loading model ${selectedModel}:`, error);
    }
  );
}


  // Load sounds
  const explodeSound = new Audio("explosion-42132.mp3");
  const honkSound = new Audio("car-horn-beep-beep-two-beeps-honk-honk-6188.mp3");
  const honkLSound = new Audio("car-horn-1-189855.mp3");
  const collisionSound = new Audio("mixkit-car-window-breaking-1551.wav");
  const passingCarSound = new Audio("car-passing-105251.mp3");
  const powerUpSound = new Audio("coin-pickup-98269.mp3");
  const powerUpActiveSound = new Audio("mixkit-electronics-power-up-2602.wav");
  const powerUpEndSound = new Audio("power-up-end.mp3");

  // Volume levels
  honkSound.volume = 0.6;
  collisionSound.volume = 0.8;
  passingCarSound.volume = 0.5;
  powerUpSound.volume = 0.7;
  powerUpActiveSound.volume = 0.5;
  powerUpEndSound.volume = 0.6;
explodeSound.volume=0.8;
  

  function handleCollision() {
    collisionSound.play();
  }

  
// Function to detect collision between the player and an obstacle
function detectCollisionwithCars(character, obstacles) {


  const playerBox = new THREE.Box3().setFromObject(character); // Player bounding box
  const obstacleBox = new THREE.Box3().setFromObject(obstacles); // Obstacle bounding box
  return playerBox.intersectsBox(obstacleBox); // Check for intersection
 
}

// Update obstacles and check for collisions
function updateObstacles() {
  obstacles.forEach((obstacle, index) => {
    // Move obstacle forward
    obstacle.position.z += speed;

    // Reset obstacle when out of view
    if (obstacle.position.z > 6) {
      resetObstacle(obstacle);
    }

    const distanceToPlayer = Math.abs(obstacle.position.z - character.position.z);

    // Adjust volume based on distance
    if (distanceToPlayer < 5) {
      passingCarSound.volume = Math.max(0, 1 - distanceToPlayer / 5); // Reduce volume with distance
    }

    if (obstacle.position.z > character.position.z && !obstacle.hasPlayedPassingSound) {
      passingCarSound.play(); // Play the passing car sound
      obstacle.hasPlayedPassingSound = true; // Ensure the sound is played only once
    }

    // Check for collision with the player character
    if (detectCollisionwithCars(character, obstacle)) {
      if (isShieldActive) {
        console.log('Shield protected the player from collision!');
        resetObstacle(obstacle); // Reset obstacle without penalty
        explodeSound.play()
  

      } else {
        console.log('Collision detected! Game Over.');
        onPlayerCollision(); // Handle collision without shield
      }
    }
  });
}

// Function to handle collision effects
function onPlayerCollision() {
  // Example: Stop the game or reduce player's health
  console.log('Game Over or Player Health Reduced!');

  gameOver()
  handleCollision()
  honkLSound.play()
  // Add game logic here
}

// Reset obstacle position and shuffle
function resetObstacle(obstacle) {
  obstacle.position.z = -20; // Reset to starting position
  obstacle.position.x = Math.random() * 10 - 5; // Randomize x position
}

// Periodically create obstacles
setInterval(() => {
  if (obstacles.length < maxObstacles) createObstacles();
}, 6000);




// Animation loop for updating obstacles
let score = 0; // Player's score
let collectibleCount = 0; // Number of collectibles gathered
let isShieldActive = false; // Flag for shield power-up
let shieldTimer = null; // Timer for shield effect duration
let distanceTraveled = 0; // Distance traveled by the player
const pointsPerCollectible = 10; // Points awarded per collectible
const pointsPerDistance = 1; // Points awarded per distance unit


const powerUps = []; // Array to store active power-ups

// Create a container for the game stats
const statsContainer = document.createElement("div");
statsContainer.style.position = "fixed";
statsContainer.style.top = "20px";
statsContainer.style.left = "20px";
statsContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Transparent black background
statsContainer.style.border = "none"; // Gold border with transparency
statsContainer.style.borderRadius = "15px";
statsContainer.style.padding = "15px 20px";
statsContainer.style.color = "#fff";
statsContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
statsContainer.style.fontSize = "1.2rem";
statsContainer.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.4)"; // Subtle shadow for depth
statsContainer.style.display = "none"; // Initially hidden
statsContainer.style.zIndex = "1000";

// Create individual stat elements
const scoreElement = document.createElement("div");
scoreElement.style.marginBottom = "10px";
scoreElement.innerHTML = `🏆 Score: ${score}`;
statsContainer.appendChild(scoreElement);

const coinsElement = document.createElement("div");
coinsElement.style.marginBottom = "10px";
coinsElement.innerHTML = `💰 Coins Collected: ${collectibleCount}`;
statsContainer.appendChild(coinsElement);

const distanceElement = document.createElement("div");
distanceElement.innerHTML = `🚀 Distance: 0m`;
statsContainer.appendChild(distanceElement);

// Add the stats container to the document body
document.body.appendChild(statsContainer);

// Function to update stats
function updateScoreDisplay() {
  scoreElement.innerHTML = `🏆 Score: ${score}`;
  coinsElement.innerHTML = `💰 Coins Collected: ${collectibleCount}`;
  distanceElement.innerHTML = `🚀 Distance: ${Math.floor(distanceTraveled)}m`;
}
// Game Over container
// Game Over container
const gameOverContainer = document.createElement("div");
gameOverContainer.style.position = "fixed";
gameOverContainer.style.top = "0";
gameOverContainer.style.left = "0";
gameOverContainer.style.width = "100vw";
gameOverContainer.style.height = "100vh";
gameOverContainer.style.backgroundColor = "rgba(0, 0, 0, 0.85)"; // Slightly more transparent dark overlay
gameOverContainer.style.display = "flex";
gameOverContainer.style.justifyContent = "center";
gameOverContainer.style.alignItems = "center";
gameOverContainer.style.flexDirection = "column";
gameOverContainer.style.color = "#fff";
gameOverContainer.style.fontFamily = "'Poppins', sans-serif";
gameOverContainer.style.zIndex = "1001";
gameOverContainer.style.opacity = "0"; // Hidden initially
gameOverContainer.style.transition = "opacity 0.5s ease-in-out"; // Smooth fade-in
gameOverContainer.style.display = "none"; // Initially hidden
document.body.appendChild(gameOverContainer);

// Game Over message
const gameOverMessage = document.createElement("div");
gameOverMessage.innerHTML = "GAME OVER";
gameOverMessage.style.fontSize = "3rem";
gameOverMessage.style.fontWeight = "bold";
gameOverMessage.style.letterSpacing = "5px";
gameOverMessage.style.color = "#ff4c4c"; // Bright red
gameOverMessage.style.textShadow = "0 0 15px rgba(255, 76, 76, 0.8)";
gameOverMessage.style.marginBottom = "30px";
gameOverContainer.appendChild(gameOverMessage);

// Summary container
const summaryContainer = document.createElement("div");
summaryContainer.style.textAlign = "center";
summaryContainer.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
summaryContainer.style.padding = "20px";
summaryContainer.style.borderRadius = "15px";
summaryContainer.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.5)";
summaryContainer.style.width = "80%";
summaryContainer.style.maxWidth = "400px";

// Coins collected
const coinsCollected = document.createElement("div");
coinsCollected.id = "coinsCollected";
coinsCollected.innerHTML = `<span style="color: #ffd700;">🪙 Coins Collected:</span> 0`;
coinsCollected.style.marginBottom = "10px";
coinsCollected.style.fontSize = "1.5rem";
summaryContainer.appendChild(coinsCollected);

// Total score
const totalScore = document.createElement("div");
totalScore.id = "totalScore";
totalScore.innerHTML = `<span style="color: #4caf50;">⭐ Score:</span> 0`;
totalScore.style.marginBottom = "10px";
totalScore.style.fontSize = "1.5rem";
summaryContainer.appendChild(totalScore);

// Distance traveled
const distanceTraveledDisplay = document.createElement("div");
distanceTraveledDisplay.id = "distanceTraveled";
distanceTraveledDisplay.innerHTML = `<span style="color: #2196f3;">📏 Distance Traveled:</span> 0m`;
distanceTraveledDisplay.style.marginBottom = "10px";
distanceTraveledDisplay.style.fontSize = "1.5rem";
summaryContainer.appendChild(distanceTraveledDisplay);

gameOverContainer.appendChild(summaryContainer);

// Restart button
const restartButton = document.createElement("button");
restartButton.innerHTML = "Restart Game";
restartButton.style.marginTop = "30px";
restartButton.style.padding = "15px 30px";
restartButton.style.fontSize = "1.2rem";
restartButton.style.color = "#fff";
restartButton.style.backgroundColor = "#4caf50"; // Green button
restartButton.style.border = "none";
restartButton.style.borderRadius = "25px";
restartButton.style.cursor = "pointer";
restartButton.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.4)";
restartButton.style.transition = "all 0.3s ease";
restartButton.addEventListener("mouseenter", () => {
  restartButton.style.backgroundColor = "#388e3c";
  restartButton.style.boxShadow = "0 6px 20px rgba(56, 142, 60, 0.6)";
});
restartButton.addEventListener("mouseleave", () => {
  restartButton.style.backgroundColor = "#4caf50";
  restartButton.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.4)";
});
restartButton.addEventListener("click", restartGame);
gameOverContainer.appendChild(restartButton);

// Function to show Game Over screen


// Function to trigger game over
function gameOver() {
  console.log("Game Over!");
  // Stop game logic
  cancelAnimationFrame(animationFrameId); // Stops the animation loop
  document.getElementById("coinsCollected").innerHTML = `Coins Collected: ${collectibleCount}`;
  document.getElementById("totalScore").innerHTML = `Score: ${score}`;
  document.getElementById("distanceTraveled").innerHTML = `Distance Traveled: ${Math.floor(distanceTraveled)}m`;
 // Show Game Over container with fade-in effect
 gameOverContainer.style.display = "flex";
 setTimeout(() => {
   gameOverContainer.style.opacity = "1";
 }, 50); // Delay for transition effect
  statsContainer.style.display = "none"; // Hide stats
}
function restartGame() {
  console.log("Restarting game...");

  // Reset variables
  score = 0;
  collectibleCount = 0;
  distanceTraveled = 0;

  // Reset player position
  character.position.set(0, 0, 0);

  // Clear obstacles
  obstacles.forEach((obstacle) => {
    gameScene.remove(obstacle);
  });
  obstacles.length = 0; // Empty the array

  // Clear power-ups
  powerUps.forEach((powerUp) => {
    gameScene.remove(powerUp);
  });
  powerUps.length = 0; // Empty the array

  // Reset shield effect
  isShieldActive = false;
  clearTimeout(shieldTimer);

  // Reset UI
  statsContainer.style.display = "none"; // Hide stats during restart
  gameOverContainer.style.display = "none"; // Hide Game Over screen
  updateScoreDisplay(); // Update the score UI to reflect reset values

  // Re-initialize the scene

  // Restart animation loop
  animate();
 
}

// Power-Up Models
const powerUpModels = [
  { name: 'shield', model: 'medieval_wood_heater_shield.glb' },
  { name: 'bitcoin', model: 'realistic_3d_bitcoin_model__crypto_asset.glb' },
  { name: 'changeposition', model: 'potion_for_media__motion.glb' }
];

// GLTF Loader


// Create Power-Ups
function createPowerUps() {
  const selectedPowerUp = powerUpModels[Math.floor(Math.random() * powerUpModels.length)];
  
  gltfLoader.load(
    selectedPowerUp.model,
    (gltf) => {
      const model = gltf.scene;

      // Scale and position adjustments
      model.scale.set(0.5, 0.5, 0.5);
      model.position.set(
        Math.random() * 10 - 5, // Random x position
        0.5, // y position
        -20 // Far back on the z-axis
      );

      // Add a custom property for power-up type
      model.userData.type = selectedPowerUp.name;

      // Add to scene and power-up array
      gameScene.add(model);
      powerUps.push(model);
    },
    undefined,
    (error) => {
      console.error(`Error loading power-up model:`, error);
    }
  );
}
setInterval(() => {
  createPowerUps();
}, 10000); // Create a power-up every 10 seconds

// Update Power-Ups
function updatePowerUps() {
  powerUps.forEach((powerUp, index) => {
    powerUp.position.z += speed;

    // Remove power-up if out of view
    if (powerUp.position.z > 6) {
      gameScene.remove(powerUp);
      powerUps.splice(index, 1);
    }

    // Detect collision with character
    if (detectCollisionwithCars(character, powerUp)) {
      triggerPowerUpEffect(powerUp.userData.type);
      gameScene.remove(powerUp);
      powerUps.splice(index, 1);
      powerUpSound.play()
    }
  });
}

// Trigger Power-Up Effect
function triggerPowerUpEffect(type) {
  if(type === 'shield') {
    collectShield()
    
    // activateShield();
  } else if (type === 'bitcoin') {
    rewardBitcoin();
  }

  else if (type === 'changeposition') {
   changecharacterPosition()
  }
}


function changecharacterPosition(){
  collectedPositions++;
  updatePositionButton()
  }
const defaultSpeed=0.7
const speedboost= 2;
// Shield Effect
function activateShield() {
  if (isShieldActive || collectedShields <= 0) return;
powerUpActiveSound.play()

  console.log('Shield activated!');
  isShieldActive = true;
  speed +=speedboost
  collectedShields -= 1; // Deduct a shield
  character.scale.set(1.5,1.5,1.5)
  updateShieldButton(); // Update button display

  // Temporary invulnerability
  shieldTimer = setTimeout(() => {
    console.log('Shield deactivated!');
    isShieldActive = false;
    speed=defaultSpeed
    character.scale.set(1,1,1)
  }, 5000); // Shield lasts for 5 seconds
}

// Bitcoin Effect
function rewardBitcoin() {
  console.log('Bitcoin collected!');
  collectibleCount++;
  score += 5000; // Reward points for collecting Bitcoin
}



function updateScore() {
  // Add distance traveled points
  distanceTraveled += speed; // Increment distance based on game speed
  score += pointsPerDistance;
  scoreElement.innerHTML = `Score: ${score}`;
  // Update score display
  updateScoreDisplay();
}

function rewardCollectible() {
  collectibleCount++;
  score += pointsPerCollectible;

  // Update score display
  updateScoreDisplay();
}

function resetScore() {
  score = 0;
  collectibleCount = 0;
  distanceTraveled = 0;

  // Update score display
  updateScoreDisplay();
}


let collectedPositions = 0; // Track position-changing items collected
let collectedShields = 0; // Track shields collected
let shieldButton, positionButton;


// Gamepad creation and button styling
function gamepad() {
  const gamepadContainer = document.createElement('div');
  gamepadContainer.style.position = 'absolute';
  gamepadContainer.style.bottom = '20px';
  gamepadContainer.style.right = '20px';
  gamepadContainer.style.display = 'flex';
  gamepadContainer.style.flexDirection = 'column';
  gamepadContainer.style.alignItems = 'center';
  gamepadContainer.style.justifyContent = 'center';
  gamepadContainer.style.gap = '20px';
  gamepadContainer.style.zIndex = '1000';

  function createGamepadButton(label, action) {
    const button = document.createElement('button');
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.borderRadius = '50%';  // Rounded corners
    button.style.border = 'none';
    button.style.background = 'rgba(255, 255, 255, 0.4)';  // Light white transparent background
    button.style.color = '#fff';
    button.style.fontSize = '20px';
    button.style.fontWeight = 'bold';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.3s ease';
    button.style.position = 'relative';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'; // Subtle box shadow with soft edges

    button.innerHTML = label;

    button.addEventListener('mouseover', () => {
      button.style.background = 'rgba(255, 255, 255, 0.6)';  // Slightly darker on hover
      button.style.transform = 'scale(1.05)';  // Slight scale-up on hover
    });
    button.addEventListener('mouseout', () => {
      button.style.background = 'rgba(255, 255, 255, 0.4)';  // Original transparent color
      button.style.transform = 'scale(1)';  // Reset scale
    });

    button.addEventListener('click', action);

    return button;
  }


  // Create shield button (A button)
  shieldButton = createGamepadButton('A', activateShield);
  gamepadContainer.appendChild(shieldButton);

  // Create position change button (B button)
  positionButton = createGamepadButton('B', changePosition);
  gamepadContainer.appendChild(positionButton);

  document.body.appendChild(gamepadContainer);

  const shieldCountBadge = document.createElement('span');
  shieldCountBadge.style.position = 'absolute';
  shieldCountBadge.style.top = '10px';
  shieldCountBadge.style.right = '10px';
  shieldCountBadge.style.backgroundColor = '#ff6347';
  shieldCountBadge.style.color = '#fff';
  shieldCountBadge.style.fontSize = '5px';
  shieldCountBadge.style.padding = '5px';
  shieldCountBadge.style.borderRadius = '50%';
  shieldCountBadge.innerHTML = collectedShields;
  shieldButton.appendChild(shieldCountBadge);

  const positionCountBadge = document.createElement('span');
  positionCountBadge.style.position = 'absolute';
  positionCountBadge.style.top = '10px';
  positionCountBadge.style.right = '10px';
  positionCountBadge.style.backgroundColor = '#ff6347';
  positionCountBadge.style.color = '#fff';
  positionCountBadge.style.fontSize = '5px';
  positionCountBadge.style.padding = '5px';
  positionCountBadge.style.borderRadius = '50%';
  positionCountBadge.innerHTML = collectedPositions;
  positionButton.appendChild(positionCountBadge);
}

// Update position button to show current position item count and enable/disable button
function updatePositionButton() {
  positionButton.innerHTML = `B ${collectedPositions}`; // Show position item count
  positionButton.disabled = collectedPositions === 0; // Disable if no position items
}

// Update shield button to show current count and enable/disable button
function updateShieldButton() {
  shieldButton.innerHTML = `A ${collectedShields}`; // Show shield count
  shieldButton.disabled = collectedShields === 0; // Disable if no shields
}
// Function to change character position (random left/right movement with boundary limits)
function changePosition() {
  if (collectedPositions <= 0) {
    console.log('No position-changing items available!');
    return; // No position-changing item available
  }

  updatePositionButton(); // Update position button after changing position

  // Randomly decide if the character should move left or right
  const randomMove = Math.random() < 0.5 ? -5 : 5; // Random movement of -5 or 5 on x-axis for smoother movement

  // Calculate new position X based on random movement
  const newPositionX = character.position.x + randomMove;

  // Ensure the new position is within the valid bounds
  const halfGroundWidth = groundWidth / 2; // Since groundWidth is 50, halfGroundWidth will be 25

  console.log(`Attempting to move character. New Position X: ${newPositionX}`);

  // Check if the new position is within the valid bounds
  if (newPositionX >= -halfGroundWidth && newPositionX <= halfGroundWidth) {
    character.position.x = newPositionX; // Move character if within bounds
    collectedPositions -= 1; // Deduct one position item
    updatePositionButton()
    console.log(`Character moved to position X: ${character.position.x}`);
  } else {
    console.log('Character movement out of bounds, no change made.');
  }
}


// Function to simulate collecting a shield
function collectShield() {
  collectedShields += 1; // Add one shield when collected
  updateShieldButton();  // Update button to reflect new shield count
}

function setupJoystick() {
  // Create joystick container (rectangle with rounded edges)
  const joystick = document.createElement("div");
  Object.assign(joystick.style, {
    position: "absolute",
    bottom: "5%",
    left: "3%",
    width: "250px",
    height: "60px",
    borderRadius: "30px", // Rounded edges
    background: "rgba(0, 0, 0, 0.5)",
    touchAction: "none", // Prevent default touch behaviors
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });
  document.body.appendChild(joystick);

  // Create joystick handle (round, centered in the container)
  const handle = document.createElement("div");
  Object.assign(handle.style, {
    width: "60px",
    height: "60px",
    borderRadius: "50%", // Circular handle
    background: "rgba(255, 255, 255, 0.8)",
    touchAction: "none", // Prevent touch defaults
    position: "absolute",
    transform: "translate(0, 0)",
  });
  joystick.appendChild(handle);
// State variables for dragging
let isDragging = false;
let initialTouch = null;

const movementSpeed = 0.15; // Speed of player movement
const deadZone = 7; // Ignore small movements near the center
let joystickRadius = 50; // Default joystick radius

// Adjust joystick radius and related scaling dynamically
function adjustJoystickRadius() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Dynamically scale joystick radius (adjust as necessary)
  joystickRadius = Math.min(screenWidth, screenHeight) * 0.15; // Use 15% of the smallest screen dimension
}

// Adjust joystick handle size on window resize
window.addEventListener("resize", adjustJoystickRadius);

// Handle touch start
joystick.addEventListener("touchstart", (e) => {
  isDragging = true;
  initialTouch = e.touches[0];
});

// Handle touch move
joystick.addEventListener("touchmove", (e) => {
  if (isDragging && initialTouch) {
    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate horizontal movement
    let deltaX = e.touches[0].clientX - centerX;

    // Restrict movement within joystick radius
    const distance = Math.abs(deltaX);
    if (distance > joystickRadius) {
      deltaX = Math.sign(deltaX) * joystickRadius; // Clamp to joystick radius
    }

    // Ignore small movements in the dead zone
    if (Math.abs(deltaX) > deadZone) {
      const normalizedX = deltaX / joystickRadius; // Normalize between -1 and 1

      // Move player within camera bounds
      const { left, right } = calculateCameraBounds();
      character.position.x = Math.min(Math.max(character.position.x + normalizedX * movementSpeed, left), right);

      // Update joystick handle position within bounds
      const handleOffsetX = Math.min(
        Math.max(deltaX, -joystickRadius + handle.offsetWidth / 2),
        joystickRadius - handle.offsetWidth / 2
      );
      handle.style.transform = `translate(${handleOffsetX}px, 0)`; // Horizontal movement only
    }
  }
});

// Handle touch end
joystick.addEventListener("touchend", () => {
  isDragging = false;
  initialTouch = null;

  // Reset joystick handle position
  handle.style.transform = "translate(0, 0)";
});

// Calculate camera bounds dynamically
function calculateCameraBounds() {
  const aspect = window.innerWidth / window.innerHeight;
  const distance = camera.position.z - character.position.z; // Distance between camera and player
  const verticalFOV = THREE.MathUtils.degToRad(camera.fov); // Convert FOV from degrees to radians
  const halfHeight = Math.tan(verticalFOV / 2) * distance;
  const halfWidth = halfHeight * aspect;

  return {
    left: -halfWidth + 0.5, // Add padding to avoid clipping
    right: halfWidth - 0.5, // Add padding to avoid clipping
  };
}

// Call adjustJoystickRadius on initial load
adjustJoystickRadius();
}


let moveLeft = false
let moveRight = false


window.addEventListener('keydown', (event) =>{
if(event.key ==='ArrowLeft')
moveLeft=true;
if(event.key ==='ArrowRight')
moveRight=true;
});

window.addEventListener('keyup', (event) =>{
  if(event.key ==='ArrowLeft')
  
    moveLeft=false;
  
  if(event.key ==='ArrowRight')
    moveRight=false;
    })


       // Update player movement
       function updatePlayer() {
        if (moveLeft && character.position.x > -5) {
          character.position.x -= 0.2;
        }
        if (moveRight && character.position.x < 5) {
          character.position.x += 0.2;
        }
       }


window.addEventListener('resize', () => {
  renderer.setSize(window.clientWidth, window.clientHeight);
  camera.aspect = window.clientWidth / window.clientHeight;
  camera.updateProjectionMatrix();
  console.log('resized')
});

const controls = new OrbitControls(camera,renderer.domElement)
controls.enableZoom = false;  // Disable zooming
controls.enablePan = false; // Disable panning (prevents movement of the camera in all directions)

controls.maxPolarAngle = Math.PI / 2; // Restrict looking below ground
controls.minPolarAngle = Math.PI / 4;

// Prevent the camera from flipping around
controls.enableDamping = true; // Smooth out movements
controls.dampingFactor = 0.25; // Adjust damping factor for a smoother transition

// controls.autoRotate=true
// // Set a fixed distance between the camera and target
// controls.maxDistance = 10; // Set maximum distance of the camera from the target
// controls.minDistance = 10; // Set minimum distance of the camera from the target (fixed distance)

 // Update controls to apply the changes






 const clock = new THREE.Clock()
 let animationFrameId;
// Animation Loop
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  if (gameStarted) {
  controls.update();

 
  const delta = clock.getDelta();
   if (mixer) mixer.update(delta);


updateGround()
updateObstacles()
updatePowerUps()
updateScoreDisplay()
updateScore()
updatePlayer()
    if (currentScene === 'gameScene') {
    renderer.render(gameScene, camera);
    controls.enableRotate = false; 
    controls.autoRotate=false;
    statsContainer.style.display = "block";
    camera.position.set(0, 2, 5);

    // Update game objects if needed
  }}

  else if (currentScene === 'mainMenu') {
    controls.enableRotate = true; 
    // controls.autoRotate=true;
    renderer.render(mainMenuScene, camera);
  }
}
animate();
initializeScene();
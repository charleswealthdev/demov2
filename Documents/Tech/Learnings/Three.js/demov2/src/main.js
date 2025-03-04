import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// Setup Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Create all UI buttons first
const startButton = document.createElement('button');
startButton.textContent = 'Start Game';
Object.assign(startButton.style, {
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: '2px solid white',
    color: 'white',
    borderRadius: '8px',
    outline: 'none',
    transition: 'background-color 0.3s, color 0.3s'
});

const helpButton = document.createElement('button');
helpButton.textContent = 'Help';
Object.assign(helpButton.style, {
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    background: 'transparent',
    border: '2px solid white',
    color: 'white',
    borderRadius: '10px',
    zIndex: 1000
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
    backgroundColor: 'transparent',
    border: '2px solid white',
    color: 'white',
    borderRadius: '8px',
    outline: 'none',
    transition: 'background-color 0.3s, color 0.3s'
});

const pauseButton = document.createElement('button');
pauseButton.textContent = 'Pause Game';
Object.assign(pauseButton.style, {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: '2px solid white',
    color: 'white',
    borderRadius: '8px',
    outline: 'none',
    transition: 'background-color 0.3s, color 0.3s',
    display: 'none'
});

const volumeButton = document.createElement('button');
volumeButton.textContent = 'Volume: High';
Object.assign(volumeButton.style, {
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: '2px solid white',
    color: 'white',
    borderRadius: '8px',
    outline: 'none',
    transition: 'background-color 0.3s, color 0.3s'
});

let volumeLevel = 1.0;
volumeButton.addEventListener('click', () => {
    if (volumeLevel === 1.0) {
        volumeLevel = 0.0;
        volumeButton.textContent = 'Volume: Mute';
    } else if (volumeLevel === 0.0) {
        volumeLevel = 0.3;
        volumeButton.textContent = 'Volume: Low';
    } else if (volumeLevel === 0.3) {
        volumeLevel = 0.6;
        volumeButton.textContent = 'Volume: Medium';
    } else if (volumeLevel === 0.6) {
        volumeLevel = 1.0;
        volumeButton.textContent = 'Volume: High';
    }
    mainMenuMusic.volume = volumeLevel * 0.1;
    gameSceneMusic.volume = volumeLevel * 0.13;
    bossmodeMusic.volume = volumeLevel * 0.15;
    explodeSound.volume = volumeLevel * 0.8;
    honkSound.volume = volumeLevel * 0.6;
    honkLSound.volume = volumeLevel * 0.5;
    collisionSound.volume = volumeLevel * 0.8;
    passingCarSound.volume = volumeLevel * 0.5;
    powerUpSound.volume = volumeLevel * 0.7;
    powerUpActiveSound.volume = volumeLevel * 0.5;
    powerUpEndSound.volume = volumeLevel * 0.6;
    shootSound.volume = volumeLevel * 0.4;
    hitSound.volume = volumeLevel * 0.5;
});

volumeButton.addEventListener('mouseenter', () => {
    volumeButton.style.backgroundColor = 'white';
    volumeButton.style.color = 'black';
});
volumeButton.addEventListener('mouseleave', () => {
    volumeButton.style.backgroundColor = 'transparent';
    volumeButton.style.color = 'white';
});



// Add buttons to document
document.body.appendChild(musicButton);
document.body.appendChild(pauseButton);

// Create Main Menu UI
const mainMenuUI = document.createElement('div');
Object.assign(mainMenuUI.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '30px',
    background: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '15px',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
    zIndex: 1000
});
document.body.appendChild(mainMenuUI);

// Character Selection UI
const characterSelectionContainer = document.createElement('div');
Object.assign(characterSelectionContainer.style, {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px'
});

mainMenuUI.appendChild(startButton);
mainMenuUI.appendChild(helpButton);
mainMenuUI.appendChild(volumeButton);

// Handle window resizing
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// Scenes and Cameras
const mainMenuScene = new THREE.Scene();
const gameScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 1);
mainMenuScene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
mainMenuScene.add(directionalLight);
mainMenuScene.add(light);
gameScene.add(light.clone());

// Loaders
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
gltfLoader.setDRACOLoader(dracoLoader);
const listener = new THREE.AudioListener();
const backgroundMusic = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader(loadingManager);
const rgbeLoader = new RGBELoader(loadingManager);

// Loading Screen
loadingManager.onLoad = () => {
    console.log('All assets loaded');
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';
};

const progressBar = document.querySelector('#progress-bar');
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    if (progressBar) {
        const progress = (itemsLoaded / itemsTotal) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
    } else {
        console.warn('Progress bar element is not found.');
    }
};

loadingManager.onError = (url) => {
    console.error(`Error loading ${url}`);
};

// Game State Variables
let score = 0;
let collectibleCount = 0;
let isShieldActive = false;
let shieldTimer = null;
let distanceTraveled = 0;
let isJumping = false;
const jumpHeight = 2;
const jumpDuration = 1;
const pointsPerDistance = 1;
let shieldVisual = null;
const shieldSizeMultiplier = 1.7;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let currentScene = 'mainMenu';
let gameStarted = false;
let powerUpIntervalId = null;
let obstaclesInterval = null;
let boss, honkCooldown = false, bossActive = false, characterHealth = 100, bossHealth = 200;
const bossProjectiles = [];
let bossModeTimer, bossTimeCountdown, bossStartTime = false, bulletSpeed = 3, bossSpeed = 0.5;
let muzzleFlashDuration = 100, bossMovementInterval, gameOverTriggered = false, bossModeCompleted = false;
let bossShootingInterval = null;
let collectedPositions = 0, collectedShields = 0, shieldButton, positionButton;
let menuModel, menuBG, character, mixer, actions = {};
let treeModel = null, buildingModel = null;
const tileGroups = [];
let tilesReady = false;
let animationFrameId = null;
let isPaused = false;
let isMusicPlaying = false;

// Character Selection Variables
let selectedCharacter = 'myavatar.glb';
const availableCharacters = [
    { id: 'myavatar', model: 'myavatar.glb', name: 'Classic Runner', description: 'The original runner with balanced stats.' },
    { id: 'ninja', model: 'avatar2.glb', name: 'Ninja', description: 'Fast and agile, but more vulnerable.' }
];

availableCharacters.forEach(char => {
    const charButton = document.createElement('div');
    Object.assign(charButton.style, {
        width: '150px',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        cursor: 'pointer',
        textAlign: 'center',
        border: '2px solid transparent',
        transition: 'all 0.3s ease'
    });

    const charName = document.createElement('h3');
    charName.textContent = char.name;
    charName.style.color = 'white';
    charName.style.marginBottom = '10px';

    const charDesc = document.createElement('p');
    charDesc.textContent = char.description;
    charDesc.style.color = '#aaa';
    charDesc.style.fontSize = '12px';

    charButton.appendChild(charName);
    charButton.appendChild(charDesc);

    charButton.addEventListener('click', () => {
        selectedCharacter = char.model;
        document.querySelectorAll('.char-button').forEach(btn => 
            btn.style.border = '2px solid transparent');
        charButton.style.border = '2px solid #4CAF50';
        console.log(`Selected character: ${char.name} (${selectedCharacter})`); // Debug log
    });

    charButton.classList.add('char-button');
    characterSelectionContainer.appendChild(charButton);
});

mainMenuUI.appendChild(characterSelectionContainer);


function loadSelectedCharacter() {
    if (character) {
        gameScene.remove(character);
        character = null;
    }
    console.log(`Loading character: ${selectedCharacter}`);
    gltfLoader.load(selectedCharacter, (gltf) => {
        character = gltf.scene;
        character.scale.set(1.3, 1.3, 1.3);
        character.position.set(0, 0, 0);
        character.rotation.y = Math.PI;
        gameScene.add(character);
        enableEnvMap(character);
        updateModelSize();
        mixer = new THREE.AnimationMixer(character);
        gltf.animations.forEach((clip) => {
            actions[clip.name.toLowerCase()] = mixer.clipAction(clip);
        });
        if (actions['armature|mixamo.com|layer0']) {
            actions['armature|mixamo.com|layer0'].play();
        }
    }, undefined, (error) => {
        console.error(`Error loading character ${selectedCharacter}:`, error);
    });
}

function switchToGameScene() {
    currentScene = 'gameScene';
    mainMenuUI.style.display = 'none';
    helpButton.style.display = 'none';
    musicButton.style.display = 'block';
    mainMenuHighScoreContainer.style.display = 'none';
    pauseButton.style.display = 'block';
    gameStarted = true;
    console.log('Switching to game scene');

    // Reset game state
    score = 0;
    collectibleCount = 0;
    distanceTraveled = 0;
    speed = 0.45;
    characterHealth = 100;
    bossActive = false;
    bossModeCompleted = false;
    gameOverTriggered = false;
    isPaused = false;
    isJumping = false;

    // Clear previous game objects
    removeAllObstacles();
    powerUps.forEach(powerUp => gameScene.remove(powerUp));
    powerUps.length = 0;
    if (character) {
        gameScene.remove(character);
        character = null;
    }

    // Load character
    loadSelectedCharacter();

    // Re-initialize ground tiles if not present
    if (!tilesReady || tileGroups.length === 0) {
        initializeScene();
        console.log('Game scene tiles re-initialized');
    }

    // Audio setup
    if (isMusicPlaying) {
        mainMenuMusic.pause();
        mainMenuMusic.currentTime = 0;
        gameSceneMusic.play().catch(err => console.warn('Could not play game music:', err));
    }

    // Reset clock and start game elements
    clock.start();
    setupJoystick();
    gamepad();
    updateCameraPosition();
    powerUpIntervalId = setInterval(createPowerUps, 10000);
    startObstacleCreation();

    // Start animation loop
    if (!animationFrameId) animate();
}
function restartGame() {
    score = 0;
    collectibleCount = 0;
    distanceTraveled = 0;
    speed = 0.45;
    characterHealth = 100;
    updateHealthUI();
    bossActive = false;
    bossModeCompleted = false;
    gameOverTriggered = false;
    isPaused = false;
    isJumping = false;
    loadSelectedCharacter();
    obstacles.forEach(obstacle => gameScene.remove(obstacle));
    obstacles.length = 0;
    powerUps.forEach(powerUp => gameScene.remove(powerUp));
    powerUps.length = 0;
    isShieldActive = false;
    if (shieldVisual) {
        gameScene.remove(shieldVisual);
        shieldVisual = null;
    }
    clearTimeout(shieldTimer);
    if (boss) {
        gameScene.remove(boss);
        boss = null;
    }
    clearTimeout(bossModeTimer);
    clearInterval(bossMovementInterval);
    clearInterval(bossShootingInterval);
    bossShootingInterval = null;
    clearInterval(bossTimeCountdown);
    document.getElementById("bossHealthBarContainer").style.display = "none";
    document.getElementById("playerHealthBarContainer").style.display = "none";
    bossTimerUI.style.display = "none";
    if (!bossmodeMusic.paused) {
        bossmodeMusic.pause();
        bossmodeMusic.currentTime = 0;
    }
    if (gameSceneMusic.paused && isMusicPlaying) gameSceneMusic.play();
    statsContainer.style.display = "none";
    gameOverContainer.style.opacity = "0";
    gameOverContainer.style.display = "none";
    pauseButton.style.display = 'block';
    mainMenuHighScoreText.innerHTML = `${highScore}`;
    mainMenuHighScoreContainer.style.display = 'block';
    updateScoreDisplay();
    startObstacleCreation();
    powerUpIntervalId = setInterval(createPowerUps, 10000);
    animate();
}

function applyHDRI(scene, hdriPath) {
    rgbeLoader.load(hdriPath, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        console.log(`HDRI loaded for ${scene.name || 'scene'}`);
    }, undefined, (error) => {
        console.error('Error loading HDRI:', error);
    });
}

applyHDRI(mainMenuScene, 'beach_parking_1k.hdr');
mainMenuScene.name = 'MainMenu';
applyHDRI(gameScene, 'beach_parking_1k.hdr');
gameScene.name = 'GameScene';

function enableEnvMap(model) {
    model.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.envMapIntensity = 1.0;
            child.material.needsUpdate = true;
        }
    });
}

const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
const skyMaterial = new THREE.ShaderMaterial({
    uniforms: {
        topColor: { value: new THREE.Color(0xffa07a) },
        horizonColor: { value: new THREE.Color(0xffe4b5) },
        bottomColor: { value: new THREE.Color(0x87ceeb) },
        offsetTop: { value: 0.6 },
        offsetBottom: { value: 0.2 },
    },
    vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 horizonColor;
        uniform vec3 bottomColor;
        uniform float offsetTop;
        uniform float offsetBottom;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize(vWorldPosition).y;
            float mixBottom = smoothstep(-1.0, offsetBottom, h);
            float mixTop = smoothstep(offsetBottom, offsetTop, h);
            vec3 color = mix(bottomColor, horizonColor, mixBottom); // Fixed typo: customColor -> bottomColor
            color = mix(color, topColor, mixTop);
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    side: THREE.BackSide,
});

const skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
mainMenuScene.add(skyDome);
gameScene.add(skyDome.clone());

mainMenuScene.fog = new THREE.Fog(0x87ceeb, 50, 200);
gameScene.fog = new THREE.Fog(0x87ceeb, 50, 200);

gltfLoader.load('runestone.glb', (gltf) => {
    menuBG = gltf.scene;
    menuBG.scale.set(1, 1, 1);
    menuBG.position.set(0, 0, 0);
    mainMenuScene.add(menuBG);
    enableEnvMap(menuBG);
});

gltfLoader.load('avatarland.glb', (gltf) => {
    menuModel = gltf.scene;
    menuModel.scale.set(0.9, 0.9, 0.9);
    menuModel.position.set(0, 0.7, 3);
    mainMenuScene.add(menuModel);
    enableEnvMap(menuModel);
});

document.body.appendChild(musicButton);

const mainMenuHighScoreContainer = document.createElement('div');
mainMenuHighScoreContainer.id = 'mainMenuHighScoreContainer';
Object.assign(mainMenuHighScoreContainer.style, {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: '1000',
});

const highScoreIcon = document.createElement('img');
highScoreIcon.src = 'https://img.icons8.com/?size=100&id=JIHcx48yhK29&format=png&color=000000';
highScoreIcon.style.width = '25px';
highScoreIcon.style.height = '25px';
highScoreIcon.style.marginRight = '8px';
mainMenuHighScoreContainer.appendChild(highScoreIcon);

const mainMenuHighScoreText = document.createElement('span');
mainMenuHighScoreText.id = 'mainMenuHighScoreText';
mainMenuHighScoreText.innerHTML = `${highScore}`;
mainMenuHighScoreText.style.color = '#87ceeb';
mainMenuHighScoreText.style.fontSize = '18px';
mainMenuHighScoreText.style.fontFamily = 'Arial, sans-serif';
mainMenuHighScoreContainer.appendChild(mainMenuHighScoreText);

document.body.appendChild(mainMenuHighScoreContainer);

const modal = document.createElement('div');
Object.assign(modal.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0)',
    padding: '20px',
    width: '80%',
    maxWidth: '400px',
    background: '#333',
    color: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    zIndex: 1001,
});
document.body.appendChild(modal);

const modalTitle = document.createElement('h2');
modalTitle.id = 'modal-title';
Object.assign(modalTitle.style, {
    marginBottom: '15px',
    fontSize: '24px',
});
modal.appendChild(modalTitle);

const modalContent = document.createElement('div');
modalContent.id = 'modal-content';
Object.assign(modalContent.style, {
    fontSize: '16px',
    lineHeight: '1.6',
});
modal.appendChild(modalContent);

const closeButton = document.createElement('button');
closeButton.textContent = 'Close';
Object.assign(closeButton.style, {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    background: '#555',
    border: 'none',
    color: 'white',
    borderRadius: '5px',
});
modal.appendChild(closeButton);



const pauseModal = document.createElement('div');
Object.assign(pauseModal.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0)',
    padding: '30px',
    width: '80%',
    maxWidth: '350px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    color: '#ffffff',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    zIndex: 1001,
    display: 'none',
});
document.body.appendChild(pauseModal);

const pauseModalTitle = document.createElement('h2');
pauseModalTitle.textContent = 'Paused';
Object.assign(pauseModalTitle.style, {
    marginBottom: '15px',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
});
pauseModal.appendChild(pauseModalTitle);

const pauseHighScore = document.createElement('div');
pauseHighScore.id = 'pauseHighScore';
pauseHighScore.innerHTML = `High Score: ${highScore}`;
Object.assign(pauseHighScore.style, {
    fontSize: '20px',
    color: '#ffd700',
    marginBottom: '20px',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
});
pauseModal.appendChild(pauseHighScore);

const resumeButton = document.createElement('button');
resumeButton.textContent = 'Resume Game';
Object.assign(resumeButton.style, {
    marginTop: '20px',
    padding: '12px 25px',
    fontSize: '16px',
    cursor: 'pointer',
    background: 'rgba(76, 175, 80, 0.8)',
    border: 'none',
    color: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
    transition: 'background 0.3s, transform 0.2s',
});
resumeButton.addEventListener('mouseenter', () => {
    resumeButton.style.background = 'rgba(76, 175, 80, 1)';
    resumeButton.style.transform = 'scale(1.05)';
});
resumeButton.addEventListener('mouseleave', () => {
    resumeButton.style.background = 'rgba(76, 175, 80, 0.8)';
    resumeButton.style.transform = 'scale(1)';
});
pauseModal.appendChild(resumeButton);


const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
overlay.style.display = 'none';
document.body.appendChild(overlay);

document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameStarted && !isPaused && !gameOverTriggered) {
        pauseGame();
    }
});

const mainMenuMusic = new Audio('drone-high-tension-and-suspense-background-162365.mp3');
const gameSceneMusic = new Audio('adrenaline-roger-gabalda-main-version-02-23-11021.mp3');
const bossmodeMusic = new Audio('FastMix-2022-03-16_-_Escape_Route_-_www.FesliyanStudios.com_.mp3');
mainMenuMusic.loop = true;
mainMenuMusic.volume = 0.1;
gameSceneMusic.loop = true;
gameSceneMusic.volume = 0.13;
bossmodeMusic.loop = true;
bossmodeMusic.volume = 0.15;

musicButton.addEventListener('click', () => {
    if (isMusicPlaying) {
        mainMenuMusic.pause();
        gameSceneMusic.pause();
        bossmodeMusic.pause();
        musicButton.textContent = 'Music: Off';
    } else {
        if (currentScene === 'mainMenu') mainMenuMusic.play();
        else if (currentScene === 'gameScene') gameSceneMusic.play();
        musicButton.textContent = 'Music: On';
    }
    isMusicPlaying = !isMusicPlaying;
});

function updateMusic() {
    if (!isMusicPlaying) return;
    if (bossActive && currentScene === 'gameScene') {
        if (bossmodeMusic.paused) {
            gameSceneMusic.pause();
            gameSceneMusic.currentTime = 0;
            mainMenuMusic.pause();
            mainMenuMusic.currentTime = 0;
            bossmodeMusic.play();
        }
        return;
    }
    if (currentScene === 'mainMenu') {
        if (!mainMenuMusic.paused) return;
        gameSceneMusic.pause();
        gameSceneMusic.currentTime = 0;
        bossmodeMusic.pause();
        bossmodeMusic.currentTime = 0;
        mainMenuMusic.play();
    } else if (currentScene === 'gameScene') {
        if (!gameSceneMusic.paused) return;
        mainMenuMusic.pause();
        mainMenuMusic.currentTime = 0;
        bossmodeMusic.pause();
        bossmodeMusic.currentTime = 0;
        gameSceneMusic.play();
    }
}

startButton.addEventListener('mouseenter', () => {
    startButton.style.backgroundColor = 'white';
    startButton.style.color = 'black';
});
startButton.addEventListener('mouseleave', () => {
    startButton.style.backgroundColor = 'transparent';
    startButton.style.color = 'white';
});
startButton.addEventListener('click', () => {
    console.log('Start button clicked, switching to game scene');
    switchToGameScene();
});

helpButton.addEventListener('click', () => {
    console.log('Help button clicked');
    modalTitle.textContent = 'Help';
    modalContent.textContent = 'Use arrow keys to move, space to jump, "P" to change position, and "S" to activate shield.';
    modal.style.transform = 'translate(-50%, -50%) scale(1)';
    overlay.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    modal.style.transform = 'translate(-50%, -50%) scale(0)';
    overlay.style.display = 'none';
});

pauseButton.addEventListener('click', () => {
    pauseGame();
});

resumeButton.addEventListener('click', () => {
    resumeGame();
});

const textureTest = textureLoader.load('/highway-lanes-unity/highway-lanes-unity/highway-lanes_albedo.png');
const textureNormal = textureLoader.load('/highway-lanes-unity/highway-lanes-unity/highway-lanes_normal-ogl.png');
const textureM = textureLoader.load('/highway-lanes-unity/highway-lanes-unity/highway-lanes_ao.png');
const textureR = textureLoader.load('/highway-lanes-unity/highway-lanes-unity/highway-lanes_preview.jpg');

const groundWidth = 60;
const groundLength = 50;
const groundCount = 3;
const tileSpacing = groundLength;
let speed = 0.5;
const speedIncrement = 0.1;
const maxGameSpeed = 1.3;
const milestoneDistance = 1000;

const groundMaterial = new THREE.MeshStandardMaterial({
    map: textureTest,
    normalMap: textureNormal,
    roughnessMap: textureR,
    side: THREE.DoubleSide,
    aoMap: textureM,
    metalness: 0.7,
});

const obstacles = [];
const maxObstacles = 1;
const minZDistance = 40;
const obstacleModels = ['royal_59_free__warhavoc_survival_car_pack.glb'];

function createObstacles() {
    if (bossActive || obstacles.length >= maxObstacles || !gameStarted) return;
    const selectedModel = obstacleModels[Math.floor(Math.random() * obstacleModels.length)];
    gltfLoader.load(selectedModel, 
        (gltf) => {
            try {
                if (!gltf || !gltf.scene) {
                    console.error('Invalid model loaded for obstacle');
                    return;
                }
                const model = gltf.scene;
                model.scale.set(1.3, 1.3, 1.3);
                model.position.set(
                    Math.random() * 10 - 5,
                    0.5,
                    obstacles.length > 0 ? obstacles[obstacles.length - 1].position.z - minZDistance : -20
                );
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                gameScene.add(model);
                obstacles.push(model);
                updateModelSize();
                if (!honkCooldown && gameStarted && !isPaused) {
                    honkSound.play().catch(err => console.warn('Could not play honk sound:', err));
                    honkCooldown = true;
                    setTimeout(() => honkCooldown = false, 1000);
                }
            } catch (error) {
                console.error('Error setting up obstacle:', error);
            }
        },
        undefined,
        (error) => {
            console.error(`Error loading obstacle model ${selectedModel}:`, error);
            setTimeout(createObstacles, 1000);
        }
    );
}

const explodeSound = new Audio("explosion-91872.mp3");
const honkSound = new Audio("car-horn-beep-beep-two-beeps-honk-honk-6188.mp3");
const honkLSound = new Audio("car-horn-1-189855.mp3");
const collisionSound = new Audio("mixkit-car-window-breaking-1551.wav");
const passingCarSound = new Audio("car-passing-105251.mp3");
const powerUpSound = new Audio("coin-pickup-98269.mp3");
const powerUpActiveSound = new Audio("mixkit-electronics-power-up-2602.wav");
const powerUpEndSound = new Audio("power-up-end.mp3");
const shootSound = new Audio("pistol-shot-233473.mp3");
const hitSound = new Audio("young-man-being-hurt-95628.mp3");

function playShootSound() { if (gameStarted && !isPaused) shootSound.play(); }
function playHitSound() { if (gameStarted && !isPaused) hitSound.play(); }

honkSound.volume = 0.6;
collisionSound.volume = 0.8;
passingCarSound.volume = 0.5;
powerUpSound.volume = 0.7;
powerUpActiveSound.volume = 0.5;
powerUpEndSound.volume = 0.6;
explodeSound.volume = 0.8;
hitSound.volume = 0.5;
shootSound.volume = 0.4;

function handleCollision() { if (gameStarted && !isPaused) collisionSound.play(); }

function detectCollisionwithCars(character, obstacles) {
    if (!character || !obstacles) return false;
    try {
        const playerBox = new THREE.Box3().setFromObject(character);
        const obstacleBox = new THREE.Box3().setFromObject(obstacles);
        return playerBox.intersectsBox(obstacleBox);
    } catch (error) {
        console.error('Error in collision detection:', error);
        return false;
    }
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        if (bossActive) return;
        obstacle.position.z += speed;
        if (obstacle.position.z > 6) resetObstacle(obstacle);
        const distanceToPlayer = Math.abs(obstacle.position.z - character.position.z);
        if (distanceToPlayer < 5) passingCarSound.volume = Math.max(0, 1 - distanceToPlayer / 5);
        if (obstacle.position.z > character.position.z && !obstacle.hasPlayedPassingSound && gameStarted) {
            passingCarSound.play();
            obstacle.hasPlayedPassingSound = true;
        }
        if (detectCollisionwithCars(character, obstacle)) {
            if (character.position.y > 1.0) {
                score += 50;
            } else if (isShieldActive) {
                resetObstacle(obstacle);
                score += 1000;
                createExplosion(obstacle.position);
            } else {
                onPlayerCollision();
            }
        }
    });
}

function onPlayerCollision() {
    gameOver();
    handleCollision();
    if (gameStarted && !isPaused) honkLSound.play();
}

function resetObstacle(obstacle) {
    obstacle.position.z = -20;
    obstacle.position.x = Math.random() * 10 - 5;
    obstacle.hasPlayedPassingSound = false;
}

function startObstacleCreation() {
    if (obstaclesInterval) clearInterval(obstaclesInterval);
    obstaclesInterval = setInterval(createObstacles, 6000);
}

function removeAllObstacles() {
    obstacles.forEach(obstacle => gameScene.remove(obstacle));
    obstacles.length = 0;
}

const powerUps = [];
const powerUpModels = [
    { name: 'shield', model: 'medieval_wood_heater_shield.glb' },
    { name: 'bitcoin', model: 'realistic_3d_bitcoin_model__crypto_asset.glb' },
    { name: 'changeposition', model: 'potion_for_media__motion.glb' }
];

function createPowerUps() {
    const selectedPowerUp = powerUpModels[Math.floor(Math.random() * powerUpModels.length)];
    gltfLoader.load(selectedPowerUp.model, (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        model.position.set(Math.random() * 10 - 5, 0.5, -20);
        model.userData.type = selectedPowerUp.name;
        gameScene.add(model);
        powerUps.push(model);
    }, undefined, (error) => console.error(`Error loading power-up model:`, error));
}

function updatePowerUps() {
    powerUps.forEach((powerUp, index) => {
        powerUp.position.z += speed;
        if (powerUp.position.z > 6) {
            gameScene.remove(powerUp);
            powerUps.splice(index, 1);
        }
        if (detectCollisionwithCars(character, powerUp)) {
            triggerPowerUpEffect(powerUp.userData.type);
            gameScene.remove(powerUp);
            powerUps.splice(index, 1);
            if (gameStarted && !isPaused) powerUpSound.play();
        }
    });
}

function triggerPowerUpEffect(type) {
    if (type === 'shield') collectShield();
    else if (type === 'bitcoin') rewardBitcoin();
    else if (type === 'changeposition') changecharacterPosition();
}

function changecharacterPosition() {
    collectedPositions++;
    updatePositionButton();
}

const defaultSpeed = 0.8;
const speedboost = 2;
let shieldMaterial;

function createShieldVisual() {
    const shieldSize = character.scale.x * shieldSizeMultiplier;
    const shieldGeometry = new THREE.SphereGeometry(shieldSize, 32, 32);
    shieldMaterial = new THREE.MeshBasicMaterial({ color: 0xddeeff, transparent: true, opacity: 0.3 });
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: { viewVector: { type: "v3", value: camera.position } },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(0.85, 0.92, 1.0, 0.3) * intensity;
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });
    const baseShield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    const glowShield = new THREE.Mesh(shieldGeometry, glowMaterial);
    glowShield.scale.set(1.2, 1.2, 1.2);
    const shieldGroup = new THREE.Group();
    shieldGroup.add(baseShield);
    shieldGroup.add(glowShield);
    return shieldGroup;
}

function createExplosion(position) {
    const explosionGeometry = new THREE.SphereGeometry(2, 32, 32);
    const explosionMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.7 });
    const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
    explosion.position.copy(position);
    if (gameStarted && !isPaused) explodeSound.play();
    gameScene.add(explosion);
    const duration = 500;
    const startTime = Date.now();
    function animateExplosion() {
        const elapsedTime = Date.now() - startTime;
        const scale = 1 + (elapsedTime / duration) * 2;
        explosion.scale.set(scale, scale, scale);
        explosion.material.opacity = 1 - elapsedTime / duration;
        if (elapsedTime < duration) requestAnimationFrame(animateExplosion);
        else gameScene.remove(explosion);
    }
    animateExplosion();
}

function pulseShield() {
    if (shieldVisual) {
        const scaleFactor = 1.05;
        const duration = 0.8;
        gsap.to(shieldVisual.scale, {
            x: scaleFactor,
            y: scaleFactor,
            z: scaleFactor,
            duration: duration / 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
        });
    }
}

function activateShield() {
    if (isShieldActive || collectedShields <= 0) return;
    isShieldActive = true;
    collectedShields -= 1;
    updateShieldButton();
    pulseShield();
    shieldVisual = createShieldVisual();
    shieldVisual.position.copy(character.position);
    gameScene.add(shieldVisual);
    shieldTimer = setTimeout(() => {
        isShieldActive = false;
        gameScene.remove(shieldVisual);
        shieldVisual = null;
    }, 5000);
}

function rewardBitcoin() {
    collectibleCount++;
    score += 5000;
}

function updateScore() {
    distanceTraveled += speed;
    score += pointsPerDistance;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    scoreElement.valueElement.innerHTML = score;
    coinsElement.valueElement.innerHTML = collectibleCount;
    distanceElement.valueElement.innerHTML = Math.floor(distanceTraveled) + "m";
    highScoreElement.valueElement.innerHTML = highScore;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.valueElement.innerHTML = highScore;
        mainMenuHighScoreText.innerHTML = `${highScore}`;
    }
}

function jump() {
    if (isJumping || !character) return;
    isJumping = true;
    gsap.to(character.position, {
        y: jumpHeight,
        duration: jumpDuration / 2,
        ease: 'power2.out',
        onComplete: () => {
            gsap.to(character.position, {
                y: 0,
                duration: jumpDuration / 2,
                ease: 'power2.in',
                onComplete: () => {
                    isJumping = false;
                },
            });
        },
    });
}

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
    document.body.appendChild(gamepadContainer);

    function createGamepadButton(label, action) {
        const button = document.createElement('button');
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.borderRadius = '50%';
        button.style.border = 'none';
        button.style.background = 'rgba(255, 255, 255, 0.4)';
        button.style.color = '#fff';
        button.style.fontSize = '20px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.3s ease';
        button.style.position = 'relative';
        button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        button.innerHTML = label;
        button.addEventListener('mouseover', () => {
            button.style.background = 'rgba(255, 255, 255, 0.6)';
            button.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseout', () => {
            button.style.background = 'rgba(255, 255, 255, 0.4)';
            button.style.transform = 'scale(1)';
        });
        button.addEventListener('click', action);
        return button;
    }

    shieldButton = createGamepadButton('X', activateShield);
    gamepadContainer.appendChild(shieldButton);
    positionButton = createGamepadButton('O', changePosition);
    gamepadContainer.appendChild(positionButton);
    const jumpButton = createGamepadButton('J', jump);
    gamepadContainer.appendChild(jumpButton);
}

function updatePositionButton() {
    positionButton.innerHTML = `O <span style="font-size:7px;">${collectedPositions}</span>`;
    positionButton.disabled = collectedPositions === 0;
    positionButton.style.opacity = collectedPositions === 0 ? '0.2' : '1';
}

function updateShieldButton() {
    shieldButton.innerHTML = `X <span style="font-size:7px;">${collectedShields}</span>`;
    shieldButton.disabled = collectedShields === 0;
    shieldButton.style.opacity = collectedShields === 0 ? '0.2' : '1';
}

function changePosition() {
    if (collectedPositions <= 0) return;
    updatePositionButton();
    const randomMove = Math.random() < 0.5 ? -5 : 5;
    const newPositionX = character.position.x + randomMove;
    const halfGroundWidth = groundWidth / 2;
    if (newPositionX >= -halfGroundWidth && newPositionX <= halfGroundWidth) {
        character.position.x = newPositionX;
        collectedPositions -= 1;
        updatePositionButton();
        const moveSound = new Audio('movement-swipe-whoosh-1-186575.mp3');
        moveSound.volume = 0.5;
        if (gameStarted && !isPaused) moveSound.play();
    }
}

function collectShield() {
    collectedShields += 1;
    updateShieldButton();
}

function setupJoystick() {
    const joystick = document.createElement("div");
    joystick.id = 'gameJoystick'; // Add unique ID
    Object.assign(joystick.style, {
        position: "absolute",
        bottom: "5%",
        left: "3%",
        width: "250px",
        height: "60px",
        borderRadius: "30px",
        background: "rgba(0, 0, 0, 0.5)",
        touchAction: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    });
    document.body.appendChild(joystick);

    const handle = document.createElement("div");
    Object.assign(handle.style, {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.8)",
        touchAction: "none",
        position: "absolute",
        transform: "translate(0, 0)",
    });
    joystick.appendChild(handle);

    let isDragging = false, initialTouch = null;
    const movementSpeed = 0.25, deadZone = 7;
    let joystickRadius = 30;

    function adjustJoystickRadius() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        joystickRadius = Math.min(screenWidth, screenHeight) * 0.15;
    }
    window.addEventListener("resize", adjustJoystickRadius);

    joystick.addEventListener("touchstart", (e) => {
        isDragging = true;
        initialTouch = e.touches[0];
    });

    joystick.addEventListener("touchmove", (e) => {
        if (isDragging && initialTouch) {
            const rect = joystick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            let deltaX = e.touches[0].clientX - centerX;
            const distance = Math.abs(deltaX);
            if (distance > joystickRadius) deltaX = Math.sign(deltaX) * joystickRadius;
            if (Math.abs(deltaX) > deadZone) {
                const normalizedX = deltaX / joystickRadius;
                const { left, right } = calculateCameraBounds();
                character.position.x = Math.min(Math.max(character.position.x + normalizedX * movementSpeed, left), right);
                const handleOffsetX = Math.min(Math.max(deltaX, -joystickRadius + handle.offsetWidth / 2), joystickRadius - handle.offsetWidth / 2);
                handle.style.transform = `translate(${handleOffsetX}px, 0)`;
            }
        }
    });

    joystick.addEventListener("touchend", () => {
        isDragging = false;
        initialTouch = null;
        handle.style.transform = "translate(0, 0)";
    });

    function calculateCameraBounds() {
        const aspect = window.innerWidth / window.innerHeight;
        const distance = camera.position.z - character.position.z;
        const verticalFOV = THREE.MathUtils.degToRad(camera.fov);
        const halfHeight = Math.tan(verticalFOV / 2) * distance;
        const halfWidth = halfHeight * aspect;
        return { left: -halfWidth + 0.1, right: halfWidth - 0.1 };
    }
    adjustJoystickRadius();
}


let moveLeft = false, moveRight = false;
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveLeft = true;
    if (event.key === 'ArrowRight') moveRight = true;
    if (event.key.toLowerCase() === 'p') changePosition();
    if (event.key.toLowerCase() === 's') activateShield();
    if (event.key === ' ' && !isJumping) jump();
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') moveLeft = false;
    if (event.key === 'ArrowRight') moveRight = false;
});

function updatePlayer() {
    if (moveLeft && character.position.x > -5) character.position.x -= 0.34;
    if (moveRight && character.position.x < 5) character.position.x += 0.34;
}

function updateModelSize() {
    if (currentScene !== 'gameScene' || !character) return;
    try {
        const scale = window.innerWidth <= 768 ? 1.15 : 1.3;
        character.scale.set(scale, scale, scale);
        obstacles.forEach(obstacle => {
            if (obstacle && obstacle.scale) {
                obstacle.scale.set(scale, scale, scale);
            }
        });
    } catch (error) {
        console.error('Error updating model sizes:', error);
    }
}

function updateCameraPosition() {
    if (currentScene !== 'gameScene') return;
    if (window.innerWidth <= 768) camera.position.set(0, 4, 10);
    else camera.position.set(0, 4, 6);
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    updateCameraPosition();
    updateModelSize();
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 4;
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const clock = new THREE.Clock();

function initializeScene() {
    loadAssets(() => {
        for (let i = 0; i < groundCount; i++) {
            const zOffset = -i * tileSpacing;
            const tile = createTile(zOffset);
            gameScene.add(tile);
            tileGroups.push(tile);
        }
        tilesReady = true;
    });
}

function loadAssets(callback) {
    let assetsLoaded = 0;
    const checkAssetsLoaded = () => {
        assetsLoaded++;
        if (assetsLoaded === 2) callback();
    };
    loadModel('realistic_chicago_buildings.glb', (model) => {
        treeModel = model;
        checkAssetsLoaded();
    });
    loadModel('realistic_palm_tree_free.glb', (model) => {
        buildingModel = model;
        checkAssetsLoaded();
    });
}

function loadModel(path, callback) {
    gltfLoader.load(path, (gltf) => callback(gltf.scene), undefined, (error) => {
        console.error(`Error loading ${path}:`, error);
        callback(null);
    });
}

function createTile(zOffset) {
    const tileGroup = new THREE.Group();
    const groundGeo = new THREE.PlaneGeometry(groundWidth, groundLength);
    const ground = new THREE.Mesh(groundGeo, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    tileGroup.add(ground);

    for (let z = -groundLength / 2; z < groundLength / 2; z += 10) {
        const treeLeft = createTree();
        treeLeft.position.set(-25, 0, z);
        tileGroup.add(treeLeft);
        const treeRight = createTree();
        treeRight.position.set(20, 0, z);
        tileGroup.add(treeRight);
    }

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

function createTree(scale = 0.085) {
    if (!treeModel) return new THREE.Group();
    const treeInstance = treeModel.clone();
    treeInstance.scale.set(scale, scale, scale);
    treeInstance.castShadow = true;
    treeInstance.receiveShadow = true;
    return treeInstance;
}

function createBuilding(scale = 1.4) {
    if (!buildingModel) return new THREE.Group();
    const buildingInstance = buildingModel.clone();
    buildingInstance.scale.set(scale, scale, scale);
    buildingInstance.castShadow = true;
    buildingInstance.receiveShadow = true;
    return buildingInstance;
}

function updateGround() {
    if (!tilesReady) return;
    tileGroups.forEach((tile) => {
        tile.position.z += speed;
        if (tile.position.z > tileSpacing) tile.position.z -= groundCount * tileSpacing;
    });
}

const notifications = {
    low: ["Things are about to heat up!", "Can you handle this?", "It's getting serious now!"],
    medium: ["You're doing great—keep it up!", "Don't lose focus now!", "The challenge is rising!"],
    high: ["Only the best can survive this!", "Stay sharp—it's brutal now!", "You're in elite territory!"],
};

function getRandomNotification(range) {
    const messages = notifications[range];
    return messages[Math.floor(Math.random() * messages.length)];
}

function notifyDifficultyIncrease(milestoneRange) {
    if (bossActive) return;
    const notificationText = getRandomNotification(milestoneRange);
    const notification = document.createElement('div');
    notification.textContent = notificationText;
    notification.style.cssText = `
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        font-size: 16px;
        borderRadius: 5px;
        z-index: 1000;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        animation: fadeInOut 3s ease-in-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function adjustSpeedBasedOnProgress() {
    const milestonePassed = Math.floor(distanceTraveled / milestoneDistance);
    if (milestonePassed > 0 && speed < maxGameSpeed) {
        const milestoneRange = milestonePassed <= 3 ? "low" : milestonePassed <= 6 ? "medium" : "high";
        if (Math.floor(distanceTraveled) % milestoneDistance === 0) {
            speed = Math.min(speed + speedIncrement, maxGameSpeed);
            if (!bossActive) notifyDifficultyIncrease(milestoneRange);
        }
    }
}

function updateDistance(delta) {
    if (bossActive) return;
    distanceTraveled += speed * delta * 60;
    console.log("Distance Traveled Updated:", distanceTraveled);
    adjustSpeedBasedOnProgress();
    checkBossTrigger();
}

function pauseGame() {
    if (!gameStarted || isPaused) return;
    isPaused = true;
    pauseModal.style.display = 'block';
    pauseModal.style.transform = 'translate(-50%, -50%) scale(1)';
    overlay.style.display = 'block';
    pauseHighScore.innerHTML = `High Score: ${highScore}`;
    if (isMusicPlaying) {
        gameSceneMusic.pause();
        bossmodeMusic.pause();
    }
    explodeSound.pause();
    honkSound.pause();
    honkLSound.pause();
    collisionSound.pause();
    passingCarSound.pause();
    powerUpSound.pause();
    powerUpActiveSound.pause();
    powerUpEndSound.pause();
    shootSound.pause();
    hitSound.pause();
    console.log('All sounds paused');
    // No need to clear bossTimeCountdown here; it's paused via isPaused check
}

function resumeGame() {
    if (!gameStarted || !isPaused) return;
    isPaused = false;
    pauseModal.style.transform = 'translate(-50%, -50%) scale(0)';
    pauseModal.style.display = 'none';
    overlay.style.display = 'none';
    if (isMusicPlaying) {
        if (bossActive) bossmodeMusic.play();
        else gameSceneMusic.play();
    }
    if (bossActive) {
        startBossShooting();
        // Ensure timer continues from where it left off
        if (bossTimeCountdown) {
            console.log('Boss timer already running, continuing with time:', bossTimeRemaining);
        } else {
            // If somehow cleared, restart it
            bossTimeCountdown = setInterval(() => {
                if (!isPaused && bossActive) {
                    bossTimeRemaining--;
                    bossTimerText.textContent = bossTimeRemaining;
                    if (bossTimeRemaining <= 0) endBossMode();
                }
            }, 1000);
            console.log('Boss timer restarted with remaining time:', bossTimeRemaining);
        }
    }
    animate();
    console.log('Game resumed, music and boss timer managed');
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    if (currentScene === 'gameScene' && gameStarted && !isPaused) {
        controls.update();
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        updateGround();
        updateObstacles();
        if (bossActive) {
            updateBossProjectiles();
            updateHealthUI();
        }
        updatePowerUps();
        updateScoreDisplay();
        updateScore();
        updatePlayer();
        updateDistance(delta);
        if (isShieldActive && shieldVisual) {
            shieldVisual.position.copy(character.position);
        }
        if (!obstaclesInterval) startObstacleCreation();
        if (!powerUpIntervalId) powerUpIntervalId = setInterval(createPowerUps, 10000);
        renderer.render(gameScene, camera);
        controls.enableRotate = false;
        controls.autoRotate = false;
        statsContainer.style.display = "block";
        mainMenuHighScoreContainer.style.display = 'none';
        updateMusic();
    } else if (currentScene === 'mainMenu') {
        controls.enableRotate = true;
        controls.autoRotate = true;
        updateMusic();
        renderer.render(mainMenuScene, camera);
        statsContainer.style.display = "none";
        pauseButton.style.display = 'none';
        mainMenuHighScoreContainer.style.display = 'block';
        mainMenuHighScoreText.innerHTML = `${highScore}`;
    }
}

function gameOver() {
    gameOverTriggered = true;
    cancelAnimationFrame(animationFrameId);
    updateHighScore();
    document.getElementById("coinsCollected").innerHTML = `Coins Collected: ${collectibleCount}`;
    document.getElementById("totalScore").innerHTML = `Score: ${score}`;
    document.getElementById("distanceTraveled").innerHTML = `Distance Traveled: ${Math.floor(distanceTraveled)}m`;
    document.getElementById("highScore").innerHTML = `<span style="color: #ff9800;">🏆 High Score:</span> ${highScore}`;
    if (bossActive) {
        clearTimeout(bossModeTimer);
        clearInterval(bossMovementInterval);
        clearInterval(bossShootingInterval);
        bossShootingInterval = null;
        clearInterval(bossTimeCountdown);
        if (boss) {
            gameScene.remove(boss);
            boss = null;
        }
        document.getElementById("bossHealthBarContainer").style.display = "none";
        document.getElementById("playerHealthBarContainer").style.display = "none";
        bossTimerUI.style.display = "none";
    }
    gameOverContainer.style.display = "flex";
    setTimeout(() => gameOverContainer.style.opacity = "1", 50);
    statsContainer.style.display = "none";
    pauseButton.style.display = 'none';
    if (powerUpIntervalId) {
        clearInterval(powerUpIntervalId);
        powerUpIntervalId = null;
    }
    if (obstaclesInterval) {
        clearInterval(obstaclesInterval);
        obstaclesInterval = null;
    }
    explodeSound.pause();
    honkSound.pause();
    honkLSound.pause();
    collisionSound.pause();
    passingCarSound.pause();
    powerUpSound.pause();
    powerUpActiveSound.pause();
    powerUpEndSound.pause();
    shootSound.pause();
    hitSound.pause();
}

function createHealthBars() {
    const bossHealthBarContainer = document.createElement("div");
    bossHealthBarContainer.id = "bossHealthBarContainer";
    bossHealthBarContainer.style.display = "none";
    bossHealthBarContainer.style.position = "absolute";
    bossHealthBarContainer.style.top = "10px";
    bossHealthBarContainer.style.left = "50%";
    bossHealthBarContainer.style.transform = "translateX(-50%)";
    bossHealthBarContainer.style.background = "rgba(0,0,0,0.7)";
    bossHealthBarContainer.style.padding = "10px";
    bossHealthBarContainer.style.borderRadius = "10px";
    const bossHealthBar = document.createElement("div");
    bossHealthBar.id = "bossHealthBar";
    bossHealthBar.style.width = "150px";
    bossHealthBar.style.height = "20px";
    bossHealthBar.style.background = "red";
    bossHealthBarContainer.appendChild(bossHealthBar);
    document.body.appendChild(bossHealthBarContainer);

    const playerHealthBarContainer = document.createElement("div");
    playerHealthBarContainer.id = "playerHealthBarContainer";
    playerHealthBarContainer.style.display = "none";
    playerHealthBarContainer.style.position = "absolute";
    playerHealthBarContainer.style.top = "5px";
    playerHealthBarContainer.style.left = "50%";
    playerHealthBarContainer.style.transform = "translateX(-50%)";
    playerHealthBarContainer.style.background = "rgba(0,0,0,0.7)";
    playerHealthBarContainer.style.padding = "10px";
    playerHealthBarContainer.style.borderRadius = "10px";
    const playerHealthBar = document.createElement("div");
    playerHealthBar.id = "playerHealthBar";
    playerHealthBar.style.width = "150px";
    playerHealthBar.style.height = "15px";
    playerHealthBar.style.background = "green";
    playerHealthBarContainer.appendChild(playerHealthBar);
    document.body.appendChild(playerHealthBarContainer);
}
createHealthBars();

function updateHealthUI() {
    const bossHealthBar = document.getElementById("bossHealthBar");
    const playerHealthBar = document.getElementById("playerHealthBar");
    if (bossHealthBar) bossHealthBar.style.width = `${bossHealth}px`;
    if (playerHealthBar) playerHealthBar.style.width = `${characterHealth}px`;
}

let bossTimerUI = document.createElement("div");
bossTimerUI.id = "bossTimer";
bossTimerUI.style.position = "absolute";
bossTimerUI.style.top = "30px";
bossTimerUI.style.left = "50%";
bossTimerUI.style.transform = "translateX(-50%)";
bossTimerUI.style.fontSize = "10px";
bossTimerUI.style.fontWeight = "bold";
bossTimerUI.style.background = "rgba(0, 0, 0, 0.7)";
bossTimerUI.style.color = "white";
bossTimerUI.style.padding = "5px 10px";
bossTimerUI.style.borderRadius = "5px";
bossTimerUI.style.display = "none";
let bossTimerText = document.createElement("span");
bossTimerText.id = "bossTimeRemaining";
bossTimerUI.appendChild(document.createTextNode("Time Left: "));
bossTimerUI.appendChild(bossTimerText);
bossTimerUI.appendChild(document.createTextNode("s"));
document.body.appendChild(bossTimerUI);

let bossTimeRemaining = 200;

function startBossMode() {
    bossActive = true;
    console.log("Boss Mode Activated! Distance Traveled:", distanceTraveled);
    removeAllObstacles();
    document.getElementById("playerHealthBarContainer").style.display = "block";
    spawnBoss();
    bossStartTime = Date.now();
    bossTimeRemaining = 200; // Reset timer
    bossTimerUI.style.display = "block";
    bossTimerText.textContent = bossTimeRemaining;
    // Clear any existing interval to avoid duplicates
    if (bossTimeCountdown) clearInterval(bossTimeCountdown);
    bossTimeCountdown = setInterval(() => {
        if (!isPaused && bossActive) { // Only tick if not paused and boss is active
            bossTimeRemaining--;
            bossTimerText.textContent = bossTimeRemaining;
            if (bossTimeRemaining <= 0) endBossMode();
        }
    }, 1000);
    bossModeTimer = setTimeout(() => {
        if (!gameOverTriggered) endBossMode();
    }, 200000);
}

function spawnBoss() {
    gltfLoader.load('the_ugv_robot_2.glb', (gltf) => {
        boss = gltf.scene;
        boss.scale.set(2, 2, 2);
        boss.position.set(0, 0, -30);
        gameScene.add(boss);
        updateBossPosition();
        startBossShooting();
    });
}

const bulletTexture = textureLoader.load('409100639_da9fefba-d870-4caa-ba9f-8f0c9f3d50ff.jpg');

function createBossProjectile() {
    const bulletGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const bulletMaterial = new THREE.MeshStandardMaterial({ map: bulletTexture, side: THREE.DoubleSide, metalness: 0.5 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.copy(boss.position);
    bullet.rotation.x = Math.PI / 2;
    const targetPosition = character.position.clone();
    targetPosition.y += 1.2;
    const direction = new THREE.Vector3().subVectors(targetPosition, boss.position).normalize();
    bullet.velocity = direction.multiplyScalar(bulletSpeed);
    if (!character || !character.position) return null;
    gameScene.add(bullet);
    return bullet;
}

function updateBossProjectiles() {
    bossProjectiles.forEach((bullet, index) => {
        if (!bullet || !bullet.velocity) return;
        bullet.position.add(bullet.velocity);
        if (bullet.position.z > 50 || bullet.position.z < -50) {
            gameScene.remove(bullet);
            bossProjectiles.splice(index, 1);
        }
        if (detectCollisionwithPlayer(character, bullet)) {
            handlePlayerCollision(bullet);
            gameScene.remove(bullet);
            bossProjectiles.splice(index, 1);
        }
    });
}

function detectCollisionwithPlayer(character, bullet) {
    return character.position.distanceTo(bullet.position) < 1.5;
}

function handlePlayerCollision(bullet) {
    if (selectedCharacter === 'myavatar.glb') {
        const hurtSound = new Audio('young-man-being-hurt-95628.mp3');
        hurtSound.volume = volumeLevel * 0.5;
        hurtSound.play();
    } else if (selectedCharacter === 'avatar2.glb') {
        const hurtSound = new Audio('female-hurt-2-94301.mp3');
        hurtSound.volume = volumeLevel * 0.5;
        hurtSound.play();
    }
    createBloodEffect(bullet.position);
    character.position.x += (Math.random() - 0.5) * 0.5;
    characterHealth -= 5;
    updateHealthUI();
    if (characterHealth <= 0) gameOver();
}

function createBloodEffect(position) {
    const bloodParticles = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const bloodGeometry = new THREE.SphereGeometry(0.05, 4, 4);
        const bloodMaterial = new THREE.MeshBasicMaterial({ color: 0x8b0000 });
        const bloodDrop = new THREE.Mesh(bloodGeometry, bloodMaterial);
        bloodDrop.position.copy(position);
        bloodDrop.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.2
        );
        bloodParticles.add(bloodDrop);
    }
    gameScene.add(bloodParticles);
    function animateBlood() {
        bloodParticles.children.forEach((particle) => {
            particle.position.add(particle.velocity);
            particle.velocity.y -= 0.01;
        });
        setTimeout(() => gameScene.remove(bloodParticles), 800);
    }
    setInterval(animateBlood, 50);
}

function updateBossPosition() {
    if (!boss || !bossActive) return;
    if (bossMovementInterval) {
        clearInterval(bossMovementInterval);
        bossMovementInterval = null;
    }
    bossMovementInterval = setInterval(() => {
        if (!boss || !character || isPaused || !bossActive) {
            clearInterval(bossMovementInterval);
            bossMovementInterval = null;
            return;
        }
        const dx = character.position.x - boss.position.x;
        if (Math.abs(dx) > 0.1) boss.position.x += dx * bossSpeed;
    }, 500);
}

function createMuzzleFlash() {
    const flashMaterial = new THREE.SpriteMaterial({ color: 0xffee00 });
    const muzzleFlash = new THREE.Sprite(flashMaterial);
    muzzleFlash.scale.set(1, 1, 1);
    muzzleFlash.position.copy(boss.position);
    gameScene.add(muzzleFlash);
    setTimeout(() => gameScene.remove(muzzleFlash), muzzleFlashDuration);
}

function startBossShooting() {
    if (!boss || !bossActive) return;
    if (bossShootingInterval) {
        clearInterval(bossShootingInterval);
        bossShootingInterval = null;
    }
    console.log("🚀 Boss Started Shooting!");
    bossShootingInterval = setInterval(() => {
        if (!bossActive || isPaused || !boss) {
            return;
        }
        createMuzzleFlash();
        const bullet = createBossProjectile();
        if (bullet) bossProjectiles.push(bullet);
        playShootSound();
    }, 2000);
}

function checkBossTrigger() {
    console.log("Checking Boss Trigger - Distance:", distanceTraveled, "Boss Active:", bossActive, "Boss Mode Completed:", bossModeCompleted);
    if (distanceTraveled >= 50000 && !bossActive && !bossModeCompleted) {
        startBossMode();
    }
}

function endBossMode() {
    bossActive = false;
    bossModeCompleted = true;
    collectibleCount += 10;
    document.getElementById("playerHealthBarContainer").style.display = "none";
    bossTimerUI.style.display = "none";
    if (!bossmodeMusic.paused) {
        bossmodeMusic.pause();
        bossmodeMusic.currentTime = 0;
    }
    if (gameSceneMusic.paused) gameSceneMusic.play();
    clearInterval(bossTimeCountdown);
    clearTimeout(bossModeTimer);
    clearInterval(bossMovementInterval);
    if (bossShootingInterval) {
        clearInterval(bossShootingInterval);
        bossShootingInterval = null;
    }
    if (boss) {
        gameScene.remove(boss);
        boss = null;
    }
    startObstacleCreation();
}

const statsContainer = document.createElement("div");
statsContainer.style.position = "absolute";
statsContainer.style.top = "10px";
statsContainer.style.left = "10px";
statsContainer.style.background = "rgba(0, 0, 0, 0.5)";
statsContainer.style.padding = "10px";
statsContainer.style.borderRadius = "8px";
statsContainer.style.display = "flex";
statsContainer.style.flexDirection = "column";
statsContainer.style.gap = "10px";
statsContainer.style.display = "none";
document.body.appendChild(statsContainer);

function createStatElement(imageSrc, value = 0) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    const img = document.createElement("img");
    img.src = imageSrc;
    img.style.width = "25px";
    img.style.height = "25px";
    img.style.marginRight = "8px";
    const valueElement = document.createElement("span");
    valueElement.style.color = "white";
    valueElement.style.fontSize = "18px";
    valueElement.style.fontFamily = "Arial, sans-serif";
    valueElement.innerHTML = value;
    container.appendChild(img);
    container.appendChild(valueElement);
    return { container, valueElement };
}

const scoreElement = createStatElement("xp_17596046.png");
const coinsElement = createStatElement("https://img.icons8.com/?size=100&id=ovHld7NfgG9g&format=png&color=000000");
const distanceElement = createStatElement("destination_854945.png");
const highScoreElement = createStatElement("https://img.icons8.com/?size=100&id=JIHcx48yhK29&format=png&color=000000", highScore);

statsContainer.appendChild(scoreElement.container);
statsContainer.appendChild(coinsElement.container);
statsContainer.appendChild(distanceElement.container);
statsContainer.appendChild(highScoreElement.container);

const gameOverContainer = document.createElement("div");
gameOverContainer.style.position = "fixed";
gameOverContainer.style.top = "0";
gameOverContainer.style.left = "0";
gameOverContainer.style.width = "100vw";
gameOverContainer.style.height = "100vh";
gameOverContainer.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
gameOverContainer.style.display = "flex";
gameOverContainer.style.justifyContent = "center";
gameOverContainer.style.alignItems = "center";
gameOverContainer.style.flexDirection = "column";
gameOverContainer.style.color = "#fff";
gameOverContainer.style.fontFamily = "'Poppins', sans-serif";
gameOverContainer.style.zIndex = "1001";
gameOverContainer.style.opacity = "0";
gameOverContainer.style.transition = "opacity 0.5s ease-in-out";
gameOverContainer.style.display = "none";
document.body.appendChild(gameOverContainer);

const gameOverMessage = document.createElement("div");
gameOverMessage.innerHTML = "GAME OVER";
gameOverMessage.style.fontSize = "3rem";
gameOverMessage.style.fontWeight = "bold";
gameOverMessage.style.letterSpacing = "5px";
gameOverMessage.style.color = "#ff4c4c";
gameOverMessage.style.textShadow = "0 0 15px rgba(255, 76, 76, 0.8)";
gameOverMessage.style.marginBottom = "30px";
gameOverContainer.appendChild(gameOverMessage);

const motivationalMessage = document.createElement("div");
motivationalMessage.innerHTML = "Don't be lazy, get up and try again!";
motivationalMessage.style.fontSize = "1.5rem";
motivationalMessage.style.fontWeight = "600";
motivationalMessage.style.color = "#ffd700";
motivationalMessage.style.textShadow = "0 0 10px rgba(255, 215, 0, 0.8)";
motivationalMessage.style.marginBottom = "20px";
gameOverContainer.appendChild(motivationalMessage);

const summaryContainer = document.createElement("div");
summaryContainer.style.textAlign = "center";
summaryContainer.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
summaryContainer.style.padding = "20px";
summaryContainer.style.borderRadius = "15px";
summaryContainer.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.5)";
summaryContainer.style.width = "80%";
summaryContainer.style.maxWidth = "400px";

const coinsCollected = document.createElement("div");
coinsCollected.id = "coinsCollected";
coinsCollected.innerHTML = `<span style="color: #ffd700;">🪙 Coins Collected:</span> 0`;
coinsCollected.style.marginBottom = "10px";
coinsCollected.style.fontSize = "1.5rem";
summaryContainer.appendChild(coinsCollected);

const totalScore = document.createElement("div");
totalScore.id = "totalScore";
totalScore.innerHTML = `<span style="color: #4caf50;">⭐ Score:</span> 0`;
totalScore.style.marginBottom = "10px";
totalScore.style.fontSize = "1.5rem";
summaryContainer.appendChild(totalScore);

const distanceTraveledDisplay = document.createElement("div");
distanceTraveledDisplay.id = "distanceTraveled";
distanceTraveledDisplay.innerHTML = `<span style="color: #2196f3;">📏 Distance Traveled:</span> 0m`;
distanceTraveledDisplay.style.marginBottom = "10px";
distanceTraveledDisplay.style.fontSize = "1.5rem";
summaryContainer.appendChild(distanceTraveledDisplay);

const highScoreDisplay = document.createElement("div");
highScoreDisplay.id = "highScore";
highScoreDisplay.innerHTML = `<span style="color: #ff9800;">🏆 High Score:</span> ${highScore}`;
highScoreDisplay.style.marginBottom = "10px";
highScoreDisplay.style.fontSize = "1.5rem";
summaryContainer.appendChild(highScoreDisplay);

gameOverContainer.appendChild(summaryContainer);

const restartButton = document.createElement("button");
restartButton.innerHTML = "Restart Game";
restartButton.style.marginTop = "30px";
restartButton.style.padding = "15px 30px";
restartButton.style.fontSize = "1.2rem";
restartButton.style.color = "#fff";
restartButton.style.backgroundColor = "#4caf50";
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

animate();
initializeScene();
updateCameraPosition();       
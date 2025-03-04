import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { gameScene, clock } from '../main.js';
import { moveLeft, moveRight, isJumping } from './controls.js';
import {
    playJumpSound,
    playCollectSound,
    playHitSound,
    playPowerUpSound,
    playGameOverSound,
    playCollisionSound,
    playPassingCarSound
} from './audio.js';
import { statsContainer, gameOverContainer } from './ui.js';

// Game Constants
const GROUND_WIDTH = 20;
const GROUND_LENGTH = 100;
const JUMP_HEIGHT = 2;
const MOVEMENT_SPEED = 0.1;
const OBSTACLE_SPAWN_RATE = 0.02;
const COLLECTIBLE_SPAWN_RATE = 0.01;
const POWER_UP_SPAWN_RATE = 0.005;

// Game State
const gameState = {
    score: 0,
    health: 100,
    coins: 0,
    distance: 0,
    isPaused: false,
    isGameOver: false,
    hasShield: false,
    shieldDuration: 0,
    character: null,
    characterMixer: null,
    obstacles: [],
    collectibles: [],
    powerUps: [],
    ground: null,
    skyDome: null
};

// Initialize Game Scene
export function initGameScene(selectedCharacter) {
    console.log('Initializing Game Scene');
    
    // Reset game state
    Object.assign(gameState, {
        score: 0,
        health: 100,
        coins: 0,
        distance: 0,
        isPaused: false,
        isGameOver: false,
        hasShield: false,
        shieldDuration: 0,
        obstacles: [],
        collectibles: [],
        powerUps: []
    });
    
    // Setup scene
    setupGround();
    setupLighting();
    setupSkyDome();
    loadCharacter(selectedCharacter);
    setupEventListeners();
    
    // Show UI
    statsContainer.style.display = 'flex';
    updateStats();
}

// Setup Ground
function setupGround() {
    const groundGeometry = new THREE.PlaneGeometry(GROUND_WIDTH, GROUND_LENGTH);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    });
    gameState.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    gameState.ground.rotation.x = -Math.PI / 2;
    gameState.ground.position.y = -0.5;
    gameScene.add(gameState.ground);
}

// Setup Lighting
function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    gameScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    gameScene.add(directionalLight);
}

// Setup Sky Dome
function setupSkyDome() {
    const skyGeometry = new THREE.SphereGeometry(50, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x87ceeb,
        side: THREE.BackSide
    });
    gameState.skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
    gameScene.add(gameState.skyDome);
}

// Load Character
async function loadCharacter(selectedCharacter) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    gltfLoader.setDRACOLoader(dracoLoader);
    
    try {
        const gltf = await gltfLoader.loadAsync(selectedCharacter.modelPath);
        gameState.character = gltf.scene;
        gameState.character.scale.set(0.5, 0.5, 0.5);
        gameState.character.position.set(0, 0, 0);
        gameScene.add(gameState.character);
        
        // Setup animations
        if (gltf.animations.length > 0) {
            gameState.characterMixer = new THREE.AnimationMixer(gameState.character);
            const idleAction = gameState.characterMixer.clipAction(gltf.animations[0]);
            idleAction.play();
        }
    } catch (error) {
        console.error('Error loading character:', error);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    window.addEventListener('keydown', (event) => {
        if (event.key === 'p' || event.key === 'P') {
            togglePause();
        }
    });
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !gameState.isPaused) {
            togglePause();
        }
    });
}

// Update Game Scene
export function updateGameScene() {
    if (gameState.isPaused || gameState.isGameOver) return;
    
    const deltaTime = clock.getDelta();
    
    // Update character
    if (gameState.character) {
        updateCharacterMovement(deltaTime);
        updateCharacterAnimation(deltaTime);
    }
    
    // Update obstacles
    updateObstacles(deltaTime);
    
    // Update collectibles
    updateCollectibles(deltaTime);
    
    // Update power-ups
    updatePowerUps(deltaTime);
    
    // Update shield
    if (gameState.hasShield) {
        gameState.shieldDuration -= deltaTime;
        if (gameState.shieldDuration <= 0) {
            deactivateShield();
        }
    }
    
    // Update score and distance
    gameState.distance += deltaTime * 5;
    gameState.score = Math.floor(gameState.distance);
    updateStats();
    
    // Check for game over
    if (gameState.health <= 0) {
        gameOver();
    }
}

// Update Character Movement
function updateCharacterMovement(deltaTime) {
    if (moveLeft) {
        gameState.character.position.x -= MOVEMENT_SPEED;
    }
    if (moveRight) {
        gameState.character.position.x += MOVEMENT_SPEED;
    }
    
    // Keep character within bounds
    gameState.character.position.x = Math.max(
        -GROUND_WIDTH / 2 + 1,
        Math.min(GROUND_WIDTH / 2 - 1, gameState.character.position.x)
    );
    
    // Handle jumping
    if (isJumping) {
        const jumpProgress = Math.sin((Date.now() % 1000) / 1000 * Math.PI);
        gameState.character.position.y = JUMP_HEIGHT * jumpProgress;
    } else {
        gameState.character.position.y = 0;
    }
}

// Update Character Animation
function updateCharacterAnimation(deltaTime) {
    if (gameState.characterMixer) {
        gameState.characterMixer.update(deltaTime);
    }
}

// Update Obstacles
function updateObstacles(deltaTime) {
    // Spawn new obstacles
    if (Math.random() < OBSTACLE_SPAWN_RATE) {
        spawnObstacle();
    }
    
    // Update existing obstacles
    gameState.obstacles.forEach((obstacle, index) => {
        obstacle.position.z -= deltaTime * 5;
        
        // Check collision
        if (checkCollision(gameState.character, obstacle)) {
            handleCollision(obstacle);
        }
        
        // Remove if off screen
        if (obstacle.position.z < -10) {
            gameScene.remove(obstacle);
            gameState.obstacles.splice(index, 1);
        }
    });
}

// Update Collectibles
function updateCollectibles(deltaTime) {
    // Spawn new collectibles
    if (Math.random() < COLLECTIBLE_SPAWN_RATE) {
        spawnCollectible();
    }
    
    // Update existing collectibles
    gameState.collectibles.forEach((collectible, index) => {
        collectible.position.z -= deltaTime * 5;
        collectible.rotation.y += deltaTime;
        
        // Check collection
        if (checkCollision(gameState.character, collectible)) {
            collectCollectible(collectible);
        }
        
        // Remove if off screen
        if (collectible.position.z < -10) {
            gameScene.remove(collectible);
            gameState.collectibles.splice(index, 1);
        }
    });
}

// Update Power-ups
function updatePowerUps(deltaTime) {
    // Spawn new power-ups
    if (Math.random() < POWER_UP_SPAWN_RATE) {
        spawnPowerUp();
    }
    
    // Update existing power-ups
    gameState.powerUps.forEach((powerUp, index) => {
        powerUp.position.z -= deltaTime * 5;
        powerUp.rotation.y += deltaTime;
        
        // Check collection
        if (checkCollision(gameState.character, powerUp)) {
            collectPowerUp(powerUp);
        }
        
        // Remove if off screen
        if (powerUp.position.z < -10) {
            gameScene.remove(powerUp);
            gameState.powerUps.splice(index, 1);
        }
    });
}

// Spawn Obstacle
function spawnObstacle() {
    const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    
    obstacle.position.set(
        (Math.random() - 0.5) * (GROUND_WIDTH - 2),
        0.5,
        GROUND_LENGTH / 2
    );
    
    gameScene.add(obstacle);
    gameState.obstacles.push(obstacle);
}

// Spawn Collectible
function spawnCollectible() {
    const collectibleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const collectibleMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const collectible = new THREE.Mesh(collectibleGeometry, collectibleMaterial);
    
    collectible.position.set(
        (Math.random() - 0.5) * (GROUND_WIDTH - 2),
        1,
        GROUND_LENGTH / 2
    );
    
    gameScene.add(collectible);
    gameState.collectibles.push(collectible);
}

// Spawn Power-up
function spawnPowerUp() {
    const powerUpGeometry = new THREE.OctahedronGeometry(0.5);
    const powerUpMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const powerUp = new THREE.Mesh(powerUpGeometry, powerUpMaterial);
    
    powerUp.position.set(
        (Math.random() - 0.5) * (GROUND_WIDTH - 2),
        1.5,
        GROUND_LENGTH / 2
    );
    
    gameScene.add(powerUp);
    gameState.powerUps.push(powerUp);
}

// Check Collision
function checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
}

// Handle Collision
function handleCollision(obstacle) {
    if (!gameState.hasShield) {
        gameState.health -= 10;
        playHitSound();
        if (gameState.health <= 0) {
            gameOver();
        }
    }
    playCollisionSound();
    gameScene.remove(obstacle);
    gameState.obstacles = gameState.obstacles.filter(o => o !== obstacle);
}

// Collect Collectible
function collectCollectible(collectible) {
    gameState.coins += 10;
    playCollectSound();
    gameScene.remove(collectible);
    gameState.collectibles = gameState.collectibles.filter(c => c !== collectible);
}

// Collect Power-up
function collectPowerUp(powerUp) {
    activateShield();
    playPowerUpSound();
    gameScene.remove(powerUp);
    gameState.powerUps = gameState.powerUps.filter(p => p !== powerUp);
}

// Activate Shield
function activateShield() {
    gameState.hasShield = true;
    gameState.shieldDuration = 5;
    if (gameState.character) {
        gameState.character.material.emissive.setHex(0x00ff00);
    }
}

// Deactivate Shield
function deactivateShield() {
    gameState.hasShield = false;
    if (gameState.character) {
        gameState.character.material.emissive.setHex(0x000000);
    }
}

// Toggle Pause
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    if (gameState.isPaused) {
        pauseButton.textContent = 'Resume Game';
    } else {
        pauseButton.textContent = 'Pause Game';
    }
}

// Game Over
function gameOver() {
    gameState.isGameOver = true;
    playGameOverSound();
    
    // Update game over screen
    const coinsCollected = document.getElementById('coinsCollected');
    const totalScore = document.getElementById('totalScore');
    const distanceTraveled = document.getElementById('distanceTraveled');
    const highScore = document.getElementById('highScore');
    
    coinsCollected.innerHTML = `<span style="color: #ffd700;">🪙 Coins Collected:</span> ${gameState.coins}`;
    totalScore.innerHTML = `<span style="color: #4caf50;">⭐ Score:</span> ${gameState.score}`;
    distanceTraveled.innerHTML = `<span style="color: #2196f3;">📏 Distance Traveled:</span> ${Math.floor(gameState.distance)}m`;
    
    const currentHighScore = localStorage.getItem('highScore') || 0;
    if (gameState.score > currentHighScore) {
        localStorage.setItem('highScore', gameState.score);
    }
    highScore.innerHTML = `<span style="color: #ff9800;">🏆 High Score:</span> ${localStorage.getItem('highScore')}`;
    
    // Show game over screen
    gameOverContainer.style.display = 'flex';
    gameOverContainer.style.opacity = '1';
}

// Update Stats
function updateStats() {
    statsContainer.innerHTML = `
        <div style="color: #ffd700;">🪙 ${gameState.coins}</div>
        <div style="color: #4caf50;">❤️ ${gameState.health}</div>
        <div style="color: #2196f3;">⭐ ${gameState.score}</div>
    `;
} 
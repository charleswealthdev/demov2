import { currentScene, gameStarted } from '../main.js';
import { musicButton, volumeButton } from './ui.js';

// Audio State
let isMusicPlaying = false;
let volumeLevel = 1.0;

// Audio Elements
const audio = {
    // Background Music
    mainMenuMusic: new Audio('public/adrenaline-roger-gabalda-main-version-02-23-11021.mp3'),
    gameSceneMusic: new Audio('public/action-loop-g-100-bpm-brvhrtz-226161.mp3'),
    bossModeMusic: new Audio('public/drone-high-tension-and-suspense-background-162365.mp3'),

    // Sound Effects
    jumpSound: new Audio('public/movement-swipe-whoosh-1-186575.mp3'),
    collectSound: new Audio('public/coin-pickup-98269.mp3'),
    hitSound: new Audio('public/young-man-being-hurt-95628.mp3'),
    powerUpSound: new Audio('public/mixkit-electronics-power-up-2602.wav'),
    gameOverSound: new Audio('public/male-death-sound-128357.mp3'),
    selectSound: new Audio('public/mixkit-electronics-power-up-2602.wav'),
    explosionSound: new Audio('public/explosion-91872.mp3'),
    honkSound: new Audio('public/car-horn-3-191449.mp3'),
    collisionSound: new Audio('public/mixkit-car-window-breaking-1551.wav'),
    passingCarSound: new Audio('public/car-passing-105251.mp3'),
    powerUpActiveSound: new Audio('public/mixkit-electronics-power-up-2602.wav'),
    powerUpEndSound: new Audio('public/mixkit-electronics-power-up-2602.wav'),
    shootSound: new Audio('public/pistol-shot-233473.mp3')
};

// Set initial volumes
function setInitialVolumes() {
    // Background Music
    audio.mainMenuMusic.volume = volumeLevel * 0.1;
    audio.gameSceneMusic.volume = volumeLevel * 0.13;
    audio.bossModeMusic.volume = volumeLevel * 0.15;

    // Sound Effects
    audio.jumpSound.volume = volumeLevel * 0.5;
    audio.collectSound.volume = volumeLevel * 0.5;
    audio.hitSound.volume = volumeLevel * 0.5;
    audio.powerUpSound.volume = volumeLevel * 0.7;
    audio.gameOverSound.volume = volumeLevel * 0.5;
    audio.selectSound.volume = volumeLevel * 0.5;
    audio.explosionSound.volume = volumeLevel * 0.8;
    audio.honkSound.volume = volumeLevel * 0.6;
    audio.collisionSound.volume = volumeLevel * 0.8;
    audio.passingCarSound.volume = volumeLevel * 0.5;
    audio.powerUpActiveSound.volume = volumeLevel * 0.5;
    audio.powerUpEndSound.volume = volumeLevel * 0.6;
    audio.shootSound.volume = volumeLevel * 0.4;
}

// Set loop for background music
audio.mainMenuMusic.loop = true;
audio.gameSceneMusic.loop = true;
audio.bossModeMusic.loop = true;

// Music Toggle
function toggleMusic() {
    isMusicPlaying = !isMusicPlaying;
    musicButton.textContent = `Music: ${isMusicPlaying ? 'On' : 'Off'}`;

    if (isMusicPlaying) {
        updateMusic();
    } else {
        pauseAllMusic();
    }
}

// Volume Control
function updateVolume() {
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

    setInitialVolumes();
}

// Update Music based on Scene
function updateMusic() {
    if (!isMusicPlaying) return;

    if (currentScene === 'mainMenu') {
        if (!audio.mainMenuMusic.paused) return;
        pauseAllMusic();
        audio.mainMenuMusic.play();
    } else if (currentScene === 'gameScene') {
        if (!audio.gameSceneMusic.paused) return;
        pauseAllMusic();
        audio.gameSceneMusic.play();
    }
}

// Pause All Music
function pauseAllMusic() {
    audio.mainMenuMusic.pause();
    audio.mainMenuMusic.currentTime = 0;
    audio.gameSceneMusic.pause();
    audio.gameSceneMusic.currentTime = 0;
    audio.bossModeMusic.pause();
    audio.bossModeMusic.currentTime = 0;
}

// Sound Effect Functions
export function playJumpSound() {
    if (gameStarted && isMusicPlaying) {
        audio.jumpSound.currentTime = 0;
        audio.jumpSound.play();
    }
}

export function playCollectSound() {
    if (gameStarted && isMusicPlaying) {
        audio.collectSound.currentTime = 0;
        audio.collectSound.play();
    }
}

export function playHitSound() {
    if (gameStarted && isMusicPlaying) {
        audio.hitSound.currentTime = 0;
        audio.hitSound.play();
    }
}

export function playPowerUpSound() {
    if (gameStarted && isMusicPlaying) {
        audio.powerUpSound.currentTime = 0;
        audio.powerUpSound.play();
    }
}

export function playGameOverSound() {
    if (gameStarted && isMusicPlaying) {
        audio.gameOverSound.currentTime = 0;
        audio.gameOverSound.play();
    }
}

export function playSelectSound() {
    if (isMusicPlaying) {
        audio.selectSound.currentTime = 0;
        audio.selectSound.play();
    }
}

export function playExplosionSound() {
    if (gameStarted && isMusicPlaying) {
        audio.explosionSound.currentTime = 0;
        audio.explosionSound.play();
    }
}

export function playHonkSound() {
    if (gameStarted && isMusicPlaying) {
        audio.honkSound.currentTime = 0;
        audio.honkSound.play();
    }
}

export function playCollisionSound() {
    if (gameStarted && isMusicPlaying) {
        audio.collisionSound.currentTime = 0;
        audio.collisionSound.play();
    }
}

export function playPassingCarSound() {
    if (gameStarted && isMusicPlaying) {
        audio.passingCarSound.currentTime = 0;
        audio.passingCarSound.play();
    }
}

export function playPowerUpActiveSound() {
    if (gameStarted && isMusicPlaying) {
        audio.powerUpActiveSound.currentTime = 0;
        audio.powerUpActiveSound.play();
    }
}

export function playPowerUpEndSound() {
    if (gameStarted && isMusicPlaying) {
        audio.powerUpEndSound.currentTime = 0;
        audio.powerUpEndSound.play();
    }
}

export function playShootSound() {
    if (gameStarted && isMusicPlaying) {
        audio.shootSound.currentTime = 0;
        audio.shootSound.play();
    }
}

// Initialize Audio
export function initAudio() {
    setInitialVolumes();

    // Add event listeners
    musicButton.addEventListener('click', toggleMusic);
    volumeButton.addEventListener('click', updateVolume);

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && gameStarted) {
            pauseAllMusic();
        } else if (isMusicPlaying) {
            updateMusic();
        }
    });
} 
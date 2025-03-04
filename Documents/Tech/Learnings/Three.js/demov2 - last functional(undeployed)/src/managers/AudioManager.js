export class AudioManager {
    constructor() {
        this.sounds = {
            mainMenuMusic: new Audio('drone-high-tension-and-suspense-background-162365.mp3'),
            gameSceneMusic: new Audio('adrenaline-roger-gabalda-main-version-02-23-11021.mp3'),
            bossModeMusic: new Audio('FastMix-2022-03-16_-_Escape_Route_-_www.FesliyanStudios.com_.mp3'),
            explode: new Audio("explosion-91872.mp3"),
            honk: new Audio("car-horn-beep-beep-two-beeps-honk-honk-6188.mp3"),
            honkLong: new Audio("car-horn-1-189855.mp3"),
            collision: new Audio("mixkit-car-window-breaking-1551.wav"),
            passingCar: new Audio("car-passing-105251.mp3"),
            powerUp: new Audio("coin-pickup-98269.mp3"),
            powerUpActive: new Audio("mixkit-electronics-power-up-2602.wav"),
            powerUpEnd: new Audio("power-up-end.mp3"),
            shoot: new Audio("pistol-shot-233473.mp3"),
            hit: new Audio("young-man-being-hurt-95628.mp3")
        };

        this.isMusicPlaying = false;
        this.currentScene = 'mainMenu';
        this.setupVolumes();
    }

    init() {
        this.sounds.mainMenuMusic.loop = true;
        this.sounds.gameSceneMusic.loop = true;
        this.sounds.bossModeMusic.loop = true;
    }

    setupVolumes() {
        const volumes = {
            honk: 0.6,
            collision: 0.8,
            passingCar: 0.5,
            powerUp: 0.7,
            powerUpActive: 0.5,
            powerUpEnd: 0.6,
            explode: 0.8,
            hit: 0.5,
            shoot: 0.4,
            mainMenuMusic: 0.1,
            gameSceneMusic: 0.13,
            bossModeMusic: 0.15
        };

        Object.entries(this.sounds).forEach(([key, sound]) => {
            if (volumes[key]) sound.volume = volumes[key];
        });
    }

    toggleMusic() {
        this.isMusicPlaying = !this.isMusicPlaying;
        if (this.isMusicPlaying) {
            this.playBackgroundMusic();
        } else {
            this.pauseAll();
        }
        return this.isMusicPlaying;
    }

    setScene(sceneName) {
        this.currentScene = sceneName;
        if (this.isMusicPlaying) {
            this.playBackgroundMusic();
        }
    }

    playBackgroundMusic() {
        // Stop all background music first
        this.sounds.mainMenuMusic.pause();
        this.sounds.gameSceneMusic.pause();
        this.sounds.bossModeMusic.pause();
        this.sounds.mainMenuMusic.currentTime = 0;
        this.sounds.gameSceneMusic.currentTime = 0;
        this.sounds.bossModeMusic.currentTime = 0;

        // Play appropriate music
        if (this.currentScene === 'mainMenu') {
            this.sounds.mainMenuMusic.play();
        } else if (this.currentScene === 'game') {
            this.sounds.gameSceneMusic.play();
        }
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
        }
    }

    pauseAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    resumeBackground() {
        if (this.isMusicPlaying) {
            this.playBackgroundMusic();
        }
    }

    startBossMusic() {
        if (!this.isMusicPlaying) return;
        this.sounds.gameSceneMusic.pause();
        this.sounds.gameSceneMusic.currentTime = 0;
        this.sounds.bossModeMusic.play();
    }

    stopBossMusic() {
        this.sounds.bossModeMusic.pause();
        this.sounds.bossModeMusic.currentTime = 0;
        if (this.isMusicPlaying) {
            this.sounds.gameSceneMusic.play();
        }
    }
} 
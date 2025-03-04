import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SceneManager } from '../managers/SceneManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { UIManager } from '../managers/UIManager.js';
import { InputManager } from '../managers/InputManager.js';
import { ResourceManager } from '../managers/ResourceManager.js';
import { Config } from '../utils/Config.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class Engine extends EventEmitter {
    constructor() {
        super();
        console.log('Engine: Constructor started');
        this.initializeProperties();
        this.initializeManagers();
        this.init().catch(this.handleInitError.bind(this));
    }

    initializeProperties() {
        this.renderer = null;
        this.camera = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        this.animationFrameId = null;
        this.state = {
            isInitialized: false,
            isPaused: false,
            isGameStarted: false,
            error: null
        };
    }

    initializeManagers() {
        this.resourceManager = new ResourceManager();
        this.sceneManager = new SceneManager(this.resourceManager);
        this.audioManager = new AudioManager();
        this.uiManager = new UIManager();
        this.inputManager = new InputManager();
    }

    async init() {
        console.log('Engine: Initializing');
        try {
            await this.setupRenderer();
            await this.setupCamera();
            await this.setupControls();
            await this.setupEventListeners();
            await this.initializeManagers();
            
            this.state.isInitialized = true;
            console.log('Engine: Initialization complete');
            this.emit('initialized');
            this.startAnimationLoop();
        } catch (error) {
            this.handleInitError(error);
        }
    }

    async setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = Config.renderer.exposure;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
    }

    async setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            Config.camera.fov,
            window.innerWidth / window.innerHeight,
            Config.camera.near,
            Config.camera.far
        );
        this.camera.position.set(...Config.camera.initialPosition);
    }

    async setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        Object.assign(this.controls, Config.controls);
    }

    setupEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Game state events
        this.on('gameStarted', this.handleGameStart.bind(this));
        this.on('gamePaused', this.handleGamePause.bind(this));
        this.on('gameResumed', this.handleGameResume.bind(this));
        this.on('gameOver', this.handleGameOver.bind(this));
    }

    async initializeManagers() {
        await this.resourceManager.init();
        await this.sceneManager.init(this.camera);
        await this.audioManager.init();
        await this.uiManager.init();
        await this.inputManager.init(this.camera, this.controls);
    }

    startAnimationLoop() {
        if (!this.state.isInitialized) {
            console.warn('Engine: Cannot start animation loop before initialization');
            return;
        }

        const animate = () => {
            this.animationFrameId = requestAnimationFrame(animate);
            this.update();
            this.render();
        };

        animate();
    }

    update() {
        if (!this.state.isInitialized) return;

        const delta = this.clock.getDelta();
        this.controls.update();

        if (this.state.isGameStarted && !this.state.isPaused) {
            this.sceneManager.update(delta);
            this.inputManager.update(delta);
            this.audioManager.update(delta);
        }
    }

    render() {
        if (!this.state.isInitialized) return;

        const currentScene = this.sceneManager.getCurrentScene();
        if (currentScene) {
            this.renderer.render(currentScene, this.camera);
        }
    }

    handleResize() {
        if (!this.state.isInitialized) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else if (this.state.isGameStarted) {
            this.resume();
        }
    }

    handleGameStart() {
        this.state.isGameStarted = true;
        this.state.isPaused = false;
        this.clock.start();
        this.controls.autoRotate = false;
        this.sceneManager.switchScene('game');
    }

    handleGamePause() {
        if (!this.state.isGameStarted) return;
        this.state.isPaused = true;
        this.clock.stop();
        this.emit('gamePaused');
    }

    handleGameResume() {
        if (!this.state.isGameStarted) return;
        this.state.isPaused = false;
        this.clock.start();
        this.emit('gameResumed');
    }

    handleGameOver() {
        this.state.isGameStarted = false;
        this.emit('gameOver');
    }

    handleInitError(error) {
        console.error('Engine: Initialization failed:', error);
        this.state.error = error;
        this.state.isInitialized = false;
        this.emit('error', error);
    }

    cleanup() {
        console.log('Engine: Starting cleanup');
        
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Remove event listeners
        window.removeEventListener('resize', this.handleResize.bind(this));
        document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Cleanup managers
        this.sceneManager.cleanup();
        this.audioManager.cleanup();
        this.uiManager.cleanup();
        this.inputManager.cleanup();
        this.resourceManager.cleanup();

        // Cleanup renderer
        if (this.renderer) {
            this.renderer.dispose();
            document.body.removeChild(this.renderer.domElement);
        }

        // Reset state
        this.state.isInitialized = false;
        this.state.isGameStarted = false;
        this.state.isPaused = false;
        
        console.log('Engine: Cleanup complete');
    }
} 
import * as THREE from 'three';
import { MainMenuScene } from '../scenes/MainMenuScene.js';
import { GameScene } from '../scenes/GameScene.js';
import { EventEmitter } from '../utils/EventEmitter.js';
import { Config } from '../utils/Config.js';

export class SceneManager extends EventEmitter {
    constructor(resourceManager) {
        super();
        console.log('SceneManager: Initializing');
        
        if (!resourceManager) {
            throw new Error('SceneManager: ResourceManager is required');
        }
        this.resourceManager = resourceManager;
        
        this.scenes = new Map();
        this.currentScene = null;
        this.camera = null;
        this.state = {
            isInitialized: false,
            isTransitioning: false
        };
    }

    async init(camera) {
        console.log('SceneManager: Initializing with camera');
        if (!camera) {
            throw new Error('SceneManager: Camera is required for initialization');
        }
        this.camera = camera;

        try {
            // Create scenes
            this.scenes.set('mainMenu', new MainMenuScene(this.resourceManager));
            this.scenes.set('game', new GameScene(this.resourceManager));

            // Initialize scenes sequentially
            for (const [name, scene] of this.scenes) {
                console.log(`SceneManager: Initializing ${name} scene`);
                await scene.init(camera);
                console.log(`SceneManager: ${name} scene initialized`);
            }

            // Set initial scene
            await this.switchScene('mainMenu');
            
            this.state.isInitialized = true;
            this.emit('initialized');
            console.log('SceneManager: Initialization complete');
        } catch (error) {
            console.error('SceneManager: Initialization failed:', error);
            throw error;
        }
    }

    async switchScene(sceneName, transitionDuration = 1000) {
        if (this.state.isTransitioning) {
            console.warn('SceneManager: Scene transition already in progress');
            return false;
        }

        const targetScene = this.scenes.get(sceneName);
        if (!targetScene) {
            console.error(`SceneManager: Scene ${sceneName} not found`);
            return false;
        }

        try {
            this.state.isTransitioning = true;
            this.emit('transitionStart', { from: this.currentScene?.name, to: sceneName });

            // Fade out current scene
            if (this.currentScene) {
                await this.fadeScene(this.currentScene, 1, 0, transitionDuration / 2);
                this.currentScene.onDeactivate();
            }

            // Switch scenes
            this.currentScene = targetScene;
            this.currentScene.onActivate();

            // Fade in new scene
            await this.fadeScene(this.currentScene, 0, 1, transitionDuration / 2);

            this.state.isTransitioning = false;
            this.emit('transitionComplete', { sceneName });
            return true;
        } catch (error) {
            console.error(`SceneManager: Error switching to ${sceneName}:`, error);
            this.state.isTransitioning = false;
            return false;
        }
    }

    fadeScene(scene, startOpacity, endOpacity, duration) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const opacity = startOpacity + (endOpacity - startOpacity) * progress;
                scene.traverse((object) => {
                    if (object.material) {
                        object.material.opacity = opacity;
                        object.material.transparent = opacity < 1;
                    }
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    getCurrentScene() {
        if (!this.state.isInitialized) {
            console.warn('SceneManager: Attempting to get scene before initialization');
            return null;
        }
        return this.currentScene;
    }

    update(delta) {
        if (!this.state.isInitialized || !this.currentScene) return;

        try {
            this.currentScene.update(delta);
        } catch (error) {
            console.error('SceneManager: Error updating scene:', error);
        }
    }

    reset() {
        console.log('SceneManager: Resetting all scenes');
        this.scenes.forEach((scene, name) => {
            try {
                console.log(`SceneManager: Resetting ${name} scene`);
                scene.reset();
            } catch (error) {
                console.error(`SceneManager: Error resetting ${name} scene:`, error);
            }
        });
    }

    cleanup() {
        console.log('SceneManager: Starting cleanup');
        
        // Cleanup all scenes
        this.scenes.forEach((scene, name) => {
            try {
                console.log(`SceneManager: Cleaning up ${name} scene`);
                scene.cleanup();
            } catch (error) {
                console.error(`SceneManager: Error cleaning up ${name} scene:`, error);
            }
        });

        // Clear references
        this.scenes.clear();
        this.currentScene = null;
        this.camera = null;
        this.state.isInitialized = false;
        
        console.log('SceneManager: Cleanup complete');
    }
} 
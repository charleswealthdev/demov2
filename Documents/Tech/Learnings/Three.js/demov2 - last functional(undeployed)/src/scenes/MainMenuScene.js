import { BaseScene } from './BaseScene.js';
import { Config } from '../utils/Config.js';
import * as THREE from 'three';

export class MainMenuScene extends BaseScene {
    constructor(resourceManager) {
        super(resourceManager);
        console.log('MainMenuScene: Constructor called');
        
        this.menuModel = null;
        this.menuBackground = null;
        this.rotationSpeed = 0.5;
    }

    async init(camera) {
        console.log('MainMenuScene: Initializing');
        await super.init(camera);

        try {
            await this.loadModels();
            console.log('MainMenuScene: Initialization complete');
        } catch (error) {
            console.error('MainMenuScene: Error during initialization:', error);
            throw error;
        }
    }

    async loadModels() {
        console.log('MainMenuScene: Loading models');

        try {
            // Load menu character
            const menuCharacter = await this.resourceManager.get('menuCharacter');
            if (menuCharacter) {
                this.menuModel = menuCharacter.scene.clone();
                this.menuModel.scale.set(0.9, 0.9, 0.9);
                this.menuModel.position.set(0, 0.7, 3);
                this.add(this.menuModel);
                this.enableEnvMap(this.menuModel);
            }

            // Load background
            const menuBackground = await this.resourceManager.get('menuBackground');
            if (menuBackground) {
                this.menuBackground = menuBackground.scene.clone();
                this.menuBackground.scale.set(1, 1, 1);
                this.menuBackground.position.set(0, 0, 0);
                this.add(this.menuBackground);
                this.enableEnvMap(this.menuBackground);
            }

            console.log('MainMenuScene: Models loaded successfully');
        } catch (error) {
            console.error('MainMenuScene: Error loading models:', error);
            throw error;
        }
    }

    onActivate() {
        super.onActivate();
        console.log('MainMenuScene: Activating');

        if (this.camera) {
            this.camera.position.set(0, 2, 5);
            console.log('MainMenuScene: Camera position set');
        } else {
            console.warn('MainMenuScene: No camera available during activation');
        }

        // Start menu music
        const menuMusic = this.resourceManager.get('mainMenu');
        if (menuMusic) {
            menuMusic.play();
        }
    }

    onDeactivate() {
        super.onDeactivate();
        console.log('MainMenuScene: Deactivating');

        // Stop menu music
        const menuMusic = this.resourceManager.get('mainMenu');
        if (menuMusic) {
            menuMusic.stop();
        }
    }

    update(delta) {
        if (!this.state.isActive || this.state.isLoading) {
            return;
        }

        // Rotate menu character
        if (this.menuModel) {
            this.menuModel.rotation.y += delta * this.rotationSpeed;
        }
    }

    reset() {
        super.reset();
        console.log('MainMenuScene: Resetting');

        if (this.menuModel) {
            this.menuModel.rotation.y = 0;
        }
    }

    cleanup() {
        console.log('MainMenuScene: Starting cleanup');

        // Stop any sounds
        const menuMusic = this.resourceManager.get('mainMenu');
        if (menuMusic) {
            menuMusic.stop();
        }

        // Cleanup models
        if (this.menuModel) {
            this.menuModel.traverse((child) => {
                if (child.material) {
                    child.material.dispose();
                }
                if (child.geometry) {
                    child.geometry.dispose();
                }
            });
            this.remove(this.menuModel);
            this.menuModel = null;
        }

        if (this.menuBackground) {
            this.menuBackground.traverse((child) => {
                if (child.material) {
                    child.material.dispose();
                }
                if (child.geometry) {
                    child.geometry.dispose();
                }
            });
            this.remove(this.menuBackground);
            this.menuBackground = null;
        }

        super.cleanup();
        console.log('MainMenuScene: Cleanup complete');
    }
} 
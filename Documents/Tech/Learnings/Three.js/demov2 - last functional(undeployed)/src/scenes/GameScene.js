import { BaseScene } from './BaseScene.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as THREE from 'three';
import gsap from 'gsap';

export class GameScene extends BaseScene {
    constructor() {
        super();
        this.character = null;
        this.mixer = null;
        this.actions = {};
        this.obstacles = [];
        this.powerUps = [];
        this.tileGroups = [];
        this.boss = null;
        this.bossProjectiles = [];
        
        // Game state
        this.score = 0;
        this.collectibleCount = 0;
        this.distanceTraveled = 0;
        this.isJumping = false;
        this.isShieldActive = false;
        this.shieldVisual = null;
        this.bossActive = false;
        this.characterHealth = 100;
        this.bossHealth = 200;
        
        // Game settings
        this.speed = 0.5;
        this.maxSpeed = 1.3;
        this.speedIncrement = 0.1;
        this.jumpHeight = 2;
        this.jumpDuration = 1;
        this.groundWidth = 60;
        this.groundLength = 50;
        this.groundCount = 3;
        
        this.setupLoaders();
    }

    setupLoaders() {
        this.gltfLoader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        this.gltfLoader.setDRACOLoader(this.dracoLoader);
        
        this.textureLoader = new THREE.TextureLoader();
    }

    init(camera) {
        super.init(camera);
        this.loadCharacter();
        this.createGround();
        this.setupEnvironment();
    }

    loadCharacter() {
        this.gltfLoader.load('myavatar.glb', (gltf) => {
            this.character = gltf.scene;
            this.character.scale.set(1.3, 1.3, 1.3);
            this.character.position.set(0, 0, 0);
            this.character.rotation.y = Math.PI;
            this.add(this.character);
            this.enableEnvMap(this.character);

            // Setup character animations
            this.mixer = new THREE.AnimationMixer(this.character);
            gltf.animations.forEach((clip) => {
                this.actions[clip.name.toLowerCase()] = this.mixer.clipAction(clip);
            });
            if (this.actions['armature|mixamo.com|layer0']) {
                this.actions['armature|mixamo.com|layer0'].play();
            }
        });
    }

    createGround() {
        const textureTest = this.textureLoader.load('/highway-lanes-unity/highway-lanes-unity/highway-lanes_albedo.png');
        const textureNormal = this.textureLoader.load('/highway-lanes-unity/highway-lanes-unity/highway-lanes_normal-ogl.png');
        const textureM = this.textureLoader.load('/highway-lanes-unity/highway-lanes-unity/highway-lanes_ao.png');
        const textureR = this.textureLoader.load('/highway-lanes-unity/highway-lanes-unity/highway-lanes_preview.jpg');

        const groundMaterial = new THREE.MeshStandardMaterial({
            map: textureTest,
            normalMap: textureNormal,
            roughnessMap: textureR,
            side: THREE.DoubleSide,
            aoMap: textureM,
            metalness: 0.7,
        });

        for (let i = 0; i < this.groundCount; i++) {
            const tile = this.createTile(groundMaterial, -i * this.groundLength);
            this.tileGroups.push(tile);
            this.add(tile);
        }
    }

    createTile(material, zOffset) {
        const tileGroup = new THREE.Group();
        
        // Create ground plane
        const groundGeo = new THREE.PlaneGeometry(this.groundWidth, this.groundLength);
        const ground = new THREE.Mesh(groundGeo, material);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        tileGroup.add(ground);

        // Add decorative elements (trees, buildings) here
        // This will be implemented when we create the environment assets

        tileGroup.position.z = zOffset;
        return tileGroup;
    }

    setupEnvironment() {
        // This will be implemented when we create the environment assets
    }

    jump() {
        if (this.isJumping || !this.character) return;
        this.isJumping = true;

        gsap.to(this.character.position, {
            y: this.jumpHeight,
            duration: this.jumpDuration / 2,
            ease: 'power2.out',
            onComplete: () => {
                gsap.to(this.character.position, {
                    y: 0,
                    duration: this.jumpDuration / 2,
                    ease: 'power2.in',
                    onComplete: () => {
                        this.isJumping = false;
                    },
                });
            },
        });
    }

    updateGround() {
        this.tileGroups.forEach((tile) => {
            tile.position.z += this.speed;
            if (tile.position.z > this.groundLength) {
                tile.position.z -= this.groundCount * this.groundLength;
            }
        });
    }

    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }

        this.updateGround();
        this.updateScore(delta);
        
        if (this.bossActive) {
            this.updateBoss(delta);
        } else {
            this.updateObstacles();
            this.updatePowerUps();
        }
    }

    updateScore(delta) {
        this.distanceTraveled += this.speed * delta * 60;
        this.score += 1; // Points per frame
        
        // Increase speed over time
        if (this.speed < this.maxSpeed) {
            this.speed += this.speedIncrement * delta;
        }
    }

    updateObstacles() {
        // This will be implemented when we create the Obstacle class
    }

    updatePowerUps() {
        // This will be implemented when we create the PowerUp class
    }

    updateBoss(delta) {
        // This will be implemented when we create the Boss class
    }

    reset() {
        this.score = 0;
        this.collectibleCount = 0;
        this.distanceTraveled = 0;
        this.speed = 0.5;
        this.isJumping = false;
        this.isShieldActive = false;
        this.bossActive = false;
        this.characterHealth = 100;
        this.bossHealth = 200;

        if (this.character) {
            this.character.position.set(0, 0, 0);
        }

        // Clear all game objects
        this.obstacles.forEach(obstacle => this.remove(obstacle));
        this.obstacles = [];
        this.powerUps.forEach(powerUp => this.remove(powerUp));
        this.powerUps = [];
        if (this.boss) {
            this.remove(this.boss);
            this.boss = null;
        }
    }

    onActivate() {
        if (this.camera) {
            this.camera.position.set(0, 4, 6);
        }
    }
} 
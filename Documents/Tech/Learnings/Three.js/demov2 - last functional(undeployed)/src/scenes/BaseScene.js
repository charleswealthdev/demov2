import * as THREE from 'three';
import { Config } from '../utils/Config.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class BaseScene extends THREE.Scene {
    constructor(resourceManager) {
        super();
        console.log('BaseScene: Constructor called');
        
        if (!resourceManager) {
            throw new Error('BaseScene: ResourceManager is required');
        }
        this.resourceManager = resourceManager;
        
        this.camera = null;
        this.state = {
            isInitialized: false,
            isActive: false,
            isLoading: true
        };
        
        this.setupEnvironment();
    }

    setupEnvironment() {
        // Setup fog
        this.fog = new THREE.Fog(
            Config.environment.fog.color,
            Config.environment.fog.near,
            Config.environment.fog.far
        );

        // Setup lighting
        this.setupLighting();
        
        // Setup sky
        this.setupSkyDome();
    }

    setupLighting() {
        console.log('BaseScene: Setting up lighting');
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.add(ambientLight);

        // Directional light with shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        
        // Configure shadow properties
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        
        this.add(directionalLight);
    }

    setupSkyDome() {
        console.log('BaseScene: Setting up sky dome');
        
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(Config.environment.sky.topColor) },
                horizonColor: { value: new THREE.Color(Config.environment.sky.horizonColor) },
                bottomColor: { value: new THREE.Color(Config.environment.sky.bottomColor) },
                offsetTop: { value: Config.environment.sky.offsetTop },
                offsetBottom: { value: Config.environment.sky.offsetBottom }
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
                    vec3 color = mix(bottomColor, horizonColor, mixBottom);
                    color = mix(color, topColor, mixTop);
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide,
            depthWrite: false
        });

        const skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
        this.add(skyDome);
        console.log('BaseScene: Sky dome created');
    }

    async init(camera) {
        console.log('BaseScene: Initializing');
        
        if (!camera) {
            throw new Error('BaseScene: Camera is required for initialization');
        }
        this.camera = camera;

        try {
            // Load environment map
            const envMap = await this.resourceManager.get('environmentMap');
            if (envMap) {
                this.environment = envMap;
                this.environment.mapping = THREE.EquirectangularReflectionMapping;
            }

            this.state.isInitialized = true;
            this.state.isLoading = false;
            console.log('BaseScene: Initialization complete');
        } catch (error) {
            console.error('BaseScene: Initialization failed:', error);
            throw error;
        }
    }

    onActivate() {
        console.log('BaseScene: Activating');
        this.state.isActive = true;
    }

    onDeactivate() {
        console.log('BaseScene: Deactivating');
        this.state.isActive = false;
    }

    update(delta) {
        // Override in child classes
    }

    reset() {
        console.log('BaseScene: Resetting');
        this.state.isActive = false;
    }

    enableEnvMap(model) {
        if (!model) {
            console.warn('BaseScene: Attempted to enable envMap on null model');
            return;
        }
        
        model.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.envMap = this.environment;
                child.material.envMapIntensity = 1.0;
                child.material.needsUpdate = true;
            }
        });
    }

    cleanup() {
        console.log('BaseScene: Starting cleanup');
        
        // Remove all objects
        while(this.children.length > 0) {
            const child = this.children[0];
            if (child.material) {
                child.material.dispose();
            }
            if (child.geometry) {
                child.geometry.dispose();
            }
            this.remove(child);
        }

        // Clear references
        this.camera = null;
        this.environment = null;
        
        // Reset state
        this.state.isInitialized = false;
        this.state.isActive = false;
        this.state.isLoading = true;
        
        console.log('BaseScene: Cleanup complete');
    }
} 
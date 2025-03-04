import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Config } from '../utils/Config.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class ResourceManager extends EventEmitter {
    constructor() {
        super();
        this.resources = new Map();
        this.loaders = {};
        this.loadingQueue = new Map();
        this.setupLoaders();
    }

    setupLoaders() {
        // GLTF Loader with Draco compression
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        // Setup all loaders
        this.loaders = {
            gltf: gltfLoader,
            texture: new THREE.TextureLoader(),
            hdri: new RGBELoader(),
            audio: new THREE.AudioLoader()
        };
    }

    async init() {
        console.log('ResourceManager: Initializing');
        try {
            await this.loadAllResources();
            console.log('ResourceManager: All resources loaded');
        } catch (error) {
            console.error('ResourceManager: Failed to load resources:', error);
            throw error;
        }
    }

    async loadAllResources() {
        const resources = [
            // Models
            ...Object.entries(Config.models).map(([key, path]) => ({
                type: 'gltf',
                name: key,
                path: path
            })),
            
            // Environment
            {
                type: 'hdri',
                name: 'environmentMap',
                path: Config.environment.hdri
            },
            
            // Audio
            ...Object.entries(Config.audio.files).map(([key, path]) => ({
                type: 'audio',
                name: key,
                path: path
            }))
        ];

        const loadPromises = resources.map(resource => this.load(resource));
        await Promise.all(loadPromises);
    }

    async load({ type, name, path }) {
        if (this.resources.has(name)) {
            return this.resources.get(name);
        }

        if (this.loadingQueue.has(name)) {
            return this.loadingQueue.get(name);
        }

        const loader = this.loaders[type];
        if (!loader) {
            throw new Error(`ResourceManager: No loader found for type ${type}`);
        }

        const loadPromise = new Promise((resolve, reject) => {
            loader.load(
                path,
                (resource) => {
                    this.resources.set(name, resource);
                    this.loadingQueue.delete(name);
                    this.emit('resourceLoaded', { name, resource });
                    resolve(resource);
                },
                (progress) => {
                    const percentage = (progress.loaded / progress.total * 100).toFixed(2);
                    this.emit('progress', { name, percentage });
                },
                (error) => {
                    this.loadingQueue.delete(name);
                    console.error(`ResourceManager: Failed to load ${name}:`, error);
                    reject(error);
                }
            );
        });

        this.loadingQueue.set(name, loadPromise);
        return loadPromise;
    }

    get(name) {
        if (!this.resources.has(name)) {
            console.warn(`ResourceManager: Resource ${name} not found`);
            return null;
        }
        return this.resources.get(name);
    }

    async preload(resources) {
        const loadPromises = resources.map(resource => this.load(resource));
        return Promise.all(loadPromises);
    }

    dispose(name) {
        if (!this.resources.has(name)) return;

        const resource = this.resources.get(name);
        if (resource.dispose) {
            resource.dispose();
        }
        this.resources.delete(name);
    }

    cleanup() {
        console.log('ResourceManager: Starting cleanup');
        
        // Dispose all resources
        this.resources.forEach((resource, name) => {
            this.dispose(name);
        });
        
        // Clear maps
        this.resources.clear();
        this.loadingQueue.clear();
        
        // Dispose loaders
        if (this.loaders.gltf) {
            this.loaders.gltf.dracoLoader?.dispose();
        }
        
        console.log('ResourceManager: Cleanup complete');
    }
} 
export const Config = {
    renderer: {
        exposure: 1.0,
        shadowMapType: 'PCFSoft',
        antialias: true,
        pixelRatio: window.devicePixelRatio
    },
    
    camera: {
        fov: 75,
        near: 0.1,
        far: 1000,
        initialPosition: [0, 2, 5]
    },
    
    controls: {
        enableZoom: false,
        enablePan: false,
        maxPolarAngle: Math.PI / 2,
        minPolarAngle: Math.PI / 4,
        enableDamping: true,
        dampingFactor: 0.25,
        autoRotate: true,
        autoRotateSpeed: 1
    },
    
    game: {
        initialSpeed: 0.5,
        maxSpeed: 1.3,
        speedIncrement: 0.1,
        jumpHeight: 2,
        jumpDuration: 1,
        groundWidth: 60,
        groundLength: 50,
        groundCount: 3,
        characterScale: 1.3,
        characterStartPosition: [0, 0, 0],
        characterRotation: Math.PI,
        shieldDuration: 10000,
        powerUpInterval: 10000,
        scoreMultiplier: 1,
        difficultyIncreaseMilestone: 1000
    },
    
    audio: {
        musicVolume: 0.1,
        sfxVolume: 0.7,
        files: {
            mainMenu: 'drone-high-tension-and-suspense-background-162365.mp3',
            gameScene: 'adrenaline-roger-gabalda-main-version-02-23-11021.mp3',
            bossMode: 'FastMix-2022-03-16_-_Escape_Route_-_www.FesliyanStudios.com_.mp3',
            collision: 'mixkit-car-window-breaking-1551.wav',
            powerUp: 'coin-pickup-98269.mp3',
            powerUpActive: 'mixkit-electronics-power-up-2602.wav',
            powerUpEnd: 'power-up-end.mp3',
            shoot: 'pistol-shot-233473.mp3',
            hit: 'young-man-being-hurt-95628.mp3'
        }
    },
    
    models: {
        character: 'myavatar.glb',
        menuCharacter: 'avatarland.glb',
        menuBackground: 'runestone.glb',
        tree: 'tree.glb',
        building: 'building.glb',
        boss: 'boss.glb'
    },
    
    environment: {
        hdri: 'beach_parking_1k.hdr',
        fog: {
            color: 0x87ceeb,
            near: 50,
            far: 200
        },
        sky: {
            topColor: 0xffa07a,
            horizonColor: 0xffe4b5,
            bottomColor: 0x87ceeb,
            offsetTop: 0.6,
            offsetBottom: 0.2
        }
    },
    
    ui: {
        fonts: {
            main: 'Arial, sans-serif'
        },
        colors: {
            primary: '#ffffff',
            secondary: '#87ceeb',
            accent: '#ffa07a',
            danger: '#ff4444'
        },
        sizes: {
            button: {
                padding: '15px 30px',
                fontSize: '18px'
            },
            text: {
                small: '14px',
                medium: '16px',
                large: '24px'
            }
        }
    },
    
    debug: {
        enabled: true,
        showFPS: true,
        logLevel: 'warn'
    }
}; 
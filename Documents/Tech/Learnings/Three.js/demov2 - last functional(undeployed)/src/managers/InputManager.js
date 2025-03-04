export class InputManager {
    constructor() {
        this.keys = {
            left: false,
            right: false
        };
        this.joystick = {
            active: false,
            position: { x: 0, y: 0 }
        };
        this.character = null;
        this.moveSpeed = 0.34;
        this.boundaryLeft = -5;
        this.boundaryRight = 5;
    }

    init() {
        this.setupKeyboardControls();
        this.setupTouchControls();
    }

    setCharacter(character) {
        this.character = character;
    }

    setupKeyboardControls() {
        window.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
                case ' ':
                    this.onJump();
                    break;
                case 'p':
                case 'P':
                    this.onPositionChange();
                    break;
                case 's':
                case 'S':
                    this.onShieldActivate();
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            switch(event.key) {
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
            }
        });
    }

    setupTouchControls() {
        const joystick = document.createElement("div");
        Object.assign(joystick.style, {
            position: "absolute",
            bottom: "5%",
            left: "3%",
            width: "250px",
            height: "60px",
            borderRadius: "30px",
            background: "rgba(0, 0, 0, 0.5)",
            touchAction: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        });
        document.body.appendChild(joystick);

        const handle = document.createElement("div");
        Object.assign(handle.style, {
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.8)",
            touchAction: "none",
            position: "absolute",
            transform: "translate(0, 0)",
        });
        joystick.appendChild(handle);

        let isDragging = false;
        let initialTouch = null;
        const deadZone = 7;
        let joystickRadius = 30;

        const adjustJoystickRadius = () => {
            joystickRadius = Math.min(window.innerWidth, window.innerHeight) * 0.15;
        };
        window.addEventListener("resize", adjustJoystickRadius);
        adjustJoystickRadius();

        joystick.addEventListener("touchstart", (e) => {
            isDragging = true;
            initialTouch = e.touches[0];
            this.joystick.active = true;
        });

        joystick.addEventListener("touchmove", (e) => {
            if (isDragging && initialTouch) {
                const rect = joystick.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                let deltaX = e.touches[0].clientX - centerX;
                
                if (Math.abs(deltaX) > joystickRadius) {
                    deltaX = Math.sign(deltaX) * joystickRadius;
                }

                if (Math.abs(deltaX) > deadZone) {
                    this.joystick.position.x = deltaX / joystickRadius;
                    const handleOffsetX = Math.min(
                        Math.max(deltaX, -joystickRadius + handle.offsetWidth / 2),
                        joystickRadius - handle.offsetWidth / 2
                    );
                    handle.style.transform = `translate(${handleOffsetX}px, 0)`;
                }
            }
        });

        joystick.addEventListener("touchend", () => {
            isDragging = false;
            initialTouch = null;
            this.joystick.active = false;
            this.joystick.position.x = 0;
            handle.style.transform = "translate(0, 0)";
        });
    }

    update() {
        if (!this.character) return;

        // Keyboard movement
        if (this.keys.left && this.character.position.x > this.boundaryLeft) {
            this.character.position.x -= this.moveSpeed;
        }
        if (this.keys.right && this.character.position.x < this.boundaryRight) {
            this.character.position.x += this.moveSpeed;
        }

        // Joystick movement
        if (this.joystick.active) {
            const newX = this.character.position.x + this.joystick.position.x * this.moveSpeed;
            this.character.position.x = Math.max(
                this.boundaryLeft,
                Math.min(this.boundaryRight, newX)
            );
        }
    }

    onJump() {
        // To be implemented by game logic
    }

    onPositionChange() {
        // To be implemented by game logic
    }

    onShieldActivate() {
        // To be implemented by game logic
    }
} 
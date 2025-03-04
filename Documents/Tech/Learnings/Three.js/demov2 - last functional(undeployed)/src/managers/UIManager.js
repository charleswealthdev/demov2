export class UIManager {
    constructor() {
        this.elements = {
            stats: null,
            pauseMenu: null,
            gameOver: null,
            mainMenu: null,
            hud: null
        };
        this.score = 0;
        this.coins = 0;
        this.distance = 0;
        this.highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
    }

    init() {
        this.createMainMenu();
        this.createHUD();
        this.createPauseMenu();
        this.createGameOverScreen();
        this.hideAllMenus();
        this.showMainMenu();
    }

    createMainMenu() {
        const menu = document.createElement('div');
        menu.id = 'mainMenu';
        menu.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            display: none;
        `;

        const startButton = document.createElement('button');
        startButton.id = 'startButton';
        startButton.textContent = 'Start Game';
        startButton.style.cssText = `
            padding: 15px 30px;
            font-size: 18px;
            cursor: pointer;
            background-color: transparent;
            border: 2px solid white;
            color: white;
            border-radius: 8px;
            margin: 10px;
            transition: all 0.3s ease;
        `;

        const musicButton = document.createElement('button');
        musicButton.id = 'musicButton';
        musicButton.textContent = 'Music: Off';
        musicButton.style.cssText = `
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            background-color: transparent;
            border: 2px solid white;
            color: white;
            border-radius: 8px;
            margin: 10px;
        `;

        menu.appendChild(startButton);
        menu.appendChild(musicButton);
        document.body.appendChild(menu);
        this.elements.mainMenu = menu;
    }

    createHUD() {
        const hud = document.createElement('div');
        hud.id = 'hud';
        hud.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            font-family: Arial, sans-serif;
            display: none;
        `;

        const stats = {
            score: this.createStat('Score', '🎯'),
            coins: this.createStat('Coins', '🪙'),
            distance: this.createStat('Distance', '📏'),
            highScore: this.createStat('High Score', '🏆')
        };

        Object.values(stats).forEach(stat => hud.appendChild(stat));
        document.body.appendChild(hud);
        this.elements.hud = hud;
    }

    createStat(label, icon) {
        const container = document.createElement('div');
        container.style.cssText = `
            margin: 5px;
            padding: 5px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            display: flex;
            align-items: center;
        `;

        const iconSpan = document.createElement('span');
        iconSpan.textContent = icon;
        iconSpan.style.marginRight = '5px';

        const valueSpan = document.createElement('span');
        valueSpan.id = `${label.toLowerCase().replace(' ', '')}Value`;
        valueSpan.textContent = '0';

        container.appendChild(iconSpan);
        container.appendChild(valueSpan);
        return container;
    }

    createPauseMenu() {
        const menu = document.createElement('div');
        menu.id = 'pauseMenu';
        menu.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            color: white;
            display: none;
        `;

        const title = document.createElement('h2');
        title.textContent = 'PAUSED';
        
        const resumeButton = document.createElement('button');
        resumeButton.textContent = 'Resume';
        resumeButton.style.cssText = `
            padding: 10px 20px;
            margin: 10px;
            cursor: pointer;
            background: #4CAF50;
            border: none;
            color: white;
            border-radius: 5px;
        `;

        menu.appendChild(title);
        menu.appendChild(resumeButton);
        document.body.appendChild(menu);
        this.elements.pauseMenu = menu;
    }

    createGameOverScreen() {
        const screen = document.createElement('div');
        screen.id = 'gameOver';
        screen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: white;
        `;

        const title = document.createElement('h1');
        title.textContent = 'GAME OVER';
        title.style.color = '#ff4c4c';

        const stats = document.createElement('div');
        stats.style.margin = '20px';
        ['Score', 'Coins', 'Distance', 'High Score'].forEach(stat => {
            const p = document.createElement('p');
            p.id = `gameOver${stat.replace(' ', '')}`;
            stats.appendChild(p);
        });

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Play Again';
        restartButton.style.cssText = `
            padding: 15px 30px;
            font-size: 18px;
            cursor: pointer;
            background: #4CAF50;
            border: none;
            color: white;
            border-radius: 25px;
            margin-top: 20px;
        `;

        screen.appendChild(title);
        screen.appendChild(stats);
        screen.appendChild(restartButton);
        document.body.appendChild(screen);
        this.elements.gameOver = screen;
    }

    hideAllMenus() {
        Object.values(this.elements).forEach(element => {
            if (element) element.style.display = 'none';
        });
    }

    showMainMenu() {
        this.hideAllMenus();
        if (this.elements.mainMenu) {
            this.elements.mainMenu.style.display = 'block';
        }
    }

    showHUD() {
        if (this.elements.hud) {
            this.elements.hud.style.display = 'block';
        }
    }

    showPauseMenu() {
        if (this.elements.pauseMenu) {
            this.elements.pauseMenu.style.display = 'block';
        }
    }

    hidePauseMenu() {
        if (this.elements.pauseMenu) {
            this.elements.pauseMenu.style.display = 'none';
        }
    }

    showGameOver() {
        this.hideAllMenus();
        if (this.elements.gameOver) {
            this.elements.gameOver.style.display = 'flex';
            this.updateGameOverStats();
        }
    }

    updateScore(score) {
        this.score = score;
        const element = document.getElementById('scoreValue');
        if (element) element.textContent = score;
    }

    updateCoins(coins) {
        this.coins = coins;
        const element = document.getElementById('coinsValue');
        if (element) element.textContent = coins;
    }

    updateDistance(distance) {
        this.distance = distance;
        const element = document.getElementById('distanceValue');
        if (element) element.textContent = `${Math.floor(distance)}m`;
    }

    updateHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem('highScore', score);
            const element = document.getElementById('highScoreValue');
            if (element) element.textContent = score;
        }
    }

    updateGameOverStats() {
        document.getElementById('gameOverScore').textContent = `Score: ${this.score}`;
        document.getElementById('gameOverCoins').textContent = `Coins: ${this.coins}`;
        document.getElementById('gameOverDistance').textContent = `Distance: ${Math.floor(this.distance)}m`;
        document.getElementById('gameOverHighScore').textContent = `High Score: ${this.highScore}`;
    }
} 
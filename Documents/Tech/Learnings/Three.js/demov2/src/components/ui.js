import { currentScene, gameStarted, switchToGameScene, switchToMainMenu } from '../main.js';

// UI Elements
let startButton, helpButton, musicButton, pauseButton, volumeButton;
let mainMenuUI, characterSelectionContainer;
let mainMenuHighScoreContainer, mainMenuHighScoreText;
let modal, pauseModal, overlay;
let statsContainer, gameOverContainer;

// Create Button Helper
function createButton(text, id, onClick, styles = {}) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.className = 'menuButton';
    Object.assign(button.style, {
        padding: '15px 30px',
        fontSize: '18px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: '2px solid white',
        color: 'white',
        borderRadius: '8px',
        outline: 'none',
        transition: 'background-color 0.3s, color 0.3s',
        ...styles
    });
    button.onclick = onClick;
    return button;
}

// Create Main Menu UI
function createMainMenuUI() {
    mainMenuUI = document.createElement('div');
    Object.assign(mainMenuUI.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '30px',
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '15px',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
        zIndex: 1000
    });
    document.body.appendChild(mainMenuUI);

    // Character Selection UI
    characterSelectionContainer = document.createElement('div');
    Object.assign(characterSelectionContainer.style, {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
    });
    mainMenuUI.appendChild(characterSelectionContainer);
}

// Create High Score Display
function createHighScoreDisplay() {
    mainMenuHighScoreContainer = document.createElement('div');
    mainMenuHighScoreContainer.id = 'mainMenuHighScoreContainer';
    Object.assign(mainMenuHighScoreContainer.style, {
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        zIndex: '1000'
    });

    const highScoreIcon = document.createElement('img');
    highScoreIcon.src = 'public/xp_17596046.png';
    highScoreIcon.style.width = '25px';
    highScoreIcon.style.height = '25px';
    highScoreIcon.style.marginRight = '8px';
    mainMenuHighScoreContainer.appendChild(highScoreIcon);

    mainMenuHighScoreText = document.createElement('span');
    mainMenuHighScoreText.id = 'mainMenuHighScoreText';
    mainMenuHighScoreText.innerHTML = `${localStorage.getItem('highScore') || 0}`;
    mainMenuHighScoreText.style.color = '#87ceeb';
    mainMenuHighScoreText.style.fontSize = '18px';
    mainMenuHighScoreText.style.fontFamily = 'Arial, sans-serif';
    mainMenuHighScoreContainer.appendChild(mainMenuHighScoreText);

    document.body.appendChild(mainMenuHighScoreContainer);
}

// Create Help Modal
function createHelpModal() {
    modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(0)',
        padding: '20px',
        width: '80%',
        maxWidth: '400px',
        background: '#333',
        color: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        zIndex: 1001
    });
    document.body.appendChild(modal);

    const modalTitle = document.createElement('h2');
    modalTitle.id = 'modal-title';
    Object.assign(modalTitle.style, {
        marginBottom: '15px',
        fontSize: '24px'
    });
    modal.appendChild(modalTitle);

    const modalContent = document.createElement('div');
    modalContent.id = 'modal-content';
    Object.assign(modalContent.style, {
        fontSize: '16px',
        lineHeight: '1.6'
    });
    modal.appendChild(modalContent);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    Object.assign(closeButton.style, {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        background: '#555',
        border: 'none',
        color: 'white',
        borderRadius: '5px'
    });
    closeButton.onclick = () => {
        modal.style.transform = 'translate(-50%, -50%) scale(0)';
        overlay.style.display = 'none';
    };
    modal.appendChild(closeButton);
}

// Create Pause Modal
function createPauseModal() {
    pauseModal = document.createElement('div');
    Object.assign(pauseModal.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(0)',
        padding: '30px',
        width: '80%',
        maxWidth: '350px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        color: '#ffffff',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        zIndex: 1001,
        display: 'none'
    });
    document.body.appendChild(pauseModal);

    const pauseModalTitle = document.createElement('h2');
    pauseModalTitle.textContent = 'Paused';
    Object.assign(pauseModalTitle.style, {
        marginBottom: '15px',
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#ffffff',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
    });
    pauseModal.appendChild(pauseModalTitle);

    const pauseHighScore = document.createElement('div');
    pauseHighScore.id = 'pauseHighScore';
    pauseHighScore.innerHTML = `High Score: ${localStorage.getItem('highScore') || 0}`;
    Object.assign(pauseHighScore.style, {
        fontSize: '20px',
        color: '#ffd700',
        marginBottom: '20px',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
    });
    pauseModal.appendChild(pauseHighScore);

    const resumeButton = document.createElement('button');
    resumeButton.textContent = 'Resume Game';
    Object.assign(resumeButton.style, {
        marginTop: '20px',
        padding: '12px 25px',
        fontSize: '16px',
        cursor: 'pointer',
        background: 'rgba(76, 175, 80, 0.8)',
        border: 'none',
        color: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
        transition: 'background 0.3s, transform 0.2s'
    });
    resumeButton.addEventListener('mouseenter', () => {
        resumeButton.style.background = 'rgba(76, 175, 80, 1)';
        resumeButton.style.transform = 'scale(1.05)';
    });
    resumeButton.addEventListener('mouseleave', () => {
        resumeButton.style.background = 'rgba(76, 175, 80, 0.8)';
        resumeButton.style.transform = 'scale(1)';
    });
    pauseModal.appendChild(resumeButton);
}

// Create Overlay
function createOverlay() {
    overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'none'
    });
    document.body.appendChild(overlay);
}

// Create Stats Container
function createStatsContainer() {
    statsContainer = document.createElement('div');
    Object.assign(statsContainer.style, {
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        display: 'none'
    });
    document.body.appendChild(statsContainer);
}

// Create Game Over Container
function createGameOverContainer() {
    gameOverContainer = document.createElement('div');
    Object.assign(gameOverContainer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: '#fff',
        fontFamily: "'Poppins', sans-serif",
        zIndex: '1001',
        opacity: '0',
        transition: 'opacity 0.5s ease-in-out',
        display: 'none'
    });
    document.body.appendChild(gameOverContainer);

    // Add game over content
    const gameOverMessage = document.createElement('div');
    gameOverMessage.innerHTML = 'GAME OVER';
    Object.assign(gameOverMessage.style, {
        fontSize: '3rem',
        fontWeight: 'bold',
        letterSpacing: '5px',
        color: '#ff4c4c',
        textShadow: '0 0 15px rgba(255, 76, 76, 0.8)',
        marginBottom: '30px'
    });
    gameOverContainer.appendChild(gameOverMessage);

    // Add summary container
    const summaryContainer = document.createElement('div');
    Object.assign(summaryContainer.style, {
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
        width: '80%',
        maxWidth: '400px'
    });

    // Add stats elements
    const stats = [
        { id: 'coinsCollected', label: '🪙 Coins Collected:', color: '#ffd700' },
        { id: 'totalScore', label: '⭐ Score:', color: '#4caf50' },
        { id: 'distanceTraveled', label: '📏 Distance Traveled:', color: '#2196f3' },
        { id: 'highScore', label: '🏆 High Score:', color: '#ff9800' }
    ];

    stats.forEach(stat => {
        const element = document.createElement('div');
        element.id = stat.id;
        element.innerHTML = `<span style="color: ${stat.color};">${stat.label}</span> 0`;
        Object.assign(element.style, {
            marginBottom: '10px',
            fontSize: '1.5rem'
        });
        summaryContainer.appendChild(element);
    });

    gameOverContainer.appendChild(summaryContainer);

    // Add restart button
    const restartButton = document.createElement('button');
    restartButton.innerHTML = 'Restart Game';
    Object.assign(restartButton.style, {
        marginTop: '30px',
        padding: '15px 30px',
        fontSize: '1.2rem',
        color: '#fff',
        backgroundColor: '#4caf50',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
        transition: 'all 0.3s ease'
    });
    restartButton.addEventListener('mouseenter', () => {
        restartButton.style.backgroundColor = '#388e3c';
        restartButton.style.boxShadow = '0 6px 20px rgba(56, 142, 60, 0.6)';
    });
    restartButton.addEventListener('mouseleave', () => {
        restartButton.style.backgroundColor = '#4caf50';
        restartButton.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)';
    });
    gameOverContainer.appendChild(restartButton);
}

// Initialize UI
export function initUI() {
    createMainMenuUI();
    createHighScoreDisplay();
    createHelpModal();
    createPauseModal();
    createOverlay();
    createStatsContainer();
    createGameOverContainer();

    // Create buttons
    startButton = createButton('Start Game', 'startButton', () => {
        console.log('Start button clicked, switching to game scene');
        switchToGameScene();
    });

    helpButton = createButton('Help', 'helpButton', () => {
        console.log('Help button clicked');
        document.getElementById('modal-title').textContent = 'Help';
        document.getElementById('modal-content').textContent = 
            'Use arrow keys to move, space to jump, "P" to change position, and "S" to activate shield.';
        modal.style.transform = 'translate(-50%, -50%) scale(1)';
        overlay.style.display = 'block';
    });

    musicButton = createButton('Music: Off', 'musicButton', () => {
        // Music toggle logic will be handled by the audio component
    }, {
        position: 'absolute',
        top: '10%',
        left: '5%'
    });

    pauseButton = createButton('Pause Game', 'pauseButton', () => {
        // Pause logic will be handled by the game scene component
    }, {
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'none'
    });

    volumeButton = createButton('Volume: High', 'volumeButton', () => {
        // Volume control logic will be handled by the audio component
    });

    // Add buttons to main menu
    mainMenuUI.appendChild(startButton);
    mainMenuUI.appendChild(helpButton);
    mainMenuUI.appendChild(volumeButton);

    // Add buttons to document
    document.body.appendChild(musicButton);
    document.body.appendChild(pauseButton);
}

// Export UI elements and functions
export {
    startButton,
    helpButton,
    musicButton,
    pauseButton,
    volumeButton,
    mainMenuUI,
    characterSelectionContainer,
    mainMenuHighScoreContainer,
    mainMenuHighScoreText,
    modal,
    pauseModal,
    overlay,
    statsContainer,
    gameOverContainer
}; 
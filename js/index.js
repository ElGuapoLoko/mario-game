const startButton = document.getElementById('startGame');
const CreditButton = document.getElementById('Credit');

startButton.addEventListener('click', () => {
    window.location.href = './game.html';
});

CreditButton.addEventListener('click', () => {
    window.location.href = './about.html';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.code === 'Space') {
        window.location.href = 'game.html';
    }
});

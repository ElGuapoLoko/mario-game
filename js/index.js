const startButton = document.getElementById('startGame');

// Clique no botão
startButton.addEventListener('click', () => {
    window.location.href = './game.html'; // ✅ MUDE PARA O NOME DO SEU ARQUIVO DO JOGO
});

// Enter também inicia
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.code === 'Space') {
        window.location.href = 'game.html';
    }
});

const backButton = document.getElementById('backMenu');

backButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.code === 'Space') {
        window.location.href = 'index.html';
    }
});

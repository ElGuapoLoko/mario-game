const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const restart = document.querySelector('.restart');
const gameBoard = document.querySelector('.game-board');

let jumping = false;

const jump = () => {
    if (!jumping) {
        mario.classList.add('jump');
        jumping = true;
        setTimeout(function () {
            mario.classList.remove('jump');
            jumping = false;
        }, 500);
    }
};

let keys = {
    right: false,
    left: false,
    up: false
};

let marioX = 0;
const speed = 5;

// 👉 direção do Mario: 1 = direita, -1 = esquerda
let marioDirection = 1;

// ======================= TECLADO =======================

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        keys.right = true;
        marioDirection = 1;
    }

    if (e.key === 'ArrowLeft') {
        keys.left = true;
        marioDirection = -1;
    }

    if (e.key === 'ArrowUp') {
        jump();
    }

    // tiro no espaço
    if (e.code === 'Space') {
        shoot();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
});

// ======================= MOVIMENTO =======================

function moveMario() {
    if (keys.right) {
        marioX += speed;
        mario.style.transform = `translateX(${marioX}px) scaleX(1)`; // olhando pra direita
    }

    if (keys.left) {
        marioX -= speed;
        mario.style.transform = `translateX(${marioX}px) scaleX(-1)`; // vira pra esquerda
    }

    requestAnimationFrame(moveMario);
}

moveMario();

function shoot() {
    const bullet = document.createElement('img');
    bullet.src = 'images/bullet.png';
    bullet.classList.add('bullet');

    const marioRect = mario.getBoundingClientRect();
    const gameBoardRect = gameBoard.getBoundingClientRect();

    const bulletDirection = marioDirection;

    let bulletX = marioRect.left - gameBoardRect.left +
        (bulletDirection === 1 ? marioRect.width - 10 : -10);

    let bulletY = marioRect.top - gameBoardRect.top + 40;

    bullet.style.left = bulletX + 'px';
    bullet.style.top  = bulletY + 'px';

    gameBoard.appendChild(bullet);

    const bulletSpeed = 12;

    function moveBullet() {
        bulletX += bulletSpeed * bulletDirection;
        bullet.style.left = bulletX + 'px';

        document.querySelectorAll('.monster').forEach(monster => {
            const monsterRect = monster.getBoundingClientRect();
            const bulletRect = bullet.getBoundingClientRect();

            const hit =
                bulletRect.left < monsterRect.right &&
                bulletRect.right > monsterRect.left &&
                bulletRect.top < monsterRect.bottom &&
                bulletRect.bottom > monsterRect.top;

            if (hit) {
                const monsterRect = monster.getBoundingClientRect();
                const gameBoardRect = gameBoard.getBoundingClientRect();

                const explosionX = monsterRect.left - gameBoardRect.left;
                const explosionY = monsterRect.top  - gameBoardRect.top;

                createExplosion(explosionX, explosionY);

                monster.style.display = 'none';

                setTimeout(() => {
                    monster.remove();
                }, 500);

                bullet.remove();
                return;
            }
        });

        if (bulletX < -50 || bulletX > gameBoardRect.width + 50) {
            bullet.remove();
            return;
        }

        requestAnimationFrame(moveBullet);
    }

    moveBullet();
}

function createExplosion(centerX, centerY) {
    const explosion = document.createElement('img');
    explosion.src = 'images/boom-explosion.gif'; // seu gif
    explosion.classList.add('explosion');

    explosion.style.left = centerX + 'px';
    explosion.style.top  = centerY + 'px';

    gameBoard.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 1500);
}




// ======================= LOOP DE COLISÃO COM O CANO =======================

const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const cloudsPosition = clouds.offsetLeft;
    const marioPosition = window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 60 && pipePosition > 0 && marioPosition < 100) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        clouds.style.animation = 'none';
        clouds.style.left = `${cloudsPosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = 'images/game-over.png';
        mario.style.width = '60px';
        mario.style.marginLeft = '40px';

        restart.style.display = 'inline-flex';

        clearInterval(loop);
    }
}, 10);

// ======================= MONSTROS =======================

const Monsters = [
    { 'src': 'images/monsters/boss1.gif', 'type': 'air' },
    { 'src': 'images/monsters/bowser-dancing.gif', 'type': 'air' },
    { 'src': 'images/monsters/bowser-mario-reading.gif', 'type': 'air' },
    { 'src': 'images/monsters/bowser-walking.gif', 'type': 'air' },
    { 'src': 'images/monsters/flower.gif', 'type': 'air' },
    { 'src': 'images/monsters/goomba.gif', 'type': 'air' },
    { 'src': 'images/monsters/midbus.gif', 'type': 'air' },
    { 'src': 'images/monsters/piranha-plant.gif', 'type': 'air' },
    { 'src': 'images/monsters/piranha-plant-super-smash.gif', 'type': 'air' },
    { 'src': 'images/monsters/pokey.gif', 'type': 'air' },
    { 'src': 'images/monsters/red-shell.gif', 'type': 'air' },
    { 'src': 'images/monsters/shock.gif', 'type': 'air' },
    { 'src': 'images/monsters/turtle.gif', 'type': 'air' },
    { 'src': 'images/monsters/turtle-flying.gif', 'type': 'air' },
    { 'src': 'images/monsters/wiggler.gif', 'type': 'air' }
];

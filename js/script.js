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

                const centerX = (monsterRect.left - gameBoardRect.left) + monsterRect.width / 2;
                const centerY = (monsterRect.top - gameBoardRect.top) + monsterRect.height / 2;

                createExplosion(centerX, centerY);

                monster.remove();
                bullet.remove();

                score += 10;
                scoreEl.textContent = score;

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

    console.log(centerY)

    explosion.style.left = centerX + 'px';
    explosion.style.top  = (centerY - 200 ) + 'px';

    gameBoard.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 1500);
}

const Monsters = [
    { src: 'images/monsters/boss1.gif', type: 'air' },
    { src: 'images/monsters/bowser-dancing.gif', type: 'air' },
    { src: 'images/monsters/bowser-mario-reading.gif', type: 'air' },
    { src: 'images/monsters/bowser-walking.gif', type: 'air' },
    { src: 'images/monsters/flower.gif', type: 'air' },
    { src: 'images/monsters/goomba.gif', type: 'air' },
    { src: 'images/monsters/piranha-plant.gif', type: 'air' },
    { src: 'images/monsters/piranha-plant-super-smash.gif', type: 'air' },
    { src: 'images/monsters/red-shell.gif', type: 'air' },
    { src: 'images/monsters/shock.gif', type: 'air' },
    { src: 'images/monsters/turtle.gif', type: 'air' },
    { src: 'images/monsters/turtle-flying.gif', type: 'air' },
    { src: 'images/monsters/wiggler.gif', type: 'air' },
];

let score = 0;
let canTakeDamage = true;
const scoreEl = document.querySelector('.score');

function spawnMonster() {
    const monsterData = Monsters[Math.floor(Math.random() * Monsters.length)];
    const monster = document.createElement('img');

    monster.src = monsterData.src;
    monster.classList.add('monster');

    // posição X aleatória dentro do mapa
    const gameBoardWidth = gameBoard.offsetWidth;
    const randomX = Math.random() * (gameBoardWidth - 60);

    monster.style.left = randomX + 'px';
    monster.style.top = '-80px';

    gameBoard.appendChild(monster);

    let monsterY = -80;
    const fallSpeed = 2 + Math.random() * 3;

    function fall() {
        monsterY += fallSpeed;
        monster.style.top = monsterY + 'px';

        // se cair até o chão, remove
        if (monsterY > gameBoard.offsetHeight - 90) {
            // monster.remove();
            return;
        }
        requestAnimationFrame(fall);
    }

    fall();
}

monsterInterval = setInterval(() => {
    spawnMonster();
}, 1200);

function checkMonsterMarioCollision() {
    const marioRect = mario.getBoundingClientRect();

    document.querySelectorAll('.monster').forEach(monster => {
        const monsterRect = monster.getBoundingClientRect();

        const hit =
            marioRect.left   < monsterRect.right &&
            marioRect.right  > monsterRect.left &&
            marioRect.top    < monsterRect.bottom &&
            marioRect.bottom > monsterRect.top;

        if (hit && canTakeDamage) {
            canTakeDamage = false;

            score -= 20;
            if (score < 0) score = 0;
            scoreEl.textContent = score;

            // ✅ cria explosão no monstro (opcional)
            const gameBoardRect = gameBoard.getBoundingClientRect();
            const centerX = (monsterRect.left - gameBoardRect.left) + monsterRect.width / 2;
            const centerY = (monsterRect.top  - gameBoardRect.top)  + monsterRect.height / 2;

            createExplosion(centerX, centerY);

            // ✅ remove o monstro após acertar o Mario
            monster.remove();

            // ✅ pequeno tempo de invencibilidade (anti spam)
            setTimeout(() => {
                canTakeDamage = true;
            }, 800); // 0.8s sem tomar dano
        }
    });
}


const mario = document.querySelector('.mario');
const gameBoard = document.querySelector('.game-board');
const gameoverScreen = document.querySelector('.gameover-screen');

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
let marioDirection = 1;

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

    if (e.code === 'Space') {
        shoot();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
});


function moveMario() {
    if (keys.right) {
        marioX += speed;
        mario.style.transform = `translateX(${marioX}px) scaleX(1)`;
    }

    if (keys.left) {
        marioX -= speed;
        mario.style.transform = `translateX(${marioX}px) scaleX(-1)`;
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
    bullet.style.top = bulletY + 'px';

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

                score += 20;
                scoreEl.textContent = score;

                updateSpawnSpeed();

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
    explosion.src = 'images/boom-explosion.gif';
    explosion.classList.add('explosion');

    explosion.style.left = centerX + 'px';
    explosion.style.top = (centerY - 200) + 'px';

    gameBoard.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 1500);
}

const Monsters = [
    {src: 'images/monsters/boss1.gif', indexY: 55, size: '100px'},
    {src: 'images/monsters/bowser-dancing.gif', indexY: 25, size: '100px'},
    {src: 'images/monsters/bowser-mario-reading.gif', indexY: 40, size: '100px'},
    {src: 'images/monsters/flower.gif', indexY: 30, size: '100px'},
    {src: 'images/monsters/goomba.gif', indexY: 35, size: '100px'},
    {src: 'images/monsters/piranha-plant.gif', indexY: 20, size: '100px'},
    {src: 'images/monsters/piranha-plant-super-smash.gif', indexY: 90, size: '100px'},
    {src: 'images/monsters/red-shell.gif', indexY: 20, size: '100px'},
    {src: 'images/monsters/shock.gif', indexY: 35, size: '100px'},
    {src: 'images/monsters/turtle-flying.gif', indexY: 45, size: '100px'},
    {src: 'images/monsters/wiggler.gif', indexY: -25, size: '100px'},
];

let score = 0;
let canTakeDamage = true;
const scoreEl = document.querySelector('.score');
let health = 10;
const healthEl = document.querySelector('.health');

function updateHealthUI() {
    healthEl.textContent = '❤'.repeat(health);
}

updateHealthUI();

function spawnMonster() {
    const monsterData = Monsters[Math.floor(Math.random() * Monsters.length)];
    const monster = document.createElement('img');

    monster.src = monsterData.src;
    monster.classList.add('monster');

    const gameBoardWidth = gameBoard.offsetWidth;
    const randomX = Math.random() * (gameBoardWidth - 60);

    monster.style.left = randomX + 'px';
    monster.style.top = '-80px';
    monster.style.width = monsterData.size;

    gameBoard.appendChild(monster);

    let monsterY = -80;
    const fallSpeed = 2 + Math.random() * 3;

    function fall() {
        monsterY += fallSpeed;
        monster.style.top = monsterY + 'px';

        if (monsterY > gameBoard.offsetHeight - 90 - monsterData.indexY) {
            return;
        }
        requestAnimationFrame(fall);
    }

    fall();
}

function updateSpawnSpeed() {
    const baseDelay = 2500;
    const step = 500;
    const level = Math.floor(score / 100);

    spawnDelay = baseDelay - (level * step);

    if (spawnDelay < 500) {
        spawnDelay = 500;
    }
}

let monsterSpawnTimeout;
let spawnDelay = 2500;

function scheduleNextMonster() {
    monsterSpawnTimeout = setTimeout(() => {
        spawnMonster();
        scheduleNextMonster();
    }, spawnDelay);
}

updateSpawnSpeed();
scheduleNextMonster();


function damageMario(amount) {
    canTakeDamage = false;

    health -= amount;
    if (health < 0) health = 0;
    updateHealthUI();

    setTimeout(() => {
        canTakeDamage = true;
    }, 700);

    if (health <= 0) {
        endgame();
    }
}

function endgame() {
    clearInterval(monsterSpawnTimeout)
    clearInterval(enemyShootInterval);
    gameoverScreen.classList.remove('hidden');
}


function monsterShoot(monster) {
    const bullet = document.createElement('img');
    bullet.src = 'images/bullet.gif';
    bullet.classList.add('enemy-bullet');

    const monsterRect = monster.getBoundingClientRect();
    const gameBoardRect = gameBoard.getBoundingClientRect();
    const marioRect = mario.getBoundingClientRect();

    let bulletX = monsterRect.left - gameBoardRect.left + monsterRect.width / 2;
    let bulletY = monsterRect.top - gameBoardRect.top + monsterRect.height / 2;

    bullet.style.left = bulletX + 'px';
    bullet.style.top = bulletY + 'px';

    gameBoard.appendChild(bullet);

    const dirX = marioRect.left + marioRect.width / 2 > monsterRect.left + monsterRect.width / 2 ? 1 : -1;
    const speed = 6;

    function moveEnemyBullet() {
        bulletX += speed * dirX;
        bullet.style.left = bulletX + 'px';

        const bulletRect = bullet.getBoundingClientRect();
        const marioRectNow = mario.getBoundingClientRect();

        const hit =
            bulletRect.left < marioRectNow.right &&
            bulletRect.right > marioRectNow.left &&
            bulletRect.top < marioRectNow.bottom &&
            bulletRect.bottom > marioRectNow.top;

        if (hit) {
            bullet.remove();
            damageMario(1);
            return;
        }

        setTimeout(function () {
            bullet.remove();
        }, 2500);

        requestAnimationFrame(moveEnemyBullet);
    }

    moveEnemyBullet();
}

const enemyShootInterval = setInterval(() => {
    document.querySelectorAll('.monster').forEach(monster => {
        monsterShoot(monster);
    });
}, 2500);


const restartButton = document.querySelector('.restartButton');
const exitButton = document.querySelector('.exitButton');


restartButton.addEventListener('click', () => {
    location.reload()
});

exitButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});


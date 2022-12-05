const mario = document.querySelector('.mario')
const pipe = document.querySelector('.pipe')
const clouds = document.querySelector('.clouds')
const restart = document.querySelector('.restart')

const jump = () => {
    mario.classList.add('jump')
    setTimeout(function () {
        mario.classList.remove('jump')
    }, 500)
}

document.addEventListener('keydown', jump)

const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const cloudsPosition = clouds.offsetLeft;
    const marioPosition = window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 60 && pipePosition > 0 && marioPosition < 100) {
        pipe.style.animation = 'none'
        pipe.style.left = `${pipePosition}px`

        clouds.style.animation = 'none'
        clouds.style.left = `${cloudsPosition}px`

        mario.style.animation = 'none'
        mario.style.bottom = `${marioPosition}px`

        mario.src = 'images/game-over.png'
        mario.style.width = '60px'
        mario.style.marginLeft = '40px'

        restart.style.display = 'inline-flex';

        clearInterval(loop)
    }
}, 10)


const Monsters = [
    {
        'src':'images/monsters/boss1.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/bowser-dancing.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/bowser-mario-reading.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/bowser-walking.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/flower.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/goomba.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/midbus.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/piranha-plant.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/piranha-plant-super-smash.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/pokey.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/red-shell.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/shock.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/turtle.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/turtle-flying.gif',
        'type':'air',
    },
    {
        'src':'images/monsters/wiggler.gif',
        'type':'air',
    }
];

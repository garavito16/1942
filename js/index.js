var score = 0;

var hero = {
	x: 500,
	y: 500
};

var enemies = [{x:150,y:30,tipo:1},{x:250,y:80,tipo:2},{x:450,y:50,tipo:1},{x:550,y:40,tipo:2},
{x:650,y:70,tipo:1},{x:750,y:80,tipo:2},{x:850,y:90,tipo:1}];

var bullets = [];
var explotion = [];

function displayHero() {
	document.getElementById('hero').style["top"] = hero.y + "px";
	document.getElementById('hero').style["left"] = hero.x + "px";
}

function displayEnemies() {
	let output = "";
	for (let index = 0; index < enemies.length; index++) {
        output += "<div class='enemy"+enemies[index].tipo+"' style='top:"+enemies[index].y+"px; left:"+enemies[index].x+"px;'></div>";
	}
	document.getElementById('enemies').innerHTML = output;
}

function moveEnemies() {
	for (let index = 0; index < enemies.length; index++) {
        enemies[index].y += 5;
        if(enemies[index].y >= 540) {
            enemies[index].y = 0;
            enemies[index].x = Math.random()*500;
        }
	}
}

function moveBullets() {
	for (let index = 0; index < bullets.length; index++) {
        bullets[index].y -= 50;
        if(bullets[index].y < 0) {
            bullets[index] = bullets[bullets.length-1];
            bullets.pop();
        }
	}
}

function displayBullets() {
	let output = "";
	for (let index = 0; index < bullets.length; index++) {
        output += "<div class='bullet' style='top:"+bullets[index].y+"px; left:"+bullets[index].x+"px;'></div>";
	}
	document.getElementById('bullets').innerHTML = output;
}

function displayScore() {
	document.getElementById('score').innerHTML = score;
}

function detectCollision() {
	for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
	        if(enemies[j].x - 12 <= bullets[i].x && enemies[j].x + 28 >= bullets[i].x 
            && enemies[j].y + 28 >= bullets[i].y)
	        {
                generarExplotation(enemies[j].x,enemies[j].y);
                //regresa el enemigo a la pantalla
                enemies[j].y = 0;
                enemies[j].x = Math.random()*500;
                //quitar la bala
                bullets.splice(i,1);
                //aumentar puntaje
                score += 10;
                displayEnemies();
                displayBullets();
                break;
	        }
        }
	}
}

function detectCollisionHeroe() {
	for (let i = 0; i < enemies.length; i++) {
	    if(hero.x - 28 <= enemies[i].x && hero.x + 28 >= enemies[i].x
        && hero.y <= enemies[i].y && hero.y + 28 >= enemies[i].y)
	    {
            console.log("se choco el avion");
            //restar los 500
            if(score >= 500) score -= 500;
            else score = 0;
            //quitar enemigo
            enemies[i].y = 0;
            enemies[i].x = Math.random()*500;
            break;
	    }
	}
}


function generarExplotation(x,y) {
	const music = new Audio('./../resources/explosion.mp3');
	music.play();
	// music.loop =true;
	// music.playbackRate = 2;
	// music.pause();
	explotion.push({tiempo: getSecondsSinceStartOfDay()});
	console.log(explotion);
	document.getElementById('container').innerHTML += "<div class='explotion' style='top:"+y+"px;left:"+x+"px'></div>";
}

function moveExplotation() {
	for (let index = 0; index < explotion.length; index++) {
        if(getSecondsSinceStartOfDay() - explotion[index].tiempo > 2) {
            divExplotiones = document.querySelectorAll('.explotion');
            divExplotiones[index].remove();
            explotion.splice(index,1);
            break;
        }
    }
}

function getSecondsSinceStartOfDay() {
	return new Date().getSeconds() + 
	new Date().getMinutes() * 60 + 
	new Date().getHours() * 3600;
}

function gameLoop() {
	moveExplotation();
	displayEnemies();
	moveEnemies();
	moveBullets();
	displayHero();
    detectCollisionHeroe();
	displayBullets();
	detectCollision();
	displayScore();
}

setInterval(gameLoop,100);

document.onkeydown = function(e) {
	if(e.keyCode === 37 && hero.x > 0) {
        hero.x -= 20;
	} else if(e.keyCode === 39  && hero.x + 30 < 1000) {
        hero.x += 20;
	} else if(e.keyCode === 38 && hero.y > 400) {
        hero.y -= 20;
	} else if(e.keyCode === 40 && hero.y + 45 < 563) {
        hero.y += 20;
	} else if(e.keyCode === 32) {
        bullets.push({x:hero.x+8,y:hero.y-15});
        displayBullets();
	}
	displayHero();
}
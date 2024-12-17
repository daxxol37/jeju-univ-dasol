class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false; // 객체가 파괴되었는지 여부
    this.type = ""; // 객체 타입 (영웅/적)
    this.width = 0; // 객체의 폭
    this.height = 0; // 객체의 높이
    this.img = undefined; // 객체의 이미지
  }

  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,
    };
  }

  draw(ctx) {
    //캔버스에 이미지 그리기
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); 
  }
}


class Hero extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 99;
    this.height = 75;
    this.type = 'Hero';
    this.cooldown = 0;

    this.life = 3;
    this.points = 0;
    this.shield = false;
    this.shieldCooldown = false;
    this.normalCooldown = 0;
    this.specialCooldown = 0;

  }
  activateShield() {
    if (!this.shield && !this.shieldCooldown) {
      this.shield = true; // 방어막 활성화
      console.log("Shield activated!");

      // 5초 후 방어막 비활성화
      setTimeout(() => {
        this.shield = false;
        console.log("Shield deactivated!");
      }, 5000);

      // 방어막 사용 후 쿨다운 설정
      this.shieldCooldown = true;
      setTimeout(() => {
        this.shieldCooldown = false; // 쿨다운 종료
      }, 10000); // 10초 쿨다운
    }
  }

  draw(ctx) {
    super.draw(ctx); // 기본 이미지 그리기

    // 방어막 이미지 그리기
    if (this.shield) {
      ctx.drawImage(
        shieldImg,
        this.x - 10,
        this.y - 10,
        this.width + 20,
        this.height + 20
      );
    }
  }

  takeDamage() {
    if (this.shield) {
      console.log("Shield is active! Damage prevented.");
      return; // 방어막이 있으면 데미지 무효화
    }
    this.life--;
    this.img = playerDamagedImg; // 손상된 이미지
    if (this.life === 0) {
      this.dead = true;
    }
    
  }
  
  fireMultiLaser() {
      // specialCooldown 조건 제거
      for (let i = 0; i < 5; i++) {
          const angle = (i - 2) * Math.PI / 18;
          const laser = new GreenLaser(this.x + 45, this.y - 10, angle);
          gameObjects.push(laser);
      }
  }

  canFire() {
      return this.normalCooldown === 0;  // 일반 공격은 normalCooldown만 체크
  }

  canFireSpecial() {
      return this.specialCooldown === 0;  // 특수 공격은 specialCooldown 체크
  }

  // 점수 누적을 위해 points 초기화 제거

  moveX(distance) {
      this.x += distance;
  }

  moveY(distance) {
      this.y += distance;
  }

  fire() {
      if (this.canFire()) {
          gameObjects.push(new Laser(this.x + 45, this.y - 10));
          this.cooldown = 500;
          let id = setInterval(() => {
              if (this.cooldown > 0) {
                  this.cooldown -= 100;
              } else {
                  clearInterval(id);
              }
          }, 100);
      }
  }

  decrementLife() {
      this.life--;
      this.img = playerDamagedImg; // 손상된 이미지
      if (this.life === 0) {
          this.dead = true;
      }
  }

  incrementPoints() {
      this.points += 100;
  }

  updateImage() {
      if (this.life === 1) {
          this.img = playerDamagedImg;
      }
  }
}


class Enemy extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 98;
    this.height = 50;
    this.type = "Enemy";
    this.collisionCooldown = 0;
    let id = setInterval(() => {
      if (this.y < canvas.height - this.height) {
          this.y += 5;
          if (this.collisionCooldown > 0) {
              this.collisionCooldown--;
          }
      } else {
          clearInterval(id);
      }
    }, 300);
  }
}

class MovingEnemy extends Enemy {
  constructor(x, y, moveType = "horizontal") { // 이동 타입 추가
    super(x, y);
    this.initialX = x;
    this.direction = 1;
    this.speed = 1; // 속도
    this.moveType = moveType; // 이동 타입 저장

    clearInterval(this.moveInterval);
    this.moveInterval = setInterval(() => {
      if (this.moveType === "horizontal") {
        // 기존 가로 이동
        this.x += this.speed * this.direction;
        if (this.x > this.initialX + 100 || this.x < this.initialX - 100) {
          this.direction *= -1;
        }
        this.y += 0.5; // 아래로 천천히 이동
      } else if (this.moveType === "diagonal") {
        // 대각선 이동
        this.x += this.speed * this.direction;
        this.y += this.speed; // 아래로 이동
        if (this.x > canvas.width - this.width || this.x < 0) {
          this.direction *= -1; // 좌우 반전
        }
      } else if (this.moveType === "zigzag") {
        // 지그재그 이동
        this.x += this.speed * this.direction * 2;
        this.y += 2; // 빠르게 아래로 이동
        if (this.x > this.initialX + 50 || this.x < this.initialX - 50) {
          this.direction *= -1;
        }
      }
    }, 50);
  }
}

class Laser extends GameObject {
  constructor(x, y) {
      super(x, y);
      this.width = 9;
      this.height = 33;
      this.type = 'Laser';
      this.img = laserImg;
      let id = setInterval(() => {
          if (this.y > 0) {
              this.y -= 15;
          } else {
              this.dead = true;
              clearInterval(id);
          }
      }, 100);
  }
}

function createMovingEnemies() {
  const V_FORMATION = [
      { x: canvas.width * 0.5, y: 50 },  
      { x: canvas.width * 0.3, y: 100 }, 
      { x: canvas.width * 0.7, y: 100 }, 
      { x: canvas.width * 0.2, y: 150 }, 
      { x: canvas.width * 0.8, y: 150 }  
  ];

  V_FORMATION.forEach((pos) => {
      const enemy = new MovingEnemy(pos.x, pos.y);
      enemy.img = enemyImg;
      gameObjects.push(enemy);
  });
}
class BossEnemy extends Enemy {
  constructor(x, y) {
      super(x, y);
      this.width = 150;
      this.height = 150;
      this.type = "Boss";
      this.health = 10;
      this.direction = 1;
      this.meteorCooldown = 0;
      this.moveInterval = null;  // interval을 저장할 변수 추가
      
      this.startMoving();
  }

  startMoving() {
      this.moveInterval = setInterval(() => {
          if (this.dead) {
              clearInterval(this.moveInterval);
              return;
          }

          this.x += 2 * this.direction;
          if (this.x > canvas.width - this.width || this.x < 0) {
              this.direction *= -1;
          }
          
          if (this.meteorCooldown > 0) {
              this.meteorCooldown--;
          } else if (hero && !this.dead) {
              this.fireMeteor();
              this.meteorCooldown = 50;
          }
      }, 50);
  }

  die() {
      this.dead = true;
      if (this.moveInterval) {
          clearInterval(this.moveInterval);
          this.moveInterval = null;
      }
  }

  takeDamage() {
      this.health -= 1;
      if (this.health <= 0) {
          this.die();
          return true;
      }
      return false;
  }

  fireMeteor() {
      if (hero && !this.dead) {
          const meteor = new Meteor(
              this.x + this.width/2,
              this.y + this.height,
              hero.x + hero.width/2,
              hero.y + hero.height/2
          );
          meteor.img = meteorBigImg;
          gameObjects.push(meteor);
      }
  }
}
  

class Meteor extends GameObject {
  constructor(x, y, targetX, targetY) {
      super(x, y);
      this.width = 40;
      this.height = 40;
      this.type = 'Meteor';
      
      // 플레이어 방향으로 발사
      const dx = targetX - x;
      const dy = targetY - y;
      const angle = Math.atan2(dy, dx);
      this.speedX = Math.cos(angle) * 3;  // 속도 조절
      this.speedY = Math.sin(angle) * 3;

      this.moveInterval = setInterval(() => {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
              this.dead = true;
              clearInterval(this.moveInterval);
          }
      }, 20);
  }
}

class GreenLaser extends Laser {
  constructor(x, y, angle) {
      super(x, y);
      this.img = laserGreenImg;
      this.angle = angle;
      this.speed = 15;
      
      // interval을 새로 설정
      clearInterval(this.moveInterval);  // 부모 클래스의 interval 제거
      this.moveInterval = setInterval(() => {
          this.x += Math.sin(this.angle) * this.speed;
          this.y -= Math.cos(this.angle) * this.speed;
          if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
              this.dead = true;
              clearInterval(this.moveInterval);
          }
      }, 50);
  }
}

class Explosion extends GameObject {
  constructor(x, y) {
      super(x, y);
      this.width = 50;
      this.height = 50;
      this.type = 'Explosion';
      this.frame = 0;
      this.totalFrames = 10;
      this.img = explosionImg;

      let id = setInterval(() => {
          this.frame++;
          if (this.frame >= this.totalFrames) {
              this.dead = true;
              clearInterval(id);
          }
      }, 50);
  }
}


class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }
  emit(message, payload = null) {
    if (this.listeners[message]) {
      this.listeners[message].forEach((l) => l(message, payload));
    }
  }
  clear() {
    this.listeners = {};
  }
}

// 11. 충돌 감지 함수
function intersectRect(r1, r2) {
  return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
  );
}

function createHero() {
  hero = new Hero(
      canvas.width / 2 - 45,
      canvas.height - canvas.height / 4
  );
  hero.img = heroImg;
  gameObjects.push(hero);
}


function createBoss() {
  const boss = new BossEnemy(canvas.width/2 - 75, 50);
  boss.img = enemyUFOImg;
  gameObjects.push(boss);
}

function createEnemies() {
  const MONSTER_TOTAL = 3;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
  for (let x = START_X; x < STOP_X; x += 98) {
      for (let y = 0; y < 50 * 5; y += 50) {
          const enemy = new Enemy(x, y);
          enemy.img = enemyImg;
          gameObjects.push(enemy);
      }
  }
}

function spawnMeteor() {
  const x = Math.random() * (canvas.width - 60); // 랜덤 X 위치
  const size = Math.random() > 0.5 ? "big" : "small"; // 랜덤 크기
  const meteor = new Meteor(x, 0, size); // 화면 상단에 생성
  gameObjects.push(meteor);
}

function handleMeteorCollisions() {
  const meteors = gameObjects.filter((go) => go.type === "Meteor");

  meteors.forEach((meteor) => {
    // 플레이어와 충돌
    if (intersectRect(hero.rectFromGameObject(), meteor.rectFromGameObject())) {
      meteor.dead = true;
      hero.takeDamage(); // 플레이어 데미지
    }
  });
}

function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

function initGame() {
  if (currentStage === 0) {  
      currentStage = 1;
      displayStageMessage(currentStage);
  }
  
  gameObjects = [];
  createEnemies();
  createHero();

  // 움직임 관련 이벤트
  eventEmitter.on(Messages.KEY_EVENT_UP, () => {
      hero.moveY(-5);
  });
  eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
      hero.moveY(5);
  });
  eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
      hero.moveX(-5);
  });
  eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
      hero.moveX(5);
  });
  eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
      if (hero.canFire()) {
          hero.fire();
      }
  });
  eventEmitter.on(Messages.KEY_EVENT_T, () => {
      if (hero && hero.canFire()) {
          hero.fireMultiLaser();
      }
  });

  // 충돌 관련 이벤트
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
      first.dead = true;
      second.dead = true;
      hero.incrementPoints();
      
      if (isEnemiesDead()) {
          if (currentStage === 3) {  // 보스 스테이지 클리어
              clearInterval(gameLoopId);
              gameLoopId = null;
              endGame(true);  // 게임 클리어
          } else {  // 다음 스테이지로
              currentStage++;
              clearInterval(gameLoopId);
              gameLoopId = null;
              displayStageMessage(currentStage);
          }
      }
  });


  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
      enemy.dead = true;
      hero.decrementLife();
      hero.updateImage();  // HP가 1일 때 이미지 변경
      if (isHeroDead()) {
          eventEmitter.emit(Messages.GAME_END_LOSS);
          return;
      }
  });

  // 게임 종료 관련 이벤트
  eventEmitter.on(Messages.GAME_END_WIN, () => {
      endGame(true);
  });

  eventEmitter.on(Messages.GAME_END_LOSS, () => {
      endGame(false);
  });

  // 스테이지 관련 이벤트
  eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
      if (!gameLoopId) {
          startStage(currentStage);
      }
  });

  eventEmitter.on(Messages.STAGE_CLEAR, () => {
      currentStage++;
      if (currentStage <= 3) {
          startStage(currentStage);
      }
  });
  eventEmitter.on(Messages.KEY_EVENT_T, () => {
      if (hero && hero.canFireSpecial()) {  // specialCooldown 체크
          hero.fireMultiLaser();
      }
  });
}

function drawLife() {
  const START_POS = canvas.width - 180;
  for(let i=0; i < hero.life; i++ ) {
    ctx.drawImage(
    lifeImg,
    START_POS + (45 * (i+1) ),
    canvas.height - 37);
  }
}

function drawPoints() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText("Points: " + hero.points, 10, canvas.height-20);
}

function drawText(message, x, y) {
  ctx.fillText(message, x, y);
}

function displayMessage(message, color = "red") {
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function drawBossHealth(boss) {
  if (boss && boss.type === "Boss" && !boss.dead) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText(`Boss Health: ${boss.health}`, canvas.width - 20, 30); // 보스 체력 표시
  }
}

function drawGameObjects(ctx) {
  gameObjects.forEach((go) => go.draw(ctx));
}

function updateGameObjects() {
  const enemies = gameObjects.filter(go => go.type === "Enemy" || go.type === "Boss");
  const lasers = gameObjects.filter(go => go.type === "Laser");
  const meteors = gameObjects.filter(go => go.type === "Meteor");

  // 레이저 충돌 처리
  lasers.forEach(laser => {
      enemies.forEach(enemy => {
          if (!enemy.dead && intersectRect(laser.rectFromGameObject(), enemy.rectFromGameObject())) {
              gameObjects.push(new Explosion(enemy.x, enemy.y));
              
              if (enemy.type === "Boss") {
                  if (enemy.takeDamage()) {  // 보스 처치 시
                      enemy.dead = true;
                      laser.dead = true;
                      hero.incrementPoints();
                      clearInterval(gameLoopId);
                      gameLoopId = null;
                      endGame(true);  // 최종 승리
                  }
                  laser.dead = true; // 총알을 제거
              } else {
                  enemy.dead = true;
                  laser.dead = true;
                  hero.incrementPoints();
                  
                  // 일반 적 모두 처치 시 다음 스테이지로
                  if (isEnemiesDead()) {
                      if (currentStage === 1) {  // 1라운드 클리어 시
                          currentStage = 2;  
                          clearInterval(gameLoopId);
                          gameLoopId = null;
                          setTimeout(() => {
                              displayStageMessage(currentStage);
                          }, 500);
                      } else if (currentStage === 2) {  // 2라운드 클리어 시
                          currentStage = 3;
                          clearInterval(gameLoopId);
                          gameLoopId = null;
                          setTimeout(() => {
                              displayStageMessage(currentStage);
                          }, 500);
                      }
                  }
              }
          }
      });
  });

  gameObjects = gameObjects.filter(go => !go.dead);

  // 영웅과 적/메테오 충돌 처리
  enemies.forEach(enemy => {
      if (!enemy.dead && enemy.collisionCooldown === 0) {
          const heroRect = hero.rectFromGameObject();
          if (intersectRect(heroRect, enemy.rectFromGameObject())) {
            if (!hero.shield) {  // 방어막이 없을 때만 데미지
              enemy.collisionCooldown = 10;
              hero.decrementLife();
              enemy.dead = true;
              hero.updateImage();
            } else {
              console.log("Shield active! Collision ignored.");
            } 
            enemy.dead = true;
          }
      }
  });

  meteors.forEach(meteor => {
    if (!meteor.dead && intersectRect(hero.rectFromGameObject(), meteor.rectFromGameObject())) {
      if (!hero.shield) { // 방어막이 없을 때만 데미지
        console.log("Meteor hit! Life decreased.");
        hero.decrementLife(); // 플레이어 목숨 감소
        hero.updateImage();
      } else {
        console.log("Shield active! Meteor collision ignored.");
      }
      meteor.dead = true; // 메테오 제거
    }
  });
  

  if (isHeroDead()) {
      eventEmitter.emit(Messages.GAME_END_LOSS);
  }
}

function isHeroDead() {
  return hero.life <= 0;
}

function isEnemiesDead() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
  return enemies.length === 0;
}

function endGame(win) {
  clearInterval(gameLoopId);
  gameLoopId = null;

  // 모든 interval 정리
  gameObjects.forEach(obj => {
      if (obj.moveInterval) {
          clearInterval(obj.moveInterval);
          obj.moveInterval = null;
      }
  });
  
  setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backImg, 0, 0, canvas.width, canvas.height);
      
      ctx.font = "50px Arial";
      ctx.textAlign = "center";
      
      if (win && currentStage === 3) {
          ctx.fillStyle = "gold";
          ctx.fillText("Mission Clear!", canvas.width / 2, canvas.height / 2);
          ctx.font = "30px Arial";
          ctx.fillText(`Final Score: ${hero.points}`, canvas.width / 2, canvas.height / 2 + 50);
          ctx.fillText("Press F5 to play again", canvas.width / 2, canvas.height / 2 + 100);
          gameObjects = [];  // 게임 오브젝트 초기화
      } else if (!win) {
          ctx.fillStyle = "red";
          ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
          ctx.font = "30px Arial";
          ctx.fillText(`Score: ${hero.points}`, canvas.width / 2, canvas.height / 2 + 50);
      }
  }, 200);
}
function displayStageMessage(stageNum) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backImg, 0, 0, canvas.width, canvas.height);

  ctx.font = "40px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(`Stage ${stageNum}`, canvas.width / 2, canvas.height / 2);
  ctx.font = "20px Arial";
  ctx.fillText("Press [Enter] to start", canvas.width / 2, canvas.height / 2 + 40);
}

function startStage(stageNum) {
  gameObjects = [];
  createHero();
  
  switch(stageNum) {
      case 1:
          createEnemies();
          break;
      case 2:
          createMovingEnemies();
          break;
      case 3:
          createBoss();
          break;
  }

  gameLoopId = setInterval(gameLoop, 100);
}

function resetGame() {
  if (gameLoopId) {
    clearInterval(gameLoopId); // 게임 루프 중지, 중복 실행 방지
    eventEmitter.clear(); // 모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지
    initGame(); // 게임 초기 상태 실행
    gameLoopId = setInterval(() => { // 100ms 간격으로 새로운 게임 루프 시작
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backImg, 0, 0, canvas.width, canvas.height);
      drawPoints();
      drawLife();
      updateGameObjects();
      drawGameObjects(ctx);
    }, 100);
  }
}


function intersectRect(r1, r2) {
  return !(
    (
      r2.left > r1.right || // r2가 r1의 오른쪽에 있음
      r2.right < r1.left || // r2가 r1의 왼쪽에 있음
      r2.top > r1.bottom || // r2가 r1의 아래에 있음
      r2.bottom < r1.top
    ) // r2가 r1의 위에 있음
  );
}
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backImg, 0, 0, canvas.width, canvas.height);
  drawGameObjects(ctx);
  updateGameObjects();
  drawPoints();
  drawLife();
  // 보스 체력 표시
  const boss = gameObjects.find(go => go.type === "Boss" && !go.dead);
  if (boss) {
    drawBossHealth(boss);
  }
}

const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  KEY_EVENT_T: "KEY_EVENT_T",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
  COLLISION_COMPANION_LASER: "COLLISION_COMPANION_LASER",
  GAME_END_LOSS: "GAME_END_LOSS",
  GAME_END_WIN: "GAME_END_WIN",
  KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
  STAGE_START: "STAGE_START",         // 추가
  STAGE_CLEAR: "STAGE_CLEAR"
};

let heroImg,
  enemyImg,
  laserImg,
  lifeImg,
  playerLeftImg,
  playerRightImg,
  playerDamagedImg,
  shieldImg,
  explosionImg,
  canvas,
  ctx,
  backImg,
  gameObjects = [],
  hero,
  gameLoopId,
  currentStage = 0;       
  eventEmitter = new EventEmitter();
  
window.onload = async () => {
  // 배경색 설정
  backImg = await loadTexture("assets/Background.png");
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  heroImg = await loadTexture("assets/player.png");
  enemyImg = await loadTexture("assets/enemyShip.png");
  laserImg = await loadTexture("assets/laserRed.png");
  explosionImg = await loadTexture("assets/laserGreenShot.png");
  lifeImg = await loadTexture("assets/life.png");
  playerLeftImg = await loadTexture("assets/playerLeft.png");
  playerRightImg = await loadTexture("assets/playerRight.png");
  playerDamagedImg = await loadTexture("assets/playerDamaged.png");
  laserGreenImg = await loadTexture("assets/laserGreen.png");
  enemyUFOImg = await loadTexture("assets/enemyUFO.png");
  shieldImg = await loadTexture("assets/shield.png");
  meteorBigImg = await loadTexture("assets/meteorBig.png");
  meteorSmallImg = await loadTexture("assets/meteorSmall.png");

  initGame();

  if (currentStage === 3) { // 2, 3 스테이지에서만 메테오 생성
    setInterval(() => {
        spawnMeteor();
    }, 3000);
  } 

  gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backImg, 0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
    updateGameObjects();
    drawPoints();  // 게임 루프 안으로 이동
    drawLife();    // drawLife 추가 
}, 100);

  window.addEventListener("keydown", (evt) => {
    if (evt.key === "ArrowUp") {
      eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
      eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
      eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
      eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    }
    switch (evt.key) {
      case "ArrowLeft":
        hero.img = playerLeftImg; // 왼쪽 이미지
        break;
      case "ArrowRight":
        hero.img = playerRightImg; // 오른쪽 이미지
        break;
    }
  });

window.addEventListener("keyup", (evt) => {
  if (evt.keyCode === 32) {
      eventEmitter.emit(Messages.KEY_EVENT_SPACE);
  }
  else if (evt.key === "Enter") {
      eventEmitter.emit(Messages.KEY_EVENT_ENTER);
  }
  else if (evt.key.toLowerCase() === 't') {
      eventEmitter.emit(Messages.KEY_EVENT_T);
  }
  else if (evt.key.toLowerCase() === "s") {
    hero.activateShield(); // 방어막 활성화
  }
});
};
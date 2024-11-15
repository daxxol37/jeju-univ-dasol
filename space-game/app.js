function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    });
}

window.onload = async () => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // 배경 이미지 로드
    const bgImg = await loadTexture('assets/starBackground.png');
    const bgPattern = ctx.createPattern(bgImg, "repeat");
    ctx.fillStyle = bgPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // 배경을 그리기

    // 주인공 이미지 및 적 이미지를 로드하고 화면에 그리기
    const heroImg = await loadTexture('assets/player.png');
    const enemyImg = await loadTexture('assets/enemyShip.png');
    
    // 주인공 이미지를 그리기
    ctx.drawImage(heroImg, canvas.width / 2 - 45, canvas.height - (canvas.height / 4));
    ctx.drawImage(heroImg, canvas.width / 2 - 45 - 60, canvas.height - (canvas.height / 4) + 20, canvas.width / 20, canvas.height / 20);
    ctx.drawImage(heroImg, canvas.width / 2 - 45 + 110, canvas.height - (canvas.height / 4) + 20, canvas.width / 20, canvas.height / 20);

    // 적을 그리기
    createEnemies2(ctx, canvas, enemyImg);
};
function createEnemies(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    
    for (let x = START_X; x < STOP_X; x += enemyImg.width) {
        for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
            ctx.drawImage(enemyImg, x, y);
        }
    }
}

function createEnemies2(ctx, canvas, enemyImg) {
    const rows = [5, 4, 3, 2, 1];  // 각 행에 배치할 적의 수 (5, 4, 3, 2, 1)
    let startY = 0;  // 첫 번째 행의 y 좌표는 0으로 시작

    rows.forEach((numMonsters, rowIndex) => {
        const START_X = (canvas.width - numMonsters * enemyImg.width) / 2;  // 중앙 정렬
        // 각 행에 대해 x 좌표로 적 배치
        for (let i = 0; i < numMonsters; i++) {
            ctx.drawImage(enemyImg, START_X + i * enemyImg.width, startY);
        }
        // y 좌표를 다음 행으로 이동 (적의 높이만큼)
        startY += enemyImg.height;
    });
}

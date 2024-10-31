// HTML Drag and Drop API로 드래그 및 드롭 구현
function addDragAndDropEvents(plantElement) {
    plantElement.draggable = true;  // HTML Drag and Drop API 활성화

    // 드래그 시작 시 위치 저장
    plantElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", plantElement.id);
        e.dataTransfer.setDragImage(new Image(), 0, 0); // 기본 드래그 이미지 제거
        plantElement.classList.add("dragging");

        // 드래그 시작 위치 저장
        plantElement.dataset.offsetX = e.offsetX;
        plantElement.dataset.offsetY = e.offsetY;
    });

    // 드래그 종료 시 스타일 제거
    plantElement.addEventListener("dragend", () => {
        plantElement.classList.remove("dragging");
    });

    // 더블 클릭 시 z-index 조정
    plantElement.addEventListener("dblclick", () => {
        const allPlants = document.querySelectorAll(".plant");
        let maxZIndex = 0;

        allPlants.forEach((plant) => {
            const currentZIndex = parseInt(getComputedStyle(plant).zIndex) || 0;
            maxZIndex = Math.max(maxZIndex, currentZIndex);
        });

        plantElement.style.zIndex = maxZIndex + 1;
    });
}

// 드롭 영역 설정
function setupDropZone() {
    const terrarium = document.getElementById("terrarium");

    terrarium.addEventListener("dragover", (e) => {
        e.preventDefault();  // 드롭 허용
    });

    terrarium.addEventListener("drop", (e) => {
        e.preventDefault();
        const plantId = e.dataTransfer.getData("text/plain");
        const plantElement = document.getElementById(plantId);

        // 드롭 시 저장된 오프셋 위치를 고려해 위치 계산
        const offsetX = parseInt(plantElement.dataset.offsetX, 10);
        const offsetY = parseInt(plantElement.dataset.offsetY, 10);

        // 드롭 위치에서 시작 위치를 빼서 정확한 위치 설정
        plantElement.style.position = "absolute";
        plantElement.style.left = e.clientX - offsetX + "px";
        plantElement.style.top = e.clientY - offsetY + "px";

        // 크기 조정
        plantElement.style.width = "150px";
        plantElement.style.height = "150px";

        terrarium.appendChild(plantElement);  // 테라리움에 요소 추가
    });
}

// 모든 식물 요소에 드래그 앤 드롭 이벤트 적용
const plants = [
    'plant1', 'plant2', 'plant3', 'plant4', 'plant5',
    'plant6', 'plant7', 'plant8', 'plant9', 'plant10',
    'plant11', 'plant12', 'plant13', 'plant14'
];

plants.forEach(plantId => {
    const plantElement = document.getElementById(plantId);
    if (plantElement) {
        addDragAndDropEvents(plantElement);
    }
});

// 드롭 영역 초기화
setupDropZone();

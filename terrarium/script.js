function dragElement(terrariumElement) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    terrariumElement.onpointerdown = pointerDrag;
    terrariumElement.addEventListener('dblclick', doubleClick);

    function pointerDrag(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onpointermove = elementDrag;
        document.onpointerup = stopElementDrag;
    }

    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        terrariumElement.style.top = terrariumElement.offsetTop - pos2 + 'px';
        terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + 'px';
    }

    function stopElementDrag() {
        document.onpointerup = null;
        document.onpointermove = null;
    }

    function doubleClick() {
        // 모든 식물의 z-index를 가져와서 가장 높은 값을 찾기
        const allPlants = document.querySelectorAll('.plant');
        let maxZIndex = 0;

        allPlants.forEach((plant) => {
            const currentZIndex = parseInt(getComputedStyle(plant).zIndex) || 0;
            if (currentZIndex > maxZIndex) {
                maxZIndex = currentZIndex; // 가장 높은 z-index 업데이트
            }
        });

        // 클릭한 요소의 z-index를 가장 높은 값보다 1 증가시켜 설정
        terrariumElement.style.zIndex = maxZIndex + 1;
        console.log("New z-index set to:", maxZIndex + 1); // 새 z-index 확인용
    }
}

// 각 식물 요소에 dragElement 함수 호출
const plants = [
    'plant1', 'plant2', 'plant3', 'plant4', 'plant5',
    'plant6', 'plant7', 'plant8', 'plant9', 'plant10',
    'plant11', 'plant12', 'plant13', 'plant14'
];

plants.forEach(plantId => {
    const plantElement = document.getElementById(plantId);
    if (plantElement) {
        dragElement(plantElement);
    }
});
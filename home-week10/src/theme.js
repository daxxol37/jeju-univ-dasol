// theme.js

const toggleButton = document.getElementById('theme-toggle');

// 사용자가 마지막으로 선택한 테마가 있으면 로드
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
  updateButtonText(savedTheme);
} else {
  // 시스템 기본 설정에 따라 초기 테마 설정
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = systemPrefersDark ? 'dark' : 'light';
  document.body.setAttribute('data-theme', initialTheme);
  updateButtonText(initialTheme);
}

// 버튼 텍스트 업데이트 함수
function updateButtonText(theme) {
  toggleButton.textContent = theme === 'dark' ? 'Switch Light Mode' : 'Switch Dark Mode';
}

// 다크모드와 라이트모드를 전환하는 함수
function toggleTheme() {
  
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme); // 선택한 테마를 저장
  updateButtonText(newTheme);
}

// 토글 버튼 클릭 이벤트 추가
toggleButton.addEventListener('click', toggleTheme);



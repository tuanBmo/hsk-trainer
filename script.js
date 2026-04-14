window.addEventListener('DOMContentLoaded', () => {
    const levels = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7', 'HSK8', 'HSK9', 'PERSONAL'];
    const levelList = document.getElementById('level-list');

    if (levelList) {
        levelList.innerHTML = "";
        levels.forEach(lvl => {
            let btn = document.createElement('button');
            btn.className = 'level-btn'; // Dùng class đã định nghĩa ở CSS
            btn.innerText = lvl;
            btn.onclick = () => {
                btn.classList.toggle('active'); // Đổi màu khi click
                if(selectedLevels.includes(lvl)) {
                    selectedLevels = selectedLevels.filter(l => l !== lvl);
                } else {
                    selectedLevels.push(lvl);
                }
            };
            levelList.appendChild(btn);
        });
    }
});

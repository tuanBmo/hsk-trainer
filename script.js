const levels = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7", "HSK8", "HSK9", "PERSONAL"];
let selectedLevels = [];
let selectedMode = "NGHĨA";

// Khởi tạo nút Level
const levelGrid = document.getElementById('levelGrid');
levels.forEach(lvl => {
    const btn = document.createElement('button');
    btn.className = 'lvl-btn';
    btn.innerText = lvl;
    btn.onclick = () => toggleLevel(lvl, btn);
    levelGrid.appendChild(btn);
});

function toggleLevel(lvl, btn) {
    if (selectedLevels.includes(lvl)) {
        selectedLevels = selectedLevels.filter(l => l !== lvl);
        btn.classList.remove('active');
    } else {
        selectedLevels.push(lvl);
        btn.classList.add('active');
    }
}

// Xử lý chọn Mode
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMode = btn.getAttribute('data-mode');
    };
});

// Nút Start
document.getElementById('btnStart').onclick = () => {
    if (selectedLevels.length === 0) {
        alert("Chưa chọn Level kìa chiến thần ơi!");
        return;
    }
    alert(`Bắt đầu học: ${selectedLevels.join(', ')} ở chế độ ${selectedMode}`);
    // Ở đây bạn sẽ thực hiện logic chuyển trang hoặc fetch file CSV/Excel
};

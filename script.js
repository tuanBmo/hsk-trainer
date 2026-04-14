// Đợi cho trang web tải xong hoàn toàn mới tạo nút
window.addEventListener('DOMContentLoaded', (event) => {
    const levels = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7', 'HSK8', 'HSK9', 'PERSONAL'];
    const levelList = document.getElementById('level-list');

    if (levelList) {
        levelList.innerHTML = ""; // Xóa trắng trước khi tạo
        levels.forEach(lvl => {
            let btn = document.createElement('button');
            // Thêm class Tailwind để làm đẹp nút
            btn.className = 'w-full py-2.5 rounded-xl bg-slate-700 font-bold hover:bg-slate-600 transition-all border border-transparent mb-2';
            btn.innerText = lvl;
            btn.onclick = () => {
                if(selectedLevels.includes(lvl)) {
                    selectedLevels = selectedLevels.filter(l => l !== lvl);
                    btn.classList.remove('bg-sky-500', 'border-sky-300');
                    btn.classList.add('bg-slate-700');
                } else {
                    selectedLevels.push(lvl);
                    btn.classList.add('bg-sky-500', 'border-sky-300');
                    btn.classList.remove('bg-slate-700');
                }
            };
            levelList.appendChild(btn);
        });
    } else {
        console.error("Không tìm thấy thẻ có id='level-list' trong index.html");
    }
});

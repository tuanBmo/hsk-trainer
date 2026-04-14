let selectedLevels = [];
let selectedMode = 'NGHĨA';
let quizPool = [];
let currentWord = null;
let hp = 5;

const failMessages = ["Toang rồi bu em ạ! 🤡", "Sai một ly là đi luôn cái lẩu Haidilao! 🍲", "Ủa alo? Chữ này mới học xong mà? 😂"];

// 1. Tạo danh sách nút Level khi web tải xong
window.addEventListener('DOMContentLoaded', () => {
    const levels = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7', 'HSK8', 'HSK9', 'PERSONAL'];
    const container = document.getElementById('level-list');
    
    levels.forEach(lvl => {
        let btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.innerText = lvl;
        btn.onclick = () => {
            btn.classList.toggle('selected');
            if(selectedLevels.includes(lvl)) selectedLevels = selectedLevels.filter(l => l !== lvl);
            else selectedLevels.push(lvl);
        };
        container.appendChild(btn);
    });
});

function selectMode(m) {
    selectedMode = m;
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active-mode'));
    document.getElementById('mode-' + m).classList.add('active-mode');
}

async function startGame() {
    if(selectedLevels.length === 0) return alert("Chưa chọn Level kìa chiến thần!");
    
    quizPool = [];
    for(let lvl of selectedLevels) {
        try {
            const res = await fetch(`${lvl.toLowerCase()}.csv`);
            const text = await res.text();
            const result = Papa.parse(text, {header: true, skipEmptyLines: true});
            quizPool.push(...result.data.map(i => ({...i, hsk_level: lvl})));
        } catch (e) { console.error("Lỗi tải file: " + lvl); }
    }

    if(quizPool.length === 0) return alert("Không có dữ liệu! Hãy kiểm tra file .csv trên GitHub.");
    
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    nextQuestion();
}

function nextQuestion() {
    if(quizPool.length === 0) {
        alert("BẬC THẦY HÁN NGỮ! Bạn đã quét sạch bộ từ vựng! 🎉");
        return location.reload();
    }
    
    const isRandom = document.getElementById('set-random').checked;
    const idx = isRandom ? Math.floor(Math.random() * quizPool.length) : 0;
    currentWord = quizPool[idx];
    
    document.getElementById('lvl-tag').innerText = currentWord.hsk_level;
    let correctAns = "";

    if(selectedMode === "NGHĨA") {
        document.getElementById('main-q').innerText = currentWord.Hanzi;
        document.getElementById('sub-q').innerText = document.getElementById('set-pinyin').checked ? currentWord.Pinyin : "****";
        correctAns = currentWord.Nghia;
    } else if(selectedMode === "PINYIN") {
        document.getElementById('main-q').innerText = currentWord.Hanzi;
        document.getElementById('sub-q').innerText = currentWord.Nghia;
        correctAns = currentWord.Pinyin;
    } else {
        document.getElementById('main-q').innerText = currentWord.Nghia;
        document.getElementById('sub-q').innerText = "****";
        correctAns = currentWord.Hanzi;
    }

    // Hiện ví dụ nếu bật
    const exBox = document.getElementById('example-q');
    exBox.innerText = document.getElementById('set-example').checked ? (currentWord.ViDu || "") : "";

    // Tạo đáp án
    let choices = [correctAns];
    while(choices.length < 4 && quizPool.length > 4) {
        let r = quizPool[Math.floor(Math.random() * quizPool.length)];
        let val = selectedMode === "NGHĨA" ? r.Nghia : (selectedMode === "PINYIN" ? r.Pinyin : r.Hanzi);
        if(val && !choices.includes(val)) choices.push(val);
    }
    choices.sort(() => Math.random() - 0.5);

    const container = document.getElementById('ans-container');
    container.innerHTML = "";
    choices.forEach(c => {
        let b = document.createElement('button');
        b.className = "ans-btn py-5 font-bold text-lg";
        b.innerText = c;
        b.onclick = () => {
            if(c === correctAns) {
                quizPool.splice(idx, 1);
                nextQuestion();
            } else {
                hp--;
                document.getElementById('hp-display').innerText = "♥".repeat(Math.max(0, hp));
                alert(failMessages[Math.floor(Math.random()*failMessages.length)] + "\n\nĐúng là: " + correctAns);
                if(hp <= 0) { alert("THẤT BẠI! Hẹn gặp lại chiến thần."); location.reload(); }
                else nextQuestion();
            }
        };
        container.appendChild(b);
    });
}

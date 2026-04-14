let selectedLevels = [];
let selectedMode = 'NGHĨA';
let quizPool = [];
let currentWord = null;
let hp = 5;

const fails = ["Kiến thức đã bay màu! 🤡", "Sai một ly đi luôn cái lẩu! 🍲", "Não bảo: 'Chưa thấy chữ này bao giờ!' 😂"];

// 1. Tạo nút Level
window.addEventListener('DOMContentLoaded', () => {
    const lvls = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7', 'HSK8', 'HSK9', 'PERSONAL'];
    const container = document.getElementById('level-list');
    lvls.forEach(l => {
        let b = document.createElement('button');
        b.className = 'level-btn';
        b.innerText = l;
        b.onclick = () => {
            b.classList.toggle('active');
            if(selectedLevels.includes(l)) selectedLevels = selectedLevels.filter(x => x !== l);
            else selectedLevels.push(l);
        };
        container.appendChild(b);
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
    for(let l of selectedLevels) {
        try {
            const r = await fetch(`${l.toLowerCase()}.csv`);
            const t = await r.text();
            const res = Papa.parse(t, {header: true, skipEmptyLines: true});
            quizPool.push(...res.data.map(i => ({...i, hsk_level: l})));
        } catch (e) { console.error("Lỗi tải file " + l); }
    }
    if(quizPool.length === 0) return alert("Không tìm thấy dữ liệu CSV! Kiểm tra lại tên file.");
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    nextQuestion();
}

function nextQuestion() {
    if(quizPool.length === 0) {
        alert("BẬC THẦY HÁN NGỮ! Bạn đã quét sạch bộ từ vựng! 🎉");
        return location.reload();
    }
    const isRand = document.getElementById('set-random').checked;
    const idx = isRand ? Math.floor(Math.random() * quizPool.length) : 0;
    currentWord = quizPool[idx];
    
    document.getElementById('lvl-tag').innerText = currentWord.hsk_level;
    let correct = "";

    // Reset style font size
    document.getElementById('main-q').style.fontSize = "6rem";

    if(selectedMode === "NGHĨA") {
        document.getElementById('main-q').innerText = currentWord.Hanzi;
        document.getElementById('sub-q').innerText = document.getElementById('set-pinyin').checked ? currentWord.Pinyin : "****";
        correct = currentWord.Nghia;
    } else if(selectedMode === "PINYIN") {
        document.getElementById('main-q').innerText = currentWord.Hanzi;
        document.getElementById('sub-q').innerText = currentWord.Nghia;
        correct = currentWord.Pinyin;
    } else {
        document.getElementById('main-q').innerText = currentWord.Nghia;
        document.getElementById('main-q').style.fontSize = "3.5rem";
        document.getElementById('sub-q').innerText = "****";
        correct = currentWord.Hanzi;
    }

    // Hiển thị ví dụ
    const exBox = document.getElementById('example-q');
    if(document.getElementById('set-example').checked && currentWord.ViDu) {
        exBox.innerText = "Ví dụ: " + currentWord.ViDu;
        exBox.classList.remove('hidden');
    } else { exBox.classList.add('hidden'); }

    // Tạo đáp án
    let choices = [correct];
    while(choices.length < 4 && quizPool.length > 4) {
        let r = quizPool[Math.floor(Math.random() * quizPool.length)];
        let v = selectedMode === "NGHĨA" ? r.Nghia : (selectedMode === "PINYIN" ? r.Pinyin : r.Hanzi);
        if(v && !choices.includes(v)) choices.push(v);
    }
    choices.sort(() => Math.random() - 0.5);

    const container = document.getElementById('ans-container');
    container.innerHTML = "";
    choices.forEach(c => {
        let b = document.createElement('button');
        b.className = "ans-btn py-5 text-xl";
        b.innerText = c;
        b.onclick = () => {
            if(c === correct) {
                quizPool.splice(idx, 1);
                nextQuestion();
            } else {
                hp--;
                document.getElementById('hp-display').innerText = "♥".repeat(Math.max(0, hp));
                alert(fails[Math.floor(Math.random()*fails.length)] + "\n\nĐúng là: " + correct);
                if(hp <= 0) { alert("THẤT BẠI! Hãy ôn luyện thêm nhé."); location.reload(); }
                else nextQuestion();
            }
        };
        container.appendChild(b);
    });
}

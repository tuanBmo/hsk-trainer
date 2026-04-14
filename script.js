let selectedLevels = [];
let selectedMode = 'NGHĨA';
let quizPool = [];
let currentWord = null;
let hp = 5;

// 1. Tự động tạo danh sách nút Level HSK1 -> HSK9
const levels = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7', 'HSK8', 'HSK9', 'PERSONAL'];
const levelList = document.getElementById('level-list');

levels.forEach(lvl => {
    let btn = document.createElement('button');
    btn.className = 'w-full py-2.5 rounded-xl bg-slate-700 font-bold hover:bg-slate-600 transition-all border border-transparent';
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

// 2. Chọn chế độ chơi
function selectMode(m) {
    selectedMode = m;
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('btn-active'));
    document.getElementById('mode-' + m).classList.add('btn-active');
}

// 3. Bắt đầu tải dữ liệu và vào Game
async function startGame() {
    if(selectedLevels.length === 0) return alert("Ê bạn ơi, chưa chọn Level kìa! 🙄");
    
    quizPool = [];
    try {
        for(let lvl of selectedLevels) {
            // Tải file CSV từ server (GitHub)
            const response = await fetch(`${lvl.toLowerCase()}.csv`);
            if (!response.ok) continue;
            const csvText = await response.text();
            
            // Dùng thư viện PapaParse để đọc CSV
            const result = Papa.parse(csvText, {header: true, skipEmptyLines: true});
            // Thêm thông tin level vào từng từ
            const dataWithLvl = result.data.map(item => ({...item, hsk_level: lvl}));
            quizPool.push(...dataWithLvl);
        }

        if(quizPool.length === 0) throw new Error("Không tìm thấy dữ liệu trong file CSV!");

        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        nextQuestion();
    } catch (err) {
        alert("Lỗi: Không tải được file CSV. Hãy kiểm tra tên file trên GitHub!");
    }
}

// 4. Chuyển câu hỏi tiếp theo
function nextQuestion() {
    if(quizPool.length === 0) {
        alert("QUÁ DỮ! Bạn đã quét sạch bộ từ vựng này rồi! 🎉");
        location.reload();
        return;
    }
    
    const isRandom = document.getElementById('set-random').checked;
    const randIdx = isRandom ? Math.floor(Math.random() * quizPool.length) : 0;
    currentWord = quizPool[randIdx];
    
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
    } else { // Chế độ Chữ Hán
        document.getElementById('main-q').innerText = currentWord.Nghia;
        document.getElementById('main-q').style.fontSize = "2.5rem";
        document.getElementById('sub-q').innerText = "****";
        correctAns = currentWord.Hanzi;
    }

    // Tạo 4 đáp án (1 đúng, 3 sai)
    let choices = [correctAns];
    let attempts = 0;
    while(choices.length < 4 && attempts < 100) {
        let r = quizPool[Math.floor(Math.random() * quizPool.length)];
        let val = selectedMode === "NGHĨA" ? r.Nghia : (selectedMode === "PINYIN" ? r.Pinyin : r.Hanzi);
        if(val && !choices.includes(val)) choices.push(val);
        attempts++;
    }
    choices.sort(() => Math.random() - 0.5); // Trộn đáp án

    // Hiển thị nút đáp án
    const container = document.getElementById('ans-container');
    container.innerHTML = "";
    choices.forEach(c => {
        let b = document.createElement('button');
        b.className = "answer-btn py-5 rounded-2xl font-bold text-lg active:scale-95";
        b.innerText = c;
        b.onclick = () => checkAns(c, correctAns, randIdx);
        container.appendChild(b);
    });
}

// 5. Kiểm tra đúng/sai
function checkAns(chosen, correct, idx) {
    if(chosen === correct) {
        quizPool.splice(idx, 1); // Xóa từ đã thuộc khỏi danh sách tạm thời
        nextQuestion();
    } else {
        hp--;
        document.getElementById('hp-display').innerText = "♥".repeat(Math.max(0, hp));
        alert("Sai rồi chiến thần ơi! 🤡\nĐáp án đúng phải là: " + correct);
        
        if(hp <= 0) {
            alert("THẤT BẠI! Bạn đã hết lượt tim. Chăm chỉ học lại nhé!");
            location.reload();
        } else {
            nextQuestion(); // Chơi tiếp câu khác
        }
    }
}

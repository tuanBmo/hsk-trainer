let selectedLevels = [];
let selectedMode = 'NGHĨA';
let quizPool = [];
let hp = 5;
let wrongHistory = []; // Tính năng Ôn lỗi sai

const failMessages = [
    "Sai một ly là đi luôn cái lẩu Haidilao rồi! 🍲",
    "Não bảo: 'Tao chưa thấy chữ này bao giờ!', dù mới học xong. 😂",
    "Toang rồi bu em ạ! Chữ này nó đang cười vào mặt bạn kìa!",
    "Ủa alo? Chữ này với bạn có thù oán gì mà chọn sai hoài vậy? 🤡"
];

const masteryMessages = ["Kinh đấy! Bộ não giờ toàn tiếng Trung! 🏮", "Quá dữ! HSK 9 giờ cũng chỉ là 'muỗi'! 🚀"];

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
    if(selectedLevels.length === 0) return alert("Chọn Level đã chiến thần ơi!");
    quizPool = [];
    for(let l of selectedLevels) {
        try {
            const r = await fetch(`${l.toLowerCase()}.csv`);
            const t = await r.text();
            const res = Papa.parse(t, {header: true, skipEmptyLines: true});
            quizPool.push(...res.data.map(i => ({...i, hsk_level: l})));
        } catch (e) { console.error(e); }
    }
    if(quizPool.length === 0) return alert("Không tìm thấy dữ liệu CSV!");
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    nextQuestion();
}

function nextQuestion() {
    if(quizPool.length === 0) return showFinish(true);
    
    const idx = document.getElementById('set-random').checked ? Math.floor(Math.random() * quizPool.length) : 0;
    const word = quizPool[idx];
    document.getElementById('lvl-tag').innerText = word.hsk_level;
    let correct = "";

    const mainQ = document.getElementById('main-q');
    mainQ.style.fontSize = window.innerWidth < 768 ? "3.5rem" : "6rem";

    if(selectedMode === "NGHĨA") {
        mainQ.innerText = word.Hanzi;
        document.getElementById('sub-q').innerText = document.getElementById('set-pinyin').checked ? word.Pinyin : "****";
        correct = word.Nghia;
    } else if(selectedMode === "PINYIN") {
        mainQ.innerText = word.Hanzi;
        document.getElementById('sub-q').innerText = word.Nghia;
        correct = word.Pinyin;
    } else {
        mainQ.innerText = word.Nghia;
        mainQ.style.fontSize = "2.5rem";
        document.getElementById('sub-q').innerText = "****";
        correct = word.Hanzi;
    }

    let choices = [correct];
    while(choices.length < 4 && quizPool.length > 4) {
        let r = quizPool[Math.floor(Math.random() * quizPool.length)];
        let v = selectedMode === "NGHĨA" ? r.Nghia : (selectedMode === "PINYIN" ? r.Pinyin : r.Hanzi);
        if(v && !choices.includes(v)) choices.push(val);
    }
    choices.sort(() => Math.random() - 0.5);

    const container = document.getElementById('ans-container');
    container.innerHTML = "";
    choices.forEach(c => {
        let b = document.createElement('button');
        b.className = "ans-btn";
        b.innerText = c;
        b.onclick = () => {
            if(c === correct) {
                quizPool.splice(idx, 1);
                nextQuestion();
            } else {
                if(!wrongHistory.includes(word)) wrongHistory.push(word);
                hp--;
                document.getElementById('hp-display').innerText = "♥".repeat(Math.max(0, hp));
                alert(failMessages[Math.floor(Math.random()*failMessages.length)] + "\n\nĐúng là: " + correct);
                if(hp <= 0) showFinish(false);
                else nextQuestion();
            }
        };
        container.appendChild(b);
    });
}

function showFinish(isWin) {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('finish-screen').classList.remove('hidden');
    const title = document.getElementById('finish-title');
    title.innerText = isWin ? masteryMessages[Math.floor(Math.random()*masteryMessages.length)] : "THẤT BẠI RỒI! 💀";
    
    const list = document.getElementById('wrong-list');
    list.innerHTML = "<h3 class='text-teal-400 font-bold mb-4 uppercase text-center'>📖 Sổ tay vấp ngã:</h3>";
    wrongHistory.forEach(w => {
        list.innerHTML += `<div class='bg-[#334155] p-4 rounded-xl border-l-4 border-red-500 mb-2 text-sm'>
            <b>${w.Hanzi}</b> (${w.Pinyin}): ${w.Nghia}
        </div>`;
    });
}

function confirmExit() { if(confirm("Dừng lại là mất hết muối đấy?")) location.reload(); }

let currentData = [];

function loadData(level) {
    const file = `hsk${level}.csv`;
    Papa.parse(file, {
        download: true,
        header: true,
        complete: function(results) {
            currentData = results.data.filter(item => item.Hanzi); // Lọc bỏ dòng trống
            alert("Đã tải xong dữ liệu HSK " + level);
            nextWord();
        }
    });
}

function nextWord() {
    if (currentData.length === 0) return alert("Hãy chọn Level trước!");
    const random = currentData[Math.floor(Math.random() * currentData.length)];
    
    document.getElementById('word').innerText = random.Hanzi;
    document.getElementById('pinyin').innerText = random.Pinyin;
    document.getElementById('meaning').innerText = random.Nghia;
    
    // Ẩn đáp án đi
    document.getElementById('pinyin').classList.add('opacity-0');
    document.getElementById('meaning').classList.add('opacity-0');
}

function showAnswer() {
    document.getElementById('pinyin').classList.remove('opacity-0');
    document.getElementById('meaning').classList.remove('opacity-0');
}

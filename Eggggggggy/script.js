let balloonCount = 0; // 用於累計氣球數量

// 當頁面加載時，恢復氣球數量和彈幕
window.onload = function() {
    // 從 localStorage 中獲取氣球數量
    const savedBalloonCount = localStorage.getItem('balloonCount');
    if (savedBalloonCount) {
        balloonCount = parseInt(savedBalloonCount, 10);
        document.getElementById('balloon-counter').textContent = balloonCount;
    }

    // 從 localStorage 中恢復彈幕
    const savedVisitedMessages = JSON.parse(localStorage.getItem('visitedMessages'));
    if (savedVisitedMessages) {
        savedVisitedMessages.forEach(function(message) {
            addVisitedText(message, false);
        });
    }
};

// 更新氣球數量並保存到 localStorage
function addBalloon() {
    const balloonContainer = document.getElementById('balloon-container');
    const newBalloon = document.createElement('div');
    
    // 設定氣球隨機顏色
    const colors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    newBalloon.className = 'balloon ' + randomColor;
    newBalloon.style.left = Math.random() * 90 + '%'; // 隨機水平位置
    balloonContainer.appendChild(newBalloon);

    // 6秒後移除氣球
    setTimeout(() => {
        balloonContainer.removeChild(newBalloon);
    }, 6000);

    // 更新氣球累計數量並保存到 localStorage
    balloonCount++;
    document.getElementById('balloon-counter').textContent = balloonCount;
    localStorage.setItem('balloonCount', balloonCount); // 保存到 localStorage
}

// 處理「到此一遊」的輸入並顯示為彈幕，並保存到 localStorage
function addVisited() {
    const input = document.getElementById('visited-input').value;
    if (input.trim() !== "") {
        addVisitedText(input, true); // 添加彈幕並保存

        // 清空輸入框
        document.getElementById('visited-input').value = "";
    }
}

// 顯示彈幕的函數，並根據需要選擇是否保存到 localStorage
function addVisitedText(text, saveToStorage) {
    const balloonContainer = document.getElementById('balloon-container');
    const visitedText = document.createElement('div');
    visitedText.className = 'visited-text';
    visitedText.textContent = text;
    visitedText.style.top = Math.random() * 80 + '%'; // 隨機垂直位置
    balloonContainer.appendChild(visitedText);

    // 如果需要保存，將新彈幕加入 localStorage
    if (saveToStorage) {
        let visitedMessages = JSON.parse(localStorage.getItem('visitedMessages')) || [];
        visitedMessages.push(text);
        localStorage.setItem('visitedMessages', JSON.stringify(visitedMessages));
    }
}

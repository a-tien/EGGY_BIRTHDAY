let balloonCount = 0; // 用於累計氣球數量

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

    // 更新氣球累計數量
    balloonCount++;
    document.getElementById('balloon-counter').textContent = balloonCount;
}

// 處理「到此一遊」的輸入並顯示為彈幕
function addVisited() {
    const input = document.getElementById('visited-input').value;
    if (input.trim() !== "") {
        const balloonContainer = document.getElementById('balloon-container');
        const visitedText = document.createElement('div');
        visitedText.className = 'visited-text';
        visitedText.textContent = input;
        visitedText.style.top = Math.random() * 80 + '%'; // 隨機垂直位置
        balloonContainer.appendChild(visitedText);

        // 清空輸入框
        document.getElementById('visited-input').value = "";
    }
}

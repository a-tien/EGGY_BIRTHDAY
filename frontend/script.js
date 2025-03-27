document.addEventListener('DOMContentLoaded', () => {
    updateBalloonCount();  // 如果你也有顯示氣球數
    loadVisitedTexts();        // 這行就是載入彈幕留言
  });
  
  function updateBalloonCount() {
    fetch('http://localhost:3000/api/balloon')
      .then(res => res.json())
      .then(data => {
        const counter = document.getElementById('balloon-counter');
        counter.textContent = data.count;
      });
  }
  

// 新增氣球並通知伺服器
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

    fetch('http://localhost:3000/api/balloon', {
        method: 'POST'
    })
    .then(() => updateBalloonCount());
}

function loadVisitedTexts() {
    fetch('http://localhost:3000/api/messages')
      .then(res => res.json())
      .then(data => {
        data.forEach((msg, index) => {
          setTimeout(() => {
            addVisitedText(msg.content);
          }, index * 300); // 每條間隔 300ms 出現（可調）
        });
      });
  }
  
  

// 新增彈幕並通知伺服器
function addVisited() {
    const input = document.getElementById('visited-input').value;
    if (input.trim() !== "") {
        addVisitedText(input, true);

        // 通知伺服器新增彈幕
        socket.send(JSON.stringify({ type: 'addVisited', text: input }));

        // 清空輸入框
        document.getElementById('visited-input').value = "";
    }
}

// 顯示彈幕的函數，是否需要保存取決於參數
function addVisitedText(text, saveToStorage) {
    // const balloonContainer = document.getElementById('balloon-container');
    const visitedText = document.createElement('div');
    visitedText.className = 'visited-text';
    visitedText.textContent = text;
    visitedText.style.top = Math.random() * 80 + '%'; // 隨機垂直位置
    const card = document.querySelector('.birthday-card');
    card.appendChild(visitedText);
    if (saveToStorage) {
        fetch('http://localhost:3000/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text })
        }).catch(err => console.error("儲存失敗", err));
      }
}

function submitVisited() {
    const input = document.getElementById('visited-input');
    const text = input.value.trim();
    if (text === "") return;
  
    addVisitedText(text, true);  // 顯示 + 存後端
    input.value = "";           // 清空輸入框
  }
  
  document.getElementById('visited-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitVisited();
  });

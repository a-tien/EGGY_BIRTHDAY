function addMessage() {
    const message = document.getElementById('message').value;
    if (message.trim() !== "") {
        const messageList = document.getElementById('messages');
        const newMessage = document.createElement('li');
        newMessage.textContent = message;
        messageList.appendChild(newMessage);
        document.getElementById('message').value = ""; // 清空輸入框
    }
}

function addBalloon() {
    const balloonContainer = document.getElementById('balloon-container');
    const newBalloon = document.createElement('div');
    newBalloon.className = 'balloon';
    newBalloon.style.left = Math.random() * 90 + '%'; // 隨機水平位置
    balloonContainer.appendChild(newBalloon);

    // 5秒後移除氣球
    setTimeout(() => {
        balloonContainer.removeChild(newBalloon);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const loginWindow = document.getElementById('loginWindow');
    const loginForm = document.getElementById('loginForm');
    const statusMessage = document.getElementById('statusMessage');

    // Dragging functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nickname = document.getElementById('nickname').value.trim();
        const room = document.getElementById('room').value.trim();

        if (nickname && room) {
            statusMessage.textContent = 'Connecting...';
            socket.emit('login-attempt', { nickname, room });
        }
    });

    // Socket event handlers
    socket.on('connect', () => {
        statusMessage.textContent = 'Connected to server';
    });

    socket.on('login-success', (data) => {
        statusMessage.textContent = `Welcome, ${data.nickname}!`;
        // Here you would typically redirect to the chat room
    });

    socket.on('login-error', (message) => {
        statusMessage.textContent = `Error: ${message}`;
    });

    // Dragging functionality
    const titleBar = document.querySelector('.title-bar');

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target.closest('.title-bar')) {
            isDragging = true;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, loginWindow);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    titleBar.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mouseleave', dragEnd);
});

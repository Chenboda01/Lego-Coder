// LEGO Coder - Main JavaScript File
'use strict';

// Application State
const AppState = {
    currentScreen: 'selection',
    selectedSoftware: null,
    workspaceBlocks: [],
    usbConnected: false,
    uploadProgress: 0,
    uploadInProgress: false
};

// DOM Elements
const screens = {
    selection: document.getElementById('selection-screen'),
    coding: document.getElementById('coding-screen'),
    usb: document.getElementById('usb-screen')
};

const selectedSoftwareElement = document.getElementById('selected-software');
const usbStatusIndicator = document.getElementById('usb-status-indicator');
const usbStatusText = document.getElementById('usb-status-text');
const uploadProgress = document.getElementById('upload-progress');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const brickStatus = document.getElementById('brick-status');
const workspace = document.getElementById('workspace');
const connectionStatus = document.getElementById('connection-status');

// Initialize application
function init() {
    console.log('LEGO Coder initializing...');
    
    setupEventListeners();
    initDragAndDrop();
    simulateUSBDetection();
    updateConnectionStatus();
}

// Set up event listeners
function setupEventListeners() {
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log(`Switched to ${this.textContent} mode`);
        });
    });
    
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');
    toolbarButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('i').className;
            console.log(`Toolbar action: ${action}`);
        });
    });
    
    window.addEventListener('resize', updateConnectionStatus);
}

// Software selection
function selectSoftware(software) {
    AppState.selectedSoftware = software;
    const softwareName = software === 'mindstorms' ? 'MINDSTORMS EV3' : 'SPIKE PRIME';
    
    selectedSoftwareElement.textContent = softwareName;
    showScreen('coding');
    console.log(`Selected software: ${softwareName}`);
    addConsoleMessage(`> Selected ${softwareName} programming environment`);
    addConsoleMessage(`> Loading block palette...`);
}

// Navigation between screens
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        if (screen) screen.style.display = 'none';
    });
    
    if (screens[screenName]) {
        screens[screenName].style.display = 'block';
        AppState.currentScreen = screenName;
    }
    
    if (screenName === 'coding') {
        updateWorkspace();
    } else if (screenName === 'usb') {
        updateUSBStatus();
    }
}

function goBackToSelection() {
    showScreen('selection');
    addConsoleMessage('> Returned to software selection');
}

function goBackToCoding() {
    showScreen('coding');
    addConsoleMessage('> Returned to code editor');
}

// Simulate upload to brick
function simulateUpload() {
    if (AppState.workspaceBlocks.length === 0) {
        alert('Please add some blocks to the workspace before uploading!');
        return;
    }
    
    addConsoleMessage('> Preparing program for upload...');
    addConsoleMessage('> Validating block sequence...');
    
    showScreen('usb');
    
    setTimeout(() => {
        if (!AppState.usbConnected) {
            alert('Please connect USB cable first!');
            addConsoleMessage('> ERROR: USB connection not detected');
        } else {
            addConsoleMessage('> USB connection detected. Ready to upload.');
        }
    }, 500);
}

// USB connection simulation
function simulateUSBDetection() {
    setTimeout(() => {
        const isConnected = Math.random() > 0.3;
        
        if (isConnected) {
            connectUSB();
        } else {
            setTimeout(simulateUSBDetection, 3000);
        }
    }, 2000);
}

function connectUSB() {
    AppState.usbConnected = true;
    updateUSBStatus();
    addConsoleMessage('> USB connection established');
    addConsoleMessage('> EV3 brick detected and ready');
}

function disconnectUSB() {
    AppState.usbConnected = false;
    updateUSBStatus();
    addConsoleMessage('> USB disconnected');
}

function updateUSBStatus() {
    if (!usbStatusIndicator || !usbStatusText) return;
    
    if (AppState.usbConnected) {
        usbStatusIndicator.className = 'status-indicator online';
        usbStatusText.textContent = 'Connected - EV3 brick ready';
        if (uploadBtn) uploadBtn.disabled = false;
        if (brickStatus) brickStatus.textContent = 'Ready for upload';
    } else {
        usbStatusIndicator.className = 'status-indicator offline';
        usbStatusText.textContent = 'Disconnected - Please connect USB cable';
        if (uploadBtn) uploadBtn.disabled = true;
        if (brickStatus) brickStatus.textContent = 'Disconnected';
    }
}

// File upload handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('File selected:', file.name);
    addConsoleMessage(`> Selected file: ${file.name}`);
    addConsoleMessage(`> File size: ${(file.size / 1024).toFixed(2)} KB`);
    
    if (uploadBtn) uploadBtn.disabled = false;
}

function startUpload() {
    if (!AppState.usbConnected) {
        alert('Please connect USB cable first!');
        return;
    }
    
    if (!fileInput.files[0]) {
        alert('Please select a file to upload!');
        return;
    }
    
    AppState.uploadInProgress = true;
    AppState.uploadProgress = 0;
    
    if (uploadProgress) uploadProgress.style.display = 'block';
    
    const interval = setInterval(() => {
        AppState.uploadProgress += Math.random() * 15;
        if (AppState.uploadProgress > 100) {
            AppState.uploadProgress = 100;
            clearInterval(interval);
            uploadComplete();
        }
        
        updateProgressBar();
    }, 200);
    
    addConsoleMessage('> Starting upload to EV3 brick...');
    if (brickStatus) brickStatus.textContent = 'Uploading...';
}

function updateProgressBar() {
    if (progressFill) progressFill.style.width = `${AppState.uploadProgress}%`;
    if (progressText) progressText.textContent = `${Math.round(AppState.uploadProgress)}%`;
}

function uploadComplete() {
    AppState.uploadInProgress = false;
    addConsoleMessage('> Upload complete!');
    addConsoleMessage('> Program ready to run on EV3 brick');
    
    if (brickStatus) brickStatus.textContent = 'Program Ready';
    
    setTimeout(() => {
        alert('Upload successful! Program is now ready to run on your EV3 brick.');
    }, 500);
}

// Drag and drop functionality
function initDragAndDrop() {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach(block => {
        block.addEventListener('dragstart', handleDragStart);
    });
    
    if (workspace) {
        workspace.addEventListener('dragover', handleDragOver);
        workspace.addEventListener('drop', handleDrop);
        workspace.addEventListener('dragenter', handleDragEnter);
        workspace.addEventListener('dragleave', handleDragLeave);
    }
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    workspace.classList.add('drag-over');
}

function handleDragLeave(e) {
    workspace.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    workspace.classList.remove('drag-over');
    
    const blockText = e.dataTransfer.getData('text/plain');
    addBlockToWorkspace(blockText);
}

function addBlockToWorkspace(blockText) {
    const blockId = Date.now();
    AppState.workspaceBlocks.push({
        id: blockId,
        text: blockText,
        timestamp: new Date().toLocaleTimeString()
    });
    
    updateWorkspace();
    addConsoleMessage(`> Added block: ${blockText}`);
}

function clearWorkspace() {
    if (AppState.workspaceBlocks.length === 0) return;
    
    AppState.workspaceBlocks = [];
    updateWorkspace();
    addConsoleMessage('> Workspace cleared');
}

function updateWorkspace() {
    if (!workspace) return;
    
    const placeholder = workspace.querySelector('.placeholder');
    if (placeholder) placeholder.style.display = 'none';
    
    const existingBlocks = workspace.querySelectorAll('.workspace-block');
    existingBlocks.forEach(block => block.remove());
    
    AppState.workspaceBlocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.className = 'workspace-block block';
        blockElement.textContent = `${block.text} (${block.timestamp})`;
        blockElement.draggable = true;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-block';
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.onclick = function() {
            removeBlockFromWorkspace(block.id);
        };
        
        blockElement.appendChild(deleteBtn);
        workspace.appendChild(blockElement);
    });
    
    if (AppState.workspaceBlocks.length === 0 && placeholder) {
        placeholder.style.display = 'block';
    }
}

function removeBlockFromWorkspace(blockId) {
    AppState.workspaceBlocks = AppState.workspaceBlocks.filter(block => block.id !== blockId);
    updateWorkspace();
    addConsoleMessage('> Block removed from workspace');
}

// Console functions
function addConsoleMessage(message) {
    const consoleElement = document.querySelector('.console-content');
    if (!consoleElement) return;
    
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    consoleElement.appendChild(messageElement);
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

function clearConsole() {
    const consoleElement = document.querySelector('.console-content');
    if (consoleElement) {
        consoleElement.innerHTML = '<p>> System ready. Select blocks to create program.</p><p>> Drag and drop blocks to workspace.</p>';
    }
}

// Connection status
function updateConnectionStatus() {
    if (!connectionStatus) return;
    
    const isOnline = navigator.onLine;
    connectionStatus.textContent = isOnline ? 'Online' : 'Offline';
    connectionStatus.style.color = isOnline ? '#00ff88' : '#ff3366';
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Public API for global access
window.LegoCoder = {
    selectSoftware,
    goBackToSelection,
    goBackToCoding,
    simulateUpload,
    startUpload,
    clearWorkspace,
    addConsoleMessage,
    clearConsole,
    connectUSB,
    disconnectUSB,
    getState: () => ({ ...AppState })
};
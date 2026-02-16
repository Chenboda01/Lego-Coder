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
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const codeGenerationArea = document.getElementById('code-generation-area');
const codeFormatLabel = document.getElementById('code-format-label');
const brickStatus = document.getElementById('brick-status');
const workspace = document.getElementById('workspace');
const connectionStatus = document.getElementById('connection-status');
const hardwareConnectTitle = document.getElementById('hardware-connect-title');
const hardwareConnectStep1 = document.getElementById('hardware-connect-step1');
const hardwareConnectStep2 = document.getElementById('hardware-connect-step2');
const hardwareConnectStep4 = document.getElementById('hardware-connect-step4');
const hardwareBrandLine1 = document.getElementById('hardware-brand-line1');
const hardwareBrandLine2 = document.getElementById('hardware-brand-line2');
const hardwareBrandLine3 = document.getElementById('hardware-brand-line3');
const blockInterface = document.getElementById('block-interface');
const pythonInterface = document.getElementById('python-interface');
const pythonCodeArea = document.getElementById('python-code');

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
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const mode = this.textContent.toLowerCase();
            console.log(`Switched to ${mode} mode`);
            switchCodingMode(mode);
        });
    });
    
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');
    toolbarButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            if (action) {
                handleToolbarAction(action);
            } else {
                const iconClass = this.querySelector('i').className;
                console.log(`Toolbar action: ${iconClass}`);
            }
        });
    });
    
    window.addEventListener('resize', updateConnectionStatus);
}

function switchCodingMode(mode) {
    if (mode === 'blocks') {
        if (blockInterface) blockInterface.style.display = 'flex';
        if (pythonInterface) pythonInterface.style.display = 'none';
        if (codeFormatLabel) codeFormatLabel.textContent = 'Block code format';
        addConsoleMessage('> Switched to block coding mode');
    } else if (mode === 'python') {
        if (blockInterface) blockInterface.style.display = 'none';
        if (pythonInterface) pythonInterface.style.display = 'flex';
        if (codeFormatLabel) codeFormatLabel.textContent = 'Python code format';
        addConsoleMessage('> Switched to Python coding mode');
    }
}

function handleToolbarAction(action) {
    switch (action) {
        case 'run-python':
            runPythonCode();
            break;
        case 'save-python':
            savePythonCode();
            break;
        case 'reset-python':
            resetPythonCode();
            break;
        default:
            console.log(`Unknown toolbar action: ${action}`);
    }
}

// Software selection
function selectSoftware(software) {
    AppState.selectedSoftware = software;
    const softwareName = software === 'mindstorms' ? 'MINDSTORMS EV3' : 'SPIKE PRIME';
    const hardwareName = software === 'mindstorms' ? 'EV3 brick' : 'SPIKE Prime Hub';
    const hardwareBrand = software === 'mindstorms' ? ['LEGO', 'MINDSTORMS', 'EV3'] : ['LEGO', 'SPIKE', 'PRIME'];
    
    selectedSoftwareElement.textContent = softwareName;
    
    if (hardwareConnectTitle) hardwareConnectTitle.textContent = `Connect Your ${hardwareName}`;
    if (hardwareConnectStep1) hardwareConnectStep1.textContent = `Connect USB cable from computer to ${hardwareName}`;
    if (hardwareConnectStep2) hardwareConnectStep2.textContent = `Turn on the ${hardwareName}`;
    if (hardwareConnectStep4) hardwareConnectStep4.textContent = `Generate program code for ${hardwareName}`;
    if (hardwareBrandLine1) hardwareBrandLine1.textContent = hardwareBrand[0];
    if (hardwareBrandLine2) hardwareBrandLine2.textContent = hardwareBrand[1];
    if (hardwareBrandLine3) hardwareBrandLine3.textContent = hardwareBrand[2];
    
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
function generateCode() {
    if (AppState.workspaceBlocks.length === 0) {
        alert('Please add some blocks to the workspace before generating code!');
        return;
    }
    
    addConsoleMessage('> Generating program code from blocks...');
    addConsoleMessage('> Converting block sequence to executable code...');
    
    showScreen('usb');
    
    const code = generateCodeFromBlocks();
    if (codeGenerationArea) {
        codeGenerationArea.innerHTML = `<pre><code>${code}</code></pre>`;
    }
    
    addConsoleMessage('> Code generated successfully!');
    if (downloadBtn) downloadBtn.style.display = 'block';
}

function generateCodeFromBlocks() {
    const hardwareName = AppState.selectedSoftware === 'mindstorms' ? 'EV3' : 'SPIKE Prime';
    let code = `# LEGO ${hardwareName} Program\n`;
    code += `# Generated from block code\n`;
    code += `# Date: ${new Date().toLocaleDateString()}\n\n`;
    
    AppState.workspaceBlocks.forEach((block, index) => {
        code += `# ${index + 1}. ${block.text}\n`;
        
        if (block.text.includes('Move Forward')) {
            code += `motor.run_for_degrees(360, 50)  # Move forward\n`;
        } else if (block.text.includes('Turn Right')) {
            code += `motor.run_for_degrees(90, 50)   # Turn right\n`;
        } else if (block.text.includes('Turn Left')) {
            code += `motor.run_for_degrees(-90, 50)  # Turn left\n`;
        } else if (block.text.includes('Wait for Touch')) {
            code += `while not touch_sensor.is_pressed():\n    time.sleep(0.1)\n`;
        } else if (block.text.includes('Repeat 10x')) {
            code += `for i in range(10):\n    # Repeated actions\n`;
        } else if (block.text.includes('Wait 1 Second')) {
            code += `time.sleep(1.0)  # Wait 1 second\n`;
        } else {
            code += `# Action: ${block.text}\n`;
        }
        code += '\n';
    });
    
    return code;
}

// Python editor functions
function runPythonCode() {
    const code = pythonCodeArea ? pythonCodeArea.value : '';
    if (!code.trim()) {
        addConsoleMessage('> No Python code to run');
        return;
    }
    addConsoleMessage('> Running Python code...');
    addConsoleMessage('> Simulating execution on LEGO device...');
    addConsoleMessage('> Motor A: rotating 360 degrees');
    addConsoleMessage('> Color sensor B: detecting color');
    addConsoleMessage('> Execution complete');
}

function savePythonCode() {
    const code = pythonCodeArea ? pythonCodeArea.value : '';
    try {
        localStorage.setItem('lego_python_code', code);
        addConsoleMessage('> Python code saved locally');
    } catch (e) {
        addConsoleMessage('> Could not save code (localStorage unavailable)');
    }
}

function resetPythonCode() {
    if (!pythonCodeArea) return;
    pythonCodeArea.value = `from spike import Motor, ColorSensor
import time

motor = Motor('A')
color_sensor = ColorSensor('B')

motor.run_for_degrees(360)
time.sleep(1)`;
    addConsoleMessage('> Python editor reset to default');
}

function generatePythonCode() {
    const code = pythonCodeArea ? pythonCodeArea.value : '';
    if (!code.trim()) {
        alert('Please write some Python code before generating!');
        return;
    }
    addConsoleMessage('> Generating program from Python code...');
    showScreen('usb');
    
    const hardwareName = AppState.selectedSoftware === 'mindstorms' ? 'EV3' : 'SPIKE Prime';
    let generatedCode = `# LEGO ${hardwareName} Program\n`;
    generatedCode += `# Generated from Python code\n`;
    generatedCode += `# Date: ${new Date().toLocaleDateString()}\n\n`;
    generatedCode += code;
    
    if (codeGenerationArea) {
        codeGenerationArea.innerHTML = `<pre><code>${generatedCode}</code></pre>`;
    }
    addConsoleMessage('> Python code generated successfully!');
    if (downloadBtn) downloadBtn.style.display = 'block';
}

function clearPythonCode() {
    if (!pythonCodeArea) return;
    pythonCodeArea.value = '';
    addConsoleMessage('> Python code cleared');
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
    const hardwareName = AppState.selectedSoftware === 'mindstorms' ? 'EV3 brick' : 'SPIKE Prime Hub';
    addConsoleMessage(`> ${hardwareName} detected and ready`);
}

function disconnectUSB() {
    AppState.usbConnected = false;
    updateUSBStatus();
    addConsoleMessage('> USB disconnected');
}

function updateUSBStatus() {
    if (!usbStatusIndicator || !usbStatusText) return;
    
    const hardwareName = AppState.selectedSoftware === 'mindstorms' ? 'EV3 brick' : 'SPIKE Prime Hub';
    
    if (AppState.usbConnected) {
        usbStatusIndicator.className = 'status-indicator online';
        usbStatusText.textContent = `Connected - ${hardwareName} ready`;
        if (generateBtn) generateBtn.disabled = false;
        if (brickStatus) brickStatus.textContent = 'Ready for code';
    } else {
        usbStatusIndicator.className = 'status-indicator offline';
        usbStatusText.textContent = 'Disconnected - Please connect USB cable';
        if (generateBtn) generateBtn.disabled = true;
        if (brickStatus) brickStatus.textContent = 'Disconnected';
    }
}

// Code download functionality
function downloadCode() {
    const hardwareName = AppState.selectedSoftware === 'mindstorms' ? 'EV3' : 'SPIKE_Prime';
    const fileName = `lego_program_${hardwareName}_${Date.now()}.py`;
    const codeElement = codeGenerationArea.querySelector('code');
    const code = codeElement ? codeElement.textContent : '// No code generated';
    
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addConsoleMessage(`> Code downloaded as ${fileName}`);
    const deviceName = AppState.selectedSoftware === 'mindstorms' ? 'EV3 brick' : 'SPIKE Prime Hub';
    addConsoleMessage(`> Program ready to run on ${deviceName}`);
    
    if (brickStatus) brickStatus.textContent = 'Program Ready';
    
    setTimeout(() => {
        alert(`Code downloaded! Transfer ${fileName} to your LEGO device to run it.`);
    }, 500);
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
    clearWorkspace,
    addConsoleMessage,
    clearConsole,
    connectUSB,
    disconnectUSB,
    generatePythonCode,
    clearPythonCode,
    runPythonCode,
    savePythonCode,
    resetPythonCode,
    getState: () => ({ ...AppState })
};
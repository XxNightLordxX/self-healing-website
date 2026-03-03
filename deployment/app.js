// Self-Healing Website Frontend Application - Production Version

// State Management
const state = {
    status: 'idle',
    progress: null,
    pollInterval: null,
    isRunning: false,
    isProduction: true
};

// DOM Elements
const elements = {
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    repoName: document.getElementById('repoName'),
    filesCount: document.getElementById('filesCount'),
    fixedCount: document.getElementById('fixedCount'),
    languagesCount: document.getElementById('languagesCount'),
    runButton: document.getElementById('runButton'),
    runButtonIcon: document.getElementById('runButtonIcon'),
    runButtonText: document.getElementById('runButtonText'),
    tokenStatus: document.getElementById('tokenStatus'),
    authUser: document.getElementById('authUser'),
    repoStatus: document.getElementById('repoStatus'),
    lastRun: document.getElementById('lastRun'),
    passedCount: document.getElementById('passedCount'),
    fixedStatCount: document.getElementById('fixedStatCount'),
    errorCount: document.getElementById('errorCount'),
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText'),
    logsContainer: document.getElementById('logsContainer'),
    checklistContainer: document.getElementById('checklistContainer'),
    directoriesList: document.getElementById('directoriesList'),
    filesList: document.getElementById('filesList'),
    languagesList: document.getElementById('languagesList'),
    frameworksList: document.getElementById('frameworksList'),
    summaryGrid: document.getElementById('summaryGrid'),
    summaryTotal: document.getElementById('summaryTotal'),
    summaryPassed: document.getElementById('summaryPassed'),
    summaryFixed: document.getElementById('summaryFixed'),
    summaryErrors: document.getElementById('summaryErrors'),
    summaryFiles: document.getElementById('summaryFiles'),
    summaryLanguages: document.getElementById('summaryLanguages')
};

// Initialize Application
async function init() {
    console.log('Initializing Self-Healing Website (Production)...');
    
    // Setup tab navigation
    setupTabs();
    
    // Show production notice
    showProductionNotice();
    
    // Setup demo functionality
    setupDemoMode();
    
    console.log('Production initialization complete');
}

// Setup Tab Navigation
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target content
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`${targetTab}Content`).classList.remove('hidden');
        });
    });
}

// Show Production Notice
function showProductionNotice() {
    elements.tokenStatus.textContent = 'Production Mode';
    elements.tokenStatus.style.color = 'var(--warning-color)';
    elements.authUser.textContent = 'Demo Mode';
    elements.repoStatus.textContent = 'Static Deployment';
    elements.lastRun.textContent = 'Never (Demo)';
    
    addLog('Production deployment loaded - Demo mode active', 'info');
    addLog('To use full functionality, run the backend server locally', 'warn');
}

// Setup Demo Mode
function setupDemoMode() {
    // Disable run button in production
    elements.runButton.addEventListener('click', () => {
        if (state.isProduction) {
            showDemoAlert();
        }
    });
    
    // Add demo data
    setTimeout(() => {
        showDemoData();
    }, 2000);
}

// Show Demo Alert
function showDemoAlert() {
    addLog('Demo mode: Backend server required for full functionality', 'warn');
    addLog('Run locally with: npm install && node server.js', 'info');
    
    // Show demo progress
    runDemoProgress();
}

// Run Demo Progress
function runDemoProgress() {
    updateButtonState('running');
    updateStatusDot('running');
    
    addLog('Demo: Starting simulated self-healing cycle...', 'info');
    
    let progress = 0;
    const demoInterval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(demoInterval);
            
            // Complete demo
            setTimeout(() => {
                updateButtonState('completed');
                updateStatusDot('completed');
                addLog('Demo: Simulated cycle completed successfully!', 'success');
                addLog('This is a demonstration - run locally for real functionality', 'warn');
                
                // Show demo summary
                showDemoSummary();
            }, 1000);
        }
        
        // Update progress bar
        elements.progressBar.style.width = `${progress}%`;
        elements.progressBar.className = 'progress-bar running';
        elements.progressText.textContent = `Demo Progress: ${Math.round(progress)}%`;
        
        // Add demo logs
        const demoMessages = [
            'Scanning repository structure...',
            'Detecting languages and frameworks...',
            'Generating validation checklist...',
            'Running security checks...',
            'Validating code quality...',
            'Checking performance patterns...',
            'Updating documentation...',
            'Committing fixes to repository...'
        ];
        
        if (Math.random() > 0.7) {
            const message = demoMessages[Math.floor(Math.random() * demoMessages.length)];
            addLog(`Demo: ${message}`, 'info');
        }
        
    }, 500);
}

// Show Demo Summary
function showDemoSummary() {
    // Update status cards
    elements.filesCount.textContent = '42';
    elements.fixedCount.textContent = '7';
    elements.languagesCount.textContent = '4';
    
    // Update progress stats
    elements.passedCount.textContent = '35';
    elements.fixedStatCount.textContent = '7';
    elements.errorCount.textContent = '0';
    
    // Show demo scan results
    elements.directoriesList.innerHTML = `
        <li>src/</li>
        <li>public/</li>
        <li>tests/</li>
        <li>docs/</li>
        <li>config/</li>
    `;
    
    elements.filesList.innerHTML = `
        <li>src/index.js</li>
        <li>src/components/App.js</li>
        <li>src/utils/helpers.js</li>
        <li>public/index.html</li>
        <li>package.json</li>
        <li>README.md</li>
        <li>... and 36 more</li>
    `;
    
    elements.languagesList.innerHTML = `
        <li>JavaScript: 28 files</li>
        <li>CSS: 8 files</li>
        <li>HTML: 4 files</li>
        <li>JSON: 2 files</li>
    `;
    
    elements.frameworksList.innerHTML = `
        <li>React</li>
        <li>Node.js</li>
        <li>Express</li>
        <li>Jest</li>
    `;
    
    // Show summary
    elements.summaryGrid.style.display = 'grid';
    elements.summaryTotal.textContent = '42';
    elements.summaryPassed.textContent = '35';
    elements.summaryFixed.textContent = '7';
    elements.summaryErrors.textContent = '0';
    elements.summaryFiles.textContent = '42';
    elements.summaryLanguages.textContent = '4';
}

// Update Button State
function updateButtonState(status) {
    elements.runButton.className = `run-button ${status}`;
    
    switch (status) {
        case 'running':
            elements.runButtonIcon.innerHTML = '<span class="spinner"></span>';
            elements.runButtonText.textContent = 'Running Demo...';
            break;
        case 'completed':
            elements.runButtonIcon.textContent = '✓';
            elements.runButtonText.textContent = 'Demo Completed - Run Again';
            break;
        case 'error':
            elements.runButtonIcon.textContent = '!';
            elements.runButtonText.textContent = 'Error - Try Again';
            break;
        default:
            elements.runButtonIcon.textContent = '▶';
            elements.runButtonText.textContent = 'Run Demo Cycle';
    }
}

// Update Status Dot
function updateStatusDot(status) {
    elements.statusDot.className = `status-dot ${status}`;
    elements.statusText.textContent = status.charAt(0).toUpperCase() + status.slice(1);
}

// Add Log Entry
function addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logHtml = `
        <div class="log-entry fade-in">
            <span class="log-timestamp">${timestamp}</span>
            <span class="log-type ${type}">${type}</span>
            <span class="log-message">${escapeHtml(message)}</span>
        </div>
    `;
    elements.logsContainer.insertAdjacentHTML('beforeend', logHtml);
    elements.logsContainer.scrollTop = elements.logsContainer.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
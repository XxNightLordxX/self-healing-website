// Self-Healing Website Frontend Application

// State Management
const state = {
    status: 'idle',
    progress: null,
    pollInterval: null,
    isRunning: false
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
    console.log('Initializing Self-Healing Website...');
    
    // Setup tab navigation
    setupTabs();
    
    // Check initial status
    await checkStatus();
    
    // Load repository info
    await loadRepositoryInfo();
    
    console.log('Initialization complete');
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

// Check API Status
async function checkStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        elements.tokenStatus.textContent = data.hasToken ? '✓ Configured' : '✗ Not Found';
        elements.tokenStatus.style.color = data.hasToken ? 'var(--success-color)' : 'var(--error-color)';
        
        if (data.progress) {
            updateProgress(data.progress);
        }
        
    } catch (error) {
        console.error('Error checking status:', error);
        elements.tokenStatus.textContent = 'Error';
        elements.tokenStatus.style.color = 'var(--error-color)';
    }
}

// Load Repository Info
async function loadRepositoryInfo() {
    try {
        const response = await fetch('/api/repository');
        const data = await response.json();
        
        if (data.authenticated) {
            elements.authUser.textContent = data.user;
            elements.repoStatus.textContent = data.repository ? '✓ Found' : 'Will be created';
            elements.repoStatus.style.color = data.repository ? 'var(--success-color)' : 'var(--warning-color)';
        } else {
            elements.authUser.textContent = 'Not authenticated';
            elements.repoStatus.textContent = 'Unable to connect';
        }
        
    } catch (error) {
        console.error('Error loading repository info:', error);
        elements.authUser.textContent = 'Error';
        elements.repoStatus.textContent = 'Error';
    }
}

// Run Button Handler
elements.runButton.addEventListener('click', async () => {
    if (state.isRunning) return;
    
    try {
        state.isRunning = true;
        updateButtonState('running');
        updateStatusDot('running');
        
        // Clear previous logs
        elements.logsContainer.innerHTML = '';
        addLog('Starting self-healing cycle...', 'info');
        
        // Start the healing process
        const response = await fetch('/api/run', { method: 'POST' });
        const data = await response.json();
        
        if (data.status === 'running') {
            addLog('Healing cycle initiated', 'success');
            startPolling();
        } else {
            throw new Error(data.error || 'Failed to start healing cycle');
        }
        
    } catch (error) {
        console.error('Error starting healing cycle:', error);
        addLog(`Error: ${error.message}`, 'error');
        updateButtonState('error');
        updateStatusDot('error');
        state.isRunning = false;
    }
});

// Start Polling for Progress Updates
function startPolling() {
    if (state.pollInterval) {
        clearInterval(state.pollInterval);
    }
    
    state.pollInterval = setInterval(async () => {
        try {
            const response = await fetch('/api/progress');
            const progress = await response.json();
            
            updateProgress(progress);
            
            if (progress.status === 'completed' || progress.status === 'error') {
                stopPolling();
                state.isRunning = false;
                
                if (progress.status === 'completed') {
                    updateButtonState('completed');
                    updateStatusDot('completed');
                    addLog('Self-healing cycle completed successfully!', 'success');
                } else {
                    updateButtonState('error');
                    updateStatusDot('error');
                    addLog(`Healing cycle failed: ${progress.error}`, 'error');
                }
                
                elements.lastRun.textContent = new Date().toLocaleTimeString();
            }
            
        } catch (error) {
            console.error('Error polling progress:', error);
        }
    }, 500);
}

// Stop Polling
function stopPolling() {
    if (state.pollInterval) {
        clearInterval(state.pollInterval);
        state.pollInterval = null;
    }
}

// Update Progress UI
function updateProgress(progress) {
    state.progress = progress;
    
    // Update status
    updateStatusDot(progress.status);
    
    // Update counters
    const passed = progress.results ? progress.results.filter(r => r.status === 'passed').length : 0;
    const fixed = progress.results ? progress.results.filter(r => r.status === 'fixed').length : 0;
    const errors = progress.results ? progress.results.filter(r => r.status === 'error').length : 0;
    
    elements.passedCount.textContent = passed;
    elements.fixedStatCount.textContent = fixed;
    elements.errorCount.textContent = errors;
    elements.fixedCount.textContent = fixed;
    
    // Update progress bar
    const percentage = progress.totalItems > 0 
        ? Math.round((progress.currentItem / progress.totalItems) * 100) 
        : 0;
    
    elements.progressBar.style.width = `${percentage}%`;
    elements.progressBar.className = `progress-bar ${progress.status}`;
    
    // Update progress text
    if (progress.status === 'running') {
        elements.progressText.textContent = 
            `Processing item ${progress.currentItem} of ${progress.totalItems} (${percentage}%)`;
    } else if (progress.status === 'completed') {
        elements.progressText.textContent = `Completed! All ${progress.totalItems} items processed.`;
    } else if (progress.status === 'error') {
        elements.progressText.textContent = `Error: ${progress.error || 'Unknown error'}`;
    }
    
    // Update logs
    if (progress.logs && progress.logs.length > 0) {
        updateLogs(progress.logs);
    }
    
    // Update scan results
    if (progress.scanResults) {
        updateScanResults(progress.scanResults);
    }
    
    // Update summary
    if (progress.summary) {
        updateSummary(progress.summary);
    }
}

// Update Button State
function updateButtonState(status) {
    elements.runButton.className = `run-button ${status}`;
    elements.runButton.disabled = status === 'running';
    
    switch (status) {
        case 'running':
            elements.runButtonIcon.innerHTML = '<span class="spinner"></span>';
            elements.runButtonText.textContent = 'Running...';
            break;
        case 'completed':
            elements.runButtonIcon.textContent = '✓';
            elements.runButtonText.textContent = 'Completed - Run Again';
            break;
        case 'error':
            elements.runButtonIcon.textContent = '!';
            elements.runButtonText.textContent = 'Error - Try Again';
            break;
        default:
            elements.runButtonIcon.textContent = '▶';
            elements.runButtonText.textContent = 'Run Self-Healing Cycle';
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

// Update Logs
function updateLogs(logs) {
    // Only add new logs
    const existingLogs = elements.logsContainer.querySelectorAll('.log-entry').length;
    
    if (logs.length > existingLogs) {
        const newLogs = logs.slice(existingLogs);
        newLogs.forEach(log => {
            addLog(log.message, log.type);
        });
    }
}

// Update Scan Results
function updateScanResults(scanResults) {
    // Update directories list
    if (scanResults.directories && scanResults.directories.length > 0) {
        elements.directoriesList.innerHTML = scanResults.directories
            .slice(0, 20)
            .map(dir => `<li>${escapeHtml(dir)}</li>`)
            .join('');
        if (scanResults.directories.length > 20) {
            elements.directoriesList.innerHTML += `<li>... and ${scanResults.directories.length - 20} more</li>`;
        }
    }
    
    // Update files list
    if (scanResults.files && scanResults.files.length > 0) {
        elements.filesCount.textContent = scanResults.files.length;
        elements.filesList.innerHTML = scanResults.files
            .slice(0, 20)
            .map(file => `<li>${escapeHtml(file.path)}</li>`)
            .join('');
        if (scanResults.files.length > 20) {
            elements.filesList.innerHTML += `<li>... and ${scanResults.files.length - 20} more</li>`;
        }
    }
    
    // Update languages list
    if (scanResults.languages) {
        const languages = Object.entries(scanResults.languages);
        elements.languagesCount.textContent = languages.length;
        elements.languagesList.innerHTML = languages
            .map(([lang, count]) => `<li>${escapeHtml(lang)}: ${count} files</li>`)
            .join('');
    }
    
    // Update frameworks list
    if (scanResults.frameworks && scanResults.frameworks.length > 0) {
        elements.frameworksList.innerHTML = scanResults.frameworks
            .map(fw => `<li>${escapeHtml(fw)}</li>`)
            .join('');
    }
}

// Update Summary
function updateSummary(summary) {
    elements.summaryGrid.style.display = 'grid';
    elements.summaryTotal.textContent = summary.totalItems;
    elements.summaryPassed.textContent = summary.passed;
    elements.summaryFixed.textContent = summary.fixed;
    elements.summaryErrors.textContent = summary.failed;
    elements.summaryFiles.textContent = summary.filesScanned;
    elements.summaryLanguages.textContent = summary.languages;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
class WelcomeTerminal {
    constructor() {
        this.terminalInput = document.getElementById('terminalInput');
        this.terminalOutput = document.getElementById('terminalOutput');
        this.cursor = document.getElementById('cursor');
        this.currentStep = 1;
        this.commands = {
            1: 'echo namaste world',
            2: 'cd /Home'
        };
        this.responses = {
            1: 'namaste world & Congrats',
            2: 'Entering LinuxWale homepage...'
        };
        
        this.init();
    }

    init() {
        // Focus on input
        this.terminalInput.focus();
        
        // Add event listeners
        this.terminalInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.terminalInput.addEventListener('input', () => this.updateCursor());
        
        // Show initial prompt
        this.showPrompt();
        
        // Update cursor position
        this.updateCursor();
    }

    showPrompt() {
        const promptMessages = {
            1: 'Type "echo namaste world" to continue:',
            2: 'Type "cd /Home" to enter the site:'
        };
        
        this.addOutputLine('', 'terminal-response');
        this.addOutputLine(promptMessages[this.currentStep], 'terminal-response');
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.processCommand();
        }
    }

    processCommand() {
        const input = this.terminalInput.value.trim();
        const expectedCommand = this.commands[this.currentStep];
        
        // Add the command to output
        this.addOutputLine(`user@linuxwale:~$ ${input}`, 'terminal-command');
        
        if (input === expectedCommand) {
            // Correct command
            this.addOutputLine(this.responses[this.currentStep], 'terminal-response');
            
            if (this.currentStep === 1) {
                // Move to next step
                this.currentStep = 2;
                setTimeout(() => {
                    this.showPrompt();
                    this.clearInput();
                }, 1000);
            } else if (this.currentStep === 2) {
                // Complete - redirect to homepage
                setTimeout(() => {
                    this.redirectToHomepage();
                }, 1500);
            }
        } else {
            // Incorrect command
            this.addOutputLine('Command not found. Please try again.', 'terminal-response error');
            setTimeout(() => {
                this.showPrompt();
                this.clearInput();
            }, 1000);
        }
    }

    addOutputLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = `<span class="${className}">${text}</span>`;
        this.terminalOutput.appendChild(line);
        
        // Scroll to bottom
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }

    clearInput() {
        this.terminalInput.value = '';
        this.terminalInput.focus();
        this.updateCursor();
    }

    updateCursor() {
        // Position cursor after input text
        const inputRect = this.terminalInput.getBoundingClientRect();
        const textWidth = this.getTextWidth(this.terminalInput.value, this.terminalInput);
        this.cursor.style.left = `${textWidth}px`;
    }

    getTextWidth(text, element) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const computedStyle = window.getComputedStyle(element);
        context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
        return context.measureText(text).width;
    }

    redirectToHomepage() {
        // Mark as completed welcome
        localStorage.setItem('linuxwale_welcome_completed', 'true');
        localStorage.setItem('linuxwale_last_visit', Date.now().toString());
        
        // Add transition effect
        const container = document.getElementById('terminalContainer');
        container.style.transition = 'opacity 0.5s ease-out';
        container.style.opacity = '0';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
}

// Auto-timeout after 60 seconds of inactivity
class TerminalTimeout {
    constructor(terminal) {
        this.terminal = terminal;
        this.timeoutDuration = 60000; // 60 seconds
        this.timeoutId = null;
        this.init();
    }

    init() {
        this.resetTimeout();
        
        // Reset timeout on any activity
        document.addEventListener('keydown', () => this.resetTimeout());
        document.addEventListener('click', () => this.resetTimeout());
    }

    resetTimeout() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        
        this.timeoutId = setTimeout(() => {
            this.terminal.addOutputLine('Session timeout. Redirecting to homepage...', 'terminal-response');
            setTimeout(() => {
                this.terminal.redirectToHomepage();
            }, 2000);
        }, this.timeoutDuration);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new WelcomeTerminal();
    new TerminalTimeout(terminal);
    
    // Add some terminal-like effects
    const terminalWindow = document.querySelector('.terminal-window');
    
    // Simulate loading effect
    setTimeout(() => {
        terminalWindow.style.opacity = '0';
        terminalWindow.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            terminalWindow.style.transition = 'all 0.3s ease-out';
            terminalWindow.style.opacity = '1';
            terminalWindow.style.transform = 'scale(1)';
        }, 100);
    }, 100);
});
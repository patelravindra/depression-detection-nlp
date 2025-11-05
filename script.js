window.addEventListener('DOMContentLoaded', () => {
    
    const themeToggle = document.querySelector(".day-night input");
    const body = document.querySelector("body");

    function applyTheme(theme, useTransition) {
        if (useTransition) {
            body.classList.add("toggle");
        }

        if (theme === 'light') {
            body.classList.add("light");
            if (themeToggle) {
                themeToggle.checked = true;
            }
        } else {
            body.classList.remove("light");
            if (themeToggle) {
                themeToggle.checked = false;
            }
        }
        
        if (useTransition) {
            setTimeout(() => {
                body.classList.remove("toggle");
            }, 15); 
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'light'; 
    applyTheme(savedTheme, false);

    if (themeToggle) {
        themeToggle.addEventListener("change", () => {
            const newTheme = themeToggle.checked ? 'light' : 'dark';
            applyTheme(newTheme, true);
            localStorage.setItem('theme', newTheme);
        });
    }

    const analysisForm = document.getElementById('analysis-form');
    const resultText = document.getElementById('result-text');

    if (analysisForm) {
        initializeInputPage();
    } else if (resultText) {
        initializeResultsPage();
    }
});

function initializeInputPage() {
    const form = document.getElementById('analysis-form');
    const submitBtn = document.getElementById('submit-btn');
    const loader = document.getElementById('loader');
    const handleInput = document.getElementById('handle');
    const fileInput = document.getElementById('file-upload');
    const fileName = document.getElementById('file-name');

    if (fileInput && fileName) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileName.textContent = e.target.files[0].name;
                fileName.style.color = 'var(--primary)';
                fileName.style.fontWeight = '600';
            } else {
                fileName.textContent = 'No file chosen';
                fileName.style.color = 'var(--text-color)';
                fileName.style.fontWeight = '400';
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!handleInput.value.trim() || !fileInput.files.length) {
            return;
        }

        showLoadingState(submitBtn, loader);

        setTimeout(() => {
            const result = generateRandomResult();
            sessionStorage.setItem('analysisResult', JSON.stringify(result));

            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'results.html';
            }, 300);

        }, 2500);
    });
}

function showLoadingState(button, loader) {
    button.disabled = true;
    button.style.opacity = '0.6';
    loader.classList.remove('hidden');
    
    setTimeout(() => {
        loader.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

function generateRandomResult() {
    const levels = [
        { level: 'Not Depressed', severity: 0, description: 'No significant indicators of depression detected.' },
        { level: 'Mild Depression', severity: 1, description: 'Some indicators of mild depressive symptoms detected.' },
        { level: 'Moderate Depression', severity: 2, description: 'Moderate indicators of depressive symptoms detected.' },
        { level: 'Moderately Severe Depression', severity: 3, description: 'Significant indicators of depression detected.' },
        { level: 'Severe Depression', severity: 4, description: 'Strong indicators of severe depressive symptoms detected.' }
    ];

    const weights = [0.15, 0.25, 0.30, 0.20, 0.10];
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random <= sum) {
            return levels[i];
        }
    }
    
    return levels[2]; 
}

function initializeResultsPage() {
    const resultData = sessionStorage.getItem('analysisResult');
    
    if (!resultData) {
        window.location.href = 'index.html';
        return;
    }

    const result = JSON.parse(resultData);
    
    const resultTextElement = document.getElementById('result-text');
    const gaugeFill = document.getElementById('gauge-fill');

    if (resultTextElement) {
        resultTextElement.textContent = `Result: ${result.level}`;
        resultTextElement.classList.add(`level-${result.severity}`);
        
        setTimeout(() => {
            resultTextElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                resultTextElement.style.transform = 'scale(1)';
            }, 200);
        }, 100);
    }

    if (gaugeFill) {
        const fillPercentage = ((result.severity + 1) / 5) * 100;
        
        setTimeout(() => {
            gaugeFill.style.width = `${fillPercentage}%`;
        }, 300);

        gaugeFill.classList.add(`level-${result.severity}`);
    }

    const backLink = document.getElementById('back-link');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = backLink.href;
            }, 300);
        });
    }

    setTimeout(() => {
        sessionStorage.removeItem('analysisResult');
    }, 1000);
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const button = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple-effect');
        
        const existingRipple = button.querySelector('.ripple-effect');
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple) {
                ripple.remove();
            }
        }, 600);
    }
});

const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
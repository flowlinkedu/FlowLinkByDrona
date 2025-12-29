// Login Page Handler with Firebase Integration
import authService from './auth.js';

// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });
    
    initializeLoginPage();
});

function initializeLoginPage() {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const googleSignInBtn = document.getElementById('googleSignIn');
    const signupLink = document.getElementById('signupLink');
    
    // Enhanced input focus effects
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
    });

    // Handle email/password login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleEmailLogin();
    });

    // Handle Google sign-in
    googleSignInBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        createEnhancedRipple(e, this, 'rgba(66, 133, 244, 0.3)');
        await handleGoogleLogin();
    });

    // Handle signup link (toggle between login and signup)
    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        toggleSignupMode();
    });

    // Add card entrance animation
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        setTimeout(() => {
            loginCard.style.transform = 'translateY(0)';
            loginCard.style.opacity = '1';
        }, 100);
    }

    // Add button ripple effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.id || this.id !== 'googleSignIn') {
                createRipple(e, this);
            }
        });
    });
}

// Handle email/password authentication
async function handleEmailLogin() {
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const isSignupMode = form.classList.contains('signup-mode');

    // Validate inputs
    if (!authService.validateEmail(email)) {
        showLoginMessage('Please enter a valid email address.', 'error');
        return;
    }

    const passwordValidation = authService.validatePassword(password);
    if (!passwordValidation.isValid) {
        showLoginMessage(passwordValidation.message, 'error');
        return;
    }

    // Add loading state
    form.classList.add('loading');

    try {
        let result;
        if (isSignupMode) {
            result = await authService.createAccount(email, password);
        } else {
            result = await authService.signInWithEmail(email, password);
        }

        if (result.success) {
            showLoginMessage(result.message, 'success');
            // Redirect will be handled by auth state listener
        } else {
            showLoginMessage(result.message, 'error');
        }
    } catch (error) {
        showLoginMessage('An unexpected error occurred. Please try again.', 'error');
        console.error('Authentication error:', error);
    } finally {
        form.classList.remove('loading');
    }
}

// Handle Google authentication
async function handleGoogleLogin() {
    const googleBtn = document.getElementById('googleSignIn');
    
    // Add loading state
    googleBtn.classList.add('loading');
    googleBtn.disabled = true;

    try {
        const result = await authService.signInWithGoogle();
        
        if (result.success) {
            showLoginMessage(result.message, 'success');
            // Redirect will be handled by auth state listener
        } else {
            showLoginMessage(result.message, 'error');
        }
    } catch (error) {
        showLoginMessage('Google sign-in failed. Please try again.', 'error');
        console.error('Google sign-in error:', error);
    } finally {
        googleBtn.classList.remove('loading');
        googleBtn.disabled = false;
    }
}

// Toggle between login and signup modes
function toggleSignupMode() {
    const form = document.getElementById('loginForm');
    const title = document.querySelector('.login-title');
    const subtitle = document.querySelector('.login-subtitle');
    const submitBtn = document.querySelector('.login-btn span');
    const signupLink = document.getElementById('signupLink');
    
    const isSignupMode = form.classList.contains('signup-mode');
    
    if (isSignupMode) {
        // Switch to login mode
        form.classList.remove('signup-mode');
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Sign in to your FlowLink account';
        submitBtn.textContent = 'Sign In';
        signupLink.textContent = 'Create your hierarchy';
    } else {
        // Switch to signup mode
        form.classList.add('signup-mode');
        title.textContent = 'Create Account';
        subtitle.textContent = 'Join FlowLink and start organizing';
        submitBtn.textContent = 'Create Account';
        signupLink.textContent = 'Already have an account?';
    }
}

// Show login messages
function showLoginMessage(message, type = 'info') {
    const existingMessage = document.querySelector('.login-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `login-message login-message-${type}`;
    messageDiv.textContent = message;
    
    const loginCard = document.querySelector('.login-card');
    loginCard.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after delay (except for success messages)
    if (type !== 'success') {
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 4000);
    }
}

// Enhanced ripple effect
function createEnhancedRipple(event, element, color = 'rgba(255, 255, 255, 0.6)') {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - element.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - element.getBoundingClientRect().top - radius}px`;
    circle.style.background = color;
    circle.classList.add('enhanced-ripple');
    
    const ripple = element.querySelector('.enhanced-ripple');
    if (ripple) {
        ripple.remove();
    }
    
    element.appendChild(circle);
    
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Standard ripple effect
function createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - element.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - element.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = element.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }

    element.appendChild(ripple);
    
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Add enhanced styles for login functionality
const loginStyles = `
    .enhanced-ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: enhanced-ripple-animation 0.6s linear;
        pointer-events: none;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes enhanced-ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .input-wrapper.focused .input-icon {
        color: var(--primary-color);
        transform: scale(1.1);
    }

    .input-wrapper.has-value .input-label {
        transform: translateY(-2.5rem) scale(0.85);
        color: var(--primary-color);
    }

    .login-message {
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        text-align: center;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
    }

    .login-message-success {
        background: rgba(34, 197, 94, 0.1);
        color: #059669;
        border: 1px solid rgba(34, 197, 94, 0.2);
    }

    .login-message-error {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
        border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .login-message-info {
        background: rgba(59, 130, 246, 0.1);
        color: #2563eb;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .login-card {
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn.loading {
        pointer-events: none;
        opacity: 0.7;
        position: relative;
    }

    .btn.loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .signup-mode .login-title {
        animation: titleChange 0.3s ease-in-out;
    }

    @keyframes titleChange {
        0% { opacity: 1; transform: translateY(0); }
        50% { opacity: 0; transform: translateY(-10px); }
        100% { opacity: 1; transform: translateY(0); }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loginStyles;
document.head.appendChild(styleSheet);
// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });
});

// Button ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
});

// Enhanced button hover effects
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Flowchart line animation enhancement
document.addEventListener('DOMContentLoaded', function() {
    const lines = document.querySelectorAll('.flow-line');
    
    // Add pulsing effect to lines after they appear
    setTimeout(() => {
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animation += ', linePulse 2s ease-in-out infinite';
            }, index * 500);
        });
    }, 3000);
});

// Add CSS for additional animations
const additionalStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes linePulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.6;
        }
    }

    .btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .feature-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .flow-node {
        transition: all 0.3s ease;
    }

    .flow-node:hover {
        transform: translateX(-50%) scale(1.05);
        box-shadow: 0 8px 25px rgba(41, 171, 226, 0.3);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Smooth scrolling for any future navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Parallax effect for hero background
document.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroHeight = hero.offsetHeight;
    
    if (scrolled < heroHeight) {
        const parallaxSpeed = scrolled * 0.5;
        hero.style.transform = `translateY(${parallaxSpeed}px)`;
    }
});

// Feature cards entrance animation enhancement
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0s';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });
});

// Add CSS for animate-in class
const animateInStyles = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject animate-in styles
const animateStyleSheet = document.createElement('style');
animateStyleSheet.textContent = animateInStyles;
document.head.appendChild(animateStyleSheet);
// Login Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    if (document.body.classList.contains('login-page')) {
        initializeLoginPage();
    }
});

function initializeLoginPage() {
    // Enhanced input focus effects
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        // Add focus glow effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Add typing animation
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
    });
    
    // Enhanced Google button ripple effect
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            createEnhancedRipple(e, this, 'rgba(66, 133, 244, 0.3)');
        });
    }
    
    // Login form submission
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(this);
        });
    }
    
    // Add card entrance animation
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        setTimeout(() => {
            loginCard.style.transform = 'translateY(0)';
            loginCard.style.opacity = '1';
        }, 100);
    }
}

// Enhanced ripple effect for login buttons
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
    
    // Remove ripple after animation
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Handle login form submission
function handleLogin(form) {
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    
    // Add loading state
    form.classList.add('loading');
    
    // Simulate login process
    setTimeout(() => {
        form.classList.remove('loading');
        
        // Here you would typically make an API call
        console.log('Login attempt:', { email, password });
        
        // For demo purposes, show success message
        showLoginMessage('Login successful! Redirecting...', 'success');
        
        // Simulate redirect
        setTimeout(() => {
            // window.location.href = 'index.html';
            console.log('Would redirect to dashboard');
        }, 1500);
        
    }, 2000);
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
    
    // Remove after delay
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Add CSS for enhanced ripple and messages
const loginStyles = `
    .enhanced-ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: enhanced-ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes enhanced-ripple-animation {
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

    .btn-google:hover .google-icon {
        transform: scale(1.1);
        transition: transform 0.3s ease;
    }

    .form-input:focus {
        animation: inputGlow 2s ease-in-out infinite;
    }

    @keyframes inputGlow {
        0%, 100% {
            box-shadow: 0 0 0 4px rgba(41, 171, 226, 0.1);
        }
        50% {
            box-shadow: 0 0 0 4px rgba(41, 171, 226, 0.2);
        }
    }
`;

// Inject login-specific styles
if (document.body.classList.contains('login-page')) {
    const loginStyleSheet = document.createElement('style');
    loginStyleSheet.textContent = loginStyles;
    document.head.appendChild(loginStyleSheet);
}
// Welcome Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains('welcome-page')) {
        initializeWelcomePage();
    }
});

function initializeWelcomePage() {
    let currentStep = 1;
    const totalSteps = 3;
    const formData = {
        organization: '',
        orgType: '',
        session: '',
        sessionType: '',
        categories: []
    };

    // Elements
    const progressFill = document.getElementById('progressFill');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    const hierarchyPreview = document.getElementById('hierarchyPreview');
    const hierarchyTree = document.getElementById('hierarchyTree');
    const previewPlaceholder = hierarchyPreview.querySelector('.preview-placeholder');

    // Initialize
    updateProgressBar();
    setupEventListeners();
    
    function setupEventListeners() {
        // Navigation buttons
        nextBtn.addEventListener('click', nextStep);
        prevBtn.addEventListener('click', prevStep);
        finishBtn.addEventListener('click', finishSetup);
        
        // Form inputs
        document.getElementById('orgName').addEventListener('input', updatePreview);
        document.getElementById('orgType').addEventListener('change', updatePreview);
        document.getElementById('sessionYear').addEventListener('input', updatePreview);
        document.getElementById('sessionType').addEventListener('change', updatePreview);
        
        // Category selection
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                const checkbox = this.querySelector('input[type="checkbox"]');
                const category = this.dataset.category;
                
                checkbox.checked = !checkbox.checked;
                this.classList.toggle('selected', checkbox.checked);
                
                updateCategoriesData();
                updatePreview();
                
                // Add pulse animation to the card
                this.classList.add('pulse');
                setTimeout(() => this.classList.remove('pulse'), 600);
            });
        });
        
        // Checkbox change events
        const categoryCheckboxes = document.querySelectorAll('input[name="categories"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const card = this.closest('.category-card');
                card.classList.toggle('selected', this.checked);
                updateCategoriesData();
                updatePreview();
            });
        });
    }
    
    function nextStep() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                // Hide current step
                const currentStepEl = document.getElementById(`step${currentStep}`);
                currentStepEl.classList.remove('active');
                
                currentStep++;
                
                // Show next step with animation
                setTimeout(() => {
                    const nextStepEl = document.getElementById(`step${currentStep}`);
                    nextStepEl.classList.add('active');
                }, 200);
                
                updateProgressBar();
                updateNavigation();
                updatePreview();
            }
        }
    }
    
    function prevStep() {
        if (currentStep > 1) {
            // Hide current step
            const currentStepEl = document.getElementById(`step${currentStep}`);
            currentStepEl.classList.remove('active');
            
            currentStep--;
            
            // Show previous step with animation
            setTimeout(() => {
                const prevStepEl = document.getElementById(`step${currentStep}`);
                prevStepEl.classList.add('active');
            }, 200);
            
            updateProgressBar();
            updateNavigation();
        }
    }
    
    function validateCurrentStep() {
        switch (currentStep) {
            case 1:
                const orgName = document.getElementById('orgName').value.trim();
                const orgType = document.getElementById('orgType').value;
                
                if (!orgName) {
                    showValidationError('Please enter your organization name');
                    return false;
                }
                if (!orgType) {
                    showValidationError('Please select your organization type');
                    return false;
                }
                
                formData.organization = orgName;
                formData.orgType = orgType;
                break;
                
            case 2:
                const sessionYear = document.getElementById('sessionYear').value.trim();
                const sessionType = document.getElementById('sessionType').value;
                
                if (!sessionYear) {
                    showValidationError('Please enter the year/session');
                    return false;
                }
                if (!sessionType) {
                    showValidationError('Please select the session type');
                    return false;
                }
                
                formData.session = sessionYear;
                formData.sessionType = sessionType;
                break;
                
            case 3:
                updateCategoriesData();
                if (formData.categories.length === 0) {
                    showValidationError('Please select at least one category');
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    function updateCategoriesData() {
        const selectedCategories = [];
        const checkboxes = document.querySelectorAll('input[name="categories"]:checked');
        checkboxes.forEach(checkbox => {
            selectedCategories.push(checkbox.value);
        });
        formData.categories = selectedCategories;
    }
    
    function updateProgressBar() {
        const progressPercentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Update step indicators
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === currentStep) {
                step.classList.add('active');
            } else if (stepNumber < currentStep) {
                step.classList.add('completed');
            }
        });
    }
    
    function updateNavigation() {
        // Previous button
        prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
        
        // Next/Finish button
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            finishBtn.style.display = 'none';
        }
    }
    
    function updatePreview() {
        const hasData = formData.organization || formData.session || formData.categories.length > 0;
        
        if (!hasData) {
            hierarchyTree.style.display = 'none';
            previewPlaceholder.style.display = 'block';
            return;
        }
        
        previewPlaceholder.style.display = 'none';
        hierarchyTree.style.display = 'flex';
        
        // Update root node
        const rootNode = document.getElementById('rootNode');
        const rootText = rootNode.querySelector('.node-text');
        rootText.textContent = formData.organization || 'Organization';
        
        // Show/hide session node
        const sessionConnection = document.getElementById('sessionConnection');
        const sessionNode = document.getElementById('sessionNode');
        
        if (formData.session) {
            sessionConnection.style.display = 'block';
            sessionNode.style.display = 'flex';
            
            const sessionText = sessionNode.querySelector('.node-text');
            sessionText.textContent = formData.session;
            
            // Add pulse animation
            sessionNode.classList.add('pulse');
            setTimeout(() => sessionNode.classList.remove('pulse'), 600);
        } else {
            sessionConnection.style.display = 'none';
            sessionNode.style.display = 'none';
        }
        
        // Update category nodes
        updateCategoryNodes();
    }
    
    function updateCategoryNodes() {
        const categoryConnections = document.getElementById('categoryConnections');
        const categoryNodes = document.getElementById('categoryNodes');
        
        if (formData.categories.length === 0) {
            categoryConnections.style.display = 'none';
            categoryNodes.style.display = 'none';
            return;
        }
        
        categoryConnections.style.display = 'flex';
        categoryNodes.style.display = 'flex';
        
        // Clear existing connections and nodes
        categoryConnections.innerHTML = '';
        categoryNodes.innerHTML = '';
        
        // Create connections
        formData.categories.forEach((category, index) => {
            const connection = document.createElement('div');
            connection.className = 'category-connection';
            connection.style.animationDelay = `${index * 0.1}s`;
            categoryConnections.appendChild(connection);
        });
        
        // Create category nodes
        const categoryIcons = {
            academic: 'fas fa-graduation-cap',
            hostel: 'fas fa-home',
            sports: 'fas fa-trophy',
            skills: 'fas fa-lightbulb'
        };
        
        formData.categories.forEach((category, index) => {
            const node = document.createElement('div');
            node.className = 'tree-node category-node';
            node.style.animationDelay = `${index * 0.1 + 0.2}s`;
            
            const nodeContent = document.createElement('div');
            nodeContent.className = 'node-content';
            
            const icon = document.createElement('i');
            icon.className = categoryIcons[category] || 'fas fa-circle';
            
            const text = document.createElement('span');
            text.className = 'node-text';
            text.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            
            nodeContent.appendChild(icon);
            nodeContent.appendChild(text);
            node.appendChild(nodeContent);
            
            categoryNodes.appendChild(node);
            
            // Add pulse animation
            setTimeout(() => {
                node.classList.add('pulse');
                setTimeout(() => node.classList.remove('pulse'), 600);
            }, index * 100);
        });
    }
    
    function showValidationError(message) {
        // Remove existing error
        const existingError = document.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.textContent = message;
        
        const currentStepEl = document.getElementById(`step${currentStep}`);
        currentStepEl.appendChild(errorDiv);
        
        // Remove error after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
    
    function finishSetup() {
        if (validateCurrentStep()) {
            // Show loading state
            finishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Hierarchy...';
            finishBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                console.log('Hierarchy created:', formData);
                
                // Show success message
                showSuccessMessage();
                
                // Simulate redirect to dashboard
                setTimeout(() => {
                    console.log('Redirecting to dashboard...');
                    // window.location.href = 'dashboard.html';
                }, 2000);
                
            }, 2000);
        }
    }
    
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Hierarchy Created Successfully!</h3>
                <p>Welcome to FlowLink. Redirecting to your dashboard...</p>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        // Animate in
        setTimeout(() => {
            successDiv.classList.add('show');
        }, 100);
    }
}

// Add CSS for validation errors and success message
const welcomeStyles = `
    .validation-error {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
        border: 1px solid rgba(239, 68, 68, 0.2);
        border-radius: 8px;
        padding: 0.75rem 1rem;
        margin-top: 1rem;
        font-size: 0.9rem;
        animation: slideInUp 0.3s ease-out;
    }

    .success-message {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .success-message.show {
        opacity: 1;
    }

    .success-content {
        background: var(--card-color);
        border-radius: 20px;
        padding: 3rem;
        text-align: center;
        max-width: 400px;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }

    .success-message.show .success-content {
        transform: scale(1);
    }

    .success-content i {
        font-size: 4rem;
        color: var(--accent-color);
        margin-bottom: 1rem;
    }

    .success-content h3 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--primary-text);
        margin-bottom: 1rem;
    }

    .success-content p {
        color: var(--secondary-text);
    }

    .category-card.pulse {
        animation: cardPulse 0.6s ease-out;
    }

    @keyframes cardPulse {
        0%, 100% {
            transform: translateY(-2px) scale(1);
        }
        50% {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 12px 30px rgba(41, 171, 226, 0.3);
        }
    }

    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .form-input:invalid {
        border-color: #ef4444;
    }

    .form-input:valid {
        border-color: var(--accent-color);
    }
`;

// Inject welcome-specific styles
if (document.body.classList.contains('welcome-page')) {
    const welcomeStyleSheet = document.createElement('style');
    welcomeStyleSheet.textContent = welcomeStyles;
    document.head.appendChild(welcomeStyleSheet);
}
// Dashboard Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains('dashboard-page')) {
        initializeDashboard();
    }
});

function initializeDashboard() {
    // Elements
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    
    // Initialize
    setupSidebarToggle();
    setupNotifications();
    setupFilters();
    setupCardAnimations();
    
    function setupSidebarToggle() {
        // Mobile menu toggle
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('show');
                mobileOverlay.classList.toggle('show');
                document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
            });
        }
        
        // Mobile overlay click
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function() {
                sidebar.classList.remove('show');
                mobileOverlay.classList.remove('show');
                document.body.style.overflow = '';
            });
        }
        
        // Close sidebar on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
                mobileOverlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    
    function setupNotifications() {
        if (notificationBtn && notificationDropdown) {
            // Toggle notification dropdown
            notificationBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                notificationDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                    notificationDropdown.classList.remove('show');
                }
            });
            
            // Mark all as read
            if (markAllReadBtn) {
                markAllReadBtn.addEventListener('click', function() {
                    const unreadItems = document.querySelectorAll('.notification-item.unread');
                    unreadItems.forEach(item => {
                        item.classList.remove('unread');
                        item.style.animation = 'fadeOut 0.3s ease-out';
                    });
                    
                    // Update badge
                    const badge = document.querySelector('.notification-badge');
                    if (badge) {
                        badge.style.animation = 'fadeOut 0.3s ease-out';
                        setTimeout(() => {
                            badge.style.display = 'none';
                        }, 300);
                    }
                    
                    // Close dropdown
                    setTimeout(() => {
                        notificationDropdown.classList.remove('show');
                    }, 500);
                });
            }
        }
    }
    
    function setupFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filter = this.dataset.filter;
                
                // Apply filter
                applyFilter(filter);
                
                // Add button animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
    
    function applyFilter(filter) {
        const problemItems = document.querySelectorAll('.problem-item');
        const announcementItems = document.querySelectorAll('.announcement-item');
        
        // Filter problems
        problemItems.forEach(item => {
            const priority = item.dataset.priority;
            const shouldShow = filter === 'all' || priority === filter;
            
            if (shouldShow) {
                item.style.display = 'flex';
                item.style.animation = 'slideInUp 0.3s ease-out';
            } else {
                item.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Filter announcements
        announcementItems.forEach(item => {
            const priority = item.dataset.priority;
            const shouldShow = filter === 'all' || priority === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.animation = 'slideInUp 0.3s ease-out';
            } else {
                item.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Update card counts
        updateCardCounts(filter);
    }
    
    function updateCardCounts(filter) {
        const openProblemsCard = document.querySelector('.dashboard-card .card-count');
        const problemItems = document.querySelectorAll('.problem-item:not(.solved)');
        
        let visibleCount = 0;
        problemItems.forEach(item => {
            const priority = item.dataset.priority;
            if (filter === 'all' || priority === filter) {
                visibleCount++;
            }
        });
        
        if (openProblemsCard) {
            openProblemsCard.textContent = `${visibleCount} Active`;
            openProblemsCard.style.animation = 'pulse 0.3s ease-out';
        }
    }
    
    function setupCardAnimations() {
        // Card hover effects
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        dashboardCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Problem item interactions
        const problemItems = document.querySelectorAll('.problem-item');
        problemItems.forEach(item => {
            item.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Simulate opening problem details
                console.log('Opening problem:', this.querySelector('.problem-title').textContent);
            });
        });
        
        // Announcement item interactions
        const announcementItems = document.querySelectorAll('.announcement-item');
        announcementItems.forEach(item => {
            item.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Simulate opening announcement details
                console.log('Opening announcement:', this.querySelector('.announcement-title').textContent);
            });
        });
        
        // Action button interactions
        const actionButtons = document.querySelectorAll('.card-action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Add ripple effect
                createDashboardRipple(e, this);
                
                // Simulate action
                const action = this.textContent.trim();
                console.log('Action clicked:', action);
                
                // Show loading state
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 2000);
            });
        });
    }
    
    function createDashboardRipple(event, element) {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - element.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - element.getBoundingClientRect().top - radius}px`;
        circle.classList.add('dashboard-ripple');
        
        const ripple = element.querySelector('.dashboard-ripple');
        if (ripple) {
            ripple.remove();
        }
        
        element.appendChild(circle);
        
        setTimeout(() => {
            circle.remove();
        }, 600);
    }
    
    // Navigation link interactions
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.parentElement.classList.add('active');
            
            // Update page title
            const pageTitle = document.querySelector('.page-title');
            const navText = this.querySelector('.nav-text').textContent;
            if (pageTitle) {
                pageTitle.textContent = navText;
            }
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
                mobileOverlay.classList.remove('show');
                document.body.style.overflow = '';
            }
            
            console.log('Navigating to:', navText);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Search in problems
            const problemItems = document.querySelectorAll('.problem-item');
            problemItems.forEach(item => {
                const title = item.querySelector('.problem-title').textContent.toLowerCase();
                const category = item.querySelector('.problem-category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || category.includes(searchTerm)) {
                    item.style.display = 'flex';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = searchTerm ? '0.3' : '1';
                }
            });
            
            // Search in announcements
            const announcementItems = document.querySelectorAll('.announcement-item');
            announcementItems.forEach(item => {
                const title = item.querySelector('.announcement-title').textContent.toLowerCase();
                const text = item.querySelector('.announcement-text').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || text.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = searchTerm ? '0.3' : '1';
                }
            });
        });
    }
    
    // Auto-refresh notifications (simulate real-time updates)
    setInterval(() => {
        const badge = document.querySelector('.notification-badge');
        if (badge && Math.random() > 0.95) { // 5% chance every interval
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
            badge.style.animation = 'none';
            setTimeout(() => {
                badge.style.animation = 'badgePulse 2s ease-in-out infinite';
            }, 100);
        }
    }, 10000); // Check every 10 seconds
}

// Dashboard-specific CSS animations
const dashboardStyles = `
    .dashboard-ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: dashboard-ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes dashboard-ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    .dashboard-card {
        animation: slideInUp 0.6s ease-out;
    }

    .nav-link {
        position: relative;
        overflow: hidden;
    }

    .nav-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }

    .nav-link:hover::before {
        left: 100%;
    }

    .card-action-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }

    .problem-item:hover,
    .announcement-item:hover {
        cursor: pointer;
    }

    .search-input::placeholder {
        color: var(--secondary-text);
        opacity: 0.7;
    }
`;

// Inject dashboard-specific styles
if (document.body.classList.contains('dashboard-page')) {
    const dashboardStyleSheet = document.createElement('style');
    dashboardStyleSheet.textContent = dashboardStyles;
    document.head.appendChild(dashboardStyleSheet);
}
// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains('admin-dashboard-page')) {
        initializeAdminDashboard();
    }
});

function initializeAdminDashboard() {
    // Elements
    const adminSidebar = document.getElementById('adminSidebar');
    const adminMobileMenuToggle = document.getElementById('adminMobileMenuToggle');
    const adminMobileOverlay = document.getElementById('adminMobileOverlay');
    const userSearch = document.getElementById('userSearch');
    const roleFilter = document.getElementById('roleFilter');
    const selectAllCheckbox = document.getElementById('selectAll');
    const modalOverlay = document.getElementById('modalOverlay');
    const confirmationModal = document.getElementById('confirmationModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    
    let currentAction = null;
    let currentUserId = null;
    
    // Initialize
    setupAdminSidebar();
    setupUserTable();
    setupModals();
    setupFilters();
    setupAdminActions();
    
    function setupAdminSidebar() {
        // Mobile menu toggle
        if (adminMobileMenuToggle) {
            adminMobileMenuToggle.addEventListener('click', function() {
                adminSidebar.classList.toggle('show');
                adminMobileOverlay.classList.toggle('show');
                document.body.style.overflow = adminSidebar.classList.contains('show') ? 'hidden' : '';
            });
        }
        
        // Mobile overlay click
        if (adminMobileOverlay) {
            adminMobileOverlay.addEventListener('click', function() {
                adminSidebar.classList.remove('show');
                adminMobileOverlay.classList.remove('show');
                document.body.style.overflow = '';
            });
        }
        
        // Navigation links
        const navLinks = document.querySelectorAll('.admin-sidebar .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all nav items
                document.querySelectorAll('.admin-sidebar .nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked item
                this.parentElement.classList.add('active');
                
                // Update page title
                const pageTitle = document.querySelector('.admin-top-bar .page-title');
                const navText = this.querySelector('.nav-text').textContent;
                if (pageTitle) {
                    pageTitle.textContent = navText;
                }
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    adminSidebar.classList.remove('show');
                    adminMobileOverlay.classList.remove('show');
                    document.body.style.overflow = '';
                }
                
                console.log('Admin navigating to:', navText);
            });
        });
    }
    
    function setupUserTable() {
        // Select all checkbox
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                const rowCheckboxes = document.querySelectorAll('.row-checkbox');
                rowCheckboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                    updateRowSelection(checkbox);
                });
            });
        }
        
        // Individual row checkboxes
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateRowSelection(this);
                updateSelectAllState();
            });
        });
        
        // Table row hover effects
        const tableRows = document.querySelectorAll('.table-row');
        tableRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(8px)';
                this.style.boxShadow = '0 4px 20px rgba(41, 226, 208, 0.15)';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
                this.style.boxShadow = 'none';
            });
        });
        
        // Action buttons
        setupActionButtons();
    }
    
    function setupActionButtons() {
        // Make Admin buttons
        const makeAdminBtns = document.querySelectorAll('.action-btn.make-admin');
        makeAdminBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const userId = this.closest('.table-row').dataset.userId;
                const userName = this.closest('.table-row').querySelector('.user-name').textContent;
                
                showConfirmationModal(
                    'Make Administrator',
                    `Are you sure you want to make ${userName} an administrator?`,
                    'make-admin',
                    userId
                );
            });
        });
        
        // Remove Admin buttons
        const removeAdminBtns = document.querySelectorAll('.action-btn.remove-admin');
        removeAdminBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const userId = this.closest('.table-row').dataset.userId;
                const userName = this.closest('.table-row').querySelector('.user-name').textContent;
                
                showConfirmationModal(
                    'Remove Administrator',
                    `Are you sure you want to remove administrator privileges from ${userName}?`,
                    'remove-admin',
                    userId
                );
            });
        });
        
        // Edit buttons
        const editBtns = document.querySelectorAll('.action-btn.edit');
        editBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const userId = this.closest('.table-row').dataset.userId;
                console.log('Edit user:', userId);
                
                // Add loading animation
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-edit"></i>';
                }, 1000);
            });
        });
        
        // Delete buttons
        const deleteBtns = document.querySelectorAll('.action-btn.delete');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const userId = this.closest('.table-row').dataset.userId;
                const userName = this.closest('.table-row').querySelector('.user-name').textContent;
                
                showConfirmationModal(
                    'Delete User',
                    `Are you sure you want to permanently delete ${userName}? This action cannot be undone.`,
                    'delete-user',
                    userId
                );
            });
        });
    }
    
    function updateRowSelection(checkbox) {
        const row = checkbox.closest('.table-row');
        if (checkbox.checked) {
            row.style.background = 'linear-gradient(135deg, rgba(41, 226, 208, 0.1), rgba(41, 171, 226, 0.1))';
            row.style.borderLeft = '4px solid var(--accent-color)';
        } else {
            row.style.background = '';
            row.style.borderLeft = '';
        }
    }
    
    function updateSelectAllState() {
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
        
        if (selectAllCheckbox) {
            if (checkedBoxes.length === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (checkedBoxes.length === rowCheckboxes.length) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            } else {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }
    }
    
    function setupModals() {
        // Close modal events
        [modalClose, modalCancel, modalOverlay].forEach(element => {
            if (element) {
                element.addEventListener('click', function(e) {
                    if (e.target === this) {
                        hideConfirmationModal();
                    }
                });
            }
        });
        
        // Confirm button
        if (modalConfirm) {
            modalConfirm.addEventListener('click', function() {
                executeAction(currentAction, currentUserId);
                hideConfirmationModal();
            });
        }
        
        // ESC key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
                hideConfirmationModal();
            }
        });
    }
    
    function showConfirmationModal(title, message, action, userId) {
        currentAction = action;
        currentUserId = userId;
        
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        
        // Update modal icon based on action
        const modalIcon = document.getElementById('modalIcon');
        const iconElement = modalIcon.querySelector('i');
        
        switch (action) {
            case 'make-admin':
                iconElement.className = 'fas fa-user-plus';
                modalIcon.style.background = 'rgba(41, 226, 208, 0.1)';
                iconElement.style.color = 'var(--accent-color)';
                break;
            case 'remove-admin':
                iconElement.className = 'fas fa-user-minus';
                modalIcon.style.background = 'rgba(245, 158, 11, 0.1)';
                iconElement.style.color = '#d97706';
                break;
            case 'delete-user':
                iconElement.className = 'fas fa-exclamation-triangle';
                modalIcon.style.background = 'rgba(239, 68, 68, 0.1)';
                iconElement.style.color = '#dc2626';
                break;
        }
        
        modalOverlay.classList.add('show');
        
        // Focus trap
        setTimeout(() => {
            modalConfirm.focus();
        }, 300);
    }
    
    function hideConfirmationModal() {
        modalOverlay.classList.remove('show');
        currentAction = null;
        currentUserId = null;
    }
    
    function executeAction(action, userId) {
        const row = document.querySelector(`[data-user-id="${userId}"]`);
        const roleBadge = row.querySelector('.role-badge');
        const actionButtons = row.querySelector('.action-buttons');
        
        switch (action) {
            case 'make-admin':
                // Update role badge with animation
                roleBadge.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    roleBadge.className = 'role-badge admin';
                    roleBadge.textContent = 'Administrator';
                    roleBadge.style.transform = 'scale(1)';
                    
                    // Update action buttons
                    const makeAdminBtn = actionButtons.querySelector('.make-admin');
                    const removeAdminBtn = document.createElement('button');
                    removeAdminBtn.className = 'action-btn remove-admin';
                    removeAdminBtn.title = 'Remove Admin';
                    removeAdminBtn.innerHTML = '<i class="fas fa-user-minus"></i>';
                    
                    actionButtons.replaceChild(removeAdminBtn, makeAdminBtn);
                    
                    // Re-attach event listener
                    removeAdminBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const userId = this.closest('.table-row').dataset.userId;
                        const userName = this.closest('.table-row').querySelector('.user-name').textContent;
                        
                        showConfirmationModal(
                            'Remove Administrator',
                            `Are you sure you want to remove administrator privileges from ${userName}?`,
                            'remove-admin',
                            userId
                        );
                    });
                    
                    // Update row data
                    row.dataset.role = 'admin';
                    
                }, 300);
                
                showSuccessMessage('User promoted to administrator successfully!');
                updateStats('admin', 1);
                break;
                
            case 'remove-admin':
                // Update role badge with animation
                roleBadge.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    roleBadge.className = 'role-badge user';
                    roleBadge.textContent = 'Student';
                    roleBadge.style.transform = 'scale(1)';
                    
                    // Update action buttons
                    const removeAdminBtn = actionButtons.querySelector('.remove-admin');
                    const makeAdminBtn = document.createElement('button');
                    makeAdminBtn.className = 'action-btn make-admin';
                    makeAdminBtn.title = 'Make Admin';
                    makeAdminBtn.innerHTML = '<i class="fas fa-user-plus"></i>';
                    
                    actionButtons.replaceChild(makeAdminBtn, removeAdminBtn);
                    
                    // Re-attach event listener
                    makeAdminBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const userId = this.closest('.table-row').dataset.userId;
                        const userName = this.closest('.table-row').querySelector('.user-name').textContent;
                        
                        showConfirmationModal(
                            'Make Administrator',
                            `Are you sure you want to make ${userName} an administrator?`,
                            'make-admin',
                            userId
                        );
                    });
                    
                    // Update row data
                    row.dataset.role = 'user';
                    
                }, 300);
                
                showSuccessMessage('Administrator privileges removed successfully!');
                updateStats('admin', -1);
                break;
                
            case 'delete-user':
                // Animate row removal
                row.style.animation = 'slideOutRight 0.5s ease-out forwards';
                setTimeout(() => {
                    row.remove();
                    updateStats('total', -1);
                    showSuccessMessage('User deleted successfully!');
                }, 500);
                break;
        }
    }
    
    function setupFilters() {
        // Search functionality
        if (userSearch) {
            userSearch.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                filterTable();
            });
        }
        
        // Role filter
        if (roleFilter) {
            roleFilter.addEventListener('change', function() {
                filterTable();
            });
        }
        
        // Node selector
        const nodeSelect = document.getElementById('nodeSelect');
        if (nodeSelect) {
            nodeSelect.addEventListener('change', function() {
                console.log('Node changed to:', this.value);
                // Simulate loading new data
                showLoadingState();
                setTimeout(() => {
                    hideLoadingState();
                    showSuccessMessage(`Switched to ${this.options[this.selectedIndex].text}`);
                }, 1500);
            });
        }
    }
    
    function filterTable() {
        const searchTerm = userSearch ? userSearch.value.toLowerCase() : '';
        const roleFilter = document.getElementById('roleFilter').value;
        const rows = document.querySelectorAll('.table-row');
        
        rows.forEach(row => {
            const userName = row.querySelector('.user-name').textContent.toLowerCase();
            const userEmail = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const userRole = row.dataset.role;
            
            const matchesSearch = userName.includes(searchTerm) || userEmail.includes(searchTerm);
            const matchesRole = roleFilter === 'all' || userRole === roleFilter;
            
            if (matchesSearch && matchesRole) {
                row.style.display = '';
                row.style.animation = 'slideInUp 0.3s ease-out';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    function setupAdminActions() {
        // Add User button
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', function() {
                console.log('Add new user');
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-user-plus"></i> Add User';
                    this.disabled = false;
                    showSuccessMessage('User creation form opened!');
                }, 2000);
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                console.log('Export data');
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-download"></i> Export';
                    this.disabled = false;
                    showSuccessMessage('Data exported successfully!');
                }, 2000);
            });
        }
    }
    
    function updateStats(type, change) {
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach(card => {
            const statNumber = card.querySelector('.stat-number');
            const statLabel = card.querySelector('.stat-label').textContent.toLowerCase();
            
            if ((type === 'admin' && statLabel.includes('administrator')) ||
                (type === 'total' && statLabel.includes('total'))) {
                
                const currentValue = parseInt(statNumber.textContent.replace(',', ''));
                const newValue = currentValue + change;
                
                // Animate number change
                statNumber.style.transform = 'scale(1.2)';
                statNumber.style.color = 'var(--accent-color)';
                
                setTimeout(() => {
                    statNumber.textContent = newValue.toLocaleString();
                    statNumber.style.transform = 'scale(1)';
                    statNumber.style.color = 'var(--primary-text)';
                }, 300);
            }
        });
    }
    
    function showLoadingState() {
        const tableWrapper = document.querySelector('.table-wrapper');
        tableWrapper.style.opacity = '0.5';
        tableWrapper.style.pointerEvents = 'none';
        
        // Add loading spinner
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        tableWrapper.appendChild(loadingDiv);
    }
    
    function hideLoadingState() {
        const tableWrapper = document.querySelector('.table-wrapper');
        const loadingOverlay = tableWrapper.querySelector('.loading-overlay');
        
        tableWrapper.style.opacity = '1';
        tableWrapper.style.pointerEvents = 'auto';
        
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }
    
    function showSuccessMessage(message) {
        // Remove existing message
        const existingMessage = document.querySelector('.admin-success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create success message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'admin-success-message';
        messageDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Animate in
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 3000);
    }
}

// Admin Dashboard specific CSS animations
const adminDashboardStyles = `
    .loading-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-color);
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--primary-color);
        z-index: 100;
    }

    .loading-overlay i {
        font-size: 1.2rem;
        color: var(--accent-color);
    }

    .admin-success-message {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-family: var(--font-heading);
        font-weight: 600;
        z-index: 2000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .admin-success-message.show {
        transform: translateX(0);
        opacity: 1;
    }

    .admin-success-message i {
        font-size: 1.2rem;
    }

    @keyframes slideOutRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .role-badge {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .action-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .table-row {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-number {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .admin-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }

    @media (max-width: 768px) {
        .admin-success-message {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            transform: translateY(-100px);
        }

        .admin-success-message.show {
            transform: translateY(0);
        }
    }
`;

// Inject admin dashboard specific styles
if (document.body.classList.contains('admin-dashboard-page')) {
    const adminDashboardStyleSheet = document.createElement('style');
    adminDashboardStyleSheet.textContent = adminDashboardStyles;
    document.head.appendChild(adminDashboardStyleSheet);
}
// Admin Add Problem Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains('admin-add-problem-page')) {
        initializeAdminAddProblemPage();
    }
});

function initializeAdminAddProblemPage() {
    // Elements
    const adminProblemForm = document.getElementById('adminProblemForm');
    const backBtn = document.getElementById('backBtn');
    const submitBtn = document.getElementById('submitBtn');
    const successModalOverlay = document.getElementById('successModalOverlay');
    const createAnotherBtn = document.getElementById('createAnotherBtn');
    const viewDashboardBtn = document.getElementById('viewDashboardBtn');
    
    // Form inputs
    const problemTitle = document.getElementById('problemTitle');
    const problemDescription = document.getElementById('problemDescription');
    const targetNode = document.getElementById('targetNode');
    
    // Initialize
    setupFormValidation();
    setupInputAnimations();
    setupFormSubmission();
    setupSuccessModal();
    setupNavigation();
    
    function setupFormValidation() {
        // Real-time validation for inputs
        const inputs = [problemTitle, problemDescription, targetNode];
        
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', function() {
                    validateInput(this);
                });
                
                input.addEventListener('blur', function() {
                    validateInput(this);
                });
            }
        });
        
        // Visibility option validation
        const visibilityOptions = document.querySelectorAll('input[name="visibility"]');
        visibilityOptions.forEach(option => {
            option.addEventListener('change', function() {
                // Add selection animation
                const label = this.nextElementSibling;
                animateSelection(label);
            });
        });
    }
    
    function validateInput(input) {
        const isValid = input.checkValidity() && input.value.trim() !== '';
        const container = input.closest('.input-container');
        
        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            container.classList.remove('error');
            container.classList.add('success');
        } else {
            input.classList.remove('valid');
            container.classList.remove('success');
            
            if (input.value.trim() !== '') {
                input.classList.add('invalid');
                container.classList.add('error');
            } else {
                input.classList.remove('invalid');
                container.classList.remove('error');
            }
        }
    }
    
    function setupInputAnimations() {
        // Enhanced focus animations
        const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                const container = this.closest('.input-container');
                container.classList.add('focused');
                
                // Add focus glow effect
                this.style.boxShadow = '0 0 0 4px rgba(41, 226, 208, 0.1), 0 8px 25px rgba(41, 226, 208, 0.15)';
            });
            
            input.addEventListener('blur', function() {
                const container = this.closest('.input-container');
                container.classList.remove('focused');
                
                // Remove focus glow
                this.style.boxShadow = '';
            });
            
            // Typing animation effect
            input.addEventListener('input', function() {
                const container = this.closest('.input-container');
                if (this.value.length > 0) {
                    container.classList.add('has-content');
                } else {
                    container.classList.remove('has-content');
                }
            });
        });
    }
    
    function setupFormSubmission() {
        if (adminProblemForm) {
            adminProblemForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission();
            });
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleFormSubmission();
            });
        }
    }
    
    function handleFormSubmission() {
        if (!validateForm()) {
            return;
        }
        
        const formData = collectFormData();
        
        // Show loading state
        showLoadingState();
        
        // Simulate API call
        setTimeout(() => {
            console.log('Problem created:', formData);
            hideLoadingState();
            showSuccessModal();
        }, 2000);
    }
    
    function validateForm() {
        let isValid = true;
        
        // Validate required fields
        const requiredInputs = [problemTitle, problemDescription, targetNode];
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                validateInput(input);
                isValid = false;
            }
        });
        
        // Check if visibility option is selected
        const visibilitySelected = document.querySelector('input[name="visibility"]:checked');
        if (!visibilitySelected) {
            showNotification('Please select a visibility option', 'error');
            isValid = false;
        }
        
        if (!isValid) {
            // Scroll to first error
            const firstError = document.querySelector('.invalid, .error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Shake the submit button
            shakeButton(submitBtn);
        }
        
        return isValid;
    }
    
    function collectFormData() {
        return {
            title: problemTitle.value.trim(),
            description: problemDescription.value.trim(),
            targetNode: targetNode.value,
            visibility: document.querySelector('input[name="visibility"]:checked')?.value,
            timestamp: new Date().toISOString(),
            createdBy: 'admin'
        };
    }
    
    function showLoadingState() {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Change button content
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        if (btnText) btnText.textContent = 'Creating...';
        if (btnIcon) btnIcon.className = 'fas fa-spinner btn-icon';
    }
    
    function hideLoadingState() {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Restore button content
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        if (btnText) btnText.textContent = 'Create Problem';
        if (btnIcon) btnIcon.className = 'fas fa-plus-circle btn-icon';
    }
    
    function setupSuccessModal() {
        if (createAnotherBtn) {
            createAnotherBtn.addEventListener('click', function() {
                hideSuccessModal();
                resetForm();
            });
        }
        
        if (viewDashboardBtn) {
            viewDashboardBtn.addEventListener('click', function() {
                hideSuccessModal();
                // Simulate navigation to dashboard
                console.log('Navigating to dashboard...');
                // window.location.href = 'admin-dashboard.html';
            });
        }
        
        // Close modal on overlay click
        if (successModalOverlay) {
            successModalOverlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    hideSuccessModal();
                }
            });
        }
        
        // Close modal on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && successModalOverlay.classList.contains('show')) {
                hideSuccessModal();
            }
        });
    }
    
    function showSuccessModal() {
        successModalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            viewDashboardBtn.focus();
        }, 500);
    }
    
    function hideSuccessModal() {
        successModalOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    function setupNavigation() {
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (hasUnsavedChanges()) {
                    if (confirm('You have unsaved changes. Are you sure you want to go back?')) {
                        window.history.back();
                    }
                } else {
                    window.history.back();
                }
            });
        }
    }
    
    function hasUnsavedChanges() {
        return problemTitle.value.trim() !== '' || 
               problemDescription.value.trim() !== '' || 
               targetNode.value !== '';
    }
    
    function resetForm() {
        adminProblemForm.reset();
        
        // Remove validation classes
        document.querySelectorAll('.valid, .invalid').forEach(el => {
            el.classList.remove('valid', 'invalid');
        });
        
        document.querySelectorAll('.success, .error').forEach(el => {
            el.classList.remove('success', 'error');
        });
        
        document.querySelectorAll('.has-content').forEach(el => {
            el.classList.remove('has-content');
        });
        
        // Reset to default visibility option
        const defaultVisibility = document.getElementById('visibilityPublic');
        if (defaultVisibility) {
            defaultVisibility.checked = true;
        }
    }
    
    function animateSelection(element) {
        element.style.transform = 'scale(0.98)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
    
    function shakeButton(button) {
        button.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            button.style.animation = '';
        }, 500);
    }
    
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.admin-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
}

// Admin Add Problem Page specific CSS animations
const adminAddProblemStyles = `
    .input-container.focused .input-focus-line {
        width: 100%;
    }

    .input-container.success .form-input,
    .input-container.success .form-textarea,
    .input-container.success .form-select {
        border-color: #10b981;
    }

    .input-container.error .form-input,
    .input-container.error .form-textarea,
    .input-container.error .form-select {
        border-color: #ef4444;
    }

    .form-input.valid,
    .form-textarea.valid,
    .form-select.valid {
        border-color: #10b981;
    }

    .form-input.invalid,
    .form-textarea.invalid,
    .form-select.invalid {
        border-color: #ef4444;
    }

    .admin-notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-family: var(--font-heading);
        font-weight: 600;
        z-index: 2000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
    }

    .admin-notification.show {
        transform: translateX(0);
        opacity: 1;
    }

    .admin-notification.success {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
    }

    .admin-notification.error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
    }

    .admin-notification.info {
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        color: white;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-content i {
        font-size: 1.2rem;
        flex-shrink: 0;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .visibility-label {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .input-container.has-content .form-input,
    .input-container.has-content .form-textarea {
        background: rgba(41, 226, 208, 0.02);
    }

    @media (max-width: 768px) {
        .admin-notification {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            transform: translateY(-100px);
            max-width: none;
        }

        .admin-notification.show {
            transform: translateY(0);
        }
    }
`;

// Inject admin add problem specific styles
if (document.body.classList.contains('admin-add-problem-page')) {
    const adminAddProblemStyleSheet = document.createElement('style');
    adminAddProblemStyleSheet.textContent = adminAddProblemStyles;
    document.head.appendChild(adminAddProblemStyleSheet);
}
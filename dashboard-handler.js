// Dashboard Handler - Manages dashboard-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains('dashboard-page')) {
        initializeDashboardHandler();
    }
});

function initializeDashboardHandler() {
    // Initialize dashboard components
    setupMobileMenu();
    setupNotificationDropdown();
    setupFilterButtons();
    setupSearchFunctionality();
    setupCardInteractions();
    
    console.log('Dashboard handler initialized');
}

function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (mobileMenuToggle && sidebar && mobileOverlay) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            mobileOverlay.classList.toggle('show');
            document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
        });
        
        mobileOverlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            mobileOverlay.classList.remove('show');
            document.body.style.overflow = '';
        });
    }
}

function setupNotificationDropdown() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationDropdown.classList.remove('show');
            }
        });
    }
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value and apply
            const filter = this.dataset.filter;
            applyFilter(filter);
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
            item.style.opacity = '1';
        } else {
            item.style.opacity = '0.3';
        }
    });
    
    // Filter announcements
    announcementItems.forEach(item => {
        const priority = item.dataset.priority;
        const shouldShow = filter === 'all' || priority === filter;
        
        if (shouldShow) {
            item.style.display = 'block';
            item.style.opacity = '1';
        } else {
            item.style.opacity = '0.3';
        }
    });
}

function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Search in problems
            const problemItems = document.querySelectorAll('.problem-item');
            problemItems.forEach(item => {
                const title = item.querySelector('.problem-title')?.textContent.toLowerCase() || '';
                const category = item.querySelector('.problem-category')?.textContent.toLowerCase() || '';
                
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
                const title = item.querySelector('.announcement-title')?.textContent.toLowerCase() || '';
                const text = item.querySelector('.announcement-text')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || text.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = searchTerm ? '0.3' : '1';
                }
            });
        });
    }
}

function setupCardInteractions() {
    // Card hover effects
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Action button interactions
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            console.log('Action clicked:', action);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Card action button interactions
    const cardActionButtons = document.querySelectorAll('.card-action-btn');
    cardActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            console.log('Card action clicked:', action);
            
            // Add visual feedback
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px) scale(1)';
            }, 150);
        });
    });
}

// Export functions for use in other scripts
window.dashboardHandler = {
    applyFilter,
    setupMobileMenu,
    setupNotificationDropdown,
    setupFilterButtons,
    setupSearchFunctionality,
    setupCardInteractions
};
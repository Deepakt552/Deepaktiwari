// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const navLinks = document.querySelector('nav div');
    const navHeight = document.querySelector('header').offsetHeight;
    
    // Highlight active section in the navigation
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('text-green-400');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('text-green-400');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // Handle form submission
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form values
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill all the fields');
                return;
            }
            
            // Here you would normally send the form data to a server
            // For now, just show a success message
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Terminal-style Project Tabs Functionality
    const projectTabs = document.querySelectorAll('.project-tab');
    const projectViews = document.querySelectorAll('.project-view');
    let autoRotateInterval; // For automatic cycling
    let currentProjectIndex = 0;

    // Function to switch projects when tab is clicked
    function switchProject(projectId, withAnimation = true) {
        // Remove active class from all tabs and hide all views
        projectTabs.forEach(tab => {
            tab.classList.remove('active', 'text-green-400', 'border-b-2', 'border-green-400');
        });
        
        // Hide current view with fade-out effect
        projectViews.forEach(view => {
            if (!view.classList.contains('hidden') && withAnimation) {
                // Apply fade-out animation
                view.style.opacity = '0';
                view.style.transform = 'translateY(10px)';
                
                // After animation, hide the element
                setTimeout(() => {
                    view.classList.add('hidden');
                    view.style.opacity = '';
                    view.style.transform = '';
                }, 200);
            } else {
                view.classList.add('hidden');
            }
        });
        
        // Add active class to selected tab
        const selectedTab = document.querySelector(`.project-tab[data-project="${projectId}"]`);
        const selectedView = document.getElementById(`${projectId}-view`);
        
        if (selectedTab && selectedView) {
            selectedTab.classList.add('active', 'text-green-400', 'border-b-2', 'border-green-400');
            
            // Update current project index for auto-rotation
            currentProjectIndex = Array.from(projectTabs).findIndex(tab => tab === selectedTab);
            
            // Show selected view with animation
            setTimeout(() => {
                selectedView.classList.remove('hidden');
                
                if (withAnimation) {
                    // Apply fade-in animation
                    selectedView.style.opacity = '0';
                    selectedView.style.transform = 'translateY(10px)';
                    
                    // Trigger reflow
                    selectedView.offsetHeight;
                    
                    // Apply fade-in animation
                    selectedView.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    selectedView.style.opacity = '1';
                    selectedView.style.transform = 'translateY(0)';
                    
                    // Clear transition after animation completes
                    setTimeout(() => {
                        selectedView.style.transition = '';
                    }, 300);
                }
            }, withAnimation ? 200 : 0);
            
            // Reset data attributes for typing effect on all pre elements
            document.querySelectorAll('.project-view pre').forEach(pre => {
                delete pre.dataset.originalContent;
            });
            
            // Add slight delay to ensure DOM updates before typing effect
            setTimeout(addTypingEffect, withAnimation ? 500 : 100);
        }
    }

    // Auto rotate through projects
    function startAutoRotate() {
        // Clear existing interval if any
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
        
        autoRotateInterval = setInterval(() => {
            // Calculate next project index
            const nextIndex = (currentProjectIndex + 1) % projectTabs.length;
            const nextProjectId = projectTabs[nextIndex].getAttribute('data-project');
            
            // Switch to next project
            switchProject(nextProjectId);
        }, 10000); // Change project every 10 seconds
    }

    // Stop auto rotation on user interaction
    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    // Add click event to tabs
    projectTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            stopAutoRotate(); // Stop auto rotation when user clicks
            const projectId = this.getAttribute('data-project');
            switchProject(projectId);
            
            // Restart auto-rotation after user interaction
            setTimeout(startAutoRotate, 20000); // Wait 20 seconds before starting auto-rotation again
        });
    });

    // Terminal cursor blinking effect
    function setupTerminalCursor() {
        const cursor = document.querySelector('.terminal-footer .text-green-400');
        if (cursor) {
            // Already has animation from CSS, but we can enhance it here if needed
        }
    }

    // Handle keyboard navigation (Tab key)
    document.addEventListener('keydown', function(e) {
        // Only do this when terminal-style carousel is in viewport
        const terminalCarousel = document.querySelector('.terminal-style-carousel');
        if (!terminalCarousel) return;
        
        const rect = terminalCarousel.getBoundingClientRect();
        const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        if (isInViewport && e.key === 'Tab') {
            e.preventDefault();
            stopAutoRotate(); // Stop auto rotation on keyboard navigation
            
            // Find the index of the active tab
            let activeIndex = Array.from(projectTabs).findIndex(tab => tab.classList.contains('active'));
            
            // If no active tab found, set to first tab
            if (activeIndex === -1) activeIndex = 0;
            
            // Calculate next tab index (cycle through tabs)
            const nextIndex = (activeIndex + 1) % projectTabs.length;
            
            // Get the project ID of the next tab
            const nextProjectId = projectTabs[nextIndex].getAttribute('data-project');
            
            // Switch to the next project
            switchProject(nextProjectId);
            
            // Restart auto-rotation after user interaction
            setTimeout(startAutoRotate, 20000);
        }
    });

    // Add typing animation effect to terminal
    function addTypingEffect() {
        const activeView = document.querySelector('.project-view:not(.hidden)');
        if (!activeView) return;
        
        const preElement = activeView.querySelector('pre');
        if (!preElement) return;
        
        // Store original content
        if (!preElement.dataset.originalContent) {
            preElement.dataset.originalContent = preElement.innerHTML;
            
            // Initially clear the content
            const originalContent = preElement.dataset.originalContent;
            preElement.innerHTML = '';
            
            // Type out the content character by character
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < originalContent.length) {
                    preElement.innerHTML += originalContent.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 10); // Adjust speed as needed
        }
    }

    // Initialize the first project with typing effect
    setTimeout(() => {
        addTypingEffect();
        setupTerminalCursor();
        startAutoRotate(); // Start auto rotation after initial load
    }, 1000);

    // Add terminal command history effect
    const commandHistory = [
        'cd ~/projects',
        'ls -la',
        'git status',
        'npm start'
    ];

    function displayCommandHistory() {
        const footer = document.querySelector('.terminal-footer');
        if (footer) {
            const historyElement = document.createElement('div');
            historyElement.classList.add('command-history', 'text-xs', 'text-gray-500', 'overflow-hidden');
            historyElement.style.maxHeight = '0';
            historyElement.style.transition = 'max-height 0.3s ease';
            
            const commandList = document.createElement('ul');
            commandHistory.forEach(cmd => {
                const item = document.createElement('li');
                item.textContent = `$ ${cmd}`;
                commandList.appendChild(item);
            });
            
            historyElement.appendChild(commandList);
            footer.parentNode.insertBefore(historyElement, footer);
            
            // Show command history when hovering over terminal footer
            footer.addEventListener('mouseenter', () => {
                historyElement.style.maxHeight = '100px';
            });
            
            footer.addEventListener('mouseleave', () => {
                historyElement.style.maxHeight = '0';
            });
        }
    }

    // Initialize command history effect
    setTimeout(displayCommandHistory, 1500);

    // Intersection Observer to pause auto-rotation when not in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoRotate(); // Resume auto-rotation when in viewport
            } else {
                stopAutoRotate(); // Pause auto-rotation when out of viewport
            }
        });
    }, { threshold: 0.3 }); // Trigger when at least 30% of the element is visible

    // Observe the terminal carousel
    const carousel = document.querySelector('.terminal-style-carousel');
    if (carousel) {
        observer.observe(carousel);
    }
}); 
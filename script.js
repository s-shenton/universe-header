document.addEventListener('DOMContentLoaded', function() {
    const content = document.querySelector('.content');
    let lastScrollTop = 0;

    // Send height to parent
    function reportHeight() {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ type: 'height-update', height: height }, '*');
    }
    
    // Report height initially and when window is resized
    reportHeight();
    window.addEventListener('resize', reportHeight);
    
    // Make links work properly in Rise
    document.querySelectorAll('a').forEach(link => {
        link.setAttribute('target', '_blank');
    });
    
    // Fix for iOS Safari's 100vh issue
    function adjustMobileHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // For very short screens, ensure content is at least as tall as window
        if (document.body.scrollHeight < window.innerHeight) {
            document.querySelector('.parallax-container').style.minHeight = `${window.innerHeight}px`;
        }
    }
    
    // Call it initially and on resize
    adjustMobileHeight();
    window.addEventListener('resize', adjustMobileHeight);
    
    // Check if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Improve scrolling performance on mobile
    if (isMobile) {
        // Add touch handling for smoother mobile experience
        let touchStartY = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        // Prevent overscrolling on iOS
        document.body.addEventListener('touchmove', function(e) {
            const parallaxContainer = document.querySelector('.parallax-container');
            const isAtTop = parallaxContainer.scrollTop === 0;
            const isAtBottom = parallaxContainer.scrollHeight - parallaxContainer.scrollTop === parallaxContainer.clientHeight;
            
            if ((isAtTop && e.touches[0].clientY > touchStartY) || 
                (isAtBottom && e.touches[0].clientY < touchStartY)) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // Listen for messages from Rise
    window.addEventListener('message', function(event) {
        // If Rise tells us to scroll to a specific position
        if (event.data && event.data.scrollTo) {
            window.scrollTo({
                top: event.data.scrollTo,
                behavior: 'smooth'
            });
        }
    });
});
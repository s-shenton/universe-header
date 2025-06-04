document.addEventListener('DOMContentLoaded', function() {
    const content = document.querySelector('.content');
    let lastScrollTop = 0;

    // Fix mobile viewport height issues more aggressively
    function fixMobileViewport() {
        // This fixes the iOS/mobile 100vh issue
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Force full height on the container
        const container = document.querySelector('.parallax-container');
        container.style.height = `${window.innerHeight}px`;
        
        // Report correct height to parent iframe
        window.parent.postMessage({ 
            type: 'height-update', 
            height: Math.max(document.body.scrollHeight, window.innerHeight)
        }, '*');
    }
    
    // Call viewport fixes on load, resize, and orientation change
    fixMobileViewport();
    window.addEventListener('resize', fixMobileViewport);
    window.addEventListener('orientationchange', function() {
        // Wait a moment after orientation change before recalculating
        setTimeout(fixMobileViewport, 100);
    });
    
    // Make links work properly in Rise
    document.querySelectorAll('a').forEach(link => {
        link.setAttribute('target', '_blank');
    });
    
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
    
    // Additional fix for mobile - recheck height after all content is loaded
    window.addEventListener('load', function() {
        fixMobileViewport();
        // And again after a slight delay to be sure everything is rendered
        setTimeout(fixMobileViewport, 200);
    });
});
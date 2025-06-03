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
});
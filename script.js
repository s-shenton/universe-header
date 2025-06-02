document.addEventListener('DOMContentLoaded', function() {
    var parallaxBg1 = document.getElementById('parallax-bg1');
    var parallaxBg2 = document.getElementById('parallax-bg2');

    window.addEventListener('scroll', function() {
        var scrollPosition = window.pageYOffset;
        var windowHeight = window.innerHeight;
        
        // Adjust this value to control when the fade starts
        var fadeStart = windowHeight * 0.1; // Start at 25% of viewport height
        
        // Adjust this value to control how quickly the fade happens
        var fadeLength = windowHeight * 0.3; // Fade over 50% of viewport height
        
        var opacity = (scrollPosition - fadeStart) / fadeLength;
        opacity = Math.min(Math.max(opacity, 0), 1);  // Clamp between 0 and 1
        
        parallaxBg2.style.opacity = opacity;
    });
});
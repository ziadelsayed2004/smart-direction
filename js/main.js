(function ($) {
    "use strict";
    
    // Enable lazy loading for all images
    function enableLazyLoading() {
        // Get all images except those in the preloader
        const images = document.querySelectorAll('img:not(.preloader-logo),(.portfolio-item)');
        
        // Create an Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load the image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    // Add loaded class when image is loaded
                    img.onload = function() {
                        img.classList.add('loaded');
                        img.style.filter = 'blur(0)';
                    };
                    
                    // Stop observing this image
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observe each image
        images.forEach(img => {
            // Store original src in data-src
            if (img.src) {
                img.dataset.src = img.src;
                // Set a tiny placeholder
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
            }
            
            // Add loading="lazy" attribute
            img.setAttribute('loading', 'lazy');
            
            // Add initial blur effect
            img.style.transition = 'filter 0.3s ease-in-out';
            img.style.filter = 'blur(10px)';
            
            // Start observing
            imageObserver.observe(img);
        });
    }
    
    // Call the function when DOM is ready
    $(document).ready(function() {
        enableLazyLoading();
    });
    
    // Initiate the wowjs
    new WOW().init();
    
    
    // Back to top button
    $(document).ready(function () {
        const $backToTop = $('.back-to-top');
        const $circle = document.querySelector('.progress-ring__circle');
        const radius = $circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        $circle.style.strokeDasharray = `${circumference} ${circumference}`;
        $circle.style.strokeDashoffset = circumference;

        function setProgress(percent) {
            const offset = circumference - (percent / 100) * circumference;
            $circle.style.strokeDashoffset = offset;
        }

        $(window).on('scroll', function () {
            const scrollTop = $(this).scrollTop();
            const docHeight = $(document).height();
            const winHeight = $(window).height();
            const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

            // Show/hide button
            if (scrollTop > 200) {
                $backToTop.fadeIn('slow');
            } else {
                $backToTop.fadeOut('slow');
            }

            // Animate progress ring
            setProgress(scrollPercent);
        });

        $backToTop.on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 1000, 'swing'); // guaranteed to work
        });
    });
    
    
    
    // Smooth sticky nav transition
    window.addEventListener('scroll', function() {
        const navBar = document.querySelector('.nav-bar');
        if (!navBar) return;
        
        // Add transition properties to nav-bar with smoother timing
        navBar.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        let lastScrollY = window.scrollY;
        let animationFrame;
        
        function animateNavBar(targetY, startY, duration = 300) {
            const startTime = performance.now();
            
            function updateNavBar(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smoother easing function for natural animation
                const easeProgress = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                const currentY = startY + (targetY - startY) * easeProgress;
                
                navBar.style.transform = `translateY(${currentY}px)`;
                
                if (progress < 1) {
                    animationFrame = requestAnimationFrame(updateNavBar);
                }
            }
            
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            animationFrame = requestAnimationFrame(updateNavBar);
        }
        
        // Check window width and set appropriate scroll threshold
        const scrollThreshold = window.innerWidth <= 991.98 ? 100 : 120;
        
        if (window.scrollY > scrollThreshold) {
            // Create a spacer div if it doesn't exist
            let spacer = document.querySelector('.nav-spacer');
            if (!spacer) {
                spacer = document.createElement('div');
                spacer.className = 'nav-spacer';
                spacer.style.height = navBar.offsetHeight + 'px';
                spacer.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                navBar.parentNode.insertBefore(spacer, navBar.nextSibling);
            }
            
            navBar.classList.add('nav-sticky');
            animateNavBar(0, -10);
            navBar.style.opacity = '1';
            navBar.style.visibility = 'visible';
        } else {
            navBar.classList.remove('nav-sticky');
            
            // Remove spacer when nav is not sticky
            const spacer = document.querySelector('.nav-spacer');
            if (spacer) {
                spacer.style.height = '0';
                setTimeout(() => {
                    if (spacer && spacer.parentNode) {
                        spacer.parentNode.removeChild(spacer);
                    }
                }, 300);
            }
            
            if (window.scrollY === 0 || window.scrollY <= scrollThreshold) {
                const currentY = parseInt(navBar.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
                animateNavBar(0, currentY);
                navBar.style.opacity = '1';
                navBar.style.visibility = 'visible';
            } else {
                const currentY = parseInt(navBar.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
                animateNavBar(-10, currentY);
                navBar.style.opacity = '0';
                
                setTimeout(() => {
                    if (window.scrollY > 0 && window.scrollY <= scrollThreshold) {
                        navBar.style.visibility = 'hidden';
                    }
                }, 300);
            }
        }
        
        lastScrollY = window.scrollY;
    });
    
    
    // jQuery counterUp
    $('[data-toggle="counter-up"]').counterUp({
        delay: 200,
        time: 2000
    });
    
    
    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    
    // Blogs carousel
    $(document).ready(function () {
        // Detect direction from body class
        var isRtl = $("body").hasClass("rtl");
    
        // Initialize OwlCarousel with RTL support
        $(".related-slider").owlCarousel({
            autoplay: true,
            loop: true,
            dots: false,
            nav: true,
            rtl: isRtl,
            navText: isRtl
                ? [
                    '<i class="fa fa-angle-right" aria-hidden="true"></i>',
                    '<i class="fa fa-angle-left" aria-hidden="true"></i>'
                ]
                : [
                    '<i class="fa fa-angle-left" aria-hidden="true"></i>', 
                    '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                ],
            responsive: {
                0: {
                    items: 1
                },
                576: {
                    items: 1
                },
                768: {
                    items: 2
                }
            }
        });
    });
    
    
    
    $(document).ready(function () {
        var itemsToShow = 3;
        var currentFilter = '*';
        var $container = $('.portfolio-container');
        var $btn = $('.load-more .btn');
        var isExpanded = false;
    
        var portfolioIsotope = $container.isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });
    
        function showItems(filter, expand = false) {
            var $allItems = $container.find('.portfolio-item');
            var $filteredItems = (filter === '*') ? $allItems : $allItems.filter(filter);
    
            if (expand) {
                $allItems.hide();
                $filteredItems.show();
                $btn.text('View Less');
                isExpanded = true;
            } else {
                $allItems.hide();
                $filteredItems.slice(0, itemsToShow).show();
                if ($filteredItems.length <= itemsToShow) {
                    $btn.hide();
                } else {
                    $btn.show().text('Load More');
                }
                isExpanded = false;
            }
    
            portfolioIsotope.isotope('layout');
        }
    
        $('#portfolio-flters li').on('click', function () {
            $('#portfolio-flters li').removeClass('filter-active');
            $(this).addClass('filter-active');
            currentFilter = $(this).data('filter');
            showItems(currentFilter, false);
        });
    
        $btn.on('click', function (e) {
            e.preventDefault();
            if (isExpanded) {
                showItems(currentFilter, false);
            } else {
                showItems(currentFilter, true);
            }
        });
    
        showItems(currentFilter);
    });
    
    $('.collapse').on('show.bs.collapse', function () {
        $('.collapse').not(this).collapse('hide');
    });
    
})(jQuery);

{ // NAV CLICK
    $('#menu-toggle').on('click', function() {
        $(this).toggleClass('active');
    });
    
    
}

{ // TAP CLICK
$('.service-item').each(function() {
    const $item = $(this);
    const $tapIcon = $item.find('.tap-indicator');
    
    $item.on('click', function() {
        if ($tapIcon.length) $tapIcon.hide();
    });
    
    $item.on('mouseenter', function() {
        if ($tapIcon.length) $tapIcon.hide();
    });
    
    $item.on('mouseleave', function() {
        if ($tapIcon.length) $tapIcon.show();
    });
});
}

{ // ISO SLIDER
    const $slidesWrapper = $('.about-img .slides-wrapper');
    const $slides = $('.about-img .slide');
    const $prevBtn = $('.prev');
    const $nextBtn = $('.next');
    const isRTL = $('body').hasClass('rtl');
    
    let currentIndex = 0;
    let interval;
    
    function showSlide(index) {
        if (index >= $slides.length) index = 0;  
        if (index < 0) index = $slides.length - 1; 
        currentIndex = index;
        const offset = -index * 100; 
        $slidesWrapper.css('transform', `translateX(${isRTL ? -offset : offset}%)`);
    }
    
    function nextSlide() {
        if(currentIndex === 2) {  
            showSlide(0); 
        } else {
            showSlide(currentIndex + 1); 
        }
    }
    
    function prevSlide() {
        if(currentIndex === 0) { 
            showSlide(2);
        } else {
            showSlide(currentIndex - 1);
        }    
    }
    
    function startAutoplay() {
        interval = setInterval(() => {
            if(currentIndex === 2) {  
                showSlide(0);
            } else {
                showSlide(currentIndex + 1); 
            }
        }, 2500); 
    }
    
    function stopAutoplay() {
        clearInterval(interval);
    }
    
    $nextBtn.on('click', function() {
        stopAutoplay();  
        nextSlide();     
        startAutoplay(); 
    });
    
    $prevBtn.on('click', function() {
        stopAutoplay();  
        prevSlide();    
        startAutoplay();
    });
    
    showSlide(0);       
    startAutoplay();  

}

{ // PARTNERS SLIDER 
    const $container = $('#sliderContainer');
    const $track = $('#sliderTrack');
    let isDown = false;
    let startX;
    let scrollLeft;
    let scrollSpeed = 2;
    const isRTL = $container.css('direction') === 'rtl';
    
    let autoScroll;
    
    function startAutoScroll() {
        if (autoScroll) return;
        autoScroll = setInterval(() => {
            $container.scrollLeft($container.scrollLeft() + (isRTL ? -scrollSpeed : scrollSpeed));
            const maxScroll = $track.width() / 2;
    
            if (!isRTL && $container.scrollLeft() >= maxScroll) {
                $container.scrollLeft(0);
            } else if (isRTL && $container.scrollLeft() <= 0) {
                $container.scrollLeft(maxScroll);
            }
        }, 16);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScroll);
        autoScroll = null;
    }
    
    $container.on('mousedown', function(e) {
        isDown = true;
        scrollSpeed = 1.5;
        startX = e.pageX - $container.offset().left;
        scrollLeft = $container.scrollLeft();
    });
    
    $container.on('mouseup mouseleave', function() {
        isDown = false;
        scrollSpeed = 2;
    });
    
    $container.on('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - $container.offset().left;
        const walk = (x - startX) * 1.5;
        $container.scrollLeft(scrollLeft - walk);
    });
    
    $container.on('touchstart', function(e) {
        isDown = true;
        scrollSpeed = 1.5;
        startX = e.touches[0].pageX - $container.offset().left;
        scrollLeft = $container.scrollLeft();
    });
    
    $container.on('touchend', function() {
        isDown = false;
        scrollSpeed = 2;
    });
    
    $container.on('touchmove', function(e) {
        if (!isDown) return;
        const x = e.touches[0].pageX - $container.offset().left;
        const walk = (x - startX) * 1.5;
        $container.scrollLeft(scrollLeft - walk);
    });
    
    $container.on('mouseenter', function() {
        scrollSpeed = 1;
    });
    
    $container.on('mouseleave', function() {
        scrollSpeed = 2;
    });
    
    startAutoScroll();
}
    
{ //TOGGLE ?
    $(document).ready(function() {
        $('.toggle-overlay').on('click', function() {
            const $container = $(this).closest('.service-item, .portfolio-item');
            const overlaySelector = $container.hasClass('service-item') ? '.service-overlay' : '.portfolio-overlay';
            const $overlay = $container.find(overlaySelector);
            const isActive = $overlay.hasClass('active');
    
            $(overlaySelector).removeClass('active');
            $('.toggle-overlay i').removeClass('fa-circle-xmark').addClass('fa-info');
    
            if (!isActive) {
                $overlay.addClass('active');
                $(this).find('i').removeClass('fa-info').addClass('fa-circle-xmark');
            }
        });
    });
    
}

{ // VIDEO
    let player;
    let lastTime = 0;
    const $btnPlay = $(".btn-play");
    const $videoWrapper = $(".embed-responsive");
    let userIsSeeking = false;

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('yt-player', {
            height: '360',
            width: '640',
            videoId: '_BWlj35lCAM',
            playerVars: {
                autoplay: 0,
                modestbranding: 1,
                rel: 0,
                controls: 1,
                showinfo: 0,
                fs: 0,
                iv_load_policy: 3,
                disablekb: 0
            },
            events: {
                onReady: function() {},
                onStateChange: function(event) {
                    if (event.data === YT.PlayerState.ENDED) {
                        $videoWrapper.hide();
                        $btnPlay.show();
                    }
                }
            }
        });
    }

    // Load YouTube API script
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    // Play Button
    $btnPlay.on("click", function() {
        $videoWrapper.show();
        $btnPlay.hide();

        if (player && player.playVideo) {
            player.seekTo(lastTime);
            player.playVideo();
        }
    });

    // Detect Pause by user (but ignore if it's from seeking)
    let lastCheckTime = 0;

    setInterval(() => {
        if (player && player.getPlayerState) {
            const state = player.getPlayerState();
            const currentTime = player.getCurrentTime();
    
            // Detect if user is seeking (sudden jump in time)
            if (Math.abs(currentTime - lastCheckTime) > 1.5) {
                userIsSeeking = true;
                setTimeout(() => userIsSeeking = false, 1500);
            }
    
            lastCheckTime = currentTime;
    
            if (state === YT.PlayerState.PAUSED && !userIsSeeking) {
                lastTime = currentTime;
                $videoWrapper.hide();
                $btnPlay.show();
            }
        }
    }, 500);

    // Detect seeking (click or touch)
    const startSeeking = () => {
        userIsSeeking = true;
        setTimeout(() => userIsSeeking = false, 1000);
    };

    $(document).on('mousedown touchstart', '#yt-player', function() {
        startSeeking();
    });
}


window.addEventListener('DOMContentLoaded', () => {
    // Function to calculate and set carousel height
    function setCarouselHeight() {
        const isMobile = window.innerWidth <= 991.98;
        const heightReduction = isMobile ? 120 : 250;
        const usableHeight = window.innerHeight - heightReduction;
        document.documentElement.style.setProperty('--carousel-height', usableHeight + 'px');
    }

    // Set initial height
    setCarouselHeight();

    // Update height on window resize
    window.addEventListener('resize', setCarouselHeight);
});

// Isolated Preloader
$(document).ready(function() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Set initial styles
        preloader.style.transition = 'all 0.8s cubic-bezier(.4,0,.2,1)';
        preloader.style.opacity = '1';
        preloader.style.transform = 'scale(1)';
        
        // Force a reflow to ensure the transition works
        preloader.offsetHeight;
        
        // Start the fade out after a delay
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transform = 'scale(1.1)';
            
            // Remove preloader after animation completes
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       MOBILE MENU
       ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.innerHTML = nav.classList.contains('active') ? '&times;' : '&#9776;';
        });
        
        // Close menu when clicking links
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.innerHTML = '&#9776;';
            });
        });
    }

    /* =========================================
       PLAYGROUND LOGIC
       ========================================= */
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const previewImage = document.getElementById('preview-image');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const loadingState = document.getElementById('loading-state');
    const resultImage = document.getElementById('result-image');
    const resultPlaceholder = document.getElementById('result-placeholder');
    const downloadBtn = document.getElementById('download-btn');
    
    // Upload Handler
    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--primary)';
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.style.borderColor = 'var(--border)';
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--border)';
            if (e.dataTransfer.files.length) {
                handleFile(e.dataTransfer.files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFile(e.target.files[0]);
            }
        });
    }
    
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
            uploadZone.querySelector('.upload-placeholder').classList.add('hidden');
            generateBtn.removeAttribute('disabled');
        };
        reader.readAsDataURL(file);
    }
    
    // Generate Handler
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';
            
            // Show loading
            resultPlaceholder.classList.add('hidden');
            resultImage.classList.add('hidden');
            loadingState.classList.remove('hidden');
            
            // Simulate processing (2.5 seconds)
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            // Show Result (Using one of the gallery images as mock result)
            // In a real app, this would be the response from the API
            const mockResult = 'images/gallery-1.jpg';
            
            const img = new Image();
            img.onload = () => {
                loadingState.classList.add('hidden');
                resultImage.src = mockResult;
                resultImage.classList.remove('hidden');
                downloadBtn.removeAttribute('disabled');
                generateBtn.textContent = 'Generate';
                generateBtn.removeAttribute('disabled');
            };
            img.src = mockResult;
        });
    }
    
    // Reset Handler
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            previewImage.src = '';
            previewImage.classList.add('hidden');
            uploadZone.querySelector('.upload-placeholder').classList.remove('hidden');
            fileInput.value = '';
            generateBtn.setAttribute('disabled', 'true');
            
            resultImage.classList.add('hidden');
            resultPlaceholder.classList.remove('hidden');
            downloadBtn.setAttribute('disabled', 'true');
            loadingState.classList.add('hidden');
        });
    }
    
    // Download Handler
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            const url = resultImage.src;
            if (!url) return;
            
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = blobUrl;
                a.download = 'z-image-result.jpg';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            } catch (e) {
                console.error('Download failed', e);
                // Fallback for simple images
                const a = document.createElement('a');
                a.href = url;
                a.download = 'z-image-result.jpg';
                a.target = '_blank';
                a.click();
            }
        });
    }

    /* =========================================
       FAQ ACCORDION
       ========================================= */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close others
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    /* =========================================
       MODALS
       ========================================= */
    const openButtons = document.querySelectorAll('[data-modal-target]');
    const closeButtons = document.querySelectorAll('[data-modal-close]');
    
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    }
    
    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-modal-target');
            openModal(target);
        });
    });
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-modal-close');
            closeModal(target);
        });
    });
    
    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    /* =========================================
       SCROLL ANIMATION
       ========================================= */
    
    // Inject required styles for scroll animations (fixes orphaned classes)
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .fade-in { 
            opacity: 0; 
            transform: translateY(20px); 
            transition: opacity 0.6s ease-out, transform 0.6s ease-out; 
        }
        .visible { 
            opacity: 1; 
            transform: translateY(0); 
        }
    `;
    document.head.appendChild(animationStyles);

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in'); // Add base class via JS to avoid hiding content if JS fails
        observer.observe(section);
    });
});
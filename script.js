document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // Theme Toggle Logic
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    
    // Default is dark mode. If light is saved, apply it.
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    // ==========================================
    // Mobile Navigation Menu
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = navLinks.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ==========================================
    // Smooth Scrolling & Active Nav States
    // ==========================================
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Subtract nav height + some offset for earlier trigger
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // ==========================================
    // Back to Top Button
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================
    // Scroll Reveal Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // Form Submission (Front-end only)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show alert
            formAlert.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Hide alert after 5 seconds
            setTimeout(() => {
                formAlert.style.display = 'none';
            }, 5000);
        });
    }

    // ==========================================
    // Add Project — Modal & Dynamic Cards
    // ==========================================
    const addProjectBtn  = document.getElementById('add-project-btn');
    const projectModal   = document.getElementById('project-modal');
    const modalClose     = document.getElementById('modal-close');
    const modalCancel    = document.getElementById('modal-cancel');
    const addProjectForm = document.getElementById('add-project-form');
    const projectsGrid   = document.getElementById('projects-grid');

    // --- Helpers ---
    function openModal() {
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('proj-title').focus();
    }

    function closeModal() {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
        addProjectForm.reset();
    }

    // --- Build card HTML ---
    function buildProjectCard(data) {
        const techTags = data.tech
            ? data.tech.split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('')
            : '';

        const linkBtn = data.link
            ? `<a href="${data.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="width:100%;justify-content:center;">
                 <i class="fab fa-github"></i> View on GitHub
               </a>`
            : `<span class="btn btn-outline" style="width:100%;justify-content:center;opacity:.5;cursor:default;">No Link Added</span>`;

        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-header">
                <span class="project-category">${data.category}</span>
                <span class="project-icon"><i class="fas fa-code"></i></span>
            </div>
            <div class="project-body">
                <h3>${data.title}</h3>
                <p>${data.desc}</p>
                <div class="project-tech">${techTags}</div>
                ${linkBtn}
            </div>`;
        return card;
    }

    // --- Persist to localStorage ---
    function saveProjects(projects) {
        localStorage.setItem('rana_projects', JSON.stringify(projects));
    }

    function loadProjects() {
        return JSON.parse(localStorage.getItem('rana_projects') || '[]');
    }

    // --- Load saved projects on page load ---
    const addCard = document.getElementById('add-project-btn');
    loadProjects().forEach(data => {
        const card = buildProjectCard(data);
        projectsGrid.insertBefore(card, addCard);
    });

    // --- Event Listeners ---
    addProjectBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);

    // Close on backdrop click
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) closeModal();
    });

    // --- Form Submit ---
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title    = document.getElementById('proj-title').value.trim();
        const category = document.getElementById('proj-category').value.trim();
        const desc     = document.getElementById('proj-desc').value.trim();
        const tech     = document.getElementById('proj-tech').value.trim();
        const link     = document.getElementById('proj-link').value.trim();

        if (!title || !category || !desc) return;

        const data = { title, category, desc, tech, link };

        // Build & insert new card before the "+" card
        const card = buildProjectCard(data);
        card.classList.add('reveal', 'active'); // animate in
        projectsGrid.insertBefore(card, addCard);

        // Save to localStorage
        const saved = loadProjects();
        saved.push(data);
        saveProjects(saved);

        closeModal();
    });
});

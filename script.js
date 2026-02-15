document.addEventListener('DOMContentLoaded', () => {
    // --- Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter');
    const titles = [
        'Electrical & Computer Engineer',
        'IT Support Specialist',
        'Electrical Engineer',
        'Website Developer'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const type = () => {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    };

    if (typewriterElement) type();

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.querySelector('.nav-links');
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // --- Reveal on Scroll ---
    const revealElements = document.querySelectorAll('.animate-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Skill Bars Animation ---
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress;
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // --- Active Link Highlight (Scroll Spy) ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    // Function to set active link
    const setActiveLink = (id) => {
        navItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    // Click handler for immediate feedback
    navItems.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const id = href.substring(1);
                setActiveLink(id);
            }
        });
    });

    // Scroll event listener for fluid highlighting
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // Offset for navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            setActiveLink(currentSectionId);
        }
    });

    // --- Back to Top Button ---
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Theme Toggle (Day/Night Mode) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');

        // Check for saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');

            if (themeIcon) {
                if (isLight) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                    localStorage.setItem('theme', 'light');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                    localStorage.setItem('theme', 'dark');
                }
            }
        });
    }

    // --- AI Supporter Widget ---
    const aiChat = document.getElementById('ai-chat');
    const closeAi = document.getElementById('close-ai');
    const aiIcon = document.querySelector('.ai-icon');
    const aiSend = document.getElementById('ai-send');
    const aiInput = document.getElementById('ai-input-field');
    const aiMessages = document.getElementById('ai-messages');
    let welcomeTriggered = false;

    aiIcon.addEventListener('click', () => {
        aiChat.classList.toggle('active');
        if (aiChat.classList.contains('active')) {
            aiInput.focus();
            if (!welcomeTriggered) {
                welcomeTriggered = true;
                setTimeout(() => {
                    addMessage("Hello! I'm Gedam's AI Supporter. I can tell you about his projects, services, or how to contact him. What's on your mind?", 'ai');
                }, 500);
            }
        }
    });

    closeAi.addEventListener('click', (e) => {
        e.stopPropagation();
        aiChat.classList.remove('active');
    });

    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.classList.add('msg', sender);
        msg.innerText = text;
        aiMessages.appendChild(msg);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    };

    const handleAiResponse = (userText) => {
        const input = userText.toLowerCase();
        let response = "I'm not exactly sure about that, but Gedam is always expanding his expertise! 🚀 Would you like to see his projects or get his contact info instead?";

        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            response = "Hello! I'm Gedam's digital assistant. How can I help you navigate his portfolio today? 😊";
        } else if (input.includes('service') || input.includes('what can you do') || input.includes('offer')) {
            response = "Gedam provides top-tier services in:\n• CCTV & Security Systems 🔐\n• IT Support & Networking 🌐\n• Web Development 💻\n• Video Editing 🎬\nCheck the Services section for details!";
        } else if (input.includes('project') || input.includes('work') || input.includes('portfolio')) {
            response = "Gedam has some impressive projects! 🛠️ From **CCTV Installations** to **Computer Networking** and **Web Design**. You can find them all in the Projects section above.";
        } else if (input.includes('contact') || input.includes('email') || input.includes('phone') || input.includes('reach') || input.includes('hire')) {
            response = "You can reach Gedam directly at **gedu0194@gmail.com** or call him at **+25119210849**. He's looking forward to hearing from you!";
        } else if (input.includes('experience') || input.includes('skill') || input.includes('background') || input.includes('who is')) {
            response = "Gedam Mekuria is an **Electrical & Computer Engineer** with over 2 years of IT experience. He's an expert in hardware maintenance, networking, and security systems. 👔";
        } else if (input.includes('cctv') || input.includes('camera') || input.includes('security')) {
            response = "Security is one of Gedam's core specialties! 🎥 He designs and installs professional CCTV systems and security alarms for both residential and commercial clients.";
        } else if (input.includes('website') || input.includes('web') || input.includes('coding') || input.includes('design')) {
            response = "Gedam builds responsive, modern websites (like the one you're on!) using the latest tech. 🌐 Need a site for your business or project?";
        } else if (input.includes('network') || input.includes('wifi') || input.includes('it support')) {
            response = "Gedam is a networking pro! 📡 He handles everything from basic WiFi setups to complex office networks and server maintenance.";
        } else if (input.includes('video') || input.includes('edit') || input.includes('creative')) {
            response = "Beyond technical skills, Gedam is also a talented **Video Editor**. 🎬 He can help bring your visual stories to life with professional editing.";
        } else if (input.includes('thank') || input.includes('cool') || input.includes('great')) {
            response = "You're very welcome! Let me know if you have any other questions about Gedam's work. 🚀";
        }

        setTimeout(() => {
            const typingMsg = document.createElement('div');
            typingMsg.classList.add('msg', 'ai', 'typing');
            typingMsg.innerText = "...";
            aiMessages.appendChild(typingMsg);
            aiMessages.scrollTop = aiMessages.scrollHeight;

            setTimeout(() => {
                aiMessages.removeChild(typingMsg);
                addMessage(response, 'ai');
            }, 800);
        }, 300);
    };

    aiSend.addEventListener('click', () => {
        const text = aiInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            aiInput.value = '';
            handleAiResponse(text);
        }
    });

    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            aiSend.click();
        }
    });

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');

    if (contactForm && contactMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // Clear previous messages
            contactMessage.textContent = '';
            contactMessage.className = 'contact-message';

            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Change URL to your production backend when deployed
                const response = await fetch('/api/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    contactMessage.textContent = result.message || 'Message sent successfully!';
                    contactMessage.classList.add('success');
                    contactForm.reset();

                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        contactMessage.className = 'contact-message';
                    }, 5000);
                } else {
                    const errorResult = await response.json();
                    contactMessage.textContent = errorResult.message || 'Failed to send message. Please try again.';
                    contactMessage.classList.add('error');
                    console.error('Server error:', errorResult);
                }
            } catch (error) {
                contactMessage.textContent = 'Unable to connect to server. Please ensure the backend is running.';
                contactMessage.classList.add('error');
                console.error('Fetch error:', error);
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Project Modal Logic ---
    const projectModal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const projectLinks = document.querySelectorAll('.project-link, .service-link');

    const openModal = (id) => {
        const details = document.getElementById(`details-${id}`);
        if (details) {
            modalBody.innerHTML = details.innerHTML;
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    };

    const closeModal = () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalBody.innerHTML = '';
        }, 400); // Wait for transition
    };

    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('data-project') || link.getAttribute('data-service');
            if (id) {
                const finalId = link.hasAttribute('data-service') ? `service-${id}` : id;
                openModal(finalId);
            }
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
            closeModal();
        }
    });
});


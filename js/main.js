// Initialize AOS
const isMobile = window.innerWidth <= 768;
AOS.init({
    duration: isMobile ? 600 : 1000,
    once: true,
    offset: isMobile ? 50 : 100
});

// EmailJS initialization
(function() {
    emailjs.init("YOUR_PUBLIC_KEY");
    console.log('EmailJS initialized');
})();

// Enhanced Contact Form with EmailJS
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    console.log('Contact form found:', contactForm);
    
    if (!contactForm) {
        console.error('Contact form not found! Check the form ID.');
        return;
    }

    const submitBtn = contactForm.querySelector('.submit-btn');
    const formControls = contactForm.querySelectorAll('.form-control');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');

    // Add ripple effect to form controls
    formControls.forEach(control => {
        control.addEventListener('focus', createRipple);
        control.addEventListener('blur', () => control.classList.add('touched'));
    });

    function createRipple(e) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    }

    // Set current year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }


    // Form submission with EmailJS
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            submitBtn.classList.add('loading');
            const btnText = submitBtn.querySelector('span');
            const btnIcon = submitBtn.querySelector('i');
            const originalText = btnText.textContent;
            
            btnText.textContent = 'Sending...';
            btnIcon.className = 'fas fa-spinner fa-spin';

            // Get form data
            const formData = {
                from_name: document.getElementById('name').value,
                to_name: "Ahmed",
                message: document.getElementById('message').value,
                reply_to: document.getElementById('email').value
            };
            
            console.log('Attempting to send email with data:', formData);

            // Send email using EmailJS
            const response = await emailjs.sendForm('service_id', 'template_id', contactForm);
            console.log('Email sent successfully:', response);
            
            // Success state
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            btnText.textContent = 'Sent!';
            btnIcon.className = 'fas fa-check';
            
            showMessage(successMessage);
            
            // Reset form with animation
            formControls.forEach(control => {
                control.style.transform = 'translateX(-10px)';
                control.style.opacity = '0';
                setTimeout(() => {
                    control.value = '';
                    control.classList.remove('touched');
                    control.style.transform = '';
                    control.style.opacity = '';
                }, 300);
            });

            // Reset button
            setTimeout(() => {
                submitBtn.classList.remove('success');
                btnText.textContent = originalText;
                btnIcon.className = 'fas fa-paper-plane';
            }, 2000);

        } catch (error) {
            console.error('EmailJS Error:', error);
            
            // Error state
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('error');
            btnText.textContent = 'Error!';
            btnIcon.className = 'fas fa-times';
            
            showMessage(errorMessage);

            setTimeout(() => {
                submitBtn.classList.remove('error');
                btnText.textContent = originalText;
                btnIcon.className = 'fas fa-paper-plane';
            }, 2000);
        }
    });

    function validateForm() {
        let isValid = true;
        formControls.forEach(control => {
            if (!control.value.trim()) {
                isValid = false;
                showError(control);
            } else if (control.type === 'email' && !validateEmail(control.value)) {
                isValid = false;
                showError(control);
            }
        });
        return isValid;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(control) {
        control.classList.add('error');
        control.addEventListener('input', function removeError() {
            control.classList.remove('error');
            control.removeEventListener('input', removeError);
        });
    }

    function showMessage(messageEl) {
        messageEl.classList.add('show');
        setTimeout(() => messageEl.classList.remove('show'), 3000);
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Advanced Terminal Typing Effect
const initTerminalEffect = () => {
    const terminalBody = document.getElementById('hero-terminal');
    if (!terminalBody) return;

    const sequence = [
        { text: "whoami", type: "command", delay: 1000 },
        { 
            text: "Initialising Identity...\n[✓] Full Stack Architect loaded\n[✓] Growth Systems active\n[✓] Agentic Protocols engaged\n\n> Result: ENTP / Builder / Automator", 
            type: "output", 
            delay: 500 
        },
        { text: "ls ./current_focus", type: "command", delay: 2000 },
        { 
            text: "drwx------  architect  staff  Custom_OpenClaw_Workspaces\n-rwx------  architect  staff  Raymond_Bot_v2.0\n-rwx------  architect  staff  High_Scale_Funnels", 
            type: "output", 
            delay: 500 
        },
        { text: "cat status.txt", type: "command", delay: 2000 },
        { text: "Status: OPEN FOR HIGH-IMPACT COLLABORATION", type: "output", highlight: true, delay: 500 }
    ];

    let stepIndex = 0;

    const typeLine = async (line) => {
        const div = document.createElement('div');
        div.className = line.type === 'command' ? 'command-line' : 'output-line';
        
        if (line.type === 'command') {
            div.innerHTML = `<span class="prompt">user@portfolio:~$</span> <span class="typing"></span>`;
            terminalBody.appendChild(div);
            const span = div.querySelector('.typing');
            await typeText(span, line.text);
            span.classList.remove('typing');
            span.classList.add('command');
        } else {
            div.textContent = line.text;
            if (line.highlight) div.style.color = '#ffffffff'; /* Electric Crimson */
            div.style.whiteSpace = 'pre-wrap';
            div.style.marginBottom = '1rem';
            terminalBody.appendChild(div);
        }
        
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    const typeText = (element, text) => {
        return new Promise(resolve => {
            let i = 0;
            const interval = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50 + Math.random() * 30);
        });
    };

    const runSequence = async () => {
        for (const step of sequence) {
            await new Promise(r => setTimeout(r, step.delay));
            await typeLine(step);
        }
        // Add final prompt
        const finalDiv = document.createElement('div');
        finalDiv.className = 'command-line';
        finalDiv.innerHTML = `<span class="prompt">user@portfolio:~$</span> <span class="cursor">_</span>`;
        terminalBody.appendChild(finalDiv);
    };

    runSequence();
};

document.addEventListener('DOMContentLoaded', () => {
    initTerminalEffect();
});

// Animated counter for stats
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.innerText);
        const increment = Math.ceil(target / 50);
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                stat.innerText = current + '+';
                setTimeout(updateCount, 40);
            } else {
                stat.innerText = target + '+';
            }
        };

        updateCount();
    });
};

// Intersection Observer for animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Check if the entry is a stat card or contains stats
                if (entry.target.querySelector('.stat-number') || entry.target.classList.contains('stat-number')) {
                    animateStats();
                    observer.unobserve(entry.target); // Only animate once
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.bento-card, .hero-left, .hero-right').forEach(el => {
        observer.observe(el);
    });
};

// System Logs Animation
const initSystemLogs = () => {
    const container = document.getElementById('system-logs');
    if (!container) return;

    const logs = [
        "Initializing core services...",
        "Loading aesthetic modules...",
        "Optimizing asset delivery...",
        "Connecting to neural net...",
        "Handshake established (Secure)",
        "Fetching latest projects...",
        " Analyzing user behavior...",
        "System operating at 99% efficiency",
        "Deploying layout patches...",
        "Scanning for coffee availability...",
        "Synchronizing local storage...",
        "Updating viewports..."
    ];

    const addLog = () => {
        const log = logs[Math.floor(Math.random() * logs.length)];
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span style="color: var(--text-muted)">[${time}]</span> ${log}`; // Fixed: added missing >
        
        container.prepend(entry);

        // Keep only last 6 logs
        if (container.children.length > 6) {
            container.lastElementChild.remove();
        }
    };

    // Initial population
    for(let i=0; i<3; i++) setTimeout(addLog, i * 200);

    // Continuous updates
    setInterval(addLog, 2500);
};

document.addEventListener('DOMContentLoaded', () => {
    initTerminalEffect();
    observeElements();
    initCommandClick();
    initSystemLogs();
});

// Navbar scroll effect
const navbarEffect = () => {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
};

// Mobile menu toggle
const initMobileMenu = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');
    let isOpen = false;
    
    const toggleMenu = () => {
        isOpen = !isOpen;
        navLinks.classList.toggle('active');
        navToggle.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0)';
        
        // Disable body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
        
        // Animate links
        links.forEach((link, index) => {
            if (isOpen) {
                link.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
            } else {
                link.style.animation = '';
            }
        });
    };
    
    navToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isOpen && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
            toggleMenu();
        }
    });
    
    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (isOpen) toggleMenu();
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isOpen) {
            toggleMenu();
        }
    });
};

// Enhanced cursor with trail effect
const createAdvancedCursor = () => {
    const cursor = document.createElement('div');
    const cursorDot = document.createElement('div');
    const trail = document.createElement('div');
    
    cursor.className = 'custom-cursor';
    cursorDot.className = 'cursor-dot';
    trail.className = 'cursor-trail';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
    document.body.appendChild(trail);

    const trailPoints = Array.from({ length: 10 }, () => ({ x: 0, y: 0 }));
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;

        // Update trail points
        trailPoints.pop();
        trailPoints.unshift({ x: cursorX, y: cursorY });

        // Draw trail
        const points = trailPoints.map((point, index) => {
            const size = (trailPoints.length - index) / trailPoints.length;
            return `${point.x}px ${point.y}px ${size * 8}px rgba(255, 215, 0, ${size * 0.2})`;
        }).join(', ');
        trail.style.boxShadow = points;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        requestAnimationFrame(function animate() {
            const dx = cursorX - dotX;
            const dy = cursorY - dotY;
            dotX += dx * 0.2;
            dotY += dy * 0.2;
            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
            requestAnimationFrame(animate);
        });
    });

    // Enhanced hover effects
    const handleElementHover = (element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        cursor.style.transform = `translate(${centerX}px, ${centerY}px) scale(1.5)`;
        cursor.style.border = '2px solid var(--secondary-color)';
        cursor.style.mixBlendMode = 'difference';
        
        element.addEventListener('mousemove', (e) => {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const distance = Math.sqrt(
                Math.pow(x - rect.width / 2, 2) + 
                Math.pow(y - rect.height / 2, 2)
            );
            const scale = 1 + (1 - Math.min(distance / (rect.width / 2), 1)) * 0.5;
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(${scale})`;
        });
    };

    document.querySelectorAll('a, button, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorDot.classList.add('dot-hover');
            handleElementHover(el);
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorDot.classList.remove('dot-hover');
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
        });
    });
};

// Enhanced particle system with different types
const createEnhancedParticles = () => {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    document.querySelector('.hero').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    class Particle {
        constructor(type) {
            this.type = type;
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.life = 1;
            this.lifeSpeed = 0.002 + Math.random() * 0.002;
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = (Math.random() - 0.5) * 0.02;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.05;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.angle += this.spinSpeed;
            this.wobble += this.wobbleSpeed;
            
            // Add wobble movement
            this.x += Math.sin(this.wobble) * 0.5;
            this.y += Math.cos(this.wobble) * 0.5;
            
            this.life -= this.lifeSpeed;
            
            if(this.life <= 0) {
                this.reset();
            }
            
            if(this.x > canvas.width) this.x = 0;
            if(this.x < 0) this.x = canvas.width;
            if(this.y > canvas.height) this.y = 0;
            if(this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            const alpha = this.life * 0.5;
            
            switch(this.type) {
                case 'circle':
                    ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'star':
                    ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.4})`;
                    this.drawStar(0, 0, 5, this.size * 2, this.size);
                    break;
                    
                case 'line':
                    ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.3})`;
                    ctx.lineWidth = this.size / 2;
                    ctx.beginPath();
                    ctx.moveTo(-this.size * 2, 0);
                    ctx.lineTo(this.size * 2, 0);
                    ctx.stroke();
                    break;
                    
                case 'diamond':
                    ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.3})`;
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(this.size, 0);
                    ctx.lineTo(0, this.size);
                    ctx.lineTo(-this.size, 0);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }
            
            ctx.restore();
        }
        
        drawStar(cx, cy, spikes, outerRadius, innerRadius) {
            let rot = Math.PI / 2 * 3;
            let x = cx;
            let y = cy;
            let step = Math.PI / spikes;

            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            
            for(let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    const particleTypes = ['circle', 'star', 'line', 'diamond'];
    
    const init = () => {
        for(let i = 0; i < particleCount; i++) {
            const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
            particles.push(new Particle(type));
        }
    };
    
    const animate = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Interactive particle effect on mouse move
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Add new particles on mouse move
        if(Math.random() > 0.8) {
            const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
            const particle = new Particle(type);
            particle.x = mouseX;
            particle.y = mouseY;
            particle.speedX = (Math.random() - 0.5) * 4;
            particle.speedY = (Math.random() - 0.5) * 4;
            particles.push(particle);
            
            // Remove old particle to maintain count
            if(particles.length > particleCount) {
                particles.shift();
            }
        }
    });
};

// Enhanced 3D tilt effect for project cards
const enhanced3DTiltEffect = () => {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        let bounds = card.getBoundingClientRect();
        let mouseLeaveDelay;
        
        const mouseEnter = (e) => {
            clearTimeout(mouseLeaveDelay);
            bounds = card.getBoundingClientRect();
            mouseMoveHandler(e);
        };
        
        const mouseMove = (e) => {
            mouseMoveHandler(e);
            updateShinePosition(e);
        };
        
        const mouseMoveHandler = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const leftX = mouseX - bounds.x;
            const topY = mouseY - bounds.y;
            const center = {
                x: leftX - bounds.width / 2,
                y: topY - bounds.height / 2
            };
            
            const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
            
            card.style.transform = `
                perspective(1000px)
                scale3d(1.05, 1.05, 1.05)
                rotate3d(
                    ${center.y / 100},
                    ${-center.x / 100},
                    0,
                    ${Math.log(distance) * 2}deg
                )
            `;
            
            card.style.filter = `brightness(${110 + (distance * 0.01)}%)`;
        };
        
        const updateShinePosition = (e) => {
            const shine = card.querySelector('.card-shine') || createShineElement(card);
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            shine.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(255,255,255,0.2) 0%,
                    rgba(255,255,255,0.1) 10%,
                    rgba(255,255,255,0) 50%
                )
            `;
            
            // Add reflection effect
            const reflectionX = (x / rect.width) * 100;
            const reflectionY = (y / rect.height) * 100;
            card.style.backgroundImage = `
                linear-gradient(
                    ${Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI)}deg,
                    rgba(255,255,255,0.1) 0%,
                    rgba(255,255,255,0) 80%
                )
            `;
        };
        
        const createShineElement = (parent) => {
            const shine = document.createElement('div');
            shine.className = 'card-shine';
            parent.appendChild(shine);
            return shine;
        };
        
        const mouseLeave = () => {
            mouseLeaveDelay = setTimeout(() => {
                card.style.transform = 'perspective(1000px) scale3d(1, 1, 1) rotate3d(0, 0, 0, 0)';
                card.style.filter = 'brightness(100%)';
                card.style.backgroundImage = 'none';
                
                const shine = card.querySelector('.card-shine');
                if (shine) shine.remove();
            }, 100);
        };
        
        card.addEventListener('mouseenter', mouseEnter);
        card.addEventListener('mousemove', mouseMove);
        card.addEventListener('mouseleave', mouseLeave);
    });
};

// Enhanced magnetic effect for buttons
const enhancedMagneticEffect = () => {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        const button = btn.querySelector('.hero-btn');
        let bound;
        let moveX = 0;
        let moveY = 0;
        
        function lerp(start, end, amount) {
            return (1 - amount) * start + amount * end;
        }
        
        function animate() {
            moveX = lerp(moveX, 0, 0.1);
            moveY = lerp(moveY, 0, 0.1);
            
            button.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            
            if (Math.abs(moveX) > 0.001 || Math.abs(moveY) > 0.001) {
                requestAnimationFrame(animate);
            }
        }
        
        btn.addEventListener('mousemove', (e) => {
            bound = btn.getBoundingClientRect();
            const x = e.clientX - bound.left - bound.width / 2;
            const y = e.clientY - bound.top - bound.height / 2;
            
            moveX = x * 0.3;
            moveY = y * 0.3;
            
            if (!button.style.transform) {
                requestAnimationFrame(animate);
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (button.style.transform) {
                requestAnimationFrame(animate);
            }
        });
        
        // Add shine effect on hover
        btn.addEventListener('mouseenter', () => {
            const shine = document.createElement('div');
            shine.classList.add('btn-shine');
            button.appendChild(shine);
            
            setTimeout(() => {
                shine.remove();
            }, 600);
        });
    });
};

// Enhanced navbar effects
const enhancedNavbar = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hoverEffect = document.querySelector('.nav-hover-effect');
    let lastScrollY = window.scrollY;
    let isScrolling = false;
    let scrollTimeout;
    let lastScrollTime = Date.now();
    let scrollDelta = 0;
    
    // Create progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    navbar.appendChild(progressBar);
    
    // Handle scroll effects with smooth damping
    const handleScroll = () => {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastScrollTime;
        scrollDelta = window.scrollY - lastScrollY;
        
        // Update scroll progress
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrollPercent}%`;
        
        // Handle navbar visibility
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            
            // Only trigger hide/show for significant scroll amounts and not too frequently
            if (Math.abs(scrollDelta) > 10 && timeDiff > 100) {
                if (scrollDelta > 0 && window.scrollY > 300) {
                    navbar.classList.add('nav-hidden');
                } else {
                    navbar.classList.remove('nav-hidden');
                }
                lastScrollTime = currentTime;
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.remove('nav-hidden');
        }
        
        // Update active section
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
        
        lastScrollY = window.scrollY;
    };
    
    // Throttle scroll event
    const throttledScroll = () => {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial call to set correct state
    handleScroll();
};

// Enhanced stats effects with smooth animations
const enhanceStats = () => {
    const stats = document.querySelectorAll('.stat');
    
    stats.forEach(stat => {
        const bg = stat.querySelector('.stat-bg');
        const number = stat.querySelector('.stat-number');
        const content = stat.querySelector('.stat-content');
        const value = parseInt(stat.dataset.value);
        let isAnimating = false;
        
        // Enhanced 3D tilt effect
        stat.addEventListener('mousemove', (e) => {
            if (!isAnimating) {
                const rect = stat.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                // Update gradient position
                stat.style.setProperty('--mouse-x', `${x}%`);
                stat.style.setProperty('--mouse-y', `${y}%`);
                
                // Calculate tilt
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const rotateX = (e.clientY - centerY) / 10;
                const rotateY = -(e.clientX - centerX) / 10;
                
                // Apply smooth tilt transformation
                stat.style.transform = `
                    translateY(-8px)
                    translateZ(20px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;
                
                content.style.transform = `
                    translateZ(50px)
                    rotateX(${-rotateX * 0.5}deg)
                    rotateY(${-rotateY * 0.5}deg)
                `;
            }
        });
        
        // Smooth reset on mouse leave
        stat.addEventListener('mouseleave', () => {
            isAnimating = true;
            
            stat.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            content.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            
            stat.style.transform = 'translateZ(0)';
            content.style.transform = 'translateZ(30px)';
            
            setTimeout(() => {
                stat.style.transition = '';
                content.style.transition = '';
                isAnimating = false;
            }, 600);
        });
        
        // Enhanced counting animation with easing
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let startTime = null;
                    const duration = 2500; // 2.5 seconds
                    
                    function easeOutExpo(t) {
                        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                    }
                    
                    function animate(currentTime) {
                        if (!startTime) startTime = currentTime;
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        const easedProgress = easeOutExpo(progress);
                        const currentValue = Math.round(easedProgress * value);
                        
                        number.textContent = currentValue + '+';
                        number.style.opacity = progress;
                        number.style.transform = `scale(${0.5 + progress * 0.5})`;
                        
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            number.style.transform = '';
                            observer.unobserve(entry.target);
                        }
                    }
                    
                    requestAnimationFrame(animate);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });
        
        observer.observe(stat);
    });
};

// Animate skill bars when they come into view
const animateSkills = () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const progress = progressBar.dataset.progress;
                
                // Start the progress bar animation
                progressBar.style.width = `${progress}%`;
                
                // Add animation class to the skill item
                entry.target.classList.add('animate-skill');
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });
    
    skillItems.forEach(item => {
        // Reset progress bar width
        const progressBar = item.querySelector('.skill-progress');
        progressBar.style.width = '0';
        
        // Add hover effect for skill items
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.skill-icon i');
            icon.style.transform = 'rotate(360deg) scale(1.2)';
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.skill-icon i');
            icon.style.transform = 'rotate(0) scale(1)';
        });
        
        observer.observe(item);
    });
};

// Enhanced skill cards with particles and effects
const enhanceSkillCards = () => {
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillItems = document.querySelectorAll('.skill-item');
    
    // Create particle container for each skill item
    skillItems.forEach(item => {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        item.appendChild(particlesContainer);
        
        // Create particles
        for(let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particlesContainer.appendChild(particle);
        }
    });
    
    // Handle particle animations
    const animateParticles = (container) => {
        const particles = container.querySelectorAll('.particle');
        particles.forEach(particle => {
            // Reset particle
            particle.style.opacity = '0';
            particle.style.transform = 'translateY(0) translateX(0)';
            
            // Random position within container
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            
            // Random x direction for floating
            const randomX = (Math.random() - 0.5) * 100;
            particle.style.setProperty('--x', `${randomX}px`);
            
            // Animate
            requestAnimationFrame(() => {
                particle.style.animation = 'particleFloat 2s ease-out forwards';
            });
            
            // Remove animation after completion
            particle.addEventListener('animationend', () => {
                particle.style.animation = '';
                setTimeout(() => animateParticle(particle), Math.random() * 2000);
            });
        });
    };
    
    const animateParticle = (particle) => {
        // Reset and animate single particle
        particle.style.opacity = '0';
        particle.style.transform = 'translateY(0) translateX(0)';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        const randomX = (Math.random() - 0.5) * 100;
        particle.style.setProperty('--x', `${randomX}px`);
        
        requestAnimationFrame(() => {
            particle.style.animation = 'particleFloat 2s ease-out forwards';
        });
    };
    
    // Handle skill item interactions
    skillItems.forEach(item => {
        const progress = item.querySelector('.skill-progress');
        const progressValue = progress.dataset.progress;
        const particlesContainer = item.querySelector('.particles');
        
        // Add skill level indicator
        const level = document.createElement('div');
        level.className = 'skill-level';
        level.textContent = `${progressValue}%`;
        item.appendChild(level);
        
        // Intersection Observer for progress bars and particles
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    item.classList.add('active');
                    setTimeout(() => {
                        progress.style.width = `${progressValue}%`;
                        animateParticles(particlesContainer);
                    }, 200);
                    observer.unobserve(item);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(item);
        
        // Mouse movement effects
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            item.style.setProperty('--mouse-x', `${x}%`);
            item.style.setProperty('--mouse-y', `${y}%`);
            
            // Trigger particles on hover
            animateParticles(particlesContainer);
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('active');
        });
    });
    
    // Handle category card effects
    skillCategories.forEach(category => {
        let isHovered = false;
        let rafId = null;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let targetRotateX = 0;
        let targetRotateY = 0;
        
        const lerp = (start, end, factor) => start + (end - start) * factor;
        
        const animate = () => {
            if (isHovered) {
                currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
                currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);
                category.style.transform = `
                    perspective(1000px)
                    rotateX(${currentRotateX}deg)
                    rotateY(${currentRotateY}deg)
                    translateZ(20px)
                `;
                rafId = requestAnimationFrame(animate);
            }
        };
        
        category.addEventListener('mouseenter', () => {
            isHovered = true;
            category.classList.add('active');
            requestAnimationFrame(animate);
        });
        
        category.addEventListener('mousemove', (e) => {
            if (isHovered) {
                const rect = category.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                targetRotateY = ((e.clientX - centerX) / rect.width) * 10;
                targetRotateX = ((e.clientY - centerY) / rect.height) * 10;
            }
        });
        
        category.addEventListener('mouseleave', () => {
            isHovered = false;
            category.classList.remove('active');
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            category.style.transform = '';
        });
    });
};

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    enhancedNavbar();
    initMobileMenu();
    enhanced3DTiltEffect();
    enhancedMagneticEffect();
    if (!isMobile) {
        createAdvancedCursor();
    }
    createEnhancedParticles();
    glitchEffect();
    typingEffect();
    parallaxShapes();
    observeElements();
    enhanceStats();
    animateSkills();
    enhanceSkillCards();
});

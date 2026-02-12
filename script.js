// ===== Philosophy of Science Website - JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initRevealOnScroll();
    initPhilosophyQuotes();
    initLightbox();
    initSmoothScroll();
    initParallaxSymbols();
});

// ===== Header Scroll Effect =====
function initHeader() {
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    // Set CSS variable for header height so content can adapt
    function updateHeaderHeight() {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', height + 'px');
    }

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background change
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ===== Reveal Elements on Scroll =====
function initRevealOnScroll() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== Philosophy Quotes Rotation =====
function initPhilosophyQuotes() {
    const quotes = [
        { text: "הדבר היחיד שאני יודע הוא שאיני יודע דבר", author: "סוקרטס" },
        { text: "אני חושב, משמע אני קיים", author: "רנה דקארט" },
        { text: "האושר הוא משמעות החיים ומטרתם", author: "אריסטו" },
        { text: "מי שלא יכול לזכור את העבר נידון לחזור עליו", author: "ג'ורג' סנטיאנה" },
        { text: "החיים ללא בחינה אינם שווים לחיותם", author: "סוקרטס" },
        { text: "הידיעה מתחילה בתמיהה", author: "אריסטו" },
        { text: "הפילוסופיה מתחילה בהשתאות", author: "אפלטון" },
        { text: "לחיות זה לא להמתין שהסערה תחלוף, אלא ללמוד לרקוד בגשם", author: "סנקה" },
        { text: "האמת היא בת הזמן, לא בת הסמכות", author: "פרנסיס בייקון" },
        { text: "כל מה שאני יודע הוא שאני לא יודע כלום", author: "סוקרטס" }
    ];

    const quoteElement = document.getElementById('philosophyQuote');
    const citeElement = quoteElement?.nextElementSibling;

    if (!quoteElement || !citeElement) return;

    let currentIndex = 0;

    function changeQuote() {
        // Fade out
        quoteElement.style.opacity = '0';
        citeElement.style.opacity = '0';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % quotes.length;
            quoteElement.textContent = `"${quotes[currentIndex].text}"`;
            citeElement.textContent = `- ${quotes[currentIndex].author}`;

            // Fade in
            quoteElement.style.opacity = '1';
            citeElement.style.opacity = '1';
        }, 500);
    }

    // Add transition styles
    quoteElement.style.transition = 'opacity 0.5s ease';
    citeElement.style.transition = 'opacity 0.5s ease';

    // Change quote every 8 seconds
    setInterval(changeQuote, 8000);
}

// ===== Lightbox Gallery =====
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox?.querySelector('.lightbox-image');
    const closeBtn = lightbox?.querySelector('.lightbox-close');
    const prevBtn = lightbox?.querySelector('.lightbox-prev');
    const nextBtn = lightbox?.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!lightbox || !lightboxImage || galleryItems.length === 0) return;

    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    let isAnimating = false;

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = images[currentImageIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function slideToImage(newIndex, slideDirection) {
        if (isAnimating) return;
        isAnimating = true;

        // RTL: next = slide right, prev = slide left
        const outClass = slideDirection === 'right' ? 'slide-out-right' : 'slide-out-left';
        const inClass = slideDirection === 'right' ? 'slide-in-right' : 'slide-in-left';

        lightboxImage.classList.add(outClass);

        setTimeout(() => {
            lightboxImage.classList.remove(outClass);
            currentImageIndex = newIndex;
            lightboxImage.src = images[currentImageIndex];
            lightboxImage.classList.add(inClass);

            setTimeout(() => {
                lightboxImage.classList.remove(inClass);
                isAnimating = false;
            }, 200);
        }, 200);
    }

    function showNext() {
        const newIndex = (currentImageIndex + 1) % images.length;
        slideToImage(newIndex, 'right');
    }

    function showPrev() {
        const newIndex = (currentImageIndex - 1 + images.length) % images.length;
        slideToImage(newIndex, 'left');
    }

    // Event listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', showPrev);
    nextBtn?.addEventListener('click', showNext);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                // RTL: right arrow = previous, slides left
                showPrev();
                break;
            case 'ArrowLeft':
                // RTL: left arrow = next, slides right
                showNext();
                break;
        }
    });

    // Touch swipe support with drag follow effect
    let touchStartX = 0;
    let touchCurrentX = 0;
    let isDragging = false;

    lightbox.addEventListener('touchstart', (e) => {
        if (isAnimating) return;
        touchStartX = e.changedTouches[0].screenX;
        touchCurrentX = touchStartX;
        isDragging = true;
        lightboxImage.style.transition = 'none';
    });

    lightbox.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchCurrentX = e.changedTouches[0].screenX;
        const diff = touchCurrentX - touchStartX;
        const dampedDiff = diff * 0.4;
        const opacity = 1 - Math.abs(diff) / 800;
        lightboxImage.style.transform = `translateX(${dampedDiff}px) scale(${1 - Math.abs(diff) / 2000})`;
        lightboxImage.style.opacity = Math.max(opacity, 0.5);
    });

    lightbox.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        lightboxImage.style.transition = '';
        lightboxImage.style.transform = '';
        lightboxImage.style.opacity = '';

        const diff = touchStartX - e.changedTouches[0].screenX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left in RTL = next = slide right
                const newIndex = (currentImageIndex + 1) % images.length;
                slideToImage(newIndex, 'right');
            } else {
                // Swiped right in RTL = prev = slide left
                const newIndex = (currentImageIndex - 1 + images.length) % images.length;
                slideToImage(newIndex, 'left');
            }
        }
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Parallax Floating Symbols =====
function initParallaxSymbols() {
    const symbols = document.querySelectorAll('.philosophy-symbols .symbol');

    if (symbols.length === 0) return;

    // Regenerate symbols periodically for continuous effect
    function resetSymbol(symbol) {
        symbol.style.animation = 'none';
        symbol.offsetHeight; // Trigger reflow
        symbol.style.animation = null;
    }

    // Add slight mouse movement parallax
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        symbols.forEach((symbol, index) => {
            const depth = (index + 1) * 0.5;
            const moveX = mouseX * depth * 20;
            const moveY = mouseY * depth * 20;

            symbol.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// ===== Question Tags Animation Enhancement =====
document.addEventListener('DOMContentLoaded', function() {
    const questionTags = document.querySelectorAll('.question-tag');

    questionTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            // Add thinking animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'tagThinking 0.5s ease';
            }, 10);
        });
    });

    // Add the animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tagThinking {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.05) rotate(-2deg); }
            75% { transform: scale(1.05) rotate(2deg); }
        }
    `;
    document.head.appendChild(style);
});

// ===== Philosopher Tags Tooltip =====
const philosopherInfo = {
    'אפלטון': 'פילוסוף יווני קלאסי, מייסד האקדמיה באתונה',
    'קאנט': 'פילוסוף גרמני, מייסד הפילוסופיה הביקורתית',
    'מיל': 'פילוסוף ברישי, אבי התועלתנות',
    'ניטשה': 'פילוסוף גרמני, מבקר המוסר המסורתית',
    'יום': 'פילוסוף סקוטי, אבי האמפיריציזם',
    'דקארט': 'פילוסוף צרפתי, אבי הפילוסופיה המודרנית',
    'אריסטו': 'פילוסוף יווני, תלמידו של אפלטון',
    'ניוטון': 'פיזיקאי ומתמטיקאי אנגלי, מגלה חוקי התנועה',
    'זמלוריס': 'פילוסוף המדע',
    'המפל': 'פילוסוף אמריקאי-גרמני, מרכזי בפילוסופיה של המדע',
    'איאר': 'פילוסוף בריטי, הגיוני פוזיטיביסט',
    'קון': 'פילוסוף אמריקאי, מחבר "מהפכות מדעיות"',
    'פופר': 'פילוסוף אוסטרי-בריטי, אבי הפלסיפיקציוניזם'
};

document.addEventListener('DOMContentLoaded', function() {
    const philosopherTags = document.querySelectorAll('.philosopher-tag');

    philosopherTags.forEach(tag => {
        const name = tag.textContent.trim();
        if (philosopherInfo[name]) {
            tag.setAttribute('title', philosopherInfo[name]);
            tag.style.cursor = 'help';
        }
    });
});

// ===== Active Navigation Highlight =====
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');

    function highlightNav() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Initial call

    // Add active style
    const style = document.createElement('style');
    style.textContent = `
        .main-nav a.active {
            background: var(--accent-yellow);
            box-shadow: 0 4px 12px rgba(244, 197, 66, 0.4);
        }
        .main-nav a.active::after {
            width: 0;
        }
    `;
    document.head.appendChild(style);
});

// ===== Typing Effect for Hero Title =====
document.addEventListener('DOMContentLoaded', function() {
    // Add a subtle glow effect to the hero on load
    const hero = document.querySelector('.hero');
    if (hero) {
        setTimeout(() => {
            hero.style.transition = 'all 1s ease';
        }, 2000);
    }
});

// ===== Card Tilt Effect =====
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.reason-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// ===== Brain Animation Enhancement =====
document.addEventListener('DOMContentLoaded', function() {
    const brainAnimation = document.querySelector('.brain-animation');

    if (brainAnimation) {
        // Add random particle generation
        const particles = brainAnimation.querySelector('.thought-particles');

        if (particles) {
            setInterval(() => {
                const symbols = ['?', '!', '∞', 'φ', '∑', 'Ω', '∆', 'π'];
                const existingParticles = particles.querySelectorAll('span');

                existingParticles.forEach((particle, index) => {
                    if (Math.random() > 0.7) {
                        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    }
                });
            }, 3000);
        }
    }
});

// ===== Console Easter Egg =====
console.log('%c🧠 פילוסופיה של המדע', 'font-size: 24px; font-weight: bold; color: #2d8c5a;');
console.log('%c"הדבר היחיד שאני יודע הוא שאיני יודע דבר" - סוקרטס', 'font-size: 14px; color: #3a9a8c; font-style: italic;');
console.log('%cבית חינוך ירקון | נווה ירק', 'font-size: 12px; color: #666;');

// ===== Back to Top Button =====
document.addEventListener('DOMContentLoaded', function() {
    initBackToTop();
});

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Chatbot =====
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});

function initChatbot() {
    const chatbot = document.getElementById('chatbot');
    const toggle = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('chatbotClose');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const messagesContainer = document.getElementById('chatbotMessages');

    if (!chatbot || !toggle || !input || !sendBtn || !messagesContainer) return;

    // Open chatbot
    toggle.addEventListener('click', () => {
        chatbot.classList.add('active');
        input.focus();
    });

    // Close chatbot
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatbot.classList.remove('active');
        });
    }

    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (chatbot.classList.contains('active')) {
            // Check if click is outside the chatbot window and toggle button
            if (!chatbot.contains(e.target)) {
                chatbot.classList.remove('active');
            }
        }
    });

    // Send message
    function sendMessage() {
        const message = input.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        showTyping();

        // Get bot response after delay
        setTimeout(() => {
            hideTyping();
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'chat-message bot typing-message';
        typing.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTyping() {
        const typing = messagesContainer.querySelector('.typing-message');
        if (typing) typing.remove();
    }

    // Knowledge base
    const knowledgeBase = {
        // מידע על בית הספר
        school: {
            keywords: ['בית ספר', 'ירקון', 'איפה', 'מיקום', 'כתובת', 'נווה ירק', 'איפה נמצא'],
            response: 'בית חינוך ירקון נמצא בנווה ירק, במועצה האזורית דרום השרון. זהו בית ספר שש-שנתי שהוקם בשנת 2004 ליד מקורות נחל הירקון. 🏫'
        },
        // מידע על המגמה
        megama: {
            keywords: ['מגמה', 'פילוסופיה של המדע', 'מה לומדים', 'על המגמה', 'מהי המגמה'],
            response: 'מגמת פילוסופיה של המדע היא מגמה ייחודית ראשונה מסוגה בישראל! 🎓 במגמה לומדים אתיקה, אפיסטמולוגיה, מטפיזיקה, ופילוסופיה של הבינה המלאכותית. המגמה מעניקה 5 יחידות לימוד.'
        },
        // תנאי קבלה
        requirements: {
            keywords: ['תנאי קבלה', 'דרישות', 'איך להתקבל', 'מה צריך', 'ממוצע', 'מתמטיקה'],
            response: 'תנאי הקבלה למגמה: ✅ 4-5 יח"ל מתמטיקה ✅ ממוצע 80 ומעלה במקצועות רבי המלל. המגמה מתאימה לתלמידים סקרנים שאוהבים לשאול שאלות!'
        },
        // פילוסופים
        philosophers: {
            keywords: ['פילוסופים', 'אפלטון', 'סוקרטס', 'קאנט', 'דקארט', 'ניטשה', 'אריסטו', 'מי לומדים'],
            response: 'במהלך הלימודים תכירו פילוסופים ומדענים גדולים: אפלטון, קאנט, מיל, ניטשה, דקארט, אריסטו, ניוטון, פופר, קון ועוד רבים! 📚 כל אחד מהם יהפוך לחבר קרוב שלכם.'
        },
        // סיורים
        trips: {
            keywords: ['סיורים', 'טיולים', 'ביקורים', 'לאן נוסעים', 'פעילויות'],
            response: 'במגמה יוצאים לסיורים מרתקים! 🚌 נפגוש מדענים ופילוסופים מובילים, נבקר במכוני מחקר בארץ, ואפילו יש אפשרות לסיורים בחו"ל (רשות). הסיורים הם חלק בלתי נפרד מהחוויה!'
        },
        // תכנית לימודים
        curriculum: {
            keywords: ['תכנית', 'לימודים', 'מה בכל שנה', 'שכבה', 'י', 'יא', 'יב'],
            response: '📖 תכנית הלימודים:\n• שכבת י\' - יסודות האתיקה והאפיסטמולוגיה + פילוסופיה של AI\n• שכבת יא\' - פילוסופיה של המדע\n• שכבת יב\' - העמקה ומחקר אישי'
        },
        // שלום/ברכות
        greeting: {
            keywords: ['שלום', 'היי', 'הי', 'בוקר טוב', 'ערב טוב', 'מה קורה', 'מה נשמע', 'אהלן'],
            response: 'שלום וברוכים הבאים! 👋 אני פילוBot, העוזר הווירטואלי של מגמת פילוסופיה של המדע. איך אוכל לעזור לך היום?'
        },
        // שעה
        time: {
            keywords: ['מה השעה', 'שעה', 'כמה השעה'],
            response: () => `השעה עכשיו היא ${new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })} ⏰`
        },
        // תאריך
        date: {
            keywords: ['מה התאריך', 'תאריך', 'איזה יום', 'איזה תאריך'],
            response: () => `היום ${new Date().toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 📅`
        },
        // למה ללמוד
        why: {
            keywords: ['למה', 'למה ללמוד', 'יתרונות', 'שווה', 'כדאי'],
            response: 'למה לבחור בפילוסופיה של המדע? 🌟\n• פיתוח חשיבה עצמאית וביקורתית\n• הבנת הבינה המלאכותית\n• מפגשים עם מומחים\n• מגמה ייחודית בארץ\n• סיורים מרתקים\n• הכנה מעולה לעתיד!'
        },
        // אתר בית הספר
        website: {
            keywords: ['אתר', 'לינק', 'קישור', 'אתר בית ספר'],
            response: 'אתר בית חינוך ירקון: https://yarkon.tik-tak.net/ 🌐'
        },
        // בדיחה פילוסופית
        joke: {
            keywords: ['בדיחה', 'צחוק', 'משהו מצחיק', 'ספר בדיחה'],
            response: '😄 הנה בדיחה פילוסופית:\nלמה הפילוסוף לא הלך לים?\nכי הוא פחד מהגלים של המחשבה! 🌊🤔'
        },
        // ציטוט
        quote: {
            keywords: ['ציטוט', 'משפט', 'אמרה', 'חוכמה'],
            response: () => {
                const quotes = [
                    '"הדבר היחיד שאני יודע הוא שאיני יודע דבר" - סוקרטס',
                    '"אני חושב, משמע אני קיים" - דקארט',
                    '"הידיעה מתחילה בתמיהה" - אריסטו',
                    '"החיים ללא בחינה אינם שווים לחיותם" - סוקרטס',
                    '"הפילוסופיה מתחילה בהשתאות" - אפלטון'
                ];
                return '💭 ' + quotes[Math.floor(Math.random() * quotes.length)];
            }
        },
        // תודה
        thanks: {
            keywords: ['תודה', 'תודה רבה', 'מעולה', 'אחלה', 'נהדר'],
            response: 'בשמחה! 😊 אם יש לך עוד שאלות, אני כאן לעזור. בהצלחה בלימודים!'
        },
        // עזרה
        help: {
            keywords: ['עזרה', 'מה אתה יכול', 'מה אפשר לשאול', 'איך להשתמש'],
            response: '🤖 אני יכול לעזור עם:\n• מידע על המגמה והלימודים\n• תנאי קבלה\n• סיורים ופעילויות\n• מידע על בית הספר\n• ציטוטים פילוסופיים\n• ועוד הרבה! פשוט שאלו 😊'
        }
    };

    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Check each category
        for (const category of Object.values(knowledgeBase)) {
            for (const keyword of category.keywords) {
                if (lowerMessage.includes(keyword)) {
                    return typeof category.response === 'function'
                        ? category.response()
                        : category.response;
                }
            }
        }

        // Default response
        const defaultResponses = [
            'שאלה מעניינת! 🤔 אני ממליץ לפנות לצוות המגמה לקבלת מידע מפורט יותר.',
            'לא בטוח שיש לי את התשובה לזה, אבל אשמח לעזור בשאלות על המגמה, בית הספר, או תנאי הקבלה! 📚',
            'כשאלה פילוסופית טובה - התשובה עשויה להיות יותר מורכבת ממה שאני יכול להציע. 🧠 יש משהו אחר שאוכל לעזור בו?',
            'הממ, זו שאלה שכדאי לדון בה בכיתה! בינתיים, אפשר לשאול אותי על המגמה, הסיורים, או תנאי הקבלה. 😊'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}

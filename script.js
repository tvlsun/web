// TVLSUN portfolio interactions — lightweight, responsive and accessible.
document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;

    // Decorative particles: fewer on mobile, none when reduced motion is requested.
    function createParticles() {
        const container = document.getElementById('particles-container');
        if (!container || reducedMotion) return;
        const count = isSmallScreen ? 12 : 28;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('span');
            const size = Math.random() * 3 + 1;
            particle.className = 'ambient-particle';
            particle.style.cssText = `position:absolute;width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;opacity:${Math.random()*.32+.08};border-radius:50%;background:#9aaaff;box-shadow:0 0 12px rgba(124,140,255,.45);animation:floatParticle ${Math.random()*9+12}s ease-in-out ${Math.random()*-10}s infinite alternate;`;
            fragment.appendChild(particle);
        }
        container.appendChild(fragment);
        if (!document.getElementById('particle-animation-style')) {
            const style = document.createElement('style');
            style.id = 'particle-animation-style';
            style.textContent = '@keyframes floatParticle{from{transform:translate3d(0,0,0)}to{transform:translate3d(26px,-34px,0)}}';
            document.head.appendChild(style);
        }
    }

    // Mobile navigation.
    const menuButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    function closeMenu() {
        if (!menuButton || !navLinks) return;
        navLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation menu');
    }
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            const open = menuButton.getAttribute('aria-expanded') !== 'true';
            menuButton.setAttribute('aria-expanded', String(open));
            menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
            navLinks.classList.toggle('open', open);
        });
        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
        document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
        document.addEventListener('click', event => {
            if (!event.target.closest('.nav-container')) closeMenu();
        });
    }

    // Smooth in-page navigation with a native fallback.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        });
    });

    // Reveal content only when IntersectionObserver is available.
    if (!reducedMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
        document.querySelectorAll('.focus-card, .about-content, .quote-card, .social-card').forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });
    }

    // Navbar, scroll progress and back-to-top affordance.
    const navbar = document.querySelector('.navbar');
    const progress = document.querySelector('.scroll-progress');
    const backToTop = document.querySelector('.back-to-top');
    let ticking = false;
    function updateScrollUI() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.transform = `scaleX(${maxScroll > 0 ? scrollTop / maxScroll : 0})`;
        if (navbar) navbar.classList.toggle('scrolled', scrollTop > 30);
        if (backToTop) backToTop.classList.toggle('visible', scrollTop > 500);
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { window.requestAnimationFrame(updateScrollUI); ticking = true; }
    }, { passive: true });
    updateScrollUI();

    // Typing headline.
    const typingElement = document.querySelector('.typing-text');
    if (typingElement && !reducedMotion) {
        const words = ['Metaverse', 'Blockchain', 'Web3', 'GameFi', 'Chess'];
        let wordIndex = 0, charIndex = 0, deleting = false;
        const type = () => {
            const word = words[wordIndex];
            charIndex += deleting ? -1 : 1;
            typingElement.textContent = word.slice(0, charIndex);
            let delay = deleting ? 48 : 92;
            if (!deleting && charIndex === word.length) { deleting = true; delay = 1500; }
            else if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 350; }
            window.setTimeout(type, delay);
        };
        window.setTimeout(type, 500);
    }

    // Quote carousel with guarded timers and keyboard-accessible controls.
    const quotes = Array.from(document.querySelectorAll('.quote-card'));
    const indicators = Array.from(document.querySelectorAll('.indicator'));
    let currentQuote = 0;
    let quoteTimer = null;
    function showQuote(index) {
        if (!quotes.length) return;
        currentQuote = (index + quotes.length) % quotes.length;
        quotes.forEach((quote, i) => {
            quote.classList.toggle('active', i === currentQuote);
            quote.setAttribute('aria-hidden', String(i !== currentQuote));
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentQuote);
            indicator.setAttribute('aria-pressed', String(i === currentQuote));
        });
    }
    function stopCarousel() { if (quoteTimer) window.clearInterval(quoteTimer); quoteTimer = null; }
    function startCarousel() {
        stopCarousel();
        if (!reducedMotion && quotes.length > 1 && !document.hidden) {
            quoteTimer = window.setInterval(() => showQuote(currentQuote + 1), 6500);
        }
    }
    showQuote(0);
    indicators.forEach((indicator, index) => {
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('tabindex', '0');
        indicator.setAttribute('aria-label', `Show quote ${index + 1}`);
        const activate = () => { showQuote(index); startCarousel(); };
        indicator.addEventListener('click', activate);
        indicator.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
        });
    });
    const carousel = document.querySelector('.quotes-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);
        carousel.addEventListener('focusin', stopCarousel);
        carousel.addEventListener('focusout', startCarousel);
    }
    document.addEventListener('visibilitychange', () => document.hidden ? stopCarousel() : startCarousel());
    startCarousel();

    // Keep existing displayed stats, but animate only once when visible.
    if (!reducedMotion && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const number = entry.target.querySelector('.stat-number');
                if (!number) return;
                const label = number.textContent.trim();
                const finalNumber = parseInt(label, 10);
                if (!Number.isFinite(finalNumber)) return;
                const start = performance.now();
                const duration = 900;
                const animate = now => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    number.textContent = `${Math.round(finalNumber * eased)}+`;
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
                statsObserver.unobserve(entry.target);
            });
        }, { threshold: .6 });
        document.querySelectorAll('.stat-item').forEach(stat => statsObserver.observe(stat));
    }

    // Subtle tilt on pointer devices only.
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
        document.querySelectorAll('.social-card, .profile-card, .stat-item, .focus-card').forEach(card => {
            card.addEventListener('pointermove', event => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;
                card.style.transform = `perspective(900px) rotateX(${-y*3}deg) rotateY(${x*3}deg) translateY(-3px)`;
            });
            card.addEventListener('pointerleave', () => { card.style.transform = ''; });
        });
    }


    // Lightweight interactive chess movement demo (not a complete tournament rules engine).
    const chessBoard = document.getElementById('chess-board');
    if (chessBoard) {
        const glyphs = {
            white: { k:'♔', q:'♕', r:'♖', b:'♗', n:'♘', p:'♙' },
            black: { k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟' }
        };
        const initial = () => [
            ['br','bn','bb','bq','bk','bb','bn','br'],
            Array(8).fill('bp'),
            Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
            Array(8).fill('wp'),
            ['wr','wn','wb','wq','wk','wb','wn','wr']
        ];
        let board = initial(), turn = 'w', selected = null, legal = [], finished = false;
        const status = document.getElementById('chess-status');
        const turnChip = document.getElementById('chess-turn');
        const inside = (r,c) => r>=0 && r<8 && c>=0 && c<8;
        const side = piece => piece ? piece[0] : null;
        function movesFor(r,c) {
            const piece=board[r][c]; if(!piece) return [];
            const color=piece[0], kind=piece[1], moves=[];
            const add=(rr,cc)=>{ if(!inside(rr,cc)) return false; const target=board[rr][cc]; if(target && side(target)===color) return false; moves.push([rr,cc]); return !target; };
            if(kind==='p') {
                const dir=color==='w'?-1:1, home=color==='w'?6:1;
                if(inside(r+dir,c) && !board[r+dir][c]) {
                    add(r+dir,c);
                    if(r===home && !board[r+2*dir][c]) add(r+2*dir,c);
                }
                for(const dc of [-1,1]) if(inside(r+dir,c+dc) && board[r+dir][c+dc] && side(board[r+dir][c+dc])!==color) moves.push([r+dir,c+dc]);
            } else if(kind==='n') {
                for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r+dr,c+dc);
            } else if(kind==='k') {
                for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) if(dr||dc) add(r+dr,c+dc);
            } else {
                const dirs=[];
                if(kind==='b'||kind==='q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
                if(kind==='r'||kind==='q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
                dirs.forEach(([dr,dc])=>{ let rr=r+dr,cc=c+dc; while(inside(rr,cc)){ const empty=add(rr,cc); if(!empty) break; rr+=dr; cc+=dc; }});
            }
            return moves;
        }
        function renderBoard() {
            chessBoard.innerHTML='';
            for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
                const piece=board[r][c], square=document.createElement('button');
                square.type='button'; square.className='chess-square '+((r+c)%2?'dark':'light');
                square.setAttribute('role','gridcell');
                square.setAttribute('aria-label',`${'abcdefgh'[c]}${8-r}${piece ? ' '+(piece[0]==='w'?'white':'black')+' '+({k:'king',q:'queen',r:'rook',b:'bishop',n:'knight',p:'pawn'}[piece[1]]) : ' empty'}`);
                if(selected && selected[0]===r && selected[1]===c) square.classList.add('selected');
                const isMove=legal.some(([mr,mc])=>mr===r&&mc===c);
                if(isMove) square.classList.add(piece?'capture-target':'move-target');
                if(piece) { const span=document.createElement('span'); span.className='piece '+(piece[0]==='w'?'white-piece':'black-piece'); span.textContent=glyphs[piece[0]==='w'?'white':'black'][piece[1]]; square.appendChild(span); }
                if(isMove && !piece) { const dot=document.createElement('i'); dot.className='move-dot'; square.appendChild(dot); }
                square.addEventListener('click',()=>clickSquare(r,c));
                chessBoard.appendChild(square);
            }
            if(turnChip) turnChip.textContent=finished?'GAME OVER':(turn==='w'?'WHITE TO MOVE':'BLACK TO MOVE');
        }
        function clickSquare(r,c) {
            if(finished) return;
            const piece=board[r][c];
            if(selected && legal.some(([rr,cc])=>rr===r&&cc===c)) {
                const [fromR,fromC]=selected, moving=board[fromR][fromC], captured=board[r][c];
                board[r][c]=moving; board[fromR][fromC]=null;
                if(moving[1]==='p' && (r===0||r===7)) board[r][c]=moving[0]+'q';
                selected=null; legal=[];
                if(captured && captured[1]==='k') {
                    finished=true; if(status) status.textContent=(turn==='w'?'White':'Black')+' wins the demo by capturing the king.';
                } else {
                    turn=turn==='w'?'b':'w';
                    if(status) status.textContent=(turn==='w'?'White':'Black')+' to move. Select a piece.';
                }
                renderBoard(); return;
            }
            if(piece && piece[0]===turn) {
                selected=[r,c]; legal=movesFor(r,c);
                if(status) status.textContent=`${turn==='w'?'White':'Black'} ${({k:'king',q:'queen',r:'rook',b:'bishop',n:'knight',p:'pawn'}[piece[1]])} selected · choose a highlighted square.`;
            } else {
                selected=null; legal=[];
                if(status) status.textContent='Choose one of your own pieces first.';
            }
            renderBoard();
        }
        renderBoard();
        const reset=document.getElementById('chess-reset');
        if(reset) reset.addEventListener('click',()=>{ board=initial(); turn='w'; selected=null; legal=[]; finished=false; if(status) status.textContent='White to move. Select a piece to begin.'; renderBoard(); });
    }

    createParticles();
    console.log('%cTVLSUN — built with curiosity for the on-chain future.', 'color:#9aaaff;font-size:14px;font-weight:600');
});

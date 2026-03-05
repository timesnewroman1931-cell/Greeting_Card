class BirthdayCard {
    constructor() {
        this.isCandleLit = false;
        this.isEnvelopeOpened = false;
        
        this.elements = {
            envelopeScreen: document.getElementById('envelopeScreen'),
            envelope: document.getElementById('envelope'),
            cardContent: document.getElementById('cardContent'),
            flame: document.getElementById('flame'),
            interactiveCake: document.getElementById('interactiveCake'),
            candleSlider: document.getElementById('candleSlider'),
            candleValue: document.getElementById('candleValue'),
            candle: document.querySelector('.candle')
        };
        
        this.colors = {
            confetti: ["#FF4081", "#7C4DFF", "#40C4FF", "#FFD700", "#FF9800", "#76FF03", "#FF6F00"],
            hearts: ["#FF4081", "#E91E63", "#C2185B", "#FF5252"],
            sparkles: ["#FFD700", "#FFEB3B", "#FFF59D", "#FFF176"],
            fireworks: ["#FF4081", "#7C4DFF", "#40C4FF", "#FFD700", "#76FF03"],
            rainbow: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"],
            spirals: ["#FF4081", "#7C4DFF", "#40C4FF", "#00BCD4", "#4CAF50"],
            lightning: ["#FFFF00", "#FFEB3B", "#FFF176", "#FFD700"]
        };
        
        this.wishes = [
            "🍀 Вот тебе клевер, пожуй, удачу приносит",
            "💖 Сердечко, ну типо романтики и любви",
            "💰 Мешок денег, чтобы оплатить комуналку",
            "🎁 Подарков от жизни, в которых не будет дерьма",
            "💖 Еще одно сердечко, смайлики у меня кончились, другие делать не умею",
            "🎁 Ну и еще коробка, реально нет эмодзи других",

        ];
        
        this.effects = ['confetti', 'hearts', 'sparkles', 'fireworks', 'rainbow', 'spirals', 'lightning'];
        
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.adjustCandlePosition(); 
            this.initEnvelope();
        });
    }
    

    adjustCandlePosition() {
        if (this.elements.candle) {
            const currentBottom = parseInt(window.getComputedStyle(this.elements.candle).bottom) || 0;
            this.elements.candle.style.bottom = `${currentBottom + 50}px`;
        }
    }
    
    initEnvelope() {
        this.elements.envelope.addEventListener('click', () => this.openEnvelope());
        
        setInterval(() => {
            if (!this.isEnvelopeOpened && Math.random() < 0.2) {
                this.createEnvelopeSparkle();
            }
        }, 1000);
    }
    
    openEnvelope() {
        if (this.isEnvelopeOpened) return;
        
        this.isEnvelopeOpened = true;
        this.elements.envelope.classList.add('opening');
        
        this.createFlashEffect();
        this.createEnvelopeConfetti();
        
        setTimeout(() => {
            this.transitionToCard();
        }, 800);
    }
    
    transitionToCard() {
        this.elements.envelopeScreen.classList.add('hidden');
        document.body.classList.add('card-visible');
        this.elements.cardContent.classList.add('visible');
        
        this.initCandleSlider();
        this.initCakeInteraction();
        
        setTimeout(() => {
            this.showMessage("🎉 С Днём Рождения, высоковозрастная низкорослая и обворожительная Валерия!");
        }, 500);
        
        setTimeout(() => {
            this.activateEffect('confetti', 25);
        }, 1000);
    }
    
    initCandleSlider() {
        this.elements.candleSlider.addEventListener('input', () => {
            const value = parseInt(this.elements.candleSlider.value);
            this.isCandleLit = value === 1;
            
            this.elements.flame.classList.toggle('lit', this.isCandleLit);
            this.elements.candleValue.textContent = this.isCandleLit ? "Вкл" : "Выкл";
            
            if (this.isCandleLit) {
                this.createSparklesAroundCake();
                this.showMessage("✨ Загадай свое желание! ✨", 3000);
            }
        });
    }
    
    initCakeInteraction() {
        this.elements.interactiveCake.addEventListener('click', (e) => {
            e.stopPropagation();
            
            this.animateCakeClick();
            this.createCakeSparkles(e);
            
            const randomEffect = this.getRandomEffect();
            const randomWish = this.getRandomWish();
            
            this.activateEffect(randomEffect);
            this.showMessage(randomWish, 5000);
        });
    }

    
    createParticle(options) {
        const {
            type = 'particle',
            className = '',
            color = '#FFD700',
            size = 12,
            x = 0,
            y = 0,
            duration = 600,
            animation = [],
            onRemove = () => {}
        } = options;
        
        const particle = document.createElement('div');
        particle.className = `particle ${type} ${className}`;
        
        Object.assign(particle.style, {
            background: color,
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`,
            boxShadow: `0 0 ${size * 2}px ${color}`,
            borderRadius: '50%',
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: '10000'
        });
        
        document.body.appendChild(particle);
        
        const anim = particle.animate(animation, {
            duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        anim.onfinish = () => {
            particle.remove();
            onRemove();
        };
        
        return particle;
    }
    
    createSparkle(x, y, color = '#FFD700', size = 12, duration = 600) {
        return this.createParticle({
            type: 'sparkle-dot',
            color,
            size,
            x,
            y,
            duration,
            animation: [
                { transform: 'scale(1) rotate(0deg)', opacity: 1 },
                { transform: 'scale(1.8) rotate(180deg)', opacity: 0.9 },
                { transform: 'scale(0) rotate(360deg)', opacity: 0 }
            ]
        });
    }


    createEnvelopeSparkle() {
        const color = this.getRandomColor(['#FF4081', '#7C4DFF', '#40C4FF', '#FFD700']);
        
        this.createParticle({
            className: 'envelope-sparkle',
            color,
            size: 10,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            duration: 1500 + Math.random() * 800,
            animation: [
                { transform: 'scale(0)', opacity: 0 },
                { transform: 'scale(1.3)', opacity: 1 },
                { transform: 'scale(0)', opacity: 0 }
            ]
        });
    }
    
    createEnvelopeConfetti() {
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const color = this.getRandomColor(['#FF4081', '#7C4DFF', '#40C4FF', '#FFD700', '#FF9800']);
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 150;
                
                this.createParticle({
                    className: 'envelope-confetti',
                    color,
                    size: 15,
                    x: '50%',
                    y: '50%',
                    duration: 1000 + Math.random() * 800,
                    animation: [
                        { 
                            transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
                            opacity: 1 
                        },
                        { 
                            transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0) rotate(${Math.random() * 720}deg)`,
                            opacity: 0 
                        }
                    ]
                });
            }, i * 15);
        }
    }
    
    createFlashEffect() {
        const flash = document.createElement('div');
        flash.className = 'flash-effect';
        
        Object.assign(flash.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            zIndex: '9999',
            opacity: '0',
            pointerEvents: 'none'
        });
        
        document.body.appendChild(flash);
        
        flash.animate([
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        }).onfinish = () => flash.remove();
    }
    
    
    activateEffect(effect, count = null) {
        const effects = {
            confetti: () => this.createConfettiRain(count || 40),
            fireworks: () => this.createFireworks(count || 5),
            hearts: () => this.createHeartExplosion(count || 35),
            sparkles: () => this.createSparkleStorm(count || 60),
            spirals: () => this.createSpiralEffect(count || 5),
            rainbow: () => this.createRainbowEffect(count || 6),
            lightning: () => this.createLightningEffect(count || 6)
        };
        
        if (effects[effect]) {
            effects[effect]();
        }
    }
    
    createConfettiRain(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const color = this.getRandomColor(this.colors.confetti);
                const size = Math.random() * 15 + 8;
                const x = Math.random() * window.innerWidth;
                const endX = (Math.random() - 0.5) * 200;
                
                this.createParticle({
                    className: 'confetti-piece',
                    color,
                    size,
                    x,
                    y: -40,
                    duration: 1500 + Math.random() * 1000,
                    animation: [
                        { 
                            transform: 'translateY(0) rotate(0deg)',
                            opacity: 1 
                        },
                        { 
                            transform: `translate(${endX}px, 120vh) rotate(${Math.random() * 1080}deg)`,
                            opacity: 0 
                        }
                    ]
                });
            }, i * 15);
        }
    }
    
    createFireworks(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = 100 + Math.random() * window.innerHeight * 0.6;
                const color = this.getRandomColor(this.colors.fireworks);
                
                this.createSparkle(x, y, color, 45, 500);
                
                setTimeout(() => {
                    for (let j = 0; j < 20; j++) {
                        setTimeout(() => {
                            const angle = Math.random() * Math.PI * 2;
                            const distance = 30 + Math.random() * 80;
                            
                            this.createParticle({
                                className: 'firework-dot',
                                color,
                                size: 6,
                                x,
                                y,
                                duration: 800 + Math.random() * 600,
                                animation: [
                                    { 
                                        transform: 'translate(0, 0) scale(1)',
                                        opacity: 1 
                                    },
                                    { 
                                        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                                        opacity: 0 
                                    }
                                ]
                            });
                        }, j * 10);
                    }
                }, 100);
            }, i * 250);
        }
    }
    
    createHeartExplosion(count) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const heartTypes = ['❤️', '💖', '💕', '💗', '💓', '💘', '💝'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'particle heart-particle';
                
                heart.innerHTML = heartTypes[i % heartTypes.length];
                const color = this.colors.hearts[i % this.colors.hearts.length];
                const size = 2.2 + Math.random() * 1.5;
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 150;
                const rotation = Math.random() * 720;
                const scale = 0.7 + Math.random() * 0.6;
                
                Object.assign(heart.style, {
                    color,
                    fontSize: `${size}em`,
                    textShadow: `0 0 20px ${color}, 0 0 40px rgba(255, 255, 255, 0.8)`,
                    position: 'fixed',
                    left: `${centerX}px`,
                    top: `${centerY}px`,
                    zIndex: '10000',
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%) scale(0)'
                });
                
                document.body.appendChild(heart);
                
                heart.animate([
                    { 
                        transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                        opacity: 0
                    },
                    { 
                        transform: 'translate(-50%, -50%) scale(1.8) rotate(0deg)',
                        opacity: 1,
                        offset: 0.15
                    },
                    { 
                        transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(${scale}) rotate(${rotation}deg)`,
                        opacity: 0
                    }
                ], {
                    duration: 1800 + Math.random() * 800,
                    easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)'
                }).onfinish = () => heart.remove();
            }, i * 30);
        }
    }
    
    createSparkleStorm(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const color = this.getRandomColor(this.colors.sparkles);
                const size = Math.random() * 8 + 4;
                const x = Math.random() * window.innerWidth;
                
                this.createParticle({
                    className: 'sparkle-dot',
                    color,
                    size,
                    x,
                    y: -40,
                    duration: 1200 + Math.random() * 800,
                    animation: [
                        { 
                            transform: 'translateY(0) scale(1)',
                            opacity: 1 
                        },
                        { 
                            transform: 'translateY(110vh) scale(0.3)',
                            opacity: 0 
                        }
                    ]
                });
            }, i * 20);
        }
    }
    
    createSpiralEffect(count) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < count; i++) {
            const spiralCount = 24;
            const color = this.getRandomColor(this.colors.spirals);
            
            for (let j = 0; j < spiralCount; j++) {
                setTimeout(() => {
                    const angle = (j / spiralCount) * Math.PI * 2;
                    const distance = 100;
                    const turns = 2.5;
                    
                    const keyframes = [];
                    for (let k = 0; k <= 15; k++) {
                        const progress = k / 15;
                        const currentAngle = angle + progress * Math.PI * 2 * turns;
                        const currentDistance = progress * distance;
                        const x = Math.cos(currentAngle) * currentDistance;
                        const y = Math.sin(currentAngle) * currentDistance;
                        
                        keyframes.push({
                            transform: `translate(${x}px, ${y}px)`,
                            opacity: 1 - progress
                        });
                    }
                    
                    this.createParticle({
                        className: 'spiral-particle',
                        color,
                        size: 9,
                        x: centerX,
                        y: centerY,
                        duration: 1800,
                        animation: keyframes
                    });
                }, i * 150 + j * 10);
            }
        }
    }
    
    createRainbowEffect(count) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < count; i++) {
            this.colors.rainbow.forEach((color, colorIndex) => {
                for (let j = 0; j < 9; j++) {
                    setTimeout(() => {
                        const angle = Math.random() * Math.PI * 2;
                        const distance = 80 + Math.random() * 120;
                        
                        this.createParticle({
                            className: 'rainbow-particle',
                            color,
                            size: 14,
                            x: centerX,
                            y: centerY,
                            duration: 1100 + Math.random() * 700,
                            animation: [
                                { 
                                    transform: 'translate(0, 0) scale(1)',
                                    opacity: 1 
                                },
                                { 
                                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                                    opacity: 0 
                                }
                            ]
                        });
                    }, i * 60 + colorIndex * 20 + j * 3);
                }
            });
        }
    }
    
    createLightningEffect(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const startX = Math.random() * window.innerWidth;
                const endX = startX + (Math.random() - 0.5) * 200;
                const color = this.getRandomColor(this.colors.lightning);
                
                for (let j = 0; j < 6; j++) {
                    setTimeout(() => {
                        const segmentX = startX + (j/6) * (endX - startX) + (Math.random() - 0.5) * 35;
                        const segmentY = (j/6) * window.innerHeight * 0.9;
                        
                        this.createParticle({
                            className: 'lightning-particle',
                            color,
                            width: 8,
                            height: 35,
                            x: segmentX,
                            y: segmentY,
                            duration: 200 + Math.random() * 150,
                            animation: [
                                { opacity: 0, filter: 'brightness(1)' },
                                { opacity: 1, filter: 'brightness(4)' },
                                { opacity: 0.7, filter: 'brightness(2)' },
                                { opacity: 1, filter: 'brightness(5)' },
                                { opacity: 0, filter: 'brightness(1)' }
                            ],
                            iterations: 2
                        });
                    }, j * 25);
                }
            }, i * 350);
        }
    }
    
    
    animateCakeClick() {
        this.elements.interactiveCake.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.elements.interactiveCake.style.transform = '';
        }, 250);
    }
    
    createCakeSparkles(event) {
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                this.createSparkle(event.clientX, event.clientY, '#FFD700', 10, 600);
            }, i * 30);
        }
    }
    
    createSparklesAroundCake() {
        const rect = this.elements.interactiveCake.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2 - 150;
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 20 + Math.random() * 35;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                this.createSparkle(x, y, '#FFD700', 12, 800);
            }, i * 50);
        }
    }
    
    
    showMessage(text, duration = 5000) { 
        const oldMessage = document.querySelector('.message-popup');
        if (oldMessage) oldMessage.remove();
        
        const message = document.createElement('div');
        message.className = 'message-popup';
        message.textContent = text;
        
        document.body.appendChild(message);

        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.textAlign = 'center';
        
        message.animate([
            { top: '-100px', opacity: 0, transform: 'translateX(-50%) scale(0.8)' },
            { top: '20px', opacity: 1, transform: 'translateX(-50%) scale(1)' }
        ], {
            duration: 600,
            easing: 'ease-out',
            fill: 'forwards'
        });
        
        setTimeout(() => {
            message.animate([
                { top: '20px', opacity: 1, transform: 'translateX(-50%) scale(1)' },
                { top: '-100px', opacity: 0, transform: 'translateX(-50%) scale(0.8)' }
            ], {
                duration: 600,
                easing: 'ease-in'
            }).onfinish = () => message.remove();
        }, duration);
    }

    
    getRandomColor(colorArray) {
        return colorArray[Math.floor(Math.random() * colorArray.length)];
    }
    
    getRandomEffect() {
        return this.effects[Math.floor(Math.random() * this.effects.length)];
    }
    
    getRandomWish() {
        return this.wishes[Math.floor(Math.random() * this.wishes.length)];
    }
}


const birthdayCard = new BirthdayCard();

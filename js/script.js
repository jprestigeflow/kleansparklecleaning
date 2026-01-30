
    gsap.registerPlugin(ScrollTrigger);

    document.addEventListener('DOMContentLoaded', () => {
        const tl = gsap.timeline({ delay: 0.5 });
        tl.to('.door-left', { xPercent: -100, duration: 1.5, ease: 'power4.inOut', onStart: forceVideoPlay })
          .to('.door-right', { xPercent: 100, duration: 1.5, ease: 'power4.inOut' }, "<")
          .to('.door-overlay', { display: 'none' })
          .from('.hero-content > *', { y: 50, opacity: 0, stagger: 0.2 });

        function forceVideoPlay() {
            const vid = document.querySelector('.hero-video');
            if(vid) { 
                vid.muted = true; 
                vid.setAttribute('playsinline', '');
                vid.play().catch(e => console.log("Mobile Autoplay Playback Issue:", e)); 
            }
        }

        const cursor = document.getElementById('cursor');
        if (window.innerWidth > 1024) {
            const xTo = gsap.quickTo(cursor, "x", {duration: 0.1, ease: "power3"});
            const yTo = gsap.quickTo(cursor, "y", {duration: 0.1, ease: "power3"});
            window.addEventListener("mousemove", e => { xTo(e.clientX); yTo(e.clientY); });
        }

        window.addEventListener('scroll', () => {
            let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            document.getElementById("progress-bar").style.width = (winScroll / height) * 100 + "%";
        });

        const slider = document.querySelector('.slider-container');
        if(slider) {
            const updateSlider = (clientX) => {
                const rect = slider.getBoundingClientRect();
                const x = clientX - rect.left;
                const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
                document.querySelector('.slider-before').style.width = percent + '%';
                document.querySelector('.slider-handle').style.left = percent + '%';
            };
            slider.addEventListener('mousemove', e => updateSlider(e.clientX));
            slider.addEventListener('touchmove', e => { e.preventDefault(); updateSlider(e.touches[0].clientX); });
        }

        gsap.utils.toArray('.reveal').forEach(elem => {
            gsap.from(elem, { scrollTrigger: { trigger: elem, start: "top 85%" }, y: 50, opacity: 0, duration: 1 });
        });

        const range = document.getElementById('sqft-range');
        if(range) {
            range.addEventListener('input', e => { document.getElementById('sqft-display').innerText = parseInt(e.target.value).toLocaleString() + " sq. ft."; });
        }
    });

    function showTab(category) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        document.querySelectorAll('.service-card').forEach(card => {
            if (category === 'all' || card.classList.contains(category)) {
                card.classList.add('active'); gsap.fromTo(card, {opacity: 0, y: 10}, {opacity: 1, y: 0});
            } else { card.classList.remove('active'); }
        });
    }

    let currentStep = 1;
    let selectedType = null;
    let selectedService = null;

    function selectOption(el, type, step) { 
        const container = el.parentElement;
        container.querySelectorAll('.form-option').forEach(o => o.classList.remove('selected')); 
        el.classList.add('selected'); 
        if(step === 1) selectedType = type;
        if(step === 2) selectedService = type;
    }

    function nextStep() {
        if (currentStep === 1 && !selectedType) { alert("Please select a space type."); return; }
        if (currentStep === 2 && !selectedService) { alert("Please select a service."); return; }
        gsap.to(`#step-${currentStep}`, { opacity: 0, x: -50, display: 'none', onComplete: () => {
            currentStep++; const next = document.getElementById(`step-${currentStep}`);
            if(next) { next.style.display = 'block'; gsap.fromTo(next, { opacity: 0, x: 50 }, { opacity: 1, x: 0 }); }
        }});
    }

    function submitForm(e) {
        e.preventDefault();
        const company = document.getElementById('company').value;
        const phone = document.getElementById('phone').value;
        if (!company || !phone) { alert("Company Name and Phone Number are required."); return; }
        document.getElementById('submit-btn').innerText = "Request Sent ✓";
        document.getElementById('submit-btn').style.backgroundColor = "#22c55e";
    }
    
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. GLOBAL: CARREGAR FOOTER (Em todas as páginas) ---
    const footerPlace = document.getElementById('footer-placeholder');
    if (footerPlace) {
        fetch('./footer.html') // 0 './' ajuda o navegador a localizar na raiz
            .then(res => {
                if (!res.ok) throw new Error('Erro ao carregar footer');
                return res.text();
            })
            .then(data => { footerPlace.innerHTML = data; })
            .catch(err => console.error(err));
    }

    // --- 2. NAVEGAÇÃO: REQUEST A QUOTE (Dropdown na Nav) ---
    const quoteBtn = document.getElementById('quoteTrigger');
    const quoteDropdown = document.getElementById('quoteDropdown');

    if (quoteBtn && quoteDropdown) {
        quoteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            quoteDropdown.classList.toggle('active');
        });

        // Fecha se clicar fora do dropdown
        window.addEventListener('click', function(event) {
            if (!quoteBtn.contains(event.target) && !quoteDropdown.contains(event.target)) {
                quoteDropdown.classList.remove('active');
            }
        });
    }

    // --- 3. MODAL DE QUOTE (Caso use a função openQuoteModal) ---
    // Estas funções ficam globais para serem chamadas pelo onclick no HTML
    window.openQuoteModal = function() {
        const modal = document.getElementById("quoteModal");
        if(modal) {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        }
    };

    window.closeQuoteModal = function() {
        const modal = document.getElementById("quoteModal");
        if(modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    // --- 4. TIMER DE CONTAGEM REGRESSIVA ---
    const deadline = new Date("2026-05-06T23:59:59+02:00").getTime();
    const timerContainer = document.getElementById("countdown-timer");

    if (timerContainer) {
        const timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const t = deadline - now;

            if (t >= 0) {
                let days = Math.floor(t / (1000 * 60 * 60 * 24));
                let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
                let secs = Math.floor((t % (1000 * 60)) / 1000);

                if(document.getElementById("time-days")) document.getElementById("time-days").innerText = String(days).padStart(2, '0');
                if(document.getElementById("time-hours")) document.getElementById("time-hours").innerText = String(hours).padStart(2, '0');
                if(document.getElementById("time-mins")) document.getElementById("time-mins").innerText = String(mins).padStart(2, '0');
                if(document.getElementById("time-secs")) document.getElementById("time-secs").innerText = String(secs).padStart(2, '0');
            } else {
                clearInterval(timerInterval);
                timerContainer.innerHTML = "REGISTRATION CLOSED";
            }
        }, 1000);
    }

    // --- 5. LÓGICA DE GPS E SUBMISSÃO DE VAGAS ---
    const COUNTRY_COORDS = {
        "Mozambique": { lat: -25.9667, lon: 32.5833 },
        "Remote": { lat: -25.9667, lon: 32.5833 },
        "International": { lat: -25.7479, lon: 28.2293 }
    };

    document.querySelectorAll('form').forEach(form => {
        // Ignora o formulário de parceiros se ele for tratado separadamente
        if (form.id === 'partnerForm') return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const theForm = e.target;
            const btnApply = theForm.querySelector('button');
            const jobCountry = theForm.closest('.app-form')?.getAttribute('data-country') || "Mozambique";

            btnApply.innerText = 'Checking GPS...';
            btnApply.disabled = true;

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const dist = calculateDistance(
                        position.coords.latitude,
                        position.coords.longitude,
                        COUNTRY_COORDS[jobCountry].lat,
                        COUNTRY_COORDS[jobCountry].lon
                    );

                    if (dist > 300) {
                        if (confirm(`Notice: You are ${dist.toFixed(0)}km away. Is your address correct?`)) {
                            finalizeSubmission(theForm, btnApply);
                        } else {
                            btnApply.innerText = 'Submit Application';
                            btnApply.disabled = false;
                        }
                    } else {
                        finalizeSubmission(theForm, btnApply);
                    }
                }, () => finalizeSubmission(theForm, btnApply));
            } else {
                finalizeSubmission(theForm, btnApply);
            }
        });
    });

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function finalizeSubmission(theForm, btnApply) {
        btnApply.innerText = 'Processing...';
        setTimeout(() => {
            const card = theForm.closest('.jobs-card') || theForm;
            card.innerHTML = `
                <div style="padding: 40px; text-align: center; background: white; border-radius: 8px; border: 2px solid #ff8c00;">
                    <h2 style="color: #ff8c00;">🎉 Application Sent!</h2>
                    <p>Thank you for registering. Classification in 24 hours.</p>
                </div>`;
        }, 1500);
    }

    // --- 6. PARTNER FORM ---
    const partnerForm = document.getElementById('partnerForm');
    if (partnerForm) {
        partnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Partner data captured");
            alert("Partner application received!");
        });
    }
});
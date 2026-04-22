document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('check-btn');
    const walletInput = document.getElementById('wallet-address');
    const scanningStatus = document.getElementById('scanning-status');
    const protocolOverlay = document.getElementById('protocol-overlay');
    const progressFill = document.querySelector('.progress-fill');
    const resultEligible = document.getElementById('result-eligible');
    const resultNotEligible = document.getElementById('result-not-eligible');
    const walletDisplay = document.getElementById('wallet-display');
    
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];

    checkBtn.addEventListener('click', async () => {
        const address = walletInput.value.trim();
        if (!address) {
            alert('Please enter a wallet address');
            return;
        }

        // Reset state
        resultEligible.classList.add('hidden');
        resultEligible.classList.remove('eligible-glow');
        resultNotEligible.classList.add('hidden');
        resultNotEligible.classList.remove('not-eligible-glow');
        protocolOverlay.classList.add('hidden');
        
        // Show scanning animation on the left
        scanningStatus.classList.remove('hidden');
        checkBtn.disabled = true;
        checkBtn.textContent = 'Verifying...';

        // Wait a bit to simulate "scanning"
        await sleep(1500);
        
        // Hide scanning, show protocol overlay on the right
        scanningStatus.classList.add('hidden');
        protocolOverlay.classList.remove('hidden');

        // Simulate protocol initialization
        await runProtocol();

        // Final result simulation
        protocolOverlay.classList.add('hidden');
        
        // 70% chance eligible for demo purposes, or based on address length
        const isEligible = address.length > 10 && Math.random() > 0.3;
        
        if (isEligible) {
            walletDisplay.textContent = formatAddress(address);
            resultEligible.classList.remove('hidden');
            resultEligible.classList.add('eligible-glow');
        } else {
            resultNotEligible.classList.remove('hidden');
            resultNotEligible.classList.add('not-eligible-glow');
        }

        checkBtn.disabled = false;
        checkBtn.textContent = 'Check Eligibility';
    });

    async function runProtocol() {
        let progress = 0;
        
        for (let i = 0; i < steps.length; i++) {
            steps[i].classList.add('active');
            
            // Increment progress for each step
            const targetProgress = ((i + 1) / steps.length) * 100;
            while (progress < targetProgress) {
                progress += Math.random() * 5;
                if (progress > targetProgress) progress = targetProgress;
                progressFill.style.width = `${progress}%`;
                await sleep(50);
            }
            
            await sleep(800);
        }
        
        await sleep(500);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function formatAddress(addr) {
        if (addr.endsWith('.eth')) return addr;
        if (addr.length < 10) return addr;
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    }
});

import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('check-btn');
    const walletInput = document.getElementById('wallet-address');
    const scanningStatus = document.getElementById('scanning-status');
    const protocolOverlay = document.getElementById('protocol-overlay');
    const progressFill = document.querySelector('.progress-fill');
    const resultEligible = document.getElementById('result-eligible');
    const resultNotEligible = document.getElementById('result-not-eligible');
    const walletDisplay = document.getElementById('wallet-display');
    const errorMessage = document.getElementById('error-message');
    const inputWrapper = document.querySelector('.input-wrapper');
    
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];

    checkBtn.addEventListener('click', async () => {
        const address = walletInput.value.trim();
        
        // Custom Validation
        errorMessage.classList.add('hidden');
        inputWrapper.classList.remove('input-error');

        if (!address) {
            showError('Please enter your EVM address');
            return;
        }

        if (!isValidEVMAddress(address)) {
            showError('Please enter a valid EVM address (0x...)');
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
        
        try {
            // Query Supabase for the wallet address
            const { data, error } = await supabase
                .from('wallets')
                .select('*')
                .eq('address', address.toLowerCase())
                .maybeSingle(); // Use maybeSingle to avoid error if not found

            if (data && !error) {
                // Address found in database
                walletDisplay.textContent = formatAddress(address);
                
                // Update UI based on type (GTD or FCFS)
                const tierElement = document.getElementById('eligibility-tier');
                const allocationElement = document.getElementById('mint-allocation');
                const accessText = document.querySelector('#result-eligible p');
                
                if (data.type === 'GTD') {
                    tierElement.textContent = 'Guaranteed MINT (GTD)';
                    tierElement.style.color = '#ffd700';
                    accessText.textContent = 'You are selected for Guaranteed MINT';
                } else if (data.type === 'FCFS') {
                    tierElement.textContent = 'First Come First Serve (FCFS)';
                    tierElement.style.color = '#00e5ff';
                    accessText.textContent = 'You are selected for FCFS MINT';
                } else {
                    tierElement.textContent = 'Eligible';
                    accessText.textContent = 'You are selected for SLOYARD';
                }

                allocationElement.textContent = `Mint allocation: ${data.allocation || 1} SLOYARD NFT`;
                
                resultEligible.classList.remove('hidden');
                resultEligible.classList.add('eligible-glow');
            } else {
                // Not found in database or error occurred
                resultNotEligible.classList.remove('hidden');
                resultNotEligible.classList.add('not-eligible-glow');
            }
        } catch (err) {
            console.error('Error fetching eligibility:', err);
            // Fallback to not eligible on unexpected errors
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

    function isValidEVMAddress(addr) {
        return /^0x[a-fA-F0-9]{40}$/.test(addr);
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
        inputWrapper.classList.add('input-error');
        
        // Remove error after 3 seconds
        setTimeout(() => {
            errorMessage.classList.add('hidden');
            inputWrapper.classList.remove('input-error');
        }, 3000);
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

let currentInput = '';
        let operator = '';
        let previousInput = '';
        let shouldResetDisplay = false;

        function appendToDisplay(value) {
            const display = document.getElementById('display');
            
            if (shouldResetDisplay) {
                display.value = '';
                shouldResetDisplay = false;
            }
            
            if (display.value === '0' && value !== '.') {
                display.value = value;
            } else {
                display.value += value;
            }

            // Add ripple effect
            addRippleEffect(event.target);
        }

        function clearDisplay() {
            document.getElementById('display').value = '';
            currentInput = '';
            operator = '';
            previousInput = '';
            shouldResetDisplay = false;
            addRippleEffect(event.target);
        }

        function deleteLast() {
            const display = document.getElementById('display');
            display.value = display.value.slice(0, -1);
            addRippleEffect(event.target);
        }

        function calculate() {
            const display = document.getElementById('display');
            display.classList.add('calculating');
            
            setTimeout(() => {
                try {
                    // Replace display symbols with actual operators
                    let expression = display.value
                        .replace(/×/g, '*')
                        .replace(/÷/g, '/')
                        .replace(/−/g, '-');
                    
                    let result = eval(expression);
                    
                    // Handle division by zero and other edge cases
                    if (!isFinite(result)) {
                        display.value = 'Error';
                    } else {
                        // Format the result to avoid floating point precision issues
                        result = Math.round(result * 100000000) / 100000000;
                        display.value = result;
                    }
                    
                    shouldResetDisplay = true;
                } catch (e) {
                    display.value = 'Error';
                    shouldResetDisplay = true;
                }
                
                display.classList.remove('calculating');
            }, 200);

            addRippleEffect(event.target);
        }

        function addRippleEffect(button) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        // Enhanced keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            // Prevent default behavior for calculator keys
            if (/[0-9+\-*/.=]/.test(key) || ['Enter', 'Escape', 'Backspace'].includes(key)) {
                event.preventDefault();
            }
            
            if (/[0-9.]/.test(key)) {
                appendToDisplay(key);
            } else if (['+', '-'].includes(key)) {
                appendToDisplay(key);
            } else if (key === '*') {
                appendToDisplay('*');
            } else if (key === '/') {
                appendToDisplay('/');
            } else if (key === 'Enter' || key === '=') {
                calculate();
            } else if (key === 'Escape') {
                clearDisplay();
            } else if (key === 'Backspace') {
                deleteLast();
            }
        });

        // Initialize display
        document.getElementById('display').value = '';
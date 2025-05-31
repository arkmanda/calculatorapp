class Calculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.expression = '';
        this.isCalculated = false;
        this.resultElement = document.getElementById('result');
        this.expressionElement = document.getElementById('expression');
        this.displayElement = document.querySelector('.display');
        this.updateDisplay();
    }

    updateDisplay() {
        // Format number for display
        let displayValue = this.currentValue;
        
        // Handle very long numbers
        if (displayValue.length > 12) {
            if (displayValue.includes('.')) {
                displayValue = parseFloat(displayValue).toExponential(6);
            } else {
                displayValue = parseFloat(displayValue).toExponential(6);
            }
        }
        
        this.resultElement.textContent = displayValue;
        this.expressionElement.textContent = this.expression;
        
        // Toggle calculated state
        if (this.isCalculated) {
            this.displayElement.classList.add('calculated');
        } else {
            this.displayElement.classList.remove('calculated');
        }
        
        this.resultElement.classList.add('animate');
        
        setTimeout(() => {
            this.resultElement.classList.remove('animate');
        }, 300);
    }

    inputNumber(num) {
        if (this.isCalculated) {
            this.clear();
        }
        
        if (this.waitingForOperand) {
            this.currentValue = num;
            this.waitingForOperand = false;
        } else {
            if (num === '.' && this.currentValue.includes('.')) {
                return; // Prevent multiple decimal points
            }
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
        
        // Update expression display
        if (this.expression === '' || this.waitingForOperand) {
            this.expression = this.currentValue;
        } else {
            // Replace the last number in expression with current value
            this.expression = this.expression.replace(/[\d.]+$/, this.currentValue);
        }
        
        this.updateDisplay();
    }

    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentValue);

        if (nextOperator === 'x²') {
            this.expression = this.currentValue + '²';
            this.currentValue = String(Math.pow(inputValue, 2));
            this.isCalculated = false;
            this.updateDisplay();
            return;
        }

        if (this.isCalculated) {
            this.expression = this.currentValue;
            this.isCalculated = false;
        }

        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operation && !this.waitingForOperand) {
            const newValue = this.performCalculation();
            this.currentValue = String(newValue);
            this.previousValue = newValue;
        }

        // Add operator to expression
        let opSymbol = nextOperator;
        if (nextOperator === '^') opSymbol = '^';
        
        if (!this.expression.includes(this.currentValue)) {
            this.expression = this.currentValue;
        }
        this.expression += ' ' + opSymbol + ' ';

        this.waitingForOperand = true;
        this.operation = nextOperator;
        this.updateDisplay();
    }

    performCalculation() {
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        if (isNaN(prev) || isNaN(current)) return current;

        switch (this.operation) {
            case '+':
                return prev + current;
            case '-':
                return prev - current;
            case '×':
                return prev * current;
            case '÷':
                return current !== 0 ? prev / current : 0;
            case '^':
                return Math.pow(prev, current);
            default:
                return current;
        }
    }

    calculate() {
        if (this.operation && this.previousValue !== null && !this.waitingForOperand) {
            // Complete the expression
            if (!this.expression.includes(this.currentValue) || this.expression.endsWith(' ')) {
                this.expression = this.expression.trim() + ' ' + this.currentValue;
            }
            
            const newValue = this.performCalculation();
            this.currentValue = String(newValue);
            this.previousValue = null;
            this.operation = null;
            this.waitingForOperand = true;
            this.isCalculated = true;
            this.updateDisplay();
        }
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.expression = '';
        this.isCalculated = false;
        this.updateDisplay();
    }

    clearEntry() {
        this.currentValue = '0';
        if (this.isCalculated) {
            this.expression = '';
            this.isCalculated = false;
        } else {
            // Update expression to remove the last number
            this.expression = this.expression.replace(/[\d.]+$/, '0');
        }
        this.updateDisplay();
    }
}

// Initialize calculator
const calc = new Calculator();

// Global functions for HTML onclick events
function inputNumber(num) {
    calc.inputNumber(num);
}

function inputOperator(op) {
    calc.inputOperator(op);
}

function calculate() {
    calc.calculate();
}

function clearAll() {
    calc.clear();
}

function clearEntry() {
    calc.clearEntry();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/=.'.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Numbers and decimal point
    if ('0123456789.'.includes(key)) {
        inputNumber(key);
    }
    
    // Operators
    switch (key) {
        case '+':
            inputOperator('+');
            break;
        case '-':
            inputOperator('-');
            break;
        case '*':
            inputOperator('×');
            break;
        case '/':
            inputOperator('÷');
            break;
        case '^':
            inputOperator('^');
            break;
        case 'Enter':
        case '=':
            calculate();
            break;
        case 'Escape':
            clearAll();
            break;
        case 'Backspace':
            clearEntry();
            break;
    }
});
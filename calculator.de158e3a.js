const display = document.getElementById('display');
const keyboard = document.querySelector('.keyboard');
let currentNumber = '0';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;
const updatedisplay = ()=>{
    display.textContent = currentNumber;
    if (waitingForSecondOperand) display.textContent = `${firstOperand} ${operator} ${currentNumber}`;
};
const handleNumber = (number)=>{
    if (currentNumber.length >= 12 && number !== '.') return;
    if (number === '.') {
        if (currentNumber.includes('.')) return;
        currentNumber += number;
        display.classList.remove('error');
        if (currentNumber === '.' && currentNumber === '') display.classList.add('error');
    } else if (currentNumber === '0' || currentNumber === '') {
        if (operator === '/' && number === '0') display.classList.add('error');
        currentNumber = number;
    } else currentNumber += number;
};
const handleOperator = (nextOperator)=>{
    if (operator !== null && nextOperator === '-' && currentNumber === '') {
        currentNumber = nextOperator;
        updatedisplay();
        return;
    }
    if (operator === null && nextOperator === '-' && currentNumber === '0') {
        currentNumber = nextOperator;
        updatedisplay();
        return;
    }
    if (waitingForSecondOperand === true) {
        calculate();
        firstOperand = +currentNumber.trim();
        operator = nextOperator.trim();
        currentNumber = '';
        waitingForSecondOperand = true;
        updatedisplay();
    } else {
        firstOperand = +currentNumber.trim();
        operator = nextOperator.trim();
        currentNumber = '';
        waitingForSecondOperand = true;
        updatedisplay();
    }
};
const handleBackspace = ()=>{
    if (waitingForSecondOperand && currentNumber !== '') {
        currentNumber = currentNumber.slice(0, -1);
        if (currentNumber === '' || currentNumber === '-') currentNumber = '';
        if (currentNumber === '0') {
            display.classList.add('error');
            return;
        }
    } else if (waitingForSecondOperand && currentNumber === '') {
        currentNumber = firstOperand.toString();
        operator = null;
        firstOperand = null;
        waitingForSecondOperand = false;
    } else {
        currentNumber = currentNumber.slice(0, -1);
        if (currentNumber === '' || currentNumber === '-') currentNumber = '0';
    }
    display.classList.remove('error');
    updatedisplay();
};
const reset = ()=>{
    currentNumber = '0';
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;
    display.classList.remove('error');
};
const calculate = ()=>{
    let result;
    switch(operator){
        case '+':
            result = firstOperand + +currentNumber.trim();
            break;
        case '-':
            result = firstOperand - +currentNumber.trim();
            break;
        case '*':
            result = firstOperand * +currentNumber.trim();
            break;
        case '/':
            if (+currentNumber.trim() === 0) {
                reset();
                return;
            }
            result = firstOperand / +currentNumber.trim();
            break;
    }
    currentNumber = parseFloat(result.toFixed(4)).toString();
    waitingForSecondOperand = false;
    updatedisplay();
};
keyboard.addEventListener('click', (event)=>{
    const { target } = event;
    const number = target.dataset.value;
    if (number) handleNumber(number);
    const nextOperator = target.dataset.operator;
    if (nextOperator) handleOperator(nextOperator);
    const clear = target.id === 'clear';
    if (clear) reset();
    const equals = target.id === 'equals';
    if (equals) calculate();
    const backspace = target.id === 'backspace';
    if (backspace) handleBackspace();
    updatedisplay();
});
keyboard.addEventListener('keydown', (event)=>{
    const { key, code } = event;
    if (key === ' ' || key === 'Enter') event.preventDefault();
    if (!isNaN(parseInt(key)) && key !== ' ') {
        console.log(key);
        handleNumber(key);
    }
    if (key === '.' || code === 'NumpadDecimal') handleNumber('.');
    if (key === '+' || key === '-' || key === '*' || key === '/') handleOperator(key);
    if (key === 'Enter' || key === '=') {
        calculate();
        operator = null;
    } else if (key === 'Backspace') handleBackspace();
    else if (key === 'Delete') reset();
    updatedisplay();
});

//# sourceMappingURL=calculator.de158e3a.js.map

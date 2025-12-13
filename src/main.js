const display = document.getElementById('display');
const keyboard = document.querySelector('.keyboard');

let currentNumber = '0';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;

const updatedisplay = () => {
  display.textContent = currentNumber;

  if (waitingForSecondOperand) {
    display.textContent = `${firstOperand} ${operator} ${currentNumber}`;
  }
}

const handleNumber = (number) => {
  if (currentNumber.length >= 12 && number !== '.') {
    return;  // Не дозволяємо вводити більше
  }

  if (number === '.') {

    if (currentNumber.includes('.')) {
      return;
    }

    currentNumber += number;
    display.classList.remove('error')

    if (currentNumber === '.') {
      display.classList.add('error');
    }

  } else if (currentNumber === '0' || currentNumber === '') {

    if (operator === '/' && number === '0') {
      display.classList.add('error');
    }
    currentNumber = number;
  } else {
    currentNumber += number;
  }
}


const handleOperator = (nextOperator) => {
  if (operator !== null && nextOperator === '-' && currentNumber === '') {
    currentNumber = nextOperator;

    updatedisplay()
    return;
  }

  if (operator === null && nextOperator === '-' && currentNumber === '0') {
    currentNumber = nextOperator;
    updatedisplay();
    return;
  }

  if (waitingForSecondOperand === true) {
    calculate();

    firstOperand = +currentNumber.trim()
    operator = nextOperator.trim();
    currentNumber = '';
    waitingForSecondOperand = true;

    updatedisplay();
  } else {
    firstOperand = +currentNumber.trim()
    operator = nextOperator.trim();
    currentNumber = '';
    waitingForSecondOperand = true;

    updatedisplay();
  }



}

const handleBackspace = () => {
  // Якщо вводимо друге число
  if (waitingForSecondOperand && currentNumber !== '') {
    currentNumber = currentNumber.slice(0, -1);  // Стерти останній символ
    if (currentNumber === '' || currentNumber === '-') {
      currentNumber = '';  // Залишити порожнім
    }

    if (currentNumber === '0') {
      display.classList.add('error')
      return
    }
  }
  // Якщо натиснули оператор, але не ввели друге число
  else if (waitingForSecondOperand && currentNumber === '') {
    // Скасувати оператор, повернутись до редагування першого числа
    currentNumber = firstOperand.toString();
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;
  }
  // Звичайне стирання (перше число або результат)
  else {
    currentNumber = currentNumber.slice(0, -1);
    if (currentNumber === '' || currentNumber === '-') {
      currentNumber = '0';
    }
  }
  display.classList.remove('error')

  updatedisplay();
}

const reset = () => {
  currentNumber = '0';
  operator = null;
  firstOperand = null;
  waitingForSecondOperand = false;
  display.classList.remove('error')
}

const calculate = () => {
  let result;

  switch (operator) {
    case '+': result = firstOperand + (+currentNumber.trim()); break;
    case '-': result = firstOperand - (+currentNumber.trim()); break;
    case '*': result = firstOperand * (+currentNumber.trim()); break;
    case '/':
      if (+currentNumber.trim() === 0) {
        reset();
        return;
      }
      result = firstOperand / (+currentNumber.trim()); break;

  }


  currentNumber = parseFloat(result.toFixed(4)).toString();
  waitingForSecondOperand = false;

  updatedisplay()
}

keyboard.addEventListener('click', (event) => {
  const { target } = event;
  const number = target.dataset.value;

  if (number) {
    handleNumber(number)
  }

  const nextOperator = target.dataset.operator;

  if (nextOperator) {
    handleOperator(nextOperator)
  }

  const clear = target.id === 'clear';

  if (clear) {
    reset();
  }

  const equals = target.id === 'equals';

  if (equals) {
    calculate();
  }

  const backspace = target.id === 'backspace';

  if (backspace) {
    handleBackspace();
  }

  updatedisplay();
})

document.addEventListener('keydown', (event) => {
  // Предотвращаем прокрутку страницы при нажатии пробела
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
  }

  const key = event.key;
  const code = event.code;

  // 1. Обработка чисел (основной ряд и Numpad)
  if (!isNaN(parseInt(key)) && key !== ' ') {
    handleNumber(key);
  }

  if (key === '.' || key === ',' || code === 'NumpadDecimal') {
    event.preventDefault(); // Предотвращаем ввод символа, если нужно
    handleNumber('.');      // Вызываем handleNumber с точкой
  }

  // 2. Обработка операторов
  if (key === '+' || key === '-' || key === '*' || key === '/') {
    handleOperator(key);
  }

  // 3. Обработка действий (Enter, Backspace, Clear)
  if (key === 'Enter' || key === '=') {
    calculate();
    // ВАЖНО: оператор = null вы сбрасываете в handleOperator, но при нажатии "=" его нужно сбросить явно
    operator = null;
  } else if (key === 'Backspace') {
    handleBackspace();
  } else if (key === 'Delete') {
    reset();
  }

  // 4. Обновление дисплея после обработки клавиатуры
  updatedisplay();
});
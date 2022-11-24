'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 240],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 980],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2022-02-22T14:43:26.374Z',
    '2022-02-25T18:49:59.371Z',
    '2022-02-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const accounts = [account1, account2];
account1.movementsDates.push(`2022-02-26T23:07:09.413Z`);
account2.movementsDates.push(`2022-02-26T23:07:09.413Z`);

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelCreate = document.querySelector('.create');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const inputLogin = document.querySelector('.login');
const inputCreate = document.querySelector('.createAcc');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnCreate = document.querySelector('.create__btn');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputCreateName = document.querySelector('.create__input--name');
const inputCreateUsername = document.querySelector('.create__input--username');
const inputCreatePassword = document.querySelector('.create__input--password');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const dateNow = new Date();
const yesterday = new Date(dateNow);
yesterday.setDate(yesterday.getDate() - 1);
console.log(yesterday.toISOString());
console.log(Boolean(undefined));
/////////////////////////////////////////////////
// Functions
//Date
const movementDate = (date, locale) => {
  if (!date) return;
  if (!locale) return;
  const calcDayPassed = (date1, date2) =>
    Math.floor(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

  const dayPassed = calcDayPassed(dateNow, date);
  if (dayPassed === 0) return `Today`;
  if (dayPassed === 1) return `Yesterday`;
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  return Intl.DateTimeFormat(locale).format(date);
};
//format currencies
const formatCurrencies = (currency, acc) => {
  return new Intl.NumberFormat(acc.locale, {
    style: `currency`,
    currency: acc.currency,
  }).format(currency);
};
// displayMovementsTest(account3.movements);
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ``;
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const movDate = new Date(acc.movementsDates[i]);

    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${movementDate(movDate, acc.locale)} </div>
    <div class="movements__value">${formatCurrencies(mov, acc)}</div>`;

    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};
//

const setTime = function (acc) {
  let time = 300;

  setInterval(() => {
    const min = String(Math.round(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    time--;
    if (time <= 0) {
      labelTimer.textContent = 0;
      labelWelcome.textContent = 'Log in to get started';
      labelCreate.textContent = 'Create account';

      return (containerApp.style.opacity = 0);
    }
    return (labelTimer.textContent = `${min}:${sec}`);
  }, 1000);
};
//Fucntion name initials
function nameInitial(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .split(` `)
      .map(word => word.at(0))
      .join(``)
      .toLowerCase();
  });
}

//Function for calc and displaying balance
function calcDisplayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, ele) => acc + ele, 0);
  // labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
  labelBalance.textContent = formatCurrencies(acc.balance, acc);
}
//Function for calculate sums
function calcSums(arr) {
  const income = arr.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el, 0);
  const outcome = arr.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);
  const interest = arr.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * arr.interestRate) / 100)
    .filter(intRate => intRate >= 1)
    .reduce((acc, intR) => acc + intR, 0);

  labelSumInterest.textContent = formatCurrencies(interest, arr);

  if (income > 0) labelSumIn.textContent = formatCurrencies(income, arr);

  if (outcome <= 0)
    labelSumOut.textContent = formatCurrencies(Math.abs(outcome), arr);
}
//functions of functioFns
function displayLabel(account) {
  //Display movements
  displayMovements(account);
  //Display balance
  calcDisplayBalance(account);
  //calc sum
  calcSums(account);
}

//Calling of functions
//Movements
// displayMovements(account1.movements);
//Initials - username
nameInitial(accounts);
//Balance of account
// calcDisplayBalance(account1.movements);
//Sums for deposit, withdrawal and interest
// calcSums(account1);
//varijable
let currentAccount, transferAccount, balance;
//Date and time
const properties = {
  hour: `numeric`,
  minute: `numeric`,
  day: `numeric`,
  month: `long`,
  year: `numeric`,
  weekday: `short`,
};
const locale = navigator.language;
btnLogin.addEventListener(`click`, function (e) {
  e.preventDefault();
  console.log(accounts);
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Message
    document.body.style.backgroundColor = `#f3f3f3`;
    labelCreate.textContent = '';
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.slice(
      0,
      currentAccount.owner.indexOf(` `)
    )}`;
    labelWelcome.style.fontSize = `1.9rem`;
    containerApp.style.opacity = 100;
    document.querySelector(`.date`).textContent = new Intl.DateTimeFormat(
      locale,
      properties
    ).format(dateNow);
    //
    setTime();
    //clear fileds
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();

    //function
    displayLabel(currentAccount);
  } else {
    labelCreate.textContent = '';

    labelWelcome.style.fontSize = `1.9rem`;
    labelWelcome.textContent = `Wrong username or password. Try again`;
    containerApp.style.opacity = 0;
    document.body.style.backgroundColor = `#FA8072`;
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();
    setTimeout(() => {
      labelWelcome.textContent = `Log in to get started`;
      labelWelcome.style.transition = '1s ease-out';
      document.body.style.backgroundColor = `#f3f3f3`;
      document.body.style.transition = '1s ease-out';
      labelCreate.textContent = 'Create account';
    }, 2000);
  }
});

btnCreate.addEventListener('click', function (e) {
  e.preventDefault();
  createAccount(
    inputCreateName.value,
    inputCreateUsername.value,
    +inputCreatePassword.value
  );
  inputCreateName.value =
    inputCreateUsername.value =
    inputCreatePassword.value =
      '';
  inputCreate.classList.add('hidden');
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  transferAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  if (
    amount <= currentAccount.balance &&
    amount > 0 &&
    transferAccount &&
    currentAccount.username !== transferAccount.username
  ) {
    transferAccount.movements.push(amount);
    currentAccount.movements.push(amount * -1);
    currentAccount.movementsDates.push(new Date().toISOString());
    transferAccount.movementsDates.push(new Date().toISOString());

    displayLabel(currentAccount);
  } else {
    labelBalance.textContent =
      amount > currentAccount.balance
        ? `Not enough cash.`
        : `You can't send to yourself`;
    setTimeout(function () {
      labelBalance.textContent = `${currentAccount.balance}€`;
    }, 3000);
  }

  //clear fileds
  inputTransferTo.value = inputTransferAmount.value = ``;
  inputTransferAmount.blur();
  // }
});

//movment iz jednog acc da se prebaci na drugi
//acc1.movmement move to acc2.movmement
//current use tranfer to
//movment u current usera ide u deposit
/// 160

btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();
  const loan = Math.floor(inputLoanAmount.value);

  if (loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
    currentAccount.movements.push(Number(loan));
    currentAccount.movementsDates.push(new Date().toISOString());
    setTimeout(displayLabel, 3000, currentAccount);
    labelBalance.textContent = `Checking request...`;
    setTimeout(() => (labelBalance.textContent = `Request approved!`), 2000);
  } else {
    labelBalance.textContent = `Loan is to high. Ask for lower`;
    setTimeout(() => {
      labelBalance.textContent = `${currentAccount.balance}€`;
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();
  const userDel = inputCloseUsername.value;
  const pinDel = Number(inputClosePin.value);
  const indexDel = accounts.findIndex(acc => acc.username === userDel);

  if (currentAccount.username === userDel && currentAccount.pin === pinDel) {
    accounts.splice(indexDel, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
    labelCreate.textContent = 'Create account';
  } else {
    labelBalance.textContent = `Wrong input.`;
    setTimeout(function () {
      labelBalance.textContent = `${currentAccount.balance}€`;
    }, 3000);
  }
  inputCloseUsername.value = inputClosePin.value = '';

  inputClosePin.blur();
});

let sorting = false;
btnSort.addEventListener(`click`, function () {
  displayMovements(currentAccount, !sorting);
  sorting = !sorting;
});

//Welcome screen

document.querySelector('nav').addEventListener('click', function (e) {
  const login = e.target.closest('.welcome');
  const create = e.target.closest('.create');

  if (login) {
    inputLogin.classList.remove('hidden');
    inputLoginUsername.focus();
    inputCreate.classList.add('hidden');
  }
  if (create) {
    inputCreate.classList.remove('hidden');
    inputLogin.classList.add('hidden');
    inputCreateName.focus();
  }
});

function createAccount(name, username, pin) {
  const account = {
    owner: `${name}`,
    movements: [],
    interestRate: Math.trunc(Math.random() * 3) + 1,
    pin: pin,

    movementsDates: [
      '2020-11-01T13:15:33.035Z',
      '2020-07-30T09:48:16.867Z',
      '2020-12-25T06:04:23.907Z',
      '2021-09-25T14:18:46.235Z',
      '2021-02-05T16:33:06.386Z',
      '2022-08-22T14:43:26.374Z',
      '2022-04-25T18:49:59.371Z',
      '2022-03-26T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT',
  };

  const createRandomMovements = acc => {
    const arrSize = Math.trunc(Math.random() * 8) + 1;
    for (let i = 0; i <= arrSize; i++) {
      const movement = Math.trunc(Math.random() * 1500) + 1;
      if ([1, 4, 7].includes(i)) acc.push(-(movement - 300));
      else acc.push(movement);
    }
  };

  createRandomMovements(account.movements);
  account.username = username;
  accounts.push(account);
  displayLabel(account);
}

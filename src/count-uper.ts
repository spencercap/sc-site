import { CountUp } from 'countup.js';
import { Odometer } from 'odometer_countup';

console.log('CountUp', CountUp);

const counterYear = new CountUp("counter-year", 2025, {
  plugin: new Odometer({
    duration: 0.7,
    // lastDigitDelay: 1,
  }),
  duration: 4.5,
  startVal: 1906,
  separator: "",
  decimal: "",

  // doesnt work because of the way i am doing containerized scrolling
  // enableScrollSpy: true, // start on visible
});

// am calling this in main.ts once on slide 3
// counterYear.start(); 



const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// const fromMonth = "January";
const fromMonth = "Nov";
const toMonth = new Date().toLocaleString('en-US', { month: 'short' });

const fromIndex = months.indexOf(fromMonth);
const toIndex = months.indexOf(toMonth);

const counterMonth = new CountUp('counter-month', toIndex, {
  plugin: new Odometer({
    duration: 0.7,
    // lastDigitDelay: 1,
  }),
  startVal: fromIndex,
  duration: 4,
  formattingFn: val => months[Math.round(val)]
});

// if (!counterMonth.error) {
//   counterMonth.start();
// } else {
//   console.error(counterMonth.error);
// }

const fromDay = 1;
const toDay = new Date().getDate();
console.log('toDay', toDay);


const counterDay = new CountUp('counter-day', toDay, {
  plugin: new Odometer({
    duration: 0.7,
  }),
  startVal: fromDay,
  duration: 4,
  separator: "",
  decimal: "",
});

export { counterYear, counterMonth, counterDay }; 
import { CountUp } from 'countup.js';
import { Odometer } from 'odometer_countup';

console.log('CountUp', CountUp);

const counter = new CountUp("counter", 2025, {
  plugin: new Odometer({
    duration: 0.7,
    // lastDigitDelay: 1,
  }),
  duration: 5.0,
  startVal: 1906,
  separator: "",
  decimal: "",

  // doesnt work because of the way i am doing containerized scrolling
  // enableScrollSpy: true, // start on visible
});

// am calling this in main.ts once on slide 3
// counter.start(); 

export { counter }; 
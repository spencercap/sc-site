// code from an old pen of mine: https://codepen.io/spencercap/pen/rLOyjX 

const radiusPercent = .45;
const svg = document.querySelector('svg') as SVGSVGElement;
const circlePath = svg.querySelector('circle') as SVGCircleElement;
// console.log('circlePath', circlePath);
// const dashSize = (window.innerHeight * radiusPercent) * Math.PI * 2;
const dashSize = (svg.getBoundingClientRect().height * radiusPercent) * Math.PI * 2;
const scrollContent = document.querySelector('.scroll-content') as HTMLElement;

// console.log('dashSize', dashSize);
circlePath.style.strokeDasharray = dashSize + ' ' + dashSize;
circlePath.style.strokeDashoffset = dashSize.toString(); // starts unfiled

// Calculate and log scroll percentage
scrollContent.addEventListener('scroll', () => {
  const scrollTop = scrollContent.scrollTop;
  const scrollHeight = scrollContent.scrollHeight - scrollContent.clientHeight;
  const scrollPercentage = (scrollTop / scrollHeight) * 100;
  
//   console.log(`Scroll Percentage: ${scrollPercentage.toFixed(2)}%`);

  circlePath.style.strokeDashoffset = dashSize - ( (scrollPercentage / 100) * dashSize ) as any ;

  if (scrollPercentage >= 90) {
    // Calculate the transition progress from 90% to 100%
    const transitionProgress = (scrollPercentage - 90) / 10;
    // Tween from 10% to 5% based on transition progress
    const strokeWidth = 10 - (transitionProgress * 5);
    circlePath.style.strokeWidth = `${strokeWidth}%`;
  } else {
    circlePath.style.strokeWidth = '10%';
  }
});


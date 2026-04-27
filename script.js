const vantaEffect = VANTA.BIRDS({
  el: "#vanta-bg",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
  scale: 1,
  scaleMobile: 1,
  backgroundColor: 0xffc0cb,
  color1: 0xc57676,
  color2: 0x4cc1dc
});

const flipCard = document.querySelector('.flip-card');
flipCard.addEventListener('click', () => flipCard.classList.toggle('flipped'));
flipCard.style.zIndex = '100';

let noClickCount = 0;
const btnNo = document.getElementById('btn-no');

btnNo.addEventListener('click', function(e) {
  e.stopPropagation();
  noClickCount++;

  if (noClickCount === 1) {
    document.body.appendChild(btnNo);
    btnNo.style.position = 'fixed';
    btnNo.style.zIndex = 100;
  }

  const maxX = window.innerWidth - 120;
  const maxY = window.innerHeight - 60;
  btnNo.style.left = Math.random() * maxX + 'px';
  btnNo.style.top  = Math.random() * maxY + 'px';

  // 3rd click: show arrow in its original position, just make it big and sarcastic
 if (noClickCount === 3) {
    const arrow = document.querySelector('.arrow');
    arrow.textContent = '⬅️ TROPA ITO PLEASE';
    arrow.style.display = 'block';
    arrow.style.fontSize = '3.5em';
    arrow.style.fontWeight = 'bold';
    arrow.style.color = '#ff0055';
    arrow.style.textShadow = '0 0 10px rgba(255,0,85,0.6)';
    arrow.style.position = 'fixed';
    arrow.style.top = '70%';
    arrow.style.right = '-5in';
    arrow.style.left = 'auto';
    arrow.style.transform = 'translateY(-50%)';
    arrow.style.zIndex = 50;
  }
  

  // 7th click: hide no button, highlight yes, show label
  if (noClickCount === 7) {
    btnNo.style.display = 'none';
    document.querySelector('.arrow').style.display = 'none';
    document.getElementById('btn-yes').classList.add('yes-highlight');

    if (!document.getElementById('yes-label')) {
      const label = document.createElement('p');
      label.id = 'yes-label';
      label.textContent = 'Click mo na please 🥺';
      label.style.color = 'red';
      label.style.fontWeight = 'bold';
      label.style.marginTop = '8px';
      document.getElementById('btn-yes').parentNode.appendChild(label);
    }
  }
});

document.getElementById('btn-yes').addEventListener('click', function(e) {
  e.stopPropagation();

  // Hide the no button and arrow immediately
  document.getElementById('btn-no').style.display = 'none';
  document.querySelector('.arrow').style.display = 'none';

  flipCard.style.transition = 'opacity 0.5s';
  flipCard.style.opacity = '0';
  flipCard.style.pointerEvents = 'none';

  const vel = vantaEffect.velocityUniforms;
  const bird = vantaEffect.birdUniforms;
  const camera = vantaEffect.camera;
  const canvas = vantaEffect.renderer.domElement;
  const startZ = camera.position.z;

  vel['speedLimit'].value = 10;
  vel['separationDistance'].value = 5;
  vel['alignmentDistance'].value = 80;
  vel['cohesionDistance'].value = 80;
  vel['freedomFactor'].value = 0.3;

  const total = 3000;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / total, 1);

    const eased = t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

    camera.position.z = startZ - (startZ - 20) * eased;

    const sizeT = Math.max(0, (t - 0.5) / 0.5);
    const sizeEased = sizeT * sizeT * sizeT;
    bird['birdSize'].value = 1 + 35 * sizeEased;

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      gentleShake();

      const cover = document.getElementById('cover');
      cover.style.transition = 'opacity 0.4s ease';
      cover.style.opacity = 1;

      setTimeout(() => {
        bird['birdSize'].value = 1;
        vel['speedLimit'].value = 5;
        vel['separationDistance'].value = 20;
        vel['alignmentDistance'].value = 20;
        vel['cohesionDistance'].value = 20;
        vel['freedomFactor'].value = 1;

        camera.position.z = 20;
        canvas.style.opacity = 0;
      }, 400);

      setTimeout(() => {
        const reveal = document.getElementById('reveal');
        const oldCar = reveal.querySelector('.car-emoji');
        const newCar = oldCar.cloneNode(true);
        oldCar.replaceWith(newCar);

        reveal.style.transition = 'none';
        reveal.style.opacity = 1;
        reveal.style.pointerEvents = 'all';

        setTimeout(() => {
          cover.style.transition = 'opacity 1.5s ease';
          cover.style.opacity = 0;

          setTimeout(() => {
            canvas.style.transition = 'opacity 0.5s ease';
            canvas.style.opacity = 1;

            const flyBackStart = performance.now();
            const flyBackDuration = 3000;

            function flyBack(now) {
              const elapsed = now - flyBackStart;
              const t = Math.min(elapsed / flyBackDuration, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              camera.position.z = 20 + (startZ - 20) * eased;
              if (t < 1) requestAnimationFrame(flyBack);
            }

            requestAnimationFrame(flyBack);
          }, 2200);
        }, 400);
      }, 700);
    }
  }

  requestAnimationFrame(animate);
});

function gentleShake() {
  const canvas = vantaEffect.renderer.domElement;
  let s = 0;
  const iv = setInterval(() => {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 10;
    canvas.style.transform = `translate(${x}px, ${y}px)`;
    s++;
    if (s > 8) {
      clearInterval(iv);
      canvas.style.transform = '';
    }
  }, 50);
}

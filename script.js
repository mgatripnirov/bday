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
  btnNo.style.top = Math.random() * maxY + 'px';

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

        const wrapper = reveal.querySelector('.car-wrapper');
        const freshWrapper = wrapper.cloneNode(true);
        wrapper.replaceWith(freshWrapper);

        const driverImgNew = freshWrapper.querySelector('.driver-img');
        driverImgNew.style.animation = 'none';
        driverImgNew.style.transform = 'translateX(-50%) scale(0.93)';
        driverImgNew.style.opacity = '1';

        const herSection = document.getElementById('her-section');
        const driverMsg = document.getElementById('driver-msg');
        herSection.style.opacity = '0';
        herSection.style.transform = 'translateY(-50%) translateX(40px)';
        if (driverMsg) driverMsg.style.opacity = '0';

        reveal.style.transition = 'none';
        reveal.style.opacity = 1;
        reveal.style.pointerEvents = 'all';

        setupHerClick();

        setTimeout(() => {
          herSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          herSection.style.transform = 'translateY(-50%) translateX(0)';
          herSection.style.opacity = '1';

          if (driverMsg) {
            driverMsg.style.transition = 'opacity 0.8s ease';
            driverMsg.style.opacity = '0';
            setTimeout(() => {
              driverMsg.style.opacity = '1';
            }, 1000);
          }
        }, 2200);

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

function setupHerClick() {
  const herImg = document.getElementById('her-img');
  if (!herImg) return;

  herImg.addEventListener('click', function () {
    const herSection   = document.getElementById('her-section');
    const passengerImg = document.querySelector('.passenger-img');
    const togetherMsg  = document.getElementById('together-msg');
    const driverMsg    = document.getElementById('driver-msg');

    // FORCE HIDE driver message immediately
    if (driverMsg) {
      driverMsg.style.display = 'none';  // Direct hide instead of fade
      driverMsg.style.opacity = '0';
    }

    const herMessage = herSection.querySelector('.her-message');
    if (herMessage) {
      herMessage.style.transition = 'opacity 0.3s ease';
      herMessage.style.opacity = '0';
    }

    const herRect  = herImg.getBoundingClientRect();
    const passRect = passengerImg.getBoundingClientRect();

    const herCenterX  = herRect.left  + herRect.width  / 2;
    const herCenterY  = herRect.top   + herRect.height / 2;
    const passCenterX = passRect.left + passRect.width  / 2;
    const passCenterY = passRect.top  + passRect.height / 2;

    const dx    = passCenterX - herCenterX;
    const dy    = passCenterY - herCenterY;
    const scale = passRect.width / herRect.width;

    herImg.style.pointerEvents = 'none';
    herImg.style.transform = 'scale(1)';
    herSection.style.pointerEvents = 'none';

    setTimeout(() => {
      herImg.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease 0.9s';
      herImg.style.transform  = `translate(${dx}px, ${dy}px) scale(${scale})`;
    }, 50);

    setTimeout(() => {
      herImg.style.opacity     = '0';
      herSection.style.display = 'none';

      passengerImg.style.transition = 'opacity 0.5s ease';
      passengerImg.style.opacity    = '1';

      setTimeout(() => {
        togetherMsg.style.transition = 'opacity 0.8s ease';
        togetherMsg.style.opacity    = '1';

        setTimeout(() => {
          crashIntoScreen();
        }, 2000);
      }, 400);
    }, 1150);
  });
}

function crashIntoScreen() {
  const wrapper = document.querySelector('.car-wrapper');
  const flash = document.getElementById('crash-flash');
  const togetherMsg = document.getElementById('together-msg');
  const reveal = document.getElementById('reveal');

  togetherMsg.style.transition = 'opacity 0.3s ease';
  togetherMsg.style.opacity = '0';

  setTimeout(() => {
    wrapper.style.animation = 'none';
    wrapper.style.transform = 'scale(1)';
    wrapper.style.transformOrigin = 'center center';

    const duration = 3000;
    const startTime = performance.now();

    function growCar(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t * t * t;
      const scale = 1 + 29 * eased;
      wrapper.style.transform = `scale(${scale})`;

      if (t < 1) {
        requestAnimationFrame(growCar);
      } else {
        flash.style.background = '#ffc0cb';
        flash.style.transition = 'opacity 0.6s ease';
        flash.style.opacity = '1';

        setTimeout(() => {
          reveal.style.transition = 'opacity 0s';
          reveal.style.opacity = '0';
          reveal.style.pointerEvents = 'none';

          flash.style.transition = 'opacity 1.2s ease';
          flash.style.opacity = '0';

          startDrivingScene();
        }, 600);
      }
    }

    requestAnimationFrame(growCar);
  }, 300);
}

/* ══════════════════════════════════════════════════
   🚗 DRIVING SCENE with MP3 AUDIO & VOLUME CONTROL
   ══════════════════════════════════════════════════ */

let isStopped = false;
let stopPositionReached = false;
let audioPlayed = false;
let bgMusic = null;
let musicNoteElement = null;
let volumeControl = null;

function startDrivingScene() {
  const scene = document.getElementById('driving-scene');
  const car = document.getElementById('drive-car');
  const hint = document.getElementById('drive-hint');
  const memories = scene.querySelectorAll('.memory');
  const finalCard = document.querySelector('.final-romantic-card');

  // Reset audio flag when scene starts
  audioPlayed = false;

  // Set scrollable height
  const memoryLane = document.getElementById('memory-lane');
  if (memoryLane) {
    memoryLane.style.height = '6200px';
  }

  // Get stop position
  let stopPosition = 6000;

  if (finalCard) {
    const cardTop = parseInt(finalCard.style.top) || 5450;
    const cardHeight = finalCard.offsetHeight || 500;
    stopPosition = cardTop + cardHeight + 200;
  }

  console.log("🚗 Stop position set to:", stopPosition);
  console.log("📏 Total scroll height:", scene.scrollHeight);

  scene.style.display = 'block';
  scene.scrollTop = 0;

  isStopped = false;
  stopPositionReached = false;

  // Fade hint on first scroll
  scene.addEventListener('scroll', () => {
    hint.style.opacity = '0';
  }, { passive: true, once: true });

  // Fade-in memories
  function revealMemories() {
    const viewBottom = scene.scrollTop + scene.clientHeight;
    memories.forEach(card => {
      const cardTop = card.offsetTop;
      if (viewBottom > cardTop + 60) {
        card.classList.add('visible');
      }
    });
  }

  // 🎵 FUNCTION TO PLAY LOCAL MP3 MUSIC 🎵
  function playLocalMusic() {
    if (audioPlayed) return;
    audioPlayed = true;

    // Create audio element
    bgMusic = new Audio();

    // IMPORTANT: Change this to match your MP3 file location!
    // If your MP3 is in "music" folder: bgMusic.src = 'music/song.mp3';
    // If your MP3 is in same folder: bgMusic.src = 'song.mp3';
    // If your MP3 has a different name, change it here:
    bgMusic.src = 'music/song.mp3'; // <-- CHANGE THIS TO YOUR FILE PATH

    bgMusic.loop = true; // Loop the music
    bgMusic.volume = 0.5; // Start at 50% volume

    // Try to play
    bgMusic.play().catch(error => {
      console.log("Auto-play blocked by browser");
      // Show message to click anywhere
      hint.textContent = "🎵 Click anywhere to play music 🎵";
      hint.style.opacity = '1';
      
      const playOnClick = () => {
        bgMusic.play();
        hint.style.opacity = '0';
        scene.removeEventListener('click', playOnClick);
        document.removeEventListener('click', playOnClick);
      };
      scene.addEventListener('click', playOnClick);
      document.addEventListener('click', playOnClick);
    });

    // Create volume control
    createVolumeControl();

    // Create floating music note
    musicNoteElement = document.createElement('div');
    musicNoteElement.className = 'music-note';
    musicNoteElement.innerHTML = '🎵';
    musicNoteElement.title = 'Click for volume control';
    document.body.appendChild(musicNoteElement);

    // Show volume control when music note is clicked
    musicNoteElement.addEventListener('click', () => {
      if (volumeControl) {
        volumeControl.classList.toggle('visible');
        setTimeout(() => {
          if (volumeControl) volumeControl.classList.remove('visible');
        }, 3000);
      }
    });

    console.log("🎵 Local MP3 music started!");
  }

  // 🔊 FUNCTION TO CREATE VOLUME CONTROL SLIDER
  function createVolumeControl() {
    if (volumeControl) return;

    // Create volume control container
    volumeControl = document.createElement('div');
    volumeControl.className = 'volume-control';
    volumeControl.innerHTML = `
      <div class="volume-icon">🔊</div>
      <input type="range" id="volume-slider" min="0" max="100" value="50" class="volume-slider">
      <div class="volume-percent">50%</div>
    `;
    document.body.appendChild(volumeControl);

    const slider = document.getElementById('volume-slider');
    const percentDisplay = volumeControl.querySelector('.volume-percent');
    const icon = volumeControl.querySelector('.volume-icon');

    slider.addEventListener('input', function(e) {
      const volume = e.target.value / 100;
      percentDisplay.textContent = e.target.value + '%';
      if (bgMusic) {
        bgMusic.volume = volume;
      }

      // Update icon based on volume
      if (e.target.value == 0) {
        icon.textContent = '🔇';
      } else if (e.target.value < 30) {
        icon.textContent = '🔈';
      } else if (e.target.value < 70) {
        icon.textContent = '🔉';
      } else {
        icon.textContent = '🔊';
      }
    });

    // Auto-hide volume control after 3 seconds
    let hideTimeout;
    const showVolumeControl = () => {
      volumeControl.classList.add('visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        volumeControl.classList.remove('visible');
      }, 3000);
    };

    volumeControl.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
    });

    volumeControl.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        volumeControl.classList.remove('visible');
      }, 3000);
    });

    showVolumeControl();
  }

  // CAR STOP FUNCTION
  function enforceStop() {
    const currentScroll = scene.scrollTop;
    const maxScroll = scene.scrollHeight - scene.clientHeight;

    // Only stop when we reach the actual bottom
    if (!stopPositionReached && currentScroll >= maxScroll - 50) {
      stopPositionReached = true;
      isStopped = true;

      // 🎵 PLAY MP3 MUSIC WHEN REACHING BOTTOM 🎵
      playLocalMusic();

      // Lock at bottom
      scene.scrollTop = maxScroll;

      // Add gentle visual feedback
      car.style.transform = `translate(-50%, -50%) scaleX(-1) rotate(-2deg)`;
      setTimeout(() => {
        car.style.transform = `translate(-50%, -50%) scaleX(-1) rotate(0deg)`;
      }, 200);

      // Show completion message
      hint.style.opacity = '0';
      hint.textContent = "🎵 Music is playing! Click the 🎵 note for volume control! 💖";
      setTimeout(() => {
        hint.style.opacity = '0.9';
        setTimeout(() => {
          hint.style.opacity = '0';
        }, 6000);
      }, 500);
    }

    // Prevent overscroll
    if (stopPositionReached && scene.scrollTop > maxScroll) {
      scene.scrollTop = maxScroll;
    }
  }

  // Car tilt while scrolling
  let lastScroll = 0;
  let tiltTimeout = null;

  function handleScroll() {
    enforceStop();

    if (stopPositionReached) {
      car.style.transform = `translate(-50%, -50%) scaleX(-1) rotate(0deg)`;
      return;
    }

    const delta = scene.scrollTop - lastScroll;
    lastScroll = scene.scrollTop;

    const tilt = Math.max(-4, Math.min(4, delta * 0.2));
    car.style.transform = `translate(-50%, -50%) scaleX(-1) rotate(${tilt}deg)`;

    clearTimeout(tiltTimeout);
    tiltTimeout = setTimeout(() => {
      if (!stopPositionReached) {
        car.style.transform = 'translate(-50%, -50%) scaleX(-1) rotate(0deg)';
      }
    }, 120);
  }

  scene.addEventListener('scroll', handleScroll, { passive: false });
  scene.addEventListener('scroll', revealMemories, { passive: true });

  // Initial reveal
  setTimeout(revealMemories, 100);

  console.log("✅ Driving scene started - scroll freely until bottom!");
}

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
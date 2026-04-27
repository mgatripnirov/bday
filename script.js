document.addEventListener('DOMContentLoaded', function() {
  const flipCard = document.querySelector('.flip-card');
  const arrow = document.querySelector('.arrow');
  const message = document.querySelector('.message');
  let noClicks = 0;

  flipCard.addEventListener('click', function() {
    this.classList.toggle('flipped');
  });

  const buttons = document.querySelectorAll('.buttons button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();

      if (this === buttons[0]) {
        alert('Yay! Let\'s plan that trip! 💕');
      } else if (this === buttons[1]) {
        noClicks++;

        const card = document.querySelector('.flip-card-back');
        const cardRect = card.getBoundingClientRect();
        const buttonRect = this.getBoundingClientRect();

        const maxX = cardRect.width - buttonRect.width - 20;
        const maxY = cardRect.height - buttonRect.height - 20;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        this.style.position = 'absolute';
        this.style.left = randomX + 'px';
        this.style.top = randomY + 'px';

        this.textContent = 'Try Again';
        setTimeout(() => {
          this.textContent = 'No';
        }, 1000);

        if (noClicks >= 3) {
          arrow.style.display = 'block';
        }

        if (noClicks >= 7) {
          this.style.display = 'none';
          buttons[0].classList.add('yes-highlight');
          message.style.display = 'block';
          arrow.style.top = '65%';
        }
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const flipCard = document.querySelector('.flip-card');
  const arrow = document.querySelector('.arrow');
  const message = document.querySelector('.message');
  let noClicks = 0;
  
  flipCard.addEventListener('click', function() {
    this.classList.toggle('flipped');
  });

  // Prevent flip when clicking buttons
  const buttons = document.querySelectorAll('.buttons button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent the card from flipping
      
      if (this === buttons[0]) { // Yes button
        alert('Yay! Let\'s plan that trip! 💕');
      } else if (this === buttons[1]) { // No button
        noClicks++;
        
        // Move the No button to a random position
        const card = document.querySelector('.flip-card-back');
        const cardRect = card.getBoundingClientRect();
        const buttonRect = this.getBoundingClientRect();
        
        const maxX = cardRect.width - buttonRect.width - 20; // padding
        const maxY = cardRect.height - buttonRect.height - 20;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        this.style.position = 'absolute';
        this.style.left = randomX + 'px';
        this.style.top = randomY + 'px';
        
        // Change text temporarily
        this.textContent = 'Try Again';
        setTimeout(() => {
          this.textContent = 'No';
        }, 1000);
        
        // Show arrow after 3 clicks
        if (noClicks >= 3) {
          arrow.style.display = 'block';
        }
        
        // After 7 clicks, hide No button, highlight Yes, show message
        if (noClicks >= 7) {
          this.style.display = 'none'; // Hide No button
          buttons[0].classList.add('yes-highlight'); // Highlight Yes
          message.style.display = 'block'; // Show message
          arrow.style.top = '60%'; // Move arrow up
        }
      }
    });
  });
});

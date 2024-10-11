let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  initialDistance = 0;
  initialAngle = 0;

  init(paper) {
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      
      if (e.touches.length === 2) {
        this.rotating = true;
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        const currentAngle = Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * 180 / Math.PI;

        if (this.initialDistance === 0) {
          this.initialDistance = currentDistance;
          this.initialAngle = currentAngle;
        }

        // Calculate rotation
        const angleChange = currentAngle - this.initialAngle;
        this.rotation += angleChange;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;

        // Update initial values for the next move event
        this.initialAngle = currentAngle;
      } else {
        if (!this.rotating) {
          this.touchMoveX = e.touches[0].clientX;
          this.touchMoveY = e.touches[0].clientY;

          this.velX = this.touchMoveX - this.prevTouchX;
          this.velY = this.touchMoveY - this.prevTouchY;

          if (this.holdingPaper) {
            this.currentPaperX += this.velX;
            this.currentPaperY += this.velY;

            this.prevTouchX = this.touchMoveX;
            this.prevTouchY = this.touchMoveY;

            paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
          }
        }
      }
    });

    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;

      // Reset for rotation
      this.initialDistance = 0;
      this.initialAngle = 0;
    });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

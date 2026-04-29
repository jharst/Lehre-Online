window.onload = function() {
  const grid = document.getElementById('title');
  if (!grid) return; 
  const contentWidth = grid.offsetWidth;
  
  // Berechne die Werte basierend auf der Breite
  const rotateValue = -78; // Behalte den Rotationswert bei
  const translateX = -10 + (contentWidth * 0.001); // Passe den X-Offset an
  const translateY = 60; // Behalte Y-Offset bei

  // Setze die transform-Eigenschaft
  grid.style.transform = `rotate(${rotateValue}deg) translate(${translateX}%, ${translateY}%)`;
};
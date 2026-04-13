export function reduceSameInitialString(initialArray: Array<string>) {
  const finalArray: Array<string> = [];
  for (let i = 0; i < initialArray.length; i++) {
    if (finalArray[finalArray.length - 1] != initialArray[i][0])
      finalArray.push(initialArray[i][0]);
  }
  return finalArray;
}

export function capitalize(string) {
  return string.replace(/\b\w+/g, function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
}

export function zoomToArrow(element, arrow) {
  // Ottieni la posizione della freccia
  const arrowPosition = arrow.getBoundingClientRect();

  // Ottieni la posizione dell'immagine
  const imagePosition = element.getBoundingClientRect();

  // Calcola il centro dell'immagine
  const imageCenter = {
    x: imagePosition.left + imagePosition.width / 2,
    y: imagePosition.top + imagePosition.height / 2,
  };

  // Calcola la distanza tra la freccia e il centro dell'immagine
  const distance = Math.sqrt(
    Math.pow(arrowPosition.left - imageCenter.x, 2) +
    Math.pow(arrowPosition.top - imageCenter.y, 2)
  );

  // Calcola il fattore di zoom
  const zoomFactor = distance / element.clientWidth;

  // Zooma l'immagine
  element.style.transform = `scale(${zoomFactor})`;
}

export function extractDecimal(number) {
  const decimalPart = (number % 1).toFixed(2);
  return decimalPart.slice(1); // Restituisce ".00", ".50", etc.
}

export function toInteger(decimal) {
  return Math.floor(decimal);
}

export function sanitize(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}



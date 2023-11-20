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

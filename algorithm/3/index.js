function wordFrequencyInInput(INPUT, QUERY) {
  const freqMap = {};
  INPUT.forEach((word) => {
    freqMap[word] = (freqMap[word] || 0) + 1; // same with freqMap[word] !== undefined ? freqMap[word] + 1 : 1;
  });

  const result = [];

  QUERY.forEach((word) => {
    result.push(freqMap[word] || 0); //freqMap[word] !== undefined ? freqMap[word] : 0
  });

  return result;
}

const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];
console.log(wordFrequencyInInput(INPUT, QUERY));
// worst o(n) if nothing words same

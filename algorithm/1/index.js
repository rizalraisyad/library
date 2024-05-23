function reverseAlphabet(str) {
  const newStr = str.split(/(\d+)/);
  const reversedWords = newStr.map((word) => {
    if (!/\d+/.test(word)) {
      return word.split('').reverse().join('');
    }
    return word;
  });
  return reversedWords.join('');
}

const input = 'NEGIE1';
const output = reverseAlphabet(input);
console.log(output);

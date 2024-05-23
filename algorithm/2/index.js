function longest(sentence) {
  const words = sentence.split(' ');
  let longestWord = '';
  let maxLength = 0;
  words.forEach((word) => {
    if (word.length > maxLength) {
      longestWord = word;
      maxLength = word.length;
    }
  });

  return longestWord;
}

const sentence =
  'Saya sangat senang mengerjakan mengerjakan mengerjakan soal algoritma';
console.log(longest(sentence));
// o(n)

function diagonalDifference(matrix) {
  let primarySum = 0;
  let secondarySum = 0;
  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    primarySum += matrix[i][i];
    secondarySum += matrix[i][n - i - 1];
  }
  
  return Math.abs(primarySum - secondarySum);
}

const matrix = [[ 1, 2, 3, 4 ],
[5, 6, 7, 8 ],
[ 1, 2, 3, 4 ],
[ 5, 6, 7, 8 ]];
console.log(diagonalDifference(matrix)); //on

// let primarySum = 0, secondarySum = 0;
//     for (let i = 0; i < n; i++) {
//         for (let j = 0; j < n; j++) {
//             if (i == j)
//                 primarySum += mat[i][j];
//             if ((i + j) == (n - 1))
//                 secondarySum += mat[i][j];
//         }
//     } on2

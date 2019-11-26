const insertSort = (values) => {
  for (let i = 1; i < values.length; i++) {
    let tmp = values[i]
    for (let j = i; j >= 0; j--) {
      if (values[j-1] > tmp) {
        values[j] = values[j-1]
      } else {
        values[j] = tmp
        break;
      }
    }
  }
  return values
}
console.log(insertSort([6,4,5,1]))
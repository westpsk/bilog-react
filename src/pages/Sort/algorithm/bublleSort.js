export const bubbleSort = (values) => {
  // sequence 为包括每一步内容的数组
  let sequence = []
  // swapped 为判断是否已经排序好的 标志位
  let swapped
  // indexLastUnsorted 用来减少不必要的循环
  let indexLastUnsorted = values.length - 1
  do {
    swapped = false
    for (let i = 0; i < indexLastUnsorted; i++) {
      // card 是 state.cards 的一个成员
      // 开始一次循环，就有两个card 的 isActive的值设置为true
      sequence.push({ type: 'activate', indexes: [i, i + 1] })
      // 如果前一个数 大于 后一个数，就交换两数
      if (values[i] > values[i + 1]) {
        let temp = values[i]
        values[i] = values[i + 1]
        values[i + 1] = temp
        swapped = true
        // 满足交换的条件，就重新定义所有card的sortIndex属性
        sequence.push({ type: 'swap', indexes: [i, i + 1] })
      }
      // 结束这次循环之前，把原来两个card的isActive的值为true的，设置为false
      sequence.push({ type: 'deactivate', indexes: [i, i + 1] })
    }
    // 外层循环，每循环完一次，就锁定最后一个card，下次这个card 就不参与循环
    sequence.push({ type: 'lock', indexes: [indexLastUnsorted] })
    indexLastUnsorted--
  } while (swapped)

  // 如果提前排序好了，把剩下的card全部锁定
  let skipped = Array.from(Array(indexLastUnsorted + 1).keys())
  sequence.push({ type: 'lock', indexes: skipped })
  // 修改done 为true，完成排序
  sequence.push({ type: 'done' })
  return sequence
}
// 随机生成1到100的值
export const genRandomArray = (nums) => {
  let values = []
  while(nums > 0){
    values.push(Math.ceil(Math.random() * 100))
    nums--
  }
  return values
}
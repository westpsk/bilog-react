const initState = {
  values: [], // 值为 SORT_ARRAY 的副本
  cards: [], // 可视化需要的数组，就是每一个长方形（div元素），数组的每一个值都代表一个div元素
  done: true, // 表示是否排序完成，为true时，右下角出现重置按钮
  // strValues 用来解决数组中出现重复的值，移动位置不对的情况
  strValues: [] // 数组的一个副本，会将数组的值与下标拼起来，形成唯一的一个字符串
}

export default function (state = initState, action) {
  const { type, ...payload } = action
  switch (type) {
    // 系统管理新建编辑系统弹窗
    case 'SORT_RESET':
      const values = payload.values
      const strValues = []
      // 遍历state.values，把state.values的每个值和下标拼接，形成唯一的字符串
      // 值 和 下标 中间加上一个 符号，确保是唯一的，注意符号不能用""空字符串
      values.forEach((item, i) => strValues.push(item + '&' + i))
      // 往 state.cards 中，添加对象，每个对象都代表一个需要排序的长方形（div元素）
      const cards = []
      for (let i = 0; i < values.length; i++) {
        cards.push({
          value: values[i], // 数组中的值
          strValue: strValues[i], // 数组中的值和下标拼接的字符串
          sortIndex: i, // 排序的索引
          isActive: false, // 是否激活
          isLocked: false // 是否锁定
        })
      }
      const done = false
      return {
        ...state,
        values,
        strValues,
        cards,
        done
      }
    case 'SORT_SWAP':
      const {
        values: swapValues,
        strValues: swapStrValues,
        cards: swapCards
      }  = state
      let a = payload.indexes[0]
      let b = payload.indexes[1]

      // 交换真实的值
      let temp = swapValues[a]
      swapValues[a] = swapValues[b]
      swapValues[b] = temp

      // 交换 数组中的值和下标拼接的字符串
      let tempStr = swapStrValues[a]
      swapStrValues[a] = swapStrValues[b]
      swapStrValues[b] = tempStr

      // 重新定义state.cards的每个成员的sortIndex属性
      swapCards.forEach((card) => {
        card.sortIndex = swapStrValues.indexOf(card.strValue)
      })
      return {
        ...state,
        values: swapValues,
        strValues: swapStrValues,
        cards: swapCards
      }
    case 'SORT_ACTIVATE':
      const activateCards = state.cards
      payload.indexes.forEach((index) => {
        activateCards.forEach((card) => {
          if (card.sortIndex === index) card.isActive = true
        })
      })
      return {
        ...state,
        cards: activateCards
      }
    case 'SORT_DEACTIVATE':
      const deActivateCards = state.cards
      payload.indexes.forEach((index) => {
        deActivateCards.forEach((card) => {
          if (card.sortIndex === index) card.isActive = false
        })
      })
      return {
        ...state,
        cards: deActivateCards
      }
    case 'SORT_LOCK':
      const lockCards = state.cards
      payload.indexes.forEach((index) => {
        lockCards.forEach((card) => {
          if (card.sortIndex === index) card.isLocked = true
        })
      })
      return {
        ...state,
        cards: lockCards
      }
    case 'SORT_DONE':
      return {
        ...state,
        done: true
      }
    default:
      return state;
  }
}

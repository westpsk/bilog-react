import React from "react";
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as action from './action.js';
import './style.css';

const EVENT_DELAY = 200 // 交换的过渡时间
const HEIGHT_INCREMENT = 20 // 高度的增量, 数组的某一个值 * 增量 = 长方形高度
const SORT_ARRAY = [16, 11] // 进行冒泡排序的数组

class Sort extends React.Component {

  state = {
    values: [], // 值为 SORT_ARRAY 的副本
    cards: [], // 可视化需要的数组，就是每一个长方形（div元素），数组的每一个值都代表一个div元素
    done: true, // 表示是否排序完成，为true时，右下角出现重置按钮
    // strValues 用来解决数组中出现重复的值，移动位置不对的情况
    strValues: [] // 数组的一个副本，会将数组的值与下标拼起来，形成唯一的一个字符串
  }

  componentDidMount(){
    let values = SORT_ARRAY.slice()
    this.props.actionSortRest({
      values
    })

    // 排序数组，返回一个包括每步的值 和 每步状态的数组
    let sequence = this.bubbleSort(values)

    // 遍历上边排序得到的数组，定时执行操作，实现动画效果
    sequence.forEach((event, index) => {
      setTimeout(() => {
        if(typeof event === 'function'){
          event()
        }
      }, index * EVENT_DELAY)
    })
  }

  // 冒泡排序方法，返回包括每一步的数组
  bubbleSort = (values) => {
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
        sequence.push(
          () => this.props.actionSortActivate({indexes: [i, i + 1]})
        )
        // 如果前一个数 大于 后一个数，就交换两数
        if (values[i] > values[i + 1]) {
          let temp = values[i]
          values[i] = values[i + 1]
          values[i + 1] = temp
          swapped = true
          // 满足交换的条件，就重新定义所有card的sortIndex属性
          sequence.push(
            () => this.props.actionSortSwap({indexes: [i, i + 1]})
          )
        }
        // 结束这次循环之前，把原来两个card的isActive的值为true的，设置为false
        sequence.push(
          () => this.props.actionSortDeactivate({indexes: [i, i + 1]})
        )
      }
      // 外层循环，每循环完一次，就锁定最后一个card，下次这个card 就不参与循环
      sequence.push(
        () => this.props.actionSortLock({indexes: [indexLastUnsorted]})
      )
      indexLastUnsorted--
    } while (swapped)

    // 如果提前排序好了，把剩下的card全部锁定
    let skipped = Array.from(Array(indexLastUnsorted + 1).keys())
    sequence.push(
      () => this.props.actionSortLock({indexes: skipped})
    )
    // 修改done 为true，完成排序
    sequence.push(this.props.actionSortDone)
    return sequence
  }

  render() {
    const { cards } = this.props.sort
    return (
      <div className="cards">
      {
        cards.map((card, index) => {
          return (
            <div className="card-wrapper"
              style={{height: card.value * HEIGHT_INCREMENT + 'px',transform: 'translateX('+card.sortIndex*100+'%)'}}
              key={index}
            >
              <div className={classNames('card', {
                'card-active': card.isActive,
                'card-locked': card.isLocked
              })}>
                <div className="value">{card.value}</div>
              </div>
            </div>
          )
        })
      }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sort: state.Sort,
  };
}

export default connect(mapStateToProps, {
  ...action,
})(Sort);

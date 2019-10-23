import React from "react";
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Select, InputNumber, Slider, Button } from 'antd'
import * as action from './action.js';
import 'antd/lib/button/style/css'
import 'antd/lib/slider/style/css'
import 'antd/lib/select/style/css'
import 'antd/lib/input-number/style/css'
import './style.css';

const Option = Select.Option
const INIT_EVENT_DELAY = 20 // 交换的过渡时间
const DELAY_UNIT = 1000
const HEIGHT_INCREMENT = 3 // 高度的增量, 数组的某一个值 * 增量 = 长方形高度
const INIT_SORT_NUM = 20
const Timer = {}

class Sort extends React.Component {

  state = {
    disabled: false,
    delay: 100,
    values: [], // 值为 SORT_ARRAY 的副本
    cards: [], // 可视化需要的数组，就是每一个长方形（div元素），数组的每一个值都代表一个div元素
    done: true, // 表示是否排序完成，为true时，右下角出现重置按钮
    // strValues 用来解决数组中出现重复的值，移动位置不对的情况
    strValues: [] // 数组的一个副本，会将数组的值与下标拼起来，形成唯一的一个字符串
  }

  componentDidMount(){
    this.getRandomArray()
  }

  // 随机生成1到100的值
  getRandomArray = (nums = INIT_SORT_NUM) => {
    let values = []
    while(nums){
      values.push(Math.ceil(Math.random() * 100))
      nums--
    }
    this.setState({ values }, () => {
      this.restSort()
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
      let lockIndex = indexLastUnsorted
      sequence.push(
        () => this.props.actionSortLock({indexes: [lockIndex]})
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

  onChange = (value) => {
    this.getRandomArray(value)
  }

  handleSelectChange = (value) => {
    this.getRandomArray(Number(value))
  }

  onSliderAfterChange = (value=1) => {
    this.setState({
      delay: DELAY_UNIT/value
    }, () => {
      this.restSort()
    })
  }

  restSort = () => {
    const { values } = this.state
    for(var each in Timer){
      clearInterval(Timer[each]);
    }
    this.setState({
      disabled: false
    })
    this.props.actionSortRest({ values })
  }

  // todo stop timeout
  start = () => {
    // 排序数组，返回一个包括每步的值 和 每步状态的数组
    const { values, delay } = this.state
    this.restSort()
    this.setState({
      disabled: true
    })
    let sequence = this.bubbleSort(values.slice())
    // 遍历上边排序得到的数组，定时执行操作，实现动画效果
    sequence.forEach((event, index) => {
      Timer[`timer${index}`] = setTimeout(() => {
        if(typeof event === 'function'){
          event()
        }
      }, index * delay)
    })
  }

  render() {
    const { cards } = this.props.sort
    const { values, disabled } = this.state
    return (
      <div className="wrapper">
        <div className="options">
          <span className="options-item">
            <span className="label">选择长度：</span>
            <Select defaultValue="20" onChange={this.handleSelectChange}>
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="30">30</Option>
              <Option value="50">50</Option>
            </Select>
          </span>
          <span className="options-item">
            <span className="label">输入长度：</span>
            <InputNumber
              min={1}
              max={200}
              defaultValue={INIT_EVENT_DELAY}
              onChange={this.onChange}
              placeholder="请输入排序长度"
            />
          </span>
          <span className="options-item">
            <Button
              onClick={this.start}
              disabled={disabled}
              type="primary"
            >
              开始排序
            </Button>
          </span>
          <Slider defaultValue={INIT_EVENT_DELAY} onAfterChange={this.onSliderAfterChange} />
          {/**<div className="sort-nums">
            要排序的数组：{values.join(' ')}
          </div> */}
        </div>
        
        <div className="cards">
        {
          cards.map((card, index) => {
            return (
              <div className="card-wrapper"
                className={classNames('card-wrapper', {
                  'card-no-border': values.length > 60
                })}
                style={{height: card.value * HEIGHT_INCREMENT + 'px',transform: 'translateX('+card.sortIndex*100+'%)', width: `${100/values.length}%`}}
                key={index}
              >
                <div className={classNames('card', {
                  'card-active': card.isActive,
                  'card-locked': card.isLocked
                })}
                >
                  {/*<div className="value">{card.value}</div>*/}
                </div>
              </div>
            )
          })
        }
        </div>
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

import React from 'react'
import { Button, InputNumber } from 'antd'
import BigNumber from "bignumber.js/bignumber.mjs"
import moment from 'moment'
import 'antd/lib/button/style/css'
import 'antd/lib/input-number/style/css'
import './style.css'

function unixToFileTime (time) {
  return Number(time) * 1e7 + 116444736000000000
}

function fileTimeToUnix (time) {
  return Number(time) / 1e7 - 11644473600
}


class Time extends React.Component {
  state = {
    unixTime: moment().unix(),
    fileTime: unixToFileTime(moment().unix())
  }

  handleFileTimeToUnix = () => {
    const { fileTime } = this.state
    const unixTime = fileTimeToUnix(fileTime)
    this.setState({
      unixTime
    })
  }
  
  handleUnixToFileTime = () => {
    const { unixTime } = this.state
    const fileTime = unixToFileTime(unixTime)
    this.setState({
      fileTime
    })
  }

  handleInput = (value, type) => {
    this.setState({
      [type]: Number(value)
    })
  }
  
  render(){
    console.log(moment().unix(),1212)
    const { unixTime, fileTime } = this.state
    return (<div className='time-wrap'>
      <div>FILETIME TO UNIX</div>
      <InputNumber
        value={fileTime}
        onChange={(value) => this.handleInput(value, 'fileTime')}
        style={{width: 300}}
      />
      <Button onClick={this.handleFileTimeToUnix}>转换</Button>
      <InputNumber
        style={{width: 300}}
        value={unixTime}
      />
      
      <div>UNIX TO FILETIME</div>
      <InputNumber
        onChange={(value) => this.handleInput(value, 'unixTime')}
        style={{width: 300}}
        value={unixTime}
      />
      <Button onClick={this.handleUnixToFileTime}>转换</Button>
      <InputNumber
        value={fileTime}
        style={{width: 300}}
      />
      <div className="time-detail">
        <div>
          UNIX 时间戳（单位秒，从1970.1.1开始）: 
        </div>
        <div>
          {moment.unix(unixTime).format()}  ---- 
          {moment.unix(unixTime).format('YYYY-MM-DD HH:mm:SS')}
        </div>
      </div>
      <div className="time-detail">
        <div>
          FILETIME（100ns一次，从1601.1.1开始）: 
        </div>
        <div>{fileTime}</div>
      </div>
    </div>)
  }
}


export default Time
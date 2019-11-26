import React from 'react'
import { Button, InputNumber } from 'antd'
import { Link } from "react-router-dom"


function wftime2unix(timestamp) {
  return Math.ceil((timestamp/10000000) - 11644473600);
}
     
// Unix to Windows Time
// @param Unix Timestamp
function unix2wftime(timestamp) {
  return ((timestamp + 11644473600) * 10000000);
}

const Time = () => {

  return (<div>
    <div>FILETIME TO UNIX</div>
    <InputNumber/>
    <Button>转换</Button>
    <InputNumber/>
    <div>UNIX TO FILETIME</div>
    <InputNumber/>
    <Button>转换</Button>
    <InputNumber/>
  </div>)
}

export default Time
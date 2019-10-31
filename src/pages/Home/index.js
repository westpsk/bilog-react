import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'
import FormData from 'form-data'

function upload() {
  const form_data = new FormData();
  form_data.append('email', 'test2@pay-mon.com');
  form_data.append('phone_no', '63');
  form_data.append('phone_code', '9179303100');
  console.log(form_data)

  axios.post('http://0.0.0.0:3001/upload', form_data);
}

const Home = () => {

  return (<div>
    Home
    <button onClick={upload}>upload</button>
    <Link to="/sort">to sort</Link>
  </div>)
}

export default Home
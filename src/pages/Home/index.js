import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  return (<div>
    Home
    <Link to="/sort">to sort</Link>
  </div>)
}

export default Home
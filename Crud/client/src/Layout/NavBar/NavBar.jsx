import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
   <nav className="NavBar-Wrapper">
     <div>
       <h3 className="NavBar-Title">Control Link</h3>
     </div>
     <div className="NavBar-Links">
      <Link to="/" className="NavBar-Link">Таблица</Link>
      <Link to="/add" className="NavBar-Link">Добавить</Link>
     </div>
   </nav>
  );
};

export default Home;

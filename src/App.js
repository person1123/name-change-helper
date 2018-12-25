import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Loader from './loader';

class App extends Component {
  render() {
    return (
      <>
        <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
        <Loader />
      </>
    );
  }
}

export default App;

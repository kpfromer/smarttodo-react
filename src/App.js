import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";

//styles
import './App.scss';

import { Header } from "./components/Header/Header";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

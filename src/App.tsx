/*import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateForm from "./pages/CreateForm";
import PreviewForm from "./pages/PreviewForm";
import MyForms from "./pages/MyForms";
import ViewSubmissions from "./pages/ViewSubmissions";







function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create" element={<CreateForm />} />
        <Route path="/preview" element={<PreviewForm />} />
          <Route path="/Myforms" element={<MyForms />} /> 
       
         <Route path="/submissions/:formId" element={<ViewSubmissions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

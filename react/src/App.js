import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Calculator from './components/Calculator';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Calculator />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

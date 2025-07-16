import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Calculator from './components/Calculator';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Calculator />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;

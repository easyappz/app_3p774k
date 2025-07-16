import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Box, Button, Grid, Typography, Paper } from '@mui/material';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [error, setError] = useState('');

  const handleButtonClick = (value) => {
    setError('');
    if (value === 'C') {
      setDisplay('0');
      setExpression('');
    } else if (value === '=') {
      calculateResult();
    } else {
      const newExpression = expression + value;
      setExpression(newExpression);
      setDisplay(newExpression);
    }
  };

  const calculateResult = async () => {
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setDisplay('Error');
      } else {
        setDisplay(data.result.toString());
        setExpression(data.result.toString());
      }
    } catch (err) {
      setError('Network error');
      setDisplay('Error');
    }
  };

  const buttons = [
    'C', '+/-', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000' }}>
        <Paper elevation={3} sx={{ width: 320, padding: 2, backgroundColor: '#000', borderRadius: 4 }}>
          <Typography variant="h3" sx={{ textAlign: 'right', color: '#fff', marginBottom: 2, height: 60, overflow: 'hidden' }}>
            {display}
          </Typography>
          {error && <Typography sx={{ color: 'red', textAlign: 'right' }}>{error}</Typography>}
          <Grid container spacing={1}>
            {buttons.map((btn) => (
              <Grid item xs={3} key={btn}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleButtonClick(btn)}
                  sx={{
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: btn === '=' ? '#f5923e' : (['/', '*', '-', '+', '%'].includes(btn) ? '#a5a5a5' : '#333'),
                    color: '#fff',
                    fontSize: 24,
                    '&:hover': { backgroundColor: btn === '=' ? '#f5923e' : (['/', '*', '-', '+', '%'].includes(btn) ? '#a5a5a5' : '#333') }
                  }}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </ErrorBoundary>
  );
}

export default App;

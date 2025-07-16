import { useState } from 'react';
import { Button, Grid, Typography, Paper } from '@mui/material';
import styled from '@emotion/styled';

const CalculatorContainer = styled(Paper)({
  backgroundColor: 'black',
  padding: '20px',
  borderRadius: '30px',
  maxWidth: '400px',
  margin: '40px auto',
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
});

const Display = styled(Typography)({
  color: 'white',
  textAlign: 'right',
  marginBottom: '20px',
  fontSize: '4rem',
  fontWeight: '300',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const CalcButton = styled(Button)({
  borderRadius: '50%',
  minWidth: '75px',
  height: '75px',
  fontSize: '28px',
  fontWeight: 'bold',
});

const buttons = [
  ['C', '+/-', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

function getButtonStyle(value) {
  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(value)) {
    return { backgroundColor: '#333333', color: '#ffffff' };
  }
  if (['+', '-', '*', '/', '='].includes(value)) {
    return { backgroundColor: '#ff9500', color: '#ffffff' };
  }
  return { backgroundColor: '#a5a5a5', color: '#000000' };
}

function findLastOperatorIndex(expr) {
  const operators = ['+', '-', '*', '/', '%'];
  let lastIndex = -1;
  for (let op of operators) {
    const index = expr.lastIndexOf(op);
    if (index > lastIndex) {
      lastIndex = index;
    }
  }
  return lastIndex;
}

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [isResult, setIsResult] = useState(false);

  const handleButtonPress = (value) => {
    if (value === 'C') {
      setDisplay('0');
      setIsResult(false);
      return;
    }

    if (value === '=') {
      fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: display }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setDisplay('Error');
          } else {
            setDisplay(data.result.toString());
            setIsResult(true);
          }
        })
        .catch(() => setDisplay('Error'));
      return;
    }

    if (value === '+/-') {
      if (display === '0') return;
      const lastOpIndex = findLastOperatorIndex(display);
      let prefix = display.substring(0, lastOpIndex + 1);
      let current = display.substring(lastOpIndex + 1);
      if (current === '') return;
      if (current.startsWith('-')) {
        current = current.slice(1);
      } else {
        current = `-${current}`;
      }
      setDisplay(prefix + current);
      setIsResult(false);
      return;
    }

    if (value === '%') {
      setDisplay(display + '%');
      setIsResult(false);
      return;
    }

    if (value === '.') {
      const lastOpIndex = findLastOperatorIndex(display);
      let current = display.substring(lastOpIndex + 1);
      if (!current.includes('.')) {
        setDisplay(display + '.');
      }
      setIsResult(false);
      return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
      if (isResult) {
        setDisplay(display + value);
        setIsResult(false);
        return;
      }
      const lastChar = display[display.length - 1];
      const operators = ['+', '-', '*', '/', '%'];
      if (operators.includes(lastChar)) {
        setDisplay(display.slice(0, -1) + value);
      } else {
        setDisplay(display + value);
      }
      setIsResult(false);
      return;
    }

    // Numbers
    if (display === '0' || isResult) {
      setDisplay(value);
      setIsResult(false);
    } else {
      setDisplay(display + value);
      setIsResult(false);
    }
  };

  return (
    <CalculatorContainer elevation={3}>
      <Display variant="h3">{display}</Display>
      <Grid container spacing={2} justifyContent="center">
        {buttons.flat().map((btn, index) => {
          if (btn === '0') {
            return (
              <Grid item xs={6} key={index}>
                <CalcButton
                  variant="contained"
                  sx={getButtonStyle(btn)}
                  onClick={() => handleButtonPress(btn)}
                >
                  {btn}
                </CalcButton>
              </Grid>
            );
          }
          if (btn === '.' || btn === '=') {
            return (
              <Grid item xs={3} key={index}>
                <CalcButton
                  variant="contained"
                  sx={getButtonStyle(btn)}
                  onClick={() => handleButtonPress(btn)}
                >
                  {btn}
                </CalcButton>
              </Grid>
            );
          }
          return (
            <Grid item xs={3} key={index}>
              <CalcButton
                variant="contained"
                sx={getButtonStyle(btn)}
                onClick={() => handleButtonPress(btn)}
              >
                {btn}
              </CalcButton>
            </Grid>
          );
        })}
      </Grid>
    </CalculatorContainer>
  );
}

export default Calculator;

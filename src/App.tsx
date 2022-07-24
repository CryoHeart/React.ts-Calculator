import React, { useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const actions = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}


function reducer(state: any, { type, payload }: any) {

  switch (type) {

    case actions.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        // eslint-disable-next-line no-template-curly-in-string
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

      case actions.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }
        if (state.currentOperand == null) return state;
        if (state.currentOperand.length === 1) {
          return {
            ...state,
            currentOperand: null
          }
        }

        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }

    case actions.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case actions.CLEAR:
      return {}

    case actions.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }


}

function evaluate({ currentOperand, previousOperand, operation }: { currentOperand: any, previousOperand: any, operation: any }) {
  const pervious = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(pervious) || isNaN(current)) return "";
  let computation: any = "";
  switch (operation) {
    case "+":
      computation = pervious + current;
      break;
    case "-":
      computation = pervious - current;
      break;
    case "*":
      computation = pervious * current;
      break;
    case "÷":
      computation = pervious / current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand: any) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  // dispatch({type: actions.ADD_DIGIT, payload: {digit: 1}})
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: actions.CLEAR })}>AC</button>
      <button onClick={() => dispatch ({type: actions.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: actions.EVALUATE })}>=</button>
    </div>
  );
}

export default App;

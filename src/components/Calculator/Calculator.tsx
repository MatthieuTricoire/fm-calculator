import { Reducer, useReducer } from "react";
import "./calculator.css";

import DigitButton from "../DigitButton/DigitButton";
import OperationButton from "../OperationButton/OperationButton";

interface InitState {
  currentValue: string;
  previousValue: string;
  operator: string;
  overwrite_result?: boolean;
}

const initState: InitState = {
  currentValue: "",
  previousValue: "",
  operator: "",
};

export const enum ACTIONS_TYPE {
  ADD_DIGIT = "add-digit",
  CHOOSE_OPERATOR = "choose-operator",
  CLEAR = "clear",
  DELETE_DIGIT = "delete-digit",
  EVALUATE = "evaluate",
}

export interface Action {
  type: ACTIONS_TYPE;
  payload?: { digit?: string; operation?: string };
}

const calulatorReducer: Reducer<InitState, Action> = (
  state,
  action
): InitState => {
  switch (action.type) {
    // Take a digit to add it to the current value
    case ACTIONS_TYPE.ADD_DIGIT:
      // If currentValue is a evaluate output, add the digit to a new currentValue
      if (state.overwrite_result) {
        return {
          ...state,
          currentValue: action.payload?.digit ?? "",
          overwrite_result: false,
        };
      }

      // Only one 0 allowed in the begining of a value. e.g : 02 | 002
      if (action.payload?.digit === "0" && state.currentValue === "0")
        return state;

      // Only one "."  allowed in the number. e.g : 0.2 | 0.2.2
      if (
        action.payload?.digit === "." &&
        state.currentValue &&
        state.currentValue.includes(".")
      ) {
        return state;
      }

      //Add a 0 before .
      if (action.payload?.digit === "." && state.currentValue === "") {
        return {
          ...state,
          currentValue: `0${action.payload.digit}`,
        };
      }

      if (action.payload?.digit)
        return {
          ...state,
          currentValue: state.currentValue
            ? `${state.currentValue}${action.payload?.digit}`
            : action.payload?.digit,
        };

      return state;

    case ACTIONS_TYPE.CHOOSE_OPERATOR:
      // No data
      if (state.currentValue === "" && state.previousValue === "") {
        return state;
      }
      //change the operator value
      if (state.currentValue === "") {
        return {
          ...state,
          operator: action.payload?.operation ?? "",
        };
      }

      // Move the first number in previous state, add the opertor and clean the current state number
      if (state.previousValue === "") {
        return {
          ...state,
          operator: action.payload?.operation ?? "",
          previousValue: state.currentValue,
          currentValue: "",
        };
      }

      // Do the calculation and stock it in the previousValue state

      return {
        ...state,
        previousValue: evaluate(state),
        operator: action.payload?.operation ?? "",
        currentValue: "",
      };

    case ACTIONS_TYPE.DELETE_DIGIT:
      if (state.overwrite_result)
        return { ...state, overwrite_result: false, currentValue: "" };

      if (state.currentValue === "") return state;

      if (state.currentValue.length === 1)
        return { ...state, currentValue: "" };

      return { ...state, currentValue: state.currentValue.slice(0, -1) };

    case ACTIONS_TYPE.CLEAR:
      return {
        currentValue: "",
        previousValue: "",
        operator: "",
      };

    case ACTIONS_TYPE.EVALUATE:
      if (
        state.currentValue === "" ||
        state.previousValue === "" ||
        state.previousValue === ""
      ) {
        return state;
      }
      return {
        ...state,
        previousValue: "",
        operator: "",
        currentValue: evaluate(state),
        overwrite_result: true,
      };

    default:
      return state;
  }
};

const evaluate = ({
  currentValue,
  previousValue,
  operator,
}: {
  currentValue: string;
  previousValue: string;
  operator: string;
}) => {
  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  if (isNaN(prev) || isNaN(current)) return "";
  let calculation = 0;
  switch (operator) {
    case "+":
      calculation = prev + current;
      break;
    case "-":
      calculation = prev - current;
      break;
    case "/":
      calculation = prev / current;
      break;
    case "*":
      calculation = prev * current;
      break;
  }
  return calculation.toString();
};

const INTEGER_FORMAT = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

function formatValue(value: string) {
  if (value === "") return;
  const [integer, decimal] = value.split(".");
  const integerNum = parseFloat(integer);
  if (decimal === undefined) return INTEGER_FORMAT.format(integerNum);
  return `${INTEGER_FORMAT.format(integerNum)}.${decimal}`;
}

function Calculator() {
  const [state, dispatch] = useReducer(calulatorReducer, initState);

  return (
    <div className="container">
      <div className="header">
        <div className="header__title">Calc.</div>
      </div>
      <div className="result">
        <div className="previousNumber">
          {state.previousValue} {state.operator}
        </div>
        <div className="currentNumber">{formatValue(state.currentValue)}</div>
      </div>
      <div className="pad">
        <DigitButton digit={"7"} dispatch={dispatch} />
        <DigitButton digit={"8"} dispatch={dispatch} />
        <DigitButton digit={"9"} dispatch={dispatch} />
        <button
          className="key accent"
          onClick={() => dispatch({ type: ACTIONS_TYPE.DELETE_DIGIT })}
        >
          del
        </button>
        <DigitButton digit={"4"} dispatch={dispatch} />
        <DigitButton digit={"5"} dispatch={dispatch} />
        <DigitButton digit={"6"} dispatch={dispatch} />
        <OperationButton operation={"+"} dispatch={dispatch} />
        <DigitButton digit={"1"} dispatch={dispatch} />
        <DigitButton digit={"2"} dispatch={dispatch} />
        <DigitButton digit={"3"} dispatch={dispatch} />
        <OperationButton operation={"-"} dispatch={dispatch} />
        <DigitButton digit={"."} dispatch={dispatch} />
        <DigitButton digit={"0"} dispatch={dispatch} />
        <OperationButton operation={"/"} dispatch={dispatch} />
        <OperationButton operation={"*"} dispatch={dispatch} />
        <button
          className="key large accent"
          onClick={() => dispatch({ type: ACTIONS_TYPE.CLEAR })}
        >
          Reset
        </button>
        <button
          className="key large equal"
          onClick={() => dispatch({ type: ACTIONS_TYPE.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default Calculator;

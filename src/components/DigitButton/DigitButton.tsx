import { FC } from "react";

import { Action, ACTIONS_TYPE } from "../Calculator/Calculator";

interface DigitButtonProps {
  digit: string;
  dispatch: React.Dispatch<Action>;
}

const DigitButton: FC<DigitButtonProps> = ({ digit, dispatch }) => {
  return (
    <button
      className="key num"
      onClick={() =>
        dispatch({ type: ACTIONS_TYPE.ADD_DIGIT, payload: { digit } })
      }
    >
      {digit}
    </button>
  );
};

export default DigitButton;

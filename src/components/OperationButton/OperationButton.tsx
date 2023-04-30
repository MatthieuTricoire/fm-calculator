import { FC } from "react";

import { Action, ACTIONS_TYPE } from "../Calculator/Calculator";

interface DigitButtonProps {
  operation: string;
  dispatch: React.Dispatch<Action>;
}

const OperationButton: FC<DigitButtonProps> = ({ operation, dispatch }) => {
  return (
    <button
      className="key num"
      onClick={() =>
        dispatch({ type: ACTIONS_TYPE.CHOOSE_OPERATOR, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
};

export default OperationButton;

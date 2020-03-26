import React from "react";

const ButtonComponent = ({classes, callFunction, buttonText}) =>
    <button type="button"
            className={classes}
            onClick={callFunction}>
      {buttonText}
    </button>;

export default ButtonComponent
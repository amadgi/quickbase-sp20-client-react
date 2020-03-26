import React from "react";

const ErrorComponent = ({errorMsg}) =>
    <div className="form-group row">
      <div className="col-sm-2"/>
      <div className="col-sm-10">
        <div className="form-control custom-error">
          <span className="custom-color">{errorMsg}</span>
        </div>
      </div>
    </div>;

export default ErrorComponent
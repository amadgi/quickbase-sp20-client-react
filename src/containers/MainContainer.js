import React from "react";
import FormContentComponent from "../components/FormContentComponent";

const MainContainer = () =>
    <div className="container border">
      <nav className="navbar navbar-light nav-color row mb-3">
        <h2>Field Builder</h2>
      </nav>
      <FormContentComponent/>
    </div>;

export default MainContainer
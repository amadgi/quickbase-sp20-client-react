import React from "react";
import ChoiceComponent from "./ChoiceComponent";
import './form-styles.css';
import ErrorComponent from "./ErrorComponent";
import ButtonComponent from "./ButtonComponent";
import {postFieldService} from "../services/MockFieldService";
import {DUPLICATE_MSG, LABEL_FLD_MSG, MAX_LIMIT_MSG} from "../common/constants";

class FormContentComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      fieldService: {
        "label": "",
        "required": false,
        "choices": [],
        "displayAlpha": true,
        "default": ""
      },
      maxLimit: 50,
      showLabelError: false,
      showChoicesError: false,
      showDuplicateError: false
    }
  }

  componentDidMount() {
    let data = JSON.parse(localStorage.getItem('fieldService'));
    if (localStorage.getItem('fieldService')) {
      this.setState({
        fieldService: data.fieldService,
        showLabelError: data.showLabelError,
        showChoicesError: data.showChoicesError,
        showDuplicateError: data.showDuplicateError
      });
      sessionStorage.setItem('prevFieldService', JSON.stringify(data))
    }else{
      sessionStorage.setItem('prevFieldService', JSON.stringify(this.state))
    }
  }

  handleLabelChange = (e) => {
    this.setState({
      showLabelError: false,
      fieldService: {
        ...this.state.fieldService,
        label: e.target.value
      }
    }, function () {
      localStorage.setItem("fieldService",
          JSON.stringify(this.state))
    })
  };

  handleDefaultChange = (e) => {
    this.setState({
      showDuplicateError: false,
      showChoicesError: false,
      fieldService: {
        ...this.state.fieldService,
        default: e.target.value
      }
    }, function () {
      localStorage.setItem("fieldService",
          JSON.stringify(this.state))
    })
  };

  setDefault = (choice) => {
    this.setState({
      fieldService: {
        ...this.state.fieldService,
      default: choice
      }
    }, ()=>{
      localStorage.setItem("fieldService",
          JSON.stringify(this.state))
    })
  };

  handleRequiredChange = (e) => {
    this.setState({
      fieldService: {
        ...this.state.fieldService,
        required: e.target.checked
      }
    }, () => {
      localStorage.setItem("fieldService",
          JSON.stringify(this.state))
    })
  };

  handleSortChange = (e) => {
    if (e.target.value === 'SORT') {
      this.setState({
        displayAlpha: true
      }, () => {
        localStorage.setItem("fieldService",
            JSON.stringify(this.state))
      })
    }
  };

  createChoice = (e) => {
    e.preventDefault()
    const newChoice = this.state.fieldService.default;
    if (!this.isPresent(newChoice) && newChoice !== "") {
      this.setState({
        fieldService: {
          ...this.state.fieldService,
          choices: [
            ...this.state.fieldService.choices,
            newChoice
          ]
        }
      }, () => {
        localStorage.setItem("fieldService",
            JSON.stringify(this.state))
      })
    }
  };

  deleteChoice = (deletedChoice) => {
    this.setState({
      showChoicesError: false,
      showDuplicateError: false,
      fieldService: {
        ...this.state.fieldService,
        choices: this.state.fieldService.choices.filter(
            choice => choice !== deletedChoice)
      }
    }, () => {
      localStorage.setItem("fieldService",
          JSON.stringify(this.state))
    })
  };

  isPresent = (updatedChoice) => {
    // console.log(updatedChoice.trim())
    if (this.state.fieldService.choices.includes(updatedChoice)) {
      this.setState({
        showDuplicateError: true
      });
      return true
    } else {
      return false
    }
  };

  validate = () => {
    if (this.state.fieldService.choices.length < this.state.maxLimit) {
      return true
    } else {
      this.setState({
        showChoicesError: true
      });
    }
  };

  saveChanges = async (e) => {
    e.preventDefault();
    this.setState({
      showDuplicateError: false
    });
    let defaultValue = this.state.fieldService.default;
    if (this.state.fieldService.label !== "" && !(/^\s*$/.test(
        this.state.fieldService.label))) {
      if (!this.state.fieldService.choices.includes(defaultValue)) {
        if (this.validate(defaultValue)) {
          this.addDefaultValue(defaultValue)
        }
      } else {
        this.saveFieldService()
      }
    } else {
      this.setState({
        showLabelError: true
      })
    }
  };

  addDefaultValue = (defaultValue) => {
    if (defaultValue !== "") {
      this.setState({
        fieldService: {
          ...this.state.fieldService,
          choices: [
            ...this.state.fieldService.choices,
            defaultValue
          ]
        }
      }, () => {
        this.saveFieldService()
      })
    } else {
      alert("Select default value")
    }
  };

  saveFieldService = async () => {
    localStorage.setItem("fieldService", JSON.stringify(this.state));
    const fieldJson = await postFieldService(this.state.fieldService);
    if (fieldJson.status === "success") {
      alert("Saved successfully!!")
    }
  };

  resetChanges = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure?")) {
      this.setState({
        fieldService: {
          "label": "",
          "required": false,
          "choices": [],
          "displayAlpha": true,
          "default": ""
        },
        showLabelError: false,
        showChoicesError: false,
        showDuplicateError: false
      }, function () {
        localStorage.setItem("fieldService",
            JSON.stringify(this.state));
      })
    }
  };

  loadSessionData = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to cancel the changes?")) {
      let data = JSON.parse(sessionStorage.getItem('prevFieldService'));
      console.log(data)
      localStorage.setItem("fieldService",
          JSON.stringify(data));
      this.setState({
        fieldService: data.fieldService,
        showLabelError: data.showLabelError,
        showChoicesError: data.showChoicesError,
        showDuplicateError: data.showDuplicateError
      })
    }
  };

  render() {
    return (
        <div>
          <form>
            <div className="form-group row">
              <label htmlFor="form-label"
                     className="col-sm-2 col-form-label custom">Label</label>
              <div className="col-sm-10">
                <input type="text"
                       className="form-control"
                       id="form-label"
                       value={this.state.fieldService.label}
                       onChange={this.handleLabelChange}
                       required
                />
              </div>
            </div>
            {this.state.showLabelError &&
            <ErrorComponent
                errorMsg={LABEL_FLD_MSG}
            />}
            <div className="form-group row">
              <div className="col-sm-2">
                <label className="custom">Type</label>
              </div>
              <div className="col-sm-10">
                <div className="row ">
                  <div className="col-sm-2">
                    <h5>Multi-select</h5>
                  </div>
                  <div className="col-sm-5 ml-3">
                    <input id="value-required"
                           className="form-check-input"
                           type="checkbox"
                           checked={this.state.fieldService.required}
                           onChange={this.handleRequiredChange}
                    />
                    <label className="form-check-label"
                           htmlFor="value-required">
                      A value is required
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="default-value"
                     className="col-sm-2 col-form-label custom">
                Default Value</label>
              <div className="col-sm-10">
                <input type="text"
                       className="form-control"
                       id="default-value"
                       value={this.state.fieldService.default}
                       onChange={this.handleDefaultChange}
                />
              </div>
            </div>
            {this.state.showChoicesError &&
            <ErrorComponent
                errorMsg={MAX_LIMIT_MSG}
            />
            }
            {this.state.showDuplicateError &&
            <ErrorComponent
                errorMsg={DUPLICATE_MSG}
            />
            }

            <div className="form-group row">
              <label className="col-sm-2 col-form-label custom">
                Choices
              <span className="custom-message"> ({this.state.fieldService.choices.length})</span>
              </label>
              <div className="col-sm-10">
                <div className="custom-block">
                  <ul className="list-group">
                    {this.state.fieldService.displayAlpha === true &&
                    this.state.fieldService.choices.sort()
                    .map((choice, index) =>
                        <ChoiceComponent
                            key={index}
                            choice={choice}
                            deleteChoice={this.deleteChoice}
                            setDefault={this.setDefault}
                            default={this.state.fieldService.default}
                        />
                    )}
                  </ul>
                </div>
                {this.state.fieldService.choices.length !== this.state.maxLimit
                &&
                <ButtonComponent
                    classes={"btn btn-primary mt-3"}
                    callFunction={this.createChoice}
                    buttonText={"Add Choice"}/>}
                <div>
                  <span className="text-center"><span
                      className="custom custom-message">{this.state.maxLimit
                  - this.state.fieldService.choices.length}</span> more choices left.</span>
                </div>
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="default-value"
                     className="col-sm-2 col-form-label custom">
                Order</label>
              <div className="col-sm-10">
                <select className="form-control"
                        onChange={this.handleSortChange}
                >
                  <option value="SORT">Display choices in alphabetical</option>
                </select>
              </div>
            </div>

            <div className="form-group row text-center">
              <div className="col-sm-12">
                <div className="row text-center">
                  <div className="col-sm-6 text-left">
                    <ButtonComponent
                        classes={"btn btn-success"}
                        callFunction={this.saveChanges}
                        buttonText={"Save Changes"}/>
                    &nbsp;
                    <label>Or</label>&nbsp;
                    <a href="#" className="custom-color"
                       onClick={this.loadSessionData}>Cancel</a>
                  </div>
                  <div className="col-sm-6 text-right">
                    <ButtonComponent
                        classes={"btn btn-danger"}
                        callFunction={this.resetChanges}
                        buttonText={"Reset"}/>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
    )
  }
}

export default FormContentComponent


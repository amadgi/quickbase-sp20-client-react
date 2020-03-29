import React from "react";

class ChoiceComponent extends React.Component {
  state = {
    choice: this.props.choice
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.choice !== this.props.choice) {
      this.setState({
        choice: this.props.choice
      })
    }
  }

  deleteChoice = () => {
    this.props.deleteChoice(this.state.choice);
  };

  render() {
    let selected = ['list-group-item item'];
    if(this.state.choice === this.props.default){
      selected.push('highlight')
    }

    return (
        <div className="content">
          <li className={selected.join(' ')}>
            <span onClick={()=>this.props.setDefault(this.state.choice)} className="mouse-pointer">
              <span>{this.state.choice.substring(0, 39)}</span>
              <span className="custom-color">
                {this.state.choice.substring(39)}
              </span>
            </span>
            <span className="close">
              <i className="fas fa-trash-alt"
                 onClick={this.deleteChoice}
              />
            </span>
          </li>
        </div>
    )
  }
}

export default ChoiceComponent

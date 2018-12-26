import React from 'react';
import {nameOfReq} from './loader';

/*
    {
        name: "File name change petition",
        description: "Go to court and file a petition for name change!",
        requirements: [UsesUp(ReqTypes.MONEY, 50)],
        outputs: [ReqTypes.INITIAL_COURT_ORDER],
    },
    */

class Step extends React.Component {
  getDefaultProps() {
    return {status: ''}
  }

  render() {
      return (
          <div className={"smallStep " + this.props.status}>
              <h3>{this.props.name}</h3>
              <span>{this.props.description}</span>
              <div style={{fontWeight: 'bold', marginTop:'12px'}}>Required:</div>
              <ul>
                  {this.props.requirements.map(
                      element =>
                          <li key={element.toString()}>{nameOfReq(element)}</li>
                  )}
              </ul>
              <div style={{fontWeight: 'bold'}}>Gives You:</div>
              <ul>
                  {this.props.outputs.map(
                      element =>
                          <li key={element.toString()}>{nameOfReq(element)}</li>
                  )}
              </ul>
          </div>
      );
  }
}

export default Step;

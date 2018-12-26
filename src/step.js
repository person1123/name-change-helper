import React from 'react';
import {nameOfReq} from './reqs';

/*
    {
        name: "File name change petition",
        description: "Go to court and file a petition for name change!",
        requirements: [UsesUp(ReqTypes.MONEY, 50)],
        outputs: [ReqTypes.INITIAL_COURT_ORDER],
    },
    */

class Step extends React.Component {
  render() {
      return (
          <div className={"smallStep " + this.props.status}>
            <div className="stepLeftColumn">
                {this.props.status === '' ? null :
                    <input type="checkbox"
                        checked={this.props.status === 'done'}
                        onChange={() => this.props.onCheckClicked(this.props.name)}
                        />
                }
            </div>
            <div className="stepRightColumn">
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
          </div>
      );
  }
}

export default Step;

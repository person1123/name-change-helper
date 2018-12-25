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
    render() {
        return (
            <div className="smallStep">
                <h3>{this.props.name}</h3>
                <span>{this.props.description}</span>
                <ul>
                    {this.props.requirements.map(
                        element =>
                            <li key={element.toString()}>{nameOfReq(element)}</li>
                    )}
                </ul>
            </div>
        );
    }
}

export default Step;
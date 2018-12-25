import React from 'react';
import ReactDOM from 'react-dom';
import SVGDraw from './svgDraw';
import $ from 'jquery';
import SVGDrawContext from './svgDrawContext';

class SVGContainer extends React.Component {
    constructor(props) {
        super(props);
        this.svgDraw = new SVGDraw();
    }

    componentDidMount() {
        this.svgDraw.setUp(
            $(ReactDOM.findDOMNode(this)).find('svg'),
            ReactDOM.findDOMNode(this)
        );
    }

    render() {
        return (
            <div className="svgContainer">
                <svg width="0" height="0">
                <SVGDrawContext.Provider value={this.svgDraw}>
                    {this.props.children}
                </SVGDrawContext.Provider>
                </svg>
            </div>
        );
    }
}

export default SVGContainer;
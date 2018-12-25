import React from 'react';
import ReactDOM from 'react-dom';
import SVGDrawContext from './svgDrawContext';

class Connection extends React.Component {
    // We need to get a ref to this and then call this in the parent
    // apparently, because the refs are in a different subtree
    // so React doesn't realize they need to be rendered before calling
    // componentDidMount on this object
    allComponentsDidMount() {
        this.context.connect(
            ReactDOM.findDOMNode(this),
            ReactDOM.findDOMNode(this.props.startRef.current),
            ReactDOM.findDOMNode(this.props.endRef.current));
    }

    render() {
        const stroke = 'rgb(' +
            Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255) + ')';
        return (
            <path d="M0 0" stroke={stroke} fill="none" strokeWidth="12px"/>
        );
    }
}
Connection.contextType = SVGDrawContext;

export default Connection;

import React from 'react';
import Step from './step';
import './App.css';
import SVGContainer from './svgContainer';
import Connection from './connection';
import $ from 'jquery';
import {UsesUpType, nameOfReq} from './reqs';
import {STEPS, STARTING_MATERIALS} from './data';

class Loader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { completedSteps: [] };
    }

    getRawReq(req) {
        return (req instanceof UsesUpType) ? req.type : req;
    }

    satisfiesRequirement(req, materials) {
        return (req instanceof UsesUpType && materials.has(req.type)) || materials.has(req);
    }

    getNextColumn(steps, materials, sources) {
        let nextMaterials = new Set(materials);
        let nextSteps = [];
        let remainingSteps = [];
        let nextSources = {...sources};

        Object.values(steps).forEach(step => {
            if (step.requirements.map(req => this.satisfiesRequirement(req, materials)).reduce((acc, curr) => acc && curr)) {
                nextSteps.push(step);
                nextMaterials = new Set([...nextMaterials, ...step.outputs]);
                step.outputs.forEach(o => nextSources[o] = step.name);
            } else {
                remainingSteps.push(step);
            }
        });

        return {
            nextMaterials: new Set(nextMaterials), nextSteps, remainingSteps, nextSources
        };
    }

    getAvailableSteps(materials) {
        return this.getNextColumn(STEPS, materials, {}).nextSteps;
    }

    getColumnsWithSources() {
        let columns = [];
        let materials = STARTING_MATERIALS;
        let remainingSteps = STEPS;
        let counter = 0;
        let sources = {};
        while (counter < 4 && remainingSteps !== []) {
            const next = this.getNextColumn(remainingSteps, materials, sources);
            columns.push(next.nextSteps);
            remainingSteps = next.remainingSteps;
            materials = next.nextMaterials;
            sources = next.nextSources;
            counter++;
        }

        return {columns, sources};
    }

    componentDidMount() {
        this.connectionRefs.forEach(ref => ref.current.allComponentsDidMount());

        $('.overviewContainer').scroll(
            e => {
                $('.svgContainer').css({
                    left: -$('.overviewContainer').scrollLeft()
                });
            }
        )
    }

    stepChecked(name) {
        const index = this.state.completedSteps.find(el => el === name);
        if (index !== undefined) {
            this.setState(
                oldState => ({
                    completedSteps: oldState.completedSteps.splice(
                        index,
                        1
                    )
                })
            )
        } else {
            this.setState(
                oldState => ({
                    completedSteps: [...oldState.completedSteps, name]
                })
            )
        }
    }

    render() {
        const columnsWithSources = this.getColumnsWithSources();
        const columns = columnsWithSources.columns;
        const sources = columnsWithSources.sources;

        let stepRefs = {};
        this.connectionRefs = [];
        let connections = [];
        columns.forEach(
            column =>
                column.forEach(
                    step => {
                        stepRefs[step.name] = React.createRef();

                        step.requirements.forEach(
                            req => {
                                connections.push([sources[this.getRawReq(req)], step.name]);
                            }
                        )
                    }
                )
        );

        const currentMaterials = this.state.completedSteps.length === 0 ? STARTING_MATERIALS :
            new Set(
                [...this.state.completedSteps
                    .map(stepName => STEPS[stepName].outputs)
                    .reduce((acc, curr) => [...acc, ...curr]),
                ...STARTING_MATERIALS]
            );

        let stepStatuses = {};
        const availableNextSteps = this.getAvailableSteps(currentMaterials);

        availableNextSteps.forEach(step => stepStatuses[step.name] = 'available');
        this.state.completedSteps.forEach(stepName => stepStatuses[stepName] = 'done');

        return (
            <>
                <SVGContainer>
                    {connections.map(
                        connection => {
                            if (!connection[0]) {
                                return null;
                            }
                            const ref = React.createRef();
                            this.connectionRefs.push(ref);
                            return (
                                <Connection
                                    key={connection[0] + '.' + connection[1]}
                                    ref={ref}
                                    startRef={stepRefs[connection[0]]}
                                    endRef={stepRefs[connection[1]]}
                                    />
                                )}
                    )}
                    
                </SVGContainer>
                <div className="overviewContainer">
                    {columns.map(
                        (column, index) => (
                            <div className="column" key={index}>
                                {column.map(
                                    step =>
                                        <Step
                                            ref={stepRefs[step.name]}
                                            status={
                                                step.name in stepStatuses ?
                                                    stepStatuses[step.name] :
                                                    ''
                                            }
                                            key={step.name}
                                            onCheckClicked={this.stepChecked.bind(this)}
                                            {...step}
                                        />
                                    )}
                            </div>
                        )
                    )}
                </div>
            </>
        )
    }
}

export default Loader;
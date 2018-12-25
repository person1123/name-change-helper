import React from 'react';
import Step from './step';
import './App.css';
import SVGContainer from './svgContainer';
import Connection from './connection';
import $ from 'jquery';

const ReqTypes = {
    "MONEY": 0,
    "THERAPIST": 1,
    "PHYSICIAN": 2,
    "THERAPIST_LETTER": 3,
    "PHYSICIAN_LETTER": 4,
    "COURT_ORDER": 5,
    "SOCIAL_SECURITY_CARD": 6,
    "MVA_LETTER": 7,
    "DIGIAL_SOCIAL_SECURITY_UPDATE": 8,
    "INITIAL_COURT_ORDER": 9,
    "DRIVERS_LICENSE": 10,
    "PASSPORT": 11
}

const ReqTypeNames = {
    [ReqTypes.MONEY]: 'Dollars',
    [ReqTypes.THERAPIST]: 'Therapist',
    [ReqTypes.PHYSICIAN]: 'Physician',
    [ReqTypes.THERAPIST_LETTER]: 'Letter from therapist',
    [ReqTypes.PHYSICIAN_LETTER]: 'Letter from physician',
    [ReqTypes.COURT_ORDER]: 'Court order of name change',
    [ReqTypes.SOCIAL_SECURITY_CARD]: 'Updated social security card',
    [ReqTypes.MVA_LETTER]: 'MVA letter certifying gender change',
    [ReqTypes.DIGIAL_SOCIAL_SECURITY_UPDATE]: 'Updated name in Social Security computer systems',
    [ReqTypes.INITIAL_COURT_ORDER]: 'Court order of name change',
    [ReqTypes.DRIVERS_LICENSE]: 'Updated driver\'s license',
    [ReqTypes.PASSPORT]: 'Updated passport'
}

export function nameOfReq(req) {
    if (typeof req === "number") {
        return ReqTypeNames[req];
    }
    return req.toString();
}

class UsesUpType {
    constructor(type, amount) {
        this.type = type;
        this.amount = amount;
    }

    toString() {
        return '' + this.amount + ' ' + nameOfReq(this.type);
    }
}

function UsesUp(type, amount) {
    return new UsesUpType(type, amount);
}

const STARTING_MATERIALS = new Set([
    ReqTypes.THERAPIST,
    ReqTypes.PHYSICIAN,
    ReqTypes.MONEY
]);

const STEPS = [
    {
        name: "File name change petition",
        description: "Go to court and file a petition for name change!",
        requirements: [UsesUp(ReqTypes.MONEY, 50)],
        outputs: [ReqTypes.INITIAL_COURT_ORDER],
    },
    {
        name: "Get copies of court order",
        description: "Get a bunch of copies that you won't end up needing all of....",
        requirements: [ReqTypes.INITIAL_COURT_ORDER],
        outputs: [ReqTypes.COURT_ORDER]
    },
    {
        name: "Request therapist letter",
        description: "Get a therapist to give you a letter",
        requirements: [ReqTypes.THERAPIST],
        outputs: [ReqTypes.THERAPIST_LETTER]
    },
    {
        name: "Request physician letter",
        description: "Get a physician to give you a letter",
        requirements: [ReqTypes.PHYSICIAN],
        outputs: [ReqTypes.PHYSICIAN_LETTER]
    },
    {
        name: "Go to Social Security",
        description: "Thanks FDR",
        requirements: [UsesUp(ReqTypes.COURT_ORDER, 1), UsesUp(ReqTypes.PHYSICIAN_LETTER, 1)],
        outputs: [ReqTypes.SOCIAL_SECURITY_CARD, ReqTypes.DIGIAL_SOCIAL_SECURITY_UPDATE]
    },
    {
        name: "Go to MVA HQ",
        description: "Did you know Glen Burnie is actually still PG County?",
        requirements: [UsesUp(ReqTypes.PHYSICIAN_LETTER, 1), UsesUp(ReqTypes.THERAPIST_LETTER, 1)],
        outputs: [ReqTypes.MVA_LETTER]
    },
    {
        name: "Go to MVA",
        description: "Do that",
        requirements: [ReqTypes.DIGIAL_SOCIAL_SECURITY_UPDATE, UsesUp(ReqTypes.MVA_LETTER, 1)],
        outputs: [ReqTypes.DRIVERS_LICENSE]
    },
    {
        name: "Go to passport place",
        description: "Do that",
        requirements: [UsesUp(ReqTypes.COURT_ORDER, 1), UsesUp(ReqTypes.PHYSICIAN_LETTER, 1)],
        outputs: [ReqTypes.PASSPORT]
    }
];

class Loader extends React.Component {

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

        steps.forEach(step => {
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
                                {column.map(step => <Step ref={stepRefs[step.name]} key={step.name} {...step} />)}
                            </div>
                        )
                    )}
                </div>
            </>
        )
    }
}

export default Loader;
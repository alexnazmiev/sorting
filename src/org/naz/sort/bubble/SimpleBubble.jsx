import React from 'react';
import { Stage, Layer, Circle, Text, Arrow } from 'react-konva';
import { Animation } from 'konva';

import { defineActions, swap } from './Actions';

const firstEntryX = 100;
const firstEntryY = 100;
const span = 100;
const radius = 20;
const array = [63, 5, 63, 57, 67, 45, 33, 32, 23, 81];

// const timeBetweenActions = 3000;

const timeForCommonAction = 3000;
const timeForEmptyAction = 1000;
const pauseBetweenActions = 500;

const initialAction = {'action': 'INITIAL'};

const unsortedColor = 'red';
const sortedColor = 'yellow';

const ACTION_NOT_STARTED = 'ACTION_NOT_STARTED';
const ACTION_INIT_STAGE = 'ACTION_INIT_STAGE';
const ACTION_MIDDLE_STAGE = 'ACTION_MIDDLE_STAGE';
const ACTION_FINISH_STAGE = 'ACTION_FINISH_STAGE';

export class SimpleBubbleSort extends React.Component {

    layer;
    animation;
    lastActionTime = 0;

    constructor() {
        super();
        this.state = {
            'array': array,
            'coords': this.defineCoords(array),
            'actions': [initialAction, ...defineActions([...array])],
            'animationStarted': false,
            // 'actionsCount': 0,
            'additionalElements': [],
            'actionStage': ACTION_NOT_STARTED,
            'sortedElementsCount': 0,

            'commonActionsCount': 0,
            'emptyActionsCount': 0
        };

        this.action = this.action.bind(this);
    }

    componentDidMount() {
        this.animation = new Animation(this.animationFunc, this.layer);
    }

    render() {
        // console.log(this.state.actions);
        return (
            <>
                <div>
                    <button onClick={this.action}>Action</button>
                </div>
                <div>
                    {this.renderArray()}
                </div>
            </>
        );
    }

    renderArray() {
        return (
            <Stage width={1100} height={200}> 
                <Layer ref={el => this.layer = el}>
                    {this.doRenderArray()}
                    {this.state.additionalElements}
                </Layer>
            </Stage>
        );
    }
    
    doRenderArray = () => {
        const {array, sortedElementsCount} = this.state;
        // console.log(sortedElementsCount);
        return array.map((val, index) => {
            return this.renderArrayEntry(val, this.state.coords[index], index >= array.length - sortedElementsCount)
        });
    }

    renderArrayEntry(value, coords, sorted) {
        const {x, y} = coords;
        const textX = value > 10 ? (x - radius / 2) : (x - radius / 2 + radius / 4);
        return (
            <React.Fragment key={`${value}_${coords.x}_${coords.y}`}>
                <Circle
                    x={x}
                    y={y}
                    radius={radius}
                    fill={sorted ? sortedColor : unsortedColor}
                    stroke='black'
                    strokeWidth={2}
                />
                <Text
                    x={textX}
                    y={y - radius / 2}
                    text={value}
                    fontSize={20}
                />
            </React.Fragment>
        );
    }

    defineCoords(array) {
        return array.map((val, index) => {
            if (index === 0) {
                return {
                    'x': firstEntryX,
                    'y': firstEntryY
                };
            } else {
                return {
                    'x': firstEntryX + span * index,
                    'y': firstEntryY
                }
            }
        });
    }

    action() {
        if (!this.state.emptyActionsCount) {
            this.setState({'emptyActionsCount': 1});
        }

        if (!this.state.animationStarted) {
            this.animation.start();
            this.setState({'animationStarted': true});
        } else {
            this.animation.stop();
            this.setState({'animationStarted': false});
        }
        
    }

    animationFunc = (frame) => {
        const {animationStarted, actionStage} = this.state;

        if (animationStarted) {
            const {emptyActionsCount, commonActionsCount, actions, coords, array, sortedElementsCount} = this.state;
            const totalActionsHappenedCount = emptyActionsCount + commonActionsCount;
            const currentAction = actions[totalActionsHappenedCount];
            const isCurrentActionEmpty = currentAction.action === 'EMPTY';

            const totalTimeForActionsHappened = emptyActionsCount * timeForEmptyAction + 
                                                commonActionsCount * timeForCommonAction + 
                                                (emptyActionsCount + commonActionsCount) * pauseBetweenActions;

            switch (actionStage) {
                case ACTION_NOT_STARTED:
                    if (frame.time > totalTimeForActionsHappened) {
                        this.renderSwapActionStartState(currentAction, coords);
                        this.setState({'actionStage': isCurrentActionEmpty ? ACTION_FINISH_STAGE : ACTION_INIT_STAGE });
                    }
                break;

                case ACTION_INIT_STAGE:
                    if (!isCurrentActionEmpty && frame.time >= totalTimeForActionsHappened + 0.33 * timeForCommonAction) {
                        this.renderSwapActionMiddleState(currentAction, coords);
                        this.setState({'actionStage': ACTION_MIDDLE_STAGE});
                    }
                break;

                case ACTION_MIDDLE_STAGE:
                    if (!isCurrentActionEmpty && frame.time >= totalTimeForActionsHappened + 0.66 * timeForCommonAction) {
                        swap(array, currentAction.left, currentAction.right)
                        this.setState({
                            'array': array,
                            'actionStage': ACTION_FINISH_STAGE
                        });
                    }
                break;

                case ACTION_FINISH_STAGE:
                    if ( 
                        (!isCurrentActionEmpty && frame.time >= totalTimeForActionsHappened + 0.85 * timeForCommonAction) 
                        ||
                        (isCurrentActionEmpty && frame.time >= totalTimeForActionsHappened + 0.85 * timeForEmptyAction) 
                       ) {
                        if (totalActionsHappenedCount + 1 >= actions.length) {
                            this.animation.stop();
                            this.setState({
                                'additionalElements': [],
                                'sortedElementsCount': array.length
                            });
                        } else {
                            const nextAction = actions[totalActionsHappenedCount + 1];
    
                            if (sortedElementsCount !== nextAction.cycleStep) {
                                this.setState({'sortedElementsCount': nextAction.cycleStep});
                            }
                            
                            if (isCurrentActionEmpty) {
                                this.setState({'emptyActionsCount': emptyActionsCount + 1});
                            } else {
                                this.setState({'commonActionsCount': commonActionsCount + 1});
                            }
                        }

                        this.setState({
                            'actionStage': ACTION_NOT_STARTED,
                            'additionalElements': []
                        });
                    }
                break;

                default: 
                    console.error('SHOULD NOT BE HERE');
                break;
            }
        }

    }

    renderSwapActionStartState = (action, coords) => {
        const coordsFrom = coords[action.left];
        const coordsTo = coords[action.right];

        const currentPointerPoints = this.pointerPoints(coordsFrom);
        const counterpartyPointerPoints = this.pointerPoints(coordsTo);

        const currentPointer = this.pointerByPoints(currentPointerPoints);
        const counterpartyPointer = this.pointerByPoints(counterpartyPointerPoints);

        this.setState({'additionalElements': [currentPointer, counterpartyPointer]});
    }

    renderSwapActionMiddleState = (action, coords) => {
        const coordsFrom = coords[action.left];
        const coordsTo = coords[action.right];

        const forwarArrowPoints = this.forwardArrowPoints(coordsFrom, coordsTo);
        const backwardArrowPoints = this.backwardArrowPoints(coordsFrom, coordsTo);

        const forwardArrow = this.arrowByPoints(forwarArrowPoints);
        const backwardArrow =this.arrowByPoints(backwardArrowPoints);

        this.setState({'additionalElements': [...this.state.additionalElements, forwardArrow, backwardArrow]});
    }

    pointerPoints(coordsFrom) {
        return {
            'startPoint': [coordsFrom.x, coordsFrom.y + 2.5 * radius],
            'endPoint': [coordsFrom.x, coordsFrom.y + 1.2 * radius],
        }
    }

    forwardArrowPoints(coordsFrom, coordsTo) {
        return {
            'startPoint': [coordsFrom.x + radius * 0.5, coordsFrom.y + 1.05 * radius],
            'middlePoint': [(coordsTo.x + coordsFrom.x) / 2 , coordsTo.y + radius * 1.75],
            'endPoint': [coordsTo.x - radius * 0.5, coordsTo.y + 1.07 * radius]
        }
    }

    backwardArrowPoints(coordsFrom, coordsTo) {
        return {
            'startPoint': [coordsTo.x - radius * 0.5, coordsTo.y - 1.05 * radius],
            'middlePoint': [(coordsTo.x + coordsFrom.x) / 2 , coordsTo.y - radius * 1.75],
            'endPoint': [coordsFrom.x + radius * 0.5, coordsFrom.y - 1.07 * radius]
        }
    }

    arrowByPoints(arrowPoints) {
        return (
            <Arrow key={`from_${arrowPoints.startPoint[0]}_to_${arrowPoints.endPoint[0]}`}
                points={[...arrowPoints.startPoint, ...arrowPoints.middlePoint, ...arrowPoints.endPoint]}
                stroke = 'red'
                fill = 'red'
                strokeWidth = {2}
                pointerLength = {5}
                pointerWidth = {5}
                tension = {0.5}
            />
        );
    }

    pointerByPoints(pointerPoints) {
        return (
            <Arrow key={`From_${pointerPoints.startPoint[0]}_${pointerPoints.startPoint[1]}_To_${pointerPoints.endPoint[0]}_${pointerPoints.endPoint[1]}`}
                points={[...pointerPoints.startPoint, ...pointerPoints.endPoint]}
                stroke = 'black'
                fill = 'black'
                strokeWidth = {2}
                pointerLength = {5}
                pointerWidth = {5}
                tension = {0.5}
            />
        );
    }

}

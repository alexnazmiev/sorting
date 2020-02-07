import React from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';
import { Animation } from 'konva';

import { defineActions, swap } from './Actions';
import { Arrow, arrowKey } from '../arrow/Arrow';
import { forwardCurvedArrowPoints, backwardCurvedArrowPoints, pointerPoints } from '../arrow/PointsCorrdsCalculator';

const firstEntryX = 100;
const firstEntryY = 100;
const span = 100;
const radius = 20;
const array = [63, 5, 63, 57, 67, 45, 33, 32, 23, 81];

const timeForCommonAction = 1000;
const timeForEmptyAction = 600;
const pauseBetweenActions = 250;

const initialAction = {'action': 'INITIAL'};

const unsortedColor = 'red';
const sortedColor = 'yellow';

const ACTION_NOT_STARTED = 'ACTION_NOT_STARTED';
const ACTION_INIT_STAGE = 'ACTION_INIT_STAGE';
const ACTION_ACT_STAGE = 'ACTION_ACT_STAGE';
const ACTION_FINISH_STAGE = 'ACTION_FINISH_STAGE';

export class SimpleBubbleSort extends React.Component {

    layer;
    animation;

    constructor() {
        super();
        this.state = {
            'array': array,
            'coords': this.defineArrayElementsCoords(array),
            'actions': [initialAction, ...defineActions([...array])],
            'animationStarted': false,
            'actionElements': [],
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
                    {this.renderStage()}
                </div>
            </>
        );
    }

    renderStage() {
        return (
            <Stage width={1100} height={200}> 
                <Layer ref={el => this.layer = el}>
                    {this.renderArray()}
                    {this.state.actionElements}
                </Layer>
            </Stage>
        );
    }
    
    renderArray = () => {
        const {array, sortedElementsCount} = this.state;
        return array.map((val, index) => {
            const isSorted = index >= array.length - sortedElementsCount;
            return this.renderArrayEntry(val, this.state.coords[index], isSorted);
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

    defineArrayElementsCoords(array) {
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
                                                totalActionsHappenedCount * pauseBetweenActions;

            switch (actionStage) {
                case ACTION_NOT_STARTED:
                    if (frame.time > totalTimeForActionsHappened) {
                        const actionElements = this.renderPointers(currentAction, coords);
                        const newActionStage = isCurrentActionEmpty ? ACTION_FINISH_STAGE : ACTION_INIT_STAGE;
                        this.setState({
                            'actionElements': actionElements,
                            'actionStage': newActionStage 
                        });
                    }
                break;

                case ACTION_INIT_STAGE:
                    if (!isCurrentActionEmpty && frame.time >= totalTimeForActionsHappened + 0.33 * timeForCommonAction) {

                        const actionElements = this.renderSwapArrows(currentAction, coords);

                        this.setState({
                            'actionElements': [...this.state.actionElements, ...actionElements],
                            'actionStage': ACTION_ACT_STAGE
                        });
                    }
                break;

                case ACTION_ACT_STAGE:
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
                                'actionElements': [],
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
                            'actionElements': []
                        });
                    }
                break;

                default: 
                    console.error('SHOULD NOT BE HERE');
                break;
            }
        }

    }

    renderPointers(action, coords) {
        const coordsFrom = coords[action.left];
        const coordsTo = coords[action.right];

        const currentPointerPoints = pointerPoints(coordsFrom, radius);
        const counterpartyPointerPoints = pointerPoints(coordsTo, radius);

        const currentPointer = this.arrow(currentPointerPoints, true);
        const counterpartyPointer = this.arrow(counterpartyPointerPoints, true);

        return [currentPointer, counterpartyPointer];
    }

    renderSwapArrows(action, coords) {
        const coordsFrom = coords[action.left];
        const coordsTo = coords[action.right];

        const forwarArrowPoints = forwardCurvedArrowPoints(coordsFrom, coordsTo, radius);
        const backwardArrowPoints = backwardCurvedArrowPoints(coordsFrom, coordsTo, radius);

        const forwardArrow = this.arrow(forwarArrowPoints);
        const backwardArrow =this.arrow(backwardArrowPoints);

        return [forwardArrow, backwardArrow];
    }

    arrow(arrowPoints, pointer = false) {
        return (
            <Arrow key = {arrowKey(arrowPoints)}
                pointsArray = {arrowPoints}
                color = {pointer ? 'black' : 'red'}
            />
        );
    }

}

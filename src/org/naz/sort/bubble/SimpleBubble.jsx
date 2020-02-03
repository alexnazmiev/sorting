import React from 'react';
import { Stage, Layer, Circle, Text, Arrow } from 'react-konva';
import { Animation } from 'konva';

import { defineActions } from './Actions';

const firstEntryX = 100;
const firstEntryY = 100;
const span = 100;
const radius = 20;
const array = [4, 2, 5, 1, 3];

const timeBetweenActions = 2000;

export class SimpleBubbleSort extends React.Component {

    layer;
    animation;
    lastActionTime = 0;

    constructor() {
        super();
        this.state = {
            'coords': this.defineCoords(array),
            'actionStarted': false,
            'actions': defineActions([...array]),
            'actionsCount': 0,
            'additionalElements': []
        };

        this.action = this.action.bind(this);
        this.renderAdditionalElements = this.renderAdditionalElements.bind(this);
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
                    {this.renderArray(array)}
                </div>
            </>
        );
    }

    renderArray(array) {
        console.log(this.state.additionalElements);
        return (
            <Stage width={600} height={200}> 
                <Layer ref={el => this.layer = el}>
                    {array.map((val, index) => {
                        return this.renderArrayEntry(val, this.state.coords[index])
                    })}
                    {this.state.additionalElements}
                    {/* {this.renderAdditionalElements()} */}
                </Layer>
            </Stage>
        );
    }

    renderArrayEntry(value, coords) {
        const {x, y} = coords;
        return (
            <React.Fragment key={`${value}_${coords.x}_${coords.y}`}>
                <Circle
                    x={x}
                    y={y}
                    radius={radius}
                    fill='red'
                    stroke='black'
                    strokeWidth={2}
                />
                <Text
                    x={x - radius / 2 + radius / 4}
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
        if (!this.state.actionStarted) {
            this.animation.start();
            this.setState({'actionStarted': true});
        } else {
            this.animation.stop();
            this.setState({'actionStarted': false});
        }
        
    }

    renderAdditionalElements() {
        if (this.state.actionStarted) {
            return this.renderArrow(this.state.coords[0], this.state.coords[1]);
        }
        return null;
    }

    renderArrow(coordsFrom, coordsTo) {
        const startPoint = [coordsFrom.x + radius * 0.5, coordsFrom.y + 1.05 * radius];
        const middlePoint = [(coordsTo.x + coordsFrom.x) / 2 , coordsTo.y + radius * 1.75];
        const endPoint = [coordsTo.x - radius * 0.5, coordsTo.y + 1.07 * radius];
        return <Arrow 
            points={[...startPoint, ...middlePoint, ...endPoint]}
            stroke = 'red'
            fill = 'red'
            strokeWidth = {2}
            pointerLength = {5}
            pointerWidth = {5}
            tension = {0.5}
        />;
    }

    animationFunc = (frame) => {
        if (this.state.actionStarted) {
            if (frame.time / timeBetweenActions > this.state.actionsCount) {
                console.log(frame.time);

                const {actions, actionsCount, coords} = this.state;
                
                const action = actions[actionsCount];
                console.log(action);
                this.renderSwapActionStartState(action, coords);
                
                if (actionsCount + 1 >= actions.length) {
                    this.animation.stop();
                }
                this.setState({'actionsCount': actionsCount + 1})
            }
        }
    }

    renderSwapActionStartState = (action, coords) => {
        const coordsFrom = coords[action.left];
        const coordsTo = coords[action.right];
        const startPoint = [coordsFrom.x + radius * 0.5, coordsFrom.y + 1.05 * radius];
        const middlePoint = [(coordsTo.x + coordsFrom.x) / 2 , coordsTo.y + radius * 1.75];
        const endPoint = [coordsTo.x - radius * 0.5, coordsTo.y + 1.07 * radius];
        const arrow = <Arrow key={`from_${coordsFrom.x}_to_coordsTo.x`}
            points={[...startPoint, ...middlePoint, ...endPoint]}
            stroke = 'red'
            fill = 'red'
            strokeWidth = {2}
            pointerLength = {5}
            pointerWidth = {5}
            tension = {0.5}
        />;
        this.setState({'additionalElements': [...this.state.additionalElements, arrow]});
    }

}


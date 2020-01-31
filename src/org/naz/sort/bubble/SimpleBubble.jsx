import React from 'react';
import { Stage, Layer, Circle, Text, Arrow } from 'react-konva';
import { Animation } from 'konva';

import { defineActions } from './Actions';

const firstEntryX = 100;
const firstEntryY = 100;
const span = 100;
const radius = 20;
const array = [4, 2, 5, 1, 3];

const timeBetweenActions = 1000;
const lastActionTime = 0;

export class SimpleBubbleSort extends React.Component {

    layer;
    animation;

    constructor() {
        super();
        this.state = {
            'coords': this.defineCoords(array),
            'actionStarted': false,
            'actions': defineActions([...array])
        };

        this.action = this.action.bind(this);
        this.renderAdditionalElements = this.renderAdditionalElements.bind(this);
    }

    componentDidMount() {
        this.animation = new Animation(this.animationFunc, this.layer);
        this.animation.start();
    }

    render() {
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
        return (
            <Stage width={600} height={200}> 
                <Layer ref={el => this.layer = el}>
                    {array.map((val, index) => {
                        return this.renderArrayEntry(val, this.state.coords[index])
                    })}
                    {this.renderAdditionalElements()}
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
            this.setState({'actionStarted': true});
        } else {
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
            console.log(frame.time);
            console.log(frame.timeDiff);
        }
    }

}


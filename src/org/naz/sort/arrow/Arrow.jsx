import React from 'react';
import { Arrow as KonvaArrow } from 'react-konva';

export class Arrow extends React.Component {

    render() {
        const { pointsArray, color } = this.props;
        return (
            <KonvaArrow
                points={[...pointsArray]}
                stroke = {color}
                fill = {color}
                strokeWidth = {2}
                pointerLength = {5}
                pointerWidth = {5}
                tension = {0.5}
            />
        );
    }

}

export function arrowKey(pointsArray) {
    return `from_${pointsArray[0]}_${pointsArray[1]}_to_${pointsArray[pointsArray.length - 2]}_${pointsArray[pointsArray.length - 1]}`;
}

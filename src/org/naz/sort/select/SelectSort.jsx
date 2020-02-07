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

const timeForAction = 1000;
const pauseBetweenActions = 250;

const initialAction = {'action': 'INITIAL'};

const unsortedColor = 'red';
const sortedColor = 'yellow';

const ACTION_NOT_STARTED = 'ACTION_NOT_STARTED';
const ACTION_INIT_STAGE = 'ACTION_INIT_STAGE';
const ACTION_ACT_STAGE = 'ACTION_ACT_STAGE';
const ACTION_FINISH_STAGE = 'ACTION_FINISH_STAGE';

export class SelectSort extends React.Component {

    layer;
    animation;

    

}

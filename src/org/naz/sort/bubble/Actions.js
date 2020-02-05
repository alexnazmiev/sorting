
export function defineActions(array) {
    return defineSimpleBubbleSortActions(array);
}

function defineSimpleBubbleSortActions(array) {
    const actions = [];

    for (let i = array.length - 1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1);
                actions.push(swapAction(j, j + 1, array.length - i - 1));
            } else {
                actions.push(emptyAction(j, j + 1, array.length - i - 1));
            }
        }
    }
    return actions;
}

function swapAction(left, right, cycleStep) {
    return {
        'current': left,
        'action': 'SWAP',
        'left': left,
        'right': right,
        'cycleStep': cycleStep
    }
}

function emptyAction(left, right, cycleStep) {
    return {
        'current': left,
        'action': 'EMPTY',
        'left': left,
        'right': right,
        'cycleStep': cycleStep
    } 
}

export function swap(array, index1, index2) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}


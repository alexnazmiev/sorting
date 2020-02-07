export function defineActions(array) {
    return defineSelectSortActions(array);
}

function defineSelectSortActions(array) {
    const actions = [];

    for (let i = 0; i < array.length - 1; i++) {
        const minElementIndex = findMinElementIndex(array, i, actions);
        swapAction(minElementIndex, i);
        swap(array, minElementIndex, i);
    }
    return actions;
}

function findMinElementIndex(array, searchFromIndex, actions) {
    let minElementIndex = searchFromIndex;

    for (let i = searchFromIndex; i < array.length; i++) {
        actions.push(compareAction(minElementIndex, i));
        if (array[i] < array[minElementIndex]) {
            minElementIndex = i;
        }
    }

    return minElementIndex;
}

function compareAction(left, right) {
    return {
        'current': left,
        'action': 'COMPARE',
        'left': left,
        'right': right
    } 
}

function swapAction(left, right) {
    return {
        'current': left,
        'action': 'SWAP',
        'left': left,
        'right': right
    }
}

export function swap(array, index1, index2) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

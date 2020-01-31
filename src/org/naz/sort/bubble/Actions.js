
export function defineActions(array) {
    return defineSimpleBubbleSortActions(array);
}

function defineSimpleBubbleSortActions(array) {
    const actions = [];

    for (let i = array.length - 1; i > 0; i--) {
        for (let j = 0; j <= i; j++) {
            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1);
                actions.push({
                    'current': j,
                    'action': 'SWAP',
                    'left': j,
                    'right': j + 1
                });
            }
        }
    }
    return actions;
}

function swap(array, index1, index2) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}


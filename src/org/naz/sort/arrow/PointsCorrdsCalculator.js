
export function forwardCurvedArrowPoints(coordsFrom, coordsTo, radius) {
    const startPoint = [coordsFrom.x + radius * 0.5, coordsFrom.y + 1.05 * radius];
        const middlePoint = [(coordsTo.x + coordsFrom.x) / 2 , coordsTo.y + radius * 1.75];
        const endPoint = [coordsTo.x - radius * 0.5, coordsTo.y + 1.07 * radius];

        return [...startPoint, ...middlePoint, ...endPoint];
}

export function backwardCurvedArrowPoints(coordsFrom, coordsTo, radius) {
    const startPoint = [coordsTo.x - radius * 0.5, coordsTo.y - 1.05 * radius];
    const middlePoint = [(coordsTo.x + coordsFrom.x) / 2 , coordsTo.y - radius * 1.75];
    const endPoint = [coordsFrom.x + radius * 0.5, coordsFrom.y - 1.07 * radius];

    return [...startPoint, ...middlePoint, ...endPoint];
}

export function pointerPoints(coordsTo, radius) {
    const startPoit = [coordsTo.x, coordsTo.y + 2.5 * radius];
    const endPoint = [coordsTo.x, coordsTo.y + 1.2 * radius];
    
    return [...startPoit, ...endPoint];
}

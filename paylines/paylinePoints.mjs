import borderLinesPoints from "./points/border.mjs";
import middleLinePoints from "./points/center.mjs";

const animationModes = [
    borderLinesPoints,   // 0 border
    middleLinePoints,    // 1 middle
];

export const linePoints = ({
    animationMode = 0,
    payLines = [
        [2,2,2,1,0],
    ],
    startingX = 50,
    startingY = 50,
    symbolHeight = 220,
    symbolWidth = 220,

}) => {

    let result = animationModes[animationMode](payLines, startingX, startingY, symbolHeight, symbolWidth);

    return result;

}

//linePoints({});
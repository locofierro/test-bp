/** 
 *
 *       FIRST column symbol points (X)
 *       ▲►►►►►►►►►►►▼
 *       ▲           ▼
 *       ▲           ▼
 *       X     X     ▼
 *       ▲           ▼
 *       ▲           ▼
 *       ▲◄◄◄◄◄◄◄◄◄◄◄▼
 * 
 *       LAST column symbol points (X)
 *       ▲►►►►►►►►►►►▼
 *       ▲           ▼
 *       ▲           ▼
 *       ▲     X     X
 *       ▲           ▼
 *       ▲           ▼
 *       ▲◄◄◄◄◄◄◄◄◄◄◄▼
 * 
 *       EVERY other symbol points (X)
 *       ▲►►►►►►►►►►►▼
 *       ▲           ▼
 *       ▲           ▼
 *       ▲     X     ▼
 *       ▲           ▼
 *       ▲           ▼
 *       ▲◄◄◄◄◄◄◄◄◄◄◄▼
 * 
 */


export default function (

    payLines = [[2,1,2,1,2]], // game payLines, array of arrays of integers 

    startingX = 100,          // start of symbol display, X coordinate

    startingY = 100,          // start of symbol display, Y coordinate

    symbolHeight = 256,

    symbolWidth = 256
    
) {

    let payLinePoints = [];
    
    for (const line of payLines) {

        let linePoints = [];

        let pointX = startingX;         // X border of the symbol

        let pointY = startingY 
        
            + (line[0] * symbolHeight) // move to the current matrix row
            
            + (symbolHeight / 2);      // Y center of the symbol


        // FIRST SYMBOL LEFT border point
        linePoints.push({ x: pointX, y: pointY });


        // LTR SYMBOL MIDDLE POINTS
        for (let col = 0; col < line.length; col++) {

            pointX = startingX + (col * symbolWidth) + (symbolWidth / 2);

            pointY = startingY + (line[col] * symbolHeight) + (symbolHeight / 2);

            linePoints.push({ x: pointX, y: pointY });

        }

        pointX = pointX + (symbolWidth / 2);

        // LAST SYMBOL RIGHT border point
        linePoints.push({ x: pointX, y: pointY });

        //RTL SYMBOL MIDDLE POINTS
        for (let col = line.length-1; col >=0; col--) {

            pointX = startingX + (col * symbolWidth) + (symbolWidth / 2);

            pointY = startingY + (line[col] * symbolHeight) + (symbolHeight / 2);

            linePoints.push({ x: pointX, y: pointY });

        }

        // REPEAT FIRST SYMBOL LEFT border point

        linePoints.push(linePoints[0]);

        payLinePoints.push(linePoints);

    }

    return payLinePoints;

}
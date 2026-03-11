/** LEFT TO RIGHT BEHAVIOUR 
 *       
 * 
 *       FIRST column symbol borders
 * 
 *           LTR 1
 *       ▲►►►►►►►►►►►▼
 *       ▲           ▼
 *       ▲           ▼
 *       ▲           ▼ LTR 2
 *       ▲           ▼  (*)
 *       ▲           ▼
 *       ▲◄◄◄◄◄◄◄◄◄◄◄▼
 *
 *       (*) only if next column's symbol is located on a lower row
 * 
 * 
 *       MIDDLE column symbol borders
 * 
 *           LTR 1
 *       ▲►►►►►►►►►►►▼
 *       ▲           ▼
 *       ▲           ▼
 * LTR 0 ▲           ▼ LTR 2 
 *  (*)  ▲           ▼  (**)
 *       ▲           ▼
 *       ▲◄◄◄◄◄◄◄◄◄◄◄▼
 * 
 *       (*) only if previous column's symbol is located on a lower row
 *       (**) only if next column's symbol is located on a lower row 
 * 
 * 
 *       LAST column symbol borders
 * 
 *           LTR 1
 *       ▲►►►►►►►►►►►▼
 *       ▲           ▼
 *       ▲           ▼
 * LTR 0 ▲           ▼ LTR 2 
 *  (*)  ▲           ▼ 
 *       ▲           ▼
 *       ▲◄◄◄◄◄◄◄◄◄◄◄▼
 * 
 *       (*) only if previous column's symbol is located on a lower row
 * 
 */

/** RIGHT TO LEFT BEHAVIOUR 
 *       
 * 
 *       LAST column symbol borders
 * 
 *       ▲►►►►►►►►►►►▼
 *       ▲           ▼
 *       ▲           ▼
 * RTL 1 ▲           ▼  
 *  (*)  ▲           ▼  
 *       ▲           ▼
 *       ▲◄◄◄◄◄◄◄◄◄◄◄▼
 *           RTL 0
 *
 *       (*) only if previous column's symbol is located on a higher row
 * 
 * 
 *       MIDDLE column symbol borders
 * 
 *       ▲►►►►►►►►►►►▼
 *       ▲           ▼
 *       ▲           ▼
 * RTL 2 ▲           ▼ RTL 0
 *  (**) ▲           ▼  (*) 
 *       ▲           ▼
 *       ▲◄◄◄◄◄◄◄◄◄◄◄▼
 *           RTL 1
 *
 *       (*) only if next column's symbol is located on a higher row
 *       (**) only if previous column's symbol is located on a higher row 
 * 
 * 
 *       LAST column symbol borders
 * 
 *       ▲►►►►►►►►►►►▼
 *       ▲           ▼
 *       ▲           ▼
 * RTL 2 ▲           ▼ RTL 0
 *       ▲           ▼  (*) 
 *       ▲           ▼
 *       ▲◄◄◄◄◄◄◄◄◄◄◄▼
 *           RTL 1
 *
 *       (*) only if next column's symbol is located on a higher row
 * 
 */


const ltr = (col, line) => {

    let borders = {

        left: false,

        top: true,

        right: null,

        bottom: false,

    }

    borders.right = (col == line.length-1)

        ? true

        : line[col] < line[col+1];

        
    return borders;

}

const rtl = (col, line) => {

    let borders = {

        left: null,

        top: false,

        right: true,

        bottom: true,

    }

    borders.left = (col == 0)

        ? true

        : line[col-1] < line[col];

        
    return borders;

}

export default function (

    payLines = [[2,1,2,1,2]], // game payLines, array of arrays of integers 

    startingX = 100,          // start of symbol display, X coordinate

    startingY = 100,          // start of symbol display, Y coordinate

    symbolHeight = 128,

    symbolWidth = 256
    
) {

    let payLinePoints = [];
    
    for (const line of payLines) {

        let leftPoints = [];
        let rightPoints = [];

        //LTR
        for (let col = 0; col < line.length; col++) {

            let coordinateX = startingX + (col * symbolWidth);         // left symbol coordinate

            let coordinateY = startingY + (line[col] * symbolHeight);  // top symbol cordinate

            let leftToRight = ltr(col, line);


            if (
                col == 0
                
                || line[col-1] > line[col] 
                
                || (line[col-1] < line[col] && line[col] - line[col-1] > 1)) {

                leftPoints.push({ x: coordinateX, y: coordinateY });

            }

            if (leftToRight.left) {

                leftPoints.push({ x: coordinateX, y: coordinateY - symbolHeight });

            }

            if (leftToRight.top) {

                leftPoints.push({ x: coordinateX + symbolWidth, y: coordinateY });

            }

            if (leftToRight.right) {

                leftPoints.push({ x: coordinateX + symbolWidth, y: coordinateY + symbolHeight });

            }


        }

        //RTL
        for (let col = line.length-1; col >=0; col--) {

            let coordinateX = startingX + (col * symbolWidth) + symbolWidth; // right symbol coordinate

            let coordinateY = startingY + (line[col] * symbolHeight);        // top symbol cordinate

            let rightToLeft = rtl(col, line);


            if (col != line.length-1

                && ((line[col] > line[col+1]) && (line[col] - line[col+1]) > 1)) {

                rightPoints.push({ x: coordinateX, y: coordinateY });

            }

            if (rightToLeft.right 
                
                && col!=line.length-1
            
                && line[col+1] != line[col]) {

                rightPoints.push({ x: coordinateX, y: coordinateY + symbolHeight });

            }

            if (rightToLeft.bottom) {

                rightPoints.push({ x: coordinateX - symbolWidth, y: coordinateY + symbolHeight });

            }

            if (col == 0 || (rightToLeft.left && line[col-1] > line[col])) {

                rightPoints.push({ x: coordinateX - symbolWidth, y: coordinateY });

            }

        }

        payLinePoints.push([...leftPoints, ...rightPoints]);
        
    }

    return payLinePoints;

}
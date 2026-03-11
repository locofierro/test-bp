export function drawGrid(gridGraphics, currentState, margins) {

    const { xMargin, yMargin } = margins;

    gridGraphics.clear();

    const { rectWidth, rectHeight, cols, rows } = currentState;

    let fillColor = 0x2a2a38;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = (c * rectWidth) + xMargin;
            const y = (r * rectHeight) + yMargin;

            // draw rectangle with thin stroke
            gridGraphics.beginFill(fillColor);
            gridGraphics.lineStyle(1, 0x55556b, 0.6);
            gridGraphics.drawRect(x, y, rectWidth-1, rectHeight-1); // -1 to see stroke between cells
            gridGraphics.endFill();
        }
    }
}

export function buildGridContainer(PIXI, app){
        
    const gridContainer = new PIXI.Container();
    app.stage.addChild(gridContainer);

    const gridGraphics = new PIXI.Graphics();
    gridContainer.addChild(gridGraphics);

    return { gridContainer, gridGraphics }
    
}
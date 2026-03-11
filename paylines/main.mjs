import { buildAnimationContainer, loadTextures, reshapeHead, reshapeTrail } from "./animation.mjs";
import { buildGridContainer, drawGrid } from "./grid.mjs";
import { linePoints } from "./paylinePoints.mjs";

(async function() {
    // --- PIXI setup ---
    const app = new PIXI.Application({
        width: 1280,
        height: 1024,
        backgroundColor: 0x0c0c14,
        antialias: true,
        resolution: 1,
        autoDensity: true
    });
    document.getElementById('pixi-stage').appendChild(app.view);

    const payLineTable = [
        [1,1,1,1,1],
        [2,2,2,2,2],
        [0,0,0,0,0],
        [0,1,2,1,0],
        [2,1,0,1,2],
        [2,1,0,0,0],
        [0,1,2,2,2],
        [2,2,2,1,0],
        [0,0,0,1,2],
        [1,1,1,2,2],
    ];

    const textures = await loadTextures(PIXI);

    const { gridContainer, gridGraphics } = buildGridContainer(PIXI, app);

    // --- state
    const xMargin = 20, yMargin = 20;

    let currentState = {
        elapsed: 0,
        rectWidth: 220,
        rectHeight: 220,
        cols: 5,
        rows: 4,
        mode: 0,
        trailCount: 256,
        shape: 0,
        payLine: [payLineTable[0]],
        texture: textures[0],
    };

    let points = linePoints({ 
        animationMode: currentState.mode,
        payLines: currentState.payLine,
        startingX: xMargin,
        startingY: yMargin,
        symbolHeight: currentState.rectHeight,
        symbolWidth: currentState.rectWidth,
    })[0];

    const { particleContainer, animationHead, animationTrail } = buildAnimationContainer(

        PIXI, app, currentState, {xMargin: points[0].x, yMargin: points[0].y}
    
    );

    // --- connect HTML inputs to state
    const rectWidthInput = document.getElementById('rectWidth');
    const rectHeightInput = document.getElementById('rectHeight');
    const colsInput = document.getElementById('gridCols');
    const rowsInput = document.getElementById('gridRows');
    const modeSelect = document.getElementById('animMode');
    const trailInput = document.getElementById('trailCount');
    const shapeSelect = document.getElementById('animShape');
    const payLineSelector = document.getElementById('payLinesSelector');

    async function updateStateFromInputs() {
        currentState.rectWidth = parseInt(rectWidthInput.value, 10) || 40;
        currentState.rectHeight = parseInt(rectHeightInput.value, 10) || 40;
        currentState.cols = parseInt(colsInput.value, 10) || 8;
        currentState.rows = parseInt(rowsInput.value, 10) || 8;
        currentState.mode = modeSelect.value;
        currentState.trailCount = parseInt(trailInput.value, 10) || 5;
        currentState.shape = shapeSelect.value;
        currentState.texture = textures[shapeSelect.value];
        currentState.payLine = [payLineTable[payLineSelector.value]];

        // clamp trail to 1..1024
        trailInput.value = currentState.trailCount;
        await stateChanged();
    }

    // initial rebuild
    await updateStateFromInputs();

    // event listeners
    rectWidthInput.addEventListener('input', updateStateFromInputs);
    rectHeightInput.addEventListener('input', updateStateFromInputs);
    colsInput.addEventListener('input', updateStateFromInputs);
    rowsInput.addEventListener('input', updateStateFromInputs);
    modeSelect.addEventListener('change', updateStateFromInputs);
    trailInput.addEventListener('input', updateStateFromInputs);
    shapeSelect.addEventListener('change', updateStateFromInputs);
    payLineSelector.addEventListener('change', updateStateFromInputs);

    // --- animation loop ---
    let lastTimestamp = performance.now();
    const SPEED_FACTOR = 0.18; // seconds per step (lower = faster)

    // add extra update to reset any glitch
    function refreshAfterChange() {
        // just forcing rebuildPath already done; no extra needed
    }

    // also update when inputs change (clamp via state)
    trailInput.addEventListener('blur', function() {
        let val = parseInt(this.value, 10);
        if (isNaN(val)) val = 5;
        val = Math.min(1024, Math.max(1, val));
        this.value = val;
        updateStateFromInputs();
    });

    // ensure numeric fields are within reasonable range
    [rectWidthInput, rectHeightInput, colsInput, rowsInput].forEach(inp => {
        inp.addEventListener('blur', async function() {
            let val = parseInt(this.value, 10);
            if (isNaN(val) || val < 1) val = (this===rectWidthInput||this===rectHeightInput) ? 20 : 4;
            if (this === rectWidthInput || this === rectHeightInput) {
                if (val > 220) val = 220;
            } else {
                if (val > 60) val = 60;  // avoid crazy huge grids (performance still fine)
            }
            this.value = val;
            await updateStateFromInputs();
        });
    });

    // initial draw call not needed, tick will run.
    // but to show something before first tick, we can call tick once manually? nah.

    // --- handle window resize (just keep 600x600) ---
    // also nice to recenter container if needed
    gridContainer.x = 0;
    gridContainer.y = 0;

    // update cell count display on any change (already in rebuildPath)
    // Add extra safety: rebuild if any weirdness
    window.addEventListener('load', async () => {
        await updateStateFromInputs();
    });

    async function stateChanged() {

        currentState.elapsed = 0;

        drawGrid(gridGraphics, currentState, {xMargin, yMargin});

        points = linePoints({ 
            animationMode: currentState.mode,
            payLines: currentState.payLine,
            startingX: xMargin,
            startingY: yMargin,
            symbolHeight: currentState.rectHeight,
            symbolWidth: currentState.rectWidth,
        })[0];

        currentState.texture = textures[currentState.shape];

        animationHead.texture = currentState.texture;

        reshapeHead(animationHead, {xMargin: points[0].x, yMargin: points[0].y});

        for (let i = 0; i < currentState.trailCount; i++) {

            reshapeTrail(animationTrail[i], animationHead, i, currentState.trailCount);

        }

    }

    await stateChanged();

    const durationMs = 180;

    app.ticker.add((delta) => {

        const baseScale = 0.18;

        currentState.elapsed += delta;


        // get current time in seconds
        const now = performance.now() / 1000; // seconds

        const t = (currentState.elapsed % durationMs) / durationMs;

        const f = t * (points.length - 1);

        const i0 = Math.floor(f);

        const i1 = Math.min(i0 + 1, points.length - 1);

        const lt = f - i0;
      
        const p0 = points[i0];
        const p1 = points[i1];
      
        const x = (p0.x + (p1.x - p0.x) * lt); //* sx;
        const y = (p0.y + (p1.y - p0.y) * lt); //* sy;

     
        animationHead.position.set(x, y);
      
        const pulse = 1 + Math.sin(currentState.elapsed * 0.01) * 0.2;
        animationHead.scale.set(baseScale * pulse);
        animationHead.rotation += 0.05 * delta;
      
        let prevX = x, prevY = y;
        for (const s of animationTrail) {

            let tmpX = s.x, tmpY = s.y;

            s.position.set(prevX, prevY);

            //s.rotation += 0.05 * delta;

            prevX = tmpX; prevY = tmpY;

        }
        
    });

})();
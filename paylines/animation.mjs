export async function loadTextures (PIXI) {

    let textures = await Promise.all([
        PIXI.Assets.load('brillo0.png'),
        PIXI.Assets.load('brillo1.png'),
        //PIXI.Assets.load('brillo3.png'),
    ]);

    return textures;

}

export function reshapeHead(animationHead, {xMargin, yMargin}) {

    const baseScale = 0.18;
    animationHead.anchor.set(0.5);
    animationHead.blendMode = PIXI.BLEND_MODES.ADD;
    animationHead.scale.set(baseScale);
    animationHead.position.set(xMargin,yMargin);

}

export function reshapeTrail(animationTrail, animationHead, i, trailCount) {

    if(!animationTrail) return;
    const baseScale = 0.18;
    animationTrail.anchor.set(0.5);
    animationTrail.blendMode = PIXI.BLEND_MODES.ADD;
    const t = 1.2 - i / trailCount;
    animationTrail.alpha = 0.6 * t;
    animationTrail.scale.set(baseScale * Math.random() * t);
    animationTrail.position.set(animationHead.position.x, animationHead.position.y);

}

export function buildAnimationContainer(PIXI, app, currentState, {xMargin, yMargin}) {

    let particleContainer = new PIXI.ParticleContainer({uvs: true});

    let animationHead = new PIXI.Sprite(currentState.texture);

    reshapeHead(animationHead, {xMargin, yMargin});

    particleContainer.addChild(animationHead);

    let animationTrail = [];

    for (let i = 0; i < currentState.trailCount; i++) {

        const animationTrailSprite = new PIXI.Sprite(currentState.texture);

        reshapeTrail(animationTrailSprite, animationHead, i, currentState.trailCount)

        particleContainer.addChild(animationTrailSprite);

        animationTrail.push(animationTrailSprite);

    }

    app.stage.addChild(particleContainer);

    return { particleContainer, animationHead, animationTrail }

}
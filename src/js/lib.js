const requestAnimationFrame =   window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame;

/**
 * @method waitUntilAnimationFrame
 */
export function waitUntilAnimationFrame() {
    return new Promise(requestAnimationFrame);
}
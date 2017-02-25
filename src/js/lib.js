const requestAnimationFrame =   window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame;

export function waitUntilAnimationFrame() {
    return new Promise(requestAnimationFrame);
}
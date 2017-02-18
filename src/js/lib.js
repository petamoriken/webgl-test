const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

export function waitUntilAnimationFrame() {
    return new Promise(requestAnimationFrame);
}
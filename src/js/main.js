import { draw } from "./draw";

(async () => {
    const waitLoading = new Promise(resolve => {
        window.addEventListener("DOMContentLoaded", resolve, { capture: false, once: true });
    });

    const vertex = await fetch("glsl/main.vert").then(req => req.text());
    const fragment = await fetch("glsl/main.frag").then(req => req.text());

    await waitLoading;

    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    
    draw(gl, [vertex, fragment]);
})();
import { draw } from "./draw";

(async () => {
    const fetchVertex = fetch("glsl/main.vert").then(req => req.text());
    const fetchFragment = fetch("glsl/main.frag").then(req => req.text());

    const waitLoading = new Promise(resolve => {
        window.addEventListener("DOMContentLoaded", resolve, { capture: false, once: true });
    });

    const [vertex, fragment] = await Promise.all([fetchVertex, fetchFragment, waitLoading]);

    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    
    draw(gl, [{vertex, fragment}]);
})();
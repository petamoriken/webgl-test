import mat4 from "gl-matrix/src/gl-matrix/mat4";

import { waitUntilAnimationFrame } from "./lib";
import glWrapper from "./glWrapper";

/** 
 * @method draw
 * @param {WebGLRenderingContext} gl - WebGL Context
 * @param {Object[]} shaders - GLSL Shader Object
 */
export async function draw(gl, shaders) {
    // クリア色の指定
    gl.clearColor(0, 0, 0, 1);

    // 深度テストを有効化
    gl.enable(gl.DEPTH_TEST);

    // メインシェーダーの取得
    const { vertex, fragment } = shaders[0];

    // シェーダーからプログラムを取得
    const program = glWrapper.compileShaderAndLink(gl, {vertex, fragment});
    
    // uniform の Location を取得
    const pLocation = gl.getUniformLocation(program, "projectionMatrix");
    const mvLocation = gl.getUniformLocation(program, "modelviewMatrix");

    // attribute の Location を取得
    const vLocation = gl.getAttribLocation(program, "vertex");
    const nLocation = gl.getAttribLocation(program, "normal");

    // Vertex Buffer Object(VBO) を作る
    const vBuffer = glWrapper.createVertexBuffer(gl, Float32Array.of(-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0));
    const nBuffer = glWrapper.createVertexBuffer(gl, Float32Array.of(0, 0, 1, 0, 0, 1, 0, 0, 1));

    // 描画処理
    const startTime = performance.now();
    for(;;) {
        // 描画開始からの時間
        const delta = await waitUntilAnimationFrame() - startTime;

        // WebGL の canvas の内容をクリア
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // シェーダーに uniform を与える 
        {
            // frustum 行列の生成
            const pMat = mat4.create();
            mat4.frustum(pMat, -1, 1, -1, 1, 3, 10);

            // 移動回転行列の生成
            const mvMat = mat4.create();
            mat4.translate(mvMat, mvMat, [0, 0, -6]);
            mat4.rotate(mvMat, mvMat, -0.002 * delta, [0, 1, 0]); // 軸 [0, 1, 0] で回転
            
            // uniform で頂点シェーダに送信
            gl.uniformMatrix4fv(pLocation, false, pMat);
            gl.uniformMatrix4fv(mvLocation, false, mvMat);
        }

        // attribute でバッファを送信
        glWrapper.setAttribute(gl, vBuffer, vLocation, 3);
        glWrapper.setAttribute(gl, nBuffer, nLocation, 3);

        // 今まで設定した内容で WebGL に送信
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
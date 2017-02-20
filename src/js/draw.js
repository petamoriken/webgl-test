import mat4 from "gl-matrix/src/gl-matrix/mat4";

import { waitUntilAnimationFrame } from "./lib";
import { compileShaderAndLink, createVertexBuffer, setAttribute } from "./glWrapper";

export async function draw(gl, [vertex, fragment]) {
    // クリア色の指定
    gl.clearColor(0, 0, 0, 1);

    // 深度テストを有効化
    gl.enable(gl.DEPTH_TEST);

    // シェーダーからプログラムを取得
    const program = compileShaderAndLink(gl, [vertex, fragment]);
    
    // uniform の Location を取得
    const pLocation = gl.getUniformLocation(program, "projectionMatrix");
    const mvLocation = gl.getUniformLocation(program, "modelviewMatrix");

    // attribute の Location を取得
    const vLocation = gl.getAttribLocation(program, "vertex");
    const nLocation = gl.getAttribLocation(program, "normal");

    // Vertex Buffer Object(VBO) を作る
    const vBuffer = createVertexBuffer(gl, Float32Array.of(-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0));
    const nBuffer = createVertexBuffer(gl, Float32Array.of(0, 0, 1, 0, 0, 1, 0, 0, 1));

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
        setAttribute(gl, vBuffer, vLocation, 3);
        setAttribute(gl, nBuffer, nLocation, 3);
        
        // 今まで設定した内容で WebGL に送信
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
import { mat4 } from "gl-matrix";

import { waitUntilAnimationFrame } from "./lib";
import { compileShaderAndLink } from "./glWrapper";

export async function draw(gl, [vertex, fragment]) {

    // シェーダーからプログラムを取得
    const program = compileShaderAndLink(gl, [vertex, fragment]);
    
    // uniform の Location を取得
    const pLocation = gl.getUniformLocation(program, "projectionMatrix");
    const mvLocation = gl.getUniformLocation(program, "modelviewMatrix");

    // attribute の Location を取得
    const vLocation = gl.getAttribLocation(program, "vertex");
    const nLocation = gl.getAttribLocation(program, "normal");

    // 描画するバッファの読み込み(attribute)
    const [vbuffer, nbuffer] = [gl.createBuffer(), gl.createBuffer()]; // 頂点座標バッファと法線ベクトルバッファ
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, nbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]), gl.STATIC_DRAW);

    // 描画処理
    const startTime = performance.now();
    for(;;) {
        const dt = await waitUntilAnimationFrame() - startTime;

        // WebGL の canvas の内容をクリア
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        // シェーダーに uniform を与える 
        {
            // frustum 行列の生成
            const pMat = mat4.create();
            mat4.frustum(pMat, -1, 1, -1, 1, 3, 10);

            // 移動回転行列の生成
            const mvMat = mat4.create();
            mat4.translate(mvMat, mvMat, [0, 0, -6]);
            mat4.rotate(mvMat, mvMat, -0.002 * dt , [0, 1, 0]); // 軸 [0, 1, 0] で回転
            
            // uniform で頂点シェーダに送信
            gl.uniformMatrix4fv(pLocation, false, pMat);
            gl.uniformMatrix4fv(mvLocation, false, mvMat);
        }

        // attribute でバッファを送信
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer); // 頂点座標
        gl.vertexAttribPointer(vLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vLocation);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, nbuffer); // 法線ベクトル
        gl.vertexAttribPointer(nLocation, 3, gl.FLOAT, true, 0, 0);
        gl.enableVertexAttribArray(nLocation);
        
        // 今まで設定した内容で WebGL に送信
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
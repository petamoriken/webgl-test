import mat4 from "gl-matrix/src/gl-matrix/mat4";

import { waitUntilAnimationFrame } from "./lib";
import GLWrapper from "./GLWrapper";

/** 
 * @method draw
 * @param {WebGLRenderingContext} gl - WebGL Context
 * @param {Object[]} shaders - GLSL Shader Object
 */
export async function draw(gl, shaders) {
    // 頂点データ
    const vertexBuffer = Float32Array.of(
        -0.5, 0.5, 0,
        0.5, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0
    );

    // 各頂点の法線ベクトルデータ
    const normalBuffer = Float32Array.of(
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    );

    // 頂点データ、法線ベクトルデータのインデックス
    const indexBuffer = Uint16Array.of(
        0, 1, 2,
        3, 2, 1
    );

    // glWrapper を作る
    const glWrapper = new GLWrapper(gl);

    // クリア色の指定
    gl.clearColor(0, 0, 0, 1);

    // カリング、深度テスト
    //gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // メインシェーダーの取得
    const { vertex, fragment } = shaders[0];

    // シェーダーからプログラムを取得
    const program = glWrapper.compileShaderAndLink(vertex, fragment);

    // シェーダーに attribute を与える
    {
        // attribute の Location を取得
        const vLocation = gl.getAttribLocation(program, "vertex");
        const nLocation = gl.getAttribLocation(program, "normal");

        // 指定した attribute の Location のレジスタを有効にする
        glWrapper.enableAttributes([vLocation, nLocation]);

        // Vertex Buffer Object(VBO) を作る
        const vBuffer = glWrapper.createVertexBuffer(vertexBuffer);
        const nBuffer = glWrapper.createVertexBuffer(normalBuffer);

        // attribute で VBO の指定
        glWrapper.setAttribute(vBuffer, vLocation, 3);
        glWrapper.setAttribute(nBuffer, nLocation, 3);

        // Index Buffer Object(IBO) を作る
        const ibo = glWrapper.createIndexBuffer(indexBuffer);
    
        // IBO をバインドする
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    }

    // uniform の Location を取得
    const pLocation = gl.getUniformLocation(program, "projectionMatrix");
    const mvLocation = gl.getUniformLocation(program, "modelviewMatrix");

    // 描画処理
    const startTime = performance.now();
    for(;;) {
        // 描画開始からの時間
        const delta = await waitUntilAnimationFrame() - startTime;

        // WebGL の canvas の内容をクリア
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // シェーダーに uniform を与える
        {
            // frustum 行列
            const pMat = mat4.create();
            mat4.frustum(pMat, -1, 1, -1, 1, 3, 10);

            // 一つ目
            {
                // 移動回転行列                
                const mvMat = mat4.create();
                mat4.translate(mvMat, mvMat, [-1, 0, -6]);
                mat4.rotate(mvMat, mvMat, -0.002 * delta, [0, 1, 0]); // 軸 [0, 1, 0] で回転
                
                // uniform で頂点シェーダに送信
                gl.uniformMatrix4fv(pLocation, false, pMat);
                gl.uniformMatrix4fv(mvLocation, false, mvMat);

                // 今まで設定した内容で WebGL に送信
                gl.drawElements(gl.TRIANGLES, indexBuffer.length, gl.UNSIGNED_SHORT, 0);
            }

            // 二つ目
            {
                // 移動回転行列                
                const mvMat = mat4.create();
                mat4.translate(mvMat, mvMat, [1, 0, -6]);
                mat4.rotate(mvMat, mvMat, 0.002 * delta, [0, 1, 0]); // 軸 [0, 1, 0] で回転
                
                // uniform で頂点シェーダに送信
                gl.uniformMatrix4fv(pLocation, false, pMat);            
                gl.uniformMatrix4fv(mvLocation, false, mvMat);

                // 今まで設定した内容で WebGL に送信
                gl.drawElements(gl.TRIANGLES, indexBuffer.length, gl.UNSIGNED_SHORT, 0);
            }
        }
        // キューの即時実行
        gl.flush();
    }
}
import { mat4 } from "gl-matrix";
import { createProgram } from "./glWrapper";

export function draw(gl, [vertex, fragment]) {

    // シェーダーからプログラムを取得
    const program = createProgram(gl, [vertex, fragment]);
    
    // リンクしたプログラムの使用
    gl.useProgram(program);
    
    // 描画するバッファの読み込み(attribute)
    const [vbuf, nbuf] = [gl.createBuffer(), gl.createBuffer()]; // 頂点座標バッファと法線ベクトルバッファ
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, nbuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]), gl.STATIC_DRAW);
    
    // 描画処理
    const startTime = performance.now();
    requestAnimationFrame(function frame() {

        // WebGL の canvas の内容をクリア
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        // シェーダーに uniform を与える 
        {
            // frustum 行列の生成
            const projMat = mat4.create();
            mat4.frustum(projMat, -1, 1, -1, 1, 3, 10);

            // 移動回転行列の生成
            const mvMat = mat4.create();
            mat4.translate(mvMat, mvMat, [0, 0, -6]);
            mat4.rotate(mvMat, mvMat, (startTime - performance.now()) * 0.002, [0, 1, 0]); // 軸 [0, 1, 0] で回転
            
            // uniform で頂点シェーダに送信
            gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, projMat);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelviewMatrix"), false, mvMat);
        }

        // シェーダーに attribute を与える
        {
            // attribute の index を取得
            const vpos = gl.getAttribLocation(program, "vertex");
            const npos = gl.getAttribLocation(program, "normal");
            
            // 取得した attribute postion にバッファを送信
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuf); // 頂点座標
            gl.vertexAttribPointer(vpos, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vpos);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, nbuf); // 法線ベクトル
            gl.vertexAttribPointer(npos, 3, gl.FLOAT, true, 0, 0);
            gl.enableVertexAttribArray(npos);
        }
        
        // 今まで設定した内容で WebGL に送信
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        
        // 繰り返し
        requestAnimationFrame(frame);
    });
}
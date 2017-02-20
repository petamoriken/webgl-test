export function compileShaderAndLink(gl, [vertexText, fragmentText]) {
    
    // 頂点シェーダーのコンパイル
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexText);
    gl.compileShader(vs);
    if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error("vertex shader compile error");
        throw new Error(gl.getShaderInfoLog(vs));
    }
    
    // フラグメントシェーダのコンパイル
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentText);
    gl.compileShader(fs);
    if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error("fragment shader compile error");
        throw new Error(gl.getShaderInfoLog(fs));
    }
    
    // シェーダをリンク
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("link error");
        throw new Error(gl.getShaderInfoLog(fs));
    }

    // リンクしたプログラムの使用
    gl.useProgram(program);

    return program;
}

export function createVertexBuffer(gl, f32array) {
    // バッファオブジェクトの生成
    var vbo = gl.createBuffer();
    
    // バッファをバインドする
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    
    // バッファにデータをセット
    gl.bufferData(gl.ARRAY_BUFFER, f32array, gl.STATIC_DRAW);
    
    // バッファのバインドを無効化
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    // 生成した VBO を返して終了
    return vbo;
}

export function setAttribute(gl, vbo, location, size, type = gl.FLOAT, normalized = false, stride = 0, offset = 0) {
    // バッファをバインドする
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // attribute 属性を有効にする
    gl.enableVertexAttribArray(location);

    // attribute 属性を登録
    gl.vertexAttribPointer(location, size, type, normalized, stride, offset);

    // バッファのバインドを無効化
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
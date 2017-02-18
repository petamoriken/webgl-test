export function createProgram(gl, [vertexText, fragmentText]) {
    
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

    return program;
}
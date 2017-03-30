export default class GLWrapper {

    /**
     * @param {WebGLRenderingContext} gl - WebGL Context
     */
    constructor(gl) {
        this.context = gl;

        /** @type {?Set<number>} */
        this.attributeLocations = null;
    }

    /**
     * @method glWrapper.compileShaderAndLink
     * @param {Object} shader - GLSL Shader Object
     * @param {string} shader.vertex - GLSL Vertex Shader Text
     * @param {string} shader.fragment - GLSL Fragment Shader Text
     */
    compileShaderAndLink(vertex, fragment) {
        const gl = this.context;

        // 頂点シェーダーのコンパイル
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertex);
        gl.compileShader(vs);
        if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error("vertex shader compile error");
            throw new Error(gl.getShaderInfoLog(vs));
        }
        
        // フラグメントシェーダのコンパイル
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragment);
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

    /**
     * @method glWrapper.createVertexBuffer
     * @param {Float32Array} f32array - Vertex Buffer Data
     */
    createVertexBuffer(f32array) {
        const gl = this.context;

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

    /**
     * @method glWrapper.enableAttribute
     * @param {number[]} locations - Array of Attribute Locations
     */
    enableAttributes(locations) {
        const gl = this.context;

        const newSet = new Set(locations);
        const oldSet = this.attributeLocations;

        // 最初
        if(oldSet === null) {
            // 全ての必要なレジスタを有効化
            for(let num of newSet) {
                gl.enableVertexAttribArray(num);
            }

        // 二回目以降
        } else {
            // 必要なレジスタを有効化
            for(let num of [...newSet].filter(val => !oldSet.has(val))) {
                gl.enableVertexAttribArray(num);
            }

            // 不要なレジスタを無効化
            for(let num of [...oldSet].filter(val => !newSet.has(val))) {
                gl.disableVertexAttribArray(num);
            }
        }

        this.attributeLocations = newSet;
    }

    /**
     * @method glWrapper.setAttribute
     * @param {WebGLBuffer} vbo - Vertex Buffer Object
     * @param {number} location - A GLuint specifying the index of the vertex attribute that is to be modified.
     * @param {number} size - A GLint specifying the number of components per vertex attribute. Must be 1, 2, 3, or 4.
     * @param {number} type - A GLenum specifying the data type of each component in the array. Must be one of: gl.BYTE, gl.UNSIGNED_BYTE, gl.SHORT, gl.UNSIGNED_SHORT, gl.FLOAT.
     * @param {boolean} normalized - A GLboolean specifying if fixed-point data values should be normalized (gl.TRUE) or are to converted to fixed point values (gl.FALSE) when accessed.
     * @param {number} stride - A GLsizei specifying the offset in bytes between the beginning of consecutive vertex attributes.
     * @param {number} offset - A GLintptr specifying an offset in bytes of the first component in the vertex attribute array. Must be a multiple of type.
     */
    setAttribute(vbo, location, size, type = this.context.FLOAT, normalized = false, stride = 0, offset = 0) {
        const gl = this.context;

        // バッファをバインドする
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

        // attribute 属性を登録
        gl.vertexAttribPointer(location, size, type, normalized, stride, offset);

        // バッファのバインドを無効化
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

GLWrapper[Symbol.toStringTag] = "GLWrapper";
// 演算精度 highp, mediump, lowp
precision mediump float;

// 頂点シェーダから受け取る変数
varying vec3 e_normal; // 法線ベクトル

void main() {
    // 法線ベクトルを正規化する
    vec3 n = normalize(e_normal);
    
    // 法線ベクトルと光ベクトル（0, 0, 1) との内積で光量を決定する
    float l = abs(dot(n, normalize(vec3(0, 0, 1))));
    
    // このピクセルの色を RGBA(l, l, l, 1) に設定する
    gl_FragColor = vec4(l, l, l, 1.0);
}
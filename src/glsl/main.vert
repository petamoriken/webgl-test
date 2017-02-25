// 演算精度 highp, mediump, lowp
precision mediump float;

// 描画プリミティブごとに与えられる変数
uniform mat4 projectionMatrix; // 錐台(frustum)変換行列
uniform mat4 modelviewMatrix; // 移動回転行列

// 頂点ごとに与えられる変数
attribute vec3 vertex; // 頂点座標
attribute vec3 normal; // 頂点の法線ベクトル

// フラグメントシェーダに渡す変数
varying vec3 e_normal; // 法線ベクトルと平行移動回転行列との積

void main() {
    // 頂点座標をクリッピング座標系に変換する
    gl_Position = projectionMatrix * modelviewMatrix * vec4(vertex, 1.0);
    
    // 法線ベクトルを世界座標系に変換する
    e_normal = vec3(modelviewMatrix * vec4(normal, 0.0));
}
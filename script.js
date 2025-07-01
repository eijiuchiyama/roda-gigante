import { Roda } from './roda.js';
import { Arvore } from './arvore.js';
import { Predio } from './predio.js';
import { Solo } from './solo.js';
import { Camera } from './camera.js';

window.onload = main;

var gCanvas;
var gl;
var gShader = {};
var bRun;

var camera;
var solo;
var roda;
var arvores = [];
var predios = [];
var gaPosicoes = [];
var gaNormais = [];
var gaCores = [];
var gaAlfas = [];
var gaTexcoords = [];
var gaUsaTextura = [];

var gUltimoT = Date.now();

var rodando;

export const COR_CLEAR = [0.0, 1.0, 1.0, 1.0];

const pos = vec3(150, 0, 5);
const up = vec3(0, 0, 1);
const at = vec3(0, 0, 5);
const fovy = 45.0;
const aspect = 1.0;
const near = 1;
const far = 2000;

const LUZ = {
    pos : vec4(0.0, 0.0, 100.0, 1.0), // posição
    amb : vec4(0.5, 0.5, 0.5, 1.0), // ambiente
    dif : vec4(1.0, 1.0, 1.0, 1.0), // difusão
    esp : vec4(1.0, 1.0, 1.0, 1.0), // especular
};

const MAT = {
  amb: vec4(0.5, 0.5, 0.5, 1.0),
  dif: vec4(2.0, 2.0, 2.0, 1.0),
};

var bufVertices;
var bufCores;
var bufNormais;
var bufAlfas;
var bufTexcoords;
var bufUsaTextura;

var texturaSolo;
var imagem;

const posArvores = [[20, 15], [40, 15], [60, 15], [20, -15], [40, -15], [60, -15], [30, 40], [50, 40], [30, -40], [50, -40]];

function main(){
    gCanvas = document.getElementById("glcanvas");
    gl = gCanvas.getContext('webgl2');
    if (!gl) alert("Vixe! Não achei WebGL 2.0 aqui :-(");

    texturaSolo = gl.createTexture();
    imagem = new Image();
    imagem.src = 'textura.jpg';
    imagem.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texturaSolo);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagem);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    };

    console.log("Canvas: ", gCanvas.width, gCanvas.height);
    
    bRun = document.getElementById("bRun");

    gaPosicoes = [];
    gaNormais = [];
    gaCores = [];
    gaAlfas = [];
    gaTexcoords = [];
    gaUsaTextura = [];
    rodando = false;

    camera = new Camera(pos, at, up, fovy, aspect, near, far);
    solo = new Solo(200, 200, 5, 0, 0, vec4(0.7, 1.0, 0.7, 1.0), 20.0);
    solo.cria();
    let predio1 = new Predio(20, 40, 15, 0, 0, vec4(0.7, 0.7, 0.7, 1.0), 20.0);
    let predio2 = new Predio(20, 20, 50, 40, 70, vec4(0.4, 0.4, 0.4, 1.0), 20.0);
    let predio3 = new Predio(30, 30, 20, 50, -80, vec4(0.6, 0.5, 0.3, 1.0), 20.0);
    predios.push(predio1);
    predios.push(predio2);
    predios.push(predio3);
    for(let i = 0; i < predios.length; i++){
        predios[i].cria();
    }
    roda = new Roda(45, 8, 16, vec4(0.8, 0.8, 0.8, 1.0), -45, 0, 55, 50.0, 0.5);
    roda.cria();
    for(let i = 0; i < posArvores.length; i++){
        let arvore = new Arvore(15, 1.5, 5, vec4(0.8, 0.8, 0.0, 1.0), vec4(0.0, 0.8, 0.0, 1.0), posArvores[i][0], posArvores[i][1], 10.0);
        arvores.push(arvore);
        arvores[i].cria();
    }

    gaPosicoes.push(...solo.vertices);
    gaNormais.push(...solo.normais);
    gaCores.push(...solo.cores);
    gaAlfas.push(...solo.alfas);
    gaTexcoords.push(...solo.texcoords);
    gaUsaTextura.push(...solo.usaTextura);

    for(let i = 0; i < predios.length; i++){
        gaPosicoes.push(...predios[i].vertices);
        gaNormais.push(...predios[i].normais);
        gaCores.push(...predios[i].cores);
        gaAlfas.push(...predios[i].alfas);
        for(let j = 0; j < predios[i].vertices.length; j++){
            gaTexcoords.push([0,0]);
            gaUsaTextura.push([0.0]);
        }
    }

    gaPosicoes.push(...roda.vertices);
    gaNormais.push(...roda.normais);
    gaCores.push(...roda.cores);
    gaAlfas.push(...roda.alfas);
    for(let i = 0; i < roda.vertices.length; i++){
        gaTexcoords.push([0,0]);
        gaUsaTextura.push([0.0]);
    }

    for(let i = 0; i < arvores.length; i++){
        gaPosicoes.push(...arvores[i].vertices);
        gaNormais.push(...arvores[i].normais);
        gaCores.push(...arvores[i].cores);
        gaAlfas.push(...arvores[i].alfas);
        for(let j = 0; j < arvores[i].vertices.length; j++){
            gaTexcoords.push([0,0]);
            gaUsaTextura.push([0.0]);
        }
    }
    
    console.log(gaPosicoes);
    console.log(gaNormais);
    console.log(gaCores);
    console.log(gaAlfas);
    console.log(gaTexcoords);
    console.log(gaUsaTextura);

        // interface
    crieInterface();

    // Inicializações feitas apenas 1 vez
    gl.viewport(0, 0, gCanvas.width, gCanvas.height);
    gl.clearColor(COR_CLEAR[0], COR_CLEAR[1], COR_CLEAR[2], COR_CLEAR[3]);
    gl.enable(gl.DEPTH_TEST);

    bufVertices = gl.createBuffer();
    bufCores = gl.createBuffer();
    bufNormais = gl.createBuffer();
    bufAlfas = gl.createBuffer();
    bufTexcoords = gl.createBuffer();
    bufUsaTextura = gl.createBuffer();

    // shaders
    crieShaders();

    // finalmente...
    render();
    
    window.onkeydown = callbackKeyDown;

}

function crieInterface(){
    bRun.onclick = function () {
        if(!rodando){
            rodando = true;
            bRun.value = "Pausar";
        } else{
            rodando = false;
            bRun.value = "Executar";
        }
    };
}

function callbackKeyDown(event){
    const keyName = event.key;
    console.log("tecla Down = ", keyName)

    if (keyName === 'w' && rodando) {
        let v = normalize(subtract(camera.at, camera.pos));
        camera.pos = add(camera.pos, v);
        camera.at = add(camera.at, v);
        console.log(camera.pos);
        return ;
    } else if(keyName === 's' && rodando){
        let v = normalize(subtract(camera.at, camera.pos));
        camera.pos = subtract(camera.pos, v);
        camera.at = subtract(camera.at, v);
        console.log(camera.pos);
        return ;
    } else if(keyName === 'a' && rodando){
        let viewDir = subtract(camera.at, camera.pos)
        let v = normalize(cross(viewDir, camera.up));
        camera.pos = subtract(camera.pos, v);
        camera.at = subtract(camera.at, v);
        console.log(camera.pos);
        return ;
    } else if(keyName === 'd' && rodando){
        let viewDir = subtract(camera.at, camera.pos)
        let v = normalize(cross(camera.up, viewDir));
        camera.pos = subtract(camera.pos, v);
        camera.at = subtract(camera.at, v);
        console.log(camera.pos);
        return ;
    } else if(keyName === 'x' && rodando){
        let dir = subtract(camera.at, camera.pos);
        let angle = -Math.PI / 64; // negativo = esquerda
        let x = dir[0] * Math.cos(angle) - dir[1] * Math.sin(angle);
        let y = dir[0] * Math.sin(angle) + dir[1] * Math.cos(angle);
        let rotated = vec3(x, y, dir[2]);
        camera.at = add(camera.pos, rotated);
        return;

    } else if(keyName === 'z' && rodando){
        let dir = subtract(camera.at, camera.pos);
        let angle = Math.PI / 64; // positivo = direita
        let x = dir[0] * Math.cos(angle) - dir[1] * Math.sin(angle);
        let y = dir[0] * Math.sin(angle) + dir[1] * Math.cos(angle);
        let rotated = vec3(x, y, dir[2]);
        camera.at = add(camera.pos, rotated);
        return;
    }
}

function crieShaders() {
    //  cria o programa
    gShader.program = makeProgram(gl, gVertexShaderSrc, gFragmentShaderSrc);
    gl.useProgram(gShader.program);

    // buffer das normais
    //var bufNormais = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufNormais);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gaNormais), gl.STATIC_DRAW);

    var aNormal = gl.getAttribLocation(gShader.program, "aNormal");
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aNormal);

    // buffer dos vértices
    //var bufVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertices);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gaPosicoes), gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(gShader.program, "aPosition");
    gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // buffer das cores
    var aColor = gl.getAttribLocation(gShader.program, "aColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, bufCores);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gaCores), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    // buffer dos alfas
    var aAlfa = gl.getAttribLocation(gShader.program, "aAlfa");
    gl.bindBuffer(gl.ARRAY_BUFFER, bufAlfas);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gaAlfas), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aAlfa, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aAlfa);

    //buffer da textura
    var aTexcoord = gl.getAttribLocation(gShader.program, "aTexcoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, bufTexcoords);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gaTexcoords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aTexcoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aTexcoord);

    //buffer usa textura
    var aUsaTextura = gl.getAttribLocation(gShader.program, "aUsaTextura");
    gl.bindBuffer(gl.ARRAY_BUFFER, bufUsaTextura);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gaUsaTextura), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aUsaTextura, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aUsaTextura);

    // resolve os uniforms
    gShader.uModel = gl.getUniformLocation(gShader.program, "uModel");
    gShader.uView = gl.getUniformLocation(gShader.program, "uView");
    gShader.uPerspective = gl.getUniformLocation(gShader.program, "uPerspective");
    gShader.uInverseTranspose = gl.getUniformLocation(gShader.program, "uInverseTranspose");

    // calcula a matriz de transformação perpectiva (fovy, aspect, near, far)
    // que é feita apenas 1 vez
    camera.perspective = perspective(camera.fovy, camera.aspect, camera.near, camera.far);
    gl.uniformMatrix4fv(gShader.uPerspective, false, flatten(camera.perspective));

    camera.view = lookAt(camera.pos, camera.at, camera.up);
    gl.uniformMatrix4fv(gShader.uView, false, flatten(camera.view));

    // parametros para iluminação
    gShader.uLuzPos = gl.getUniformLocation(gShader.program, "uLuzPos");
    gl.uniform4fv(gShader.uLuzPos, LUZ.pos);

    // fragment shader
    gShader.uCorAmb = gl.getUniformLocation(gShader.program, "uCorAmbiente");
    gShader.uCorDif = gl.getUniformLocation(gShader.program, "uCorDifusao");
    gShader.uCorEsp = gl.getUniformLocation(gShader.program, "uCorEspecular");

    gl.uniform4fv(gShader.uCorAmb, mult(LUZ.amb, MAT.amb));
    gl.uniform4fv(gShader.uCorDif, mult(LUZ.dif, MAT.dif));
    gl.uniform4fv(gShader.uCorEsp, LUZ.esp);

};

function render() {
    let now = Date.now();
    let delta = (now - gUltimoT) / 1000;
    gUltimoT = now;

    if(rodando){
    
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gaPosicoes = [];
        gaNormais = [];
        gaCores = [];
        gaAlfas = [];

        roda.atualiza(delta);

        gaPosicoes.push(...solo.vertices);
        gaNormais.push(...solo.normais);
        gaCores.push(...solo.cores);
        gaAlfas.push(...solo.alfas);

        for(let i = 0; i < predios.length; i++){
            gaPosicoes.push(...predios[i].vertices);
            gaNormais.push(...predios[i].normais);
            gaCores.push(...predios[i].cores);
            gaAlfas.push(...predios[i].alfas);
        }

        gaPosicoes.push(...roda.vertices);
        gaNormais.push(...roda.normais);
        gaCores.push(...roda.cores);
        gaAlfas.push(...roda.alfas);

        for(let i = 0; i < arvores.length; i++){
            gaPosicoes.push(...arvores[i].vertices);
            gaNormais.push(...arvores[i].normais);
            gaCores.push(...arvores[i].cores);
            gaAlfas.push(...arvores[i].alfas);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, bufVertices);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(gaPosicoes), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufNormais);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(gaNormais), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufCores);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(gaCores), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufAlfas);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(gaAlfas), gl.DYNAMIC_DRAW);

        // atualize view se a câmera mudar
        camera.view = lookAt(camera.pos, camera.at, camera.up);
        gl.uniformMatrix4fv(gShader.uView, false, flatten(camera.view));

        // identidade como modelo inicial
        let model = mat4();
        gl.uniformMatrix4fv(gShader.uModel, false, flatten(model));
        gl.uniformMatrix4fv(gShader.uInverseTranspose, false, flatten(transpose(inverse(model))));

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texturaSolo);
        gl.uniform1i(gl.getUniformLocation(gShader.program, "uSampler"), 0);

        // desenha
        gl.drawArrays(gl.TRIANGLES, 0, gaPosicoes.length);
    }

    window.requestAnimationFrame(render);
}

var gVertexShaderSrc = `#version 300 es

in vec4 aPosition;
in vec3 aNormal;
in vec4 aColor;
in float aAlfa;
in vec2 aTexcoord;
in float aUsaTextura;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uPerspective;
uniform mat4 uInverseTranspose;

uniform vec4 uLuzPos;

out vec3 vNormal;
out vec3 vLight;
out vec3 vView;
out vec4 vColor;
out float vAlfa;
out vec2 vTexcoord;
out float vUsaTextura;

void main() {
    mat4 modelView = uView * uModel;
    gl_Position = uPerspective * modelView * aPosition;

    // orienta as normais como vistas pela câmera
    vNormal = mat3(uInverseTranspose) * aNormal;
    vec4 pos = modelView * aPosition;

    vLight = (uView * uLuzPos - pos).xyz;
    vView = -(pos.xyz);

    vColor = aColor; // passa para o fragment shader
    vAlfa = aAlfa; // passa para o fragment shader
    vTexcoord = aTexcoord;
    vUsaTextura = aUsaTextura;
}
`;

var gFragmentShaderSrc = `#version 300 es

precision highp float;

in vec3 vNormal;
in vec3 vLight;
in vec3 vView;
in vec4 vColor;
in float vAlfa;
in vec2 vTexcoord;
in float vUsaTextura;

out vec4 corSaida;

uniform vec4 uCorAmbiente;
uniform vec4 uCorDifusao;
uniform vec4 uCorEspecular;

uniform sampler2D uSampler;

void main() {
    vec3 normalV = normalize(vNormal);
    vec3 lightV = normalize(vLight);
    vec3 viewV = normalize(vView);
    vec3 halfV = normalize(lightV + viewV);
    
    // Seleciona cor base (vinda da textura ou da variável vColor)
    vec4 corBase = vColor;
    if (vUsaTextura > 0.5) {
        corBase = texture(uSampler, vTexcoord);
    }

    // ambiente
    float ka = 0.2;
    vec4 ambiente = ka * uCorAmbiente * corBase;

    // difusao
    float kd = 0.2 + 0.8 * max(0.0, dot(normalV, lightV));
    vec4 difusao = kd * uCorDifusao * corBase;

    // especular
    float ks = pow(max(0.0, dot(normalV, halfV)), vAlfa);
    vec4 especular = vec4(0.2, 0.2, 0.2, 1.0);
    if (kd > 0.0) {
        especular = ks * uCorEspecular;
    }

    corSaida = difusao + especular + ambiente;
    corSaida.a = 1.0;
}

`;
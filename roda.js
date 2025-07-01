import { Cabine } from './cabine.js'
import { RodaExterior } from './roda_exterior.js';
import { Raios } from './raios.js';

export class Roda{
    constructor(raio, num_raios, num_cabines, cor, posX, posY, altura_eixo, alfa, velocidadeAngular){
        this.raio = raio;
        this.num_raios = num_raios;
        this.num_cabines = num_cabines;
        this.cor = cor;
        this.posX = posX;
        this.posY = posY;
        this.altura_eixo = altura_eixo;
        this.alfa = alfa;
        this.velocidadeAngular = velocidadeAngular;

        this.vertices = [];
        this.normais = [];
        this.cores = [];
        this.alfas = [];

        this.cabines = [];
        this.raios = [];
    }

    cria(){
        this.criaEixoCentral();
        this.criaRaios();
        this.criaRodaExterior();
        this.criaSuporte();
        this.criaCabines();
    }

    criaEixoCentral(){
        let vertices_frente = [];
        let vertices_tras = [];

        for(let i = 0; i < 16; i++){ //Cria os vértices da face da frente do cilindro no sentido anti-horário
            let x = 12;
            let y = 5 * Math.cos(2*Math.PI*i/16);
            let z = this.altura_eixo + 5 * Math.sin(2*Math.PI*i/16);
            vertices_frente.push(vec3(x, y, z));
        }

        for(let i = 0; i < 16; i++){ //O mesmo mas para a face de trás
            let x = -12;
            let y = 5 * Math.cos(2*Math.PI*i/16);
            let z = this.altura_eixo + 5 * Math.sin(2*Math.PI*i/16);
            vertices_tras.push(vec3(x, y, z));
        }

        let transformar = (v) => {
            return [
                v[0] + this.posX,
                v[1] + this.posY,
                v[2],
                1.0
            ];
        };

        for(let i = 0; i < 16; i++){
            let a = vertices_frente[i%16];
            let b = vertices_frente[(i+1)%16];
            let c = vec3(12, 0, this.altura_eixo);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let i = 0; i < 16; i++){
            let a = vertices_tras[(i+1)%16];
            let b = vertices_tras[i%16];
            let c = vec3(-12, 0, this.altura_eixo);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let i = 0; i < 16; i++){
            let a_frente = vertices_frente[i%16];
            let a_tras = vertices_tras[i%16];
            let b_frente = vertices_frente[(i+1)%16];
            let b_tras = vertices_tras[(i+1)%16];
            let t1 = subtract(b_frente, a_tras);
            let t2 = subtract(a_frente, a_tras);
            let normal = normalize(cross(t1, t2));

            this.vertices.push(transformar(a_tras));
            this.vertices.push(transformar(a_frente));
            this.vertices.push(transformar(b_frente));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

            this.vertices.push(transformar(a_tras));
            this.vertices.push(transformar(b_frente));
            this.vertices.push(transformar(b_tras));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

        }
    }

    criaRaios(){
        let raios1 = new Raios(this.raio, this.posX + 7, this.posY, this.cor, this.altura_eixo, this.num_raios, this.alfa, this.velocidadeAngular);
        let raios2 = new Raios(this.raio, this.posX - 7, this.posY, this.cor, this.altura_eixo, this.num_raios, this.alfa, this.velocidadeAngular);
        this.raios.push(raios1);
        this.raios.push(raios2);
        this.raios[0].cria();
        this.raios[1].cria();

        this.vertices.push(...this.raios[0].vertices);
        this.cores.push(...this.raios[0].cores);
        this.normais.push(...this.raios[0].normais);
        this.alfas.push(...this.raios[0].alfas);
        this.vertices.push(...this.raios[1].vertices);
        this.cores.push(...this.raios[1].cores);
        this.normais.push(...this.raios[1].normais);
        this.alfas.push(...this.raios[1].alfas);
    }

    criaRodaExterior(){
        let roda_ext1 = new RodaExterior(this.raio, this.posX + 7, this.posY, this.cor, this.altura_eixo, 2, this.alfa);
        let roda_ext2 = new RodaExterior(this.raio, this.posX - 7, this.posY, this.cor, this.altura_eixo, 2, this.alfa);
        roda_ext1.cria();
        roda_ext2.cria();

        this.vertices.push(...roda_ext1.vertices);
        this.cores.push(...roda_ext1.cores);
        this.normais.push(...roda_ext1.normais);
        this.alfas.push(...roda_ext1.alfas);
        this.vertices.push(...roda_ext2.vertices);
        this.cores.push(...roda_ext2.cores);
        this.normais.push(...roda_ext2.normais);
        this.alfas.push(...roda_ext2.alfas);
    }

    criaSuporte(){
        let vertices_frente_cima_esq = [];
        let vertices_frente_baixo_esq = [];
        let vertices_tras_cima_esq = [];
        let vertices_tras_baixo_esq = [];
        let vertices_frente_cima_dir = [];
        let vertices_frente_baixo_dir = [];
        let vertices_tras_cima_dir = [];
        let vertices_tras_baixo_dir = [];

        let transformar = (v) => {
            return [
                v[0] + this.posX,
                v[1] + this.posY,
                v[2],
                1.0
            ];
        };

        for(let j = 0; j < 16; j++){ 
            let x = 12 + Math.cos(2*Math.PI*j/16);
            let y = Math.sin(2*Math.PI*j/16);
            let z = this.altura_eixo;
            vertices_frente_cima_esq.push(vec3(x, y, z));
        }

        for(let j = 0; j < 16; j++){ 
            let x = 12 + 2 * Math.cos(2*Math.PI*j/16);
            let y = -40 + 2 * Math.sin(2*Math.PI*j/16);
            let z = 0;
            vertices_frente_baixo_esq.push(vec3(x, y, z));
        }

        for(let j = 0; j < 16; j++){ 
            let x = -12 + Math.cos(2*Math.PI*j/16);
            let y = Math.sin(2*Math.PI*j/16);
            let z = this.altura_eixo;
            vertices_tras_cima_esq.push(vec3(x, y, z));
        }

        for(let j = 0; j < 16; j++){ 
            let x = -12 + 2 * Math.cos(2*Math.PI*j/16);
            let y = -40 + 2 * Math.sin(2*Math.PI*j/16);
            let z = 0;
            vertices_tras_baixo_esq.push(vec3(x, y, z));
        }

        for(let j = 0; j < 16; j++){ 
            let x = 12 + Math.cos(2*Math.PI*j/16);
            let y = Math.sin(2*Math.PI*j/16);
            let z = this.altura_eixo;
            vertices_frente_cima_dir.push(vec3(x, y, z));
        }

        for(let j = 0; j < 16; j++){ 
            let x = 12 + 2 * Math.cos(2*Math.PI*j/16);
            let y = 40 + 2 * Math.sin(2*Math.PI*j/16);
            let z = 0;
            vertices_frente_baixo_dir.push(vec3(x, y, z));
        }

        for(let j = 0; j < 16; j++){ 
            let x = -12 + Math.cos(2*Math.PI*j/16);
            let y = Math.sin(2*Math.PI*j/16);
            let z = this.altura_eixo;
            vertices_tras_cima_dir.push(vec3(x, y, z));
        }

        for(let j = 0; j < 16; j++){ 
            let x = -12 + 2 * Math.cos(2*Math.PI*j/16);
            let y = 40 + 2 * Math.sin(2*Math.PI*j/16);
            let z = 0;
            vertices_tras_baixo_dir.push(vec3(x, y, z));
        }

        for(let j = 0; j < 16; j++){
            let a = vertices_frente_cima_esq[j%16];
            let b = vertices_frente_cima_esq[(j+1)%16];
            let c = vec3(12, 0, this.altura_eixo);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let j = 0; j < 16; j++){
            let a = vertices_frente_baixo_esq[(j+1)%16];
            let b = vertices_frente_baixo_esq[j%16];
            let c = vec3(12, -40, 0);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let j = 0; j < 16; j++){
            let a = vertices_tras_cima_esq[j%16];
            let b = vertices_tras_cima_esq[(j+1)%16];
            let c = vec3(-12, 0, this.altura_eixo);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let j = 0; j < 16; j++){
            let a = vertices_tras_baixo_esq[(j+1)%16];
            let b = vertices_tras_baixo_esq[j%16];
            let c = vec3(-12, -40, 0);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let j = 0; j < 16; j++){
            let a = vertices_frente_cima_dir[j%16];
            let b = vertices_frente_cima_dir[(j+1)%16];
            let c = vec3(12, 0, this.altura_eixo);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let j = 0; j < 16; j++){
            let a = vertices_frente_baixo_dir[(j+1)%16];
            let b = vertices_frente_baixo_dir[j%16];
            let c = vec3(12, 40, 0);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let j = 0; j < 16; j++){
            let a = vertices_tras_cima_dir[j%16];
            let b = vertices_tras_cima_dir[(j+1)%16];
            let c = vec3(-12, 0, this.altura_eixo);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let j = 0; j < 16; j++){
            let a = vertices_tras_baixo_dir[(j+1)%16];
            let b = vertices_tras_baixo_dir[j%16];
            let c = vec3(-12, 40, 0);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let i = 0; i < 16; i++){
            let a_cima = vertices_frente_cima_esq[i%16];
            let a_baixo = vertices_frente_baixo_esq[i%16];
            let b_cima = vertices_frente_cima_esq[(i+1)%16];
            let b_baixo = vertices_frente_baixo_esq[(i+1)%16];
            let t1 = subtract(b_cima, a_baixo);
            let t2 = subtract(a_cima, a_baixo);
            let normal = normalize(cross(t1, t2));

            this.vertices.push(transformar(a_baixo));
            this.vertices.push(transformar(a_cima));
            this.vertices.push(transformar(b_cima));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

            this.vertices.push(transformar(a_baixo));
            this.vertices.push(transformar(b_cima));
            this.vertices.push(transformar(b_baixo));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

        }

        for(let i = 0; i < 16; i++){
            let a_cima = vertices_tras_cima_esq[i%16];
            let a_baixo = vertices_tras_baixo_esq[i%16];
            let b_cima = vertices_tras_cima_esq[(i+1)%16];
            let b_baixo = vertices_tras_baixo_esq[(i+1)%16];
            let t1 = subtract(b_cima, a_baixo);
            let t2 = subtract(a_cima, a_baixo);
            let normal = normalize(cross(t1, t2));

            this.vertices.push(transformar(a_baixo));
            this.vertices.push(transformar(a_cima));
            this.vertices.push(transformar(b_cima));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

            this.vertices.push(transformar(a_baixo));
            this.vertices.push(transformar(b_cima));
            this.vertices.push(transformar(b_baixo));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

        }

        for(let i = 0; i < 16; i++){
            let a_cima = vertices_frente_cima_dir[i%16];
            let a_baixo = vertices_frente_baixo_dir[i%16];
            let b_cima = vertices_frente_cima_dir[(i+1)%16];
            let b_baixo = vertices_frente_baixo_dir[(i+1)%16];
            let t1 = subtract(b_cima, a_baixo);
            let t2 = subtract(a_cima, a_baixo);
            let normal = normalize(cross(t1, t2));

            this.vertices.push(transformar(a_baixo));
            this.vertices.push(transformar(a_cima));
            this.vertices.push(transformar(b_cima));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

            this.vertices.push(transformar(a_baixo));
            this.vertices.push(transformar(b_cima));
            this.vertices.push(transformar(b_baixo));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

        }

        for(let i = 0; i < 16; i++){
            let a_cima = vertices_tras_cima_dir[i%16];
            let a_baixo = vertices_tras_baixo_dir[i%16];
            let b_cima = vertices_tras_cima_dir[(i+1)%16];
            let b_baixo = vertices_tras_baixo_dir[(i+1)%16];
            let t1 = subtract(b_cima, a_baixo);
            let t2 = subtract(a_cima, a_baixo);
            let normal = normalize(cross(t1, t2));

            this.vertices.push(transformar(a_baixo));
            this.vertices.push(transformar(a_cima));
            this.vertices.push(transformar(b_cima));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

            this.vertices.push(transformar(a_baixo));
            this.vertices.push(transformar(b_cima));
            this.vertices.push(transformar(b_baixo));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

    }

    criaCabines(){
        for(let i = 0; i < this.num_raios * 2; i++){
            let c = new Cabine(8, 10, 7, this.cor, this.posX, this.raio * Math.cos(2*Math.PI*i/(this.num_raios*2)), 
            this.altura_eixo + this.raio * Math.sin(2*Math.PI*i/(this.num_raios*2)), this.alfa, this.velocidadeAngular, this.posY, this.altura_eixo, 
        this.raio, 2*i*Math.PI/this.num_cabines);
            this.cabines.push(c);
        }

        for(let i = 0; i < this.cabines.length; i++){
            this.cabines[i].cria();
            this.vertices.push(...this.cabines[i].vertices);
            this.cores.push(...this.cabines[i].cores);
            this.normais.push(...this.cabines[i].normais);
            this.alfas.push(...this.cabines[i].alfas);
        }
    }

    atualiza(delta){
        this.vertices = [];
        this.normais = [];
        this.cores = [];
        this.alfas = [];

        for(let i = 0; i < this.cabines.length; i++){
            this.cabines[i].atualiza(delta);
        }
        this.raios[0].atualiza(delta);
        this.raios[1].atualiza(delta);

        this.criaEixoCentral();
        this.criaRodaExterior();
        this.criaSuporte();
        for(let i = 0; i < this.cabines.length; i++){
            this.vertices.push(...this.cabines[i].vertices);
            this.cores.push(...this.cabines[i].cores);
            this.normais.push(...this.cabines[i].normais);
            this.alfas.push(...this.cabines[i].alfas);
        }
        this.vertices.push(...this.raios[0].vertices);
        this.cores.push(...this.raios[0].cores);
        this.normais.push(...this.raios[0].normais);
        this.alfas.push(...this.raios[0].alfas);
        this.vertices.push(...this.raios[1].vertices);
        this.cores.push(...this.raios[1].cores);
        this.normais.push(...this.raios[1].normais);
        this.alfas.push(...this.raios[1].alfas);
    }
}
import { Esfera } from './esfera.js'

export class Arvore{
    constructor(altura_tronco, raio_tronco, raio_copa, cor_tronco, cor_copa, posX, posY, alfa){
        this.altura_tronco = altura_tronco;
        this.raio_tronco = raio_tronco;
        this.raio_copa = raio_copa;
        this.cor_tronco = cor_tronco;
        this.cor_copa = cor_copa;
        this.posX = posX;
        this.posY = posY;
        this.alfa = alfa;

        this.vertices = [];
        this.normais = [];
        this.cores = [];
        this.alfas = [];

        this.esferas = [];
    }

    cria(){
        this.criaCopa();
        this.criaTronco();
    }

    criaCopa(){
        let esfera1 = new Esfera(5, this.posX-3, this.posY-3, this.altura_tronco, this.cor_copa, this.alfa);
        let esfera2 = new Esfera(5, this.posX+3, this.posY-3, this.altura_tronco, this.cor_copa, this.alfa);
        let esfera3 = new Esfera(5, this.posX-3, this.posY+3, this.altura_tronco, this.cor_copa, this.alfa);
        let esfera4 = new Esfera(5, this.posX+3, this.posY+3, this.altura_tronco, this.cor_copa, this.alfa);
        let esfera5 = new Esfera(5, this.posX, this.posY, this.altura_tronco+7, this.cor_copa, this.alfa);
        let esfera6 = new Esfera(5, this.posX, this.posY-4, this.altura_tronco+4, this.cor_copa, this.alfa);
        let esfera7 = new Esfera(5, this.posX, this.posY+4, this.altura_tronco+4, this.cor_copa, this.alfa);
        let esfera8 = new Esfera(5, this.posX-4, this.posY, this.altura_tronco+4, this.cor_copa, this.alfa);
        let esfera9 = new Esfera(5, this.posX+4, this.posY, this.altura_tronco+4, this.cor_copa, this.alfa);
        this.esferas.push(esfera1);
        this.esferas.push(esfera2);
        this.esferas.push(esfera3);
        this.esferas.push(esfera4);
        this.esferas.push(esfera5);
        this.esferas.push(esfera6);
        this.esferas.push(esfera7);
        this.esferas.push(esfera8);
        this.esferas.push(esfera9);

        for(let i = 0; i < this.esferas.length; i++){
            this.esferas[i].cria();
            this.vertices.push(...this.esferas[i].vertices);
            this.normais.push(...this.esferas[i].normais);
            this.cores.push(...this.esferas[i].cores);
            this.alfas.push(...this.esferas[i].alfas);
        }
    }

    criaTronco(){
        let vertices_cima = [];
        let vertices_baixo = [];

        for(let i = 0; i < 16; i++){ //Cria os vértices da face superior do cilindro no sentido anti-horário
            let x = this.raio_tronco * Math.cos(2*Math.PI*i/16);
            let y = this.raio_tronco * Math.sin(2*Math.PI*i/16);
            let z = this.altura_tronco;
            vertices_cima.push(vec3(x, y, z));
        }

        for(let i = 0; i < 16; i++){ //O mesmo mas na face inferior
            let x = this.raio_tronco * Math.cos(2*Math.PI*i/16);
            let y = this.raio_tronco * Math.sin(2*Math.PI*i/16);
            let z = 0;
            vertices_baixo.push(vec3(x, y, z));
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
            let a = vertices_cima[i%16];
            let b = vertices_cima[(i+1)%16];
            let c = vec3(0, 0, this.altura_tronco);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor_tronco);
            this.cores.push(this.cor_tronco);
            this.cores.push(this.cor_tronco);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let i = 0; i < 16; i++){
            let a = vertices_baixo[(i+1)%16];
            let b = vertices_baixo[i%16];
            let c = vec3(0, 0, this.altura_tronco);
            let t1 = subtract(b,a);
            let t2 = subtract(c,a);
            let normal = normalize(cross(t1, t2));
            this.vertices.push(transformar(a));
            this.vertices.push(transformar(b));
            this.vertices.push(transformar(c));
            this.cores.push(this.cor_tronco);
            this.cores.push(this.cor_tronco);
            this.cores.push(this.cor_tronco);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        }

        for(let i = 0; i < 16; i++){
            let a_cima = vertices_cima[i%16];
            let a_baixo = vertices_baixo[i%16];
            let b_cima = vertices_cima[(i+1)%16];
            let b_baixo = vertices_baixo[(i+1)%16];
            let t1 = subtract(b_cima,a_baixo);
            let t2 = subtract(a_cima,a_baixo);
            let normal = normalize(cross(t1, t2));

            this.vertices.push(transformar(a_baixo));
            this.vertices.push(transformar(a_cima));
            this.vertices.push(transformar(b_cima));
            this.cores.push(this.cor_tronco);
            this.cores.push(this.cor_tronco);
            this.cores.push(this.cor_tronco);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

            this.vertices.push(transformar(a_baixo));
            this.vertices.push(transformar(b_cima));
            this.vertices.push(transformar(b_baixo));
            this.cores.push(this.cor_tronco);
            this.cores.push(this.cor_tronco);
            this.cores.push(this.cor_tronco);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

        }

    }
}
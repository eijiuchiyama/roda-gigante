export class RodaExterior{
    constructor(raio, posX, posY, cor, altura_eixo, espessura, alfa){
        this.raio = raio;
        this.posX = posX;
        this.posY = posY;
        this.cor = cor;
        this.altura_eixo = altura_eixo;
        this.espessura = espessura;
        this.alfa = alfa;

        this.vertices = [];
        this.cores = [];
        this.normais = [];
        this.alfas = [];
    }

    cria(){
        let vertices_frente_interior = [];
        let vertices_frente_exterior = [];
        let vertices_tras_interior = [];
        let vertices_tras_exterior = [];

        for(let i = 0; i < 16; i++){ //Cria os vértices da frente da roda externa
            let x = this.espessura;
            let y = (this.raio - 10) * Math.cos(2*Math.PI*i/16);
            let z = this.altura_eixo + (this.raio - 5) * Math.sin(2*Math.PI*i/16);
            vertices_frente_exterior.push(vec3(x, y, z));
        }

        for(let i = 0; i < 16; i++){ //O mesmo mas para a face de trás
            let x = -this.espessura;
            let y = (this.raio - 10) * Math.cos(2*Math.PI*i/16);
            let z = this.altura_eixo + (this.raio - 5) * Math.sin(2*Math.PI*i/16);
            vertices_tras_exterior.push(vec3(x, y, z));
        }

        for(let i = 0; i < 16; i++){ //Cria os vértices da frente da roda interna
            let x = this.espessura;
            let y = (this.raio - 15) * Math.cos(2*Math.PI*i/16);
            let z = this.altura_eixo + (this.raio - 10) * Math.sin(2*Math.PI*i/16);
            vertices_frente_interior.push(vec3(x, y, z));
        }

        for(let i = 0; i < 16; i++){ //O mesmo mas para a face de trás
            let x = -this.espessura;
            let y = (this.raio - 15) * Math.cos(2*Math.PI*i/16);
            let z = this.altura_eixo + (this.raio - 10) * Math.sin(2*Math.PI*i/16);
            vertices_tras_interior.push(vec3(x, y, z));
        }

        let transformar = (v) => {
            return [
                v[0] + this.posX,
                v[1] + this.posY,
                v[2],
                1.0
            ];
        };

        for(let i = 0; i < 16; i++){ //Para a face da frente
            let a_ext= vertices_frente_exterior[i%16];
            let a_int = vertices_frente_interior[i%16];
            let b_ext = vertices_frente_exterior[(i+1)%16];
            let b_int = vertices_frente_interior[(i+1)%16];
            let t1 = subtract(b_ext, a_int);
            let t2 = subtract(a_ext, a_int);
            let normal = normalize(cross(t2, t1));

            this.vertices.push(transformar(a_int));
            this.vertices.push(transformar(a_ext));
            this.vertices.push(transformar(b_ext));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

            this.vertices.push(transformar(a_int));
            this.vertices.push(transformar(b_ext));
            this.vertices.push(transformar(b_int));
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

        for(let i = 0; i < 16; i++){ //Para a face de trás
            let a_ext= vertices_tras_exterior[i%16];
            let a_int = vertices_tras_interior[i%16];
            let b_ext = vertices_tras_exterior[(i+1)%16];
            let b_int = vertices_tras_interior[(i+1)%16];
            let t1 = subtract(b_ext, a_int);
            let t2 = subtract(a_ext, a_int);
            let normal = normalize(cross(t2, t1));

            this.vertices.push(transformar(a_int));
            this.vertices.push(transformar(a_ext));
            this.vertices.push(transformar(b_ext));
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.cores.push(this.cor);
            this.normais.push(normal);
            this.normais.push(normal);
            this.normais.push(normal);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);

            this.vertices.push(transformar(a_int));
            this.vertices.push(transformar(b_ext));
            this.vertices.push(transformar(b_int));
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

        for(let i = 0; i < 16; i++){ //Para a face exterior
            let a_frente = vertices_frente_exterior[i%16];
            let a_tras = vertices_tras_exterior[i%16];
            let b_frente = vertices_frente_exterior[(i+1)%16];
            let b_tras = vertices_tras_exterior[(i+1)%16];
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

        for(let i = 0; i < 16; i++){ //Para a face interior
            let a_frente = vertices_frente_interior[i%16];
            let a_tras = vertices_tras_interior[i%16];
            let b_frente = vertices_frente_interior[(i+1)%16];
            let b_tras = vertices_tras_interior[(i+1)%16];
            let t1 = subtract(b_frente, a_tras);
            let t2 = subtract(a_frente, a_tras);
            let normal = normalize(cross(t2, t1));

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
}
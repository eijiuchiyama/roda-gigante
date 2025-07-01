export class Cabine{
    constructor(tamX, tamY, tamZ, cor, posX, posY, posZ, alfa, velocidadeAngular, centroY, centroZ, raio, angulo){
        this.tamX = tamX;
        this.tamY = tamY;
        this.tamZ = tamZ;
        this.cor = cor;
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.alfa = alfa;
        this.velocidadeAngular = velocidadeAngular;
        this.centroY = centroY;
        this.centroZ = centroZ;
        this.raio = raio;
        this.angulo = angulo;

        this.vertices = [];
        this.normais = [];
        this.cores = [];
        this.alfas = [];
    }

    cria(){
        this.criaCabine();
        this.criaSuporte();
    }

    criaCabine(){
        let vCubo = [
            vec4(-1.0, -1.0, 1.0, 1.0),
            vec4(-1.0, 1.0, 1.0, 1.0),
            vec4(1.0, 1.0, 1.0, 1.0),
            vec4(1.0, -1.0, 1.0, 1.0),
            vec4(-1.0, -1.0, -1.0, 1.0),
            vec4(-1.0, 1.0, -1.0, 1.0),
            vec4(1.0, 1.0, -1.0, 1.0),
            vec4(1.0, -1.0, -1.0, 1.0)
        ];

        let transformar = (v) => {
            return [
                v[0] * this.tamX/2 + this.posX,
                v[1] * this.tamY/2 + this.posY,
                v[2] * this.tamZ/2 + this.posZ - this.tamZ/2,
                1.0
            ];
        };

        let face = (a, b, c, d) =>{
            var t1 = subtract(vCubo[b], vCubo[a]);
            var t2 = subtract(vCubo[c], vCubo[b]);
            var normal = normalize(cross(t1, t2));
            normal = vec3(normal);

            this.vertices.push(transformar(vCubo[a]));
            this.normais.push(normal);
            this.cores.push(this.cor);
            this.vertices.push(transformar(vCubo[b]));
            this.normais.push(normal);
            this.cores.push(this.cor);
            this.vertices.push(transformar(vCubo[c]));
            this.normais.push(normal);
            this.cores.push(this.cor);
            this.vertices.push(transformar(vCubo[a]));
            this.normais.push(normal);
            this.cores.push(this.cor);
            this.vertices.push(transformar(vCubo[c]));
            this.normais.push(normal);
            this.cores.push(this.cor);
            this.vertices.push(transformar(vCubo[d]));
            this.normais.push(normal);
            this.cores.push(this.cor);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
            this.alfas.push([this.alfa]);
        };

        face(1, 0, 3, 2);
        face(2, 3, 7, 6);
        face(3, 0, 4, 7);
        face(6, 5, 1, 2);
        face(4, 5, 6, 7);
        face(5, 4, 0, 1);
    }

    criaSuporte(){
        let vertices_frente = [];
        let vertices_tras = [];

        for(let i = 0; i < 16; i++){ //Cria os vértices da face da frente do cilindro no sentido anti-horário
            let x = 7;
            let y = Math.cos(2*Math.PI*i/16);
            let z = this.posZ + Math.sin(2*Math.PI*i/16);
            vertices_frente.push(vec3(x, y, z));
        }

        for(let i = 0; i < 16; i++){ //O mesmo mas para a face de trás
            let x = -7;
            let y = Math.cos(2*Math.PI*i/16);
            let z = this.posZ + Math.sin(2*Math.PI*i/16);
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
            let c = vec3(7, 0, this.posZ);
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
            let c = vec3(-7, 0, this.posZ);
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

    atualiza(delta){
        this.angulo += this.velocidadeAngular * delta;

        this.posY = this.centroY + this.raio * Math.cos(this.angulo);
        this.posZ = this.centroZ + this.raio * Math.sin(this.angulo);

        this.vertices = [];
        this.normais = [];
        this.cores = [];
        this.alfas = [];
        this.cria();
    }
}
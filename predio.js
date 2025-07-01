export class Predio{
    constructor(tamX, tamY, tamZ, posX, posY, cor, alfa){
        this.tamX = tamX;
        this.tamY = tamY;
        this.tamZ = tamZ;
        this.posX = posX;
        this.posY = posY;
        this.cor = cor;
        this.alfa = alfa;

        this.vertices = [];
        this.normais = [];
        this.cores = [];
        this.alfas = [];
    }

    cria(){
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
                v[2] * this.tamZ/2 + this.tamZ/2,
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
}
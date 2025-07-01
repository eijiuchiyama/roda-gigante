export class Solo{
    constructor(tamX, tamY, tamZ, posX, posY, cor, alfa){
        this.tamX = tamX;
        this.tamY = tamY;
        this.tamZ = tamZ;
        this.posX = posX;
        this.posY = posY;
        this.cor = cor;
        this.alfa = alfa;

        this.vertices = [];
        this.cores = [];
        this.normais = [];
        this.alfas = [];
        this.texcoords = [];
        this.usaTextura = [];
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
                v[2] * this.tamZ/2,
                1.0
            ];
        };

        let face = (a, b, c, d, usaTextura) =>{
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
            if(usaTextura){
                this.texcoords.push([0.0, 0.0]);
                this.texcoords.push([10.0, 0.0]);
                this.texcoords.push([10.0, 1.0]);
                this.texcoords.push([0.0, 0.0]);
                this.texcoords.push([10.0, 10.0]);
                this.texcoords.push([0.0, 1.0]);
                this.usaTextura.push([1.0]);
                this.usaTextura.push([1.0]);
                this.usaTextura.push([1.0]);
                this.usaTextura.push([1.0]);
                this.usaTextura.push([1.0]);
                this.usaTextura.push([1.0]);
            } else{
                this.texcoords.push([0,0]);
                this.texcoords.push([0,0]);
                this.texcoords.push([0,0]);
                this.texcoords.push([0,0]);
                this.texcoords.push([0,0]);
                this.texcoords.push([0,0]);
                this.usaTextura.push([0.0]);
                this.usaTextura.push([0.0]);
                this.usaTextura.push([0.0]);
                this.usaTextura.push([0.0]);
                this.usaTextura.push([0.0]);
                this.usaTextura.push([0.0]);
            }

        };

        face(1, 0, 3, 2, true);
        face(2, 3, 7, 6, false);
        face(3, 0, 4, 7, false);
        face(6, 5, 1, 2, false);
        face(4, 5, 6, 7, false);
        face(5, 4, 0, 1, false);
    }
}
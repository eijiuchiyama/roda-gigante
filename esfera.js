export class Esfera{
    constructor(raio, posX, posY, posZ, cor, alfa){
        this.raio = raio;
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.cor = cor;
        this.alfa = alfa;

        this.vertices = [];
        this.normais = [];
        this.cores = [];
        this.alfas = [];
    }

    cria(){
         let vp = [
            vec3(1.0, 0.0, 0.0),
            vec3(0.0, 1.0, 0.0),
            vec3(0.0, 0.0, 1.0),
        ];

        let vn = [
            vec3(-1.0, 0.0, 0.0),
            vec3(0.0, -1.0, 0.0),
            vec3(0.0, 0.0, -1.0),
        ];

        let triangulo = [
            [vp[0], vp[1], vp[2]],
            [vp[0], vn[2], vp[1]],

            [vp[0], vp[2], vn[1]],
            [vp[0], vn[1], vn[2]],

            [vn[0], vp[2], vp[1]],
            [vn[0], vp[1], vn[2]],

            [vn[0], vn[1], vp[2]],
            [vn[0], vn[2], vn[1]],
        ];

        for (let i = 0; i < triangulo.length; i++) {
            let a, b, c;
            [a, b, c] = triangulo[i];
            this.dividaTriangulo(a, b, c, 4);
        }
    }

    dividaTriangulo(a, b, c, ndivs){
        if (ndivs > 0) {
            let ab = mix(a, b, 0.5);
            let bc = mix(b, c, 0.5);
            let ca = mix(c, a, 0.5);

            ab = normalize(ab);
            bc = normalize(bc);
            ca = normalize(ca);

            this.dividaTriangulo(a, ab, ca, ndivs - 1);
            this.dividaTriangulo(b, bc, ab, ndivs - 1);
            this.dividaTriangulo(c, ca, bc, ndivs - 1);
            this.dividaTriangulo(ab, bc, ca, ndivs - 1);
        }

        else {
            this.insiraTriangulo(a, b, c);
        }
    }

    insiraTriangulo(a, b, c) {
        let t1 = subtract(b,a);
        let t2 = subtract(c,a);
        let normal = normalize(cross(t1, t2));

        let transformar = (v) => {
            return [
                v[0] * this.raio + this.posX,
                v[1] * this.raio + this.posY,
                v[2] * this.raio + this.posZ,
                1.0
            ];
        };

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
}
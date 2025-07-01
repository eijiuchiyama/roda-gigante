export class Raios{
    constructor(raio, posX, posY, cor, altura_eixo, num_raios, alfa, velocidadeAngular){
        this.raio = raio;
        this.posX = posX;
        this.posY = posY;
        this.cor = cor;
        this.altura_eixo = altura_eixo;
        this.num_raios = num_raios;
        this.alfa = alfa;
        this.velocidadeAngular = velocidadeAngular;

        this.angulo = 0;
        
        this.vertices = [];
        this.cores = [];
        this.normais = [];
        this.alfas = [];
    }

    cria(){
        for(let i = 0; i < this.num_raios; i++){
            let vertices_cima = [];
            let vertices_baixo = [];

            for(let j = 0; j < 16; j++){ //Cria os vértices da face de cima do cilindro no sentido anti-horário
                let x = Math.cos(2*Math.PI*j/16);
                let y = Math.sin(2*Math.PI*j/16);
                let z = this.altura_eixo + this.raio;
                vertices_cima.push(vec3(x, y, z));
            }

            for(let j = 0; j < 16; j++){ //O mesmo mas para a face de baixo
                let x = Math.cos(2*Math.PI*j/16);
                let y = Math.sin(2*Math.PI*j/16);
                let z = this.altura_eixo - this.raio;
                vertices_baixo.push(vec3(x, y, z));
            }

            let transformar = (v) => {
                let x = v[0], y = v[1], z = v[2];

                z -= this.altura_eixo;

                // ângulo da rotação no plano YZ, em torno do eixo X
                let ang = this.angulo + Math.PI * i / this.num_raios;
                let y_rot = y * Math.cos(ang) - z * Math.sin(ang);
                let z_rot = y * Math.sin(ang) + z * Math.cos(ang);

                return [
                    x + this.posX, // X permanece igual
                    y_rot + this.posY,
                    z_rot + this.altura_eixo,
                    1.0
                ];
            };

            for(let j = 0; j < 16; j++){
                let a = vertices_cima[j%16];
                let b = vertices_cima[(j+1)%16];
                let c = vec3(0, 0, this.altura_eixo + this.raio);
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
                let a = vertices_baixo[(j+1)%16];
                let b = vertices_baixo[j%16];
                let c = vec3(0, 0, this.altura_eixo - this.raio);
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
                let a_cima = vertices_cima[j%16];
                let a_baixo = vertices_baixo[j%16];
                let b_cima = vertices_cima[(j+1)%16];
                let b_baixo = vertices_baixo[(j+1)%16];
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
    }

    atualiza(delta){
        this.angulo += this.velocidadeAngular * delta;

        this.vertices = [];
        this.cores = [];
        this.normais = [];
        this.alfas = [];
        this.cria();
    }
}
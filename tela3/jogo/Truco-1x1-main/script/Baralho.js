class Baralho {
    constructor(simbolos, nipes) {
        this.simbolos = simbolos;
        this.nipes = nipes;
        this.cartas = [];
        this.montaBaralho();
    }

    montaBaralho() {
        this.cartas = [];
        for (let i = 0; i < this.simbolos.length; i++) {
            for (let j = 0; j < this.nipes.length; j++) {
                let carta = new Carta(this.simbolos[i], this.nipes[j], i + 1);
                this.cartas.push(carta);
            }
        }
    }

    embaralha() {
        for (let i = 0; i < this.cartas.length * 3; i++) {
            let indice = Math.floor(Math.random() * this.cartas.length);
            let carta = this.cartas.splice(indice, 1);
            this.cartas.push(carta[0]);
        }
    }

    distribuiCartas(quantidade) {
        let cartas = [];
        for (let i = 0; i < quantidade; i++) {
            let indice = Math.floor(Math.random() * this.cartas.length);
            let carta = this.cartas.splice(indice, 1);
            cartas.push(carta[0]);
        }
        return cartas;
    }
}

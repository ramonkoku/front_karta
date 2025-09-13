const div_mao1 = document.getElementById("mao-jogador-1");
const div_mao2 = document.getElementById("mao-jogador-2");
const div_pontuacao = document.getElementById("pontuacao");

var cartas_em_campo = [];
var carta_maquina = null;
var quantidade_round = 0;
var quantidade_vitoria = 0;
var quantidade_derrota = 0;
var pontuacao = 0;

var baralho = new Baralho(["4","5","6","7","Q","J","K","A","2","3"],["espadas","paus","copas","ouros"]);
var maquina = new Jogador();

function nova_mao_maquina(){
    let cartas_jogador = baralho.distribuiCartas(3);
    let cartas = "";

    for(let i = 0; i < 3; i++){
        cartas += `<div id='${"carta-maquina"+i}' class='fundo-carta'>?</div>`;
    }

    maquina.novaMao(cartas_jogador);
    div_mao1.innerHTML = cartas;
}

function nova_mao_jogador(){
    let cartas_jogador = baralho.distribuiCartas(3);
    let cartas = "";
    
    for(let carta of cartas_jogador){
        let cor = (carta.nipe == "ouros" || carta.nipe == "copas") ? "red":"black";
        cartas += montaCarta(carta.simbolo,carta.nipe,cor);
        cartas_em_campo.push(carta);
    }

    div_mao2.innerHTML = cartas;
}

function inicializaCards(){
    for(let i=0 ; i < cartas_em_campo.length ; i++){
        let div = document.getElementById("card"+cartas_em_campo[i].simbolo+cartas_em_campo[i].nipe); 
        div.onclick = () => registraJogada(div,cartas_em_campo[i])
    }
}

function mostraCartaMaquina(carta){
    let id = "carta-maquina"+(maquina.mao.length % 3);
    let div = document.getElementById(id);
    let cor = (carta.nipe == "ouros" || carta.nipe == "copas") ? "red":"black";
    div.classList.remove("fundo-carta");
    div.innerHTML = montaCarta(carta.simbolo,carta.nipe,cor);
    div.style.marginTop = "20px";
}

function mostraCartaJogador(div){
    div.style.marginTop = "-20px";
}

// Função para mostrar mensagem animada
function mostrarMensagem(texto, tipo) {
    const divMensagem = document.getElementById("mensagem-jogo");
    divMensagem.textContent = texto;

    if (tipo === 'ganhou') {
        divMensagem.style.backgroundColor = 'green';
    } else if (tipo === 'perdeu') {
        divMensagem.style.backgroundColor = 'red';
    } else {
        divMensagem.style.backgroundColor = 'rgba(0,0,0,0.7)';
    }

    divMensagem.style.display = 'block';
    divMensagem.style.opacity = 1;
    divMensagem.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
        divMensagem.style.opacity = 0;
        divMensagem.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => divMensagem.style.display = 'none', 500);
    }, 2000);
}

const registraJogada = (div, carta) => {
    // Impede clicar de novo
    div.onclick = null;  
    div.style.pointerEvents = "none"; 
    div.style.opacity = "0.5"; // feedback visual

    // Remove a carta do array de cartas em campo
    cartas_em_campo = cartas_em_campo.filter(c => c !== carta);

    let status = carta.compara(carta_maquina);
    console.log(status)
    if(status > 0){
        alert("Venceu esse round!")
        quantidade_vitoria += 1;
    } else if (status < 0) {
        alert("Perdeu esse round!");
        quantidade_derrota += 1;
    } else {
        alert("Empate!");
    }

    quantidade_round += 1;

    if (quantidade_derrota == 12 || quantidade_vitoria == 12 || quantidade_round == 3) {
        if (quantidade_vitoria > quantidade_derrota) {
            pontuacao += 1;
        } else if (quantidade_vitoria < quantidade_derrota) {
            pontuacao -= 1;
        }

        div_pontuacao.innerHTML = pontuacao;
        quantidade_derrota = 0;
        quantidade_vitoria = 0;
        quantidade_round = 0;
        novoTurno();
    }

    novoRound();
}

const novoTurno = () => {
    cartas_em_campo = []
    baralho.montaBaralho()
    baralho.embaralha()
    nova_mao_maquina()
    nova_mao_jogador()
    inicializaCards()
}

const novoRound = () => {
    let carta = maquina.lancaCarta();
    carta_maquina = carta;
    mostraCartaMaquina(carta);
}

novoTurno();
novoRound();
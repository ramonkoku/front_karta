const div_mao1 = document.getElementById("mao-maquina");
const div_mao2 = document.getElementById("mao-jogador");
const div_pontuacao_jogador = document.getElementById("pontuacao-jogador");
const div_pontuacao_maquina = document.getElementById("pontuacao-maquina");
const div_mensagem = document.getElementById("mensagem-jogo");
const divManilha = document.getElementById("manilha-info");
const divVira = document.getElementById("vira");
const botaoTruco = document.getElementById("botao-truco");

// Caixa de diálogo
const trucoDialog = document.getElementById("truco-dialog");
const trucoTexto = document.getElementById("truco-texto");
const aceitarTrucoBtn = document.getElementById("aceitar-truco");
const correrTrucoBtn = document.getElementById("correr-truco");

let cartas_em_campo = [];
let carta_maquina = null;
let quantidade_round = 0;
let pontos_jogador = 0;
let pontos_maquina = 0;
let vitorias_jogador = 0;
let vitorias_maquina = 0;
let cartaVira = null;
let manilhaSimbolo = null;
let valorRodada = 1;
let emDisputa = false;

let baralho = new Baralho(
    ["4","5","6","7","Q","J","K","A","2","3"],
    ["espadas","paus","copas","ouros"]
);
let maquina = new Jogador();

// --- FUNÇÕES DE MENSAGEM ---
function mostrarMensagem(texto, tipo){
    div_mensagem.textContent = texto;
    div_mensagem.style.backgroundColor =
        tipo==="ganhou"?"green":tipo==="perdeu"?"red":"rgba(0,0,0,0.7)";
    div_mensagem.style.display = "block";
    div_mensagem.style.opacity = 1;
    div_mensagem.style.transform = "translateX(-50%) translateY(0)";
    setTimeout(()=>{
        div_mensagem.style.opacity = 0;
        div_mensagem.style.transform = "translateX(-50%) translateY(-20px)";
        setTimeout(()=>div_mensagem.style.display="none",500);
    },2000);
}

// --- MANILHA ---
function atualizarManilha(){ divManilha.textContent = "Manilha: "+manilhaSimbolo; }
function defineManilha(){
    let simbolos = ["4","5","6","7","Q","J","K","A","2","3"];
    let indiceVira = simbolos.indexOf(cartaVira.simbolo);
    manilhaSimbolo = simbolos[(indiceVira+1)%simbolos.length];
    for(let carta of baralho.cartas){
        carta.peso = carta.simbolo===manilhaSimbolo ? 20 : simbolos.indexOf(carta.simbolo)+1;
    }
}

// --- MÃO DA MÁQUINA ---
function nova_mao_maquina(){
    let cartas_maquina = baralho.distribuiCartas(3);
    maquina.novaMao(cartas_maquina);
    let html="";
    for(let i=0;i<3;i++){ html+=`<div class="fundo-carta" id="carta-maquina${i}">?</div>`; }
    div_mao1.innerHTML = html;

    // Máquina decide se pede truco
    setTimeout(maquinaPedeTruco, 1000);
}

// --- MÃO DO JOGADOR ---
function nova_mao_jogador(){
    let cartas_jogador = baralho.distribuiCartas(3);
    cartas_em_campo = cartas_jogador.slice();
    let html="";
    for(let carta of cartas_jogador){
        let cor = (carta.nipe==="ouros"||carta.nipe==="copas")?"red":"black";
        html+=montaCarta(carta.simbolo,carta.nipe,cor,false);
    }
    div_mao2.innerHTML = html;
    inicializaCards();
}

// --- INICIALIZA CARTAS JOGADOR ---
function inicializaCards(){
    for(let carta of cartas_em_campo){
        let div = document.getElementById("card"+carta.simbolo+carta.nipe);
        div.onclick = ()=>registraJogada(div,carta);
    }
}

// --- MOSTRAR CARTA MÁQUINA ---
function mostraCartaMaquina(carta,index){
    let div=document.getElementById("carta-maquina"+index);
    let cor = (carta.nipe==="ouros"||carta.nipe==="copas")?"red":"black";
    div.outerHTML = montaCarta(carta.simbolo,carta.nipe,cor,false);
}

// --- REGISTRA JOGADA ---
function registraJogada(div,carta){
    div.onclick=null; div.style.pointerEvents="none"; div.style.opacity=0.5;
    cartas_em_campo = cartas_em_campo.filter(c=>c!==carta);
    let index_maquina = 3 - maquina.mao.length;
    carta_maquina = maquina.lancaCarta();
    mostraCartaMaquina(carta_maquina,index_maquina);
    setTimeout(()=>{
        let status = carta.compara(carta_maquina);
        if(status>0){ vitorias_jogador++; mostrarMensagem("Você venceu","ganhou"); }
        else if(status<0){ vitorias_maquina++; mostrarMensagem("Máquina venceu","perdeu"); }
        else mostrarMensagem("Empate","empate");
        quantidade_round++;
        if(quantidade_round>=3){
            if(vitorias_jogador>vitorias_maquina){ pontos_jogador+=valorRodada; valorRodada=1; }
            else if(vitorias_maquina>vitorias_jogador){ pontos_maquina+=valorRodada; valorRodada=1; }
            if(vitorias_jogador>vitorias_maquina){
                div_pontuacao_jogador.classList.add("pontuacao-animada");
                setTimeout(()=>div_pontuacao_jogador.classList.remove("pontuacao-animada"),600);
            } else if(vitorias_maquina>vitorias_jogador){
                div_pontuacao_maquina.classList.add("pontuacao-animada");
                setTimeout(()=>div_pontuacao_maquina.classList.remove("pontuacao-animada"),600);
            }
            atualizarPontuacao();
            quantidade_round=0; vitorias_jogador=0; vitorias_maquina=0;
            setTimeout(()=>{ if(!verificarFimDeJogo()) novoTurno(); },1000);
        }
    },500);
}

// --- PONTUAÇÃO ---
function atualizarPontuacao(){
    div_pontuacao_jogador.textContent = "Jogador: "+pontos_jogador;
    div_pontuacao_maquina.textContent = "Máquina: "+pontos_maquina;
}

// --- FIM DE JOGO ---
function verificarFimDeJogo(){
    if(pontos_jogador>=12||pontos_maquina>=12){
        let vencedor = pontos_jogador>=12?"Você venceu!":"A máquina venceu!";
        let jogarNovamente = confirm(vencedor+" Quer jogar novamente?");
        if(jogarNovamente){ pontos_jogador=0; pontos_maquina=0; atualizarPontuacao(); novoTurno(); }
        else{ window.location.href="../../pagina3.html"; }
        return true;
    }
    return false;
}

// --- FUNÇÃO DE TRUCO COM DIÁLOGO ---
function pedirTruco(origem, valor=valorRodada){
    let novoValor;
    if(valor===1) novoValor=3;
    else if(valor===3) novoValor=6;
    else if(valor===6) novoValor=9;
    else if(valor===9) novoValor=12;
    else return;

    if(origem==="jogador"){
        mostrarMensagem("Você pediu TRUCO!","empate");
        setTimeout(()=>{
            let chance = Math.random();
            if(chance<0.5){
                mostrarMensagem("Máquina correu!","ganhou");
                pontos_jogador+=valorRodada; valorRodada=1; atualizarPontuacao(); emDisputa=false;
                setTimeout(novoTurno,1500);
            } else {
                valorRodada=novoValor; mostrarMensagem("Máquina aceitou! Vale "+valorRodada+" pontos!","empate");
                emDisputa=false;
            }
        },1000);
    } else if(origem==="maquina"){
        mostrarTrucoDialog(
            "Máquina pediu "+novoValor+"! Deseja aceitar?",
            novoValor,
            ()=>{ // Aceitar
                valorRodada = novoValor;
                mostrarMensagem("Você aceitou! Vale "+valorRodada+" pontos!","empate");
                emDisputa=false;
            },
            ()=>{ // Correr
                mostrarMensagem("Você correu!","perdeu");
                pontos_maquina += valorRodada;
                valorRodada = 1;
                atualizarPontuacao();
                setTimeout(novoTurno,1500);
                emDisputa=false;
            }
        );
    }
}

// --- FUNÇÃO DE DIÁLOGO ---
function mostrarTrucoDialog(texto, valor, callbackAceitar, callbackCorrer) {
    trucoTexto.textContent = texto;
    trucoDialog.classList.add("show");

    aceitarTrucoBtn.onclick = () => {
        trucoDialog.classList.remove("show");
        if(callbackAceitar) callbackAceitar();
    };
    correrTrucoBtn.onclick = () => {
        trucoDialog.classList.remove("show");
        if(callbackCorrer) callbackCorrer();
    };
}

// --- BOTÃO PEDIR TRUCO ---
botaoTruco.onclick = ()=>{
    if(emDisputa) return;
    emDisputa=true;
    pedirTruco("jogador");
}

// --- MÁQUINA PODE PEDIR TRUCO AUTOMÁTICO ---
function maquinaPedeTruco(){
    if(emDisputa || valorRodada>=12) return;
    let cartaAlta = maquina.mao.some(c => c.peso >= 10);
    let chance = cartaAlta ? 0.5 : 0.2;
    if(Math.random()<chance){
        emDisputa = true;
        pedirTruco("maquina", valorRodada);
    }
}

// --- NOVO TURNO ---
function novoTurno(){
    baralho.montaBaralho();
    baralho.embaralha();
    let cartasVira = baralho.distribuiCartas(1);
    cartaVira = cartasVira[0];
    divVira.innerHTML = montaCarta(
        cartaVira.simbolo,cartaVira.nipe,(cartaVira.nipe==="ouros"||cartaVira.nipe==="copas")?"red":"black",false
    );
    defineManilha();
    atualizarManilha();
    nova_mao_maquina();
    nova_mao_jogador();
    emDisputa=false;
}

// --- INICIA JOGO ---
novoTurno();

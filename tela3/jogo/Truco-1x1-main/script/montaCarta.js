function montaCarta(simbolo, nipe, cor, virada = false) {
    if (virada) {
        return `<div class="fundo-carta">?</div>`;
    }

    let emoji = "";
    switch (nipe) {
        case "espadas": emoji = "♠"; break;
        case "copas": emoji = "♥"; break;
        case "ouros": emoji = "♦"; break;
        case "paus": emoji = "♣"; break;
    }

    return `
    <div class="carta" id="card${simbolo}${nipe}">
        <div class="simb-esq-carta">
            <i class="num-carta ${cor}">${simbolo}</i>
            <i class="nipe">${emoji}</i>
        </div>
        <div class="simb-dir-carta">
            <i class="num-carta ${cor}">${simbolo}</i>
            <i class="nipe">${emoji}</i>
        </div>
    </div>`;
}

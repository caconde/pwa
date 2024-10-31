
document.addEventListener("DOMContentLoaded", function (event) {
    if ('serviceWorker' in navigator) {
        console.log('has serviceworker');
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('serviceWorker.js')
                .then((registration) => {
                    console.log('Service worker registered.', registration);
                });
        });
    }
    else {
        console.log("Your browser not supports serviceWorkers");
    }
});

let despesas = [];

async function adicionarDespesa() {
    const descricao = document.getElementById('descricao').value;
    const quantidade = parseFloat(document.getElementById('quantidade').value);
    const valor = parseFloat(document.getElementById('valor').value);
    const moedaOrigem = document.getElementById('moedaOrigem').value;
    const moedaDestino = document.getElementById('moedaDestino').value;

    await fetch('https://v6.exchangerate-api.com/v6/0c97323f348aa3d7704c9606/latest/' + moedaOrigem)
        .then((response) => response.json())
        .then((json) => {
            const taxaCambio = json['conversion_rates'][moedaDestino]; // Taxa fictícia para conversão USD-BRL
            const valorConvertido = valor * taxaCambio;

            const despesa = {
                descricao,
                quantidade,
                valor,
                moedaOrigem,
                valorConvertido,
                moedaDestino
            };

            despesas.push(despesa);
        })
    atualizarLista();
    atualizarTotais();

}

function atualizarLista() {
    const listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    despesas.forEach((despesa, index) => {
        const item = document.createElement('div');
        item.className = 'expense-item';
        item.innerHTML = `
                ${despesa.descricao} (Qtd. ${despesa.quantidade}): ${despesa.valor} ${despesa.moedaOrigem} => ${despesa.valorConvertido.toFixed(2)} ${despesa.moedaDestino}
                <button class="edit-btn" onclick="editarDespesa(${index})">✏️</button>
                <button class="delete-btn" onclick="excluirDespesa(${index})">🗑️</button>
            `;
        listaDespesas.appendChild(item);
    });
}

function atualizarTotais() {
    let totalOrigem = 0;
    let totalDestino = 0;

    despesas.forEach(despesa => {
        totalOrigem += despesa.valor;
        totalDestino += despesa.valorConvertido;
    });

    document.getElementById('totalOrigem').textContent = totalOrigem.toFixed(2);
    document.getElementById('totalDestino').textContent = totalDestino.toFixed(2);
    document.getElementById('descricao').value = "";
    document.getElementById('quantidade').value = "";
    document.getElementById('valor').value = "";
}

function excluirDespesa(index) {
    despesas.splice(index, 1);
    atualizarLista();
    atualizarTotais();
}

function editarDespesa(index) {
    const despesa = despesas[index];
    document.getElementById('descricao').value = despesa.descricao;
    document.getElementById('quantidade').value = despesa.quantidade;
    document.getElementById('valor').value = despesa.valor;
    document.getElementById('moedaOrigem').value = despesa.moedaOrigem;
    document.getElementById('moedaDestino').value = despesa.moedaDestino;

}
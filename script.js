// Função para popular os campos de moeda com as moedas suportadas
async function MoedasPopulares() {
    try {
        // Fazendo a requisição à API para obter os códigos das moedas
        const resp = await fetch(`https://v6.exchangerate-api.com/v6/3c9ff442b1329cb1baa2e9df/codes`);
        const data = await resp.json();

        // Verifica se a API retornou os códigos das moedas
        if (data.supported_codes) {
            const fromCurrencySelect = document.getElementById('fromCurrency');
            const toCurrencySelect = document.getElementById('toCurrency');

            // Limpa os campos antes de preencher
            fromCurrencySelect.innerHTML = '';
            toCurrencySelect.innerHTML = '';

            // Preenche os campos de moeda com as opções disponíveis
            data.supported_codes.forEach(([code, name]) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = `${name} (${code})`;

                // Clona o item para adicionar nas duas listas de moedas
                fromCurrencySelect.appendChild(option.cloneNode(true));
                toCurrencySelect.appendChild(option);
            });
        }
        
    } catch (error) {
        console.error("Não possível requisitar as moedas", error);
    }
}

// Evento de clique no botão para realizar a conversão de moeda
document.getElementById('convert').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('amount').value); // Valor inserido pelo usuário
    const fromCurrency = document.getElementById('fromCurrency').value; // Moeda de origem
    const toCurrency = document.getElementById('toCurrency').value; // Moeda de destino

    // Verifica se o valor inserido é válido
    if (isNaN(amount) || amount <= 0) {
        document.getElementById('result').textContent = "Digite um valor válido";
        return;
    }

    try {
        // Fazendo a requisição à API para obter a taxa de conversão
        const resp = await fetch(`https://v6.exchangerate-api.com/v6/3c9ff442b1329cb1baa2e9df/latest/${fromCurrency}`);
        const data = await resp.json();

        // Verifica se a API retornou a taxa de conversão
        if (data.conversion_rates && data.conversion_rates[toCurrency]) {
            const taxa = data.conversion_rates[toCurrency]; // Taxa de conversão
            const convert = amount * taxa; // Valor convertido

            // Exibe o resultado da conversão
            document.getElementById('result').textContent = `Valor convertido = ${convert.toFixed(2)} ${toCurrency}`;
        } else {
            document.getElementById('result').textContent = "Não foi possível realizar a conversão";
        }
    } catch (error) {
        // Exibe uma mensagem de erro caso a conexão falhe
        document.getElementById("result").textContent = "Erro ao conectar com o serviço.";
    }
});

// Chama a função para popular as moedas ao carregar a página
MoedasPopulares();

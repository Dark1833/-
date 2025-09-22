// Garante que o script só vai rodar depois que toda a página HTML for carregada.
// É ESSENCIAL que todo o código esteja dentro deste bloco.
document.addEventListener('DOMContentLoaded', () => {

    // --- Seleção dos Elementos do DOM ---
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const generateBtn = document.getElementById('generate-btn');
    const generatedNickEl = document.getElementById('generated-nick');
    const statusTextEl = document.getElementById('status-text');

    // Se um dos elementos não for encontrado, para o script para evitar mais erros.
    if (!lengthSlider || !lengthValue || !generateBtn || !generatedNickEl || !statusTextEl) {
        console.error("Erro: Um ou mais elementos do HTML não foram encontrados. Verifique os IDs no index.html.");
        return;
    }

    // --- Atualiza o valor do texto ao lado do slider ---
    lengthSlider.addEventListener('input', (event) => {
        lengthValue.textContent = event.target.value;
    });

    // --- Adiciona o evento de clique ao botão ---
    generateBtn.addEventListener('click', () => {
        const length = parseInt(lengthSlider.value);
        const nick = generateNickname(length);
        
        generatedNickEl.textContent = nick;
        checkNicknameAvailability(nick);
    });

    /**
     * Gera um nick aleatório com base no tamanho fornecido.
     * @param {number} length - O número de caracteres do nick.
     * @returns {string} O nick gerado.
     */
    function generateNickname(length) {
        const vowels = 'aeiou';
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        const numbers = '0123456789';
        
        let result = '';
        let useVowel = Math.random() > 0.5;

        for (let i = 0; i < length; i++) {
            if (i > length - 3 && Math.random() > 0.7) {
                result += numbers.charAt(Math.floor(Math.random() * numbers.length));
            } else {
                if (useVowel) {
                    result += vowels.charAt(Math.floor(Math.random() * vowels.length));
                } else {
                    result += consonants.charAt(Math.floor(Math.random() * consonants.length));
                }
                useVowel = !useVowel;
            }
        }
        
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    /**
     * Verifica a disponibilidade de um nick usando a API do NameMC.
     * @param {string} nickname - O nick a ser verificado.
     */
    async function checkNicknameAvailability(nickname) {
        statusTextEl.textContent = 'Verificando disponibilidade...';
        statusTextEl.className = 'status-checking';

        try {
            const apiUrl = `https://api.namemc.com/profile/${nickname}/java`;
            const response = await fetch(apiUrl);

            if (response.status === 204) {
                updateStatus(true); // Disponível
            } else if (response.status === 200) {
                updateStatus(false); // Em uso
            } else {
                updateStatus(false); 
                statusTextEl.textContent = 'Nick inválido ou erro na API.';
            }
        } catch (error) {
            console.error("Erro ao verificar o nick:", error);
            statusTextEl.textContent = 'Erro de rede. Tente novamente.';
            statusTextEl.className = 'status-taken';
        }
    }

    /**
     * Atualiza o texto e a cor do status.
     * @param {boolean} isAvailable - True se o nick estiver disponível, false caso contrário.
     */
    function updateStatus(isAvailable) {
        if (isAvailable) {
            statusTextEl.textContent = 'Disponível!';
            statusTextEl.className = 'status-available';
        } else {
            statusTextEl.textContent = 'Este nick já está em uso!';
            statusTextEl.className = 'status-taken';
        }
    }
// FIM do bloco DOMContentLoaded. Tenha certeza que esta linha e o '});' estão no seu código.
});

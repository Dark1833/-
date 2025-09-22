// Aguarda o carregamento completo do HTML para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- Seleção dos Elementos do DOM ---
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const generateBtn = document.getElementById('generate-btn');
    const generatedNickEl = document.getElementById('generated-nick');
    const statusTextEl = document.getElementById('status-text');

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
        let useVowel = Math.random() > 0.5; // Decide se começa com vogal ou consoante

        for (let i = 0; i < length; i++) {
            if (i > length - 3 && Math.random() > 0.7) { // Chance de adicionar número no final
                result += numbers.charAt(Math.floor(Math.random() * numbers.length));
            } else {
                if (useVowel) {
                    result += vowels.charAt(Math.floor(Math.random() * vowels.length));
                } else {
                    result += consonants.charAt(Math.floor(Math.random() * consonants.length));
                }
                useVowel = !useVowel; // Alterna entre vogal e consoante para melhor legibilidade
            }
        }
        
        // Garante que a primeira letra seja maiúscula para um estilo
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    /**
     * [VERSÃO FINAL]
     * Verifica a disponibilidade de um nick usando a API do NameMC,
     * que é estável e não requer proxy.
     * @param {string} nickname - O nick a ser verificado.
     */
    async function checkNicknameAvailability(nickname) {
        // Atualiza a UI para o estado de "verificando"
        statusTextEl.textContent = 'Verificando disponibilidade...';
        statusTextEl.className = 'status-checking';

        try {
            // Usamos a API do NameMC, que é uma alternativa robusta.
            const apiUrl = `https://api.namemc.com/profile/${nickname}/java`;
            
            const response = await fetch(apiUrl);

            // A lógica é baseada no código de status da resposta da API do NameMC
            if (response.status === 204) {
                // 204 No Content -> O usuário não existe, o nick está DISPONÍVEL!
                updateStatus(true);
            } else if (response.status === 200) {
                // 200 OK -> O usuário existe, o nick está EM USO!
                updateStatus(false);
            } else {
                // Qualquer outro caso é tratado como um erro da API
                updateStatus(false); 
                statusTextEl.textContent = 'Nick inválido ou erro na API.';
                console.warn(`Status inesperado da API: ${response.status}`);
            }
            
        } catch (error) {
            console.error("Erro ao verificar o nick:", error);
            statusTextEl.textContent = 'Erro de rede. Tente novamente.';
            statusTextEl.className = 'status-taken'; // Usa a cor de erro
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
});

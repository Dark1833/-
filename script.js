// Arquivo: script.js

// ... (todo o resto do seu código permanece igual) ...

/**
 * [VERSÃO CORRIGIDA]
 * Verifica a disponibilidade de um nick usando uma API mais confiável (Ashcon).
 * Esta versão não precisa de proxy e interpreta os códigos de status HTTP diretamente.
 * @param {string} nickname - O nick a ser verificado.
 */
async function checkNicknameAvailability(nickname) {
    // Atualiza a UI para o estado de "verificando"
    statusTextEl.textContent = 'Verificando disponibilidade...';
    statusTextEl.className = 'status-checking';

    try {
        // Usamos a API da Ashcon, que é mais direta e não tem problemas de CORS
        const apiUrl = `https://api.ashcon.app/mojang/v2/user/${nickname}`;
        
        const response = await fetch(apiUrl);

        // A lógica agora é baseada no código de status da resposta
        if (response.status === 404) {
            // 404 Not Found -> O usuário não existe, o nick está DISPONÍVEL!
            updateStatus(true);
        } else if (response.status === 200) {
            // 200 OK -> O usuário existe, o nick está EM USO!
            updateStatus(false);
        } else {
            // Qualquer outro caso é tratado como um erro da API
            throw new Error(`Status inesperado da API: ${response.status}`);
        }
        
    } catch (error) {
        console.error("Erro ao verificar o nick:", error);
        statusTextEl.textContent = 'Erro ao verificar. Tente novamente.';
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

// ... (o resto do código, como o event listener do DOMContentLoaded, continua aqui) ...

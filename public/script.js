// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const messageContainer = document.getElementById('message-container');

    // Fungsi untuk menampilkan pesan di UI
    function displayMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = text;
        msgDiv.classList.add('message', sender);
        messageContainer.appendChild(msgDiv);
        // Scroll ke bawah
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    // Fungsi utama untuk mengirim pesan
    async function sendMessage() {
        const userMessage = input.value.trim();
        if (userMessage === '') return;

        // 1. Tampilkan pesan pengguna
        displayMessage(userMessage, 'user');
        input.value = ''; // Kosongkan input
        sendButton.disabled = true; // Nonaktifkan tombol saat memproses

        // Tampilkan pesan loading
        displayMessage('DNA Asisten sedang mengetik...', 'DNA');
        
        try {
            // 2. Kirim ke API Endpoint di server Node.js
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            // Hapus pesan loading
            messageContainer.removeChild(messageContainer.lastChild);

            if (!response.ok) {
                const errorData = await response.json();
                displayMessage(`[Error: ${errorData.error || 'Server Gagal'}]`, 'gemini');
                return;
            }

            const data = await response.json();
            
            // 3. Tampilkan jawaban Gemini
            displayMessage(data.response, 'gemini');

        } catch (error) {
            console.error('Koneksi Gagal:', error);
            displayMessage('[Error: Koneksi ke server gagal.]', 'gemini');
        } finally {
            sendButton.disabled = false;
        }
    }

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
// chatbot.js
import { GoogleGenAI } from '@google/genai';
import * as readline from 'node:readline/promises'; // Menggunakan import ES Module untuk readline
import { stdin as input, stdout as output } from 'node:process';

// Mengambil API Key dari environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Pastikan model yang digunakan mendukung Chat
const modelId = 'gemini-2.0-flash-001'; // Flash disarankan untuk kecepatan chat

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function runChatbot() {
    
    // 1. Setup Interface Input/Output Terminal
    const rl = readline.createInterface({ input, output });

    console.log(`\n--- Chatbot Gemini (${modelId}) ---`);
    console.log("Chatbot siap! Ketik 'exit' untuk keluar.\n");

    try {
        // 2. Definisikan Chat (Model akan otomatis mengingat riwayat percakapan)
        const chat = ai.chats.create({
            model: modelId,
            config: {
                systemInstruction: "Anda adalah asisten yang sangat membantu, ringkas, dan menjaga konteks percakapan sebelumnya. jangan menjawab pertanyaan yang tidak berkaitan dengan artikel berikut :\n\n Digital Nusantara Adisolusi (DNA), sebuah penyedia solusi IT terkemuka yang berbasis di Yogyakarta, Indonesia, dengan fokus menjadi Your Partner in Digital Transformation (Mitra Anda dalam Transformasi Digital). Tujuan Utamanya adalah untuk memanfaatkan kekuatan teknologi guna mendorong kemajuan bisnis klien mereka. Layanan Utama yang Ditawarkan: IT Managed Services (Layanan Terkelola IT): Menyediakan pengembang aplikasi profesional berbakat yang berdedikasi untuk mendukung bisnis klien. Custom Software Development (Pengembangan Perangkat Lunak Kustom): Solusi perangkat lunak yang dibuat khusus untuk merampingkan operasi dan meningkatkan produktivitas. Software Integration Specialist (Spesialis Integrasi Perangkat Lunak): Memastikan berbagai sistem perangkat lunak dapat bekerja sama dengan mulus untuk meningkatkan operasional klien. UI/UX Design (Desain UI/UX): Layanan untuk meningkatkan pengalaman pengguna (UX) dan antarmuka (UI) dari aplikasi atau website. Nilai Inti (Core Value) Perusahaan: D - Dedication (Dedikasi): Berkomitmen penuh kepada klien, pekerjaan, dan tim. N - Nurturing Innovation (Memupuk Inovasi): Mendorong kreativitas dan lingkungan di mana ide-ide baru dapat berkembang. A - Accountability (Akuntabilitas): Bertanggung jawab atas tindakan dan dampaknya, serta menjaga integritas. Secara keseluruhan, dnabisa.com memposisikan diri sebagai perusahaan yang menyediakan solusi digital komprehensif, mulai dari penyediaan talenta IT hingga pengembangan perangkat lunak yang disesuaikan dan integrasi sistem. \n\n ketika tidak bisa menjawab pertanyaan, jawab dengan 'Maaf, saya tidak mengetahui jawaban ini, silahkan hubungi kami melalui email: leo@dnabisa.com'."
            }
        });

        // 3. Loop Percakapan
        let running = true;
        while (running) {
            const userInput = await rl.question("Anda: ");
            if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
                console.log("\nSampai jumpa! Chatbot dimatikan.");
                running = false;
                break;
            }

            try {
                // Mengirim pesan pengguna ke objek chat.
                const response = await chat.sendMessage({
                    message: userInput
                });

                const generatedText = response.text;
                
                console.log(`Gemini: ${generatedText}\n`);

                // Menampilkan token usage (opsional)
                const usage = response.usageMetadata;
                if (usage) {
                    console.log(`Tokens Input: ${usage.promptTokenCount}, Tokens Output: ${usage.candidatesTokenCount}, Total: ${usage.totalTokenCount}`);
                }

            } catch (error) {
                console.error("\n[!] Terjadi kesalahan saat memproses pesan:", error.message);
                console.log("Periksa kembali kunci API, batas penggunaan, atau ketersediaan model.");
                
                // Keluar dari loop jika terjadi error fatal (misalnya, API Key tidak valid)
                running = false;
            }
        }
        
    } catch (error) {
        console.error("Gagal memulai Chatbot:", error.message);
    } finally {
        rl.close();
    }
}

runChatbot();
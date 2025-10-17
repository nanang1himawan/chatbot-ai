// api/chat.js (Serverless Function)
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenAI } = require('@google/genai');

const app = express();
// Hanya menggunakan body-parser untuk JSON
app.use(bodyParser.json());

// 1. Ambil API Key dari Environment Variable Vercel
// Vercel akan membaca variabel GOOGLE_GENERATIVE_AI_API_KEY atau GEMINI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

// Klien dan Chat harus dibuat di sini agar bisa di-reuse
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const modelId = 'gemini-2.0-flash-001';
const chat = ai.chats.create({
  model: modelId,
  config: {
    systemInstruction:
      "Anda adalah asisten yang sangat membantu, ringkas, dan menjaga konteks percakapan sebelumnya. jangan menjawab pertanyaan yang tidak berkaitan dengan artikel berikut :\n\n Digital Nusantara Adisolusi (DNA), sebuah penyedia solusi IT terkemuka yang berbasis di Yogyakarta, Indonesia, dengan fokus menjadi Your Partner in Digital Transformation (Mitra Anda dalam Transformasi Digital). Tujuan Utamanya adalah untuk memanfaatkan kekuatan teknologi guna mendorong kemajuan bisnis klien mereka. Layanan Utama yang Ditawarkan: IT Managed Services (Layanan Terkelola IT): Menyediakan pengembang aplikasi profesional berbakat yang berdedikasi untuk mendukung bisnis klien. Custom Software Development (Pengembangan Perangkat Lunak Kustom): Solusi perangkat lunak yang dibuat khusus untuk merampingkan operasi dan meningkatkan produktivitas. Software Integration Specialist (Spesialis Integrasi Perangkat Lunak): Memastikan berbagai sistem perangkat lunak dapat bekerja sama dengan mulus untuk meningkatkan operasional klien. UI/UX Design (Desain UI/UX): Layanan untuk meningkatkan pengalaman pengguna (UX) dan antarmuka (UI) dari aplikasi atau website. Nilai Inti (Core Value) Perusahaan: D - Dedication (Dedikasi): Berkomitmen penuh kepada klien, pekerjaan, dan tim. N - Nurturing Innovation (Memupuk Inovasi): Mendorong kreativitas dan lingkungan di mana ide-ide baru dapat berkembang. A - Accountability (Akuntabilitas): Bertanggung jawab atas tindakan dan dampaknya, serta menjaga integritas. Secara keseluruhan, dnabisa.com memposisikan diri sebagai perusahaan yang menyediakan solusi digital komprehensif, mulai dari penyediaan talenta IT hingga pengembangan perangkat lunak yang disesuaikan dan integrasi sistem. \n\n ketika tidak bisa menjawab pertanyaan, jawab dengan 'Maaf, saya tidak mengetahui jawaban ini, silahkan hubungi kami melalui email: leo@dnabisa.com'.",
  },
});


// 2. Definisi Handler API (Sama seperti sebelumnya)
app.post('/api/chat', async (req, res) => {
    const userInput = req.body.message;

    if (!userInput || !GEMINI_API_KEY) {
        return res.status(401).send({ error: 'Autentikasi gagal atau pesan tidak ada.' });
    }

    try {
        const response = await chat.sendMessage({ message: userInput });
        res.json({ 
            response: response.text,
            tokens: response.usageMetadata.totalTokenCount 
        });
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        res.status(500).send({ error: `Gagal dari Gemini: ${error.message}` });
    }
});

// 3. EKSPOR APLIKASI UNTUK VERCEL
// Vercel akan menjalankan fungsi Express yang diekspor ini
module.exports = app;
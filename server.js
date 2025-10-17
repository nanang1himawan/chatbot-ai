// server.js (Akan menjalankan server Express)
const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const port = 3000;

// Mengambil API Key dari environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const modelId = "gemini-2.0-flash-001";

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // Menghubungkan ke folder 'public' untuk file HTML/CSS/JS frontend

// Inisialisasi Riwayat Chat di Server
// (CATATAN: Dalam aplikasi nyata, ini harus disimpan per sesi pengguna)
const chat = ai.chats.create({
  model: modelId,
  config: {
    systemInstruction:
      "Anda adalah asisten yang sangat membantu, ringkas, dan menjaga konteks percakapan sebelumnya. jangan menjawab pertanyaan yang tidak berkaitan dengan artikel berikut :\n\n Digital Nusantara Adisolusi (DNA), sebuah penyedia solusi IT terkemuka yang berbasis di Yogyakarta, Indonesia, dengan fokus menjadi Your Partner in Digital Transformation (Mitra Anda dalam Transformasi Digital). Tujuan Utamanya adalah untuk memanfaatkan kekuatan teknologi guna mendorong kemajuan bisnis klien mereka. Layanan Utama yang Ditawarkan: IT Managed Services (Layanan Terkelola IT): Menyediakan pengembang aplikasi profesional berbakat yang berdedikasi untuk mendukung bisnis klien. Custom Software Development (Pengembangan Perangkat Lunak Kustom): Solusi perangkat lunak yang dibuat khusus untuk merampingkan operasi dan meningkatkan produktivitas. Software Integration Specialist (Spesialis Integrasi Perangkat Lunak): Memastikan berbagai sistem perangkat lunak dapat bekerja sama dengan mulus untuk meningkatkan operasional klien. UI/UX Design (Desain UI/UX): Layanan untuk meningkatkan pengalaman pengguna (UX) dan antarmuka (UI) dari aplikasi atau website. Nilai Inti (Core Value) Perusahaan: D - Dedication (Dedikasi): Berkomitmen penuh kepada klien, pekerjaan, dan tim. N - Nurturing Innovation (Memupuk Inovasi): Mendorong kreativitas dan lingkungan di mana ide-ide baru dapat berkembang. A - Accountability (Akuntabilitas): Bertanggung jawab atas tindakan dan dampaknya, serta menjaga integritas. Secara keseluruhan, dnabisa.com memposisikan diri sebagai perusahaan yang menyediakan solusi digital komprehensif, mulai dari penyediaan talenta IT hingga pengembangan perangkat lunak yang disesuaikan dan integrasi sistem. \n\n ketika tidak bisa menjawab pertanyaan, jawab dengan 'Maaf, saya tidak mengetahui jawaban ini, silahkan hubungi kami melalui email: leo@dnabisa.com'.",
  },
});

// 🚨 API Endpoint untuk Chat
app.post("/api/chat", async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).send({ error: "Pesan diperlukan." });
  }

  try {
    const response = await chat.sendMessage({ message: userInput });

    // Mengirim jawaban Gemini ke frontend
    res.json({
      response: response.text,
      tokens: response.usageMetadata.totalTokenCount,
    });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).send({ error: "Gagal mendapatkan jawaban dari Gemini." });
  }
});

app.listen(port, () => {
  console.log(`Server Chat Gemini berjalan di http://localhost:${port}`);
  console.log(`Pastikan GEMINI_API_KEY diatur.`);
});

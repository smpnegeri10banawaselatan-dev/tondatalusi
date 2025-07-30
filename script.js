
const SERVER_URL = "https://script.google.com/macros/s/AKfycbx7b7W6n1NPduPW-HaASHg9fltH60PcBIdelJVp2LjH1Mgymgu7KNnOrFaEZJyV6vli/exec"; // Ganti saat deploy

let soal = [
  {
    pertanyaan: "Apa fungsi utama CPU dalam komputer?",
    pilihan: ["Menyimpan data", "Mengolah data", "Menampilkan data", "Mencetak dokumen"],
    jawaban: 1,
    pembahasan: "CPU adalah pusat pengolahan data utama komputer."
  },
  {
    pertanyaan: "Alat input berikut yang digunakan untuk menggambar adalah...",
    pilihan: ["Printer", "Mouse", "Scanner", "Graphics Tablet"],
    jawaban: 3,
    pembahasan: "Graphics Tablet digunakan untuk menggambar secara digital."
  }
];

let waktu = 180; // 3 menit

function mulaiTimer() {
  const timerDisplay = document.getElementById("waktu");
  const interval = setInterval(() => {
    const menit = Math.floor(waktu / 60);
    const detik = waktu % 60;
    timerDisplay.textContent = \`\${menit}:\${detik.toString().padStart(2, '0')}\`;
    if (waktu <= 0) {
      clearInterval(interval);
      kirimJawaban(); // auto submit
    }
    waktu--;
  }, 1000);
}

function renderSoal() {
  const form = document.getElementById("quizForm");
  soal.forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = \`
      <p class="font-semibold">\${index + 1}. \${item.pertanyaan}</p>
      \${item.pilihan.map((opt, i) => \`
        <label class="block">
          <input type="radio" name="q\${index}" value="\${i}" class="mr-2" />\${opt}
        </label>\`).join("")}
      <p class="text-sm text-gray-600 italic mt-1 hidden pembahasan" id="pembahasan-\${index}">Pembahasan: \${item.pembahasan}</p>
    \`;
    form.appendChild(div);
  });
}

function kirimJawaban() {
  const form = document.getElementById("quizForm");
  let benar = 0;
  soal.forEach((item, i) => {
    const jawaban = form.querySelector(\`input[name="q\${i}"]:checked\`);
    if (jawaban && parseInt(jawaban.value) === item.jawaban) {
      benar++;
    }
    // tampilkan pembahasan
    document.getElementById("pembahasan-" + i).classList.remove("hidden");
  });

  const nilai = Math.round((benar / soal.length) * 100);
  document.getElementById("result").innerHTML = \`
    <p class="text-lg font-bold">Nilai Anda: \${nilai}</p>
    <p>Jawaban benar: \${benar} dari \${soal.length}</p>
  \`;

  // Simpan ke server
  fetch(SERVER_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "submit",
      nama: localStorage.getItem("username") || "Anonim",
      kelas: "8A",
      nilai: nilai,
      jumlahBenar: benar,
      jumlahSoal: soal.length
    })
  });
}

document.getElementById("submitBtn").addEventListener("click", (e) => {
  e.preventDefault();
  kirimJawaban();
});

window.onload = () => {
  renderSoal();
  mulaiTimer();
};

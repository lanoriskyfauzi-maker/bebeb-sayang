// ==== BAGIAN 1: ANIMASI HAMSTER ====
// (Bagian ini TIDAK BERUBAH)
function initHamster() {
  const wrapper = document.querySelector(".wrapper");
  const wheel = document.querySelector(".wheel");
  const defaultHamsterEnergy = 1000;
  const hamster = {
    energy: defaultHamsterEnergy,
    speedFactor: 4,
    isRunning: true,
  };

  const setSpeed = () => {
    wrapper.style.setProperty("--hamster-speed", `${1 / hamster.speedFactor}s`);
    wrapper.style.setProperty("--wheel-speed", `${2 / hamster.speedFactor}s`);
    wrapper.style.setProperty("--wheel-angle", `${0.4 * hamster.speedFactor}deg`);
  };

  document.querySelector("input").addEventListener("input", (e) => {
    hamster.speedFactor = e.target.value;
    setSpeed();
  });

  setInterval(() => {
    if (hamster.isRunning) {
      hamster.energy -= hamster.speedFactor * hamster.speedFactor;
    }
    if (hamster.isRunning && hamster.energy < 0) {
      hamster.isRunning = false;
      wheel.classList.add("spinning");
      setTimeout(() => {
        hamster.energy = defaultHamsterEnergy;
        hamster.isRunning = true;
        wheel.classList.remove("spinning");
      }, 6 * 1000);
    }
  }, 500);

  setSpeed();
}

// ==== BAGIAN 2: EFEK BUNGA BERJATUHAN ====
// (Bagian ini TIDAK BERUBAH)
function spawnFlowers() {
  const flower = document.createElement("div");
  flower.className = "flower";
  flower.innerHTML = "🌸";
  flower.style.left = Math.random() * 100 + "vw";
  flower.style.animationDuration = (4 + Math.random() * 4) + "s";
  flower.style.fontSize = (16 + Math.random() * 16) + "px";
  document.body.appendChild(flower);
  setTimeout(() => flower.remove(), 8000);
}
setInterval(spawnFlowers, 1000);

// ==== BAGIAN 2.1: EFEK PARTIKEL (Opsional) ====
// (Bagian ini TIDAK BERUBAH)
function createParticle() {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = Math.random() * 100 + "vw";
  particle.style.top = "100vh";
  particle.style.animationDuration = (5 + Math.random() * 10) + "s";
  particle.style.backgroundColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 15000);
}
setInterval(createParticle, 300);

// ==== BAGIAN 3: FOTO MUNCUL BERDASARKAN BEAT REFF ====

let currentPhotoIndex = -1; // Indeks foto yang sedang aktif
let photoIntervalId = null; // ID interval untuk berganti foto saat beat
const refStartSecond = 1; // Detik mulai reff (2:19)
const beatInterval = 1.5; // Interval beat dalam detik (sesuaikan dengan beat lagu)
const totalPhotos = 10; // Jumlah foto yang kamu miliki

function hideAllPhotos() {
  document.querySelectorAll(".photo-item").forEach((photo) => {
    photo.classList.remove("show");
    photo.classList.add("hidden");
  });
}

function showNextPhoto() {
// Ganti fungsi showNextPhoto yang lama
  const photos = document.querySelectorAll(".photo-item");
  if (photos.length === 0) return;

  // Sembunyikan foto sebelumnya
  if (currentPhotoIndex >= 0) {
    photos[currentPhotoIndex].classList.remove("show");
    photos[currentPhotoIndex].classList.add("hidden");
  }

  // Pindah ke foto berikutnya (loop jika sudah sampai foto terakhir)
  currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos; // totalPhotos harus diupdate jadi 10

  // Tampilkan foto berikutnya
  photos[currentPhotoIndex].classList.remove("hidden");
  setTimeout(() => {
      photos[currentPhotoIndex].classList.add("show");
  }, 10); // Delay kecil untuk memastikan class hidden aktif dulu sebelum show
}


function startPhotoBeatSync() {
    if (photoIntervalId) clearInterval(photoIntervalId); // Hentikan dulu jika sudah jalan
    hideAllPhotos(); // Sembunyikan semua dulu
    currentPhotoIndex = -1; // Reset index
    console.log("Animasi foto sinkron beat dimulai.");
    // Interval ini akan memicu perpindahan foto sesuai beat
    photoIntervalId = setInterval(showNextPhoto, beatInterval * 1000); // Ubah ke milidetik
}

function stopPhotoBeatSync() {
    if (photoIntervalId) {
        clearInterval(photoIntervalId);
        photoIntervalId = null;
        console.log("Animasi foto sinkron beat dihentikan.");
    }
    hideAllPhotos(); // Sembunyikan semua saat musik berhenti
}

// Fungsi untuk memeriksa apakah musik sudah mencapai reff dan beatnya
function checkBeatAndShowPhoto(bgMusic) {
    // Periksa apakah musik sedang diputar dan sudah lewat detik reff
    if (!bgMusic.paused && bgMusic.currentTime >= refStartSecond) {
        // Kita bisa menghitung beat ke berapa sekarang
        const timeSinceReffStart = bgMusic.currentTime - refStartSecond;
        const currentBeatNumber = Math.floor(timeSinceReffStart / beatInterval);

        // Kita bisa memicu perubahan foto berdasarkan beat tertentu
        // Contoh: Tampilkan foto baru setiap awal beat (0, 4, 8, 12 detik setelah reff)
        // Kita bisa membandingkan beat sekarang dengan beat sebelumnya
        if (typeof lastProcessedBeat === 'undefined' || lastProcessedBeat < currentBeatNumber) {
            lastProcessedBeat = currentBeatNumber;
            showNextPhoto(); // Panggil fungsi untuk menampilkan foto berikutnya
            console.log(`Beat ${currentBeatNumber} - Foto ${currentPhotoIndex + 1} ditampilkan.`);
        }
    } else if (bgMusic.paused) {
        // Jika musik dijeda, reset lastProcessedBeat
        lastProcessedBeat = undefined;
    }
}

// Gunakan event 'timeupdate' untuk memeriksa beat secara real-time
let lastProcessedBeat = undefined; // Variabel untuk melacak beat terakhir yang diproses

// ==== BAGIAN 4: MUSIK DENGAN TOMBOL ====
function initMusic() {
  const playButton = document.getElementById("playMusic");
  const bgMusic = document.getElementById("bgMusic");
  let isPlaying = false;

  playButton.addEventListener("click", () => {
    if (!isPlaying) {
      bgMusic.play()
        .then(() => {
            console.log("Musik diputar.");
            playButton.textContent = "⏸️";
            isPlaying = true;
            // Hentikan dulu interval lama jika ada (misalnya dari klik sebelumnya)
            if (photoIntervalId) clearInterval(photoIntervalId);
            // Mulai memeriksa beat secara real-time
            bgMusic.addEventListener('timeupdate', () => checkBeatAndShowPhoto(bgMusic));
            // Mulai interval beat sync (ini opsional, bisa diganti hanya dengan timeupdate)
            // startPhotoBeatSync();
            // Untuk presisi lebih tinggi, kita bisa gunakan hanya timeupdate dan lastProcessedBeat
            // Jadi kita gunakan timeupdate dan lastProcessedBeat di atas.
            hideAllPhotos(); // Sembunyikan dulu saat mulai
            currentPhotoIndex = -1; // Reset index saat play
        })
        .catch(e => {
            console.error("Gagal memutar musik:", e);
            alert("Gagal memutar musik. Silakan coba lagi.");
        });
    } else {
      bgMusic.pause();
      console.log("Musik dijeda.");
      playButton.textContent = "🎵";
      isPlaying = false;
      stopPhotoBeatSync(); // Hentikan interval
      // Hapus listener timeupdate agar tidak terus berjalan saat musik tidak diputar
      bgMusic.removeEventListener('timeupdate', () => checkBeatAndShowPhoto(bgMusic));
    }
  });

  bgMusic.addEventListener("ended", () => {
      console.log("Musik selesai.");
      playButton.textContent = "🎵";
      isPlaying = false;
      stopPhotoBeatSync();
      bgMusic.removeEventListener('timeupdate', () => checkBeatAndShowPhoto(bgMusic));
  });
}

// ==== BAGIAN 5: JALANKAN SEMUA ====
window.addEventListener("DOMContentLoaded", () => {
  initHamster();
  initMusic();
  hideAllPhotos(); // foto disembunyikan dari awal
});
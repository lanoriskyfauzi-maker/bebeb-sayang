document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audio = new Audio('assets/puki.mp3');

  // === Update Jumlah Lilin ===
  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  // === Tambah Lilin pada Posisi Klik ===
  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  // ---------------------------
  //     CLICK vs DOUBLE CLICK
  // ---------------------------
  let clickTimeout = null;

  // Single Click = tambah lilin
  cake.addEventListener("click", function (event) {
    if (clickTimeout !== null) return;

    clickTimeout = setTimeout(() => {
      const rect = cake.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      addCandle(left, top);
      clickTimeout = null;
    }, 200); // waktu tunggu untuk cek double-click
  });

  // Double Click = tiup semua lilin
  cake.addEventListener("dblclick", function () {
    clearTimeout(clickTimeout);
    clickTimeout = null;

    candles.forEach((candle) => {
      candle.classList.add("out"); // hilangkan api
    });

    updateCandleCount();
    setTimeout(function () {
      triggerConfetti();
      endlessConfetti();
      audio.play();
    }, 200);
  });

});

// === KONFETI ===
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function endlessConfetti() {
  setInterval(function () {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0 }
    });
  }, 1000);
}


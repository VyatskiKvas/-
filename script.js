const flame = document.getElementById("flame");
const frames = ["./images/bigger_flame.png", "./images/smaller_flame.png"];
const blowed = "./images/candle_blowed.png";
let candle_blowed = false;

let i = 0;
let blowed_atAll = false;

function animateFlame() {
  if (!blowed_atAll) {
    i = (i + 1) % frames.length;
    flame.src = frames[i];
  }
  setTimeout(animateFlame, 300);
}

animateFlame();

// Доступ к микрофону
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      if (volume > 60 && !blowed_atAll) {
        blowed_atAll = true;
        flame.src = blowed;
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  })
  .catch((err) => {
    console.error("Ошибка доступа к микрофону: ", err);
  });

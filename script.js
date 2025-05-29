document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    const greeting = document.getElementById("greeting");
    const numberOfCandles = 3; // You can change this number as needed
    const cakeTopEdgeY = 20; // Y position of the top edge of the white layer
    const cakeCenterX = 125; // X position of the center of the cake
    const cakeTopEdgeWidth = 180; // Width of the top edge of the white layer

    let candles = [];
    let audioContext;
    let analyser;
    let microphone;

    function addCandle(x) {
        const candle = document.createElement("div");
        candle.className = "candle";

        // Position the candle along the top edge of the white layer
        candle.style.left = x + "px";
        candle.style.top = cakeTopEdgeY + "px";

        const flame = document.createElement("div");
        flame.className = "flame";
        candle.appendChild(flame);

        cake.appendChild(candle);
        candles.push(candle);
    }

    // Add candles evenly along the top edge of the white layer
    for (let i = 0; i < numberOfCandles; i++) {
        const x = cakeCenterX - cakeTopEdgeWidth / 2 + (i * cakeTopEdgeWidth) / (numberOfCandles - 1);
        addCandle(x);
    }

    function isBlowing() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        let average = sum / bufferLength;

        return average > 40; // Adjust this value based on testing
    }

    function blowOutCandles() {
        let allBlownOut = true;

        if (isBlowing()) {
            candles.forEach((candle) => {
                if (!candle.classList.contains("out")) {
                    candle.classList.add("out");
                }
            });
        }

        candles.forEach((candle) => {
            if (!candle.classList.contains("out")) {
                allBlownOut = false;
            }
        });

        if (allBlownOut) {
            greeting.style.display = "block";
        }
    }

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function (stream) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;
                setInterval(blowOutCandles, 200);
            })
            .catch(function (err) {
                console.log("Unable to access microphone: " + err);
            });
    } else {
        console.log("getUserMedia not supported on your browser!");
    }
});

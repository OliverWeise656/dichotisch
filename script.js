const audioFiles = [
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Motorrad.mp3?v=1722454550892',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Ofenrohr.mp3?v=1722454551212',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Patenkind.mp3?v=1722454551495',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Pinselstrich.mp3?v=1722454551801',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Regenschirm.mp3?v=1722454552120',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Rollschuhe.mp3?v=1722454552489',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Schlafanzug.mp3?v=1722454552804',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Teddybaer.mp3?v=1722454553087',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Vogelnest.mp3?v=1722456993302',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Weihnachtsbaum.mp3?v=1722454553370',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Zauberstab.mp3?v=1722454553688',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Lattenzaun.mp3?v=1722454549955',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Leberwurst.mp3?v=1722454550264',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Lippenstift.mp3?v=1722454550566',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Kuechenherd.mp3?v=1722454549610',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Kinderlied.mp3?v=1722454549299',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Kerzenlicht.mp3?v=1722454548943',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Hagelkorn.mp3?v=1722454548612',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Fensterglas.mp3?v=1722454548271',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Feigenbaum.mp3?v=1722454547939',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Eisenbahn.mp3?v=1722454547664',
  'https://cdn.glitch.global/2818a9ba-7792-48bf-8908-a680661eb578/Bienenkorb.mp3?v=1722454547320'
];

function getRandomItems(arr, n) {
  const shuffled = arr.slice(0);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled.slice(0, n);
}

let leftScore = 0;
let rightScore = 0;
let trialCount = 0;
let selectedPairs = [];

document.getElementById('startButton').addEventListener('click', function() {
  selectedPairs = getRandomItems(audioFiles, 20); // Ändere 10 auf 20, um 10 Paare auszuwählen
  startTrial();
});

function startTrial() {
  const audioLeftUrl = selectedPairs[trialCount * 2];
  const audioRightUrl = selectedPairs[trialCount * 2 + 1];

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  function loadAudio(url, callback) {
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(data => audioContext.decodeAudioData(data, buffer => callback(buffer)));
  }

  loadAudio(audioLeftUrl, function(bufferLeft) {
    loadAudio(audioRightUrl, function(bufferRight) {
      const sourceLeft = audioContext.createBufferSource();
      sourceLeft.buffer = bufferLeft;
      const leftGain = audioContext.createGain();
      leftGain.gain.value = 1.0;
      const leftPanner = audioContext.createStereoPanner();
      leftPanner.pan.value = -1.0;

      const sourceRight = audioContext.createBufferSource();
      sourceRight.buffer = bufferRight;
      const rightGain = audioContext.createGain();
      rightGain.gain.value = 1.0;
      const rightPanner = audioContext.createStereoPanner();
      rightPanner.pan.value = 1.0;

      sourceLeft.connect(leftGain).connect(leftPanner).connect(audioContext.destination);
      sourceRight.connect(rightGain).connect(rightPanner).connect(audioContext.destination);

      sourceLeft.start();
      sourceRight.start();

      document.getElementById('startButton').style.display = 'none';
      document.getElementById('testSection').style.display = 'block';
    });
  });
}

document.getElementById('submitButton').addEventListener('click', function() {
  const word1 = document.getElementById('word1').value.trim().toLowerCase();
  const word2 = document.getElementById('word2').value.trim().toLowerCase();
  
  const correctLeftWord = selectedPairs[trialCount * 2].split('/').pop().split('.')[0].toLowerCase();
  const correctRightWord = selectedPairs[trialCount * 2 + 1].split('/').pop().split('.')[0].toLowerCase();

  if (word1 === correctLeftWord || word2 === correctLeftWord) leftScore++;
  if (word1 === correctRightWord || word2 === correctRightWord) rightScore++;

  trialCount++;

  document.getElementById('word1').value = '';
  document.getElementById('word2').value = '';

  if (trialCount < 10) { // Ändere 5 auf 10, um 10 Paare abzuspielen
    startTrial();
  } else {
    document.getElementById('testSection').style.display = 'none';
    document.getElementById('resultText').textContent = `Ihr Gesamtergebnis ist: ${leftScore} Punkt(e) für das linke Ohr und ${rightScore} Punkt(e) für das rechte Ohr von insgesamt 10 Paaren`;
    document.getElementById('resultSection').style.display = 'block';

    setTimeout(() => {
      generatePDF(leftScore, rightScore);
    }, 2000);
  }
});

function generatePDF(leftScore, rightScore) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];
  const formattedTime = date.toTimeString().split(' ')[0];
  const fileName = `Dichotisch_${formattedDate}_${formattedTime.replace(/:/g, '-')}.pdf`;

  // Schriftgröße für Überschrift setzen
  doc.setFontSize(16);
  doc.text("Dichotisches Hören", 10, 10);

  // Schriftgröße für den restlichen Text setzen
  doc.setFontSize(12);
  doc.text(`Ihr Gesamtergebnis ist:`, 10, 20);
  doc.text(`Linkes Ohr: ${leftScore} Punkt(e) von insgesamt 10 Paaren`, 10, 30);
  doc.text(`Rechtes Ohr: ${rightScore} Punkt(e) von insgesamt 10 Paaren`, 10, 40);
  
  // Zeitstempel hinzufügen
  doc.text(`Datum: ${formattedDate}`, 10, 50);
  doc.text(`Uhrzeit: ${formattedTime}`, 10, 60);

  // PDF speichern
  doc.save(fileName);

  document.getElementById('finalMessage').style.display = 'block';
}
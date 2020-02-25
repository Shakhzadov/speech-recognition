// Speech to text
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

// Text to speech
const synth = window.speechSynthesis;

const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
let voices;
const icon = document.querySelector('img.fa.fa-microphone');
let paragraph = document.createElement('p');
let container = document.querySelector('.text-box');
container.appendChild(paragraph);
const sound = document.querySelector('.sound');

icon.addEventListener('click', () => {
    document.querySelector('img.fa.fa-microphone').src = './speak.png';
    sound.play();
    voices = synth.getVoices();
    console.log(voices);
    dictate();
});
const dictate = voices => {
  recognition.start();
  recognition.onresult = event => {
      const speechToText = event.results[0][0].transcript;
      paragraph.textContent = paragraph.textContent.concat(' ', speechToText);
      if(event.results[0].isFinal) {
          document.querySelector('img.fa.fa-microphone').src = './dontSpeak.png';
          if (speechToText.includes('what is the time')) {
              speak(getTime);
          } else if (speechToText.includes('what is today\'s date')) {
              speak(getDate);
          } else if (speechToText.includes('what is the weather in')) {
              getTheWeather(speechToText);
          } else {
              speak(() => speechToText);
          }
      }
  };
};

const speak = action => {
    const utterThis = new SpeechSynthesisUtterance(action());
    utterThis.voice = voices[27];
    synth.speak(utterThis);
};

const getTime = () => {
  const time = new Date(Date.now());
  return `the time is ${time.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}`;
};

const getDate = () => {
    const time = new Date(Date.now());
    return `today is ${time.toLocaleDateString()}`;
};

const getTheWeather = speech => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`)
        .then(function(response){
            return response.json();
        })
        .then(function(weather){
            if (weather.code === '404') {
                let utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
                synth.speak(utterThis);
                return;
            }
            let utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
            synth.speak(utterThis);
        });
};





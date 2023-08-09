'use client'


function speak(text: string, locale: string) {
    let voice = new SpeechSynthesisUtterance();
    voice.text = text;
    voice.volume = 1;
    voice.rate = 1;
    voice.pitch = 1;
    voice.lang = locale;
    window.speechSynthesis.speak(voice);
}

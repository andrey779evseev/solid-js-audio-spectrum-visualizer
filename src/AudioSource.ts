import { createSignal } from 'solid-js'

(function() {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	if (window.AudioContext) {
		window.audioContext = new window.AudioContext();
	}
	var fixAudioContext = function (e) {
		if (window.audioContext) {
			// Create empty buffer
			var buffer = window.audioContext.createBuffer(1, 1, 22050);
			var source = window.audioContext.createBufferSource();
			source.buffer = buffer;
			// Connect to output (speakers)
			source.connect(window.audioContext.destination);
			// Play sound
			if (source.start) {
				source.start(0);
			} else if (source.play) {
				source.play(0);
			} else if (source.noteOn) {
				source.noteOn(0);
			}
		}
		// Remove events
		document.removeEventListener('touchstart', fixAudioContext);
		document.removeEventListener('touchend', fixAudioContext);
	};
	// iOS 6-8
	document.addEventListener('touchstart', fixAudioContext);
	// iOS 9
	document.addEventListener('touchend', fixAudioContext);
})();

const [rawData, setRawData] = createSignal<number[]>([])
const [isPlaying, setIsPlaying] = createSignal<boolean>(false)
const [intervalId, setIntervalId] = createSignal<number | null>(null)
const [currentAudioUrl, setCurrentAudioUrl] = createSignal<string>('/Audio.mp3')
const [isLoading, setIsLoading] = createSignal<boolean>(false)

let source: any

export const startFromFile = async () => {
  const res = await fetch(currentAudioUrl())
  const byteArray = await res.arrayBuffer()

  const context = new window.AudioContext()
  const audioBuffer = await context.decodeAudioData(byteArray)

  source = context.createBufferSource()
  source.buffer = audioBuffer

  const analyzer = context.createAnalyser()
  analyzer.fftSize = 64

  source.connect(analyzer)
  analyzer.connect(context.destination)
  source.start()
  setIsLoading(false)

  const bufferLength = analyzer.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const update = () => {
    analyzer.getByteFrequencyData(dataArray)
    const orig = Array.from(dataArray)
    setRawData([[...orig].reverse(), orig].flat())
    requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

export {
  rawData,
  isPlaying,
  intervalId,
  setIntervalId,
  setIsPlaying,
  setRawData,
  source,
  setCurrentAudioUrl,
  currentAudioUrl,
  isLoading,
  setIsLoading
}



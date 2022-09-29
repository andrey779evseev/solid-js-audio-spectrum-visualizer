import { createSignal } from 'solid-js'

const [rawData, setRawData] = createSignal<number[]>([])
const [isPlaying, setIsPlaying] = createSignal<boolean>(false)
const [intervalId, setIntervalId] = createSignal<number | null>(null)
const [currentAudioUrl, setCurrentAudioUrl] = createSignal<string>('/Audio.mp3')

let source: any

export const startFromFile = async () => {
  const res = await fetch(currentAudioUrl())
  const byteArray = await res.arrayBuffer()

  const context = new AudioContext()
  const audioBuffer = await context.decodeAudioData(byteArray)

  source = context.createBufferSource()
  source.buffer = audioBuffer

  const analyzer = context.createAnalyser()
  analyzer.fftSize = 64

  source.connect(analyzer)
  analyzer.connect(context.destination)
  source.start()

  const bufferLength = analyzer.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const update = () => {
    analyzer.getByteFrequencyData(dataArray)
    const orig = Array.from(dataArray)
    setRawData([[...orig].reverse(), orig].flat())
  }
  setIntervalId(setInterval(update, 50))
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
  currentAudioUrl
}

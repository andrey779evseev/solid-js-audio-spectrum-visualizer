import { createSignal } from 'solid-js'

const [rawData, setRawData] = createSignal<number[]>([])
const [isPlaying, setIsPlaying] = createSignal<boolean>(false)
const [isContinue, setIsContinue] = createSignal<boolean>(true)
const [currentAudioUrl, setCurrentAudioUrl] = createSignal<string>('/Audio.mp3')
const [isLoading, setIsLoading] = createSignal<boolean>(false)

let source: AudioBufferSourceNode

export const startFromFile = async () => {
  try {
    const res = await fetch(currentAudioUrl())
    console.log('res', res);
    
    const byteArray = await res.arrayBuffer()
    console.log('byte arr', byteArray);
    
    var context;
    if (typeof AudioContext !== "undefined") {
        context = new AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
        context = new webkitAudioContext();
    }
    const audioBuffer = await context.decodeAudioData(byteArray)
  
    source = context.createBufferSource()
    source.buffer = audioBuffer
  
    const analyzer = context.createAnalyser()
    analyzer.fftSize = 64
  
    source.connect(analyzer)
    analyzer.connect(context.destination)
    console.log('source', source);
    
    source.start()
    console.log(source.buffer, audioBuffer);
    
    setIsLoading(false)
  
    const bufferLength = analyzer.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
  
    const update = () => {
      analyzer.getByteFrequencyData(dataArray)
      const orig = Array.from(dataArray)
      console.log('orig', orig);
      
      setRawData([[...orig].reverse(), orig].flat())
      if(isContinue())
        requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  } catch (err) {
    console.error(err);
  }
}

export {
  rawData,
  isPlaying,
  isContinue,
  setIsContinue,
  setIsPlaying,
  setRawData,
  source,
  setCurrentAudioUrl,
  currentAudioUrl,
  isLoading,
  setIsLoading
}



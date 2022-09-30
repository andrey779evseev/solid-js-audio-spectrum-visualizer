import { interpolateInferno, interpolateSinebow } from 'd3'
import { Component } from 'solid-js'
import {
  currentAudioUrl,
  isLoading,
  isPlaying,
  rawData,
  setCurrentAudioUrl,
  setIsContinue,
  setIsLoading,
  setIsPlaying,
  setRawData,
  source,
  startFromFile
} from './AudioSource'
import RadialGraph from './components/RadialGraph'
import playIcon from './assets/play.png'
import pauseIcon from './assets/pause.png'
import uploadIcon from './assets/upload.png'

const App: Component = () => {
  const playPause = () => {
    if (!currentAudioUrl) return
    if (isPlaying()) {
      source.stop()
      setIsContinue(false)
      setIsPlaying(false)
      setRawData([])
    } else {
      setIsPlaying(true)
      setIsLoading(true)
      startFromFile()
    }
  }

  const onFileUpload = (e: any) => {
    setCurrentAudioUrl(window.URL.createObjectURL(e.target.files[0]))
  }

  return (
    <div class='w-full h-screen z-10'>
      {rawData().length !== 0 && (
        <svg
          width='100%'
          height='100%'
          viewBox='-100 -100 200 200'
          preserveAspectRatio='xMidYMid meet'
        >
          <RadialGraph color={interpolateSinebow} scale={1} />
          <RadialGraph color={interpolateInferno} scale={0.5} />
        </svg>
      )}
      <div
        class={`fixed bottom-4 left-auto right-auto flex flex-col w-full items-center z-20 ${
          !currentAudioUrl && 'cursor-not-allowed'
        }`}
      >
        <div
          onClick={playPause}
          class='bg-indigo-500/50 h-12 hover:bg-indigo-500 w-1/6 rounded-lg flex justify-center items-center cursor-pointer'
        >
          {
            isLoading() ?
            'loading...' :
            <img
              src={isPlaying() ? pauseIcon : playIcon}
              class='w-12 h-12 inline'
            /> 
          }
        </div>
        <div class='bg-indigo-500/50 h-12 hover:bg-indigo-500 w-1/6 rounded-lg mt-4 relative cursor-pointer'>
          <div class='w-full h-full flex justify-center items-center'>
            <img src={uploadIcon} class='w-12 h-12 inline' />
          </div>
          <input
            type='file'
            class='opacity-0 w-full h-full absolute top-0 left-0 z-30'
            onChange={onFileUpload}
          />
        </div>
      </div>
    </div>
  )
}

export default App

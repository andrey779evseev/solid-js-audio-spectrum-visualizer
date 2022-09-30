import { destructure } from '@solid-primitives/destructure'
import { arc } from 'd3'
import { createMemo, Index, splitProps, type Component } from 'solid-js'
import { rawData } from '../AudioSource'

const arcBuilder = arc()

type PropsType = {
  color: (value: number) => string
  scale: number
}

const RadialGraph: Component<PropsType> = props => {
  const { color, scale } = destructure(props)

  const computed = createMemo(() => {
    const data = rawData()

    const total = data.reduce((a, v) => a + v, 0)

    const highCount = data.filter(d => d > 32).length
    const intensity = highCount / data.length

    const paths: {
      path: string
      color: string
    }[] = []

    const range = 1.0 + intensity
    const rangeInRadians = range * Math.PI
    const startAngle = -(rangeInRadians / 2)
    let currentAngle = startAngle

    for (const d of data) {
      const angle = rangeInRadians * (d / total)
      const path = arcBuilder({
        innerRadius: 50 - ((d + 10) / 255) * 35,
        outerRadius: 50 + ((d + 10) / 255) * 35,
        startAngle: currentAngle,
        endAngle: currentAngle + angle
      })!
      paths.push({
        path,
        color: color()(d / 255)
      })
      currentAngle += angle
    }
    return { paths, intensity }
  })

  return (
    <g transform={`scale(${(computed().intensity * scale()) / 4 + 1})`}>
      <Index each={computed().paths}>
        {p => <path d={p().path} fill={p().color} />}
      </Index>
    </g>
  )
}

export default RadialGraph

import { type ConnectionLineComponentProps, getSmoothStepPath } from "reactflow"

export function ConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }: ConnectionLineComponentProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  })

  return (
    <g>
      <path
        style={connectionLineStyle}
        className="animated-path"
        d={edgePath}
        fill="none"
        strokeWidth={2}
        stroke="#3b82f6"
        strokeDasharray="5,5"
      />
      <circle cx={toX} cy={toY} fill="#3b82f6" r={4} strokeWidth={1.5} />
    </g>
  )
}

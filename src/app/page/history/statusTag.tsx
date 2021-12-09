import { Tag } from 'antd'

const STATUS_COLOR: Record<string, number[]> = {
  success: [20, 224, 65],
  pending: [212, 177, 6],
  error: [215, 35, 17],
  failed: [215, 35, 17],
}

const StatusTag = ({ tag }: { tag: string }) => {
  const setColorTag = (opacity?: number) => {
    let color = STATUS_COLOR[tag]
    return `rgba(${color[0]},  ${color[1]}, ${color[2]},${opacity || 1})`
  }

  return (
    <Tag
      style={{
        margin: 0,
        borderRadius: 4,
        color: setColorTag(),
        textTransform: 'capitalize',
      }}
      color={setColorTag(0.1)}
    >
      {tag}
    </Tag>
  )
}

export default StatusTag

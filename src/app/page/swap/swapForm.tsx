import { Card } from 'antd'
import Swap from 'app/components/swap'

const SwapForm = () => {
  return (
    <Card bordered={false} className="card-swap">
      <Swap onChange={() => {}} />
    </Card>
  )
}

export default SwapForm

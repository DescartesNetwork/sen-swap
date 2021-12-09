import { Button, Space, Typography } from 'antd'
import { Fragment, ReactNode } from 'react'
import IonIcon from 'shared/antd/ionicon'

const SwitchPriceRate = ({
  value = false,
  onChange = () => {},
  priceRate = <Fragment />,
}: {
  priceRate?: ReactNode
  value?: boolean
  onChange?: (value: boolean) => void
}) => {
  return (
    <Space size={4}>
      <Button
        type="text"
        onClick={() => onChange(!value)}
        shape="circle"
        icon={<IonIcon name="swap-horizontal-outline" />}
      />
      <Typography.Text>{priceRate}</Typography.Text>
    </Space>
  )
}
export default SwitchPriceRate

import { Fragment, ReactNode } from 'react'

import { Avatar, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

const RouteAvatar = ({
  icons = ['', ''],
  size = 24,
  defaultIcon = <IonIcon size={size} name="help-outline" />,
}: {
  icons?: (string | undefined)[]
  defaultIcon?: ReactNode
  size?: number
}) => {
  return (
    <Space>
      {icons?.map((icon, idx) => (
        <Fragment key={idx}>
          <Avatar src={icon} size={size}>
            {defaultIcon}
          </Avatar>
          {icons.length > idx + 1 && <IonIcon name="chevron-forward-outline" />}
        </Fragment>
      ))}
    </Space>
  )
}
export default RouteAvatar

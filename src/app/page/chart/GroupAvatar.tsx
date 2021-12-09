import { ReactNode } from 'react'

import { Avatar, AvatarProps } from 'antd'
import IonIcon from 'shared/ionicon'

const GroupAvatar = ({
  icons = [],
  defaultIcon = <IonIcon name="help-outline" />,
  ...rest
}: {
  icons?: (string | undefined)[]
  defaultIcon?: ReactNode
} & AvatarProps) => {
  return (
    <Avatar.Group>
      {icons?.map((iconURI, idx) => (
        <Avatar
          src={iconURI}
          key={idx}
          style={{ backgroundColor: '#2D3355', border: 'none' }}
          {...rest}
        >
          {defaultIcon}
        </Avatar>
      ))}
    </Avatar.Group>
  )
}

export default GroupAvatar

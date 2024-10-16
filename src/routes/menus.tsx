import { HomeOutlined } from '@ant-design/icons'

interface IRoute {
  path: string
  name: string
  icon?: React.ReactNode
  hideInMenu?: boolean
}

export const ROUTE_KEY = {
  HOME: 'home',
  MY: 'my',
  PAGE_404: 'p404'
}

export const ROUTE_CONFIG: Record<string, IRoute> = {
  [ROUTE_KEY.HOME]: {
    path: 'home',
    name: '首页',
    icon: <HomeOutlined />
  },
  [ROUTE_KEY.MY]: {
    path: 'my',
    name: '个人信息',
    icon: <HomeOutlined />,
    hideInMenu: true
  },
  [ROUTE_KEY.PAGE_404]: {
    path: '*',
    name: '404',
    hideInMenu: true
  }
}

export const routes = Object.keys(ROUTE_CONFIG).map((key) => ({
  ...ROUTE_CONFIG[key],
  key
}))

export const getRouteByKey = (key: string): IRoute => ROUTE_CONFIG[key]

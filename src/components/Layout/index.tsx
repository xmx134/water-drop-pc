import { useUserContext } from '@/hooks/userHooks'
import style from './index.module.less'
import { MenuDataItem, ProLayout } from '@ant-design/pro-components'
import { useNavigate, useOutlet } from 'react-router'
import { ROUTE_KEY, routes } from '@/routes/menus'
import { Link } from 'react-router-dom'
import { AUTH_TOKEN } from '@/utils/constants'
import { useGoTo } from '@/hooks'
import { Space } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'

const menuItemRender = (item: MenuDataItem, dom: React.ReactNode) => (
  <Link to={item.path || ''}>{dom}</Link>
)

/**
 * 外层框架
 */
const Layout = () => {
  const outlet = useOutlet()
  const { store } = useUserContext()
  const nav = useNavigate()
  const { go } = useGoTo()

  const logoutHandler = () => {
    sessionStorage.setItem(AUTH_TOKEN, '')
    localStorage.setItem(AUTH_TOKEN, '')
    nav('/login')
  }

  return (
    <ProLayout
      layout="mix"
      siderWidth={130}
      avatarProps={{
        src: store.avatar || null,
        title: store.tel,
        size: 'small',
        onClick: () => go(ROUTE_KEY.MY)
      }}
      links={[
        <Space size={20} onClick={logoutHandler}>
          <LogoutOutlined />
          退出
        </Space>
      ]}
      title="清风明月"
      className={style.container}
      onMenuHeaderClick={() => nav('/')}
      route={{ path: '/', routes }}
      menuItemRender={menuItemRender}
    >
      {outlet}
    </ProLayout>
  )
}

export default Layout

// import { useState, useEffect } from 'react'

import { Button } from 'antd'
import style from './index.module.less'
import { useUserContext } from '@/hooks/userHooks'
import { useGoTo } from '@/hooks'
import { ROUTE_KEY } from '@/routes/menus'

/**
 *
 */
const Home = () => {
  const { store } = useUserContext()
  console.log('store', store)
  const { go } = useGoTo()
  return (
    <div className={style.container}>
      <Button onClick={() => go(ROUTE_KEY.MY)}>去个人中心</Button>
    </div>
  )
}

export default Home

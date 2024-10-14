// import { useState, useEffect } from 'react'

import style from './index.module.less'
import { useUserContext } from '@/hooks/userHooks'

/**
 *
 */
const Home = () => {
  const { store } = useUserContext()
  console.log('store', store)
  return <div className={style.container}>首页</div>
}

export default Home

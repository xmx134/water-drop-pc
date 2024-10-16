import { useQuery } from '@apollo/client'
import { connectFactory, useAppContext } from '../utils/contextFactory'
import { GET_USER } from '../graphql/user'
import { IUser } from '../utils/types'
import { useLocation, useNavigate } from 'react-router'

const KEY = 'userInfo'
const DEFAULT_VALUE = {}
export const useUserContext = () => useAppContext(KEY)

export const connect = connectFactory(KEY, DEFAULT_VALUE)

// 获取用户信息，并将用户信息存入store
export const useGetUser = () => {
  const { setStore } = useUserContext()
  const location = useLocation()
  const nav = useNavigate()
  const { loading, refetch } = useQuery<{ getUserInfo: IUser }>(GET_USER, {
    onCompleted: (data) => {
      if (data.getUserInfo) {
        const { id, name, tel, desc, avatar } = data.getUserInfo
        setStore({
          id,
          name,
          tel,
          desc,
          avatar,
          refetchHandler: refetch
        })
        if (location.pathname.startsWith('/login')) {
          nav('/')
        }
        return
      }
      setStore({
        refetchHandler: refetch
      })
      if (location.pathname !== '/login') {
        nav(`/login?orgUrl = ${location.pathname}`)
      }
    },
    onError: () => {
      if (location.pathname !== '/login') {
        setStore({
          refetchHandler: refetch
        })
        nav(`/login?orgUrl = ${location.pathname}`)
      }
    }
  })
  return { loading }
}

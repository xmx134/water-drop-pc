import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { AUTH_TOKEN } from './constants'
// 创建httplink
const httpLink = createHttpLink({
  uri: '//localhost:3000/graphql'
})
// 注册登录link
const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  defaultContext: {
    watchQuery: {
      fetchPolicy: 'no-cache'
    }
  },
  cache: new InMemoryCache({
    addTypename: false
  })
})

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import './index.css'
import { client } from './utils/apollo.ts'
import { routes } from './routes/menus.tsx'
import UserInfo from './components/UserInfo'
import Layout from '@/components/Layout/index.tsx'
import Login from './containers/Login/index.tsx'
import { ROUTE_COMPONENT } from './routes/index.tsx'

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <UserInfo>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            {routes.map((item) => {
              const Component = ROUTE_COMPONENT[item.key]
              return (
                <Route
                  path={item.path}
                  key={item.key}
                  element={<Component />}
                ></Route>
              )
            })}
          </Route>
        </Routes>
      </UserInfo>
    </BrowserRouter>
  </ApolloProvider>
)

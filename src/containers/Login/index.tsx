import { LockOutlined, MobileOutlined } from '@ant-design/icons'
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText
} from '@ant-design/pro-components'
import { message, theme } from 'antd'
// import type { CSSProperties } from 'react'
// import { useState } from 'react'

import styles from './index.module.less'
import { useMutation } from '@apollo/client'
import { LOGIN, SEND_CODE_MSG } from '../../graphql/auth'
import { AUTH_TOKEN } from '../../utils/constants'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { useTitle } from '@/hooks'

// type LoginType = 'phone' | 'account'

// const iconStyles: CSSProperties = {
//   color: 'rgba(0, 0, 0, 0.2)',
//   fontSize: '18px',
//   verticalAlign: 'middle',
//   cursor: 'pointer'
// }

interface IValue {
  tel: string
  code: string
  autoLogin: boolean
}

const Page = () => {
  const [run] = useMutation(SEND_CODE_MSG)
  const [login] = useMutation(LOGIN)
  const [params] = useSearchParams()
  const nav = useNavigate()

  useTitle('登录')

  const loginHandler = async (values: IValue) => {
    const res = await login({
      variables: values
    })
    if (res.data.login.code === 200) {
      if (values.autoLogin) {
        sessionStorage.setItem(AUTH_TOKEN, '')
        localStorage.setItem(AUTH_TOKEN, res.data.login.data)
      } else {
        localStorage.setItem(AUTH_TOKEN, '')
        sessionStorage.setItem(AUTH_TOKEN, res.data.login.data)
      }
      message.success(res.data.login.message)
      nav(params.get('orgUrl') || '/')
      return
    }
    message.error(res.data.login.message)
  }

  const { token } = theme.useToken()
  return (
    <div className={styles.container}>
      <LoginFormPage
        onFinish={loginHandler}
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        logo="https://github.githubassets.com/favicons/favicon.png"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="Github"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)'
        }}
        subTitle="全球最大的代码托管平台"
      >
        {
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: (
                  <MobileOutlined
                    style={{
                      color: token.colorText
                    }}
                    className={'prefixIcon'}
                  />
                )
              }}
              name="tel"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！'
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！'
                }
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText
                    }}
                    className={'prefixIcon'}
                  />
                )
              }}
              captchaProps={{
                size: 'large'
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'获取验证码'}`
                }
                return '获取验证码'
              }}
              phoneName="tel"
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！'
                }
              ]}
              onGetCaptcha={async (tel: string) => {
                const res = await run({
                  variables: {
                    tel
                  }
                })
                if (res.data.sendCodeMessage.code === 200) {
                  message.success(res.data.login.message)
                } else {
                  message.error(res.data.login.message)
                }
              }}
            />
          </>
        }
        <div
          style={{
            marginBlockEnd: 24
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right'
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginFormPage>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  )
}

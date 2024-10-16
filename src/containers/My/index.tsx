// import { useUserContext } from '@/hooks/userHooks'
// import style from './index.module.less'
import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { Col, Form, message, Row } from 'antd'
import OSSImageUpload from '@/components/OSSImageUpload'
import { useEffect, useRef } from 'react'
import { useUserContext } from '@/hooks/userHooks'
import { useMutation } from '@apollo/client'
import { UPDATE_USER } from '@/graphql/user'

/**
 *
 */
const My = () => {
  const formRef = useRef<ProFormInstance>()
  const { store } = useUserContext()

  const [updateUser] = useMutation(UPDATE_USER)

  useEffect(() => {
    if (!store.tel) return
    formRef.current?.setFieldsValue({
      tel: store.tel,
      name: store.name,
      desc: store.desc,
      avatar: {
        url: store.avatar
      }
    })
  }, [store])
  return (
    <div>
      <PageContainer>
        <ProForm
          formRef={formRef}
          layout="horizontal"
          submitter={{
            resetButtonProps: {
              style: {
                display: 'none'
              }
            }
          }}
          onFinish={async (values) => {
            console.log(values)
            const res = await updateUser({
              variables: {
                id: store.id,
                params: {
                  name: values.name,
                  desc: values.desc,
                  avatar: values.avatar[0]?.url || ''
                }
              }
            })
            if (res.data.updateUserInfo.code === 200) {
              message.success(res.data.updateUserInfo.message)
              store.refetchHandler()
              console.log(store)
            } else {
              message.error(res.data.updateUserInfo.error)
            }
          }}
        >
          <Row gutter={20}>
            <Col>
              <ProFormText
                name="tel"
                label="tel"
                tooltip="不能修改"
                disabled
              ></ProFormText>
              <ProFormText
                name="name"
                label="昵称"
                placeholder="请输入昵称"
              ></ProFormText>
              <ProFormTextArea
                name="desc"
                label="简介"
                placeholder="请输入简介信息"
              ></ProFormTextArea>
            </Col>
            <Col>
              <Form.Item label="更改头像" name="avatar">
                <OSSImageUpload />
              </Form.Item>
            </Col>
          </Row>
        </ProForm>
      </PageContainer>
    </div>
  )
}

export default My

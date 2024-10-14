/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useMemo, useState, useContext } from 'react'
import { IPropChild } from './types.ts'

interface IStore<T> {
  key: string
  store: T
  setStore: (payload: Partial<T>) => void
}

// 这段代码是一个 JavaScript 函数定义，名为 “getCxtProvider”。
// 这个函数接收三个参数：“key”（字符串类型）、“defaultValue”（类型为泛型 T）、
// “AppContext”（一个 React 的 Context 对象，上下文类型为 “IStore<T>”）。
// 函数内部返回一个函数，这个内部函数接收一个参数 “{children}”，其类型为 “IPropChild”。
// 在这个内部函数中，首先使用 “useState” 初始化一个状态变量 “store”，其初始值为 “defaultValue”，
// 同时定义了一个用于更新 “store” 的函数 “setStore”。
// 接着，使用 “useMemo” 创建一个值，这个值是一个包含 “key”、“store” 和更新函数 “setStore” 的对象。
// 更新函数 “setStore” 接收一个参数 “payload”（默认为一个空对象），
// 它通过将当前状态 “state” 与 “payload” 合并来更新 “store”。
// 最后，这个内部函数返回一个 “AppContext.Provider” 组件，将之前创建的值作为其 “value” 属性，
// 并将传入的 “children” 渲染在其中。
// 总的来说，这个函数的作用可能是创建一个提供上下文值的组件函数，用于在 React 应用中管理和传递特定的数据。
function getCxtProvider<T>(
  key: string,
  defaultValue: T,
  AppContext: React.Context<IStore<T>>
) {
  return ({ children }: IPropChild) => {
    const [store, setStore] = useState(defaultValue)
    const value = useMemo(
      () => ({
        key,
        store,
        setStore: (payload = {}) =>
          setStore((state) => ({
            ...state,
            ...payload
          }))
      }),
      [store]
    )

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
  }
}

const cxtCache: Record<string, Cxt> = {}

class Cxt<T = any> {
  defaultStore: IStore<T>

  AppContext: React.Context<IStore<T>>

  Provider: ({ children }: IPropChild) => JSX.Element

  constructor(key: string, defaultValue: T) {
    this.defaultStore = {
      key,
      store: defaultValue,
      setStore: () => {}
    }
    this.AppContext = createContext(this.defaultStore)
    this.Provider = getCxtProvider(key, defaultValue, this.AppContext)
    cxtCache[key] = this
  }
}

export function useAppContext<T>(key: string) {
  const cxt = cxtCache[key] as Cxt<T>
  const app = useContext(cxt.AppContext)
  return {
    store: app.store,
    setStore: app.setStore
  }
}

export function connectFactory<T>(key: string, defaultValue: T) {
  const cxt = cxtCache[key]
  let CurCxt: Cxt<T>
  if (cxt) {
    CurCxt = cxt
  } else {
    CurCxt = new Cxt<T>(key, defaultValue)
  }

  return (Child: React.FunctionComponent<any>) => (props: any) =>
    (
      <CurCxt.Provider>
        <Child {...props} />
      </CurCxt.Provider>
    )
}

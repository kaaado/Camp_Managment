import React from 'react'
import FormComp from '../../components/Form/FormComp'
import { LOGIN } from '../../api/api'

export default function Login() {
    const loginData=['mail','password']
  return (
    <>
        <FormComp dataInput={loginData} type="login" endApi={LOGIN} />
    </>
  )
}

import React from 'react'
import FormComp from '../../components/Form/FormComp'
import { REGISTER } from '../../api/api'

export default function Register() {
    const registerData=['name','mail','password']
  return (
    <>
        <FormComp dataInput={registerData} type="register" endApi={REGISTER} />
    </>
  )
}

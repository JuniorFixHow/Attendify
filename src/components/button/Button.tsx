import React from 'react';
import './button.css';
type buttonProp={
    text:string,
    isError?:boolean,
    onPress?:(e:React.FormEvent<HTMLElement>)=>void
}
const Button = ({text, onPress, isError}:buttonProp) => {
  return (
    <button className={ isError ? 'button-e':'button'} onClick={onPress} >{text}</button>
  )
}

export default Button
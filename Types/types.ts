import React from "react"

export interface cardProps {
    isAttendance: boolean,
    isScannedSuccess: boolean,
    isScannedError: boolean,
    title:string,
    label:string,
    duration?: string,
    headerTitle:string,
    onChange?:any,
    onPress?:()=>{},
    isFinger?:boolean
}

export type registerProps={
    password:number,
    cpassword?:number,
    onChangeRegister:React.Dispatch<React.SetStateAction<number>>,
    onChageCRegister:React.Dispatch<React.SetStateAction<number>>,
    onShowRegister:React.Dispatch<React.SetStateAction<boolean>>,
    showRegister:boolean,
    onPress:()=>void,
    registerError?:string,
    setRegisterError:React.Dispatch<React.SetStateAction<string>>,
    registerSuccess?:string,
    setRegisterSuccess:React.Dispatch<React.SetStateAction<string>>,
    setRegisterLoading:React.Dispatch<React.SetStateAction<boolean>>,
    registerLoading?:boolean,
    labelText1:string,
    labelText2?:string,
    showConfirm?:boolean
}
export type loginProps={
    lpassword:number,
    onChangeLogin:React.Dispatch<React.SetStateAction<number>>,
    onShowLogin:React.Dispatch<React.SetStateAction<boolean>>,
    showLogin:boolean,
    onPress:()=>void,
    loginError?:string,
    setLoginError:React.Dispatch<React.SetStateAction<string>>,
    loginSuccess?:string,
    setLoginSuccess:React.Dispatch<React.SetStateAction<string>>,
    setLoginLoading:React.Dispatch<React.SetStateAction<boolean>>,
    loginLoading?:boolean,
}

export type sessionProp = {
    id:string,
    code:string,
    lecID:number,
    ongoing:boolean,
    reward:number,
    start:string,
    end:string,
    list:number[],
    students:{sID:number, time:string}[],
    position:{lat:number, long:number}
}

  
export type SessionListProps = {
    sessionP?: sessionProp[];
  };

export type sessionProps = {
    id:string,
    code:string,
    lecID:number,
    ongoing:boolean,
    reward:number,
    start:string,
    end:string,
    list:number[],
    students:{sID:number, time:string}[],
    position:{lat:number, long:number}
}

export type userProps={
    sID:number,
    device:string,
    dPin:number,
    isFinger:boolean
}

export type attendanceProps={
    id:number,
    time:Date
}[]
export type NotiProps={
    id:string,
    title:string,
    end:string,
    start:string,
    body:string,
    read:boolean,
}[]
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
    password:string,
    cpassword:string,
    onChangeRegister:React.Dispatch<React.SetStateAction<string>>,
    onChageCRegister:React.Dispatch<React.SetStateAction<string>>,
    onShowRegister:React.Dispatch<React.SetStateAction<boolean>>,
    showRegister:boolean,
    onPress:()=>void
}
export type loginProps={
    lpassword:string,
    onChangeLogin:React.Dispatch<React.SetStateAction<string>>,
    onShowLogin:React.Dispatch<React.SetStateAction<boolean>>,
    showLogin:boolean,
    onPress:()=>void
}

export type sessionProp = {
    id:number,
    title:string,
    ongoing:boolean,
    withinRange:boolean
}

export type userProps={
    sId:number,
    device:string,
    pin:number,
    biometric:boolean
}
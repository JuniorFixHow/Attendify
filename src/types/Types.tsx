export type userProps ={
    lecID:number,
    pin:number
}

export type sessionProps={
    id:string,
    code:string,
    lecID:number,
    ongoing:boolean,
    start:string,
    end:string,
    students:{id: 0, time:Date}[],
    reward:number,
    list:number[],
}[]
export type courseProps={
    code:string,
    lecID:number,
    title:boolean,
}[]
export type studentProps={
    sID:number,
    dPin:number,
    device:string,
    isFinger:boolean
}[]
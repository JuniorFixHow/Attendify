export type userProps ={
    lecID:number,
    pin:number
}

export type sessionProps={
    code:string,
    lecID:number,
    ongoing:boolean,
    start:string,
    end:string,
    student:string[],
    reward:number
}
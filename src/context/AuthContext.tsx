import { ReactNode, createContext, useEffect, useReducer } from "react"
import { AuthReducer } from "./AuthReducer";
// JSON.parse(localStorage.getItem("user")) || 
type childrenProp={
    children:ReactNode
}

const INITIAL_STATE ={
    user:JSON.parse(localStorage.getItem("user")) ||  null,
    loading: false,
    error:null
}
// localStorage.clear()
export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}:childrenProp)=>{
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(()=>{
        localStorage.setItem('user', JSON.stringify(state.user))
    }, [state.user])

    return(
        <AuthContext.Provider
            value={{
                user: state.user,
                loading:state.loading,
                error: state.error,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
import { ReactNode, createContext, useEffect, useReducer } from "react"
import { AuthReducer } from "./AuthReducer";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    useEffect(()=>{
        localStorage.setItem('user', JSON.stringify(state.user));
        if(state.user){
            navigate('/');
        }
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
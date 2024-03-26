import React, { useContext, useState } from 'react'
import Button from '../../components/button/Button'
import Header from '../../components/header/Header'
import './login.css'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { userProps } from '../../types/Types'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'

const Login = () => {
    const {dispatch, loading, error} = useContext(AuthContext);
    const navigate = useNavigate();
    const [data, setData] = useState<userProps>({lecID:0, pin:0});

    const handleTextChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setData(pre=>({
            ...pre,
            [e.target.name]:parseInt(e.target.value, 10)
        }))
    }
    // console.log(data)
    // console.log(typeof(data.lecID))
    // console.log(data.lecID.toString().length, data.pin.toString().length)
    const handleLogin = async(e:React.FormEvent<HTMLElement>)=>{
        e.preventDefault();
        dispatch({type:'LOGIN_START'})
        if(data.lecID.toString().length < 4 || data.pin.toString().length <4 ){
            dispatch({type:'LOGIN_FAILED', payload: 'Please enter correct ID and pin'})
        }else{
            try {
                // const lecRef = doc(db, 'Lecturers', data.lecID.toString());
                const q = query(collection(db, "Lecturers"), where("lecID", "==", data.lecID));
                const lecturer = await getDocs(q);
                if(lecturer.empty){      
                    dispatch({type:'LOGIN_FAILED', payload: 'Login failed'})
                }else if(lecturer.docs[0].data().pin !== data.pin){    
                    dispatch({type:'LOGIN_FAILED', payload: 'Login failed'})
                }
                else {
                    dispatch({type:'LOGIN_SUCCESS', payload: lecturer.docs[0].data()});
                    navigate('/');
                }
            } catch (error) {
                dispatch({type:'LOGIN_FAILED', payload: 'Login failed'})    
            }
        }
        // navigate('/register')
    }
  return (
    <div className='login' >
        <Header title='Welcome, Lecturer' isTitle />
        <form onSubmit={handleLogin} className="login-container">
            <span className="mini-header">Login</span>
            <div className="input-container">
                <span className="label">Staff ID</span>
                <input name='lecID' onChange={handleTextChange} maxLength={8}  min={0} type="number" placeholder='enter staff ID' className='input' />
            </div>
            <div className="input-container">
                <span className="label">Pin</span>
                <input name='pin' onChange={handleTextChange} type="number" maxLength={5}  min={0} placeholder='enter pin' className='input' />
            </div>
            {
                error && <span className="error">{error}</span>
            }
           
            <Button onPress={handleLogin} text={loading?'Loading...':'Login'} />
        </form>
    </div>
  )
}

export default Login
import React, { useContext, useRef, useState } from 'react'
import Button from '../../components/button/Button'
import Header from '../../components/header/Header'
import './register.css'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc, } from 'firebase/firestore'
import {db} from '../../../firebase'
import { AuthContext } from '../../context/AuthContext'

type registerProps ={
    lecID:number,
    title:string,
    code:string
}
const Register = () => {
    const {user} = useContext(AuthContext);

    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [data, setData] = useState<registerProps>({
        lecID:0,
        title:'',
        code:'',
    })
    const handleTextChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setData(pre=>({
            ...pre, [e.target.name]:e.target.value,
            lecID:user.lecID
        }))
    }
    const handleRegister = async(e:React.FormEvent<HTMLElement>)=>{
        e.preventDefault();
        setError('');
        setSuccess('')
        setLoading(true);
        if(data.code!=='' && data.title!==''){

            try {
                const regRef = doc(db, 'Courses', data.code);
                const course = await getDoc(regRef);
                if(course.exists()){
                    setError('This course already been registered by another lecturer. Contact them to delete it so you can register it.')
                }
                else{
                    await setDoc(regRef, data);
                    setSuccess('Course added!')
                }
            } catch (error) {
                console.log(error);
                setError('Error occured adding course. Retry');
            }finally{
                setLoading(false);
                formRef.current?.reset();
            }
        }else{
            setError('Complete the form');
            setLoading(false);
        }
        
        // navigate('/sessions');
    }
  return (
    <div className='login' >
        <Header title='Add Course' isTitle />
        <form ref={formRef} onSubmit={handleRegister} className="login-container">
            <span className="mini-header">Add new course</span>
            <div className="input-container">
                <span className="label">Course code</span>
                <input onChange={handleTextChange} name='code' type="text" placeholder='enter course code' className='input' />
            </div>
            <div className="input-container">
                <span className="label">Course title</span>
                <input onChange={handleTextChange} name='title' type="text"  placeholder='enter course title' className='input' />
            </div>
            {
                error && <span className='error' >{error}</span>
            }
            {
                success && <span className='succ' >{success}</span>
            }
            <Button onPress={handleRegister} text={loading? 'Loading...':'Submit'} />
            {
                success &&
                <Button onPress={()=>navigate('/')} text='Go to dashboard' />
            }
        </form>
    </div>
  )
}

export default Register
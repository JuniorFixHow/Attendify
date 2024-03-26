import React, { ChangeEvent, ChangeEventHandler, useContext, useEffect, useRef, useState } from 'react'
import Button from '../../components/button/Button'
import Header from '../../components/header/Header'
import './new.css'
import { sessionProps } from '../../types/Types'
import { AuthContext } from '../../context/AuthContext'
import { addDoc,  collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'

type newProps ={
    showNew:boolean,
    setShowNew:React.Dispatch<React.SetStateAction<boolean>>
}

const NewSession = ({showNew, setShowNew}:newProps) => {
    const {user} = useContext(AuthContext);
    const formRef = useRef<HTMLFormElement | null>(null);

    const [code, setCode] = useState<string>('')
    const [reward, setReward] = useState<number>(0)
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [courses, setCourses] = useState([]);
  

    useEffect(()=>{
        const fetchCourses = async()=>{
            const sessionRef = collection(db, "Courses")
            const q = query(sessionRef, where("lecID", "==", user.lecID));
            const mycourses = await getDocs(q);
            const list = []
            if(!mycourses.empty){
                mycourses.forEach((doc)=>{
                    list.push(doc.data());
                })
                setCourses(list);
            }
        }
        fetchCourses();
        
    },[])
    // console.log(courses)

    useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
            },
            error => {
              setError(error.message);
            }
          );
        } else {
          setError('Geolocation is not supported by this browser.');
        }
    }, []);

    // console.log(longitude, latitude);

    const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
      const selectedStartDate = event.target.value;
      setStartDate(selectedStartDate);
  
      // Calculate minimum end date
      const minEndDate = new Date(new Date(selectedStartDate).getTime() + 10 * 60000)
        .toISOString()
        .slice(0, 16);
      setEndDate(minEndDate);
    };


    const handlesession = async(e:React.FormEvent<HTMLElement>)=>{
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        const data = {
            reward, code, start:startDate, end:endDate, lecID:user.lecID,
            ongoing:true, student:[], position:{
                long:longitude, lat:latitude
            }
        }
        try {
            const sessionRef = collection(db, "Sessions")
            const q = query(sessionRef, where("code", "==", code), where("ongoing", "==", true));
            const sessions = await getDocs(q)
            if(sessions.empty){
                await addDoc(collection(db, 'Sessions'), data);
                setSuccess('Session created!');
                setError('');
                formRef.current?.reset();
            }
            else{
                setSuccess('');
                setError("There's already an ongoing session for this course. You have to wait for it to end or cancel it.");
            }
        } catch (error) {
            setError('Error occured creating a session. Retry.');
            console.log(error)
        }finally{
            setLoading(false);
        }
    }

    
    // console.log(new Date('2024-03-24T16:45'));

  return (
    <div className='session' >
        <form ref={formRef} onSubmit={handlesession} className="session-container">
            <span className="mini-header">New session</span>
            <div className="input-container">
                <span className="label">Choose course</span>
                <select  onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>setCode(e.target.value)} name='code' className='input' >
                    <option defaultChecked value="">--</option>
                    {
                        courses.length > 0 ?
                        courses.map(course=>(
                            <option value={course?.code} key={course?.code} >{course?.code}</option>
                        ))
                        :
                        <option className="lebel">Loading courses...</option>
                    }
                </select>
                {/* <input maxLength={8} minLength={8} min={0} type="number" placeholder='enter staff ID' className='input' /> */}
            </div>
            <div className="input-container">
                <span className="label">Starting time</span>
                <input onChange={handleStartDateChange} min={new Date().toISOString().slice(0, 16)} type='datetime-local' placeholder='time to begin' className='input' />
            </div>
            <div className="input-container">
                <span className="label">Ending time</span>
                <input min={endDate} value={endDate} onChange={(e:ChangeEvent<HTMLInputElement>)=>setEndDate(e.target.value)} type='datetime-local'  placeholder='time to end' className='input' />
            </div>

            <div className="input-container">
                <span className="label">Reward</span>
                <input onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setReward(parseInt(e.target.value, 10))} name='reward' type="number" maxLength={3} min={0} placeholder='marks available for this session' className='input' />
            </div>
            {
                error && <span className="error">{error}</span>
            }
            {
                success && <span className="succ">{success}</span>
            }
            <div className="input-wrapper">
                <div className="left">
                    <Button onPress={handlesession} text={loading?'Loading...':'Proceed'} />
                </div>
                <div className="left">
                    <Button isError onPress={()=>setShowNew(false)} text='Cancel' />
                </div>
            </div>
        </form>
    </div>
  )
}

export default NewSession
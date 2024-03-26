import Header from '../../components/header/Header';
import './session.css';
import { IoClose } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaClock } from "react-icons/fa";
import { SessionRecords } from '../../data/dummy';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../../../firebase';
import { sessionProps } from '../../types/Types';
import moment from 'moment';


const Session = () => {
    const {sessionId} = useParams();
    const [session, setSession] = useState<React.Dispatch<React.SetStateAction<sessionProps>>|null>(null)
    const [remainingTime, setRemainingTime] = useState('');

    const {state} = useLocation();
    // console.log(state)
    useEffect(()=>{

        const unsub = onSnapshot(doc(db, "Sessions", sessionId), (doc:unknown) => {
        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        // console.log(source, " data: ", doc.data());
            setSession(doc.data())
        });
        return()=>{
            unsub()
        }
    },[])
   


    // Your future date
    // console.log(state.end)
    useEffect(() => {
        const futureDate = new Date(state.end);
        
        const timerInterval = setInterval(() => {
            const now = new Date();
            if(futureDate > now){

                const timeDiff = futureDate - now;
                  // Calculate the remaining time
                  const seconds = Math.floor((timeDiff / 1000) % 60);
                  const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
                  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
            
                  // Format the remaining time as hh:mm:ss
                  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    // console.log(formattedTime);
                    setRemainingTime(formattedTime);
                    if(formattedTime === '00:00:02'){
                        // setRemainingTime('00:00:02');
                        setIsOver(true);
                        const sessionRef = doc(db, 'Sessions', sessionId);
                        updateDoc(sessionRef, {ongoing:false})
                        console.log('hello');
                        return () => clearInterval(timerInterval);
                }
            }
        
            }, 1000);
        
            return () => clearInterval(timerInterval);
        
      }, []);

    const navigate = useNavigate();
    const [isOver, setIsOver] = useState<boolean>(false);
    const cancelSession =async()=>{
        setIsOver(true);
        // setRemainingTime('00:00:02');
        try {        
            const sessionRef = doc(db, 'Sessions', sessionId);
            await updateDoc(sessionRef, {ongoing:false})
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(new Date(state.end)<new Date())
  return (
    <div className='home' >
        <Header isTitle title='Attendance Dashboard' />
        <span className="time">{session && session.ongoing && remainingTime}</span>
        
        {
            (session?.ongoing || remainingTime === '') && !isOver &&
            <>
                <div className="top">
                    <span className="mini-header">Attendance Records</span>
                    <div className="top-right">
                        {
                            session?.ongoing &&
                            <IoClose onClick={cancelSession} className='dash-icon' color='crimson' />
                        }
                        <div className="search-container">
                            <CiSearch size={24} />
                            <input type="text" placeholder='search by date' className='search-input' />
                        </div>
                    </div>
                </div>
            
                {
                    SessionRecords.map(item=>(
                        <div key={item.id} className="down">
                            <span className='label' >{item.sID}</span>
                    
                            <span className="label">{item.time}</span>
                    </div>
                ))}
            </>
        }
   
          
        
        {
            isOver &&
            <>
            <div className="session-over">
                <span className="time">Session Over</span>
                <div onClick={()=>navigate('/')} className="over">
                    <FaClock color='#0D004F' size={30} />
                    <span className="over-text">Go to records</span>
                </div>
            </div>
            </>
        }
       
    </div>
  )
}

export default Session
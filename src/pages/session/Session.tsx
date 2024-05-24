import Header from '../../components/header/Header';
import './session.css';
import { IoClose } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaClock } from "react-icons/fa";
import { SessionRecords } from '../../data/dummy';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Timestamp, addDoc, collection, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../../../firebase';
import { sessionProps, studentProps } from '../../types/Types';
import { IoFolderSharp } from "react-icons/io5";
import {CSVLink} from 'react-csv'

type csvType ={
    id:number, time:string, mark: number, 
}[]

const Session = () => {
    const headers = [
        {label:"ID", key:"id"},
        {label:"Time", key:"time"},
        {label:"Mark", key:"mark"},
    ]
    const {sessionId} = useParams();
    const [session, setSession] = useState<sessionProps >()
    const [remainingTime, setRemainingTime] = useState('');
    const [students, setStudents] = useState<studentProps>([]);
    const [csvData, setCsvData] = useState<csvType>([]);
    const [search, setSearch] = useState<string>('');

    const {state} = useLocation();
    
    // console.log(state)
    useEffect(()=>{
        if(sessionId){
            const unsub = onSnapshot(doc(db, "Sessions", sessionId), (doc:unknown) => {
            // const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            // console.log(source, " data: ", doc.data());
            const data = doc.data() as sessionProps;
            setSession(data);
            const csv: csvType = []
            data.students.filter(item=>item.id!==0).forEach((item)=>{
                const object = {
                    id:item.id, time:new Timestamp( item.time?.seconds, item.time?.nanoseconds).toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    mark:data.reward
                }
                csv.push(object as csvType[0] );
            })
              setCsvData(csv);  
            });
            return()=>{
                unsub()
            }
        }
    },[])
   
    // console.log(sessionId)

    useEffect(()=>{
        const fetchStudents = async()=>{
            const sessionRef = collection(db, "Students")
            // const q = query(sessionRef, where("lecID", "==", user.lecID));
            const mycourses = await getDocs(sessionRef);
            const list:studentProps = []
            if(!mycourses.empty){
                mycourses.forEach((doc)=>{
                    const data = doc.data() as studentProps[0]
                    list.push(data);
                })
                setStudents(list);
            }
        }
        fetchStudents();
    },[])

    // Your future date
    // console.log(new Date(state.end).toLocaleDateString([], {hour: '2-digit', minute:'2-digit'}))
    useEffect(() => {
        
        const futureDate = new Date(state.end);
        const timerInterval = setInterval(() => {
            const now = new Date();
            if((futureDate > now) && state.ongoing){

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
                        updateDoc(sessionRef, {ongoing:false});
                        students.forEach(async(student)=>{
                            await addDoc(collection(db, 'Students', student.sID.toString(), 'Notifications'),{
                                title:`Attendance Ended`, body:`Attendance for ${session.code} has ended`,
                                start:session.start, end: new Date().toString(), read: false
                            })
                        })
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
            if(sessionId && session){
                const sessionRef = doc(db, 'Sessions', sessionId);
                await updateDoc(sessionRef, {ongoing:false});
                const futureDate = new Date(session?.end);
                const now = new Date();
                if(futureDate > now ){    
                    students.forEach(async(student)=>{
                        await addDoc(collection(db, 'Students', student.sID.toString(), 'Notifications'),{
                            title:`Attendance Canceled`, body:`Attendance for ${session.code} has been canceled`,
                            start:session.start, end: new Date().toString(), read: false
                        })
                    })
                }
            }    
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(new Date(state.end)<new Date())
    // console.log(session)
  return (
    <div className='home' >
        <Header isTitle title='Attendance Dashboard' />
        <span className="time">{session && session.ongoing && remainingTime}</span>
        
        {
            (session?.ongoing || remainingTime === '') && !isOver &&
            <>
                <div className="top">
                    <span className="mini-header">Attendance Records - {session?.code}</span>
                    <div className="top-right">
                        {
                            session?.ongoing &&
                            <IoClose onClick={cancelSession} className='dash-icon' color='crimson' />
                        }
                        {
                            csvData.length>0 &&
                            <CSVLink headers={headers} filename={session?.code+ ' '+ new Date(session?.start).toDateString()} data={csvData} >
                                <IoFolderSharp className='dash-icon' color='green' />
                            </CSVLink>
                        }
                        

                        <div className="search-container">
                            <CiSearch size={24} />
                            <input type="text" onChange={(e)=>setSearch(e.target.value)} placeholder='search by ID' className='search-input' />
                        </div>
                    </div>
                </div>
            
                {
                    session &&
                    session.students?.filter(student=>student.id !== 0)
                    .filter(sess=>{
                        return search === ''? sess : Object.values(sess)
                        .join(' ')
                        .toLowerCase() 
                        .includes(search.toLowerCase())})
                    .map(item=>(
                        <div key={item.id} className="down">
                            <span className='label' >{item.id}</span>
                    
                            <span className="label">{
                                new Timestamp( item.time?.seconds, item.time?.nanoseconds).toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                            }</span>
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
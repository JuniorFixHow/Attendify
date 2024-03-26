import Header from '../../components/header/Header';
import './home.css';
import { MdAddBox } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { AttendanceRecords } from '../../data/dummy';
import { IoFolderSharp } from "react-icons/io5";
import { HiMiniPrinter } from "react-icons/hi2";
import { RiDeleteBin5Fill } from "react-icons/ri";
import NewSession from '../../components/new/New';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import { AuthContext } from '../../context/AuthContext';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { sessionProps } from '../../types/Types';
import { FaPenToSquare } from "react-icons/fa6";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Home = () => {
    const navigate = useNavigate();
    const [showNew, setShowNew] = useState<boolean>(false);
    const {dispatch, user} = useContext(AuthContext);
    const [showCourses, setShowCourses] = useState<boolean>(false)

    const [sessions, ssetSessions] = useState([])
    const [courses, setCourses] = useState([])
    useEffect(()=>{
      
        const reference = collection(db, 'Sessions');
        // const q = query(reference, where('creator', '==', u))
        const unsub = onSnapshot(
            reference,  (snapshot)=>{
                let list = [];
                snapshot.docs.forEach((doc)=>{
                    list.push({id:doc.id, ...doc.data()})
                })
                // console.log(list)
                ssetSessions(list);
                
            },
            (error)=>{
                console.log(error)
            },
        )
        // user && unsub();
        return()=>{
            unsub()
        }
    },[])
    useEffect(()=>{
      
        const reference = collection(db, 'Courses');
        const q = query(reference, where('lecID', '==', user.lecID))
        const unsub = onSnapshot(
            q,  (snapshot)=>{
                let list = [];
                snapshot.docs.forEach((doc)=>{
                    list.push({id:doc.id, ...doc.data()})
                })
                // console.log(list)
                setCourses(list);
                
            },
            (error)=>{
                console.log(error)
            },
        )
        // user && unsub();
        return()=>{
            unsub()
        }
    },[])

    const handleNew =async()=>{
        if(showCourses){
            navigate('/register')
        }
        else{
            const sessionRef = collection(db, "Courses")
            const q = query(sessionRef, where("lecID", "==", user.lecID));
            const mycourses = await getDocs(q);
            if(mycourses.empty){
                navigate('/register')
            }
            else{
                setShowNew(true)
            }
        }
    }

    const deleteData = async(id:string, path:string)=>{
        try {
            await deleteDoc(doc(db, path, id));
        } catch (error) {  
            console.log(error)          
        }
    }

  return (
    <div className='home' >
        <Header isTitle title='Attendance Dashboard' />
        {
            !showNew &&
            <>
            <div className="top">
                <span className="mini-header">{showCourses? 'Your course(s)':'Attendance Records'}</span>
                <div className="top-right">
                    {
                        showCourses ? 
                        <FaPenToSquare onClick={()=>setShowCourses(false)} className='dash-icon' color='#0d004f' />:
                        <FaBookOpen onClick={()=>setShowCourses(true)} className='dash-icon' color='#0d004f' />
                    }
                    <MdAddBox onClick={handleNew} className='dash-icon' color='#0D004F' />
                    <div className="search-container">
                        <CiSearch size={24} />
                        <input type="text" placeholder='search by date' className='search-input' />
                    </div>

                    <IoMdLogOut onClick={()=>dispatch({type:'LOGOUT'})} className='dash-icon' color='#0D004F' />
                </div>
            </div>
            {
                showCourses &&
                <>
                    {
                    courses.length>0 ?
                    courses?.map(item=>(
                        <div key={item?.code} className="down">
                        <div className="top-leftt">
                            <span>{item?.code}</span>
                        </div>
                        <div className="top-right">
                            <RiDeleteBin5Fill onClick={()=>deleteData(item.id, 'Courses')} className='dash-icon' color='crimson' />
                        </div>
                    </div>

                    ))
                    :
                    <span className="mini-header">No Data</span>
                }
                </>
            }
            {
                !showCourses &&
                <>
                {
                    sessions.length>0 ?
                    sessions?.map(item=>(
                        <div key={item?.id} className="down">
                        <div onClick={()=>navigate(`/sessions/${item.id}`, {state:{end:item.end}})} className="top-left">
                            <span>{new Date(item?.start).toDateString()}</span>
                        </div>
                        <div className="top-right">
                            {
                                item.ongoing &&
                                <AiOutlineInfoCircle size={24} color='red' />
                            }
                            <IoFolderSharp className='dash-icon' color='green' />
                            <HiMiniPrinter className='dash-icon' color='#0D004F' />
                            <RiDeleteBin5Fill onClick={()=>deleteData(item.id, 'Sessions')} className='dash-icon' color='crimson' />
                        </div>
                    </div>

                    ))
                    :
                    <span className="mini-header">No Data</span>
                }
                </>
            }

            </>
        }
        {
            showNew && !showCourses &&
            <>
            <div className="newtop">
                <span className="mini-header">Create new attendance session</span>
            </div>
            <NewSession setShowNew={setShowNew} showNew={showNew} />
            </>
        }
    </div>
  )
}

export default Home
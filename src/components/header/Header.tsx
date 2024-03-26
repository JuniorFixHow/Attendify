import './header.css';
import UG from '../../assets/ug.png';

type headerProps={
    title:string,
    isTitle:boolean
}
const Header = ({title, isTitle}:headerProps) => {
  return (
    <div className='header' >
        <img className='header-img' src={UG} alt="" />
        {
            isTitle &&
            <span className="header-title">{title}</span>
        }
    </div>
  )
}

export default Header
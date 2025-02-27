import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function Google(){
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(()=>{
        const now = new Date();
        localStorage.setItem('debug', 'true');
        localStorage.setItem('access', searchParams.get('access'))
        localStorage.setItem('refresh', searchParams.get('refresh'))
        localStorage.setItem('username', searchParams.get('username'));
        localStorage.setItem('expiry', `${now.getTime()+60*60*1000}`); //* time in milliseconds
        navigate('/getting-started?signup=true');
    },[searchParams.get('access')])

    return (
        <>Redirecting...</>
    )
}
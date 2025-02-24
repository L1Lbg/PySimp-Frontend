import { useToast } from "@/components/toast-provider";
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";

export default function Activate(){
    const { showError } = useToast();
    const { uid, token } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        fetch(
            `${localStorage.getItem('api_url')}/authentication/manage/users/activation/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid, token }),
            }
        )
        .then(
            res => {
                if (res.ok) {
                    navigate('/getting-started?signup=true')
                } else {
                    throw "Failed to activate user"
                }
            }
        )
        .catch(
            error => {
                showError(error)
            }
        )
    },[])

    return <>Redirecting...</>
}
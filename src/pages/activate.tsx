import { useToast } from "@/components/toast-provider";
import { useEffect } from "react"
import { useParams } from "react-router-dom";

export default function Activate(){
    const { showError } = useToast();
    const { uid, token } = useParams();
    useEffect(() => {
        fetch(
            `${import.meta.env.VITE_API_URL}/authentication/manage/users/activation/`,
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
                    window.location.href = '/auth'
                } else {
                    throw new Error("Failed to activate user")
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
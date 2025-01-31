import { useState } from "react"
import { SkipForward, X } from "lucide-react"

export default function Tutorials(props:any){

    const [index, setIndex] = useState(0)

    if(index != -1){
        return (

            <div className='absolute z-10 p-2 rounded-lg shadow-lg bg-purple-600 w-full md:w-1/2 xl:w-1/3'>
                <span className='flex items-center'>
                    <button 
                        className={`p-2 ${index === props.tutorials.length - 1 ? 'bg-red-500' : 'bg-black'} rounded-lg m-2`} 
                        onClick={() => {
                                if (index === props.tutorials.length - 1){
                                    setIndex(-1)
                                } else {
                                    setIndex(index + 1)
                                }
                            }
                        }
                    >
                        {
                            index === props.tutorials.length - 1 ? <X/> : <SkipForward/>
                        }
                    </button>
                    
                    <b className='text-xl'>{`${index+1}/${props.tutorials.length} ${props.tutorials[index].text}`}</b>
                </span>
                <img className='rounded-lg w-full' src={props.tutorials[index].img}/>
            </div>
        )       
    } else {
        props.onend()
        return <></>
    }
    
}
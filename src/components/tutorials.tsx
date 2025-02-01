import { useState } from "react"
import { SkipForward, X } from "lucide-react"

export default function Tutorials(props:any){

    const [index, setIndex] = useState(0)

    if(index != -1){
        return (

                <div style={props?.style} id={props?.id} className={`absolute z-50 p-2 rounded-lg shadow-lg bg-purple-600 w-full md:w-1/2 xl:w-1/3 ${props.hidden == true ? 'hidden' : ''}`}>
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
                <p className="m-2 ml-5 text-gray-300">
                    {props.tutorials[index].description}
                </p>
                {
                    props.tutorials[index].img && 
                    <img 
                        src={props.tutorials[index].img} 
                        alt={props.tutorials[index].text} 
                        className="w-full object-cover"
                    />
                }
            </div>
        )       
    } else {
        props?.onend()
        return <></>
    }
    
}
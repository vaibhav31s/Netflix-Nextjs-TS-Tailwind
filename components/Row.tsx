import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { Movie } from "../typing";
import Thumbnail from "./Thumbnail";

interface Props {
    title: string;
    Movies: Movie[];
}
const Row = ({title, Movies}: Props) => {


    // const[scrollX, setScrollX] = useState(0)
    // const handleLeftArrow = () => {
    //     let x = scrollX + Math.round(window.innerWidth / 2);
    //     if(x > 0){
    //         x = 0;
    //     }
    //     setScrollX(x)
    // }
    // const handleRightArrow = () => {
    //     let x = scrollX - Math.round(window.innerWidth / 2);
    //     let listWidth = Movies.length * 150;

    //     if((window.innerWidth - listWidth) > x){
    //         x = (window.innerWidth - listWidth) - 60;
    //     }
    //     setScrollX(x)
    // }

    const [isMoved, setIsMoved] = useState(false);
    const rowRef = useRef<HTMLDivElement>(null);

    if(rowRef.current!= null){
        rowRef.current.addEventListener('scroll', () => {
            if(rowRef.current != null){
                if(rowRef.current.scrollLeft > 10){
                    setIsMoved(true);
                }else{
                    setIsMoved(false);
                }
            }
        })
    }
    const handleLeftArrow = () => {
        if(rowRef.current != null)
        {rowRef.current.scrollTo({
              top: 0,
              left: rowRef.current.scrollLeft - rowRef.current.clientWidth,
              behavior: 'smooth'
          });
        }
    }
    const handleRightArrow = () => {
        if(rowRef.current != null)
          {rowRef.current.scrollTo({
                top: 0,
                left: rowRef.current.scrollLeft +  rowRef.current.clientWidth,
                behavior: 'smooth'
            });
          }
    }

  return (
    <div className="h-40 space-y-0.5 md:space-y-2">
        <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl ">{title}</h2>
        <div className="group relative md:-ml-2 flex justify-between ">
            <ChevronLeftIcon onClick={handleLeftArrow} 
            className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${isMoved ?  ' ' : 'hidden'}`}/>
            
            
            
                <div ref={rowRef} className="flex space-x-0.5 items-center overflow-x-scroll scrollbar-hide md:space-x-2.5">
                   {Movies.map((movie) => (
                       <Thumbnail movie={movie}/>
                     ))}
                    
                </div>
            <ChevronRightIcon onClick={handleRightArrow} className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"/>
        </div>
    </div>
  )
}

export default Row
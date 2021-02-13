import React, { useEffect ,useState} from 'react';
import {MdSearch} from 'react-icons/md'
import './SearchInput.css'

function SearchInput({tasks,field,filteredArray}){

    const [searchField,setsearchField]= useState("")

useEffect(()=>{
    let newFilteredArray =[]
    if(searchField===''){
        filteredArray(tasks);
    }
    else{
        newFilteredArray= tasks.filter((item)=>{
        return item[field].includes(searchField);
        })
        filteredArray(newFilteredArray)
    }
},[tasks,field,searchField])

    return(
        <div className="search-container"> 
        <MdSearch className="search"/>
        <input onChange={(e)=>setsearchField(e.target.value)}  value={searchField}/> 
        </div>
    )

}

export default SearchInput;
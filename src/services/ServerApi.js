import axios from 'axios';

const _url='http://localhost:8080/api';

//get all tasks
export function serverGetTasks(){
    const url=`${_url}/task`
    return axios.get(url);
}

//get a specifit task by id
export function serverGetTaskById(id){
    const url=`${_url}/task/${id}`
    return axios.get(url);
}
//create new task
export function serverCreateTask(body){
    const url=`${_url}/task`
    return axios.post(url,body)
}
//update task by id
export function serverUpdateTask(body,id){
    const url=`${_url}/task/${id}`
    return axios.put(url,body)
}
//delete task by id
export function serverDeleteTask(id){
    const url=`${_url}/task/${id}`
    return axios.delete(url)
}



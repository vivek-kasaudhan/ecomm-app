import React ,{useState}from 'react'
import Layout from '../../components/layout/Layout'
import toast from "react-hot-toast";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


const ForgotPassword = () => {

const [email,setEmail] = useState('')
const [newpassword,setnewPassword] = useState('')
const [answer,setAnswer] = useState('')




const navigate  = useNavigate()




const handleSubmit= async(e)=>{
    e.preventDefault()
try{
    const res  = await axios.post('/api/v1/auth/forgot-password',{email,newpassword,answer})
    if(res.data.success){
        toast.success(res.data.message)
        navigate('/login')
        
    }else{
        toast.error(res.data.message)
    }
}catch(error){
    console.log(error)
    toast.error('something went wrong')
}
}


  return (
    <Layout title='forgot page'>
      <div className='register'>
         <h1>Reset password</h1>
         <form onSubmit={handleSubmit}>
 
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
            <input type="Email" value={email} onChange={(e)=>setEmail(e.target.value)} 
              className="form-control" required id="exampleInputEmail1" aria-describedby="emailHelp" />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" value={newpassword} onChange={(e)=>setnewPassword(e.target.value)}
             className="form-control" required id="exampleInputPassword1" />
         </div>
         <div className="mb-3">
           <label htmlFor="exampleInputPassword1" className="form-label">Enter your father name</label>
           <input type="text" value={answer} onChange={(e)=>setAnswer(e.target.value)} className="form-control" />
         </div>
          <button type="submit" className="btn btn-primary">Reset</button>
        </form>

        </div>

    </Layout>
  )
}

export default ForgotPassword
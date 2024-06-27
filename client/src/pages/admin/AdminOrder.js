import React,{useState,useEffect} from 'react'
import AdminMenu from '../../components/layout/AdminMenu'
import Layout from '../../components/layout/Layout'
import axios from 'axios'
import moment from 'moment'
import { useAuth } from '../../context/auth'
import { Select } from 'antd'


const {Option} = Select

const AdminOrder = () => {
  const[status,setStatus] = useState(["Not Process", "Processing", "Shipped", "delivered", "cancel"])
  const[changestatus,setchangeStatus] = useState('')
  const[auth,Setauth] =  useAuth()
const [orders, setorders] = useState([])

const getAllproduct  =  async()=>{
  try{
    const {data} =  await axios.get('/api/v1/auth/all-orders')
    setorders(data)

  }catch(error){
    console.log(error)
  }
}
useEffect(()=>{
if(auth?.token) getAllproduct()
},[auth?.token])

const handleChange = async(orderId,value)=>{
try{
const {data}=  await axios.put(`/api/v1/auth/order-status/${orderId}`,{
  status:value
})
setStatus(value)
getAllproduct()
}catch(error){
  console.log(error)

}
}

  return (
    <Layout>
    <div className='row'>
        <div className='col-md-4'>
            <AdminMenu/>
        </div>
        <div className='col-md-8'>
         <h2 className='text-center'>Displaying all Ordered product</h2>
         {orders?.map((o,i)=>{
                      return (
                        <div className='border shadow'>
                          <table className="table">
                          <thead>
                           <tr>
                            <th scope="col">#</th>
                            <th scope="col">Status</th>
                            <th scope="col">Buyer</th>
                            <th scope="col"> date</th>
                            <th scope="col">Payment</th>
                            <th scope="col">Quantity</th>
                          </tr>
                          </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                        <Select
                          
                          onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                        >
                          {status?.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                        </td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createAt).fromNow()}</td>
                        <td>{o?.payment.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {o?.products?.map((p, i) => (
                      <div className="row mb-2 p-3 card flex-row" key={p._id}>
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                            width="150px"
                            height={"150px"}
                          />
                        </div>
                        <div className="col-md-8">
                          <p>{p.name}</p>
                          <p>{p.description.substring(0, 30)}</p>
                          <p>Price : {p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                        </div>
                      )
                    }
                      
                    )}
        </div>
    </div>
    </Layout>
  )
}

export default AdminOrder
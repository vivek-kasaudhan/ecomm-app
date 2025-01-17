import React,{useState,useEffect} from 'react'

import Layout from '../../../components/layout/Layout.js';
import UserMenu from '../../../components/layout/UserMenu.js';
import axios from 'axios';
import { useAuth } from '../../../context/auth.js';
import moment from 'moment'


const Order = () => {
   const [auth,setAuth] =  useAuth()
  const [orders,setOrders] =  useState([])

  const getOrders = async(req,res)=>{
    try{
   const {data}=  axios.get('/api/v1/auth/orders')
   setOrders(data)

    }catch(error){
      console.log(error)
    }
  }
  useEffect(()=>{
    if(auth?.token) getOrders()
  },[auth?.token])
  return (
    <Layout>
        <div className='container-fluid m-3 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                <UserMenu />

                </div>
                <div className='col-md-9'>
                    <h1 className='center'>All orders</h1>
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
                        <td>{o?.status}</td>
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
                            width="100px"
                            height={"100px"}
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

        </div>
    </Layout>
  )
}

export default Order
import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import { useCart } from '../context/cart'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios'
import toast from 'react-hot-toast'

const Cart = () => {
    const[auth,setAuth] = useAuth()
    const[cart,setCart] =  useCart()
    const navigate  =  useNavigate()
    const[instance,setinstance] =  useState('')
    const[loading,setloading] =  useState(false)
    const[clientToken,setClienttoken] = useState('')

    // total price calculation

    const totalPrice  =  ()=>{
        try{
            let total = 0
            cart?.map(item=>total = total + item.price)
        //     return total.toLocaleString('en-us',{style:'currency',
        // currency:'USD'})
        return total

        }catch(error){
            console.log(error)
        }
    }

// delete or remove cart items
const removeCartItem =  async(pid)=>{
    try{
       const myCart  =  [...cart]
       let index  =  myCart.findIndex(item=>item._id===pid)
       myCart.splice(index,1)
       setCart(myCart)
       localStorage.setItem('cart',JSON.stringify(myCart))
    }catch(error){
        console.log(error)
    }
}

// get payment token
const getToken  =  async()=>{
    try{
  const {data} =  await axios.get('/api/v1/product/braintree/token')
  setClienttoken(data?.clientToken)
    }catch(error){console.log(error)}
}

const handlepayment = async()=>{
    try{
        setloading(false)
        const{nonce} =  await instance.requestPaymentMethod()
        const {data} = await axios.post('/api/v1/product/braintree/payment',{
            nonce,cart
        })
        setloading(false)
        localStorage.removeItem('cart')
        setCart([])
        navigate('/dashboard/user/orders')
        toast.success('payment completed successfully')
    }catch(error){
        setloading(false)
        console.log(error)
    }
}

useEffect(()=>{
    getToken()
},[auth?.token])

  return (
    <Layout>
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <h1 className='text-center bg-light p-2'>
                        {`Hello ${auth?.token && auth?.user?.name}`}
                    </h1>
                    <h4 className='text-center'>
                        {cart?.length > 1 ? `you have ${cart.length} items in your cart ${auth?.token ? '' 
                        :"please login to checkout"} `:'your cart is empty' }
                    </h4>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-8'>
                    {cart?.map((p)=>(
                        <div className='row m-2 card flex-row p-2'>
                           <div className='col-md-4'>
                              <img src={`/api/v1/product/product-photo/${p._id}`} className='card-img-top'
                               alt={p.name} width='100px'height='100px'/>
                           </div>
                           <div className='col-md-8'>
                            <h6>{p.name}</h6>
                            <p>{p.description.substring(0,30)}</p>
                            <h4>Price :  {p.price}</h4>
                            <button className='btn btn-primary' onClick={()=>removeCartItem(p._id)}> remove</button>
                           </div>
                        </div>
                    ))}
                     
                </div>
                <div className='col-md-4 text-center'> 
                
                <h2>Cart summary</h2>
                <p>total  | checkout |Payment</p>
                <hr/>
                <h4> Total :{totalPrice()}</h4>
                {auth?.user?.address ? (
                    <>
                    <div className='mb-3'>
                        <h4>Current Address</h4>
                        <h5>{auth?.user.address}</h5>
                        <button className='btn btn-outline-warning'
                        onClick={()=>navigate('/dashboard/user/profile')}
                         >UPDATE Address</button>
                    </div>
                    </>
                ):(auth?.token ? (
                    <button className='btn btn-outline-warning'
                        onClick={()=>navigate('/dashboard/user/profile')}
                     >UPDATE Address</button>
                ):(
                    <button onClick={()=>navigate('/login',
                    {state:"/cart",})}>please Login To checkout</button>
                ))}
                 <div className="mt-2">
              {!clientToken || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                    //   paypal: {
                    //     flow: "vault",
                    //   },
                    }}
                    onInstance={(instance) => setinstance(instance)}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={handlepayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Cart
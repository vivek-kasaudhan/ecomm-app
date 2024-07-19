import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import axios from 'axios'
import {Checkbox,Radio} from 'antd'
import { Prices } from '../components/Prices'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart'
import toast from 'react-hot-toast'

const Homepage = () => {

  const navigate  =  useNavigate()

  const[cart,setCart] =  useCart()
  
  const [products,setproducts] =  useState([])
  const[categories,setCategories] = useState([])
  const [checked,setChecked] = useState([])
  const[radio,setRadio] =  useState([])

  const[total,setTotal] =  useState(0)
  const[page,setPage] =  useState(1)
  const[loading,setLoading] = useState(false)






  //get total count
  const getTotal  =  async()=>{
    try{
      const {data} =  await axios.get('/api/v1/product/product-count')
      setTotal(data?.total)

    }catch(error){
      console.log(error)
    }
  }

 
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setproducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
   useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);



  //get all categories created
const getAllCategories =  async()=>{
  try{
      const res =  await axios.get('/api/v1/category/get-category')
     if(res.data.success){
      setCategories(res.data.category)
     }
  }catch(error){
      console.log(error)
      
  }
}
useEffect(()=>{
  getAllCategories()
  getTotal()
},[])

  const getAllproducts  =  async()=>{
    try{
      setLoading(true)
      const {data} =  await axios.get(`/api/v1/product/product-list/${page}`)
      setLoading(false)
      setproducts(data.products)

    }catch(error){
      setLoading(false)
      console.log(error)
    }
  }

useEffect(()=>{
  if(!checked.length || !radio.length) getAllproducts()
},[checked.length,radio.length])

//filter by category

const handleFilter = (value,id)=>{
  let checkall =  [...checked]
  if(value){
    checkall.push(id)
  }else{
    checkall = checkall.filter((c)=>c!==id)
  }
  setChecked(checkall)
}

//get filter product
const filterProduct =  async ()=>{
  try{
    const {data}=  await axios.post('/api/v1/product/product-filters',{checked,radio})

    setproducts(data.products)

  }catch(error){
    console.log(error)
  }
}

useEffect(()=>{
  if(checked || radio) filterProduct()
},[checked,radio])



  return (
    <Layout title='best offers trending'>
     <div className='row mt-3 m-3'>
      <div className='col-md-2 m-2 category-background'>
        <h5 className='text-center bg-dark text-white mt-2 rounded  p-2'>Filter by Category</h5>
      <div className='d-flex flex-column'>
      {categories.map((c)=>(
        <Checkbox key={c._id}   
          onChange={(e) => handleFilter(e.target.checked, c._id)}  >
              {c.name}
        </Checkbox>
      ))}
      </div>
      
      <h5 className='text-center bg-dark text-white rounded mt-2  p-2'>Filter by Prices</h5>
      <div className='d-flex flex-column'>
        <Radio.Group onChange={(e)=>setRadio(e.target.value)}>
         {Prices.map((price)=>(
          <div key={price._id}>
          <Radio value={price.array}>{price.name}</Radio>
          </div>
         ))}
         </Radio.Group>
      
      </div>
      <div className='d-flex flex-column mt-4'>
        <button className='btn btn-danger' 
        onClick={()=>window.location.reload()}>
          Clear Filter
        </button>
      </div>
      </div>
      <div className='col-md-9 w-65'>
        <h1 className='text-center'>
          All Products
        </h1>
        <div className='d-flex justify-content-center flex-wrap'>
        {products?.map((pd)=>(
                  
           <div className="card m-2" style={{width: '18rem'}} key={pd._id}>
                 <img src={`/api/v1/product/product-photo/${pd._id}`} 
                 className="card-img-top" alt={pd.name} width={'300px'} height={'350px'} />
              <div className="card-body">
                <h5 className="card-title">{pd.name}</h5>
               <p className="card-text">{pd.description.substring(0,30)}....</p>
               <p className='card-text'>{pd.price}</p>
               <button className='btn btn-primary ms-2' 
               onClick={()=>navigate(`/product/${pd.slug}`)}>More details</button>
               <button className='btn btn-secondary ms-2'onClick={()=>{
                setCart([...cart,pd])
                localStorage.setItem('cart',JSON.stringify([...cart,pd]))
                toast.success('product added in the cart')}
                } >Add To cart</button>
               
               </div>
            </div>
            

                ))}
        </div>
        <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "loadMore"}
              </button>
            )}
          </div>
      </div>
     </div>
      </Layout>
  )
}

export default Homepage
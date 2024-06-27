import React,{useState,useEffect} from 'react'
import AdminMenu from '../../components/layout/AdminMenu'
import Layout from '../../components/layout/Layout'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../../index.css'

const Products = () => {

    const[product,setProducts] = useState([])

//get all products
const getAllproducts = async()=>{
    try{
        const {data} =  await axios.get('/api/v1/product/get-product')
      setProducts(data.products)
    }catch(error){
        console.log(error)
        toast.error('something went wrong')
    }
}

useEffect(()=>{
    getAllproducts()
},[])




  return (
    <Layout>
        <div className='row'>
            <div className='col-md-3'>
                <AdminMenu/>
            </div>
            <div className='col-md-9'>
                <h1 className='text-center'>All products</h1>
                <div className='d-flex  flex-wrap'>
                {product.map((pd)=>(
                    <Link key={pd._id} to={`/dashboard/admin/product/${pd.slug}`}className='product-link' >
                  <div className="card m-4" style={{width: '18rem', height:'23rem'}}>
                 <img src={`/api/v1/product/product-photo/${pd._id}`} className="card-img-top" alt={pd.name} width={'300px'} height={'350px'} />
                  <div className="card-body">
                <h5 className="card-title">{pd.name}</h5>
               <p className="card-text">{pd.description}</p>
               
                 </div>
            </div>
            </Link>

                ))}
                </div>
            </div>

        </div>
    </Layout>
  )
}

export default Products
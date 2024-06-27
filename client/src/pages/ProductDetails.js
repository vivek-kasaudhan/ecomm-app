import React,{useState,useEffect} from 'react'
import Layout from '../components/layout/Layout'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ProductDetails = () => {
    const params =  useParams()
    const [products,setproducts] = useState({})
    const[relatedProduct,setRelatedProduct] =  useState([])


    ///similar product
    const getSimilarProduct   =  async(pid,cid)=>{
    try{
    const {data} =  await axios.get(`/api/v1/product/related-product/${pid}/${cid}`)
    setRelatedProduct(data.products)
    }catch(error){
        console.log(error)
    }
    }

    //get product
    const getProduct =   async()=>{
        try{
            const { data } =  await axios.get(`/api/v1/product/get-single-product/${params.slug}`)

            setproducts(data.product)
            getSimilarProduct(data?.product._id,data?.product.category?._id)

        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
       if(params?.slug) getProduct()
    },[params?.slug])

  return (
    <Layout>
        <div className='row container'>
            <div className='col-md-6'>
                <img src={`/api/v1/product/product-photo/${products._id}`}
                className='card-img-top' alt={products.name} height='325' width='325' />
            </div>
            <div className='col-md-6'>
                <h1 className='text-center'>Product Details</h1>
                <h4>Name:{products.name}</h4>
                <h4>description:{products.description}</h4>
                <h4>Price:{products.price}</h4>
                <h4>Category:{products.name}</h4>
                <button className='btn btn-secondary ms-2'>Add To cart</button>
                
            </div>
        </div>
        <hr/>
        <div className='row text-center'>
            <h5>Similar products</h5>
            <div className='d-flex flex-wrap'>
        {relatedProduct?.map((pd)=>(
                  
                  <div className="card m-2" style={{width: '18rem'}} key={pd._id}>
                 <img src={`/api/v1/product/product-photo/${pd._id}`} className="card-img-top" alt={pd.name} />
                  <div className="card-body">
                <h5 className="card-title">{pd.name}</h5>
               <p className="card-text">{pd.description.substring(0,30)}....</p>
               <p className='card-text'>{pd.price}</p>
            
               <button className='btn btn-secondary ms-2'>Add To cart</button>
               
                 </div>
            </div>
             ))}
        </div>
        </div>
    </Layout>
  )
}

export default ProductDetails
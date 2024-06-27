import React from 'react'
import { useSearch } from '../context/search'
import Layout from '../components/layout/Layout'

const Search = () => {

    const[values,setValues] =  useSearch()
  return (
    <Layout>
        <div className='container'>
            <div className='text-center'>
                <h1> Search Results</h1>
                <h6>{values?.results.length < 1 ? 'no products found':`found${values?.results.length}`}</h6>
             </div>
             <div className='d-flex flex-wrap m-3'>
                {values?.results.map((p)=>(
                    <div  className="card m-2" style={{width: '18rem'}} key={p._id}>
                       <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                       <div className="card-body">
                       <h5 className="card-title">{p.name}</h5>
                       <p className="card-text">{p.description.substring(0,30)}....</p>
                       <p className='card-text'>{p.price}</p>
                       <button className='btn btn-primary ms-2'>More details</button>
                       <button className='btn btn-secondary ms-2'>Add To cart</button>
               
                   </div>


                    </div>

                ))}

             </div>

        </div>
    </Layout>
  )
}

export default Search
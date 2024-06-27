import React,{useState,useEffect} from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Input, Select } from 'antd'
import { useNavigate } from 'react-router-dom'

const {Option} = Select

const CreateProduct = () => {

    const[categories,setCategories] =  useState([])
    const[photo,setPhoto] =  useState('')
    const[name,setName] =  useState('')
    const[description,setDescription] =  useState('')
    const[price,setPrice] =  useState('')
    const[quantity,setQuantity] =  useState('')
    const[shipping,setShipping] =  useState('')
    const[category,setCategory] =  useState('')
    const navigate  =  useNavigate()


    //handlecreate functom
    const handleCreate = async(e)=>{
        e.preventDefault()
        try{
            // const formData = {
            //     name,
            //     description,
            //     price,
            //     quantity,
            //     shipping,
            //     category,
            //     photo 
            // };
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("photo", photo);
            productData.append("category", category);
            const {data} =  await axios.post('/api/v1/product//create-product',productData)
            if(data.success){
                toast.success('product created successfully')
                navigate('/dashboard/admin/products')
            }else{
                toast.error(data.message)
            }

        }catch(error){
            console.log(error)
            toast.error('something went wrong')
        }
    }


    

//get all categories created
const getAllCategories =  async()=>{
    try{
        const res =  await axios.get('/api/v1/category/get-category')
       if(res.data.success){
        setCategories(res.data.category)
       }
    }catch(error){
        console.log(error)
        toast.error('something went wrong in category..')
    }
}
useEffect(()=>{
    getAllCategories()
},[])



  return (
    <Layout>
        <div className='container-fluid m-3 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu/>

                </div>
                <div className='col-md-9'>
                    <h1>Create Product</h1>
                    <div className='m-1'>
                        <Select bordered ={false} placeholder='select a category' size='large'
                        showSearch className='form-select mb-3' onChange={(value)=>{setCategory(value)}}>
                            {categories?.map(c=>(
                                <Option key={c._id} value = {c._id}>{c.name}</Option>
                            ))}

                        </Select>
                        <div className='mb-3'>
                            <label  className='btn btn-outline-secondary'>
                                {photo ? photo.name : "Upload photo"}
                                <input type="file" name='photo' accept='image/*' onChange={(e)=>setPhoto(e.target.files[0])} hidden />
                                
                            </label>
                        </div>
                        <div className='mb-3'>
                            {photo && (
                                <div className='text-center'>
                                    <img src={URL.createObjectURL(photo)}alt='productphoto' height={"200px"}
                                    className=' img img-responsive'/>
                                </div>
                            )}

                        </div>
                        <div>
                        {/* <form onSubmit={handleCreate}> */}
                        <div className='mb-3'>
                            <input type='text' value={name} placeholder='write a name' className='form-control' onChange={(e)=>setName(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                          <textarea
                          type="text"  value={description}  placeholder="write a description"className="form-control"
                           onChange={(e) => setDescription(e.target.value)}
                           />
                        </div>
                        <div className='mb-3'>
                            <input type='number' value={price} placeholder='price' className='form-control' 
                            onChange={(e)=>setPrice(e.target.value)}/>
                        </div>
                        <div className='mb-3'>
                            <input type='number' value={quantity} placeholder='quantity' className='form-control'
                             onChange={(e)=>setQuantity(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                     <Select
                          bordered={false}
                          placeholder="Select Shipping "
                          size="large"
                          showSearch
                          className="form-select mb-3"
                          onChange={(value) => {setShipping(value);
                         }} >
                          <Option value="0">No</Option>
                         <Option value="1">Yes</Option>
                      </Select>
                    </div>
                    <div className="mb-3">
                       <button className="btn btn-primary"  onClick={handleCreate} >
                         CREATE PRODUCT
                      </button>
                   </div>
                   {/* </form> */}
                   </div>

                    </div>

                </div>

            </div>

        </div>
    </Layout>
  )
}

export default CreateProduct
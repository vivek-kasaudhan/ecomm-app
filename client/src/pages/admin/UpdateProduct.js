import axios from 'axios'
import toast from 'react-hot-toast'
import { Input, Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useState,useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
const {Option} = Select

const UpdateProduct = () => {



    const[categories,setCategories] =  useState([])
    const[photo,setPhoto] =  useState('')
    const[name,setName] =  useState('')
    const[description,setDescription] =  useState('')
    const[price,setPrice] =  useState('')
    const[quantity,setQuantity] =  useState('')
    const[shipping,setShipping] =  useState('')
    const[category,setCategory] =  useState('')
    const [id, setId] = useState("");
    const navigate  =  useNavigate()
    const params =  useParams()

    //handledelete
    const handleDelete = async () => {
        try {
          let answer = window.prompt("Are You Sure want to delete this product ? ");
          if (!answer) return;
          const { data } = await axios.delete(
            `/api/v1/product/delete-product/${id}`
          );
          toast.success("Product DEleted Succfully");
          navigate("/dashboard/admin/products");
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }
      };


    //handlecreate functom
    const handleUpdate = async(e)=>{
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
           photo && productData.append("photo", photo);
            productData.append("category", category);

            const {data} =  await axios.put(`/api/v1/product/update-product/${id}`,productData)
            if(data.success){
                toast.success('product updated successfully')
                navigate('/dashboard/admin/products')
            }else{
                toast.error(data.message)
            }

        }catch(error){
            console.log(error)
            toast.error('something went wrong')
        }
    }


    // GET single product 
    const getSingleproduct =  async()=>{
        try{
            const  {data} = await axios.get(`/api/v1/product/get-single-product/${params.slug}`)

            setName(data.product.name)
            setDescription(data.product.description)
            setPrice(data.product.price)
            setQuantity(data.product.quantity)
            setShipping(data.product.shipping)
            setCategory(data.product.category._id)
            setId(data.product._id)

        }catch(error){
            console.log(error)
        }
    }


    useEffect(()=>{
        getSingleproduct()
    },[])
    

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
                <h1>UpdateProduct Product</h1>
                <div className='m-1'>
                    <Select bordered ={false} placeholder='select a category' size='large'
                    showSearch className='form-select mb-3' 
                    onChange={(value)=>{setCategory(value)}} value={category}  >
                        {categories?.map(c=>(
                            <Option key={c._id} value = {c._id}>{c.name}</Option>
                        ))}

                    </Select>
                    <div className='mb-3'>
                        <label  className='btn btn-outline-secondary'>
                            {photo ? photo.name : "Upload photo"}
                            <input type="file" name='photo' accept='image/*'
                             onChange={(e)=>setPhoto(e.target.files[0])} hidden />
                            
                        </label>
                    </div>
                    <div className='mb-3'>
                    {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`/api/v1/product/product-photo/${id}`}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
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
                        
                     }}
                     value={shipping ? "yes" : "No"} >
                      <Option value="0">No</Option>
                     <Option value="1">Yes</Option>
                  </Select>
                </div>
                <div className="mb-3">
                   <button className="btn btn-primary"  onClick={handleUpdate} >
                     UPDATE PRODUCT
                  </button>
               </div>
               <div className="mb-3">
                   <button className="btn btn-danger"  onClick={handleDelete} >
                     Delete 
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

export default UpdateProduct
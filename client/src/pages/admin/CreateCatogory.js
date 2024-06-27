import React,{useState,useEffect} from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import toast from 'react-hot-toast'
import axios from 'axios'
import CategoryForm from '../../components/form/CategoryForm'
import  {Modal} from'antd'

const CreateCatogory = () => {



    const[categories,setCategories] =  useState([])

    const [name,setname] = useState('')
    const[visible,setvisible] = useState(false)
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");

    //handleform

    const handleSubmit =async(e)=>{
        e.preventDefault()
        try{
            const {data} =  await  axios.post('/api/v1/category/create-category',{name})

            if(data.success){
                toast.success(`${name} is created`)
                getAllCategories()
            }else{
                toast.error(data.message)
            }

        }catch(error){
            console.log(error)
            toast.error('error in input form')
        }
    }

    //update category
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
          const { data } = await axios.put(
            `/api/v1/category/update-category/${selected._id}`,
            { name: updatedName }
          );
          if (data.success) {
            toast.success(`${updatedName} is updated`);
            setSelected(null);
            setUpdatedName("");
            setvisible(false);
            getAllCategories();
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error("Somtihing went wrong");
        }
      };
      //delete the existing category
      const handleDelete =   async(pid)=>{
        try{
            const {data} =  await  axios.delete(`/api/v1/category/delete-category/${pid}`)

            if (data.success) {
                toast.success(`category is deleted`);
        
                getAllCategories();
              } else {
                toast.error(data.message);
              }

        }catch (error) {
            toast.error("Somtihing went wrong");
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
                    <h1>Manage Catogary</h1>
                    <div className='p-3'>
                     <CategoryForm value={name} setValue={setname} handleSubmit={handleSubmit}/>
                    </div>
                    <div  className='w-75'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th scope='col'>Name</th>
                                    <th scope='col'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                              
                                   {categories?.map((c)=>(
                                    <>
                                      <tr>
                                    
                                    <td key={c._id}>{c.name}</td>
                                    <td>
                                        <button className='btn btn-primary ms-2'onClick={() => {
                                        setvisible(true);
                                        setUpdatedName(c.name);
                                        setSelected(c);
                                        }} >   Edit</button>
                                        <button className='btn btn-danger ms-2' onClick={()=>handleDelete(c._id)}>Delete</button>
                                    </td>
                                    </tr>
                                    </>
                                    
                                   ))}
                               
                            </tbody>
                        </table>
                    </div>
                    <Modal onCancel={()=>setvisible(false)} footer={null} visible={visible} >
                    <CategoryForm
                     value={updatedName}
                     setValue={setUpdatedName}
                      handleSubmit={handleUpdate}
                    />

                    </Modal>

                </div>

            </div>

        </div>
    </Layout>
  )
}

export default CreateCatogory
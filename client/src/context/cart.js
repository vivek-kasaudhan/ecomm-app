import { useContext,createContext, useState, useEffect} from "react";


const cartContext =  createContext()

const CartProvider =  ({children})=>{

    const [cart, setcart] = useState([])

    useEffect(()=>{
        let existingCartitem = localStorage.getItem('cart')

        if(existingCartitem) setcart(JSON.parse(existingCartitem)) 
    },[])


    return (
        <cartContext.Provider value={[cart,setcart]}>
            {children}
        </cartContext.Provider>
    )
}

const useCart =  ()=>useContext(cartContext)

export{useCart,CartProvider}
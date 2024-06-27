import bcrypt from 'bcrypt'

export const hashedPassword = async(password)=>{
    try{
        const saltRounds  = 10
        const hashed  = await bcrypt.hash(password,saltRounds)
        return hashed

    } catch(error){
        console.log(error)
    }
}

export const comparePassword  = async(password,hashed)=>{
    return bcrypt.compare(password,hashed)

}
const jwt = require("jsonwebtoken")
const createTokenPair = async(payload, PublicKey, privateKey)=>{
    try {
        const accessToken = await jwt.sign(payload, privateKey,{
            expiresIn:'2h',
        })
        const resfreshToken = await jwt.sign(payload, privateKey,{
            expiresIn:'7d',
        })
        jwt.verify(accessToken, PublicKey, (err, decode)=>{
            if(err){
                console.error("error verify::", err)
            }else{
                console.log("decode verify::", decode)
            }
        })
        return {accessToken, resfreshToken}
    } catch (error) {
        console.error(error)
    }
}
const verifyJWT = async(token,keySecret)=>{
    return jwt.verify(token, keySecret)
}
module.exports ={createTokenPair, verifyJWT}
module.exports = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((err)=>{
            return res.send("Internal Server Error!")
        })
    }
}
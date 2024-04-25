// always return highr order function otherwisw error -> requires a callback function but got a [object Undefined]
const asyncHandler = (requestHandler) => {
    return (req, res, next) => 
        //next is used to pass the error to the next middleware
    {  
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((error) => next(error))
        // here if the promise succed then it gets the resolve
        // and if fails then catch is executed
    }
}

export {asyncHandler};




// OR another way to do using try catch is below

// const asyncHandler = (fn) => async(req,res,next)=>{
//     try{
//             await fn(req,res,next)
//     } catch (error){
//         res.status(error.code || 500 ).json({
//             success:false,
//             message:error.message
//         })
//     }
// }
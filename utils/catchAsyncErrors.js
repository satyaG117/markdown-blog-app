// wrapper function that throws async errors if found
module.exports.catchAsyncErrors = (fn) =>{
    return (req,res,next)=>{
        fn(req,res,next).catch(err => next(err));
    }
}
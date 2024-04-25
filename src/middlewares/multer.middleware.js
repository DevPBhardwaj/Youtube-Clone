//Must check the full documentation of multer from https://github.com/expressjs/multer
import multer from "multer"

const storage = multer.diskStorage({ // storage is diskStorage we haven't use memoryStorage otherwise the memory get full and we can't upload more files
    destination: function (req, file, cb) { //cb is callback 
      cb(null, './public/temp') // here first is to handle the errors and second is the path where we want to store the file
    },
    filename: function (req, file, cb) { 
        //this below code is to make the file name unique 
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //cb(null, file.fieldname + '-' + uniqueSuffix)  this is little complex so we do it simple
        cb(null,file.originalname) //originalname property put the same name as the user has of its file while uploading it in our temp folder
        //one issue can be name can be same so we can use the above code to make it unique
    }
  })
  
  const upload = multer({ 
    storage: storage , 
})
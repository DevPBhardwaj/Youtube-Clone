//We are creating this class as whenever we send response to anyone this response 
//will be passed through this class and we can use this class to send response to anyone

class ApiResponse {
    constructor(statusCode, data , message = "success"){
        this.statusCode = statusCode,
        this.message = message,
        this.data = data,
        this.success = statusCode<400 
    }
}

export {ApiResponse}
//This code defines a class named ApiError that extends the built-in Error class in JavaScript in Node.js.
//This means ApiError will have all the properties and methods of the Error class, and you can add custom functionality to it.
// The class has a constructor. This method is called when a new instance of the ApiError class is created..

class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors =[],
    ){
        super(message) //It is always called whenever we override a function
        //Sets several properties of the ApiError instance
        this.statusCode = statusCode;  //Assigns the provided statusCode parameter to the statusCode property.
        this.data = null;
        this.message = message; //Sets the message property of the instance to the provided message parameter.
        this.success = false;
        this.errors = errors; //Assigns the provided errors parameter to the errors property.
    }
}

export {ApiError}

class APIError extends Error {
    constructor(
      message="something went wrong",
      statusCode,
      errors = [],
      stack = ""
      ) {
      super(message);
      this.statusCode = statusCode || 500;
      this.data = null;
      this.name = this.constructor.name;
      this.message = message,
      this.success = false;
      this.errors = errors;
    }
    if(stack){
      this.stack = stack;
    }
  }
  


  export default APIError;
  

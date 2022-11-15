
 const Joi = require("joi");



let middlewareValidation = (schema,property)=>{

    return (request,response,next)=>{

       

        // const {error} = Joi.validate(request.body,schema,{abortEarly:false})

        const {error} = schema.validate(request.body,{abortEarly:false})

        console.log("error",error)

        if(error == null){

            next()

        }

        else{

            const {details} = error;

            // const

            response.status(200).json({

                success:false,

                message:details

            })

        }

    }

}

const schemas ={

    user :Joi.object().keys({

      

        name:Joi.string().trim().required().min(3).max(50),
        email:Joi.string().trim().required().email(),
        password:Joi.string().trim().required().min(3).max(8),
        role:Joi.string().trim().required(),
        company_id:Joi.string().trim().required(),

    
    }),
    admin:Joi.object().keys({
        user:Joi.string().trim().required().min(3).max(50),
        password:Joi.string().trim().required().min(3).max(50),
    }),
    company:Joi.object().keys({
        
        companyName:Joi.string().trim().required().min(3).max(50),
        companyAddress:Joi.string().trim().required().max(100),
    }),
    domain:Joi.object().keys({
        domainName:Joi.string().trim().required().min(3).max(50),
        companyId:Joi.number().required(),
    })
    .unknown(true)

}
// name, email, password, role, company_id 
module.exports ={middlewareValidation,schemas}
    

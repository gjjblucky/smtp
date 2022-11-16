
 const Joi = require("@hapi/joi");
 const passwordComplexity = require('joi-password-complexity').default;




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

// const pattern = /^[a-zA-Z0-9!@#$%&*]{3,25}$/;

const schemas ={

    user :Joi.object().keys({

      //.regex(/[$\(\)<>\!\@\#\%\^\&\*]/, { invert: true })
    //   regex(/^(?=.*[0-9])(?=.*[!@#\$%\^&\*])/, { invert: true })

        name:Joi.string().trim().required().min(3).max(50).regex(/[$\(\)<>\!\@\#\%\^\&\*]/, { invert: true }).regex(/(?=.*[0-9])/, { invert: true }),
        email:Joi.string().trim().required().email(),
        // password:Joi.string().regex(/^[A-Za-z0-9]+$/).required().min(3).max(8),
         password:Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")),
    //    password:Joi.string().regex(/^[a-zA-Z0-9!@#$%&*]{3,30}$/).required(),
        role:Joi.string().trim().required(),
        company_id:Joi.string().trim().required(),

    
    }),
    admin:Joi.object().keys({
        user:Joi.string().trim().required().min(3).max(50),
        password:Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")),
    }),
    company:Joi.object().keys({
        
        companyName:Joi.string().trim().required().min(3).max(50).regex(/(?=.*[0-9])/, { invert: true }).regex(/[$\(\)<>\!\@\#\%\^\&\*]/, { invert: true }),
        companyAddress:Joi.string().trim().required().min(3).max(100),
        //.regex(/(?=.*[0-9])/,{invert:true})
    }),
    domain:Joi.object().keys({
        // domainName:Joi.string().trim().required().min(3).max(50),
        domainName:Joi.string().trim().pattern(new RegExp("^(?=.*[.])")).required().min(3).max(50).regex(/(?=.*[0-9])/, { invert: true }).regex(/[$\(\)<>\!\@\#\%\^\&\*]/, { invert: true }),
        companyId:Joi.number().required(),
    })
    .unknown(true)

}
// name, email, password, role, company_id 
module.exports ={middlewareValidation,schemas}
    

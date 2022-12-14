const Joi = require('@hapi/joi')

const middlewareValidation = (schema, property) => {
  return (request, response, next) => {
    const { error } = schema.validate(request.body, { abortEarly: false })
    if (error == null) {
      next()
    } else {
      const { details } = error
      response.status(403).json({ success: false, message: details })
    }
  }
}

const schemas = {

  user: Joi.object().keys({

    name: Joi.string().trim().required().min(3).max(50).regex(/[$()<>!@#%^&*]/, { invert: true }).regex(/(?=.*[0-9])/, { invert: true }),
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/),
    role: Joi.string().trim().required(),
    company_id: Joi.string().trim().required()
  }),
  forgot: Joi.object().keys({

    email: Joi.string().trim().required().email()
  }),
  reset: Joi.object().keys({

    token: Joi.string().required(),
    newPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
  }),
  change: Joi.object().keys({

    email: Joi.string().trim().required().email(),
    oldPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/),
    newPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/),
    confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required()
  }),
  admin: Joi.object().keys({

    user: Joi.string().trim().required().min(3).max(50),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
  }),
  company: Joi.object().keys({

    companyName: Joi.string().trim().required().min(3).max(50).regex(/(?=.*[0-9])/, { invert: true }).regex(/[$()<>!@#%^&*]/, { invert: true }),
    companyAddress: Joi.string().trim().required().min(3).max(100)
  }),
  domain: Joi.object().keys({

    domainName: Joi.string().trim().domain(),
    companyId: Joi.number().required()
  })
    .unknown(true)
}

module.exports = { middlewareValidation, schemas }

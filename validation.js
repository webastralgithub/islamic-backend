const Joi = require('@hapi/joi');

const registrationvalidation = data =>{

    // console.log(data);

    const schema = Joi.object({ 
        name: Joi.string() .min(6) .required(),
        mobile_number: Joi.string(),
        gender: Joi.string() .required(),
        user_role: Joi.string(),
        token: Joi.string(),
        email: Joi.string() .min(6) .required() .email(),
        birthday:Joi.date(),
        status:Joi.boolean(),
        resetPasswordToken: Joi.string(),
        resetPasswordExpires: Joi.string(),
        password: Joi.string() .min(6) .required()
     });
        
        const validation = schema.validate(data);
        return validation;

}

const loginValidation = (data)=>{

    const schema = Joi.object({ 
        email: Joi.string() .min(6) .required() .email(),
        password: Joi.string() .min(6) .required()
     });
        
        const validation = schema.validate(data);
        return validation;

}


const journalValidation = (data) => {

    const schema = Joi.object({ 
        title: Joi.string() .required(),
        description: Joi.string() .min(4) .required()
     });
        
        const validation = schema.validate(data);
        return validation;
}


module.exports.registrationvalidation = registrationvalidation;
module.exports.loginValidation = loginValidation;
module.exports.journalValidation = journalValidation;
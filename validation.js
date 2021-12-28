const Joi = require('@hapi/joi');

const registrationvalidation = data =>{

    // console.log(data);

    const schema = Joi.object({ 
        name: Joi.string() .required(),
        mobile_number: Joi.string(),
        gender: Joi.string() .required(),
        user_role: Joi.string(),
        token: Joi.string(),
        address: Joi.string(),
        email: Joi.string() .min(6) .required(),
        birthday:Joi.string(),
        status:Joi.boolean(),
        resetPasswordToken: Joi.string(),
        resetPasswordExpires: Joi.string(),
        profile_image:Joi.string(),
        subscription_type:Joi.string(),
        subscription_status:Joi.boolean(),
        password: Joi.string() .min(6) .required()
     });
        
        const validation = schema.validate(data);
        return validation;

}

const loginValidation = (data)=>{

    const schema = Joi.object({ 
        email: Joi.string() .min(6) .required(),
        password: Joi.string() .min(6) .required()
     });
        
        const validation = schema.validate(data);
        return validation;

}


const journalValidation = (data) => {

    const schema = Joi.object({ 
        title: Joi.string() .required(),
        description: Joi.string() .min(4) .required(),
        text_color:Joi.string(),
     });
        
        const validation = schema.validate(data);
        return validation;
}




const bookValidation = (data) => {

    const schema = Joi.object({ 
        title: Joi.string() .required(),
        description: Joi.string() .min(4) .required(),
        image:Joi.string(),
        author:Joi.string(),
     });
        
        const validation = schema.validate(data);
        return validation;
}

const chapterValidation = (data) => {

    const schema = Joi.object({ 
        title: Joi.string() .required(),
        description: Joi.string() .min(4) .required(),
        book_id:Joi.string(),
     });
        
        const validation = schema.validate(data);
        return validation;
}


module.exports.registrationvalidation = registrationvalidation;
module.exports.loginValidation = loginValidation;
module.exports.journalValidation = journalValidation;
module.exports.bookValidation = bookValidation;
module.exports.chapterValidation = chapterValidation;
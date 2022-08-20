const jwt = require('jsonwebtoken');
const User = require('../models/users');


const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','');
        const claims = jwt.verify(token, 'thisismynewcourse');

        //we use single quotes tokens.token' if the property name is complex
        const user = await User.findOne({ _id : claims._id , 'tokens.token' : token});

        if(!user){
            //will trigger catch
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error : "Unauthenticated access"})
    }
}

module.exports = auth

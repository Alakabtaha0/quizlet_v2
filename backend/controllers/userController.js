const catchAsync = require('./../utils/catchAsync');
const Users = require('../models/userModel');

// Need to add proper res.status updates whenever user is not there
// Need to splice what data is sent to the end user (can't show everything)
module.exports.getAllUsers = catchAsync( async (req, res, next) => {
    const users = await Users.find();

    res.status(200).json({
        status: 'success',
        message: 'successfully gotten users',
        length: users.length,
        data: {
            users
        }
    });
});


module.exports.getUser = catchAsync( async (req, res, next) => {
    const user = await Users.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            status: 'failed',
            message: 'user could not be found'
        });
    };

    res.status(200).json({
        status: 'success',
        message: 'successfully gotten user',
        user
        
    });
});

module.exports.updateUser = catchAsync( async (req, res, next) => {
    const user = await Users.findByIdAndUpdate(req.params.id, req.body);

    if(!user) {
        res.status(404).json({
            status: 'failed',
            message: "couldn't find a user"
        });
    }

    res.status(202).json({
        status: 'success',
        message: 'successfully updated user'
    })
    
});

module.exports.deleteUser = catchAsync( async (req, res, next) => {
    const user = await Users.findByIdAndDelete(req.params.id);

    if(!user) {
        res.status(404).json({
            status: 'failed',
            message: "couldn't find a user"
        });
    }

    res.status(204).json({
        status: 'success',
        message: 'successfully deleted user'
    })
});
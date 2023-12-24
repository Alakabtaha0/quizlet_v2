const catchAsync = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (err) {
            res.status(500).json({
                status: 'Fail',
                message: 'Something went wrong on our side.'
            });
            console.log(err);
        };
    };
}

module.exports = catchAsync;
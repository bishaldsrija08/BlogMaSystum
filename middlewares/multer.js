const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // logic to validate the file type (mime type)
        const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
        if(!allowedFileTypes.includes(file.mimetype)){
            return cb(new Error('Invalid file type. Only images are allowed.'));
        }
        // Set the destination for file uploads
        cb(null, "./uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

module.exports = {
    multer,
    storage
}
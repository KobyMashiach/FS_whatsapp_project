const mongoose = require('mongoose')

const connectDB = () => {
    mongoose.connect(`mongodb://127.0.0.1:27017/whatsappDB`)
        .then(() => console.log('Connected to whatsappDB'))
        .catch((error) => console.log(error))
}

module.exports = connectDB
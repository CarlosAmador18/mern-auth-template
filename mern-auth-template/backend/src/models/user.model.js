import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required: true,
        trim : true,
        unique : true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique : true
    },
    password: {
        type: String,
        required: true,
        // No guardar la contraseña directamente, solo el hash
    }
}, {
    timestamps :true
});

// No añadir método para comparar contraseñas aquí para mantener el modelo simple
// La comparación se hará en el controlador usando bcrypt

const User = mongoose.model('User', userSchema);

export default User; 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');
const nodemailer = require('nodemailer');  // Importar nodemailer

// Configuración del transporter de nodemailer (usando Gmail como ejemplo)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes cambiar el servicio a otro si lo prefieres (ej. SendGrid, Mailgun, etc.)
    auth: {
        user: 'joaquinherreragamezzz@gmail.com', // Tu correo de Gmail
        pass: 'Sushi_picante1'       // Tu contraseña de Gmail (o una contraseña de aplicación si tienes la verificación en dos pasos)
    }
});

// Register
exports.register = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error creating user', err: err });
            }
            res.status(201).json({ message: 'User registered successfully' });
        }
    );
};

// Login
exports.login = (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            console.log('No user found or error in query', err); // Verificar error o si el usuario no se encuentra
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            console.log('Invalid password'); // Verificar si la contraseña es incorrecta
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, tokenType: 'access' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};

// Recovery Password
exports.recoverPassword = (req, res) => {
    const { email } = req.body;

    // Generar el token de recuperación
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Guardar el token de recuperación en la base de datos
    connection.query(
        'UPDATE users SET reset_token = ?, reset_token_expiry = NOW() + INTERVAL 1 HOUR WHERE email = ?',
        [resetToken, email],
        (err, result) => {
            if (err || result.affectedRows === 0) {
                return res.status(500).json({ message: 'Error processing request' });
            }

            // Crear el enlace de recuperación que se enviará en el correo
            const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

            // Configurar el correo que se enviará
            const mailOptions = {
                from: 'joaquinherreragamezzz@gmail.com',   // Correo desde el cual se enviará
                to: email,                    // Correo del usuario
                subject: 'Recuperación de Contraseña',
                text: `Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú, por favor ignora este correo.\n\nHaz clic en el siguiente enlace para restablecer tu contraseña:\n\n${resetUrl}`
            };

            // Enviar el correo de recuperación de contraseña
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error al enviar el correo:', error);
                    return res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
                }

                console.log('Correo enviado: ' + info.response);
                res.json({
                    message: `Se ha enviado un enlace de recuperación a tu correo electrónico: ${email}`
                });
            });
        }
    );
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Verificar y actualizar la contraseña solo si el token es válido
    connection.query(
        'UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ? AND reset_token_expiry > NOW()',
        [hashedPassword, token],
        (err, result) => {
            if (err || result.affectedRows === 0) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }
            res.json({ message: 'Password updated successfully' });
        }
    );
};

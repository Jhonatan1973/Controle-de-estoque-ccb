const User = require('../models/userModel');

// Controle de login (futuro)
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).send('Usuário ou senha incorretos');
        }
        res.status(200).send('Usuário autenticado');
    } catch (error) {
        res.status(500).send('Erro ao fazer login');
    }
};

module.exports = { login };

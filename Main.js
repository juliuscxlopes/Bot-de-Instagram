const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Importe o modelo User

const app = express();

// Função para conectar ao MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/app-Instagram', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
};

// Middleware para verificar se a conexão com o MongoDB está ativa
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectToMongoDB();
  }
  next();
});

// Configuração do Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Defina um diretório para servir arquivos estáticos (por exemplo, arquivos HTML, CSS, JavaScript)
app.use(express.static('static'));

// Rota para a página de login
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/static/Log-in.html');
});

// Rota padrão para a página inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/Log-in.html');
});

// Rota para processar o login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.send('Nome de usuário ou senha incorretos');
  }

  req.session.user = user;
  res.send('Login bem-sucedido');
});

// Rota para a página de registro
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/static/Register.html');
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Verifique se o nome de usuário já existe no banco de dados
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.send('Este nome de usuário já está em uso.');
  }

  // Faça hash da senha antes de armazená-la
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crie um novo documento de usuário no banco de dados
  const newUser = new User({
    email,
    password: hashedPassword,
  });

  await newUser.save();

  res.send('Registro bem-sucedido! Você pode fazer login agora.');
});

// Inicie o servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

// Rota para encerrar o servidor
app.post('/encerrar-servidor', (req, res) => {
  // Encerra o servidor Node.js
  server.close(() => {
      console.log('Servidor encerrado.');
      process.exit(0);
  });
});

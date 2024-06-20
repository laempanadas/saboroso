var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var formidable = require('formidable');
var http = require('http');
var socketIO = require('socket.io'); // Renomeado para evitar conflitos
// O 'path' foi importado duas vezes, removi a duplicação.

var app = express();
var server = http.Server(app); // Renomeado para evitar conflitos
var io = socketIO(server);

io.on('connection', function(socket){
  console.log('Novo usuário conectado!');
});

var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);

// Middleware para lidar com formulários
app.use(function(req, res, next){
  req.body = {};

  if (req.method === 'POST') {
    var form = formidable.IncomingForm({
      uploadDir: path.join(__dirname, "/public/images"),
      keepExtensions: true
    });

    form.parse(req, function(err, fields, files){
      req.body = fields;
      req.fields = fields;
      req.files = files;
      next();
    });
  } else {
    next();
  }
});

// Configuração da view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuração da sessão
app.use(session({
  store: new redisStore({
    host: 'localhost',
    port: 6379
  }),
  secret: 'sh@llom',
  resave: true,
  saveUninitialized: true
}));

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// Tratamento de erro 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Tratamento de erros
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Iniciar o servidor
server.listen(3000, function(){
  console.log("Servidor em execução...");
});



var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var storyParts = [];
var mongoose = require('mongoose');

var Word = require('./Model/word');

const dbMongo = 'mongodb://localhost:27017/bdStory';
const port = 8085;

var currentWord = "";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(dbMongo, function(err,res)
{
    if (err) {
        console.log(`Error al conectarse a la BD ${err}`);
    } else {
        console.log('Conexión exitosa');
    }
});

server.listen(port,function(){
    console.log('Corriendo por el puerto' + port);
});

//Socket io hace una conección bidireccional
io.on('connection', function(socket){ //Metodo predefinido por socket.io, siempre que se conecta a la BD
    console.log('Alguien se ha conectado');
    socket.emit('story', storyParts); //socket es para uno solo y io es para todos
    socket.emit('new-word', currentWord); //emite la palabra
    socket.on('sent-story', function(data){ //envia la historia 
        storyParts.push(data);
        io.sockets.emit('story', storyParts); //muestra la historia a todos
        ramdomWord(function(err,data){
            io.emit('new-word', data); //io.emit es para emitir a todos en este caso la palabra
        });
    });
}); 

function ramdomWord(callback){ //Función para el retorno Asíncrono
    Word.find({},function(err, words){ //JSON vacio significa que traiga todo
        var number = Math.floor(Math.random()*words.length);
        currentWord = words[number].word; //Para acceder al atributo word ya que es un JSON
        callback(0, currentWord); //Por ser una funcion Asincrona se retorna diferente

    }); 
}

//Agregar palabras por método POST
app.post('/api/setWord',function(req,res){
    let word = new Word();
    word.word = req.param('imputWord');
    word.save(function(err,storedWord){
        if (err) {
            res.status(500);
            res.send({message:`Error al guardar ${err}`})
        } else {
            res.status(200);
            res.redirect('/');
            res.end();
        }
    });
});


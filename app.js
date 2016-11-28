var express = require('express')

var https = require('https');
var http = require('http');
var fs = require('fs');

var app = express()

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var shell = require('./AuxHelper/ShellHelper/shellWriter');
const url = require('url');
app.set("view engine", "jade");
app.use(express.static("public"));

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('/home/mell/webserver/negritosMail/keySsl/apache.key'),
  cert: fs.readFileSync('/home/mell/webserver/negritosMail/keySsl/apache.crt')
};


/*
shell.exec('java -classpath AuxHelper/EmailHelper/ Mail mell@negritosmail.com sylalp7@gmail.com Hola comoestas?',function(){
  console.log("executed");
})
*/
app.get("/", function(solicitud, respuesta) {


   respuesta.render("./index");
});


//app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//BASE DE DATOS
mongoose.connect("mongodb://localhost/emailsManagement");

var userSchema = {
	name: String,
	email: String,
	password:String
};

var User = mongoose.model("User", userSchema);
//




//---Agregar usuario-----------------------------------------
app.post('/sendMail',function(req,res){
	//verificación de correo existente
	User.find(function(error,documento){
	var emails = [];
	for (var i = 0; i < documento.length; i++){
		emails.push(documento[i].email);
	}

	if (emails.indexOf(req.body.nombre+"@negritosmail.com") != -1){

		res.render("../public/addUser.html",{correos:"Ya existe el correo"});

	}
	else{

		var data={
		name:req.body.nombre,
		email:req.body.nombre+"@negritosmail.com",
		password:req.body.password
		}
		var user=new User(data);
		user.save(function(err){
		res.render("../public/EnviarCorreo.html",{correos:"",email:user.email});
		});
	}
	});
});


app.post('/userSend',function(req,res){
	if(req.body.email=="admin" && req.body.password=="admin")
	{
		res.render("../public/EliminarUsuario.html");
	}
	else{User.find({"email":req.body.email}, function(error,documento){

		if(!documento.length==0){

			if (documento[0].password==req.body.password){

			res.render("../public/EnviarCorreo.html",{email:documento[0].email,correos:""});

			}
			else{
				res.render("../public/IniciarSesion.html",{correos:"Contraseña inválida"});}
			}
		else{
			res.render("../public/IniciarSesion.html",{correos:"El usuario no existe"});
		}
		});
	}
});

app.get('/GuserSend',function(req,res){
	console.log(req.url.split('&'));
	if(req.body.email=="admin" && req.body.password=="admin")
	{
		res.render("../public/EliminarUsuario.html");
	}
	else{User.find({"email":req.body.email}, function(error,documento){

		if(!documento.length==0){

			if (documento[0].password==req.body.password){

			res.render("../public/EnviarCorreo.html",{email:documento[0].email,correos:""});

			}
			else{
				res.render("../public/IniciarSesion.html",{correos:"Contraseña inválida"});}
			}
		else{
			res.render("../public/IniciarSesion.html",{correos:"El usuario no existe"});
		}
		});
	}
});

app.post('/sent',function(req,res){
	console.log(req.body);
	shell.exec('java -classpath AuxHelper/EmailHelper/ Mail ' +req.body.emailuser+' '+ req.body.email+' '+req.body.subject.replace(new RegExp(" ",'g'),'_')+' '+req.body.message.replace(new RegExp(" ",'g'),'_'),function(){
  	console.log("executed");
	});
	res.render("../public/EnviarCorreo.html",{correos:"El correo se envió correctamente",email:req.body.emailuser});


});

//app.listen(5000);
http.createServer(app).listen(5000);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(5001);

var express = require('express')
var app = express()
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var shell = require('./AuxHelper/ShellHelper/shellWriter');
app.set("view engine", "jade");
app.use(express.static("public"));



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
		res.render("../public/EnviarCorreo.html");
		});
	}
	});
});


app.post('/userSend',function(req,res){

	User.find({"email":req.body.email}, function(error,documento){
		if(!documento.length==0){
			if (documento[0].password==req.body.password){
			console.log(documento[0].email)
			res.render("../public/EnviarCorreo.html",{email:documento[0].email});	
			}
			else{res.render("../public/IniciarSesion.html",{correos:"Contraseña inválida"});}
			}
		else{res.render("../public/IniciarSesion.html",{correos:"El usuario no existe"});}
		});
});

app.post('/sent',function(req,res){
	console.log(req.body);
	shell.exec('java -classpath AuxHelper/EmailHelper/ Mail ' +req.body.emailuser+' '+ req.body.email+' '+req.body.subject+' '+req.body.message.replace(new RegExp(" ",'g'),'_'),function(){
  	console.log("executed");
	})


});

app.listen(5000);

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
mongoose.connect("mongodb://localhost/test");

var userSchema = {
	name: String,
	mail: String,
	password:String
};

var User = mongoose.model("User", userSchema);
//



// Inicio página
app.get('/',function(req,res){

	res.render("addUser");

});



//---Agregar usuario-----------------------------------------
app.post('/addUser',function(req,res){
	//verificación de correo existente
	//User.find(function(error,documento){
	//var mails = [];
	//for (var i = 0; i < documento.length; i++){
	//	mails.push(documento[i].mail);
	//}

	//console.log(mails);
	//var user=new User(data);

	//if (emails.indexOf(req.body.mail) != -1){
	//	res.render("addUser",{correos:"El correo ya existe"});

	//}
	//});

	var data={
		name:req.body.nombre,
		mail:req.body.nombre+"@negritosmail.com",
		password:req.body.password
	}
	var user=new User(data);
	user.save(function(err){
		res.render("../public/EnviarCorreo.html",{correos: "Cliente registrado correctamente"});
	});


});

app.listen(5000)

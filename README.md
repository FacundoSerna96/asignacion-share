# asignacion-share

Servicio para asignar tareas a un usuario en base a un reporte en excel (o csv).
El necesario tener instalado una version de node 18 para arriba.

# Setup

Para instalar los paquetes necesarios.

```
npm i
```

Luego para levantar el proyecto:

```
npm start
```

# Uso

Se hace una consulta en base de datos para obtener la lista de tareas, luego se realiza el reporte exportandolo en formato csv. En el postman se agrega el id del usuario en la ruta de la peticion y luego se agrega el archivo en body.

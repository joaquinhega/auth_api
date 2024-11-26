# API para Autenticación (Auth) 🔒

Esta API maneja la autenticación de usuarios en el sistema **Ecommerce**. Permite registrar usuarios, iniciar sesión y recuperar contraseña (no permite realizar la logica ya que no hay un servicio de mensajeria mail disponible).

## 🛠️ Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express.js**: Framework para crear el servidor y los endpoints.
- **bcrypt**: Para el hash de contraseñas.
- **JSON**: Almacenamiento simulado de usuarios.

## ⚙️ Instrucciones para instalar y usar mediante archivo ZIP

1. **Descargar el proyecto como ZIP:**
   - Ve al repositorio de GitHub correspondiente.
   - Haz clic en el botón verde **Code**.
   - Selecciona **Download ZIP** y guarda el archivo en tu computadora.

2. **Extraer los archivos:**
   - Ubica el archivo ZIP descargado en tu computadora.
   - Haz clic derecho y selecciona **Extraer aquí** (debe ser una carpeta APARTE de xampp, puede ser en el escritorio mismo).

3. **Navegar al directorio del proyecto:**
   - Abre una terminal o consola de comandos.
   - ingresa a la ruta donde está el proyecto.
     ```bash
     cd ruta/del/proyecto
     ```

4. **Instalar dependencias:**
   - Asegúrate de tener **Node.js** instalado.(NECESARIOOOOOO)
   - En la terminal, ejecuta:
     ```bash
     npm install
     ```

5. **Iniciar el servidor:**
   - Para iniciar el servidor, ejecuta:
     ```bash
     node index.js
     ```
6. **Crear en phpmyadmin la base de datos: **
   - Se llama "auth", ingresar el siguiente codigo sql: 
    CREATE TABLE `users` (
    `id` int(11) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `reset_token` varchar(255) DEFAULT NULL,
    `reset_token_expiry` datetime DEFAULT NULL
  )
8. **Probar los endpoints:**
   - El servidor estará disponible en `http://localhost:3000`.
   - Usa herramientas como **Postman**, **Insomnia**, o cURL para interactuar con la API.
## 🚀 Endpoints disponibles

### **Usuarios (Auth)**

1. **POST  http://localhost:3000/api/register**  
   - Registra un nuevo usuario.
   - **Cuerpo del request (JSON):**  
     ```json
     {
       "email": "joaquin@gmail.com",
       "password": "123456"
     }
     ```
   - **Respuesta:**  
     ```json
     {
       "message": "Usuario registrado con éxito."
     }
     ```

2. **POST  http://localhost:3000/api/login**  
   - Inicia sesión con un usuario registrado.
   - **Cuerpo del request (JSON):**  
     ```json
     {
       "email": "joaquin@gmail.com",
       "password": "123456"
     }
     ```
   - **Respuesta exitosa:**  
     ```json
     {
       "message": "Inicio de sesión exitoso.",
       "token": "eyJhbGciOiJIUzI1NiIsInR..."
     }
     ```
   - **Respuesta en caso de error:**  
     ```json
     {
       "message": "Credenciales inválidas."
     }
     ```

3. **POST  http://localhost:3000/api/recovery**
4.    - Recupera la contraseña.
   - **Cuerpo del request (JSON):**  
     ```json
     {
       "email": "joaquin@gmail.com",
     }
     ```

## 📌 Notas adicionales
- Las contraseñas están encriptadas con **bcrypt** y nunca se almacenan en texto plano.

import { Router } from "express";
import { signup, login } from "../controllers/user.controller";

const authRouter = Router();


/**
* @swagger
* /signup:
*   post:
*     summary: Create customer.
*     description: Creación de usuarios/clientes.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               mail:
*                 type: string
*                 description: Correo electrónico del cliente.
*               password:
*                 type: string
*                 description: Contraseña del cliente.
*               name:
*                 type: string
*                 description: Nombre del cliente.
*               lastName:
*                 type: string
*                 description: Apellido del cliente.
*     responses:
*       201:
*         description: Usuario creado exiwtosamente.
*         content:
*           application/json:
*             example:
*               message: Usuario creado exitosamente.
*
* /login:
*   post:
*     summary: Login de usuarios.
*     description: Login de usuarios en general.
*     requestBody:b
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               mail:
*                 type: string
*                 description: Correo electrónico del usuario.
*               password:
*                 type: string
*                 description: Contraseña del usuario.
*     responses:
*       200:
*         description: Inicio de sesión exitoso.
*         content:
*           application/json:
*             example:
*               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
*/


authRouter.post("/signup", signup);

authRouter.post("/login", login);

export default authRouter;

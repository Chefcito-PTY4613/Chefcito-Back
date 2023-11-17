const head = `
<head>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital@1&display=swap" rel="stylesheet">
<style>
img{
  border-radius: 30px;
}  
body { 
  font-family: 'Montserrat', sans-serif; 
  text-align: center; margin-top: 50px; 
  background-color:rgb(255,255,234)
}
  .message { color: #388e3c; }
  .logo { height: 150px; }
</style>
</head>
`
export default {
  good: `
  <html>
  ${head}
    <body>
      <img src="https://pub-06d273a10dd449bbb66bbf8b1de15465.r2.dev/ChefcitoLogo.png" alt="Chefcito Logo" class="logo">
      <div class="message">
        <h1>Verificación de Correo</h1>
        <p>¡Tu correo ha sido verificado con éxito!</p>
      </div>
    </body>
  </html>
`,
  badToken: `
<html>
${head}
  <body>
    <img src="https://pub-06d273a10dd449bbb66bbf8b1de15465.r2.dev/ChefcitoLogo.png" alt="Chefcito Logo" class="logo">
    <div class="message">
      <h1>Verificación de Correo</h1>
      <p>El token proporcionado no es válido.</p>
    </div>
  </body>
</html>
`,
  error: `
<html>
${head}
  <body>
    <img src="https://pub-06d273a10dd449bbb66bbf8b1de15465.r2.dev/ChefcitoLogo.png" alt="Chefcito Logo" class="logo">
    <div class="message">
      <h1>Verificación de Correo</h1>
      <p>Ha ocurrido un error durante la verificación del correo.</p>
    </div>
  </body>
</html>
`,
};

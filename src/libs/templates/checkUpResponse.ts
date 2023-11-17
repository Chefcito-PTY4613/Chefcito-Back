const head =(ok:Boolean=true)=> `
<head>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital@1&display=swap" rel="stylesheet">
<style>
img{
  border-radius: 30px;
}  
body { 
  font-family: 'Montserrat', sans-serif; 
  text-align: center; margin-top: 50px; 
  background-color:rgb(255,255,234);
  margin:auto;
  max-width: 600px;
}
.logo { 
  margin-top: 100px;
  height: 150px; 
}
${
  ok?`
    .message { color: #388e3c; }
    .data{
      padding:4px 2px;
      color: rgb(255,255,234);
      background-color: #388e3c;
    }
    `:`
    .message { color: #d32f2f; }
    .data{
      padding:4px 2px;
      color: rgb(255,255,234);
      background-color: #d32f2f;
    }
    `
}
  
</style>
</head>
`
export default {
  good: `
  <html>
  ${head(true)}
    <body>
      <img src="https://pub-06d273a10dd449bbb66bbf8b1de15465.r2.dev/ChefcitoLogo.png" alt="Chefcito Logo" class="logo">
      <div>
        <h1 class="message">Verificación de Correo</h1>
        <p class="data">¡Tu correo ha sido verificado con éxito!</p>
      </div>
    </body>
  </html>
`,
  badToken: `
<html>
${head(false)}
  <body>
    <img src="https://pub-06d273a10dd449bbb66bbf8b1de15465.r2.dev/ChefcitoLogo.png" alt="Chefcito Logo" class="logo">
    <div>
      <h1 class="message">Verificación de Correo</h1>
      <p class="data">El token proporcionado no es válido.</p>
    </div>
  </body>
</html>
`,
  error: `
<html>
${head(false)}
  <body>
    <img src="https://pub-06d273a10dd449bbb66bbf8b1de15465.r2.dev/ChefcitoLogo.png" alt="Chefcito Logo" class="logo">
    <div>
      <h1 class="message">Verificación de Correo</h1>
      <p class="data">Ha ocurrido un error durante la verificación del correo.</p>
    </div>
  </body>
</html>
`,
};

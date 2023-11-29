import { transforDateTime,transforDate } from "../fn.ratapan";

export const comfirmPay = (
  details:{name:string,cantidad:number,monto:number}[],
  propina:number,
  total:number,
  endTime:string,
  name:string)=> `<!DOCTYPE html>
<html>
<head> <style> .email-container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 12px; font-family: Arial, sans-serif;} .header { font-size: 24px; margin-bottom: 20px; } .content { text-align: left; margin-bottom: 20px; } .footer { font-size: 14px; color: #555; } .button { display: inline-block; margin-top: 20px; padding: 10px 20px; color: #fff; background-color: #008baa; border-radius: 5px; text-decoration: none;} 
</style>
</head>
<body>
    <div class="email-container">
        <div class="header">Confirmación de Pago</div>
        <div class="content">
            <h3>Hola ${name},</h3>
            <p>Queremos confirmar que hemos recibido tu pago. Aquí están los detalles de tu transacción:</p>
            <h3>Resumen de pedido</h3>
            <ul>
            ${
              details.map((detail) => `<li>${detail.name}${detail.cantidad>1?`(${detail.cantidad})`:''}: $${detail.monto}</li>`).join(' ')
            }
              <li>Propina: $${propina}</li>
          </ul>
          <h3>Monto final</h3>
            <ul>
              <li>Monto Pagado: $${total}</li>
              <li>Fecha de Pago: ${transforDate(endTime)} ${transforDateTime(endTime)}</li>
          </ul>
            <p>Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en contactarnos.</p>
        </div>

        <div class="footer">
            Gracias por tu compra,<br>
            Chefcito
        </div>

        <a href="https://chefcito-web.vercel.app/" class="button">Visita Nuestro Sitio</a>
    </div>
</body>
</html>`
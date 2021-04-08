const { request } = require('express')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
app.use(bodyParser.json())

app.post('/not-found', (request, response) => {
  requestLog(request)
  response.status(404)
     .send('response 404')
})


app.post('/not-found-delay', (request, response) => {
    setTimeout(() => {
      requestLog(request)
      response.status(404)
         .send('response 404 delayed 60s')
    }, 60000)
})

app.post('/internal-server-error', (request, response) => {
  requestLog(request)
  response.status(500)
     .send('response 500')
})

app.post('/internal-server-error-delay', (request, response) => {
     setTimeout(() => {
        requestLog(request)
        response.status(500)
       .send('response 500 delayed 60s')
    }, 60000)
})

// ITAU PIX AUTH FAKE
app.post('/api/oauth/token', (request, response) => {
     response.status(200)
             .json({
                "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YjdlMjQyYS1lNDYzLTRlNWUtYjVjNS04OTQzZWQwNTE3YjciLCJhdXQiOiJNQVIiLCJzaXRlIjoiY3RtbTIiLCJ2ZXIiOiJ2MS4wIiwidXNyIjoibnVsbCIsIm1iaSI6InRydWUiLCJpc3MiOiJodHRwczpcL1wvb3BlbmlkLml0YXUuY29tLmJyXC9hcGlcL29hdXRoXC90b2tlbiIsIkFjY2Vzc19Ub2tlbiI6Ikx5elN1Q2V5ZVA1Zk5Xc0ZCQTJ1UEZYVDZTVG56MkNkWE9KVXFqOE1pS20xZUowZVpYU0ZGSyIsInNvdXJjZSI6IlNBTkQiLCJleHAiOjE2MTc4OTU3NTYsImlhdCI6MTYxNzg5NTQ1NSwiZmxvdyI6IkNDIn0.BLtvUeMKC1YD3VsiLWXKKNkC6Vwll20MIe0qIxvc1z8",
                "token_type": "Bearer",
                "expires_in": 3600,
                "refresh_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2YjdlMjQyYS1lNDYzLTRlNWUtYjVjNS04OTQzZWQwNTE3YjciLCJhdXQiOiJNQVIiLCJzaXRlIjoiY3RtbTIiLCJ2ZXIiOiJ2MS4wIiwidXNyIjoibnVsbCIsIm1iaSI6InRydWUiLCJpc3MiOiJodHRwczpcL1wvb3BlbmlkLml0YXUuY29tLmJyXC9hcGlcL29hdXRoXC90b2tlbiIsIkFjY2Vzc19Ub2tlbiI6ImhEcGVscTREdU1ranFxQ2gySmlZUWtsVEZCY3NIRndwUkw0UG1QZ2tLNU9VNmwiLCJzb3VyY2UiOiJTQU5EIiwiZXhwIjoxNjE3ODk1NzU2LCJpYXQiOjE2MTc4OTU0NTUsImZsb3ciOiJDQyJ9.RkLvPj-Pc3bXhNfCImDzMluktEo1ry762eSDkm5qxIQ",
                "scope": "resource.READ",
                "active": true
             })
})

// ITAU PIX CREATE TRANSACTION FAKE
app.post('/sandbox/pix_recebimentos/v1/cob/:txid', (request, response) => {
  response.status(200)
          .json({
            "status": "ATIVA",
            "txid": request.params.txid,
            "revisao": 0,
            "location": "spi-h.itau.com.br/pix/qr/v2/ddeb191d-9c7f-4158-866c-7bac3d8c0789",
            "devedor": {
                "cpf": request.body.devedor.cpf,
                "nome": request.body.devedor.nome
            },
            "solicitacaoPagador": request.body.solicitacaoPagador,
            "calendario": {
                "criacao": "2021-04-08T12:29:12.075",
                "expiracao": request.body.calendario.expiracao
            },
            "valor": {
                "original": request.body.valor.original
            },
            "infoAdicionais": [
                {
                    "nome": "Campo 1",
                    "valor": "Informação Adicional1"
                },
                {
                    "nome": "Campo 2",
                    "valor": "Informação Adicional2 "
                }
            ],
            "chave": request.body.chave
          })
})

// ITAU PIX GET QRCODE FAKE
app.get('/sandbox/pix_recebimentos/v1/cob/:txid/qrcode', (request, response) => {

  if (request.params.txid != 'JPYTJLBRWEICBNOIWXSQGCEUEUNUHRFKXBR') {
    response.status(400)
            .json({
              "error": 'txid inválida'
            })
  }

  response.status(200)
          .json({
            "pix_link": "https://pix.bcb.gov.br/qr/MDAwMjAxMDEwMjExMjY5NTAwMTRCUi5HT1YuQkNCLlBJWDI1NzNzcGkuZGV2LmNsb3VkLml0YXUuY29tLmJyL2RvY3VtZW50b3MvMTk4ZTQ5YzUtMjMzMC00YWQ3LTlkMGItOTY3YzdiNTM3MTIyNTIwNDAwMDA1MzAzOTg2NTgwMkJSNTkyM1BNRCBHb3RoYW0gTmVnQSBjaW9zIE1FNjAwOVNBTyBQQVVMTzYyNDEwNTAzKioqNTAzMDAwMTdCUi5HT1YuQkNCLkJSQ09ERTAxMDUxLjAuMDYzMDQwODY2",
            "emv": "00020101021126950014BR.GOV.BCB.PIX2573spi.dev.cloud.itau.com.br/documentos/198e49c5-2330-4ad7-9d0b-967c7b5371225204000053039865802BR5923PMD Gotham NegA cios ME6009SAO PAULO62410503***50300017BR.GOV.BCB.BRCODE01051.0.063040866",
            "imagem_base64": "iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6AQAAAACgl2eQAAADCUlEQVR4Xu2XUW4cIRBE6YvA/W+Ro8BFIPWKsWU5kpWPbOVn8SaZhWep1F1dTNr5ef1q33e+rTdw1xu466+A2VqtXbuP3etMPY9zlrdjwPLnrNm1NceaNXtv426nAOliqw5K+1io3IBhoFyZsWuaE/UfgM1h0xpzTMqUBfRxXZB2ONylhy/Nej0wMe2fi+0Y4KUend1omcZHR7vufgigNMzLEDXFbL63Pj6bFQBkld57MS0KkEWfdhOg3sWAI0mYRUIJMkvGwq5VCJhWtwkwAWoXIcJvjRxw9WnL/YKQWxejPGKAxvZgEHWoBKlhErztmBhgafaMXCtqWKVDJQYc2oNndY5llncEspUDlOFFrXRA23QiUl9jwB7aPvhkoE5UGeQxBlyFLEaXCbrW+XT16wGe9Kcsk25JsH/oWgjw9PbGge+ysdAtgRAhwNm1iW+rXN5pV2oMuEaVTHlXL30iFaySXU+hAsBGpJulzAAclE3geEQGAIzCfcKrFv7VEVna3LAQMIcNyiue7lKSg1ppQ0OcAshPWWT4amNtarb4GgN8qcmwvlAk8qNRtC4GuEVKLn13fKlUUuxepQC+C9NWJ9ZlHRu5iLMUMPGrdhkZLKwLpvQfoXvXhoCDzsZP0beFgagefgkC0yWiVbxqFBmmn/Xh6tcDyxnGtUpskJ/Mb0dpDGBQnSJSJ7NKHYahaR+Fej3wWMSqMI/+Utmkmm6lgCewfICwmyPdHg4BGtRBkHp+m29VqbPyHCCPKL+pFzpJUiZIep9CBQAnOZ+nQwu3TP8bAybjqvJgkyI+DjLF07gQ4M5wXEibvtod5u0RGQDYKhhZFX3ca9hYuRID9GbDidql+kgt/eKCpYMpwGaVIAZGAaKObZyL1BygxTMgMUKXuOEXbQwBFEWaOt4tusQW/eKXQsDic0vE+17njA4SrjFg8n43XCwbZQsdfooCC4eSJJoXJVkRYJ/NSgHEOBIJ8wtYeAzQh0HpCjLop3GDeU4BtEU2kUpXR1YhQqlXDvhxvYG73sBd/wD4Df7+v4eqIoYgAAAAAElFTkSuQmCC"
          })
})

app.listen(port, () => {
  console.log(`Server testing http://localhost:${port}`)
})

const requestLog = (request) => {
  
  const logData = {
    method: request.method,
    host: request.headers.host,
    url: request.url,
    userAgent: request.headers['user-agent'],
    contentType: request.headers['content-type'],
    contentLength: request.headers['content-length'],

    receiveAt: new Date().toLocaleString()
  }

  console.log(logData)
}
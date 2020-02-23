const mp = require('mercadopago')

module.exports = class GetCreditCardToken {
  constructor({
    token,
    description,
    quantity,
    paymentMethod,
    email,
    installments, 
  }) {
    this._token = token,
    this._description = description,
    this._quantity = quantity,
    this._paymentMethod = paymentMethod,
    this._email = email,
    this._installments = installments

    this._configureMercadoPagoAPI();
  }

  async sendCardInformation() {
    return mp.payment.save({
      token: this._token,
      description: this._description,
      transaction_amount: Number(this._quantity),
      payment_method_id: this._paymentMethod,
      installments: this._installments,
      payer: {
        email: this._email
      }
    }).then(data => {
      this.log(data);
      return data;
    })
      .catch(err => {
        throw err
      });
  }

  _configureMercadoPagoAPI() {
    mp.configure({
      sandbox: true,
      access_token: 'TEST-4416090535218573-022305-7aff6900bf646b643db7b0d565d83cfa-237355490',
    });
  }

  log(data) {
    console.log('data => :', data);
  }

  static async treatResponse(res) {
    const mercadoPagoResponse = JSON.parse(JSON.stringify(res))
    
    return {
      transaction_id: mercadoPagoResponse.response.id,
      create_at: mercadoPagoResponse.response.date_created,
      payment_method_id: mercadoPagoResponse.response.payment_method_id,
      status: mercadoPagoResponse.response.status,
      transaction_amount: mercadoPagoResponse.response.transaction_amount,
    }
  }
}


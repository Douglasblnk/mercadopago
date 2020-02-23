<template>
  <div class="container">
    <div class="card">
      <div style="text-align: center">
        <h2>API Mercado Pago</h2>
      </div>
      <hr>
      <div class="content">
        <form id="app" @submit.prevent="checkForm">
          <input class="inputs" required v-model="email" type="text" name="email" placeholder="E-mail">

          <input class="inputs" required v-model="cardNumber" name="card-number" placeholder="Número do Cartão">

          <input class="inputs" required v-model="securityCode" min="0" type="number" name="security-code" placeholder="Código de Segurança">
          
          <div style="display: flex">
          <input class="inputs" style="margin-right: 5px;" required v-model="cardExpirationMonth" type="text" name="expiration-month" placeholder="Mês de validade">

          <input class="inputs" style="margin-left: 5px;" required v-model="cardExpirationYear" type="text" name="expiration-year" placeholder="Ano de validade">
          </div>

          <input class="inputs" required v-model="cardholderName" type="text" name="name" placeholder="Nome do titular">

          <select class="inputs" required v-model="docType" name="docType">
            <option disabled value="">Tipo de documento</option>
            <option value="CPF">Pessoa fisica</option>
            <option value="CNPJ">Pessoa Juridica</option>
          </select>

          <input class="inputs" required v-model="docNumber" type="text" name="cpf" :placeholder="docType">

          <select class="inputs" required v-model="installments" name="installments">
            <option disabled value="">Em quantas vezes?</option>
            <option value= 1>1x</option>
            <option value= 2>2x</option>
            <option value= 3>3x</option>
            <option value= 4>4x</option>
            <option value= 5>5x</option>
            <option value= 6>6x</option>
            <option value= 7>7x</option>
            <option value= 8>8x</option>
            <option value= 9>9x</option>
            <option value= 10>10x</option>
          </select>
          
          <div class="submit-btn">
            <input type="submit" value="Enviar">
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: 'blackopss7@hotmail.com',
      cardNumber: '5179 2195 9409 4591',
      securityCode: '636',
      cardExpirationMonth: '11',
      cardExpirationYear: '21',
      cardholderName: 'Douglas B.',
      docType: 'CPF',
      docNumber: '43553906081',
      installments: 1,

      token: '',

      axios: this.$http,
    }
  },

  mounted() {
    window.Mercadopago.setPublishableKey('TEST-1b175dd2-bb91-45c2-aef8-e794dc993c5d');
  },

  methods: {
    checkForm() {
      const error = Object.values(this.validateInputs(
        this.email,
        this.cardNumber,
        this.securityCode,
        this.cardExpirationMonth,
        this.cardExpirationYear,
        this.cardholderName,
        this.docType,
        this.docNumber,
        this.installments,
      ));

      if (error.length > 0) return this.$swal({
        icon: 'error',
        title: 'Preencha os campos corretamente!'
      });

      this.getToken({
        email: this.email,
        cardNumber: this.cardNumber,
        securityCode: this.securityCode,
        cardExpirationMonth: this.cardExpirationMonth,
        cardExpirationYear: this.cardExpirationYear,
        cardholderName: this.cardholderName,
        docType: this.docType,
        docNumber: this.docNumber,
        installments: this.installments,
      });
    },
    
    getToken({
      email,
      cardNumber,
      securityCode,
      cardExpirationMonth,
      cardExpirationYear,
      cardholderName,
      docType,
      docNumber,
      installments,
    } = {}) {
      const $form = {
        email,
        cardNumber,
        securityCode,
        cardExpirationMonth,
        cardExpirationYear,
        cardholderName,
        docType,
        docNumber,
        installments,
      }

      window.Mercadopago.createToken($form, (status, response) => {
        if (status !== 200 && status !== 201) return this.$swal({
          icon: 'error',
          title: 'Dados inválidos!'
        });

        this.swalPayment(response);
      });
    },

    swalPayment(response) {
      console.log('response :', response);
      const { id, public_key } = response;

      this.$swal({
        title: 'Informe os dados do pagamento',
        html: `
          <div style="text-align: center; display: flex; flex-direction: column;">
            <small style="font-family: roboto">Seu Token de acesso é:</small>
            <small style="font-family: roboto"><strong>${id}</strong></small>
          </div>
          <div style="margin: 20px 0">
            <div style="text-align: start;">
              <p style="">Descrição:</p>
              <input id="description" required type="text" style="width: 100%; padding: 15px; background-color: #eee; border: 0; border-radius: 7px;">
            </div>
            <div style="text-align: start;">
              <p style="">Quantia da transação:</p>
              <input id="quantity" required type="number" style="width: 100%; padding: 15px; background-color: #eee; border: 0; border-radius: 7px;">
            </div>
            <div style="text-align: start;">
              <p style="">Método de pagamento:</p>
              <input id="payment-method" required type="text" style="width: 100%; padding: 15px; background-color: #eee; border: 0; border-radius: 7px;">
            </div>
          </div>
        `,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#b64343',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => new Promise((resolve, reject) => {
          try {
            const description = document.getElementById("description").value
            const quantity = document.getElementById("quantity").value
            const paymentMethod = document.getElementById("payment-method").value

            if (!description || !quantity || !paymentMethod) return this.$swal.showValidationMessage('Por favor, preencha todos os campos!')

            this.sendPaymentData({
              token: id,
              public_key,
              description: description.toLowerCase(),
              quantity: Number(quantity),
              paymentMethod: paymentMethod.toLowerCase(),
              email: this.email,
              installments: this.installments,
            }).then(res => {
              this.clearFields();
              console.log('res :', res);
              return resolve(this.$swal({
                icon: 'success',
                title: res.transaction_id,
                confirmButtonColor: '#b64343',
                html: `
                  <div style="padding: 20px; background-color: #eee; border-radius: 8px;">
                    <p><strong>Data da Transação: </strong>${res.data.create_at}</p>
                    <p><strong>Método de pagamento: </strong>${res.data.payment_method_id}</p>
                    <p><strong>Quantia do pagamento: </strong>${res.data.transaction_amount}</p>
                    <p><strong>Status do pagamento: </strong>${res.data.status}</p>
                  </div>
                `,
              }));
            }).catch(err => {
              return reject(this.$swal({
                icon: 'error',
                title: err,
              }))
            })
          } catch (err) {
            throw err;
          }
        })
      })
    },

    async sendPaymentData({
      token,
      public_key,
      description,
      quantity,
      paymentMethod,
      email,
      installments,
    } = {}) {
      try {
        return this.axios.post('http://localhost:3000/', {
          token,
          public_key,
          description,
          quantity,
          paymentMethod,
          email,
          installments,
        }).then(res => res)
          .catch(err => {
            console.log('err :', err);
            throw err;
          })
      } catch (err) {
        return this.$swal({
          icon: 'error',
          text: err,
        })
      }
    },

    validateInputs: (email, cardNumber, securityCode, cardExpirationMonth, cardExpirationYear, cardholderName, docType, docNumber, installments) => ({
      ...(!email ? { email: 'false' } : ''),
      ...(!cardNumber ? { cardNumber: 'false' } : ''),
      ...(!securityCode ? { securityCode: 'false' } : ''),
      ...(!cardExpirationMonth ? { cardExpirationMonth: 'false' } : ''),
      ...(!cardExpirationYear ? { cardExpirationYear: 'false' } : ''),
      ...(!cardholderName ? { cardholderName: 'false' } : ''),
      ...(!docType ? { docType: 'false' } : ''),
      ...(!docNumber ? { docNumber: 'false' } : ''),
      ...(!installments ? { installments: 'false' } : ''),
    }),

    clearFields() {
      this.email = ''
      this.cardNumber = ''
      this.securityCode = ''
      this.cardExpirationMonth = ''
      this.cardExpirationYear = ''
      this.cardholderName = ''
      this.docType = ''
      this.docNumber = ''
      this.installments = ''
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .card {
    width: 500px;
    min-height: 500px;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 1px 15px -12px rgba(0,0,0,.42), 0 4px 4px 0 rgba(0,0,0,.12), 0 4px 4px -5px rgba(0,0,0,.2);
    h2 {
      letter-spacing: 2px;
    }
  }
  .content {
    width: 100%;
    input, select {
      margin: 10px 0;
    }
  }
  .inputs {
    width: 100%;
    padding: 20px;
    border: 0;
    background-color: #eee;
    border-radius: 7px;
    outline: none;
  }
  .submit-btn {
    width: 100%;
    margin-top: 50px;
    input {
      width: 100%;
      border: 0;
      border-radius: 7px;
      padding: 15px;
      color: white;
      outline: none;
      background-color: #ce5252;
      cursor: pointer;
      &:hover {
        background-color: #b64343;
      }
    }
  }
}
</style>
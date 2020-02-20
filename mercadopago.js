const mp = require('mercadopago');

const run = async () => {
  mp.configure({
    access_token: "13847134y1384791374"
  });  
  const token = await getToken();
  payment()

}

const getToken = async () => {
  const token = await mp.getAccessToken();
  return token;
}

const payment = () => {
  mp.payment.create(data()).then(function (mpResponse) {
    console.log('mpResponse', mpResponse);
  }).catch(function (mpError) {
    console.log(mpError);
  });
}

const data = token => {
  return {
    description: 'Buying a PS4',
    transaction_amount: 10500,
    payment_method_id: 'rapipago',
    payer: {
      email: 'test_user_3931694@testuser.com',
    },
  }
}

run();
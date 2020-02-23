const getCreditCardToken = require('../lib/GetCreditCardToken');

const getParameters = req => ({
  token: req.body.token || '',
  description: req.body.description || '',
  quantity: req.body.quantity || '',
  paymentMethod: req.body.paymentMethod || '',
  email: req.body.email || '',
  installments: req.body.installments || '',
});

const checkParameteres = ({
  token,
  description,
  quantity,
  paymentMethod,
  email,
  installments,
} = {}) => ({
  ...(!token ? { token: 'undefined' } : ''),
  ...(!description ? { description: 'undefined' } : ''),
  ...(!quantity ? { quantity: 'undefined' } : ''),
  ...(!paymentMethod ? { paymentMethod: 'undefined' } : ''),
  ...(!email ? { email: 'undefined' } : ''),
  ...(!installments ? { installments: 'undefined' } : ''),
});

const run = async req => {
    try {
      const parameters = getParameters(req);
      const errs = Object.entries(checkParameteres(parameters));

      if (errs.length > 0) throw errs;

      const response = await new getCreditCardToken(parameters).sendCardInformation();

      const treatedResponse = await getCreditCardToken.treatResponse(response)

      return treatedResponse;
    } catch (err) {
      console.log('ERROR v1/get.js => ', err);
      throw err
    }
};

module.exports = {
  run
}
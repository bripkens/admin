const Ajv = require('ajv');

const ajv = new Ajv();

exports.validate = (schema, config) => {
  const validate = ajv.compile(schema);
  const valid = validate(config);

  let message = '';
  if (validate.errors) {
    message = validate.errors.reduce((agg, error) => {
      agg += `- ${error.message} at path ${error.dataPath || '.'}\n`;
      return agg;
    }, '');
  }

  return {
    valid,
    message
  };
};

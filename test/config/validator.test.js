const {expect} = require('chai');
const Ajv = require('ajv');

const {validate} = require('../../lib/config/validator');
const schema = require('../../lib/config/schema.json');

describe('config/validator', () => {
  it('must compile schema successfully', () => {
    new Ajv().compile(schema);
  });

  it('must successfully parse valid config', () => {
    const result = validate(schema, {
      admin: {
        port: 2345
      }
    });
    expect(result.valid).to.equal(true);
    expect(result.message).to.equal('')
  });

  describe('missing properties', () => {
    it('must fail when required property admin is not defined', () => {
      const result = validate(schema, {});
      expect(result.valid).to.equal(false);
      expect(result.message).to.contain('- should have required property \'admin\' at path .')
    });

    it('must fail when required property admin.port is not defined', () => {
      const result = validate(schema, {admin: {}});
      expect(result.valid).to.equal(false);
      expect(result.message).to.contain('- should have required property \'port\' at path .admin')
    });
  });
});

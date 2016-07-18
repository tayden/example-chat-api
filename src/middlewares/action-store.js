const db = require('../database');
const auditlog = 'auditlog';

// Store the action defined at this.state.action if a response status is ok
module.exports = function *action_store(next) {
  if(this.status === 200) {
    const pkName = this.state.action.returning;
    const pkValue = this.body[pkName];

    yield db(auditlog).insert({
      record_pk_name: pkName,
      record_pk_value: pkValue,
      action: this.state.action
    });
  }
  yield next;
};

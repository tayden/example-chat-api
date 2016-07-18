/* This module defines default middleware stacks used by different API endpoints
 *
 * Each object defines action middleware layers that process the incoming data to appropriately
 * update or query the database.
 *
 * These functions are simply syntactic sugar to allow calling multiple generator middlewares for a
 * url endpoint in a repeatable way.
*/

const jsonBodyParser = require('../middlewares/parse-json-body');
const validate = require('../middlewares/validate');
const setType = require('../middlewares/set-type');
const setModel = require('../middlewares/set-model');
const setWhere = require('../middlewares/set-where');
const setReturning = require('../middlewares/set-returning');
const setForeign_key = require('../middlewares/set-foreign-key');
const parseQuerystring = require('../middlewares/parse-querystring');
const actionCreate = require('../middlewares/action-create');
const actionHandle = require('../middlewares/action-handle');
const actionStore = require('../middlewares/action-store');

module.exports = {
  // Pass this stack the model you want to GET one from.
  // Uses this.params to create a where query
  // Use the allow middleware to grant non local access to Google accounts
  getOne: function(model) {
    return function *(next) {
      yield setType('GET_ONE').call(this,
        setModel(model).call(this,
          setWhere.call(this,
            parseQuerystring.call(this,
              actionCreate.call(this,
                actionHandle.call(this, next)
              )
            )
          )
        )
      );
    };
  },

  // Pass this stack the model you want to GET all from.
  // Uses this.params to create a where query
  // Use the allow middleware to grant non local access to Google accounts
  getAll: function (model) {
    return function *(next) {
      yield setType('GET_ALL').call(this,
        setModel(model).call(this,
          setWhere.call(this,
            parseQuerystring.call(this,
              actionCreate.call(this,
                actionHandle.call(this, next)
              )
            )
          )
        )
      );
    };
  },

  // Pass this stack the model you want to POST to.
  // Uses this.params to create the foreign key relation
  // Use the allow middleware to grant non local access to Google accounts
  // Pass a `pk` string that matches the table definition if it is not 'id' so
  //  that the post request returns the new row object correctly
  post: function(model, pk = 'pk', validations={}) {
    return function *(next) {
      yield setType('POST').call(this,
        jsonBodyParser.call(this,
          validate(validations).call(this,
            setModel(model).call(this,
              setReturning(pk).call(this,
                setForeign_key.call(this,
                  actionCreate.call(this,
                    actionHandle.call(this,
                      actionStore.call(this, next)
                    )
                  )
                )
              )
            )
          )
        )
      );
    };
  },

  // Pass this stack the model you want to PUT to.
  // Uses this.params to create the where query and find the object to update.
  // Use the allow middleware to grant non local access to Google accounts
  // Pass a `pk` string that matches the table definition if it is not 'id' so
  //  that the post request returns the new row object correctly
  put: function(model, pk = 'pk', validations={}) {
    return function *(next) {
      yield setType('PUT').call(this,
        jsonBodyParser.call(this,
          validate(validations).call(this,
            setModel(model).call(this,
              setReturning(pk).call(this,
                setWhere.call(this,
                  actionCreate.call(this,
                    actionHandle.call(this,
                      actionStore.call(this, next)
                    )
                  )
                )
              )
            )
          )
        )
      );
    };
  },

  // Pass this stack the model you want to DELETE from.
  // Uses this.params to create the WHERE query
  // Use the allow middleware to grant non local access to Google accounts
  delete: function(model, pk = 'pk') {
    return function *(next) {
      yield setType('DELETE').call(this,
        setModel(model).call(this,
          setReturning(pk).call(this,
            setWhere.call(this,
              actionCreate.call(this,
                actionHandle.call(this,
                  actionStore.call(this, next)
                )
              )
            )
          )
        )
      );
    };
  }
};

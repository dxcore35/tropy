'use strict'

const { join } = require('path')
const { debug, warn } = require('../common/log')
const { Database } = require('../common/db')
const { ONTOLOGY } = require('../constants')
const { exec } = require('./cmd')
const { fail } = require('../dialog')
const mod = require('../models/ontology')
const { load } = require('../actions/ontology')
const { call, fork, take } = require('redux-saga/effects')

const command = ({ error, meta }) =>
  (!error && meta && meta.cmd === 'ontology')

module.exports = {
  *ontology({ file = join(ARGS.data, ONTOLOGY.DB), ...opts } = {}) {
    try {
      var db = new Database(file, 'w+', opts)

      if (yield call(db.empty)) {
        yield call(mod.create, db)
      } else {
        try {
          yield call(db.migrate, ONTOLOGY.MIGRATIONS)
        } catch (e) {
          warn({ stack: e.stack }, 'failed to migrate ontology database')
          yield call(fail, e, 'ontology.migrate')
        }
      }

      yield call(exec, { db }, load())

      while (true) {
        let action = yield take(command)
        yield fork(exec, { db }, action)
      }

    } catch (e) {
      warn({ stack: e.stack }, 'unexpected error in *ontology')

    } finally {
      if (db) {
        yield call(mod.vocab.prune, db)
        yield call(mod.label.prune, db)
        yield call(db.close)
      }

      debug('*ontology terminated')
    }
  }
}

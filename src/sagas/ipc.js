'use strict'

const { eventChannel } = require('redux-saga')
const {
  call, fork, put, take, select, takeEvery: every
} = require('redux-saga/effects')

const { ipcRenderer: ipc } = require('electron')
const { warn } = require('../common/log')
const { identity } = require('../common/util')
const history = require('../selectors/history')
const { getAllTags } = require('../selectors')
const { TAG, HISTORY } = require('../constants')


module.exports = {

  *forward(filter, { type, payload, meta }) {
    try {
      const event = meta.ipc === true ? type : meta.ipc
      const data = yield call(filter[event] || identity, payload)

      yield call([ipc, ipc.send], event, data)

    } catch (e) {
      warn({ stack: e.stack }, 'unexpected error in *ipc:forward')
    }
  },

  *receive() {
    const disp = yield call(channel, 'dispatch')

    while (true) {
      try {
        const action = yield take(disp)
        yield put(action)

      } catch (e) {
        warn({ stack: e.stack }, 'unexpected error in *ipc:receive')
      }
    }
  },

  *ipc() {
    yield every(({ meta }) => meta && meta.ipc, module.exports.forward, FILTER)
    yield fork(module.exports.receive)
  }

}


const FILTER = {
  *[HISTORY.CHANGED]() {
    const summary = yield select(history.summary)
    const messages = yield select(state => state.intl.messages)

    if (summary.undo != null) {
      summary.undo = messages[`action.${summary.undo}`] || summary.undo
    }

    if (summary.redo != null) {
      summary.redo = messages[`action.${summary.redo}`] || summary.redo
    }

    return summary
  },

  *[TAG.CHANGED]() {
    return yield select(getAllTags)
  }
}

function channel(name) {
  return eventChannel(emitter => {
    const listener = (_, ...actions) => {
      try {
        for (let action of actions) emitter(action)
      } catch (e) {
        warn({ stack: e.stack }, `unexpected error in channel "${name}"`)
      }
    }

    ipc.on(name, listener)

    return () => ipc.removeListener(name, listener)
  })
}

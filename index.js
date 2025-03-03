require('es6-promise').polyfill()
const fetch = require('isomorphic-fetch')
const querystring = require('querystring')

const apiVersion = 'v1'

function isPersonalRequest (url) {
  var isPersonal = false
  ;[
    '/overview',
    '/timer',
    '/time_entries',
    '/absences',
    '/users'
  ].map(function (personalUrl) {
    if (url.indexOf(personalUrl) === 0) isPersonal = true
  })

  return isPersonal
}

function HakunaClient (opts) {
  if (!opts.authToken) throw Error('authToken is required')

  this.userId = null
  var self = this

  this._authorizedRequest = function (url, params, cb) {
    if (!params.headers) params.headers = {}

    params.headers['Content-Type'] = 'application/json'
    if (!params.headers['X-Auth-Token']) {
      params.headers['X-Auth-Token'] = opts.authToken
    }

    if (opts.userAgent) params.headers['User-Agent'] = opts.userAgent

    var completeUrl = 'https://app.hakuna.ch/api/' +
      apiVersion + url

    if (self.userId && isPersonalRequest(url)) {
      var qs = querystring.stringify({ user_id: self.userId })
      completeUrl.indexOf('?') > -1 ? completeUrl += qs : completeUrl += '?' + qs
    }

    if (!cb) {
      return new Promise((resolve, reject) => {
        fetch(completeUrl, params)
          .then(function (response) {
            if (params.method && params.method.toLowerCase() === 'delete') {
              if (response.status === 200) return cb(null)
              return reject(new Error(response.status))
            }
            return response.json()
          })
          .then(function (json) {
            if (json.error) {
              return reject(json)
            }
            return resolve(json)
          })
          .catch(function (e) {
            return reject(e)
          })
      })
    }

    fetch(completeUrl, params)
      .then(function (response) {
        if (params.method && params.method.toLowerCase() === 'delete') {
          if (response.status === 200) return cb(null)
          return cb(new Error(response.status))
        }
        return response.json()
      })
      .then(function (json) {
        if (json.error) {
          return cb(json)
        }
        return cb(null, json)
      })
      .catch(function (e) {
        cb(e)
      })
  }
}

HakunaClient.prototype.setPersonalUserMode = function (userId) {
  this.userId = userId
}

HakunaClient.prototype.resetPersonalUserMode = function () {
  this.userId = null
}

HakunaClient.prototype.overview = function (cb) {
  return this._authorizedRequest('/overview', {}, cb)
}

HakunaClient.prototype.getOwnUser = function (cb) {
  return this._authorizedRequest('/users/me', {}, cb)
}

HakunaClient.prototype.getTimer = function (cb) {
  return this._authorizedRequest('/timer', {}, cb)
}

HakunaClient.prototype.startTimer = function (taskId, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  var body = {
    task_id: taskId
  }

  if (opts.startTime) body.start_time = opts.start_time
  if (opts.projectId) body.project_id = opts.projectId
  if (opts.note) body.note = opts.note

  return this._authorizedRequest('/timer', {
    method: 'POST',
    body: JSON.stringify(body)
  }, cb)
}

HakunaClient.prototype.stopTimer = function (endTime, cb) {
  if (typeof endTime === 'function') {
    cb = endTime
    endTime = null
  }

  var body = {}
  if (endTime) body.end_time = endTime

  return this._authorizedRequest('/timer', {
    method: 'PUT',
    body: JSON.stringify(body)
  }, cb)
}

HakunaClient.prototype.cancelTimer = function (cb) {
  return this._authorizedRequest('/timer', { method: 'DELETE' }, cb)
}

HakunaClient.prototype.listTimeEntries = function (date, cb) {
  var qs = querystring.stringify({ date: date })
  return this._authorizedRequest('/time_entries?' + qs, {}, cb)
}

HakunaClient.prototype.getTimeEntry = function (id, cb) {
  return this._authorizedRequest('/time_entries/' + id, {}, cb)
}

HakunaClient.prototype.createTimeEntry = function (entry, cb) {
  if (entry.taskId) {
    entry.task_id = entry.taskId
    delete entry.taskId
  }

  if (entry.projectId) {
    entry.project_id = entry.projectId
    delete entry.projectId
  }

  return this._authorizedRequest('/time_entries', {
    method: 'POST',
    body: JSON.stringify(entry)
  }, cb)
}

HakunaClient.prototype.updateTimeEntry = function (entry, cb) {
  var id = entry.id
  delete entry.id

  if (entry.taskId) {
    entry.task_id = entry.taskId
    delete entry.taskId
  }

  if (entry.projectId) {
    entry.project_id = entry.projectId
    delete entry.projectId
  }

  return this._authorizedRequest('/time_entries/' + id, {
    method: 'PATCH',
    body: JSON.stringify(entry)
  }, cb)
}

HakunaClient.prototype.deleteTimeEntry = function (id, cb) {
  return this._authorizedRequest('/time_entries/' + id, { method: 'DELETE' }, cb)
}

HakunaClient.prototype.listAbsences = function (year, cb) {
  var qs = querystring.stringify({ year: year })
  return this._authorizedRequest('/absences?' + qs, {}, cb)
}

HakunaClient.prototype.listManageableUsers = function (cb) {
  return this._authorizedRequest('/users', {}, cb)
}

HakunaClient.prototype.listProjects = function (cb) {
  return this._authorizedRequest('/projects', {}, cb)
}

HakunaClient.prototype.getOrganizationStatus = function (apiKey, cb) {
  if (typeof apiKey === 'function') {
    cb = apiKey
    apiKey = null
  }

  var params = {}
  if (apiKey) params.headers = { 'X-Auth-Token': apiKey }

  return this._authorizedRequest('/organization/status', params, cb)
}

HakunaClient.prototype.listTasks = function (cb) {
  return this._authorizedRequest('/tasks', {}, cb)
}

module.exports = HakunaClient

# hakuna-client

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This is a JavaScript client for the [Hakuna API](https://www.hakuna.ch/docs). It
supports all API functions and can be used with npm:

```bash
npm install --save hakuna-client
```

## Example

```javascript
const HakunaClient = require('hakuna-client')

const client = new HakunaClient({
  authToken: 'yourAuthToken'
})

client.overview(function (err, result) {
  if (err) console.error(err)

  console.log(result)
})
```

## Documentation

The official API documentation can be found on the [official site](https://www.hakuna.ch/docs).

To use the client you need to get your personal API key, you can find it by
clicking your name on the top right in your Hakuna and select "API".

Please note that the callbacks are [node style, error first](http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/).
The first parameter to the callback function always is an error. This makes
error handling pretty easy:

```javascript
client.overview(function (err, result) {
  if (err) // handle error here
})
```

**New in `2.0.0`**: If no callback function was given, a promise will be returned.

Example:

```javascript
let overview = await client.overview()
```

### Personal

Those endpoints allow you to make the requests in the context of another user
that you can manage. This can be specially useful when you're a team leader and
want to get information for your team members.

This client knows the "personal user mode" which can be enabled like follows:

```javascript
client.setPersonalUserMode('anotherUserId')

client.listTimeEntries('2016-11-11', (err, results) => {
  if (err) console.error(err)

  console.log(results)
})

client.resetPersonalUserMode()
```

#### `overview(cb)`

```
cb - function (err, result)
```

Quick overview over your key metrics.

#### `getOwnUser(cb)`

```
cb - function (err, user)
```

Get information on own user.

#### `getTimer(cb)`

```
cb - function (err, result)
```

Retrieves the timer.

#### `startTimer(taskId, opts, cb)`

```
taskId - The ID of the task
opts - object (optional)
  projectId - The id of the project
  startTime - Another start time
  note - A note
cb - function (err, result)
```

Starts a timer.

#### `stopTimer(endTime, cb)`

```
endTime - alternative end time (optional)
cb - function (err, result)
```

Stops a running timer.

#### `cancelTimer(cb)`

```
cb - function (err)
```

Cancels a running timer.

#### `listTimeEntries(date, cb)`

```
date - Date as string YYYY-MM-DD
cb - function (err, results)
```

Lists time entries for a given date.

#### `getTimeEntry(id, cb)`

```
id - ID of the time entry
cb - function (err, result)
```

Gets a single time entry.

#### `createTimeEntry(entry, cb)`

```
entry - object
  starts - Start date and time in ISO 8601 format
  ends - End date and time in ISO 8601 format
  taskId - The task id
  projectId - The project's id (optional)
  note - A note (optional)
cb - function (err, result)
```

Create a new time entry.

#### `updateTimeEntry(entry, cb)`

```
entry - object
  id - The id of the entry
  starts - Start date and time in ISO 8601 format
  ends - End date and time in ISO 8601 format
  taskId - The task id
  projectId - The project's id (optional)
  note - A note (optional)
cb - function (err, result)
```

Update an existing time entry.

#### `deleteTimeEntry(id, cb)`

```
id - The id of the entry
cb - function (err)
```

Delete an entry by it's id.

#### `listAbsences(year, cb)`

```
year - Year as string
cb - function (err, results)
```

List absences for a given year.

#### `listManageableUsers(cb)`

```
cb - function (err, results)
```

List users that can be managed.

### Global

#### `listTasks(cb)`

```
cb - function (err, results)
```

List all available tasks.

#### `listProjects(cb)`

```
cb - function (err, results)
```

List all active and archived projects.

### Organization

**Note:** An organizational API key is needed for this. If you've set up your
client with a personal API key but still want to use this functionality, you can
pass another API key as parameter.

#### `getOrganizationStatus(apiKey, cb)`

```
apiKey - organizational API key (optional)
cb - function (err, result)
```

Retrieves today’s presence/absence information about all users in your
organization.

## Tests

Right now the only thing that is being tested is the standard compliant coding
style. Run this with `npm test`.

## License

MIT

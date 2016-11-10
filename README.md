# hakuna-client

This is a JavaScript client for the [Hakuna API](https://www.hakuna.ch/docs). It
supports all API functions and can be used with npm:

```bash
npm install --save hakuna-client
```

## Example

```javascript
const HakunaClient = require('hakuna-client')

const client = new HakunaClient({
  authToken: 'yourAuthToken',
  company: 'yourCompanyName'
})

client.overview(function (err, result) {
  if (err) console.error(err)

  console.log(result)
})
```

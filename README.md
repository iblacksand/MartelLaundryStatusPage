# Martel Laundry Status Page

This is the code for the Martel laundry status page.

## Set-up

There isn't any required set-up; however, if you want a custom username and password for the admin site, update [./auth.js](https://github.com/iblacksand/MartelLaundryStatusPage/blob/master/auth.js), by changing the values for `name` and `password`.

```javascript
const auth = require('basic-auth')

const admin = { name: 'username', password: 'password' } // change username and password here

module.exports = function (request, response, next) {
  var user = auth(request)
  if (!user || !admin.name || admin.password !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="example"')
    return response.status(401).send()
  }
  return next()
}
```

If this is not changed, the default username is `username` and the default password is `password`.

## Running the server

To start the server, you must have `node.js` and `npm` installed. Then run the following command

```
npm start
```

## Testing

To test the website, start the server

```
npm start
```

By default, this will start the server on `localhost:3000`. First open `localhost:3000/admin/`. Login using your admin credentials(see [Set-up](#set-up) from above). By default, the username is `username`, and the password is `password`. Here you can enter in sample CSV strings that will act like the hardware server. 

Then you can open `localhost:3000`. This will show the website that will be available to the user. You can change the data on the admin site and the main page will change.
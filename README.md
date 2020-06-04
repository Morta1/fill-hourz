### To fill your hours make sure you have `hours.xlsx` file in the root folder.

```cmd
npm install
```

### Make sure your desired test file is running in package.json

```json
"scripts": {
    "start": "node generateHours.js && cypress run --browser chrome --spec 'cypress/integration/sqlink.js'"
}
```

### Update your credentials in cypress.env.json

```json
{
    "username": "",
    "password": "",
    "url": ""
}
```


To run the script: 

```cmd
npm start
```

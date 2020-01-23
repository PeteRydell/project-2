const express       = require("express");
const bodyParser    = require("body-parser");
const path          = require("path");
const fs            = require("file-system");
const PORT          = process.env.PORT || 8080;
const app           = express();

app.use((req, res, next) => {
  const auth = { login: 'mammoth', password: 'y@rnAdm1n_' };
  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');
  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    return next();
  }
  // Access denied...
  res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
  res.status(401).send('Authentication required.'); // custom message
});

app.use(
    express.urlencoded({
      extended: true
    })
  );

app.use(
    bodyParser.json
    ({extended: true}));

app.use(
    bodyParser.urlencoded ({
        extended: true
    })
);

app.use(express.json());
app.use(express.static("public"));

// const controllers = fs.readdirSync(path.join(__dirname, 'controllers'))
// controllers.forEach(controller => {
//   app.use(`/${controller}`, require(`./controllers/${controller}`))
// })
const previewRoute = require("./controllers/preview");
const storyRoute = require("./controllers/storytemplate");

app.use(previewRoute);
app.use(storyRoute);


app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });

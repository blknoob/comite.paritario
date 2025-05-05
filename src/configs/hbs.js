const expressHandlebars = require('express-handlebars');
const path = require('path');

function hbsConfig(app) {
  const hbs = expressHandlebars.create({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials'),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    }
  });

  // Registrar el helper aquí
  hbs.handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '../views'));
}

module.exports = hbsConfig;

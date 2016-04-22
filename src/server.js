import ect from 'ect';
import http from 'http';
import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import compression from 'compression';
import errorHandler from 'errorhandler';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import chokidar from 'chokidar-socket-emitter';
import { Presets, StyleSheet } from 'react-look';
import { configureStore } from './components/index';
import appReducer from './components/appReducer';
import config from './serverConfig';
import reactApp from './app-server';

const initialState = {};
const oneDay = 86400000;
const app = express();
const env = app.get('env');
const server = http.createServer(app);
const store = configureStore(initialState, appReducer);
const stylesConfig = Presets['react-dom'];
const renderer = ect({
  watch: true,
  root: config.root,
  ext: '.html'
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(favicon(config.favicon));
app.set('view engine', 'html');
app.engine('html', renderer.render);
app.set('views', config.views);

app.get('*', (req, res, next) => {
  if (!req.headers.host.match(/^www/)) {
    res.redirect(`www.${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

app.get('/auth/client', (req, res) => {
  res.send(config.client);
});

switch (env) {
  case 'development':
    app.use(express.static(config.src, {
      index: false
    }));
    // Disable caching for easier testing
    app.use((req, res, next) => {
      if (/\.(js|jsx|css|html)/.test(req.url)) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });
    chokidar({ app: server });
    break;
  case 'production':
    app.use(express.static(config.dist, {
      index: false,
      maxAge: oneDay
    }));
    app.use(compression());
    break;
  default:
    break;
}


app.use('*', (req, res, next) => {
  stylesConfig.userAgent = req.headers['user-agent'];
  stylesConfig.styleElementId = '_look';
  // Only non Ajax requests get rendered
  // On using ajax set the X-Requested-With header on client to XmlHttpRequest
  if (!req.xhr) {
    try {
      res.render('index.html', {
        env,
        meta: {
          title: 'Atados - Juntando Gente boa',
          description: 'Atados é uma rede social para voluntários e ONGs.',
          url: `${config.protocol}://${config.host}/`,
          image: ''
        },
        reactStyle: StyleSheet.renderToString(stylesConfig.prefixer),
        initialState: JSON.stringify(store.getState()),
        reactHtml: reactApp((req.baseUrl || req.originalUrl), store)
      });
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

app.use(errorHandler()); // has to be last

server.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port} in ${env} mode`);
});

export default app;

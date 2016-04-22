import path from 'path';

const rootPath = path.resolve(__dirname, '..');
const config = {};
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
config.env = env;
config.client = {
  id: process.env.ATADOS_CLIENT_ID,
  secret: process.env.ATADOS_CLIENT_SECRET
};
config.protocol = env === 'development' ? 'http' : 'https';
config.host = env === 'development' ? 'www.atadoslocal.com.br:9000' : 'www.atados.com.br';
config.root = rootPath;
config.port = 9000;
config.src = path.resolve(config.root, 'src');
config.dist = path.resolve(config.root, 'dist');
config.favicon = path.join(config.src, 'favicon.ico');
config.views = env === 'development' ? config.src : config.dist;

export default config;

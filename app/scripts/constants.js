const ENV = 'development';
const api = 'http://www.atadoslocal.com.br:8000/v1/';
const authApi = 'http://www.atadoslocal.com.br:9000/auth/client';
const storage = 'https://s3-sa-east-1.amazonaws.com/atadosapp/images/';
const selected = 'http://www.atadoslocal.com.br:8000/static/images/orange-pin.png';
const notselected = 'http://www.atadoslocal.com.br:8000/static/images/blue.png';
const facebookClientId = '430973993601792';
const locale = 'pt_BR';
const accessTokenCookie = 'access_token';
const csrfCookie = 'csrftoken';
const sessionIdCookie = 'sessionid';
const grantType = 'password';
const page_size = 30;
const active_cities = 4;
const static_page_size = 300;
const defaultZoom = 10;
const VOLUNTEER = 'VOLUNTEER';
const NONPROFIT = 'NONPROFIT';
const rioDeJaneiro = { id:6861, lat:-22.9082998, lng:-43.1970773 };
const saoPaulo = { id:9422, lat:-23.5505199, lng:-46.6333094 };
const curitiba = { id:5915, lat:-25.4808762, lng:-49.3044253 };
const brasilia = { id:1724, lat:-15.79211, lng:-47.897751 };
const distancia = { id:0, lat:0, lng:0 };
const weekdays = [
  { 1:'Segunda' },
  { 2:'Terça' },
  { 3:'Quarta' },
  { 4:'Quinta' },
  { 5:'Sexta' },
  { 6:'Sabado' },
  { 7:'Domingo' }
];
const periods = [
  { 0:'Manha' },
  { 1:'Tarde' },
  { 2:'Noite' }
];

export {
  ENV,
  api,
  authApi,
  storage,
  selected,
  notselected,
  facebookClientId,
  locale,
  accessTokenCookie,
  csrfCookie,
  sessionIdCookie,
  grantType,
  page_size,
  active_cities,
  static_page_size,
  defaultZoom,
  VOLUNTEER,
  NONPROFIT,
  rioDeJaneiro,
  saoPaulo,
  curitiba,
  brasilia,
  distancia,
  weekdays,
  periods
};

'use strict';

var  index = require('./controllers');
var request = require('request');
var config = require('./config/config');


var renderApp = function(params, status) {
  return function(req, res) {
    if (typeof status !== 'undefined') {
      res.status(status)
    }
    request(config.api_url + '/startup' , function(err, response, body) {
      params = params || {}
      params.initialState = params.initialState || {}
      try {
        params.initialState.startup = JSON.parse(body)
      } catch(e) {
        params.initialState.startup = {}
      }

      res.render(
        // view index
        "index",
        // Default params
        Object.assign(
          {
            'title': config.title + ' - Juntando Gente boa',
            metas: [
              {
                name: 'title',
                content: config.title + ' - Juntando Gente boa',
                repeat_with_prefix: ['og:']
              },
              {
                name: 'type',
                content: 'website',
                repeat_with_prefix: ['og:']
              },
              {
                name: 'image',
                content: 'https://s3.amazonaws.com/atados-us/images/landing_cover.jpg',
                repeat_with_prefix: ['og:'],
              },
              {
                name: 'description',
                content: 'Atados é uma rede social para voluntários e ONGs.',
                repeat_with_prefix: ['og:']
              },
              {
                name: 'keywords',
                content: 'voluntários, ongs, projetos, social, atados...',
                repeat_with_prefix: ['og:']
              }
            ]
          },
          params,
          {
            initialState: params.initialState ? JSON.stringify(params.initialState) : null
          }
        )
      )
    })
  }
}

/**
 * Application routes
 */
module.exports = function(app) {

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/partials/gdd/*', index.partials);
  app.get('/fonts/:file', index.fonts);
  app.get('/auth/client', function (req, res) {
    res.send({id: process.env.ATADOS_CLIENT_ID, secret: process.env.ATADOS_CLIENT_SECRET});
  });

  app
    .get('/', renderApp())
    .get('/sobre', renderApp())
    .get('/doador', renderApp())
    .get('/explore/vagas', renderApp())
    .get('/cadastro/vaga', renderApp());


  app.get('/ong/:slug', function(req, res) {
    request(config.api_url + '/nonprofit/' + req.params.slug + '/?format=json', function(err, response, body) {
      if (err) {
        return renderApp()(req, res)
      }


      var ong;
      try {
        ong = JSON.parse(body);
      } catch(e) {}
      var params;

      if (response.statusCode === 200) {
        params = {
          title: config.title + ' - ' + ong.name,
          initialState: {
            ong: ong
          },
          metas: [
            {
              name: 'title',
              content: config.title + ' - ' + ong.name,
              repeat_with_prefix: ['og:']
            },
            {
              name: 'description',
              content: ong.description,
              repeat_with_prefix: ['og:']
            },
            {
              name: 'image',
              content: typeof ong.image_url === 'string'
                ? ong.image_url.split("?")[0]
                : null ,
              repeat_with_prefix: ['og:']
            },
          ]
        };
      }

      return renderApp(params, response.statusCode)(req, res);
    })
  })

  app.get('/vaga/:slug', function(req, res) {
    request(config.api_url + '/project/' + req.params.slug + '/?format=json', (err, response, body) => {
      if (err) {
        return renderApp(undefined, 404)(req, res)
      }

      var project;
      try {
        project = JSON.parse(body);
      } catch(e) {}

      var params;

      if (response.statusCode === 200) {
        params = {
          title: config.title + ' - ' + project.name,
          initialState: {
            project: project
          },
          metas: [
            {
              name: 'title',
              content: config.title + ' - ' + project.name,
              repeat_with_prefix: ['og:']
            },
            {
              name: 'description',
              content: project.description,
              repeat_with_prefix: ['og:']
            },
            {
              name: 'image',
              content: typeof project.image_url === 'string'
                ? project.image_url.split("?")[0]
                : null ,
              repeat_with_prefix: ['og:']
            },
          ]
        }
      }

      return renderApp(params, response.statusCode)(req, res)
    })
  })

  app.get('/*', renderApp(undefined, 404));

};

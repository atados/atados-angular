const config = require('../../config')
const express = require('express');
const router = express.Router();
const request = require('request')

const renderApp = params => (req, res) => {
  request(config.api_url + '/startup' , (err, response, body) => {
    params = params || {}
    params.initialState = params.initialState || {}
    params.initialState.startup = JSON.parse(body)

    res.render(
      // view index
      "index",
      // Default params
      Object.assign(
        {
          google_maps_api_key: config.google_maps_api_key,
          'title': 'Atados - Juntando Gente boa'
        },
        params,
        {
          initialState: params.initialState ? JSON.stringify(params.initialState) : null
        }
      )
    )
  })
}

module.exports = () => {
  router
    .get('/ong/:slug', (req, res) => {
      request(config.api_url + '/nonprofit/' + req.params.slug + '/?format=json', (err, response, body) => {
        if (err) {
          return renderApp()(req, res)
        }

        const ong = JSON.parse(body)
        return renderApp({
          title: 'Atados | ' + ong.name,
          initialState: {
            ong: ong
          },
          metas: [
            {
              name: 'title',
              content: ong.name,
              repeat_with_prefix: ['og:']
            },
            {
              name: 'description',
              content: ong.description,
              repeat_with_prefix: ['og:']
            },
            {
              name: 'image',
              content: ong.image_url,
              repeat_with_prefix: ['og:']
            },
          ]
        })(req, res)
      })
    })
    .get('/vaga/:slug', (req, res) => {
      request(config.api_url + '/project/' + req.params.slug + '/?format=json', (err, response, body) => {
        if (err) {
          return renderApp()(req, res)
        }

        const project = JSON.parse(body)
        return renderApp({
          title: 'Atados | ' + project.name,
          initialState: {
            project: project
          },
          metas: [
            {
              name: 'title',
              content: project.name,
              repeat_with_prefix: ['og:']
            },
            {
              name: 'description',
              content: project.description,
              repeat_with_prefix: ['og:']
            },
            {
              name: 'image',
              content: project.image_url,
              repeat_with_prefix: ['og:']
            },
          ]
        })(req, res)
      })
    })
    .get('/about', renderApp({
      title: 'About',
      initialState: { user: { id: 1, name: 'John'}},
      metas: [
        { name: 'name', content: 'Profile 1' }
      ]
    }))
    .get('/', renderApp({
      title: 'Home',
      metas: [
        {
          name: "description",
          content: "Express Server with webpack hot reloading is an awesome module for you",
          repeat_with_prefix: [ 'og:' ]
        },
      ]
    }))
    .use(renderApp())
  return router
}

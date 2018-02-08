const page = require('page')
const index = require('Routes/index')
const notFound = require('Routes/not-found')

module.exports = () => {
  page('/', index.load, index.show)
  page('*', notFound.load, notFound.show)
  page()
}

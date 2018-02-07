const page = require('page')
const index = require('Routes/index')
const notFound = require('Routes/not-found')

require('admin-lte/dist/js/app')

module.exports = () => {
  page('/', index.load, index.show)
  page('*', notFound.load, notFound.show)
  page()
}

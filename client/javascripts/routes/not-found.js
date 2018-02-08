const indexTemplate = require('Templates/index.hbs')
const notFoundTemplate = require('Templates/contents/not-found.hbs')

module.exports = {
  load(ctx, next) {
    $('.wrapper').html(indexTemplate({
      template: notFoundTemplate(),
      title: 'Error',
      subtitle: 'Page not found',
    })).trigger('resize')
    next()
  },
  show(ctx) {
  },
}

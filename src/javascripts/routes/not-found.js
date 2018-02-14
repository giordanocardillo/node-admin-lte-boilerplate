import indexTemplate from 'Templates/index.hbs'
import styles from 'Stylesheets/routes/not-found.less'

const notFound = {
  load(ctx, next) {
    $('.wrapper').html(indexTemplate({
      styles,
      template: 'not-found',
      title: 'Error',
      subtitle: 'Page not found',
    })).trigger('resize')
    next()
  },
  show() {
  },
}

export default notFound

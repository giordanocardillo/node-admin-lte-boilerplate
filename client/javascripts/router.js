import page from 'page'
import index from 'Routes/index'
import notFound from 'Routes/not-found'

const router = () => {
  page('/', index.load, index.show)
  page('*', notFound.load, notFound.show)
  page()
}

export default router

import Handlebars from 'handlebars/runtime'

const dynamicContent = (templateName) => {
  //eslint-disable-next-line
  Handlebars.registerPartial(templateName, require(`Contents/${templateName}.hbs`))
  return templateName
}

export default dynamicContent

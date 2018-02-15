# Node AdminLTE boilerplate
This is a NodeJS [AdminLTE](https://adminlte.io/) 2.3.11 boilerplate using:
  * [Handlebars](http://handlebarsjs.com/)
  * [Webpack](https://webpack.js.org/)
  * [babel](http://babeljs.io/)
  * [PageJS](https://visionmedia.github.io/page.js/)
  * [LESS](http://lesscss.org/)
  * [Bootstrap 3.3.7](https://getbootstrap.com/docs/3.3/)
  * [CSS-Modules](https://github.com/css-modules/css-modules)

## How to use it
To use it just clone this repository, then you will have structure to make a simple AdminLTE project.

### Running development server
This application package ships with [webpack-dev-server](https://github.com/webpack/webpack-dev-server) and
it's configured to be run using `npm run dev-server` (or `yarn dev-server`) scripts. Once it's up you can find the
aplication served at <http://localhost:3000>. The dev server will automatically reaload the webpage when you change
any file referenced in the project sources.  

### Compiling for production
Once you have your project ready for production, just run the `npm run build` (or `yarn build`) script and
that will start a production ready build inside a `build` directory at the root of your application



## `public` folder
The `public` folder holds all the static files from which your application gets started on a webserver. Inside the 
folder you can find the following.

### `index.html` file
Is the **homepage** of the application. all the application contents are rendered inside the following html element.
```html
<div class="wrapper"></div>
```

### `favicon.ico` and `images/icon.png` files
Are the application favicons, whilst the `favicon.ico` is just imported inside the `index.html` at compile time thanks to [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin), the
`images/icon.png` is used to generate al icon sizes for all the resolutions thanks to
[favicons-webpack-plugin](https://github.com/jantimon/favicons-webpack-plugin).

## Javascripts

### `entry.js` file
This is the application entrypoint file, here you can find the main libraries imports and initializations.

### `javascripts` directory
In this directory you find the main router file `router.js` which defines your application's routes.
The used router is [page.js](https://visionmedia.github.io/page.js), you can find the documentation in
the linked homepage.

### `javascripts/lib` (`Libraries`) directory
In this directory you find all the additional library files which aren't included in the nodejs packages build. 
As an example, you can find there the `jquery-jvectormap-world-mill-en.js` from the
[jvectormap](http://jvectormap.com) project. 

This folder is mapped as `Libraries` inside the webpack configuration, so you can reference to this path
just by requiring from `Libraries`, e.g:

```js
import 'Libraries/jquery-jvectormap-world-mill-en'
```

### `javascripts/routes` (`Routes`) directory
In this directory you can find all the routes of your application, one file for every route.

This folder is **aliased** as `Routes` inside the webpack configuration, so you can reference to this path
just by requiring from `Routes`, e.g:

```js
import index from 'Routes/index'
```

## Stylesheets

### `stylesheets` (`Stylesheets`) directory
In this directory you find the `entry.less`, `global.less` and `variables.less`.
* `entry.less` contains all the main imports for all the used libraries style files
* `global.less` contains all the global rules applied to your application
* `variables.less` contains the variables and customization of library variables.
    * To customize variables from AdminLTE template, reference is here:
    [AdminLTE documentation](https://adminlte.io/themes/AdminLTE/documentation/)
    * To customize variables from bootstrap, reference is here:
    [Bootstrap documentation](https://getbootstrap.com/docs/3.3/)

This folder is **aliased** as `Stylesheets` inside the webpack configuration, so you can reference to this path
just by requiring from `Stylesheets`, e.g:
```js
import styles from 'Stylesheets/routes/dashboard-1.less'
```

### `stylesheets/lib` directory
this folder contains all the libraries customized stylesheets which aren't included in the nodejs modules.

### `stylesheets/routes` directory
In this directory you can find all the routes stylesheets for your application. These are compiled as
[CSS-Modules](https://github.com/css-modules/css-modules), they must be imported inside the js files that use them,
and then passed to the rendered template as compiled CSS-module. Basically:
* Import the `less` or `css` file inside the corresponding js route:
  ```js
  import styles from 'Stylesheets/routes/dashboard-1.less'
  ```
* Import the index template:
   ```js
   import indexTemplate from 'Templates/index.hbs'
   ```
* Compile template and pass `styles` to it:
   ```js
   indexTemplate({
     styles,
     template: 'dashboard-1',
     title: 'Dashboard',
     subtitle: 'Control panel',
   })
   ```
* You can use the defined less class names inside the handlebar template with `{{styles.className}}` which will get a 
unique name thanks to CSS-Modules.

## Templates

### `templates` (`Templates`) directory

The templates directory contains all the [Handlebars](http://handlebarsjs.com/) templates of the application.
At the directory root there is the `index.hbs` file, which holds the application base structure.

The `index.hbs` file holds a `dynamicContent` helper, which gets a `template` parameter that's a string matching
the subtemplate name to load in that page. To be more clear, every route uses the index template and renders inside
of it it's own subtemplate, so the main structure isn't altered and always looks the same.

You can of course make a route using a different layout and, in that case, you can just avoid using `index.hbs`.

**NOTE** All templates loaded from the `dynamicContent` helper need to be inside the `Templates/contents` folder.

This folder is **aliased** as `Templates` inside the webpack configuration, so you can reference to this path
just by requiring from `Templates`, e.g:
```js
import indexTemplate from 'Templates/index.hbs'
```

### `templates/contents` directory
This folder holds all the sub-templates that need to be rendered inside the `index.hbs` template by the
`dynamicContent` that loads only templates defined in this directory.

**NOTE** The `dynamicContent` helper was necessary because of a [handlebars-loader](https://github.com/pcardune/handlebars-loader) bug, which doesn't allow dynamic template import. When the library gets fixed, it could be removed from this boilerplate.

### `templates/helpers` directory
This directory contains all the handlebars custom helpers and is automatically included by webpack, so the helpers can be used without path referencing. 

### `templates/partials` directory
This directory contains all the partials (intended as parts of the main interface). This is just a destructuring of the main interface composition, to keep it all tidy.

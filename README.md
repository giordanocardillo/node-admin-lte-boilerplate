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

## Folder structure
``` 
node-adminlte-boilerplate
   ├── .babelrc
   ├── .editorconfig
   ├── .eslintrc.js
   ├── .gitignore
   ├── LICENSE
   ├── package.json
   ├── README.md
   ├── webpack.config.js
   ├── yarn.lock
   ├── public
   │   ├── favicon.ico
   │   ├── index.html
   │   └── images
   │       └── icon.png
   └── src
       ├── entry.js
       ├── javascripts
       │   ├── router.js
       │   ├── lib
       │   │   └── jquery-jvectormap-world-mill-en.js
       │   └── routes
       │       ├── index.js
       │       └── not-found.js
       ├── stylesheets
       │   ├── entry.less
       │   ├── global.less
       │   ├── variables.less
       │   ├── lib
       │   │   ├── bootstrap-config.less
       │   │   ├── bootstrap.less
       │   │   └── datepicker.less
       │   └── routes
       │       ├── dashboard-1.less
       │       └── not-found.less
       └── templates
           ├── index.hbs
           ├── contents
           │   ├── dashboard-1.hbs
           │   └── not-found.hbs
           ├── helpers
           │   ├── dynamicContent.js
           │   ├── eq.js
           │   └── toId.js
           └── partials
               ├── content-header.hbs
               ├── control-sidebar.hbs
               ├── footer.hbs
               ├── header.hbs
               └── sidebar.hbs
```

### `entry.js` file
This is the application entrypoint file, here you can find the main libraries imports and initializations.

### `javascripts` directory
In this directory you find the main router file `router.js` which defines your application's routes.
The used router is [page.js](https://visionmedia.github.io/page.js), you can find the documentation in
the linked homepage.

### `javascripts/lib` directory
In this directory you find all the additional library files which aren't included in the nodejs packages build. 
As an example, you can find there the `jquery-jvectormap-world-mill-en.js` from the
[jquery vector map](https://jqvmap.com/) project. 

This folder is mapped as `Libraries` inside the webpack configuration, so you can reference to this path
just by requiring from `Libraries`, e.g:

```js
import 'Libraries/jquery-jvectormap-world-mill-en'
```


### `javascripts/routes` directory
In this directory you can find all the routes of your application, one file for every route.

This folder is mapped as `Routes` inside the webpack configuration, so you can reference to this path
just by requiring from `Routes`, e.g:

```js
import index from 'Routes/index'
```

### `stylesheets` directory
In this directory you find the `entry.less`, `global.less` and `variables.less`.
* `entry.less` contains all the main imports for all the used libraries style files
* `global.less` contains all the global rules applied to your application
* `variables.less` contains the variables and customization of library variables.
    * To customize variables from AdminLTE template, reference is here:
    [AdminLTE documentation](https://adminlte.io/themes/AdminLTE/documentation/)
    * To customize variables from bootstrap, reference is here:
    [Bootstrap documentation](https://getbootstrap.com/docs/3.3/)

This folder is mapped as `Stylesheets` inside the webpack configuration, so you can reference to this path
just by requiring from `Stylesheets`, e.g:
```js
import styles from 'Stylesheets/routes/dashboard-1.less'
```

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


  

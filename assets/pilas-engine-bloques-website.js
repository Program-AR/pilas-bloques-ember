/* jshint ignore:start */

/* jshint ignore:end */

define('pilas-engine-bloques-website/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'pilas-engine-bloques-website/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('pilas-engine-bloques-website/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('pilas-engine-bloques-website/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('pilas-engine-bloques-website/helpers/fa-icon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FA_PREFIX = /^fa\-.+/;

  var warn = Ember['default'].Logger.warn;

  /**
   * Handlebars helper for generating HTML that renders a FontAwesome icon.
   *
   * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
   *                          For example, you can pass in either `fa-camera` or just `camera`.
   * @param  {Object} options Options passed to helper.
   * @return {Ember.Handlebars.SafeString} The HTML markup.
   */
  var faIcon = function faIcon(name, options) {
    if (Ember['default'].typeOf(name) !== 'string') {
      var message = "fa-icon: no icon specified";
      warn(message);
      return Ember['default'].String.htmlSafe(message);
    }

    var params = options.hash,
        classNames = [],
        html = "";

    classNames.push("fa");
    if (!name.match(FA_PREFIX)) {
      name = "fa-" + name;
    }
    classNames.push(name);
    if (params.spin) {
      classNames.push("fa-spin");
    }
    if (params.flip) {
      classNames.push("fa-flip-" + params.flip);
    }
    if (params.rotate) {
      classNames.push("fa-rotate-" + params.rotate);
    }
    if (params.lg) {
      warn("fa-icon: the 'lg' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"lg\"}}");
      classNames.push("fa-lg");
    }
    if (params.x) {
      warn("fa-icon: the 'x' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"" + params.x + "\"}}");
      classNames.push("fa-" + params.x + "x");
    }
    if (params.size) {
      if (Ember['default'].typeOf(params.size) === "string" && params.size.match(/\d+/)) {
        params.size = Number(params.size);
      }
      if (Ember['default'].typeOf(params.size) === "number") {
        classNames.push("fa-" + params.size + "x");
      } else {
        classNames.push("fa-" + params.size);
      }
    }
    if (params.fixedWidth) {
      classNames.push("fa-fw");
    }
    if (params.listItem) {
      classNames.push("fa-li");
    }
    if (params.pull) {
      classNames.push("pull-" + params.pull);
    }
    if (params.border) {
      classNames.push("fa-border");
    }
    if (params.classNames && !Ember['default'].isArray(params.classNames)) {
      params.classNames = [params.classNames];
    }
    if (!Ember['default'].isEmpty(params.classNames)) {
      Array.prototype.push.apply(classNames, params.classNames);
    }

    html += "<";
    var tagName = params.tagName || 'i';
    html += tagName;
    html += " class='" + classNames.join(" ") + "'";
    if (params.title) {
      html += " title='" + params.title + "'";
    }
    if (params.ariaHidden === undefined || params.ariaHidden) {
      html += " aria-hidden=\"true\"";
    }
    html += "></" + tagName + ">";
    return Ember['default'].String.htmlSafe(html);
  };

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(faIcon);

  exports.faIcon = faIcon;

});
define('pilas-engine-bloques-website/initializers/app-version', ['exports', 'pilas-engine-bloques-website/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('pilas-engine-bloques-website/initializers/export-application-global', ['exports', 'ember', 'pilas-engine-bloques-website/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('pilas-engine-bloques-website/router', ['exports', 'ember', 'pilas-engine-bloques-website/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('demo', { path: "/demo/:actividad" });
  });

  exports['default'] = Router;

});
define('pilas-engine-bloques-website/routes/demo', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model(params) {
      return { 'actividad': params.actividad };
    }

  });

});
define('pilas-engine-bloques-website/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return {
        version: "0.8.7",
        fecha: "2015-09-18",
        link_mac: "https://dl.dropboxusercontent.com/u/1335422/releases/pilas-engine-bloques/0.8.7/pilas-engine-bloques-0.8.7.dmg",
        link_windows: "https://dl.dropboxusercontent.com/u/1335422/releases/pilas-engine-bloques/0.8.7/pilas-engine-bloques-0.8.7.exe",
        link_deb: "http://repo.huayra.conectarigualdad.gob.ar/huayra/pool/main/p/pilas-engine-bloques/"
      };
    }
  });

});
define('pilas-engine-bloques-website/routes/index_template', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return {
        version: "VERSION",
        fecha: "FECHA",
        link_mac: "https://dl.dropboxusercontent.com/u/1335422/releases/pilas-engine-bloques/VERSION/pilas-engine-bloques-VERSION.dmg",
        link_windows: "https://dl.dropboxusercontent.com/u/1335422/releases/pilas-engine-bloques/VERSION/pilas-engine-bloques-VERSION.exe",
        link_deb: "http://repo.huayra.conectarigualdad.gob.ar/huayra/pool/main/p/pilas-engine-bloques/"
      };
    }
  });

});
define('pilas-engine-bloques-website/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","navbar navbar-default navbar-fixed-top");
        var el2 = dom.createTextNode("\n      ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container");
        var el3 = dom.createTextNode("\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","navbar-header");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","/");
        dom.setAttribute(el4,"class","navbar-brand");
        var el5 = dom.createTextNode("Pilas Bloques");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","navbar-toggle");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"data-toggle","collapse");
        dom.setAttribute(el4,"data-target","#navbar-main");
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","navbar-collapse collapse");
        dom.setAttribute(el3,"id","navbar-main");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","nav navbar-nav navbar-right");
        var el5 = dom.createTextNode("\n		         ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","http://www.pilas-engine.com.ar");
        dom.setAttribute(el6,"target","_blank");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("   www.pilas-engine.com.ar");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        dom.setAttribute(el1,"id","top");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","bs-docs-section clearfix");
        var el3 = dom.createTextNode("\n\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-lg-12");
        var el5 = dom.createTextNode("\n		");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n      ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("footer");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row center");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-lg-12");
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        dom.setAttribute(el5,"class","sprite logo-pilas-footer");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","hide");
        var el7 = dom.createTextNode("pilas engine");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n	  ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("\n            <div class='copyright'>&copy; Hugo Ruscitti</div>\n	  ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("\n          <div style=\"margin: 10px;\">Con el respaldo de <a target=\"_blank\" href=\"http://www.conectarigualdad.gob.ar\">Conectar Igualdad</a></div>\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 1, 3, 1, 1, 0]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [2, 1, 1, 1]),1,1);
        inline(env, morph0, context, "fa-icon", ["external-link"], {});
        content(env, morph1, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques-website/templates/demo', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("iframe");
        dom.setAttribute(el1,"width","100%");
        dom.setAttribute(el1,"frameborder","0");
        dom.setAttribute(el1,"height","600px");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var attrMorph0 = dom.createAttrMorph(element0, 'src');
        attribute(env, attrMorph0, element0, "src", concat(env, ["/web/#/desafios/", get(env, context, "model.actividad"), "?layout=false"]));
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques-website/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","jumbotron center");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("¡Vamos a programar!");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Te presentamos una herramienta para aprender\n  a programar realizando pequeños desafíos y juegos.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","descargas center");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("span");
        var el5 = dom.createTextNode("Descargá la versión ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" para tu sistema operativo:");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"id","descargas");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"class","btn btn-success btn-lg");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("   Huayra Linux");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"class","btn btn-info btn-lg");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("   Windows");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"class","btn btn-warning btn-lg");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("   Mac OS X");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","center");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"src","imagenes/preview.png");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","acercade");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Acerca de Pilas Bloques");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    Pilas Bloques es una nueva aplicación desarrollada para comenzar\n    a programar.\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    Encontrarás desafíos con diversos niveles de dificultad que te\n    acercarán al mundo de la programación por medio de bloques.\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("strong");
        var el4 = dom.createTextNode("¿Qué es programar con bloques?");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" Es desarrollar programas con\n    acciones e instrucciones incorporadas en bloques o piezas\n    prediseñadas. Tendrás que seleccionar y “encastrar” las piezas\n    adecuadas para lograr que el programa resuelva la\n    actividad propuesta.\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    Pilas Bloques es un proyecto que contempla más de 40\n    actividades diseñadas para\n    dar los primeros pasos en el mundo de la programación, que pueden ser\n    utilizadas tanto como secuencia de enseñanza o intercaladas con\n    otras actividades, dependiendo del criterio pedagógico de cada\n    profesor y aprendiz.\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    Las actividades se publicarán gradualmente, y la aplicación las podrá\n    descargar automáticamente cuando se conecte a Internet.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    Enseñar y aprender a programar es importante porque:\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode(" Incentiva a los estudiantes a crear sus propios programas,\n      proponiéndoles otros espacios más que el de usuarios de aplicaciones\n      realizadas por terceros.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("Promueve y estimula la confianza para resolver problemas.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("Trabajar con conceptos de las ciencias de la computación\n      permite desarrollar habilidades de pensamiento computacional.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","quienes-somos");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("¿Quiénes somos?");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-sm-4");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-sm-4");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","http://program.ar/");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"width","360");
        dom.setAttribute(el5,"height","100");
        dom.setAttribute(el5,"src","imagenes/logos/logo-programar.jpg");
        dom.setAttribute(el5,"class","logoProgramar attachment-full");
        dom.setAttribute(el5,"alt","logo-educacion");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-sm-4");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n\n\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-sm-3");
        var el4 = dom.createTextNode("\n  		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","http://www.fundacionsadosky.org.ar");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"width","360");
        dom.setAttribute(el5,"height","100");
        dom.setAttribute(el5,"src","imagenes/logos/logo-sadosky.jpg");
        dom.setAttribute(el5,"class","attachment-full");
        dom.setAttribute(el5,"alt","logo-sadosky");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-sm-3");
        var el4 = dom.createTextNode("\n  			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","http://www.educ.ar/");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"width","360");
        dom.setAttribute(el5,"height","100");
        dom.setAttribute(el5,"src","imagenes/logos/logo-educar.jpg");
        dom.setAttribute(el5,"class","attachment-full");
        dom.setAttribute(el5,"alt","logo-educar");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-sm-3");
        var el4 = dom.createTextNode("\n  			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","http://www.conectarigualdad.gob.ar/");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"width","360");
        dom.setAttribute(el5,"height","100");
        dom.setAttribute(el5,"src","imagenes/logos/logo-conectar.jpg");
        dom.setAttribute(el5,"class","attachment-full");
        dom.setAttribute(el5,"alt","logo-conectar");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-sm-3");
        var el4 = dom.createTextNode("\n  			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","http://pnide.educacion.gob.ar/");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"width","360");
        dom.setAttribute(el5,"src","imagenes/logos/logo-pnide.jpg");
        dom.setAttribute(el5,"class","attachment-full");
        dom.setAttribute(el5,"alt","logo-conectar");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-sm-4");
        var el4 = dom.createTextNode("\n  		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","http://www.mincyt.gob.ar/");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"width","360");
        dom.setAttribute(el5,"height","100");
        dom.setAttribute(el5,"src","imagenes/logos/logo-minsyt.jpg");
        dom.setAttribute(el5,"class","attachment-full");
        dom.setAttribute(el5,"alt","logo-minsyt");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-sm-4");
        var el4 = dom.createTextNode("\n  		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","http://portal.educacion.gov.ar/");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"width","360");
        dom.setAttribute(el5,"height","100");
        dom.setAttribute(el5,"src","imagenes/logos/logo-educacion.jpg");
        dom.setAttribute(el5,"class","attachment-full");
        dom.setAttribute(el5,"alt","logo-educacion");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-sm-4");
        var el4 = dom.createTextNode("\n  		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","http://www.anses.gob.ar/");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createElement("img");
        dom.setAttribute(el5,"width","360");
        dom.setAttribute(el5,"height","100");
        dom.setAttribute(el5,"src","imagenes/logos/logo-anses.jpg");
        dom.setAttribute(el5,"class","attachment-full");
        dom.setAttribute(el5,"alt","logo-anses");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","footer center");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Para obtener más información, ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","https://github.com/hugoruscitti/pilas-engine-bloques");
        var el4 = dom.createTextNode("visitá nuestro repositorio");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\nen github ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(".");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        dom.setAttribute(el2,"class","small");
        var el3 = dom.createTextNode("La versión mas reciente de Pilas Bloques es la ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(", publicada\n    en la fecha: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(".");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, element = hooks.element, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 5]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [1, 0]);
        var element3 = dom.childAt(element1, [3, 0]);
        var element4 = dom.childAt(element1, [5, 0]);
        var element5 = dom.childAt(fragment, [14]);
        var element6 = dom.childAt(element5, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 0]),1,1);
        var morph1 = dom.createMorphAt(element2,0,0);
        var morph2 = dom.createMorphAt(element3,0,0);
        var morph3 = dom.createMorphAt(element4,0,0);
        var morph4 = dom.createMorphAt(dom.childAt(element5, [1]),3,3);
        var morph5 = dom.createMorphAt(element6,1,1);
        var morph6 = dom.createMorphAt(element6,3,3);
        content(env, morph0, context, "model.version");
        element(env, element2, context, "bind-attr", [], {"href": "model.link_deb"});
        inline(env, morph1, context, "fa-icon", ["linux"], {});
        element(env, element3, context, "bind-attr", [], {"href": "model.link_windows"});
        inline(env, morph2, context, "fa-icon", ["windows"], {});
        element(env, element4, context, "bind-attr", [], {"href": "model.link_mac"});
        inline(env, morph3, context, "fa-icon", ["apple"], {});
        inline(env, morph4, context, "fa-icon", ["fa-github-alt"], {});
        content(env, morph5, context, "model.version");
        content(env, morph6, context, "model.fecha");
        return fragment;
      }
    };
  }()));

});
define('pilas-engine-bloques-website/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques-website/tests/helpers/resolver', ['exports', 'ember/resolver', 'pilas-engine-bloques-website/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('pilas-engine-bloques-website/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques-website/tests/helpers/start-app', ['exports', 'ember', 'pilas-engine-bloques-website/app', 'pilas-engine-bloques-website/router', 'pilas-engine-bloques-website/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('pilas-engine-bloques-website/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques-website/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques-website/tests/routes/demo.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/demo.js should pass jshint', function() { 
    ok(true, 'routes/demo.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques-website/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques-website/tests/routes/index_template.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index_template.js should pass jshint', function() { 
    ok(true, 'routes/index_template.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques-website/tests/test-helper', ['pilas-engine-bloques-website/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('pilas-engine-bloques-website/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques-website/tests/unit/routes/demo-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:demo', 'Unit | Route | demo', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('pilas-engine-bloques-website/tests/unit/routes/demo-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/demo-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/demo-test.js should pass jshint.'); 
  });

});
define('pilas-engine-bloques-website/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('pilas-engine-bloques-website/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/index-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/index-test.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('pilas-engine-bloques-website/config/environment', ['ember'], function(Ember) {
  var prefix = 'pilas-engine-bloques-website';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("pilas-engine-bloques-website/tests/test-helper");
} else {
  require("pilas-engine-bloques-website/app")["default"].create({"name":"pilas-engine-bloques-website","version":"0.0.0.c1b6fdf7"});
}

/* jshint ignore:end */
//# sourceMappingURL=pilas-engine-bloques-website.map
'use strict';

angular.module('bjLab')
	.controller('articlesCtrl', ['$scope', 'configBasic', 'wordpress', function($scope, configBasic, wordpress) {

		// https://deliciousbrains.com/wp-rest-api-customizing-endpoints-adding-new-ones/

		$scope.routeImg = configBasic.urlImg;

		$scope.post = {
    "id": 4534,
    "date": "2016-03-01T14:35:10",
    "date_gmt": "2016-03-01T14:35:10",
    "guid": {
        "rendered": "http://www.mmfilesi.com/?p=4534"
    },
    "modified": "2016-03-01T18:28:17",
    "modified_gmt": "2016-03-01T18:28:17",
    "slug": "angular-y-polymer",
    "type": "post",
    "link": "http://www.mmfilesi.com/blog/angular-y-polymer/",
    "title": {
        "rendered": "angular y polymer"
    },
    "content": {
        "rendered": "<p>Polymer me entusiasma y creo que los web components son formidables, el próximo episodio del desarrollo front; sin embargo, no tengo nada claro que se puedan manejar sin estar soportados por un framework js más clásico, como angular, ember o backbone. El planteamiento que hay debajo del <a href=\"https://developers.google.com/web/tools/polymer-starter-kit/\">polymer starter kit</a>, una especie de boilerplate para trabajar con polymer, es interesante: como las <a href=\"https://es.wikipedia.org/wiki/Matrioska\">matrioskas </a>rusas que albergan una muñeca dentro de otra, los componentes se entrelazan entre sí para terminar formando un supercomponente que es la s<em>ingle page application</em> final.</p>\n<p>Sin embargo, este armazón no es suficiente, ni de lejos, para soportar una aplicación grande, con cientos de vistas, decenas de llamadas rest y no sé cuántos controladores y helpers varios. Ojo, esto no significa que no existan en polymer técnicas lazy load y demás estrategias de optimización que vayan dosificando cargas para que la aplicación no se sature; sino que la sustentación es frágil, complicada de trabajar en equipos grandes y de testar. Dicho de otra manera, una casa no se construye apilando una cosa encima de otra, sino que primero se arma una estructura sólida y luego se ponen las paredes, la luz, la fontanería y todos los demás componentes.</p>\n<p>Al menos para mí, por lo tanto, polymer necesita algo más sólido por debajo, pero ¿necesitan estos frames holísticos, que en teoría te aportan todo lo que necesitas, apoyarse en polymer?</p>\n<p>Lo primero que pensé cuando conocí polymer es que no tenía mucho sentido, pues en cierta manera las directivas ya están cumpliendo el papel de los componentes polymerescos. Pero estaba partiendo de un planteamiento equivocado, ya que se me había olvidado el gran problema de trabajar con angular y es que solo se lleva bien consigo mismo. Sí, tenemos una directiva formidable, un alarde ingenio y saber hacer, pero solo podremos reutilizarla en otro proyecto angular, puesto que estará sembrada de sintaxtis angularesca incompatible con nada que viva más allá de este framework. Sin embargo, un web component es -por definición- universal. No se casa con nadie. Es una pieza que deberíamos poder utilizar en cualquier contexto. Por lo tanto, al menos para mí, no solo se puede, sino que se debe combinar angular con polymer.</p>\n<p>Comprendida la necesidad, veamos ahora cómo desarrollar la función (y sí, ya sé que hay módulos que hacen esto, pero me interesa que comprendamos lo que hay por debajo).</p>\n<h4>Desde polymer hacia el mundo exterior</h4>\n<p>Antes de ver el caso concreto de angular, creo que es interesante saber cómo puede comunicarse polymer con el mundo exterior, algo en teoría complicado por el propio concepto de encapsulación que rodea a los web components. Y digo en teoría porque por fortuna contamos con algo capaz de sortear cualquier closure y son los<a href=\"https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener\"> listeners</a>.</p>\n<p>Como es sabido, podemos enganchar eventos personalizados a cualquier elemento del dom. Por ejemplo, así  engancharíamos con document el evento «foo-changed» (como si fuera un click o cualquier otro normal).</p>\n<div class='prettyprint'></p>\n<p>document.addEventListener('foo-changed', function (e) {</p>\n<p style=\"padding-left: 30px;\">console.log('foo ha cambiado');</p>\n<p>}, true);</p>\n<p></div>\n<p>Y para lanzar ese evento es tan sencillo como usar el método dispatchEvent():</p>\n<div class='prettyprint'></p>\n<p>var myEvent = new CustomEvent(\"foo-changed\");</p>\n<p>document.body.dispatchEvent(myEvent);</p>\n<p></div>\n<p>Bueno, en realidad habría que añadir<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill\"> un polyfill</a> para que funcionase también en <del>la tostadora</del> el explorer, pero vamos, que no es nada complicado.</p>\n<div class='prettyprint'></p>\n<p>(function () {</p>\n<p style=\"padding-left: 30px;\">if ( typeof window.CustomEvent === \"function\" ) return false;</p>\n<p style=\"padding-left: 60px;\">function CustomEvent ( event, params ) {</p>\n<p style=\"padding-left: 60px;\">params = params || { bubbles: false, cancelable: false, detail: undefined };</p>\n<p style=\"padding-left: 60px;\">var evt = document.createEvent( 'CustomEvent' );</p>\n<p style=\"padding-left: 60px;\">evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );</p>\n<p style=\"padding-left: 60px;\">return evt;</p>\n<p style=\"padding-left: 30px;\">}</p>\n<p style=\"padding-left: 30px;\">CustomEvent.prototype = window.Event.prototype;</p>\n<p style=\"padding-left: 30px;\">window.CustomEvent = CustomEvent;</p>\n<p>})();</p>\n<p></div>\n<p>Por lo tanto, para comunicar un componente polymeresco con el mundo exterior basta con lanzar el customEvent que se está escuchando desde la página que lo alberga.</p>\n<div class='prettyprint'></p>\n<p>&lt;dom-module id=\"host-component\"&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;template&gt;</p>\n<p style=\"padding-left: 60px;\">&lt;button<strong> on-tap=\"setFoo\"</strong>&gt;Cambiar foo&lt;/button&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;/template&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;script&gt;</p>\n<p style=\"padding-left: 30px;\">Polymer({</p>\n<p style=\"padding-left: 60px;\">is: 'host-component',</p>\n<p style=\"padding-left: 60px;\"><strong>setFoo: function() {</strong></p>\n<p style=\"padding-left: 90px;\"><strong>var myEvent = new CustomEvent(\"foo-changed\");</strong></p>\n<p style=\"padding-left: 90px;\"><strong>document.body.dispatchEvent(myEvent);</strong></p>\n<p style=\"padding-left: 60px;\"><strong>}</strong></p>\n<p style=\"padding-left: 30px;\">});</p>\n<p style=\"padding-left: 30px;\">&lt;/script&gt;</p>\n<p>&lt;/dom-module&gt;</p>\n<p></div>\n<p>Y es más sencillo aún si <a href=\"http://www.mmfilesi.com/blog/polymer-7-propiedades/\">cuando definimos una propiedad</a> le asignamos true al flag notify, pues de forma automática polymer lanza un evento hacia arriba formado por el nombre de la propiedad más el sufijo changed cada vez que cambia ^^.</p>\n<div class='prettyprint'></p>\n<p>Polymer({</p>\n<p style=\"padding-left: 30px;\">is: 'host-component',</p>\n<p style=\"padding-left: 30px;\">properties: {</p>\n<p style=\"padding-left: 60px;\">foo: {</p>\n<p style=\"padding-left: 90px;\">type: String,</p>\n<p style=\"padding-left: 90px;\">value: \"Haga Basin\",</p>\n<p style=\"padding-left: 90px;\"><strong>notify: true</strong></p>\n<p style=\"padding-left: 60px;\">}</p>\n<p style=\"padding-left: 30px;\">},</p>\n<p style=\"padding-left: 30px;\">setFoo: function() {</p>\n<p style=\"padding-left: 60px;\"><span class=\"color-code-comment\">/* Al estar notify en true, de forma automática</span></p>\n<p style=\"padding-left: 60px;\"><span class=\"color-code-comment\">se dispara el evento foo-changed */</span></p>\n<p style=\"padding-left: 60px;\">this.foo = \"hey hey\";</p>\n<p style=\"padding-left: 30px;\">}</p>\n<p>});</p>\n<p></div>\n<p>Entendido esto, vamos ya sí con angular.</p>\n<h4>Desde angular hacia polymer</h4>\n<p>El camino que va desde fuera hacia dentro carece de obstáculos. Como<a href=\"https://www.youtube.com/watch?v=1sx6YNn58OQ&amp;index=15&amp;list=PLOU2XLYxmsII5c3Mgw6fNYCzaWrsM3sMN\"> a polymer le importa un pimiento desde dónde se cambia un atributo,</a> el cual se liga a una propiedad, el binding de angular se refleja en los componentes de angular. Esto queda más claro en código (pongo el ejemplo más sencillo que puedo, para evitar ruido ambiental, por lo que me salto el controller as, el vulcanize y cualquier otra fórmula que desvíe la atención).</p>\n<p>En el index, que es el receptáculo base de la single page, incluimos <span style=\"color: #800080;\">polymer</span> y <span style=\"color: #0000ff;\">angular.</span></p>\n<div class='prettyprint'></p>\n<p>&lt;!doctype html&gt;</p>\n<p>&lt;html class=\"no-js\" lang=\"es\"&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;head&gt;</p>\n<p style=\"padding-left: 30px;\"><span class=\"color-code-comment\">&lt;!-- ... mandangas varias del head ... --&gt;</span></p>\n<p style=\"padding-left: 60px;\"><span class=\"color-code-violet\">&lt;script src=\"bower_components/webcomponentsjs/webcomponents-lite.min.js\"&gt;&lt;/script&gt;</span></p>\n<p style=\"padding-left: 60px;\"><span class=\"color-code-violet\">&lt;link rel=\"import\" href=\"bower_components/polymer/polymer.html\"&gt;</span></p>\n<p style=\"padding-left: 60px;\"><span class=\"color-code-violet\">&lt;link rel=\"import\" href=\"app/components/foo-component.html\"&gt;</span></p>\n<p style=\"padding-left: 30px;\">&lt;/head&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;body <span style=\"color: #0000ff;\">ng-app=\"bjLab\"</span>&gt;</p>\n<p style=\"padding-left: 60px;\"><span class=\"color-code-blue\">&lt;script src=\"/bower_components/angular/angular.min.js\"&gt;&lt;/script&gt;</span></p>\n<p style=\"padding-left: 60px;\"><span class=\"color-code-blue\">&lt;script src=\"/app/app.js\"&gt;&lt;/script&gt;</span></p>\n<p style=\"padding-left: 60px;\"><span class=\"color-code-blue\">&lt;script src=\"/app/main/main.js\"&gt;&lt;/script&gt;</span></p>\n<p style=\"padding-left: 30px;\">&lt;/body&gt;</p>\n<p>&lt;/html&gt;</p>\n<p></div>\n<p>Escribimos un controlador sencillo, que se limite a bindear una cadena en el scope.</p>\n<div class='prettyprint'></p>\n<p><span class=\"color-code-comment\">main.js</span></p>\n<p>angular.module('bjLab').controller('main', ['$scope', function($scope) {</p>\n<p style=\"padding-left: 30px;\">$scope.bar = 'Bazinga!';</p>\n<p>}]);</p>\n<p></div>\n<p>Y en la vista cargamos el componente y añadimos un botón para cambiar, desde angular, el valor de un atributo que se leerá desde polymer.</p>\n<div class='prettyprint'></p>\n<p>...</p>\n<p>&lt;div ng-controller='main'&gt;</p>\n<p style=\"padding-left: 30px;\"><span style=\"color: #800080;\">&lt;foo-component</span><strong><span style=\"color: #800080;\"> dinamic-data=\"</span></strong><span style=\"color: #0000ff;\"><strong>{{bar}<span style=\"color: #0000ff;\">}</span></strong></span><span style=\"color: #800080;\">\"&gt;&lt;/foo-component&gt;</span></p>\n<p>&lt;p&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;button ng-click=\"bar='Haga Basin'\"&gt;set dinamicData&lt;/button&gt;</p>\n<p>&lt;/p&gt;</p>\n<p>&lt;/div&gt;</p>\n<p>...</p>\n<p></div>\n<p>Preparamos el componente de polymer, en el cual definimos la propiedad que hemos incluido como atributo y a esta le añadimos un observer que se dispare cuando cambia el valor.</p>\n<div class='prettyprint'></p>\n<p>&lt;dom-module id=\"foo-component\"&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;template&gt;</p>\n<p style=\"padding-left: 60px;\">dinamicData is {{dinamicData}}</p>\n<p style=\"padding-left: 30px;\">&lt;/template&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;script&gt;</p>\n<p style=\"padding-left: 60px;\">Polymer({</p>\n<p style=\"padding-left: 90px;\">is: 'foo-component',</p>\n<p style=\"padding-left: 90px;\">properties: {</p>\n<p style=\"padding-left: 120px;\"><strong>dinamicData: {</strong></p>\n<p style=\"padding-left: 150px;\"><strong>type: String,</strong></p>\n<p style=\"padding-left: 150px;\"><strong>observer: 'fooIsChanged'</strong></p>\n<p style=\"padding-left: 120px;\"><strong>}</strong></p>\n<p style=\"padding-left: 90px;\">},</p>\n<p style=\"padding-left: 90px;\">fooIsChanged: function() {</p>\n<p style=\"padding-left: 120px;\">console.log('foo is changed');</p>\n<p style=\"padding-left: 90px;\">}</p>\n<p style=\"padding-left: 60px;\">});</p>\n<p style=\"padding-left: 30px;\">&lt;/script&gt;</p>\n<p>&lt;/dom-module&gt;</p>\n<p></div>\n<p>¡Ale op! Si cambiamos el atributo desde angular, polymer lo recoge en el binding y el observer. Fantástico.</p>\n<p><a href=\"http://www.mmfilesi.com/wp-content/uploads/2016/03/angular-polimer.png\" rel=\"attachment wp-att-4541\"><img class=\"aligncenter size-full wp-image-4541\" src=\"http://www.mmfilesi.com/wp-content/uploads/2016/03/angular-polimer.png\" alt=\"angular-polimer\" width=\"185\" height=\"272\" /></a></p>\n<h4>Desde polymer hacia angular</h4>\n<p>El camino inverso es igual de sencillo si jugamos con los listeners. Para que se entienda, nos llevamos la función que cambia el valor al componente. Es decir, en la vista nos queda solo algo así:</p>\n<div class='prettyprint'></p>\n<p>&lt;div ng-controller='main'&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;foo-component dinamic-data=\"{{bar}}\"&gt;&lt;/foo-component&gt;</p>\n<p>&lt;/div&gt;</p>\n<p></div>\n<p>Y en el componente añadimos la función y, lo que es más importante, declaramos el notify de la propiedad como true.</p>\n<div class='prettyprint'></p>\n<p>&lt;dom-module id=\"foo-component\"&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;template&gt;</p>\n<p style=\"padding-left: 60px;\">dinamicData is {{dinamicData}}</p>\n<p style=\"padding-left: 60px;\">&lt;p&gt;</p>\n<p style=\"padding-left: 90px;\">&lt;button on-tap=\"setDinamicData\"&gt;set dinamicData&lt;/button&gt;</p>\n<p style=\"padding-left: 60px;\">&lt;/p&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;/template&gt;</p>\n<p style=\"padding-left: 30px;\">&lt;script&gt;</p>\n<p style=\"padding-left: 60px;\">Polymer({</p>\n<p style=\"padding-left: 90px;\">is: 'foo-component',</p>\n<p style=\"padding-left: 90px;\">properties: {</p>\n<p style=\"padding-left: 120px;\">dinamicData: {</p>\n<p style=\"padding-left: 120px;\">type: String,</p>\n<p style=\"padding-left: 120px;\"><strong>notify: true</strong></p>\n<p style=\"padding-left: 120px;\">}</p>\n<p style=\"padding-left: 90px;\">},</p>\n<p style=\"padding-left: 90px;\">setDinamicData: function() {</p>\n<p style=\"padding-left: 120px;\"><strong>this.set('dinamicData', 'Haga Basin');</strong></p>\n<p style=\"padding-left: 90px;\">}</p>\n<p style=\"padding-left: 60px;\">});</p>\n<p style=\"padding-left: 30px;\">&lt;/script&gt;</p>\n<p>&lt;/dom-module&gt;</p>\n<p></div>\n<p>Ahora, sabiendo que el evento que se dispara de forma automática es el nombre de la propiedad con las mayúsculas convertidas en guiones y el añadido -changed, tan solo tenemos que añadir el listener en el controlador main.js.</p>\n<div class='prettyprint'></p>\n<p>angular.module('bjLab').controller('main', ['$scope', function($scope) {</p>\n<p style=\"padding-left: 30px;\">$scope.bar = 'Bazinga!';</p>\n<p style=\"padding-left: 30px;\">document.addEventListener('dinamic-data-changed', function (e) {</p>\n<p style=\"padding-left: 60px;\">console.log('desde el controlador sé que foo ha cambiado');</p>\n<p style=\"padding-left: 30px;\">}, true);</p>\n<p>}]);</p>\n<p></div>\n<p>Bueno, en realidad, para estar seguros de que la escucha no se queda en el aire cuando cambiamos de controlador, habría que removerla en el on destroy del $scope.</p>\n<div class='prettyprint'></p>\n<p>function fooChanged(e) {</p>\n<p style=\"padding-left: 30px;\"><span class=\"color-code-comment\">// hacemos algo y lanzamos un $setTimeout si queremos refrescar la vista</span></p>\n<p>}</p>\n<p>document.addEventListener('dinamic-data-changed', fooChanged, true);</p>\n<p>$scope.$on(\"$destroy\", function() {</p>\n<p style=\"padding-left: 60px;\">document.removeEventListener('dinamic-data-changed', fooChanged, true);</p>\n<p style=\"padding-left: 30px;\">}</p>\n<p>);</p>\n<p></div>\n<p>Moraleja del cuento, es posible y recomendable combinar angular con polymer para obtener lo mejor de dos mundos: la solidez de un frame mvc con la reutilización de componentes universales.</p>\n<p>Termino con un apunte sobre angular 2. El lector atento habrá observado que no he mencionado la segunda versión de este framework y es porque en ese caso sí que no veo nada claro cuáles serían las ventajas de combinar estas dos tecnologías. En esta versión, los controllers desaparecen y todo el peso recae en las directivas -un cambio sobre el que no me pronunciaré ahora- y, precisamente el chiste de este invento es sustituir las directivas de angular por componentes de polymer... de todas maneras, este es un tema sobre el que aún no tengo una opinión formada y que está sujeto a discusión.</p>\n"
    },
    "excerpt": {
        "rendered": "<p>Cómo combinar angular con polymer para reunir lo mejor de dos mundos</p>\n"
    },
    "author": 1,
    "featured_media": 4544,
    "comment_status": "open",
    "ping_status": "open",
    "sticky": false,
    "format": "standard",
    "categories": [
        34
    ],
    "tags": [
        171,
        214,
        322
    ],
    "_links": {
        "self": [
            {
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/posts/4534"
            }
        ],
        "collection": [
            {
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/posts"
            }
        ],
        "about": [
            {
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/types/post"
            }
        ],
        "author": [
            {
                "embeddable": true,
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/users/1"
            }
        ],
        "replies": [
            {
                "embeddable": true,
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/comments?post=4534"
            }
        ],
        "version-history": [
            {
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/posts/4534/revisions"
            }
        ],
        "https://api.w.org/featuredmedia": [
            {
                "embeddable": true,
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/media/4544"
            }
        ],
        "https://api.w.org/attachment": [
            {
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/media?parent=4534"
            }
        ],
        "https://api.w.org/term": [
            {
                "taxonomy": "category",
                "embeddable": true,
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/categories?post=4534"
            },
            {
                "taxonomy": "post_tag",
                "embeddable": true,
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/tags?post=4534"
            }
        ],
        "https://api.w.org/meta": [
            {
                "embeddable": true,
                "href": "http://www.mmfilesi.com/wp-json/wp/v2/posts/4534/meta"
            }
        ]
    }
};

/*

{"id":4544,"date":"2016-03-01T14:34:31","date_gmt":"2016-03-01T14:34:31","guid":{"rendered":"http:\/\/www.mmfilesi.com\/wp-content\/uploads\/2016\/03\/john-brack.jpg"},"modified":"2016-03-01T15:03:43","modified_gmt":"2016-03-01T15:03:43","slug":"john-brack","type":"attachment","link":"http:\/\/www.mmfilesi.com\/blog\/angular-y-polymer\/john-brack\/","title":{"rendered":"John Brack"},"author":1,"comment_status":"open","ping_status":"closed","alt_text":"John Brack","caption":"John Brack","description":"John Brack","media_type":"image","mime_type":"image\/jpeg","media_details":{"width":600,"height":300,"file":"2016\/03\/john-brack.jpg","sizes":{"thumbnail":{"file":"john-brack-300x150.jpg","width":300,"height":150,"mime_type":"image\/jpeg","source_url":"http:\/\/www.mmfilesi.com\/wp-content\/uploads\/2016\/03\/john-brack-300x150.jpg"},"medium":{"file":"john-brack-300x150.jpg","width":300,"height":150,"mime_type":"image\/jpeg","source_url":"http:\/\/www.mmfilesi.com\/wp-content\/uploads\/2016\/03\/john-brack-300x150.jpg"},"full":{"file":"john-brack.jpg","width":600,"height":300,"mime_type":"image\/jpeg","source_url":"http:\/\/www.mmfilesi.com\/wp-content\/uploads\/2016\/03\/john-brack.jpg"}},"image_meta":{"aperture":"0","credit":"","camera":"","caption":"","created_timestamp":"0","copyright":"","focal_length":"0","iso":"0","shutter_speed":"0","title":"","orientation":"0","keywords":[]}},"post":4534,"source_url":"http:\/\/www.mmfilesi.com\/wp-content\/uploads\/2016\/03\/john-brack.jpg","_links":{"self":[{"href":"http:\/\/www.mmfilesi.com\/wp-json\/wp\/v2\/media\/4544"}],"collection":[{"href":"http:\/\/www.mmfilesi.com\/wp-json\/wp\/v2\/media"}],"about":[{"href":"http:\/\/www.mmfilesi.com\/wp-json\/wp\/v2\/types\/attachment"}],"author":[{"embeddable":true,"href":"http:\/\/www.mmfilesi.com\/wp-json\/wp\/v2\/users\/1"}],"replies":[{"embeddable":true,"href":"http:\/\/www.mmfilesi.com\/wp-json\/wp\/v2\/comments?post=4544"}]}}

*/

  		wordpress.getPosts().success(function(data, status, headers, config) {
			console.log('success', data);
			$scope.allPosts = data;
		});

}]);
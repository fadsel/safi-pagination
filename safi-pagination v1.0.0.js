/**
 * Created by Fahad Kassim Local on 8/08/2018.
 * SafiCloud Plugins
 * Safi Pagination v1.0.0 2nd Corona Strike in Tanzania
 * https://github.com/fadsel
 * @author Fahad Kassim (https://saficloud.com)
 * @copyright 2018 Fahad Kassim
 * @description Loads more content and replaces the content holder , clears memory with preloader.
 * Using HTML Content instead of JSON, for Backward compatibility on CI Paginations
 */
document.addEventListener("DOMContentLoaded", function(event) {

    // Ajax CI Pagination Plugin
    (function ($, window, document, undefined) {

        /**
         * Store the plugin name in a variable. It helps you if later decide to
         * change the plugin's name
         * @type {String}
         */
        var pluginName = 'SafiPagination';
        var safi = null;
        var _defaults = {};

        /**
         * The plugin constructor
         * @param {DOM Element} element The DOM element where plugin is applied
         * @param {Object} options Options passed to the constructor
         */
        function Plugin(element, options) {

            // Store a reference to the source element
            this.el = element;

            // Store a jQuery reference  to the source element
            this.$el = $(element);

            // Set the instance options extending the plugin defaults and
            // the options passed by the user
            this.options = $.extend({}, $.fn[pluginName].defaults, options);
            console.log("New Plugin");

            // Initialize the plugin instance
            this.init(options);
        }

        /**
         * Set up your Plugin prototype with desired methods.
         * It is a good practice to implement 'init' and 'destroy' methods.
         */
        Plugin.prototype = {

            /**
             * Initialize the plugin instance.
             * Set any other attribtes, store any other element reference, register
             * listeners, etc
             *
             * When bind listerners remember to name tag it with your plugin's name.
             * Elements can have more than one listener attached to the same event
             * so you need to tag it to unbind the appropriate listener on destroy:
             *
             * @example
             * this.$someSubElement.on('click.' + pluginName, function() {
         *      // Do something
         * });
             *
             */
            init: function (options,v_callback) {

                _defaults = options;

                /******************************
                 * General Data
                 * Should contain @data-page-no
                 *******************************/

                var page_overlay = $(_defaults.page_overlay_container);
                var your_paginated_content = _defaults.content_container;
                var paginated_content = $(your_paginated_content);
                var pagination_links = paginated_content.find(_defaults.pagination_container).find("a");

                console.log("Initializing");

                console.log(_defaults);

                safi = {

                    restart: function () {

                        safi.clear_events(function (started) {
                            if (started) {
                                console.log("Started after clearing events, Nice!");
                                safi.init();
                            } else {
                                console.log("Restarted without clearing events!");
                                safi.init();
                            }
                        });

                    },
                    init: function () {
                        // Dublicate Code Ahead ,#NotKool
                        page_overlay = $(_defaults.page_overlay_container);
                        your_paginated_content = _defaults.content_container;
                        paginated_content = $(your_paginated_content);
                        pagination_links = paginated_content.find(_defaults.pagination_container).find("a");

                        paginated_content.attr("data-safi","ready");


                        if (page_overlay == null && page_overlay.length <= 1) {
                            $.fn[pluginName].debug?console.log("Page Overlay DIV is Missing"):"";
                            return;
                        }

                        if (paginated_content == null && paginated_content.length <= 1) {
                            $.fn[pluginName].debug?console.log("Paginated Content DIV is Missing"):"";
                            return;
                        }

                        if (pagination_links == null && pagination_links.length <= 1) {
                            $.fn[pluginName].debug?console.log("Pagination Links DIV is Missing"):"";
                            return;
                        }

                        safi.start_crawl();

                    },

                    clear_events: function (start) {
                        if (pagination_links.length >= 1) {
                            pagination_links.off();
                            start(true);
                        } else {
                            start(false);
                        }
                    },

                    scrollToContainerElement: function(){

                        //smoothScroll($.fn[pluginName].scrollElementID);
                        smoothScroll(_defaults.scrollElementID);
                        console.log("scrolling ");
                    },

                    start_crawl: function () {

                        if(_defaults.debug){
                            console.log("Started Crawling ...");
                            console.log("Extracted Links");
                            $.each(pagination_links , function(i,target){
                                console.log(target.href);
                            });
                        }


                        pagination_links.on("click", function (e) {
                            e.preventDefault();
                            _defaults.debug?console.log("Ajaxing : " + e.target.href):"";

                            if(_defaults.scrollToTopAfterClick){
                                console.log("Bab");
                                safi.scrollToContainerElement();
                            }

                            if(_defaults.after_pagination_callback != null){
                                console.log("Calling Pagination with Callback");
                                safi.fetch_page_with_callback(e.target.href ,  function(){
                                    console.log("Calling the Call Back Function ASAP");
                                    _defaults.after_pagination_callback();
                                });
                            }else{
                                console.log(_defaults.callback);
                                console.log("Calling Pagination without Callback");
                                safi.fetch_page(e.target.href);
                            }

                            //safi.fetch_page(e.target.href);


                        });
                    },
                    fetch_page:function(target_url , anotherPart){

                        page_overlay.show();

                        $.ajax({
                            url: target_url,
                            method: "POST",
                            dataType: "html",
                            success: function (data) {
                                _defaults.debug?console.log("Data Came"):"";
                                setTimeout(function () {

                                    var new_html_content = $(data).find(your_paginated_content);

                                    if(anotherPart){
                                        var _anotherPart = $(data).find(anotherPart);

                                        if(_anotherPart != null && _anotherPart.length>=1){
                                            $(anotherPart).html(_anotherPart[0].innerHTML);
                                            console.log("Another Part " + anotherPart + " was changed");
                                            console.log(_anotherPart.html());

                                        }else{
                                            console.log("Another Part " + anotherPart + " failed to be changed");
                                        }

                                    }

                                    if (new_html_content != null && new_html_content.length>=1) {
                                        paginated_content.html(new_html_content[0].innerHTML);
                                        page_overlay.hide();
                                        safi.restart();// to crawl the new content again
                                    } else {
                                        _defaults.debug?console.log("Content was corrupted"):"";
                                    }

                                }, _defaults.loading_delay);

                            },
                            error: function (data) {
                                if(_defaults.debug){
                                    console.log("Yikes ... an Error Occurred!");
                                    console.log(data);
                                }
                                page_overlay.hide();
                            }

                        });
                    },

                    fetch_page_with_callback:function(target_url , callback){

                        page_overlay.show();

                        $.ajax({
                            url: target_url,
                            method: "POST",
                            dataType: "html",
                            success: function (data) {
                                _defaults.debug?console.log("Data Came"):"";
                                setTimeout(function () {

                                    var new_html_content = $(data).find(your_paginated_content);

                                    if (new_html_content != null && new_html_content.length>=1) {
                                        paginated_content.html(new_html_content[0].innerHTML);
                                        page_overlay.hide();
                                        safi.restart();// to crawl the new content again
                                        callback(true);
                                    } else {
                                        _defaults.debug?console.log("Content was corrupted"):"";
                                        callback(false);
                                    }

                                }, _defaults.loading_delay);

                            },
                            error: function (data) {
                                if(_defaults.debug){
                                    console.log("Yikes ... an Error Occurred!");
                                    console.log(data);
                                }
                                page_overlay.hide();
                                callback(false);

                            }

                        });
                    },

                    fetch_page_with_parts:function(target_url , parts){

                        page_overlay.show();

                        $.ajax({
                            url: target_url,
                            method: "POST",
                            dataType: "html",
                            success: function (data) {
                                _defaults.debug?console.log("Data Came"):"";
                                setTimeout(function () {

                                    var new_html_content = $(data).find(your_paginated_content);

                                    $.each(parts,function(i,part){
                                        var _part = $(data).find(part);
                                        if(_part != null && _part.length>=1){
                                            $(part).html(_part[0].innerHTML);
                                            console.log(part + " was changed successfully");
                                        }else{
                                            console.log(part + " was not a successfully change");
                                        }
                                    });


                                    if (new_html_content != null && new_html_content.length>=1) {
                                        paginated_content.html(new_html_content[0].innerHTML);
                                        page_overlay.hide();
                                        safi.restart();// to crawl the new content again
                                    } else {
                                        _defaults.debug?console.log("Content was corrupted"):"";
                                    }

                                }, _defaults.loading_delay);

                            },
                            error: function (data) {
                                if(_defaults.debug){
                                    console.log("Yikes ... an Error Occurred!");
                                    console.log(data);
                                }
                                page_overlay.hide();
                            }

                        });
                    },
                    fetch_page_with_parts_and_callback:function(target_url , parts , callback){

                        page_overlay.show();

                        $.ajax({
                            url: target_url,
                            method: "POST",
                            dataType: "html",
                            success: function (data) {
                                _defaults.debug?console.log("Data Came"):"";
                                setTimeout(function () {

                                    var new_html_content = $(data).find(your_paginated_content);

                                    $.each(parts,function(i,part){
                                        var _part = $(data).find(part);
                                        if(_part != null && _part.length>=1){
                                            $(part).html(_part[0].innerHTML);
                                            console.log(part + " was changed successfully");
                                        }else{
                                            console.log(part + " was not a successfully change");
                                        }
                                    });


                                    if (new_html_content != null && new_html_content.length>=1) {
                                        paginated_content.html(new_html_content[0].innerHTML);
                                        page_overlay.hide();
                                        safi.restart();// to crawl the new content again
                                        callback(true);
                                    } else {
                                        _defaults.debug?console.log("Content was corrupted"):"";
                                        callback(false);
                                    }

                                }, _defaults.loading_delay);

                            },
                            error: function (data) {
                                if(_defaults.debug){
                                    console.log("Yikes ... an Error Occurred!");
                                    console.log(data);
                                }
                                page_overlay.hide();
                                callback(false);
                            }

                        });
                    },


                };

                safi.init(); // start the crawling

            },

            /**
             * The 'destroy' method is were you free the resources used by your plugin:
             * references, unregister listeners, etc.
             *
             * Remember to unbind for your event:
             *
             * @example
             * this.$someSubElement.off('.' + pluginName);
             *
             * Above example will remove any listener from your plugin for on the given
             * element.
             */
            destroy: function () {

                // Remove any attached data from your plugin
                this.$el.removeData();
            },

            /**
             * Write public methods within the plugin's prototype. They can
             * be called with:
             *
             * @example
             * $('#element').jqueryPlugin('reloadContent','Arguments', 'Here', 1001);
             *
             * @param  {[type]} foo [some parameter]
             * @param  {[type]} bar [some other parameter]
             * @return {[type]}
             */
            oldreloadContent: function (foo, bar) {

                console.log("Reloads Bab");
                // This is a call to a pseudo private method
                //this._pseudoPrivateMethod();

                // This is a call to a real private method. You need to use 'call' or 'apply'
                // privateMethod.call(this);

                safi.fetch_page(window.location.href);

            },


            reloadContents:function(parts){
                console.log("Reloading Contents");
                console.log(parts);
                safi.fetch_page_with_parts(window.location.href,parts);

            },

            reloadContentsWithCallback:function(parts,callback){
                console.log("Reloading Contents");
                console.log(parts);
                //safi.fetch_page_with_parts(window.location.href,parts);

                safi.fetch_page_with_parts_and_callback(window.location.href, parts, function(){
                    callback(true);
                });

            },

            reloadURLContents:function(url,parts){
                console.log("Reloading URL Contents with Parts");
                console.log(url);

                console.log("Parts being ...");
                console.log(parts);
                safi.fetch_page_with_parts(url , parts);
            },

            reloadContent: function (url , anotherPart) {
                if(!url){
                    url = window.location.href;
                }
                console.log("Loading : " +  url);
                // This is a call to a pseudo private method
                //this._pseudoPrivateMethod();

                // This is a call to a real private method. You need to use 'call' or 'apply'
                // privateMethod.call(this);
                if(anotherPart){
                    safi.fetch_page(url , anotherPart);
                }else{
                    safi.fetch_page(url , false);

                }


            },
            reloadContentWithCallBack: function (callback) {
                var url = window.location.href;

                console.log("Loading : " +  url);
                // This is a call to a pseudo private method
                //this._pseudoPrivateMethod();

                // This is a call to a real private method. You need to use 'call' or 'apply'
                // privateMethod.call(this);

                safi.fetch_page_with_callback(url , function(){
                    callback(true);
                });

            },




            /**
             * Another public method which acts as a getter method. You can call as any usual
             * public method:
             *
             * @example
             * $('#element').jqueryPlugin('someGetterMethod');
             *
             * to get some interesting info from your plugin.
             *
             * @return {[type]} Return something
             */
            someGetterMethod: function () {

            },

            /**
             * You can use the name convention functions started with underscore are
             * private. Really calls to functions starting with underscore are
             * filtered, for example:
             *
             *  @example
             *  $('#element').jqueryPlugin('_pseudoPrivateMethod');  // Will not work
             */
            _pseudoPrivateMethod: function () {

            }

        };

        /**
         * This is a real private method. A plugin instance has access to it
         * @return {[type]}
         */
        var privateMethod = function () {
            console.log("privateMethod");
            console.log(this);
        };

        /**
         * This is were we register our plugin withint jQuery plugins.
         * It is a plugin wrapper around the constructor and prevents agains multiple
         * plugin instantiation (soteing a plugin reference within the element's data)
         * and avoid any function starting with an underscore to be called (emulating
         * private functions).
         *
         * @example
         * $('#element').jqueryPlugin({
     *     defaultOption: 'this options overrides a default plugin option',
     *     additionalOption: 'this is a new option'
     * });
         */
        $.fn[pluginName] = function (options) {
            var args = arguments;

            if (options === undefined || typeof options === 'object') {
                // Creates a new plugin instance, for each selected element, and
                // stores a reference withint the element's data
                console.log("Creating a new Instance");

                return this.each(function () {

                    if (!$.data(this, 'plugin_' + pluginName)) {
                        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                    }

                });

            } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
                // Call a public plugin method (not starting with an underscore) for each
                // selected element.

                //var instance = null;
                if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                    // If the user does not pass any arguments and the method allows to
                    // work as a getter then break the chainability so we can return a value
                    // instead the element reference.
                    console.log("Getting a Getter");

                    var instance = $.data(this[0], 'plugin_' + pluginName);
                    return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                } else {

                    // Invoke the speficied method on each selected element
                    console.log("Invoking a FXN");
                    /*
                     instance = $.data(this, 'plugin_' + pluginName);
                     console.log(instance);

                     if (instance instanceof Plugin && typeof instance[options] === 'function') {
                     return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                     }
                     */
                    console.log(this);
                    return this.each(function () {

                        var instance = $.data(this, 'plugin_' + pluginName);
                        if (instance instanceof Plugin && typeof instance[options] === 'function') {
                            instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                        }
                    });

                }
            }
        };

        /**
         * Names of the plugin methods that can act as a getter method.
         * @type {Array}
         */
        $.fn[pluginName].getters = ['someGetterMethod'];

        /**
         * Default options
         */
        $.fn[pluginName].defaults = {
            content_container: ".product-type-change", //Where the plugin will start to crawl
            page_overlay_container: ".page-overlay", //The div where it holds the CSS preloader
            pagination_container: ".ci-pagination", //The div where CI echos its div with pagination links

            //for delaying the loading
            loading_delay: 500,

            debug: false,
            scrollToTopAfterClick:false,
            scrollElementID:"top",
            after_pagination_callback:null
        };


        /**
         * Scrolling Functionality
         * @returns {*}
         */
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }


        function smoothScroll(eID) {
            console.log(eID);
            var startY = currentYPosition();
            var stopY = elmYPosition(eID);
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                scrollTo(0, stopY); return;
            }
            var speed = Math.round(distance / 100);
            if (speed >= 20) speed = 20;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for ( var i=startY; i<stopY; i+=step ) {
                    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                    leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                } return;
            }
            for ( var i=startY; i>stopY; i-=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }
            return false;
        }

    })(jQuery, window, document);



    // Another Plugin
    // Status Changer Plugin
    (function($){

        var settings = null;
        var $status = null;

        var methods = {
            init: function(options){
                // This is the easiest way to have default options.
                settings = $.extend({
                    // These are the defaults.
                    container: ".settings", //Where the plugin will start to get reference of the container
                    status: ".status", //The div where it holds the status
                    htmlTemplate:$("#status").html(),// html

                    debug: false

                }, options);

                $status = $(settings.container).find(settings.status);
                console.log("Tracking Status");

            },
            get_status_icon:function(state,callback){
                var _icon = "";
                switch(state){
                    case 'error':
                        _icon = "pe-7s-attention";
                        break;
                    case 'success':
                        _icon = "pe-7s-check";
                        break;
                    case 'loading':
                        _icon = "pe-7s-config fa fa-spin";
                        break;
                    default:
                        _icon = "pe-7s-coffee";
                        break;
                }
                callback(_icon);
            },
            remove_status:function(){

                $status.hide();
            },
            set_status:function(state,text){

                var template = settings.htmlTemplate;
                var compiled = Handlebars.compile(template);
                methods.get_status_icon(state,function(_some_icon){
                    var data = {
                        'status_text': text,
                        'status_icon': _some_icon
                    };

                    $status.html(compiled(data)).show();
                });


            }
        };

        // Plugin definition.
        $.fn.statusChanger = function (optionsOrMethods) {

            if ( methods[optionsOrMethods] ) {

                return methods[ optionsOrMethods ].apply(
                    this,
                    Array.prototype.slice.call( arguments, 1 )
                );

            } else if ( typeof optionsOrMethods === 'object' || ! optionsOrMethods ) {
                // Default to "init"
                return methods.init.apply( this, arguments );
            } else {
                $.error( 'Method ' +  optionsOrMethods + ' does not exist on jQuery.statusChanger' );
            }

        };

    }(jQuery));

});

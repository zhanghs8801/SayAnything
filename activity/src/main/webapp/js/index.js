

/**
*
* Script:
*   jui.js
*   JUI(JavaScript User Interface) JavaScript Library v1.0.0
*
* Version: 
*   1.0.1
*
* License:
*	MIT-style license.
*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
*
* Thanks to:
*   Yahoo! YUI Team & contributors,
*   Valerio Proietti & MooTools contributors, 
*   John Resig & jQuery contributors,
*
* */

(function() {

    var 
    window = this,
    // Map over JUI in case of overwrite
	_JUI = window.JUI,
    // Map over the $ in case of overwrite
	_$ = window.$,
    // global uid
	_uid = 1,

    ///<class>
    ///    <name>$.Window</name>
    ///    <summary>
    ///         核心类，提供基础框架和方法。
    ///    </summary>
    ///    <include></include>
    ///</class>

    $ = JUI = window.JUI = window.$ = function(selector, context) {
        ///<summary>
        /// 根据选择器获取元素
        ///</summary>
        ///<param name="selector" type="String">选择器</param>
        ///<param name="context" type="$.Element">要查找的上下文</param>
        ///<returns type="$.Element" />
        if (selector == window) {
            return $.Window ? new $.Window(selector) : window;
        }

        if ($.Element) {
            return new $.Element(selector, false);
        }

        return document.getElementById(selector);
    };

    var Native = {
        initialize: function(options) {
            options = options || {};
            var initialize = options.initialize;
            var legacy = options.legacy;
            var name = options.name || JUI.name;
            var object = initialize || legacy;
            var protect = options.protect;
            var afterImplement = options.afterImplement || function() { };

            object.constructor = this.initialize;
            object.$family = name.toLowerCase();
            if (legacy && initialize) object.prototype = legacy.prototype;
            object.prototype.constructor = object;
            object.prototype.$family = object.$family;

            var add = function(obj, name, method, force) {
                if (!protect || force || !obj.prototype[name]) obj.prototype[name] = method;
                afterImplement.call(obj, name, method);
                return obj;
            };

            object.alias = function(a1, a2, a3) {
                if (typeof a1 == 'string') {
                    if ((a1 = this.prototype[a1])) return add(this, a2, a1, a3);
                }
                for (var a in a1) this.alias(a, a1[a], a2);
                return this;
            };

            object.genericize = function(a1, a2) {
                if (typeof a1 == 'string') {
                    if ((!a2 || !this[a1]) && typeof this.prototype[a1] == 'function') this[a1] = function() {
                        var args = Array.prototype.slice.call(arguments);
                        return this.prototype[a1].apply(args.shift(), args);
                    };
                    return;
                }
                for (var i = 0; i < a1.length; i++) this.genericize(a1[i], a2);
                return this;
            };

            object.implement = function(a1, a2, a3) {
                if (typeof a1 == 'string') return add(this, a1, a2, a3);
                for (var p in a1) add(this, p, a1[p], a2);
                return this;
            };
        },

        genericize: function(object, properties) {
            object && object.genericize(properties);
        },

        implement: function(objects, properties) {
            var l = objects.length;
            while (l--) {
                objects[l].implement(properties);
            }
        }
    };

    $.Native = Native;

    (function() {
        var natives = { 'Array': Array, 'Boolean': Boolean, 'Date': Date, 'Function': Function, 'Number': Number, 'RegExp': RegExp, 'String': String, 'JUI': $ };
        for (var n in natives) Native.initialize({ name: n, initialize: natives[n], protect: true });

        var generics = {
            'Array': ["concat", "indexOf", "join", "lastIndexOf", "pop", "push", "reverse", "shift", "slice", "sort", "splice", "toString", "unshift", "valueOf"],
            'String': ["charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "match", "replace", "search", "slice", "split", "substr", "substring", "toLowerCase", "toUpperCase", "valueOf"]
        };
        for (var g in generics) {
            for (var i = generics[g].length; i--; ) Native.genericize(window[g], generics[g]);
        }
    })();

    $.name = 'jui';         // name of framework
    $.version = '1.0.0.0';  // current version of framework
    $.expando = '_JUI_' + new Date, // name of uid property

    /**
    * return type of an object
    * 
    * @obj
    *    the object you want to do type test
    * */
    $.type = function(obj) {
        ///<summary>
        /// 获取对象的方法
        ///</summary>
        ///<param name="style" type="Object">对象</param>
        ///<returns type="string" />
        if (obj == undefined) return false;
        if (obj.$family) return (obj.$family == 'number' && !isFinite(obj)) ? false : obj.$family;
        if (obj.nodeName) {
            switch (obj.nodeType) {
                case 1: return 'element';
                case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
            }
        } else if (typeof obj.length == 'number') {
            if (obj.callee) return 'arguments';
            else if (obj.item) return 'collection';
        }
        return typeof obj;

        //return obj.$family ? obj.$family : typeof obj;
    };

    /**
    * just a empty function
    *
    * */
    $.empty = function() { };

    /**
    * to resolve confilict problems
    *
    *  @deep:
    *    true to resolve JUI confilict
    * */
    $.noConfilict = function() {
        ///<summary>
        /// 使JUI与其它不冲突
        ///</summary>
        ///<returns type="$" />
        window.$ = _$;

        return this;
    };

    /*
    * 类继承的实现
    * */
    $.extend = function(child, parent) {
        ///<summary>
        /// 类继承的实现
        ///</summary>
        ///<param name="child" type="Object">子对象</param>
        ///<param name="parent" type="Object">父对象</param>
        ///<returns type="Object" />
        if (!parent) {
            throw 'Failed! Inherit from a null object';
        }

        var pp = parent.prototype,
            F = function() { };
        F.prototype = pp;
        var ext = new F();
        child.prototype = ext;
        ext.constructor = child;
        child.superclass = pp;

        // 如果没有构造函数，则指定一个
        if (parent != Object && pp.constructor == Object.prototype.constructor) {
            pp.constructor = parent;
        }

        return child;
    };

    /**
    * return current timestamp
    *
    * */
    $.now = function() {
        ///<summary>
        /// 返回当前时间的Time Stamp
        ///</summary>
        ///<returns type="Number" />
        return +new Date;
    };

    /**
    * return a global unique id of an element
    *
    * */

    $.getUid = (window.ActiveXObject) ? function(node) {
        ///<summary>
        /// 给一个节点返回一个唯一ID
        ///</summary>
        ///<param name="module" type="node">节点</param>
        ///<returns type="int" />
        return (node[$.expando] || (node[$.expando] = [_uid++]))[0];
    } : function(node) {
        return node[$.expando] || (node[$.expando] = _uid++);
    };

})();
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('selector', '1.0.0.0');

    /**
    *
    * whiz.js - A fast CSS selector engine and matcher
    *
    * Version:
    *    1.0.0 Preview
    *
    * Licence:
    *    MIT License
    *
    * Author: 
    *    xushengs@gmail.com
    *    http://fdream.net
    *
    * Thanks to:
    *   Yahoo! YUI Team & contributors,
    *   Valerio Proietti & MooTools contributors, 
    *   John Resig & jQuery/Sizzle contributors,
    *   Harald Kirschner & Sly contributors,
    *   Thomas Aylott & Slick contributors
    *
    * */

    var Selector = (function() {
        var //uid = 1,            // global uid of nodes
        current = {},       // current found
        support = {},       // features detection
        parsedCache = {},   // cache parsed selectors
        attributeAlias = {  // attribute names
            'class': 'className'
        },

        // these regular expressions are from YUI
        // tag: /^((?:-?[_a-z][\w-]*)|\*)/i, // tag must be the first, or it will be *
        // id: /^#([\w-]+)/,    // id starts with #
        // class: /^\.([\w-]+)/
        // attribute: /^\[([a-z]+\w*)+([~\|\^\$\*!]?=)?['"]?([^\]]*?)['"]?\]/i,
        // pseudo: /^:([\-\w]+)(?:\(['"]?(.+?)["']?\))*/ //,
        // combinator: /^\s*((?:[>+~\s,])|$)\s*/    // comma for multi-selectors
        // nth: /^(?:(?:([-]?\d*)(n{1}))?([-+]?\d*)|(odd|even))$/, // supports an+b, b, an, odd, even

        /**
        * large regular expression, match all types
        * match list:
        *  ----------------
        *  tag:        m[1]
        *  ----------------
        *  id:         m[2]
        *  ----------------
        *  class:      m[3]
        *  ----------------
        *  attribute:  m[4]
        *  operator:   m[5]
        *  value:      m[6]
        *  ----------------
        *  pseudo:     m[7]
        *  expression: m[8]
        *  ----------------
        *  combinator: m[9]
        *  ----------------
        *  
        * */
        nthRE = /^(?:(?:([-]?\d*)(n{1}))?([-+]?\d*)|(odd|even))$/, // supports an+b, b, an, odd, even
        re = /((?:[_a-zA-Z][\w-]*)|\*)|(?:#([\w-]+))|(?:\.([\w-]+))|(?:\[([a-z]+\w*)+([~\|\^\$\*!]?=)?['"]?([^\]]*?)["']?\])|(?::([\-\w]+)(?:\(['"]?(.+?)["']?\))*)|(?:\s*((?:[>+~\s,])|$)\s*)/g;


        // check features
        (function() {
            // Our guinea pig
            var testee = document.createElement('div'), id = (new Date()).getTime();
            testee.innerHTML = '<a name="' + id + '" class="€ b"></a>';

            // Safari can't handle uppercase or unicode characters when in quirks mode.
            support.qsa = !!(testee.querySelectorAll && testee.querySelectorAll('.€').length);
        })();

        // get unique id
        //        var getUid = (window.ActiveXObject) ? function(node) {
        //            return (node[$.expando] || (node[$.expando] = [$.getUid()]))[0];
        //        } : function(node) {
        //            return node[$.expando] || (node[$.expando] = $.getUid());
        //        };

        // locate current found
        function locateCurrent(node) {
            var uid = $.getUid(node);
            return (current[uid]) ? null : (current[uid] = true);
        };

        // locate fast
        function locateFast(node) {
            return true;
        }

        // escape regular expressions
        function escapeRegExp(text) {
            return text.replace(/[-.*+?^${}()|[\]\/\\]/g, '\\$&');
        }

        // create a parsed selector
        function create(combinator) {
            return {
                combinator: combinator || ' ',
                tag: '*',
                id: null,
                classes: [],
                attributes: [],
                pseudos: []
            }
        }

        // parse a selector
        function parse(s) {
            if (parsedCache[s]) {
                return parsedCache[s];
            }

            var selectors = [], sentence = [], parsed, match, combinator,
            sni = sli = ci = ai = pi = 0;

            parsed = create();
            re.lastIndex = 0;
            while (match = re.exec(s)) {
                // tag
                if (match[1]) {
                    parsed.tag = match[1].toUpperCase();
                }
                // id
                else if (match[2]) {
                    parsed.id = match[2];
                }
                // classes
                else if (match[3]) {
                    parsed.classes[ci++] = match[3];
                }
                // attributes
                else if (match[4]) {
                    parsed.attributes[ai++] = { key: match[4], op: match[5], value: match[6] };
                }
                // pseudos
                else if (match[7]) {
                    parsed.pseudos[pi++] = { key: match[7], value: match[8] };
                }
                // combinators
                else if (match[9]) {
                    sentence[sni++] = parsed;

                    if (match[9] == ',') {
                        selectors[sli++] = sentence;
                        sentence = [];
                        sni = 0;
                        combinator = null;
                    }
                    else {
                        combinator = match[9];
                    }

                    parsed = create(combinator);
                    ci = ai = pi = 0;
                }
                else {
                    break;
                }
            }

            sentence[sni++] = parsed;
            selectors[sli++] = sentence;

            return parsedCache[s] = selectors;
        }

        // combine by tag
        var combineByTag = {
            ' ': function(tag, ctx, ret, locate) {
                var nodes, n, i = 0, len = ret.length;
                nodes = ctx.getElementsByTagName(tag);
                if (locate) {
                    while (n = nodes[i++]) {
                        n.nodeType == 1 && locate(n) && (ret[len++] = n);
                    }
                }
                else {
                    while (n = nodes[i++]) {
                        n.nodeType == 1 && (ret[len++] = n);
                    }
                }

                return ret;
            },
            '>': function(tag, ctx, ret) {
                var nodes, n, i = 0, len = ret.length;
                nodes = ctx.getElementsByTagName(tag);

                while (n = nodes[i++]) {
                    n.parentNode == ctx && (ret[len++] = n);
                }

                return ret;
            },
            '+': function(tag, ctx, ret, locate) {
                var len = ret.length;
                while (ctx = ctx.nextSibling) {
                    if (ctx.nodeType == 1) {
                        ctx.tagName == tag && locate(ctx) && (ret[len++] = ctx);
                        break;
                    }
                }

                return ret;
            },
            '~': function(tag, ctx, ret, locate) {
                var len = ret.length;
                while (ctx = ctx.nextSibling) {
                    if (ctx.nodeType == 1) {
                        if (!locate(ctx)) {
                            break;
                        }
                        ctx.tagName == tag && (ret[len++] = ctx);
                    }
                }

                return ret;
            }
        };

        // combine by id
        var combineById = {
            ' ': function(node, cxt) {
                while (node = node.parentNode) {
                    // fixed a bug of IE6 with rising installed
                    if (node == cxt || (cxt == document && node.documentElement)) {
                        return true;
                    }
                }

                return false;
            },

            '>': function(node, cxt) {
                return node.parentNode == cxt;
            },

            '+': function(node, cxt) {
                while (node = node.previousSibling) {
                    if (node.nodeType != 1) {
                        continue;
                    }
                    if (node == cxt) {
                        return true;
                    }
                    else if (node.tagName == node.tagName) {
                        return false;
                    }
                }
                return false;
            },

            '~': function(node, cxt) {
                while (n = n.previousSibling) {
                    if (n == cxt) {
                        return true;
                    }
                }

                return false;
            }
        };

        var attributeRE = {
            '=': function(val) {
                return val;
            },
            '~=': function(val) {
                return new RegExp('(?:^|\\s+)' + escapeRegExp(val) + '(?:\\s+|$)');
            },
            '!=': function(val) {
                return val;
            },
            '^=': function(val) {
                return new RegExp('^' + escapeRegExp(val));
            },
            '$=': function(val) {
                return new RegExp(escapeRegExp(val) + '$');
            },
            '*=': function(val) {
                return new RegExp(escapeRegExp(val));
            },
            '|=': function(val) {
                return new RegExp('^' + escapeRegExp(val) + '-?');
            }
        };

        // attribute filters
        var attribute = {
            '=': function(attr, val) {
                // value is equal to val
                return attr == val;
            },
            '~=': function(attr, val) {
                // value is seperated by space, one of them is equal to val
                return val.test(attr);
            },
            '!=': function(attr, val) {
                // value is not equal to val
                return attr != val;
            },
            '^=': function(attr, val) {
                // value is started with val
                return val.test(attr);
            },
            '$=': function(attr, val) {
                // value is ended with val
                return val.test(attr);
            },
            '*=': function(attr, val) {
                // value contains val(string)
                return val.test(attr);
            },
            '|=': function(attr, val) {
                // value is seperated by hyphen, one of them is started with val
                // optional hyphen-delimited
                return val.test(attr);
            }
        };

        // cache parsed nth expression and nth nodes
        var nthCache = {}, nthNodesCache = {};

        // parse nth expression
        function parseNth(expr) {
            if (nthCache[expr]) {
                return nthCache[expr];
            }

            var m, a, b;

            m = expr.match(nthRE);
            switch (m[4]) {
                case 'even':
                    a = 2;
                    b = 0;
                    break;
                case 'odd':
                    a = 2;
                    b = 1;
                    break;
                default:
                    a = parseInt(m[1], 10);
                    a = isNaN(a) ? (m[2] ? 1 : 0) : a;
                    b = parseInt(m[3], 10);
                    isNaN(b) && (b = 0);
                    break;
            }

            return (nthCache[expr] = { a: a, b: b });
        }

        // whether is nth-child or nth-type
        function isNth(node, parsed, sibling, tag) {
            var uid, puid, pos, cache, count = 1;

            uid = $.getUid(node);
            puid = $.getUid(node.parentNode);

            cache = nthNodesCache[puid] || (nthNodesCache[puid] = {});

            if (!cache[uid]) {
                while ((node = node[sibling])) {
                    if (node.nodeType != 1 || (tag && node.tagName != tag)) continue;

                    pos = cache[$.getUid(node)];

                    if (pos) {
                        count = pos + count;
                        break;
                    }
                    count++;
                }
                cache[uid] = count;
            }

            return parsed.a ? cache[uid] % parsed.a == parsed.b : parsed.b == cache[uid];
        }

        // whether is only child or type
        function isOnly(node, tag) {
            var prev = node;
            while ((prev = prev.previousSibling)) {
                if (prev.nodeType === 1 && (!tag || prev.tagName == tag)) return false;
            }
            var next = node;
            while ((next = next.nextSibling)) {
                if (next.nodeType === 1 && (!tag || next.tagName == tag)) return false;
            }
            return true;
        }

        var pseudo = {
            'root': function(node) {
                return node === node.ownerDocument.documentElement;
            },
            'nth-child': function(node, parsed) {
                return (parsed.a == 1 && !parsed.b) ? true : isNth(node, parsed, 'previousSibling', false);
            },
            'nth-last-child': function(node, parsed) {
                return (parsed.a == 1 && !parsed.b) ? true : isNth(node, parsed, 'previousSibling', false);
            },
            'nth-of-type': function(node, parsed) {
                return isNth(node, parsed, 'previousSibling', node.tagName);
            },
            'nth-last-of-type': function(node, parsed) {
                return isNth(node, parsed, 'nextSibling', node.tagName);
            },
            'first-child': function(node) {
                var sibling = node.parentNode.firstChild;
                while (sibling.nodeType != 1) {
                    sibling = sibling.nextSibling;
                }
                return node === sibling;
            },
            'last-child': function(node) {
                while ((node = node.nextSibling)) {
                    if (node.nodeType === 1) return false;
                }
                return true;
            },
            'first-of-type': function(node) {
                var sibling = node.parentNode.firstChild, tagName = node.tagName;
                while (sibling.nodeType != 1 || sibling.tagName != tagName) {
                    sibling = sibling.nextSibling;
                }
                return node === sibling;
            },
            'last-of-type': function(node) {
                var tagName = node.tagName;
                while ((node = node.nextSibling)) {
                    if (node.nodeType == 1 && node.tagName == tagName) return false;
                }
                return true;
            },
            'only-child': function(node) {
                return isOnly(node);
            },
            'only-of-type': function(node) {
                return isOnly(node, node.tagName);
            },
            'empty': function(node) {
                return !node.firstChild;
            },
            'parent': function(node) {
                return !!node.firstChild;
            },
            //'link': function() { return; },
            //'visited': function() { return; },
            //'active': function() { return; },
            //'hover': function() { return; },
            //'focus': function() { return; },
            //'target': function() { return; },
            //'lang': function() { return; },
            'enabled': function() {
                return node.disabled === false && node.type !== "hidden";
            },
            'disabled': function() {
                return node.disabled === true;
            },
            'checked': function(node) {
                return node.checked === true;
            },
            'selected': function(node) {
                // Accessing this property makes selected-by-default
                // options in Safari work properly
                node.parentNode.selectedIndex;
                return node.selected === true;
            },
            'visible': function(node) {
                return node.offsetWidth > 0 || node.offsetHeight > 0;
            },
            'hidden': function(node) {
                return node.offsetWidth === 0 || node.offsetHeight === 0;
            },
            //'first-line': function() { return; },
            //'first-letter': function() { return; },
            //'before': function() { return; },
            //'after': function() { return; },
            'not': function(node, value) {
                return !testNode(node, value);
            },
            'contains': function(node, re) {
                return re.test(node.innerText || node.textContent || '');
            },
            'odd': function(node) {
                return;
            },
            'even': function(node) {
                return;
            }
        };
        pseudo.nth = pseudo['nth-child'];
        pseudo.index = pseudo['nth-child'];

        var pseudoRE = {
            't': function(value) {      // not pseudo class
                return parse(value);
            },
            'n': function(value) {      // contains and lang pseudo class
                return new RegExp(escapeRegExp(value));
            },
            'h': function(value) {      // nth pseduo class
                return parseNth(value);
            }
        };

        // filters
        var filter = {
            klass: function(nodes, name) {
                var n, i = 0, results = [], r = 0, pattern;

                pattern = new RegExp('(?:^|\\s+)' + escapeRegExp(name) + '(?:\\s+|$)');

                while (n = nodes[i++]) {
                    pattern.test(n.className) && (results[r++] = n);
                }
                return results;
            },

            attribute: function(nodes, attr) {
                var n, i = 0, results = [], r = 0, pattern,
                key = attributeAlias[attr.key] || attr.key,
                flag = /^(?:src|href|action)$/.test(key) ? 2 : 0;

                if (attr.op) {
                    pattern = attributeRE[attr.op](attr.value);
                    while (n = nodes[i++]) {
                        attribute[attr.op](n[key] || n.getAttribute(key, flag), pattern) && (results[r++] = n);
                    }
                }
                else {
                    while (n = nodes[i++]) {
                        ((n[key] || n.getAttribute(key, flag)) != null) && (results[r++] = n);
                    }
                }

                return results;
            },

            pseudo: function(nodes, pdo) {
                var parsed = pdo.value, key = pdo.key, n, i = 0, results = [], r = 0;

                parsed && (parsed = pseudoRE[key.charAt(2)](parsed));

                while (n = nodes[i++]) {
                    pseudo[key](n, parsed) && (results[r++] = n);
                }

                return results;
            }
        };

        // query sub selector
        function combine(selector, contexts) {
            var ret = [], klass, i = 0, item,
            locate = locateCurrent,
            // selector related
            combinator = selector.combinator,
            id = selector.id,
            tag = selector.tag,
            classes = selector.classes,
            attributes = selector.attributes,
            pseudos = selector.pseudos;

            // if id is supplied
            if (id) {
                // match id
                var node = document.getElementById(id);

                // match tag and match combinator
                if (tag == '*' || node.tagName == tag) {
                    while (cxt = contexts[i++]) {
                        if (combineById[combinator](node, cxt)) {
                            ret = [node];
                            break;
                        }
                    }
                }
            }
            else if (tag) {
                i = 0;
                current = {};
                if (contexts.length == 1) {
                    locate = false;
                }
                while (cxt = contexts[i++]) {
                    ret = combineByTag[combinator](tag, cxt, ret, locate);
                }
            }

            if (classes.length > (i = 0)) {
                // filter nodes by class
                while (item = classes[i++]) {
                    ret = filter.klass(ret, item);
                }
            }

            if (attributes.length > (i = 0)) {
                // filter nodes by attributes
                while (item = attributes[i++]) {
                    ret = filter.attribute(ret, item);
                }
            }

            if (pseudos.length > (i = 0)) {
                // filter nodes by pseudos
                while (item = pseudos[i++]) {
                    ret = filter.pseudo(ret, item);
                }
            }

            return ret;
        }

        // query a sentence
        function search(sentence, contexts) {
            var i = 0, selector;
            current = {};
            nthNodesCache = {};
            while (selector = sentence[i++]) {
                contexts = combine(selector, contexts);
            }

            return contexts;
        }

        // query a selector
        function query(selector, contexts) {
            var results = [], i = 0, sentence,
            selectors = parse(selector);

            while (sentence = selectors[i++]) {
                if (results.length > 0) {
                    results = search(sentence, contexts).concat(results);
                }
                else {
                    results = search(sentence, contexts);
                }
            }

            return results;
        }

        // test a node whether match a selector
        function testNode(node, parsed) {
            var i = 0, item, key, pattern, flag;
            parsed = parsed[0][0];

            if (parsed.id && parsed.id != node.id) {
                return false;
            }

            if (parsed.classes.length > (i = 0)) {
                // filter node by class
                while (item = parsed.classes[i++]) {
                    if (!(new RegExp('(?:^|\\s+)' + escapeRegExp(item) + '(?:\\s+|$)')).test(node.className)) {
                        return false;
                    }
                }
            }

            if (parsed.attributes.length > (i = 0)) {
                // filter node by attributes
                while (item = parsed.attributes[i++]) {
                    key = attributeAlias[item.key];
                    flag = /^(?:src|href|action)$/.test(key) ? 2 : 0;
                    key = node[key] || node.getAttribute(key, flag);
                    if (item.op) {
                        if (!attribute[item.op](key, attributeRE[item.op](item.value))) {
                            return false;
                        }
                    }
                    else if (key == null) {
                        return false;
                    }
                }
            }

            if (parsed.pseudos.length > (i = 0)) {
                // filter node by pseudos
                while (item = parsed.pseudos[i++]) {
                    (pattern = item.value) && (pattern = pseudoRE[item.key.charAt(2)](pattern));
                    if (!pseudo[item.key](node, pattern)) {
                        return false;
                    }
                }
            }

            return true;
        }

        // return the selector function
        return function(selector, context) {
            // TODO: handle empty string
            if (!selector || typeof selector !== "string") {
                return [];
            }

            context = context || document;

            if (context.nodeType !== 1 && context.nodeType !== 9) {
                return [];
            }
            if (support.qsa) {
                try {
                    return context.querySelectorAll(selector);
                }
                catch (e) {
                    return query(selector, [context]);
                }
            }
            else {
                return query(selector, [context]);
            }
        }
    })();

    $.Selector = Selector;
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('element', '1.0.1.0');

    ///<class>
    ///    <name>$.Element</name>
    ///    <summary>
    ///         提供封装好Element元素，并提供常用的DOM操作方法。
    ///    </summary>
    ///    <include>$</include>
    ///</class>

    // detect features
    var support = {}; //, cache = {}; //, collected = {};

    (function() {
        var /*de = document.documentElement,*/testee = document.createElement('div'), id = '_jui_' + (new Date()).getTime(), testee_a;
        testee.innerHTML = '   <link/><table></table><a name="' + id + '" class="€ b" href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select>';
        //support.opacity = (typeof testee.style.opacity) !== 'undefined' ? 1 : ((typeof testee.filters === 'object') || (typeof testee.filter === 'string')) ? 2 : 0;
        // do not support any other old browsers
        support = {
            // IE don't support opacity
            // but use filter instead
            opacity: (typeof testee.style.opacity) !== 'undefined' ? true : false,

            // FF use textContent instead of innerText
            innerText: (typeof testee.innerText) !== undefined ? true : false,

            // IE strips leading whitespace when .innerHTML is used
            leadingWhitespace: testee.firstChild && testee.firstChild.nodeType == 3,

            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            cssFloat: !(testee.style.cssFloat === undefined),

            // these will be specified later
            cloneEvent: false,

            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: false,

            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: false
        };

        if (testee.getElementsByTagName) {
            support.tbody = !!testee.getElementsByTagName("tbody").length;
            support.htmlSerialize = !!testee.getElementsByTagName("link").length;
        }

        // clone event test
        if (testee.attachEvent && testee.fireEvent) {
            testee.attachEvent("onclick", function click() {
                // Cloning a node shouldn't copy over any
                // bound event handlers (IE does this)
                support.cloneEvent = true;
                testee.detachEvent("onclick", click);
            });
            testee.cloneNode(true).fireEvent("onclick");
        }
    })();


    function toCamelCase(str) {
        return str.replace(/-\D/g, function(match) {
            return match.charAt(1).toUpperCase();
        });
    }

    function toHyphenCase(str) {
        return str.replace(/[A-Z]/g, function(match) {
            return ('-' + match.charAt(0).toLowerCase());
        });
    }

    var alias = {
        'class': 'className',
        'for': 'htmlFor',
        'float': support.cssFloat ? 'cssFloat' : 'styleFloat'
    },
        unit = {
            left: '@px', top: '@px', bottom: '@px', right: '@px',
            width: '@px', height: '@px', maxWidth: '@px', maxHeight: '@px', minWidth: '@px', minHeight: '@px',
            backgroundColor: 'rgb(@, @, @)', backgroundPosition: '@px @px', color: 'rgb(@, @, @)',
            fontSize: '@px', letterSpacing: '@px', lineHeight: '@px', clip: 'rect(@px @px @px @px)',
            margin: '@px @px @px @px', padding: '@px @px @px @px', border: '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)',
            borderWidth: '@px @px @px @px', borderStyle: '@ @ @ @', borderColor: 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)',
            zIndex: '@', 'zoom': '@', fontWeight: '@', textIndent: '@px', opacity: '@'
        },
        shorts = { margin: {}, padding: {}, border: {}, borderWidth: {}, borderStyle: {}, borderColor: {} };

    (function() {
        var direction = ['Top', 'Right', 'Bottom', 'Left'],
            m = 'margin', p = 'padding', b = 'border',
            i = direction.length, d;
        while (d = direction[--i]) {
            var md = m + d, pd = p + d, bd = b + d;
            shorts[m][md] = unit[md] = '@px';
            shorts[p][pd] = unit[pd] = '@px';
            shorts[b][bd] = unit[bd] = '@px @ rgb(@, @, @)';
            var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
            shorts[bd] = {};
            shorts.borderWidth[bdw] = shorts[bd][bdw] = unit[bdw] = '@px';
            shorts.borderStyle[bds] = shorts[bd][bds] = unit[bds] = '@';
            shorts.borderColor[bdc] = shorts[bd][bdc] = unit[bdc] = 'rgb(@, @, @)';
        }
    })();

    var bools = {
        'compact': true,
        'nowrap': true,
        'ismap': true,
        'declare': true,
        'noshade': true,
        'checked': true,
        'disabled': true,
        'readonly': true,
        'multiple': true,
        'selected': true,
        'noresize': true,
        'defer': true
    };

    var Element = function(tag, prop) {
        ///<summary>
        /// 构造函数，创建一个新的$.Element对象。
        ///</summary>
        ///<param name="tag" type="String">要创建的元素的标签名，如div，p等等。</param>
        ///<param name="prop" type="Object">
        ///     元素的style属性，以key/value方式组成一个Object。
        ///</param>
        ///<returns type="$.Element" />

        /* 原本只是用来封装DOM查询结果的
        * 现在增加创建新元素的方法
        * 查询时：
        *   prop为false,
        *   tag为css选择器
        * 创建新元素时：
        *   tag为标签名,
        *   prop为元素的属性
        *     样式可以作为style属性写在create中
        * */
        if (prop !== false) {
            if ($.type(tag) !== 'string') {
                var rt = [];
                for (var p in tag) {
                    rt.push(new Element(p, tag[p]));
                }
                return new Elements(rt);
            }

            var el = repack(document.createElement(tag));
            // 设置样式表
            if (prop) {
                if (prop.style) {
                    el.css(prop.style);
                    delete prop.style;
                }

                if (prop.html) {
                    el.html(prop.html);
                }
            }
            // 设置元素属性
            el.attr(prop);
            return el;
        }

        if ($.type(tag) !== 'string') {
            return repack(tag);
        }
        var el, els, re = /^#([\w-]+)$/;
        if (re.test(tag) || !$.Selector) {
            return repack(document.getElementById(tag.replace('#', '')));
        }
        else {
            els = $.Selector(tag);
            return new Elements(els, false);
        }
    };

    var Elements = function(els) {
        if (els && els.$family !== 'elements') {
            var i = 0, array = [];
            while ((array[i] = repack(els[i++]))) { }
            array.length--;
            var proto = Elements.prototype;
            for (var p in proto) {
                array[p] = proto[p];
            }
            els = array;
        }
        return els;
    };

    function repack(el) {
        if (el && !el.$family && !(/^object|embed$/i).test(el.tagName)) {
            var proto = Element.prototype;
            for (var p in proto) {
                el[p] = proto[p];
            }
        }
        return el;
    }

    $.Native.initialize({
        name: 'Element',
        initialize: Element,
        protect: true,
        afterImplement: function(key, value) {
            if (Array[key]) return;
            Elements.implement(key, function() {
                var items = [], elements = true;
                for (var i = 0, j = this.length; i < j; i++) {
                    var returns = this[i][key].apply(this[i], arguments);
                    items.push(returns);
                    if (elements) elements = ($.type(returns) == 'element');
                }
                return (elements) ? new Elements(items, false) : items;
            });
        }
    });

    $.Native.initialize({
        name: 'Elements',
        initialize: Elements,
        protect: true
    });

    function clean(html) {
        // If a single string is passed in and it's a single tag
        // just do a createElement and skip the rest
        var match = /^<(\w+)\s*\/?>$/.exec(html);
        if (match) {
            return document.createElement(match[1]);
        }

        var ret = [], scripts = [], div = document.createElement("div");

        // Fix "XHTML"-style tags in all browsers
        html = html.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag) {
            return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
						all :
						front + "></" + tag + ">";
        });

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = html.replace(/^\s+/, "").substring(0, 10).toLowerCase();

        var wrap =
        // option or optgroup
					!tags.indexOf("<opt") &&
					[1, "<select multiple='multiple'>", "</select>"] ||

					!tags.indexOf("<leg") &&
					[1, "<fieldset>", "</fieldset>"] ||

					tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
					[1, "<table>", "</table>"] ||

					!tags.indexOf("<tr") &&
					[2, "<table><tbody>", "</tbody></table>"] ||

        // <thead> matched above
					(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
					[3, "<table><tbody><tr>", "</tr></tbody></table>"] ||

					!tags.indexOf("<col") &&
					[2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"] ||

        // IE can't serialize <link> and <script> tags normally
					!support.htmlSerialize &&
					[1, "div<div>", "</div>"] ||

					[0, "", ""];

        // Go to html and back, then peel off extra wrappers
        div.innerHTML = wrap[1] + html + wrap[2];

        // Move to the right depth
        while (wrap[0]--) {
            div = div.lastChild;
        }

        // Remove IE's autoinserted <tbody> from table fragments
        if (support.tbody) {
            // String was a <table>, *may* have spurious <tbody>
            var hasBody = /<tbody/i.test(html),
						tbody = !tags.indexOf("<table") && !hasBody ?
							div.firstChild && div.firstChild.childNodes :
            // String was a bare <thead> or <tfoot>
						    wrap[1] == "<table>" && !hasBody ?
							div.childNodes :
							[];

            for (var j = tbody.length - 1; j >= 0; --j) {
                if ((tbody[j].tagName == "TBODY") && !tbody[j].childNodes.length) {
                    tbody[j].parentNode.removeChild(tbody[j]);
                }
            }
        }

        // IE completely kills leading whitespace when innerHTML is used
        if (!support.leadingWhitespace && /^\s/.test(html)) {
            div.insertBefore(document.createTextNode(html.match(/^\s*/)[0]), div.firstChild);
        }

        return div.firstChild;
    }

    /**
    * Element.Style.js
    *
    * */
    Element.implement({
        hasClass: function(cls) {
            ///<summary>
            /// 是否有指定的CSS类名
            ///</summary>
            ///<param name="cls" type="string">CSS类名</param>
            ///<returns type="Boolean" />

            return (' ' + this.className + ' ').indexOf(' ' + cls + ' ') > -1;
        },

        addClass: function(cls) {
            ///<summary>
            /// 添加CSS类
            ///</summary>
            ///<param name="cls" type="string">CSS类名</param>
            ///<returns type="$.Element" />

            if (!this.hasClass(cls)) {
                this.className = this.className === '' ? cls : (this.className + ' ' + cls);
            }

            return this;
        },

        removeClass: function(cls) {
            ///<summary>
            /// 删除CSS类
            ///</summary>
            ///<param name="cls" type="string">CSS类名</param>
            ///<returns type="$.Element" />

            this.className = this.className.replace(new RegExp('(^|\\s)' + cls + '(?:\\s|$)', 'g'), '$1');
            return this;
        },

        setStyle: function(style, value) {
            ///<summary>
            /// 设置样式
            ///</summary>
            ///<param name="style" type="string">样式名</param>
            ///<param name="value" type="string">样式值</param>
            ///<returns type="$.Element" />

            if (style == 'opacity') {
                value = parseFloat(value);
                if (support.opacity) {
                    this.style.opacity = value;
                }
                else {
                    // Set the alpha filter to set the opacity
                    this.style.filter = (this.style.filter || '').replace(/alpha\([^)]*\)/, '') + (value + '' == 'NaN' ? '' : 'alpha(opacity=' + value * 100 + ')');
                    // IE has trouble with opacity if it does not have layout
                    // Force it by setting the zoom level
                    this.zoom = 1;
                }
                if (value == 0) {
                    if (this.style.visibility != 'hidden') {
                        this.style.visibility = 'hidden';
                    }
                }
                else {
                    if (this.style.visibility != 'visible') {
                        this.style.visibility = 'visible';
                    }
                }
                return;
            }

            style = alias[style] || toCamelCase(style);
            var type = $.type(value);
            if (type != 'string') {
                value = (type != 'array' && type != 'arguments') ? [value] : value;
                var fmt = (unit[style] || '@').split(' '), i = fmt.length, v;
                while (i--) {
                    v = value[i];
                    if (!(v === 0 || v)) {
                        fmt[i] = '';
                    }
                    else {
                        fmt[i] = $.type(v) == 'number' ? fmt[i].replace('@', Math.round(v)) : v;
                    }
                }
                value = fmt.join(' ');
            }
            else if (value == '' + Number(value)) {
                value = Math.round(value);
            }
            try {
                this.style[style] = value;
            }
            catch (e) { }
            return this;
        },

        getStyle: function(style) {
            ///<summary>
            /// 获取样式
            ///</summary>
            ///<param name="style" type="string">样式名</param>
            ///<returns type="string" />
            if (style == 'opacity') {
                if (support.opacity) {
                    return this.style.opacity;
                }
                else {
                    return this.style.filter && this.style.filter.indexOf('opacity=') >= 0 ? (parseFloat(this.style.filter.match(/opacity=([^)]*)/)[1]) / 100) + '' : '';
                }
            }

            style = alias[style] || toCamelCase(style);
            var result = this.style[style];
            if (!(result === 0 || result)) {
                result = [];
                // if is a short, return joined value
                for (var ss in shorts) {

                    if (style != ss) {
                        continue;
                    }
                    for (var s in shorts[ss]) {
                        result.push(this.getStyle(s));
                    }
                    return result.join(' ');
                }
                // or get computed style
                if (this.currentStyle) {
                    return this.currentStyle[style];
                }
                var computed = this.getDocument().defaultView.getComputedStyle(this, null);
                return (computed) ? computed.getPropertyValue([toHyphenCase(style)]) : null;
            }
            /*
            * convert to hex
            *
            if (result) {
            result = ''+ result;
            var color = result.match(/rgba?\([\d\s,]+\)/);
            if (color) result = result.replace(color[0], color[0].rgbToHex());
            }
            //*/
            /*
            * minus border and padding in IE & Opera
            *
            if (Browser.Engine.presto || (Browser.Engine.trident && !$chk(parseInt(result, 10)))) {
            if (style.test(/^(height|width)$/)) {
            var values = (style == 'width') ? ['left', 'right'] : ['top', 'bottom'], size = 0;
            values.each(function(value) {
            size += this.getStyle('border-' + value + '-width').toInt() + this.getStyle('padding-' + value).toInt();
            }, this);
            return this['offset' + property.capitalize()] - size + 'px';
            }
            if ((Browser.Engine.presto) && String(result).test('px')) return result;
            if (property.test(/(border(.+)Width|margin|padding)/)) return '0px';
            }
            //*/
            return result;
        },

        css: function(style, value) {
            ///<summary>
            /// 设置和获取样式
            ///</summary>
            ///<param name="style" type="Object">
            ///	1. (string) 样式名
            /// 2. (object) 样式组			
            ///</param>
            ///<param name="style" type="Object">
            ///	(string) 样式值 [可选]
            /// 若不提供，则获取样式
            ///</param>
            ///<returns type="$.Element" />
            ///<returns type="string" />
            if ($.type(style) == 'object') {
                for (var p in style) {
                    this.setStyle(p, style[p]);
                }
                return this;
            }

            if (value === undefined) {
                return this.getStyle(style);
            }
            else {
                this.setStyle(style, value);
                return this;
            }
        },

        getProperty: function(attr) {
            ///<summary>
            /// 获取属性
            ///</summary>
            ///<param name="style" type="string">属性名</param>
            ///<returns type="string" />
            var key = alias[attr];
            var value = (key) ? this[key] : this.getAttribute(attr, 2);
            return (bools[attr]) ? !!value : (key) ? value : value || null;
        },

        setProperty: function(attr, value) {
            ///<summary>
            /// 设置属性
            ///</summary>
            ///<param name="style" type="string">属性名</param>
            ///<param name="value" type="string">属性值</param>
            ///<returns type="$.Element" />
            var key = alias[attr];
            if (key && bools[attr]) value = !!value;
            key ? this[key] = value : this.setAttribute(attr, '' + value);
            return this;
        },

        attr: function(attr, value) {
            ///<summary>
            /// 设置和获取属性
            ///</summary>
            ///<param name="style" type="Object">
            ///	1. (string) 属性名
            /// 2. (object) 属性组			
            ///</param>
            ///<param name="style" type="Object">
            ///	(string) 属性值 [可选]
            /// 若不提供，则获取属性。
            ///</param>
            ///<returns type="$.Element" />
            ///<returns type="string" />
            if ($.type(attr) == 'object') {
                for (var a in attr) {
                    this.setProperty(a, attr[a]);
                }
                return this;
            }

            if (value === undefined) {
                return this.getProperty(attr);
            }
            else {
                this.setProperty(attr, value);
                return this;
            }
        },

        dimension: function(sz) {
            ///<summary>
            /// 设置和获取大小
            ///</summary>
            ///<param name="style" type="Object">
            ///	带width和height属性的对象[可选]
            /// 若不提供，则获取大小。
            ///</param>
            ///<returns type="$.Element" />
            ///<returns type="object">带width和height属性的对象</returns>
            if (!(sz === 0 || sz)) {
                return { width: this.offsetWidth, height: this.offsetHeight };
            }

            if (sz.width !== undefined) {
                this.css('width', sz.width);
            }
            if (sz.height !== undefined) {
                this.css('height', sz.height);
            }
            return this;
        },

        position: function(pos) {
            ///<summary>
            /// 设置和获取位置
            ///</summary>
            ///<param name="style" type="Object">
            ///	带left和top属性的对象[可选]
            /// 若不提供，则获取位置。
            ///</param>
            ///<returns type="$.Element" />
            ///<returns type="object">带left和top属性的对象</returns>
            if (pos === undefined) {
                if (this.parentNode === null || this.style.display == 'none') {
                    return false;
                }
                if (this.getBoundingClientRect)	// IE
                {
                    box = this.getBoundingClientRect();
                    var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                    var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);

                    return { x: box.left + scrollLeft, y: box.top + scrollTop };
                }
                else if (document.getBoxObjectFor)	// gecko
                {
                    box = document.getBoxObjectFor(this);

                    var borderLeft = (this.style.borderLeftWidth) ? parseInt(this.style.borderLeftWidth) : 0;
                    var borderTop = (this.style.borderTopWidth) ? parseInt(this.style.borderTopWidth) : 0;

                    pos = [box.x - borderLeft, box.y - borderTop];
                }
                else	// safari & opera
                {
                    pos = [this.offsetLeft, this.offsetTop];
                    parent = this.offsetParent;
                    if (parent != this) {
                        while (parent) {
                            pos[0] += parent.offsetLeft;
                            pos[1] += parent.offsetTop;
                            parent = parent.offsetParent;
                        }
                    }
                    if (this.style.position == 'absolute') {
                        pos[0] -= document.body.offsetLeft;
                        pos[1] -= document.body.offsetTop;
                    }
                }

                if (this.parentNode) { parent = this.parentNode; }
                else { parent = null; }

                while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
                    // account for any scrolled ancestors
                    pos[0] -= parent.scrollLeft;
                    pos[1] -= parent.scrollTop;

                    if (parent.parentNode) { parent = parent.parentNode; }
                    else { parent = null; }
                }

                return { x: pos[0], y: pos[1] };
            }

            if (pos.x !== undefined) {
                this.css('left', pos.x);
            }
            if (pos.y !== undefined) {
                this.css('top', pos.y);
            }

            return this;
        }
    });

    /**
    * Element.Dom.js
    *
    * */
    Element.implement({
        getDocument: function() {
            return this.ownerDocument;
        },
        getElement: function(selector) {
            ///<summary>
            /// 获取当前元素下符合选择器的第一个元素
            ///</summary>
            ///<param name="selector" type="String">
            ///   CSS选择器
            ///</param>
            ///<returns type="$.Element" />

            var els = [];
            if ($.Selector) {
                els = $.Selector(selector, this);
            }
            else {
                els = this.getElementsByTagName(selector);
            }
            return els[0] ? new Element(els[0], false) : null;
        },

        getElements: function(selector) {
            ///<summary>
            /// 获取当前元素下符合选择器的所有元素
            ///</summary>
            ///<param name="selector" type="String">
            ///   CSS选择器
            ///</param>
            ///<returns type="$.Elements" />

            if ($.Selector) {
                return new Elements($.Selector(selector, this), false);
            }
            else {
                return new Elements(this.getElementsByTagName(selector), false);
            }
        }
    });

    /**
    * Element.Move.js
    *
    * */
    Element.implement({
        txt: function(text) {
            ///<summary>
            /// 读取或者设置元素内的文本内容
            ///</summary>
            ///<param name="text" type="String">
            ///   [可选]要设置的文本值，如不提供此参数，则读取该元素的文本内容
            ///</param>
            ///<returns type="STRING" />

            if (text === undefined) {
                return this[support.innerText ? 'innerText' : 'textContent'];
            }
            else {
                this.html(text.escapeHTML());
                return text;
            }
        },

        html: function(html) {
            ///<summary>
            /// 读取或者设置元素内的HTML文本
            ///</summary>
            ///<param name="text" type="String">
            ///   [可选]要设置的HTML文本，如不提供此参数，则读取该元素的HTML文本
            ///</param>
            ///<returns type="STRING" />

            if (html !== undefined) {
                this.innerHTML = html;
            }
            return this.innerHTML;
        },

        clone: function(content) {
            ///<summary>
            /// 复制当前元素，返回复制后的元素
            ///</summary>
            ///<param name="content" type="Boolean">
            ///   [可选]是否复制元素的子元素，默认为true
            ///</param>
            ///<returns type="$.Element" />

            // default is clone context of the element
            content = content !== false;
            // Do the clone
            if (support.cloneEvent) {
                // IE copies events bound via attachEvent when
                // using cloneNode. Calling detachEvent on the
                // clone will also remove the events from the orignal
                // In order to get around this, we use innerHTML.
                // Unfortunately, this means some modifications to
                // attributes in IE that are actually only stored
                // as properties will not be copied (such as the
                // the name attribute on an input).
                var html = this.outerHTML;
                if (!html) {
                    var div = this.ownerDocument.createElement("div");
                    div.appendChild(this.cloneNode(content));
                    html = div.innerHTML;
                }

                return new Element(clean(html.replace(new RegExp($.expando + '="(?:\d+|null)"', 'g'), "").replace(/^\s*/, "")), false);
            }
            else {
                return new Element(this.cloneNode(content), false);
            }
        },

        prepend: function(el) {
            ///<summary>
            /// 在当前元素头部插入指定元素
            ///</summary>
            ///<param name="el" type="$.Element">
            ///   要插入的元素
            ///</param>
            ///<returns type="$.Element" />

            el = el.clone();
            if (this.firstChild) {
                this.insertBefore(el, this.firstChild);
            }
            else {
                this.appendChild(el);
            }
            return this;
        },

        append: function(el) {
            ///<summary>
            /// 在当前元素尾部插入指定元素
            ///</summary>
            ///<param name="el" type="$.Element">
            ///   要插入的元素
            ///</param>
            ///<returns type="$.Element" />

            this.appendChild(el.clone());
            return this;
        },

        inject: function(el, pos) {
            ///<summary>
            /// 在当前元素内部插入指定元素
            ///</summary>
            ///<param name="el" type="$.Element">
            ///   要插入的元素
            ///</param>
            ///<param name="pos" type="String">
            ///   [可选]要插入的位置，可为top或者bottom，默认为bottom
            ///</param>
            ///<returns type="$.Element" />

            if (pos == 'top') {
                this.prependTo(el);
            }
            else {
                this.appendTo(el);
            }

            return this;
        },

        insert: function(el, pos) {
            ///<summary>
            /// 把当前元素插入到指定元素的前面或者后面
            ///</summary>
            ///<param name="el" type="$.Element">
            ///   要插入位置的参考元素
            ///</param>
            ///<param name="pos" type="String">
            ///   [可选]要插入的位置，可为before或者after，默认为before
            ///</param>
            ///<returns type="$.Element" />

            if (pos == 'after') {
                this.after(el);
            }
            else {
                this.before(el);
            }

            return this;
        },

        before: function(el) {
            ///<summary>
            /// 在当前元素前面插入指定元素
            ///</summary>
            ///<param name="el" type="$.Element">
            ///   要插入的元素
            ///</param>
            ///<returns type="$.Element" />

            this.parentNode.insertBefore(el.clone(), this);
            return this;
        },

        after: function(el) {
            ///<summary>
            /// 在当前元素后面插入指定元素
            ///</summary>
            ///<param name="el" type="$.Element">
            ///   要插入的元素
            ///</param>
            ///<returns type="$.Element" />

            el = el.clone();
            var p = this.parentNode;
            if (this.nextSibling) {
                p.insertBefore(el, this.nextSibling);
            }
            else {
                p.appendChild(el);
            }
            return this;
        },

        dispose: function() {
            ///<summary>
            /// 把当前元素从父元素中移除
            ///</summary>
            ///<returns type="$.Element" />

            return (this.parentNode) ? this.parentNode.removeChild(this) : this;
        },

        empty: function() {
            ///<summary>
            /// 清除当前元素中的所有内容
            ///</summary>
            ///<returns type="$.Element" />

            var childNodes = this.childNodes, i;
            for (var i = childNodes.length; i > 0; i--) {
                childNodes[i] && $(childNodes[i]).destroy();
            }

            return this;
        },

        destroy: function() {
            ///<summary>
            /// 销毁当前元素并释放内存
            ///</summary>
            ///<returns type="null" />

            this.empty();
            this.dispose();
            this.removeEvents();
            return null;
        }
    });
    Element.alias({ dispose: 'remove' });

    $.Element = Element;
    $.Elements = Elements;
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('window', '1.0.0.0');

    ///<class>
    ///    <name>$.Window</name>
    ///    <summary>
    ///         提供封装好window对象，并提供常用的DOM操作方法。
    ///    </summary>
    ///    <include>$</include>
    ///</class>

    var Window = function(win) {
        if (win && !win.$family) {
            var proto = Window.prototype;
            for (var p in proto) {
                win[p] = proto[p];
            }
        }
        return win;
    };

    $.Native.initialize({
        name: 'Window',
        legacy: window.Window ? window.Window : null,
        initialize: Window,
        afterImplement: function(property, value) {
            window[property] = Window.prototype[property] = value;
        }
    });

    /**
    * window.dimension.js
    * */
    Window.implement({
        dimension: function(sz) {
            ///<summary>
            /// 设置或者获取窗口大小
            ///</summary>
            ///<param name="style" type="Object">
            ///	带width和height属性的对象[可选]
            /// 若不提供，则获取大小。
            ///</param>
            ///<returns type="object">带width和height属性的对象</returns>
            var ww = 0, wh = 0;
            if (typeof (window.innerWidth) == 'number') {
                //Non-IE
                ww = window.innerWidth;
                wh = window.innerHeight;
            }
            else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                //IE 6+ in 'standards compliant mode'
                ww = document.documentElement.clientWidth;
                wh = document.documentElement.clientHeight;
            }
            else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                //IE 4 compatible
                ww = document.body.clientWidth;
                wh = document.body.clientHeight;
            }
            if (!sz) {
                return { width: ww, height: wh };
            }

            if (sz.width !== undefined && sz.height !== undefined) {
                window.resizeTo(sz.width, sz.height);
            }
            else if (sz.width === undefined && sz.height !== undefined) {
                window.resizeTo(ww, sz.height);
            }
            else if (sz.width !== undefined && sz.height === undefined) {
                window.resizeTo(sz.width, wh);
            }
            return this;
        },

        scrollPos: function(pos) {
            var sx = 0, sy = 0;
            if (typeof (window.pageYOffset) == 'number') {
                //Netscape compliant
                sy = window.pageYOffset;
                sx = window.pageXOffset;
            }
            else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                //DOM compliant
                sy = document.body.scrollTop;
                sx = document.body.scrollLeft;
            }
            else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                //IE6 standards compliant mode
                sy = document.documentElement.scrollTop;
                sx = document.documentElement.scrollLeft;
            }
            if (!pos) {
                return { x: sx, y: sy };
            }
            return this;
        }
    });

    new Window(window);
    $.Window = Window;
})(JUI);
(function($) {

    var objs = [], cache = {};

    $.Element && objs.push($.Element);
    $.Window && objs.push($.Window);

    function contains(arr, item) {
        var l = arr.length;
        while (l) {
            if (arr[l--] == item) {
                return true;
            }
        }
        return false;
    }

    /*
    * Data.js     
    * */
    $.Native.implement(objs, {
        cache: function(name, value) {
            ///<summary>
            /// 存储或者读取数据
            ///</summary>
            ///<param name="name" type="String">
            ///   要存储的数据的名称
            ///</param>
            ///<param name="value" type="Object">
            ///   [可选]要存储的数据的值，
            ///   若不提供，则读取已存储的对应的数据。
            ///</param>
            ///<returns type="Object" />

            var uid = $.getUid(this);

            // Only generate the data cache if we're
            // trying to access or manipulate it
            if (name && !cache[uid]) {
                cache[uid] = {};
            }

            // Prevent overriding the named cache with undefined values
            if (value !== undefined) {
                cache[uid][name] = value;
                return value;
            }

            // Return the named cache data, or the ID for the element
            return name ? cache[uid][name] : uid;
        },

        erase: function(name) {
            ///<summary>
            /// 清除存储的数据
            ///</summary>
            ///<param name="name" type="String">
            ///   [可选]要删除的数据的名称，
            ///   若不提供，则删除存储的所有数据。
            ///</param>
            ///<returns type="$.Window" />

            var uid = $.getUid(this);

            // If we want to remove a specific section of the element's data
            if (name) {
                if (cache[uid]) {
                    // Remove the section of cache data
                    delete cache[uid][name];

                    // If we've removed all the data, remove the element's cache
                    name = "";

                    for (name in cache[uid])
                        break;

                    (!name) && this.erase();
                }

                // Otherwise, we want to remove all of the element's data
            } else {
                // Completely remove the data cache
                delete cache[uid];
            }

            return this;
        }
    });

    /**
    * Event.js
    * */
    $.Native.implement(objs, {
        addEvent: function(type, fn, bind, same) {
            ///<summary>
            /// 添加事件
            ///</summary>
            ///<param name="type" type="String">事件类型，不带前面的on</param>
            ///<param name="fn" type="Fucntion">事件处理函数</param>
            ///<param name="bind" type="Object">事件处理函数中this指向的对象</param>
            ///<param name="same" type="Boolean">是否允许重复添加完全相同的事件</param>
            ///<returns type="$.Element" />
            var events = this.cache('events') || this.cache('events', {});
            bind = bind ? bind : this;

            events[type] = events[type] || { keys: [], values: [] };
            if (!same && contains(events[type].keys, fn)) {
                return this;
            }

            var defn = function(e) {
                if ($.Event) {
                    e = new $.Event(e);
                }
                fn.call(bind, e);
            };

            if (type == 'unload') {
                var old = defn;
                defn = function() {
                    self.removeListener('unload', defn);
                    old();
                };
            }

            if (this.addEventListener) {
                this.addEventListener(type, defn, false);
            }
            else {
                this.attachEvent('on' + type, defn);
            }

            events[type].keys.push(fn);
            events[type].values.push(defn);

            return this;
        },

        removeEvent: function(type, fn) {
            ///<summary>
            /// 添加事件
            ///</summary>
            ///<param name="type" type="String">事件类型，不带前面的on</param>
            ///<param name="fn" type="Fucntion">
            ///   [可选]事件处理函数，如果不提供则删除所有该类型的事件
            ///</param>
            ///<returns type="$.Window" />

            var events = this.cache('events');
            if (!events || !events[type]) {
                return this;
            }

            if (!fn) {
                // remove all events of this type
                var i = 0, fns = events[type].keys;
                while (fn = fns[i++]) {
                    this.removeEvent(type, fn);
                }
                delete events[type];

                type = "";
                for (type in events) {
                    break;
                }

                if (!type) {
                    this.erase();
                }
                else {
                    this.cache('events', events);
                }

                return this;
            }

            var pos = -1, i = 0, f;
            while (f = events[type].keys[i]) {
                if (f == fn) {
                    pos = i;
                    break;
                }
                i++;
            }
            if (pos == -1) {
                return this;
            }

            events[type].keys.splice(pos, 1)
            fn = events[type].values.splice(pos, 1)[0];
            if (this.removeEventListener) {
                this.removeEventListener(type, fn, false);
            }
            else {
                this.detachEvent('on' + type, fn);
            }

            return this;
        },

        addEvents: function(events) {
            ///<summary>
            /// 一次性添加多个事件
            ///</summary>
            ///<param name="events" type="Object">
            ///   一个以事件类型为键（key），以事件处理函数为值（value）的hash对象
            ///</param>
            ///<returns type="$.Window" />

            for (var type in events) {
                this.addEvent(type, events[type]);
            }

            return this;
        },

        removeEvents: function(events) {
            ///<summary>
            /// 一次性删除多个事件
            ///</summary>
            ///<param name="events" type="Object">
            ///   [可选]一个以事件类型为键（key），以事件处理函数为值（value）的hash对象；
            ///   如果此参数为一个事件类型，这删除该类型的所有事件；
            ///   如不提供此参数，则删除所有事件。
            ///</param>
            ///<returns type="$.Window" />

            if ($.type(events) == 'object') {
                for (var type in events) {
                    this.removeEvent(type, events[type]);
                }
                return this;
            }

            var attached = this.cache('events');
            if (!attached) {
                return this;
            }

            if (!events) {
                for (var type in attached) {
                    this.removeEvent(type);
                }
                this.erase('events');
            }
            else {
                this.removeEvent(events);
            }
            return this;
        },

        fireEvent: function(type, args, delay) {
            ///<summary>
            /// 添加事件
            ///</summary>
            ///<param name="type" type="String">事件类型，不带前面的on</param>
            ///<param name="args" type="Array">要传递给事件处理函数的参数</param>
            ///<param name="delay" type="Number">延迟触发事件的时间</param>
            ///<returns type="$.Window" />

            var events = this.cache('events');
            if (!events || !events[type]) {
                return this;
            }

            var i = 0, fns = events[type], fn, ret, self = this;
            while (fn = fns[i++]) {
                ret = function(f) {
                    return function() {
                        f.apply(self, args);
                    }
                };
                setTimeout(ret(fn), delay);
            }

            return this;
        }
    });
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('event', '1.0.0.0');

    var keys = {
        '8': 'backspace',
        '9': 'tab',
        '13': 'enter',
        '27': 'esc',
        '32': 'space',
        '38': 'up',
        '40': 'down',
        '37': 'left',
        '39': 'right',
        '46': 'delete'
    };
    ///<class>
    ///    <name>$.Event</name>
    ///    <summary>
    ///         提供封装好Event对象。
    ///    </summary>
    ///    <include>$</include>
    ///</class>
    var Event = function(event) {

        if (event.$family === 'event') {
            return event;
        }

        var doc = document, win = window, type = event.type;
        var target = event.target || event.srcElement;
        while (target && target.nodeType == 3) {
            target = target.parentNode;
        }

        if (/key/.test(type)) {
            var code = event.which || event.keyCode;
            var key = keys[code];
            if (type == 'keydown') {
                var fKey = code - 111;
                if (fKey > 0 && fKey < 13) key = 'f' + fKey;
            }
            key = key || String.fromCharCode(code).toLowerCase();
        }
        else if (type.match(/(click|mouse|menu)/i)) {
            doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.documentElement : doc.body;
            var page = {
                x: event.pageX || event.clientX + doc.scrollLeft,
                y: event.pageY || event.clientY + doc.scrollTop
            };
            var client = {
                x: (event.pageX) ? event.pageX - win.pageXOffset : event.clientX,
                y: (event.pageY) ? event.pageY - win.pageYOffset : event.clientY
            };
            if (type.match(/DOMMouseScroll|mousewheel/)) {
                var wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
            }
            var rightClick = (event.which == 3) || (event.button == 2);
        }

        return (function(a, b) {
            for (var p in b) {
                a[p] = b[p];
            }
            return a;
        })(this, {
            event: event,
            type: type,

            page: page,
            client: client,
            rightClick: rightClick,

            wheel: wheel,

            target: target,

            code: code,
            key: key,

            shift: event.shiftKey,
            control: event.ctrlKey,
            alt: event.altKey,
            meta: event.metaKey
        });
    };

    $.Native.initialize({
        name: 'Event',
        initialize: Event,
        protect: true
    });

    Event.implement({
        stop: function() {
            ///<summary>
            /// 终止所有类型事件传播，返回当前对象。
            ///</summary>
            ///<returns type="$.Event" />
            return this.stopPropagation().preventDefault();
        },

        stopPropagation: function() {
            ///<summary>
            /// 终止事件冒泡，返回当前对象。
            ///</summary>
            ///<returns type="$.Event" />
            if (this.event.stopPropagation) {
                this.event.stopPropagation();
            }
            else {
                this.event.cancelBubble = true;
            }

            return this;
        },

        preventDefault: function() {
            ///<summary>
            /// 终止事件传播，返回当前对象。
            ///</summary>
            ///<returns type="$.Event" />
            if (this.event.preventDefault) {
                this.event.preventDefault();
            }
            else {
                this.event.returnValue = false;
            }

            return this;
        }
    });

    $.Event = Event;
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('customevent', '1.0.0.0');

    var CustomEvent = function(name) {
        this.events = [];
        this.name = name;
    };

    $.Native.initialize({
        name: 'CustomEvent',
        initialize: CustomEvent,
        protect: true
    });

    CustomEvent.implement({
        fire: function() {
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            for (var i = 0, len = this.events.length; i < len; i++) {
                var et = this.events[i];
                et[0].call(et[1], this.name, args);
            }
        },

        subscribe: function(fn, scope) {
            this.events.push([fn, scope]);
        },

        clear: function() {
            this.events = [];
        }
    });

    $.CustomEvent = CustomEvent;
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('loader', '1.0.0.0');

    var loading = {}, _source, cbIndex = 1, cbPrefix = 'jui_cb_';
    ///<class>
    ///    <name>$.Loader</name>
    ///    <summary>
    ///         载入类
    ///    </summary>
    ///    <include>$</include>
    ///</class>

    var Loader = function(source) {
        _source = source;
        return this;
    };

    $.Native.initialize({
        name: 'Loader',
        initialize: Loader,
        protect: true
    });

    function load(options) {

        options = options || _source || {};

        var src, charset, type = 'js', callback = $.empty, useParam, bind, cache;
        src = options.url;
        type = options.type;
        charset = options.charset;
        callback = options.callback;
        bind = options.bind;
        useParam = options.param;
        cache = options.cache;

        if (!src || src == '') {
            return;
        }

        try {
            // generate callback functions and add parameters to url
            if (useParam && callback) {
                $.Loader[cbPrefix + cbIndex] = function() {
                    callback.apply(bind, arguments);
                }
                if (src.indexOf('?') > -1) {
                    src = src + '&cb=JUI.Loader.' + cbPrefix + cbIndex;
                }
                else {
                    src = src + '?cb=JUI.Loader.' + cbPrefix + cbIndex;
                }
                if (!cache) {
                    src = src + '&r=' + Math.random();
                }
                cbIndex++;
            }

            var dom;
            if (type == 'css') {
                dom = document.createElement('link');
                dom.rel = 'stylesheet';
                dom.type = 'text/css';
                dom.href = src;
            }
            else {
                dom = document.createElement('script');
                dom.src = src;
                dom.type = 'text/javascript';
            }
            charset && (dom.charset = charset);

            if (!useParam && callback) {
                dom.onload = function() {
                    callback.apply(bind, [src, true]);
                    //callback(src, true);
                };

                dom.onerror = function() {
                    callback.apply(bind, [src, false]);
                    //callback(src, false);
                };

                dom.onreadystatechange = function() {
                    if (dom.readyState == 'loaded') {
                        callback.apply(bind, [src, true]);
                        //callback(src, true);
                    }
                }
            }

            loading[src] = dom;
            document.getElementsByTagName('head')[0].appendChild(dom);
        } catch (e) {
            callback(src, false);
        }
    }

    Loader.implement({
        load: function(list) {
            ///<summary>
            /// 载入内容
            ///</summary>
            ///<param name="list" type="Array">
            /// 内容数组
            ///	每项内容配置[可选]
            /// {
            ///		src:			[string,		内容地址],
            ///		type:			[string,		内容类型][可选，js],
            ///		charset:		[string,		内容编码][可选],
            ///		callback:		[function,		回调函数][可选],
            ///		bind:			[object,		绑定对象][可选，使用必须有callback],
            ///		useParam:		[boolean,		是否使用参数][可选，false],
            ///		cache:			[boolean,		是否缓存内容][可选，false],
            /// }
            ///</param>
            ///<returns type="$.Loader" />
            if (!list) {
                list = [_source];
            }
            else if ($.type(list) != 'array') {
                list = Array.prototype.slice.call(arguments, 0);
            }
            var i = 0, source;
            while (source = list[i++]) {
                load(source);
            }

            return this;
        },

        chain: function(list) {
            ///<summary>
            /// 链式载入内容(按顺序加载)
            ///</summary>
            ///<param name="list" type="Array">
            /// 内容数组
            ///	每项内容配置[可选]
            /// {
            ///		src:			[string,		内容地址],
            ///		type:			[string,		内容类型][可选，js],
            ///		charset:		[string,		内容编码][可选],
            ///		callback:		[function,		回调函数][可选],
            ///		bind:			[object,		绑定对象][可选，使用必须有callback],
            ///		useParam:		[boolean,		是否使用参数][可选，false],
            ///		cache:			[boolean,		是否缓存内容][可选，false],
            /// }
            ///</param>
            if ($.type(list) != 'array') {
                list = Array.prototype.slice.call(arguments, 0);
            }
            if (!list || list.length == 0) {
                return;
            }

            var source = list.shift(), self = this;
            cb = function(l, s) {
                s.callback(s.url);
                self.chain(l);
            };
            this.load({ url: source.url, type: source.type, callback: cb(list, source) });
        },

        cancel: function(src) {
            ///<summary>
            /// 取消正在载入的内容
            ///</summary>
            ///<param name="src" type="String">SRC</param>
            if (!loading[src]) {
                return;
            }

            document.removeChild(loading[src]);
            delete loading[src];
        }
    });

    $.Loader = Loader;
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('ajax', '1.0.0.0');

    function mergeOptions(o, n) {
        for (var p in n) {
            o[p] = n[p];
        }

        return o;
    }

    function objToQueryString(obj) {
        var s = [];
        for (var p in obj) {
            s.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
        return s.join('&');
    }

    function getXHR() {
        var xhr, vers = ['Microsoft.XMLHTTP', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'], i = 0, mx;

        try {
            return new XMLHttpRequest();
        }
        catch (e) {
            while (mx = vers[i++]) {
                try {
                    xhr = new ActiveXObject(mx);
                    return xhr;
                }
                catch (e2) { }
            }
        }

        throw 'can not initialize XMLHttpRequest';
    }

    function parseHeaders(xhr) {
        var headerText = xhr.getAllResponseHeaders(),
            headers = {},
            lines = headerText.split('\n'),
            i = 0,
            line;

        while (line = lines[i++]) {
            if (line.length == 0) {
                continue;
            }

            var pos = line.indexOf(':'),
                name = line.substring(0, pos).replace(/^\s*|\s*$/, ''),
                value = line.substring(pos + 1).replace(/^\s*|\s*$/, '');

            headers[name] = value;
        }

        return headers;
    }

    ///<class>
    ///    <name>$.Ajax</name>
    ///    <summary>
    ///        Ajax类
    ///    </summary>
    ///</class>
    var Ajax = function(options) {
        ///<summary>
        /// 构造函数，创建一个新的Ajax对象，处理所有关于Ajax传输的问题。
        ///</summary>
        ///<param name="options" type="object">
        ///配置[可选]
        /// {
        ///		url:			[string,		Ajax的url][可选],
        ///		method:			[string,		GET还是POST方法][可选，(get)],
        ///		data:			[object,		要传递的数据][可选],
        ///		async:			[boolean,		是否为异步传输][可选，true],
        ///		encoding:		[string,		编码][可选，"utf-8"],
        ///		encode: 		[boolean,		是否转义编码][可选, true],
        ///		headers: 		[object,		浏览器头部][可选，{
        ///     'X-Requested-With': 'XMLHttpRequest',
        ///     'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
        ///     }]
        ///		timeout:		[int,			延时设置][可选，120],
        ///		cache:			[boolean,		是否缓存内容][可选，false],
        ///		link:			[string,		链接][可选，"ignore"],
        ///		type: 		    [string,		类型：支持xhr, xml, text, json][可选, 'xhr']
        ///		bind:			[object,		回调函数的this][可选]
        ///		onStateChange:	[function,		当Ajax状态改变时要调用的方法][可选],
        ///		onTimeout:		[function,		当Ajax超时时要调用的方法][可选],
        ///		onStart:		[function,		当Ajax开始时要调用的方法][可选],
        ///		onEnd:			[function,		当Ajax结束时要调用的方法][可选],
        ///		onSuccess:		[function,		当Ajax成功时要调用的方法][可选],
        ///		onFailure:		[function,		当Ajax失败时要调用的方法][可选],
        ///		onCancel:		[function,		当Ajax取消时要调用的方法][可选],
        /// }
        /// </param>
        /// <returns type="$.Ajax" />
        var _options = {
            url: null,
            method: 'GET',
            data: null,
            async: true,
            encoding: 'utf-8',
            encode: true,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
            },
            timeout: 120,
            cache: false,
            link: 'ignore',
            type: 'xhr',    // supports xhr, xml, text, json
            bind: null,     // the object of 'this' referer to in callback
            onStateChange: $.empty,
            onTimeout: $.empty,
            onStart: $.empty,
            onEnd: $.empty,
            onSuccess: $.empty,
            onFailure: $.empty,
            onCancel: $.empty
        };

        options = options || {};
        if (options.headers) {
            options.headers = mergeOptions(_options.headers, options.headers);
        }
        _options = mergeOptions(_options, options);

        this.options = _options;
        this.xhr = getXHR();
        this.running = false;
        this.timeoutId = null;
        this.timeouted = false;

        return this;
    };

    $.Native.initialize({
        name: 'Ajax',
        initialize: Ajax,
        protect: true
    });

    Ajax.implement({
        setHeader: function(name, value) {
            ///<summary>
            /// 设置单个头部，返回当前对象。
            ///</summary>
            ///<param name="name" type="string">键名</param>
            ///<param name="value" type="string">键值</param>
            ///<returns type="$.Ajax" />

            this.options.headers[name] = value;
            return this;
        },

        setHeaders: function(headers) {
            ///<summary>
            /// 设置头部组，返回当前对象。
            ///</summary>
            ///<param name="headers" type="object">头部组</param>
            ///<returns type="$.Ajax" />

            this.options.headers = mergeOptions(this.options.headers, headers);
            return this;
        },

        send: function(options) {
            ///<summary>
            /// 发送一个请求，返回当前对象。
            ///</summary>
            ///<param name="options" type="object">内容同$.Ajax构造函数</param>
            ///<returns type="$.Ajax" />

            if ($.type(options) == 'string') {
                options = { url: options };
            }

            options = options || {};

            if (options.headers) {
                options.headers = mergeOptions(this.options.headers, options.headers);
            }
            this.options = mergeOptions(this.options, options);
            if (arguments.length == 2 && typeof arguments[1] == 'string') {
                this.options.type = arguments[1];
            }

            var _options = this.options;

            // process parameters
            var data = _options.data, url = _options.url, method = _options.method.toUpperCase(), qm = false;

            if (!url || url == '') {
                throw 'url is empty';
            }

            this.running = true;

            qm = url.indexOf('?') > -1;

            data = objToQueryString(data);
            if (data != '' && method == 'GET') {
                url = url + (qm ? '&' : (qm = true, '?')) + data;
                data = null;
            }
            if (!_options.cache) {
                url = url + (qm ? '&' : '?') + new Date().getTime();
            }

            // encode
            if (_options.encode && method == 'POST') {
                var encoding = (_options.encoding) ? '; charset=' + _options.encoding : '';
                //_options.headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
                _options.headers['Content-type'] = 'application/x-www-form-urlencoded';
            }

            // open
            this.xhr.open(method, url, _options.async);

            // set headers
            var hs = _options.headers;
            for (var h in hs) {
                try {
                    this.xhr.setRequestHeader(h, hs[h]);
                }
                catch (e) {
                    // fire exception event
                }
            }

            function stateChange() {
                if (this.timeouted) {
                    // when timeout, return the url of timeouted
                    _options.onTimeout.call(_options.bind, url);
                }

                if (this.xhr.readyState == 4) {
                    try {
                        clearTimeout(this.timeoutId);
                    }
                    catch (e) { }
                    this.status = this.xhr.status;
                    try {
                        if (_options.type == 'header' || _options.type == 'headers') {
                            _options.onSuccess.call(_options.bind, parseHeaders(this.xhr));
                        }
                        else {
                            if (this.xhr.status == 200) {
                                //alert('ok');  // return ok
                                var ret = this.xhr;
                                switch (_options.type) {
                                    case 'text':
                                    case 'html':
                                        ret = this.xhr.responseText;
                                        break;
                                    case 'json':
                                        ret = window['eval']('(' + this.xhr.responseText + ')');
                                        break;
                                    case 'xml':
                                        ret = this.xhr.responseXML;
                                        break;
                                }
                                _options.onSuccess.call(_options.bind, ret);
                            }
                            else {
                                //alert(this.xhr.status);   // on failed
                                // when failed, return status code
                                _options.onFailure.call(_options.bind, this.xhr.status);
                            }
                        }
                    }
                    catch (e) {
                        //alert('failed');
                        // when failed, return status code
                        _options.onFailure.call(_options.bind, -1);
                    }
                    //alert('ended');
                    _options.onEnd.call(_options.bind, url);
                }

                _options.onStateChange(this.xhr, url);
            }

            var onStateChange = (function(self) {
                return function() {
                    stateChange.call(self);
                }
            })(this);

            this.xhr.onreadystatechange = onStateChange;
            this.timeoutId = setTimeout((function(self) {
                return function() {
                    self.timeouted = true;
                    self.xhr.abort();
                    self.running = false;
                    self.xhr.onreadystatechange = $.empty;
                }
            })(this), _options.timeout * 1000);

            //fire start event
            _options.onStart.call(_options.bind, url);
            this.xhr.send(data);
            if (!_options.async) {
                onStateChange();
            }

            return this;
        },

        get: function(options) {
            ///<summary>
            /// GET方法发送请求完成后，onSuccess事件返回响应的XMLHttpRequest对象。
            ///</summary>
            ///<param name="options" type="object">内容同$.Ajax构造函数</param>
            ///<returns type="$.Ajax" />
            this.send(options, 'xhr');
            return this;
        },

        post: function(options) {
            ///<summary>
            /// POST方法发送，请求完成后，onSuccess事件返回响应的XMLHttpRequest对象。
            ///</summary>
            ///<param name="options" type="object">内容同$.Ajax构造函数</param>
            ///<returns type="$.Ajax" />
            this.send(options, 'xhr');
            return this;
        },

        json: function(options) {
            ///<summary>
            /// JSON请求，请求完成后，onSuccess事件返回响应的JSON对象。
            ///</summary>
            ///<param name="options" type="object">内容同$.Ajax构造函数</param>
            ///<returns type="$.Ajax" />
            this.send(options, 'json');
            return this;
        },

        text: function(options) {
            ///<summary>
            /// 文本请求，请求完成后，onSuccess事件返回响应的文本内容。
            ///</summary>
            ///<param name="options" type="object">内容同$.Ajax构造函数</param>
            ///<returns type="$.Ajax" />
            this.send(options, 'text');
            return this;
        },

        xml: function(options) {
            ///<summary>
            /// XML请求，请求完成后，onSuccess事件返回响应的XML文档。
            ///</summary>
            ///<param name="options" type="object">内容同$.Ajax构造函数</param>
            ///<returns type="$.Ajax" />
            this.send(options, 'xml');
            return this;
        },

        headers: function(options) {
            ///<summary>
            /// headers请求，请求完成后，onSuccess事件返回响应的headers。
            ///</summary>
            ///<param name="options" type="object">内容同$.Ajax构造函数</param>
            ///<returns type="$.Ajax" />
            this.send(options, 'headers');
            return this;
        },

        cancel: function() {
            ///<summary>
            /// 取消当前请求。
            ///</summary>
            ///<returns type="$.Ajax" />
            if (!this.running) {
                return this;
            }

            this.running = false;
            this.xhr.abort();
            this.xhr.onreadystatechange = $.empty;
            //this.xhr = getXHR();
            return this;
        }
    });

    $.Ajax = Ajax;
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('json', '1.0.0.0');

    var special = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };

    function replaceChars(chr) {
        return special[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
    }

    ///<class>
    ///    <name>$.JSON</name>
    ///    <summary>
    ///        JSON工具类
    ///    </summary>
    ///    <include>$</include>
    ///</class>
    var JSON = {
        decode: function(s) {
            ///<summary>
            /// 将JSON字符串解码为js对象
            ///</summary>
            ///<param name="s" type="string">JSON字符串</param>
            ///<returns type="object" />
            if ($.type(s) != 'string' || !s.length) return null;
            return eval('(' + s + ')');
        },

        encode: function(obj) {
            ///<summary>
            /// 将js对象编码为JSON字符串
            ///</summary>
            ///<param name="obj" type="string">js对象</param>
            ///<returns type="string" />
            var s = [];
            switch ($.type(obj)) {
                case 'undefined':
                    return 'undefined';
                    break;
                case 'null':
                    return 'null';
                    break;
                case 'number':
                case 'boolean':
                case 'date':
                case 'function':
                    return obj.toString();
                    break;
                case 'string':
                    return '"' + obj.replace(/[\x00-\x1f\\"]/g, replaceChars) + '"';
                    break;
                case 'array':
                    for (var i = 0, l = obj.length; i < l; i++) {
                        s.push($.JSON.encode(obj[i]));
                    }
                    return '[' + s.join(',') + ']';
                    break;
                case 'error':
                case 'object':
                    for (var p in obj) {
                        s.push('"' + p.replace(/[\x00-\x1f\\"]/g, replaceChars) + '"' + ':' + $.JSON.encode(obj[p]));
                    }
                    return '{' + s.join(',') + '}';
                    break;
                default:
                    return '';
                    break;
            }
        }
    }

    $.JSON = JSON;

})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('cookie', '1.0.0.0');

    ///<class>
    ///    <name>$.Cookie</name>
    ///    <summary>
    ///         用来读写Cookie，提供常用的Cookie操作方法。
    ///    </summary>
    ///    <include>$</include>
    ///</class>

    var _options = {
        encode: false,
        decode: false,
        path: false,
        domain: false,
        duration: false,
        secure: false,
        document: document
    };

    function mergeOptions(options) {
        for (var p in options) {
            _options[p] = options[p];
        }
    }

    var Cookie = {
        write: function(key, value, options) {
            ///<summary>
            /// 写cookie，返回当前对象。
            ///</summary>
            ///<param name="key" type="string">KEY</param>
            ///<param name="value" type="string">VALUE</param>
            ///<param name="options" type="object">
            ///配置[可选]
            /// {
            ///     encode:     [boolean,   是否对value进行URI编码][可选],
            ///     domain:     [string,    域][可选],
            ///     path:       [string,    路径][可选],
            ///     duration:   [int,       过期时间(单位/天)][可选],
            ///     encode:     [boolean,   是否对value进行URI编码][可选]
            /// }
            ///</param>
            ///<returns type="$.Cookie" />
            mergeOptions(options);
            if (_options.encode) value = encodeURIComponent(value);
            if (_options.domain) value += '; domain=' + _options.domain;
            if (_options.path) value += '; path=' + _options.path;
            if (_options.duration) {
                var date = new Date();
                date.setTime(date.getTime() + _options.duration * 24 * 3600000);
                value += '; expires=' + date.toGMTString();
            }
            if (_options.secure) value += '; secure';
            _options.document.cookie = key + '=' + value;
            return this;
        },

        read: function(key, options) {
            ///<summary>
            /// 读cookie，返回读取的值。
            ///</summary>
            ///<param name="key" type="string">KEY</param>
            ///<param name="options" type="object">
            ///配置[可选]
            /// {
            ///     encode:     [boolean,   是否对value进行URI编码][可选],
            ///     domain:     [string,    域][可选],
            ///     path:       [string,    路径][可选],
            ///     duration:   [int,       过期时间(单位/天)][可选],
            ///     decode:     [boolean,   是否对value进行URI解码][可选]
            /// }
            ///</param>
            ///<returns type="String">返回读取的值，如果不存在，则返回null.</returns>
            mergeOptions(options);
            var value = _options.document.cookie.match('(?:^|;)\\s*' + key.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + '=([^;]*)');
            // 默认decode，否则不decode
            if (_options.decode) {
                return (value) ? decodeURIComponent(value[1]) : null;
            }
            else {
                return (value) ? value[1] : null;
            }
        },

        remove: function(key, options) {
            ///<summary>
            /// 删除cookie
            ///</summary>
            ///<param name="key" type="string">KEY</param>
            ///<param name="options" type="object">
            ///配置[可选]
            /// {
            ///     encode:     [boolean,   是否对value进行URI编码][可选],
            ///     domain:     [string,    域][可选],
            ///     path:       [string,    路径][可选],
            ///     duration:   [int,       过期时间(单位/天)][可选],
            ///     encode:     [boolean,   是否对value进行URI解码][可选]
            /// }
            ///</param>
            ///<returns type="$.Cookie" />
            mergeOptions(options);
            _options.duration = -1;
            Cookie.write(key, '');
            return this;
        }
    };

    $.Cookie = Cookie;

})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('browser', '1.0.0.0');
    ///<class>
    ///    <name>$.browser</name>
    ///    <summary>
    ///        浏览器甄别类。
    ///        $.browser.ie     // Internet Explorer版本号
    ///        $.browser.opera  // Opera版本号
    ///        $.browser.gecko  // Mozilla Firefox版本号
    ///        $.browser.webkit // Apple Safari & Google Chrome版本号
    ///        $.browser.mobile // Mobile平台版本号
    ///    </summary>
    ///    <include>$</include>
    ///</class>

    // browser detection
    $.browser = {};      // user agents
    (function() {
        $.browser = {
            ie: 0,          // Internet Explorer
            opera: 0,       // Opera
            gecko: 0,       // Mozilla Firefox
            webkit: 0,      // Apple Safari & Google Chrome
            mobile: null    // Mobile Platform
        };

        var ua = navigator.userAgent, m;

        // Modern KHTML browsers should qualify as Safari X-Grade
        if ((/KHTML/).test(ua)) {
            $.browser.webkit = 1;
        }
        // Modern WebKit browsers are at least X-Grade
        m = ua.match(/AppleWebKit\/([^\s]*)/);
        if (m && m[1]) {
            $.browser.webkit = parseFloat(m[1]);

            // Mobile browser check
            if (/ Mobile\//.test(ua)) {
                $.browser.mobile = "Apple"; // iPhone or iPod Touch
            } else {
                m = ua.match(/NokiaN[^\/]*/);
                if (m) {
                    $.browser.mobile = m[0]; // Nokia N-series, ex: NokiaN95
                }
            }
        }

        if (!$.browser.webkit) { // not webkit
            // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
            m = ua.match(/Opera[\s\/]([^\s]*)/);
            if (m && m[1]) {
                $.browser.opera = parseFloat(m[1]);
                m = ua.match(/Opera Mini[^;]*/);
                if (m) {
                    $.browser.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
                }
            } else { // not opera or webkit
                m = ua.match(/MSIE\s([^;]*)/);
                if (m && m[1]) {
                    $.browser.ie = parseFloat(m[1]);
                } else { // not opera, webkit, or ie
                    m = ua.match(/Gecko\/([^\s]*)/);
                    if (m) {
                        $.browser.gecko = 1; // Gecko detected, look for revision
                        m = ua.match(/rv:([^\s\)]*)/);
                        if (m && m[1]) {
                            $.browser.gecko = parseFloat(m[1]);
                        }
                    }
                }
            }
        }
    })();
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('fx', '1.0.0.0');

    function mergeOptions(o, n) {
        for (var p in n) {
            o[p] = n[p];
        }

        return o;
    }

    function capitalize(str) {
        return str.replace(/\b[a-z]/g, function(match) {
            return match.toUpperCase();
        });
    }

    var Fx = function(options) {
        var _options = {
            // events
            onStart: $.empty,
            onComplete: $.empty,
            onCancel: $.empty,
            onEnterFrame: $.empty,   // just like actionscript, it fired when it changed
            // settings
            fps: 50,        // frames per second
            duration: 500,  // duration
            unit: false,    // it canbe px, em, % and etc. TODO: implement it
            link: 'ignore', // TODO: implement it
            effect: false   // no effect in default 
        },
            _period = 20,
            _timer = null,
            _time = 0,      // current time
            _from = 0,
            _change = 0,
            _transition = function(p) {
                return p;
            },
            _self = this;

        _options = mergeOptions(_options, options);

        function move() {
            var pos = ($.now() - _time) / _options.duration;
            if (pos >= 1) {
                _self.stopTimer();
                pos = 1;
            }
            pos = _transition(pos);
            _self.change(pos);
            _options.onEnterFrame(pos);
        }

        this.change = function(value) {
            return value;
        };

        this.startTimer = function(options) {
            _options = mergeOptions(_options, options);
            _period = Math.round(1000 / _options.fps);

            if (_options.effect && $.Fx.Transitions) {
                var data = _options.effect.split(':');
                _transition = $.Fx.Transitions;
                _transition = _transition[capitalize(data[0])];
                if (data[1]) {
                    _transition = _transition['ease' + capitalize(data[1]) + (data[2] ? capitalize(data[2]) : '')];
                }
            }

            _time = $.now();
            try {
                clearInterval(_timer);
            }
            catch (e) { }
            _timer = setInterval(move, _period);
            _options.onStart();
        };

        this.stopTimer = function() {
            clearInterval(_timer);
            _options.onComplete();
        };

        this.cancelTimer = function() {
            clearInterval(_timer);
            _options.onCancel();
        };

        return this;
    };

    $.Native.initialize({
        name: 'Fx',
        initialize: Fx,
        protect: false
    });

    $.Fx = Fx;
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
/*
* requires:
*   element.js
*   fx.js
*
* */
(function($) {
    // add to loaded module-list
    //$.register('fx.morph', '1.0.0.0');

    ///<class>
    ///    <name>$.Fx.Morph</name>
    ///    <summary>
    ///         动画操作类。
    ///    </summary>
    ///    <include>$,$.Element,$.Fx</include>
    ///</class>

    var Morph = function(dom, options) {
        ///<summary>
        /// 构造函数，创建一个新的$.Fx.Morph对象。
        ///</summary>
        ///<param name="dom" type="Object">要创建的Dom或者选择器</param>
        ///<param name="options" type="Object">
        ///配置[可选]
        /// {
        ///		onStart:		[function,		当动画开始时要调用的方法][可选],
        ///		onComplete:		[function,		当动画完成时要调用的方法][可选],
        ///		onCancel:		[function,		当动画取消时要调用的方法][可选],
        ///		onEnterFrame:	[function,		当动画改变时要调用的方法][可选],
        ///		fps:			[int,			每秒钟填充图像的帧数（帧/秒）][可选(50)],
        ///		duration:		[function,		动画的持续时间][可选(500)],
        ///		unit:			[string,		单位，可以是px，em，%等等][可选，未实现(false)],
        ///		link:			[string,		元素上的链接][可选，未实现(ignore)],
        ///		effect:			[string,		动画效果，例："Quad:in:out"][可选，(false)],
        /// }
        ///</param>
        ///<returns type="$.Morph" />

        var _from = {}, _change = {}, _dom = $(dom);

        // 继承父类的方法
        this.constructor.superclass.constructor.apply(this, [options]);

        this.change = function(pos) {
            ///<summary>
            /// 立即改变样式
            ///</summary>
            ///<param name="pos" type="string">样式的改变量</param>

            ///<returns type="undefined" />
            for (var p in _from) {
                _dom.setStyle(p, Math.round(_from[p] + pos * _change[p]));
            }
        };

        this.start = function(styles, options) {
            ///<summary>
            /// 启动动画
            ///</summary>
            ///<param name="styles" type="object">要改变的样式，例：{ 'width': [200, 800], 'height': [20, 200] }</param>
            ///<param name="options" type="object">
            ///配置[可选]
            /// {
            /// }
            ///</param>
            ///<returns type="undefined" />

            if (!styles) {
                return;
            }

            for (var p in styles) {
                if ($.type(styles[p]) !== 'array' || styles[p].length === 1 || styles[p][0] === undefined) {
                    _from[p] = parseFloat(_dom.getStyle(p));
                    _from[p] = isNaN(_from[p]) ? 0 : _from[p];
                    _change[p] = parseFloat(styles[p][0] === undefined ? styles[p] : styles[p][1]);
                    _change[p] = (isNaN(_change[p]) ? 0 : _change[p]) - _from[p];
                }
                else {
                    _from[p] = parseFloat(styles[p][0]);
                    _from[p] = isNaN(_from[p]) ? 0 : _from[p];
                    _change[p] = parseFloat(styles[p][1]);
                    _change[p] = (isNaN(_change[p]) ? 0 : _change[p]) - _from[p];
                }
            }
            this.startTimer();
        };
    };

    Morph = $.extend(Morph, $.Fx);


    $.Native.initialize({
        name: 'Fx.Morph',
        initialize: Morph,
        protect: false
    });

    $.Fx.Morph = Morph;
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
/*
* requires:
*   fx.js
*
* */

(function($) {
    // add to loaded module-list
    //$.register('fx.transitions', '1.0.0.0');

    /*
    * Easing Equations by Robert Penner
    * http://www.robertpenner.com/easing/
    * Modified from mootools
    * http://mootools.net
    * 
    **/
    var transitions = {
        Linear: function(p) {
            return p;
        },

        Pow: function(p, x) {
            return Math.pow(p, x || 6);
        },

        Expo: function(p) {
            return Math.pow(2, 8 * (p - 1));
        },

        Circ: function(p) {
            return 1 - Math.sin(Math.acos(p));
        },

        Sine: function(p) {
            return 1 - Math.sin((1 - p) * Math.PI / 2);
        },

        Back: function(p, x) {
            x = x || 1.618;
            return Math.pow(p, 2) * ((x + 1) * p - x);
        },

        Bounce: function(p) {
            var value;
            for (var a = 0, b = 1; 1; a += b, b /= 2) {
                if (p >= (7 - 4 * a) / 11) {
                    value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
                    break;
                }
            }
            return value;
        },

        Elastic: function(p, x) {
            return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x || 1) / 3);
        }
    };

    var ts = ['Quad', 'Cubic', 'Quart', 'Quint'], i = 0, t;
    while (t = ts[i]) {
        transitions[t] = function(p) {
            return Math.pow(p, i + 2);
        };
        i++;
    }

    $.Fx.Transitions = {};

    for (t in transitions) {
        $.Fx.Transitions[t] = (function(t) {
            return {
                easeIn: function(pos, seg) {
                    return transitions[t](pos, seg);
                },
                easeOut: function(pos, seg) {
                    return 1 - transitions[t](1 - pos, seg);
                },
                easeInOut: function(pos, seg) {
                    return (pos <= 0.5) ? transitions[t](2 * pos, seg) / 2 : (2 - transitions[t](2 * (1 - pos), seg)) / 2;
                }
            }
        })(t);
    }
})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    var PhotoSlide = function(tp, width, height, ops) {
        this.onChangePage = new $.CustomEvent('onChangePage');
        //可选参数默认值
        this.ops = {
            //切换按钮触发事件
            btnTriggerEvent: 'click',
            //自动切换频率时间,小于1为不自动切换
            autoSwitchTime: 5000,
            //横向or竖向    horizontal|vertical
            direction: 'horizontal',

            onChangePage: null
        };
        this.mergeOptions(ops);

        if (this.ops.onChangePage != null) {
            this.onChangePage.subscribe(this.ops.onChangePage);
        }

        this.pageCount = 0;
        this.selectedPageNum = 0;

        this.width = width;
        this.height = height;

        this.tpEl = tp;
        this.init();
    };

    $.Native.initialize({
        name: 'PhotoSlide',
        initialize: PhotoSlide,
        protect: true
    });

    PhotoSlide.implement({
        mergeOptions: function(ops) {
            for (var p in ops) {
                this.ops[p] = ops[p];
            }
        },

        beginAutoSwitch: function() {
            if (this.ops.autoSwitchTime < 1 || this.pageCount < 2) {
                return;
            }
            clearInterval(this.sid);
            var self = this;
            this.sid = setInterval(function() {
                var pn = 0;
                if (self.selectedPageNum < self.pageCount - 1) {
                    pn = self.selectedPageNum + 1;
                }
                self.changePage(pn);

            }, this.ops.autoSwitchTime);
        },

        stopAutoSwitch: function() {
            clearInterval(this.sid);
        },

        init: function() {
            this.picsEl = this.tpEl.getElement('div.pics');
            this.picsEl.css({ 'width': this.width, 'height': this.height, 'overflow': 'hidden' });

            this.picsMoveEl = this.picsEl.getElement('div');

            this.fx = new $.Fx.Morph(this.picsMoveEl, { duration: 500, effect: 'Quad:in:out' });

            this.titleEl = this.tpEl.getElement('div.info .title');
            this.btnsEl = this.tpEl.getElement('div.info .btns');

            this.tpEl.addEvent('mouseover', function(ev) {
                this.stopAutoSwitch();
            }, this);

            this.tpEl.addEvent('mouseout', function(ev) {
                this.beginAutoSwitch();
            }, this);

            this.fnc();
        },

        fnc: function() {
            this.infos = [];

            var els = this.picsMoveEl.getElements('div');
            this.pageCount = els.length;
            if (this.pageCount == 0) {
                return;
            }

            var w = this.width;
            var h = this.height;
            if (this.ops.direction == 'horizontal') {
                w = this.pageCount * this.width;
            } else {
                h = this.pageCount * this.height;
            }

            this.picsMoveEl.css({ 'width': w, 'height': h, 'overflow': 'hidden' });
            var s = [];
            for (var i = 0, len = this.pageCount; i < len; i++) {
                els[i].css({ 'width': this.width, 'height': this.height, 'overflow': 'hidden', 'float': 'left' });
                s.push(['<a href="javascript:;">', i + 1, '</a>'].join(''));

                var aels = els[i].getElements('a');
                if (aels.length > 0) {
                    this.infos.push({ title: aels[0].attr('title'), link: aels[0].attr('href') });
                } else {
                    this.infos.push({ title: 'No Text', link: '' });
                }
            }

            if (this.btnsEl != null) {
                this.btnsEl.html(s.join(''));
                var btns = this.btnsEl.getElements('a');

                //bind event
                btns.addEvent(this.ops.btnTriggerEvent, function(ev) {
                    var ix = parseInt($(ev.target).html()) - 1;
                    this.changePage(ix);
                }, this);
            }

            this.changePage(0);

            this.beginAutoSwitch();
        },

        changePage: function(ix) {
            if (this.btnsEl != null) {
                var btns = this.btnsEl.getElements('a');
                btns[this.selectedPageNum].className = '';
                btns[ix].className = 'now';
            }

            if (this.titleEl != null) {
                var info = this.infos[ix];
                this.titleEl.html(info.title);
                this.titleEl.attr('href', info.link);
            }

            this.selectedPageNum = ix;

            this.onChangePage.fire(this.selectedPageNum);

            if (this.ops.direction == 'horizontal') {
                this.fx.start({ 'margin-left': -(this.selectedPageNum * this.width) });
            } else {
                this.fx.start({ 'margin-top': -(this.selectedPageNum * this.height) });
            }
        }
    });

    $.PhotoSlide = PhotoSlide;

})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    var TabView = function(tabs, views, tabChangeCallBack, ops) {
        if (tabs.length != views.length) {
            alert('JUI:TabView  参数 [tabs] [views] 包含的element.length不相等');
            return;
        }
        this.ops = {
            tabTriggerEvent: 'mouseover'
        };
        this.mergeOptions(ops);

        for (var i = 0, len = tabs.length; i < len; i++) {
            tabs[i].attr('jsvalue', i);
        }
        this.selectedTabIx = 0;

        var self = this;

        this.changeTab = function(ix) {
            tabChangeCallBack(tabs[self.selectedTabIx], tabs[ix]);
            views[self.selectedTabIx].css('display', 'none');
            self.selectedTabIx = ix;
            views[self.selectedTabIx].css('display', 'block');
        }

        tabs.addEvent(this.ops.tabTriggerEvent, function(ev) {
            var ix = parseInt(this.attr('jsvalue'));
            self.changeTab(ix);
        });
    };

    $.Native.initialize({
        name: 'TabView',
        initialize: TabView,
        protect: true
    });

    TabView.implement({
        mergeOptions: function(ops) {
            for (var p in ops) {
                this.ops[p] = ops[p];
            }
        }
    });

    $.TabView = TabView;

})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    // add to loaded module-list
    //$.register('ikan.comment', '1.0.0.0');

    function merge(o1, o2) {
        for (var p in o1) {
            if (typeof o2[p] != 'undefined') {
                o1[p] = o2[p];
            }
        }
    }

    function qs(obj) {
        var s = [];
        for (var p in obj) {
            s.push(p + '=' + encodeURIComponent(obj[p]));
        }
        return s.join('&');
    }

    var urls = {
        checkCodeImg: 'http://bk.{0}/checkcode/',
        getList: 'http://bk.{0}/xihttp/ikan2/comment/json/get/?',
        post: 'http://bk.{0}/xihttp/ikan2/comment/json/post/?',
        up: 'http://bk.{0}/xihttp/ikan2/comment/json/post/up/?',
        report: 'http://bk.{0}/addreport/',
        userHome: 'http://home.pptv.com/callerhome/'
    };

    var dm = document.domain;
    var url = 'pplive.com';
    if (dm != '') {
        url = dm.indexOf('pptv.com') != -1 ? 'pptv.com' : url;
    }
    for (var p in urls) {
        urls[p] = urls[p].replace('{0}', url)
    }

    var Comment = {
        isOneGetCheckCode: true,
        replyId: null,
        listCount: 0,
        pageCount: 0,
        onPost: new $.CustomEvent('onPost'),

        timeLine: 0,
        episodeId: '',

        setUrls: function(urlList) {
            merge(urls, urlList);
        },

        rebind: function(cnf) {
            this.cnf = {
                type: null,
                id: null,
                num: 20,
                ipage: 1
            };
            merge(this.cnf, cnf);
            this.getList();
        },

        init: function(el, cnf, ops) {
            this.cnf = {
                type: null,
                id: null,
                num: 20,
                ipage: 1
            };
            merge(this.cnf, cnf);

            this.ops = {
                contentMaxLength: 100,
                pageNumSplit: ' | '
            };
            if (ops) {
                merge(this.ops, ops);
            }

            $.IKan.User2.onLogined.subscribe(this.onLogined, this);
            $.IKan.User2.onlogouted.subscribe(this.onlogouted, this);

            this.lsboxel = el.getElement('div.CommentList');
            this.count_els = el.getElements('.CommentCount');

            this.pageNumInfo_els = el.getElements('.PageNum .AllNum');
            this.pageList_els = el.getElements('.PageNum .PageList');
            this.btnRef_els = el.getElements('.btnRef');

            //tp
            var qel = el.getElement('div.inquote');
            this.lsItemQuoteTp = qel.html();
            qel.innerHTML = '{Replies_HTML}';
            this.lsItemTp = this.lsboxel.html();
            this.lsboxel.html('');

            this.form_btnLogout_el = el.getElement('a.btnLogout');
            this.form_btnLogin_el = el.getElement('a.btnLogin');
            this.form_userName_el = el.getElement('a.userName');
            this.form_ckNotUser_el = el.getElement('input.ckNotUser');
            this.form_txtContent_el = el.getElement('textarea.txtContent');
            this.form_btnPost_el = el.getElement('input.btnPost');
            this.form_txtCheckCode_el = el.getElement('input.txtCheckCode');
            this.form_imgCheckCode_el = el.getElement('img.imgCheckCode');
            this.form_refCheckCode_el = el.getElement('a.refCheckCode');

            this.form_userName_el.css('display', 'none');
            this.form_btnLogout_el.css('display', 'none');

            this.form_ckNotUser_el.checked = true;
            this.form_ckNotUser_el.css('display', 'none');
            this.form_txtContent_el.value = '';
            this.form_txtCheckCode_el.value = '';
            this.bindEvent();
            this.getList();
        },

        onLogined: function(name, args) {
            var userInfo = args[0];

            this.form_ckNotUser_el.checked = false;
            this.form_userName_el.html(userInfo.UserName);
            this.form_userName_el.css('display', '');
            this.form_btnLogout_el.css('display', '');
            this.form_ckNotUser_el.css('display', '');
            this.form_btnLogin_el.css('display', 'none');
        },

        onlogouted: function(name, args) {
            this.form_ckNotUser_el.checked = true;
            this.form_userName_el.css('display', 'none');
            this.form_btnLogout_el.css('display', 'none');
            this.form_ckNotUser_el.css('display', 'none');
            this.form_btnLogin_el.css('display', '');
        },

        bindEvent: function() {
            this.form_refCheckCode_el.addEvent('click', function(ev) {
                this.refCheckCodeImg();
                this.form_txtCheckCode_el.focus();
                this.form_txtCheckCode_el.select();
                ev.stop();
            }, this);

            this.form_txtCheckCode_el.addEvent('focus', function() {
                if (this.isOneGetCheckCode) {
                    this.refCheckCodeImg();
                }
            }, this);

            this.form_txtContent_el.addEvent('keydown', function(ev) {
                if (ev.key == 'enter' && ev.control) {
                    this.post();
                    ev.stop();
                }
            }, this);

            this.form_txtCheckCode_el.addEvent('keydown', function(ev) {
                if (ev.key == 'enter' && ev.control) {
                    this.post();
                    ev.stop();
                }
            }, this);

            this.form_btnPost_el.addEvent('click', function(ev) {
                this.post();
                ev.stop();
            }, this);

            this.form_btnLogin_el.addEvent('click', function(ev) {
                var pt = this.position();
                $.IKan.User2.showLoginBox(pt);
                ev.stop();
            });

            this.form_btnLogout_el.addEvent('click', function(ev) {
                //退出
                $.IKan.User2.logout();
            });

            this.btnRef_els.addEvent('click', function(ev) {
                this.getList();
                ev.stop();
            }, this);
        },

        post: function() {
            var self = this;

            var content = this.form_txtContent_el.value;
            var isReply = false;
            var mh = content.match(/\[回复 \S* 的发言\]/g);
            if (mh) {
                content = content.replace(mh, '');
                if (this.replyId != null) {
                    isReply = true;
                }
            }
            if (content.length == 0) {
                this.form_txtContent_el.focus();
                return;
            }

            if (this.form_txtCheckCode_el.value.length == 0) {
                this.form_txtCheckCode_el.focus();
                return;
            }

            var o = {
                'notbkuser': this.form_ckNotUser_el.checked ? 1 : 0,
                'content': content.substring(0, this.ops.contentMaxLength),
                'checkcode': this.form_txtCheckCode_el.value
            };

            this.onPost.fire();

            if (isReply) {
                o['cid'] = this.replyId;
            } else {
                o['timeline'] = this.timeLine;
                o['episodeid'] = this.episodeId;
            }
            var url = urls.post + qs(this.cnf) + '&' + qs(o);

            this.timeLine = 0;
            this.episodeId = '';
            new $.Loader({ url: url, type: 'js', callback: function(d) { self.postFnc(d); }, param: true }).load();
        },

        postFnc: function(d) {
            if (d.Status == 1) {
                //alert('评论/回复成功!');
                this.refCheckCodeImg();
                this.form_txtCheckCode_el.value = '';
                this.form_txtContent_el.value = '';
                this.replyId = null;
                this.cnf.ipage = 1;
                this.getList();
            } else {
                alert(d.Msg);
            }
        },

        refCheckCodeImg: function() {
            this.isOneGetCheckCode = false;
            this.form_imgCheckCode_el.src = urls.checkCodeImg + '?v=' + Math.random();
        },

        getList: function() {
            this.lsboxel.html('评论加载中...');
            var self = this;
            var url = urls.getList + qs(this.cnf);
            new $.Loader({ url: url, type: 'js', callback: function(d) { self.fillList(d); }, param: true }).load();
        },

        fillList: function(d) {
            if (d.Status == 0) {
                this.lsboxel.html('');
                //alert('评论加载失败');
                return;
            }

            if (this.count_els.length > 0) {
                this.count_els.html(d.Data.CommentCount);
            }

            this.listCount = d.Data.CommentCount;

            var ss = [];
            for (var i = 0, len = d.Data.Comments.length; i < len; i++) {
                ss.push(this.parseItem(d.Data.Comments[i]));
            }
            this.lsboxel.html(ss.join(''));

            this.updatePagePanel();
        },

        updatePagePanel: function() {
            if (this.pageNumInfo_els.length > 0) {
                this.pageNumInfo_els.html('第' + ((this.cnf.ipage - 1) * this.cnf.num) + '-' + (this.cnf.ipage * this.cnf.num) + '条 共' + this.listCount + '条');
            }
            if (this.pageList_els.length == 0) {
                return;
            }

            this.pageCount = Math.ceil(this.listCount / this.cnf.num);
            var sa = [];
            var currPage = this.cnf.ipage;
            var sp = 1;
            var ep = this.pageCount;
            sp = currPage - 3;
            ep = currPage + 3;
            if (sp < 1) {
                sp = 1;
                ep = this.pageCount > 7 ? 7 : this.pageCount;
            }
            if (ep > this.pageCount) {
                sp = this.pageCount - 6;
                ep = this.pageCount;
            }
            if (currPage != 1) {
                sa.push('<a href="javascript:;" onclick="$.IKan.Comment.pageChange(-1);return false;">上一页</a>');
            }
            if (currPage > 4 && this.pageCount > 7) {
                sa.push('<a href="javascript:;" onclick="$.IKan.Comment.pageChange(1);return false;">1</a>');
                sa.push('...');
            }
            if (sp < 1) {
                sp = 1;
            }
            for (var i = sp; i <= ep; i++) {
                if (currPage == i) {
                    sa.push('<a href="javascript:;" onclick="$.IKan.Comment.pageChange(' + i + ');return false;" class="now" style="font-weight:bold;color:orange;">' + i + '</a>');
                } else {
                    sa.push('<a href="javascript:;" onclick="$.IKan.Comment.pageChange(' + i + ');return false;">' + i + '</a>');
                }
            }
            if (currPage < this.pageCount - 3 && this.pageCount > 7) {
                sa.push('...');
                sa.push('<a href="javascript:;" onclick="$.IKan.Comment.pageChange(' + this.pageCount + ');return false;">' + this.pageCount + '</a>');
            }
            if (currPage != this.pageCount && this.pageCount != 0) {
                sa.push('<a href="javascript:;" onclick="$.IKan.Comment.pageChange(-2);return false;">下一页</a>');
            }

            this.pageList_els.html(sa.join(this.ops.pageNumSplit));
        },

        pageChange: function(ix) {
            if (ix == -1) {
                this.cnf.ipage--;
            } else if (ix == -2) {
                this.cnf.ipage++;
            } else {
                this.cnf.ipage = ix;
            }
            this.getList();
        },

        parseItem: function(item) {
            var qs = [];
            if (item.Replies.length > 0) {
                for (var i = 0, len = item.Replies.length; i < len; i++) {
                    qs.push(this.parseItemQuote(item.Replies[i]));
                }
                item['quote_begin'] = '';
                item['quote_end'] = '';
            } else {
                item['quote_begin'] = '<!--';
                item['quote_end'] = '-->';
            }

            item['Replies_HTML'] = qs.join('');

            var userName = item['UserName'];
            var userFace = item['UserFace'];
            var isLoginUser = this.checkLoginUser(userName);

            if (isLoginUser) {
                item['UserName_HTML'] = '<span><a href="' + urls.userHome + userName + '" target="_blank">' + userName + '</a></span>';
                item['UserFace_HTML'] = '<a href="' + urls.userHome + userName + '" target="_blank"><img src="' + userFace + '" width="40" height="40" /></a>';
            } else {
                item['UserName_HTML'] = userName;
                item['UserFace_HTML'] = '<img src="' + userFace + '" width="40" height="40" />';
            }


            var s = this.lsItemTp;
            for (var p in item) {
                s = s.replace(new RegExp('\\{(\\w*)\\}', 'g'), function() {
                    var nn = arguments[1];
                    if (typeof item[nn] == 'undefined') {
                        return arguments[0];
                    }
                    return item[nn];
                });
            }
            return s;
        },

        parseItemQuote: function(item) {
            var s = this.lsItemQuoteTp;

            var userName = item['UserName'];
            var userFace = item['UserFace'];
            var isLoginUser = this.checkLoginUser(userName);

            if (isLoginUser) {
                item['UserName_HTML'] = '<span><a href="' + urls.userHome + userName + '" target="_blank">' + userName + '</a></span>';
                item['UserFace_HTML'] = '<a href="' + urls.userHome + userName + '" target="_blank"><img src="' + userFace + '" width="20" height="20" /></a>';
            } else {
                item['UserName_HTML'] = userName;
                item['UserFace_HTML'] = '<img src="' + userFace + '" width="20" height="20" />';
            }

            for (var p in item) {
                s = s.replace(new RegExp('\\{(\\w*)\\}', 'g'), function() {
                    var nn = arguments[1];
                    if (typeof item[nn] == 'undefined') {
                        return arguments[0];
                    }

                    return item[nn];
                });
            }

            return s;
        },

        checkLoginUser: function(s) {
            return s.match(/\d*.\d.*/g) ? false : true;
        },

        ref: function() {
            this.getList();
        },

        reply: function(id, userName) {
            this.replyId = id;
            this.form_txtContent_el.value = 'xxx';
            this.form_txtContent_el.focus();
            this.form_txtContent_el.value = '[回复 ' + userName + ' 的发言]\n';
            this.form_txtContent_el.focus();
        },

        report: function(id) {
            window.open(urls.report + this.cnf.type + '/' + this.cnf.id + '/' + id);
        },

        up: function(id, el) {
            var self = this;

            var url = urls.up + 'type=' + this.cnf.type + '&cid=' + id;
            new $.Loader({ url: url, type: 'js', callback: function(d) {
                if (d.Status == 1) {
                    if (el != null) {
                        el.html(parseInt(el.html()) + 1);
                        el.css('color', 'red');
                    }
                    alert('支持成功!');
                } else {
                    alert(d.Msg);
                }
            }, param: true
            }).load();
        }
    };

    if (typeof $.IKan == 'undefined') {
        $.IKan = {};
    }

    $.IKan.Comment = Comment;

})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    var domain = 'pplive.com';
    if (document.domain != '') {
        domain = document.domain.indexOf('pptv.com') != -1 ? 'pptv.com' : domain;
    }

    var SearchTips = function(inputEl, btnEl, ops) {
        this.inputel = inputEl;
        this.btnel = btnEl;

        this.ops = {
            defaultText: '-- 请输入关键字 --',
            defaultTextColor: '#999999',
            textColor: '#000000',
            tipBoxWidth: '182px',
            strLength: 26,
            searchSuggestUrl: 'http://ikan.' + domain + '/search/suggest/?kw=',
            searchUrl: 'http://ikan.' + domain + '/search/?kw='
        };
        this.mergeOptions(ops);

        this.init();
    };

    $.Native.initialize({
        name: 'SearchTips',
        initialize: SearchTips,
        protect: true
    });

    SearchTips.implement({
        mergeOptions: function(ops) {
            for (var p in ops) {
                this.ops[p] = ops[p];
            }
        },

        truncate: function(txt, len, ae) {
            var tl = 0, ts = [], tt = txt.length;
            for (var i = 0; i < tt; i++) {
                if (txt.charCodeAt(i) > 255) {
                    tl += 2;
                }
                else {
                    tl++;
                }
                if (tl > len) {
                    break;
                }
            }
            return (ae && i < tt) ? txt.substring(0, i) + '...' : txt.substring(0, i);
        },

        getText: function() {
            return this.inputel.value.replace(/(^\s+)|(\s+$)/gm, '');
        },

        setDefaultState: function() {
            this.inputel.value = this.ops.defaultText;
            this.inputel.css('color', this.ops.defaultTextColor);
        },

        setNormalState: function(txt) {
            this.inputel.value = txt ? txt : '';
            this.inputel.css('color', this.ops.textColor);
        },

        init: function() {
            this.tipsLis = [];
            this.selectedIx = -1;
            this.prevText = '';
            this.gotourl = '';


            this.setDefaultState();

            this.tipboxel = document.createElement('ul');
            this.tipboxel.className = 'sm_search_tips';
            this.tipboxel.style.overflow = 'hidden';
            this.tipboxel.style.position = 'absolute';
            this.tipboxel.style.zIndex = 1000;
            this.tipboxel.style.width = this.ops.tipBoxWidth;
            this.tipboxel.style.display = 'none';
            document.documentElement.getElementsByTagName('body')[0].appendChild(this.tipboxel);

            this.inputel.addEvent('focus', this.input_focus, this);
            this.inputel.addEvent('blur', this.input_blur, this);
            this.inputel.addEvent('keydown', this.input_key_down, this);
            this.inputel.addEvent('keyup', this.input_key_up, this);
            this.btnel.addEvent('click', this.btn_click, this);
            $(document).addEvent('click', function() {
                this.hideTipBox();
            }, this);
        },

        fillList: function(d) {
            this.tipsLis = [];
            this.selectedIx = -1;
            this.prevText = this.getText();
            if (d.length == 0) {
                this.hideTipBox();
                return;
            }
            var s = [];
            for (var i = 0, len = d.length; i < len; i++) {
                s.push(['<li><a href="', d[i].link, '">', this.truncate(d[i].name, this.ops.strLength), '</a></li>'].join(''));
            }
            this.tipboxel.innerHTML = s.join('');

            this.tipsLis = this.tipboxel.getElementsByTagName('li');

            this.showTipBox();
        },

        setSelectedItem: function(dp) {
            if (this.tipsLis.length == 0) {
                return;
            }

            if (this.selectedIx == -1) {
                this.selectedIx = 0;
            } else {
                this.tipsLis[this.selectedIx].className = '';
                this.selectedIx += dp;
            }

            if (this.selectedIx < 0) {
                this.selectedIx = this.tipsLis.length - 1;
            }

            if (this.selectedIx >= this.tipsLis.length) {
                this.selectedIx = 0;
            }

            this.tipsLis[this.selectedIx].className = 'current';
            this.gotourl = this.tipsLis[this.selectedIx].getElementsByTagName('a')[0].href;
        },

        showTipBox: function() {
            this.gotourl = '';
            var pos = this.inputel.position();
            this.tipboxel.style.top = pos.y + 24 + 'px';
            this.tipboxel.style.left = pos.x + 'px';
            this.tipboxel.style.display = 'block';
        },

        hideTipBox: function() {
            this.gotourl = '';
            this.tipboxel.style.display = 'none';
        },

        getSuggestList: function() {
            var self = this;

            var ld = new $.Loader({ url: this.ops.searchSuggestUrl + encodeURIComponent(this.getText()),
                type: 'js',
                callback: function(d) {
                    self.fillList.call(self, d);
                },
                param: true
            });
            ld.load();
        },

        input_key_up: function() {
            if (this.getText() == '') {
                this.hideTipBox();
            }
            if (this.getText() != '' && this.getText() != this.ops.defaultTex && this.prevText != this.getText()) {
                var self = this;
                clearTimeout(this.tid);
                this.tid = setTimeout(function() {
                    self.getSuggestList();
                }, 400);
            }

        },

        input_focus: function() {
            if (this.getText() == this.ops.defaultText) {
                this.setNormalState();
            }
        },

        input_blur: function() {
            if (this.getText() == '') {
                this.setDefaultState();
            }
        },

        btn_click: function() {
            if (this.getText() != '' && this.getText() != this.ops.defaultText) {
                window.location.href = this.ops.searchUrl + encodeURIComponent(this.getText());
            }
        },

        input_key_down: function(ev) {
            switch (ev.key) {
                case 'enter':
                    if (this.gotourl != '') {
                        window.location.href = this.gotourl;
                    } else {
                        this.btn_click();
                    }
                    break;
                case 'up':
                    this.setSelectedItem(-1);
                    break;
                case 'down':
                    this.setSelectedItem(1);
                    break;
            }
        }
    });

    if (typeof $.IKan == 'undefined') {
        $.IKan = {};
    }

    $.IKan.SearchTips = SearchTips;

})(JUI);
/*
* Author:
*   xushengs@gmail.com
*   http://fdream.net/
* */
(function($) {
    var domain = 'pplive.com';
    if (document.domain.toLowerCase().indexOf('pptv.com') != -1) {
        domain = 'pptv.com';
    }

    var urls = {
        login: 'http://passport.pptv.com/weblogin.do?',
        addFavor: 'http://bk.pptv.com/xihttp/ikan2/favor/json/post/?',
        favorCheck: 'http://bk.pptv.com/xihttp/ikan2/favor/json/check/?',
        like: 'http://bk.pptv.com/xihttp/ikan2/score/json/post/?',
        likeCheck: 'http://bk.pptv.com/xihttp/ikan2/score/json/check/?'
    };

    var isLogined = false, isOneLoad = true;

    var User2 = {
        onLogined: new $.CustomEvent('onLogined'),
        onlogouted: new $.CustomEvent('onlogouted'),

        userInfo: {
            Gender: '',
            PpNum: '',
            ExpNum: '',
            LevelName: '',
            NextLevelName: '',
            NextLevelExpNum: '',
            Area: '',
            Subscribe: '',
            UnreadNotes: '',
            HeadPic: '',
            Email: '',
            OnlineTime: '',
            UserName: ''
        },

        tryReadUserInfo: function() {
            var UDI = $.Cookie.read('UDI');
            var PPName = $.Cookie.read('PPName');

            if (UDI == null || PPName == null) {
                this.onlogouted.fire();
                return;
            }
            var ss = PPName.split('$');
            this.userInfo['UserName'] = decodeURIComponent(ss[0]);

            var uinfo = UDI.split('$');
            var ix = 0;
            for (var p in this.userInfo) {
                if (p == 'UserName') {
                    break;
                }
                this.userInfo[p] = decodeURIComponent(uinfo[ix]);
                ix++;
            }
            isLogined = true;
            this.onLogined.fire(this.userInfo);
        },

        wirteUserInfo: function(d) {
            var ops = { domain: domain, path: '/', duration: 7 };
            for (var p in d) {
                $.Cookie.write(p, d[p], ops);
            }
        },

        logout: function() {
            var ops = { domain: domain, path: '/' };
            $.Cookie.remove('PPKey', ops);
            $.Cookie.remove('UDI', ops);
            $.Cookie.remove('PPName', ops);
            isLogined = false;
            this.onlogouted.fire();
        },

        login: function(name, pwd) {
            var self = this;
            var url = urls.login + 'username=' + name + '&password=' + pwd;
            new $.Loader({ url: url, type: 'js', callback: function(status, d) { self.loginFnc(status, d); }, param: true }).load();
        },

        loginFnc: function(status, d) {
            if (status == 0) {
                alert(d);
                return;
            }
            if (status == 1) {
                this.usernameel.value = '';
                this.userpwdel.value = '';
                this.hideLoginBox();
                this.wirteUserInfo(d);
            }
            this.tryReadUserInfo();
        },

        checkLogined: function() {
            return isLogined;
        },

        showLoginBox: function(position) {
            if (isOneLoad) {
                isOneLoad = false;
                this.boxel = $('#loginBox');
                this.btnpostel = this.boxel.getElement('.btnPost');
                this.usernameel = this.boxel.getElement('.userName');
                this.userpwdel = this.boxel.getElement('.userPwd');

                this.usernameel.value = '';
                this.userpwdel.value = '';

                $(document).addEvent('click', function(ev) { if (ev.target.getAttribute('stopdocumentclick') == null) { this.hideLoginBox(); } }, this);
                this.boxel.addEvent('click', function(ev) { if (ev.target.tagName != 'A') { ev.stop(); } });

                this.btnpostel.addEvent('click', function(ev) { this.checkLoginForm(); }, this);
                this.usernameel.addEvent('keydown', function(ev) { if (ev.key == 'enter') { this.checkLoginForm(); } }, this);
                this.userpwdel.addEvent('keydown', function(ev) { if (ev.key == 'enter') { this.checkLoginForm(); } }, this);
            }

            this.boxel.css({ 'display': 'block' });

            var x = 0;
            var y = 0;
            x = position.x;
            y = position.y;
            this.boxel.css({ 'top': y, 'left': x });
            this.usernameel.focus();
        },

        hideLoginBox: function() {
            this.boxel.css('display', 'none');
        },

        checkLoginForm: function() {
            if (this.usernameel.value.length == 0) {
                this.usernameel.focus();
                return;
            }
            if (this.userpwdel.value.length == 0) {
                this.userpwdel.focus();
                return;
            }

            this.login(this.usernameel.value, this.userpwdel.value);
        },

        favor: function(mode, type, id, cb) {
            var url = (mode == 'add' ? urls.addFavor : urls.favorCheck) + 'type=' + type + '&id=' + id;
            new $.Loader({ url: url, type: 'js', callback: function(d) {
                cb(d);
            }, param: true
            }).load();
        },

        like: function(mode, type, id, like2nolike, cb) {
            var url = (mode == 'add' ? urls.like : urls.likeCheck) + 'type=' + type + '&id=' + id + '&attitude=' + like2nolike;
            new $.Loader({ url: url, type: 'js', callback: function(d) {
                cb(d);
            }, param: true
            }).load();
        }
    };

    if (typeof $.IKan == 'undefined') {
        $.IKan = {};
    }

    $.IKan.User2 = User2;

})(JUI);

// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

window.jui_ext = window.$$ = {};
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

window.DEBUG = true;

// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

window.Txt = {
    copySuccess: "复制成功！",
    copyFail: "被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'",
    OK: "确定"
};


// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

window.log = function(o) {
    if (window.console && window.console.log && DEBUG) window.console.log(o);
};

window.warn = function(o) {
    if (window.console && window.console.warn && DEBUG) window.console.warn(o);
};

window.info = function(o) {
    if (window.console && window.console.info && DEBUG) window.console.info(o);
};

window.err = function(o) {
    if (window.console && window.console.error && DEBUG) window.console.error(o);
};

window.group = function(o, isExpanded) {
    if (window.console && window.console.group && isExpanded && DEBUG) window.console.group(o);
    else if (window.console && window.console.groupCollapsed && !isExpanded && DEBUG) window.console.groupCollapsed(o);
};

window.groupEnd = function() {
    if (window.console && window.console.groupEnd && DEBUG) window.console.groupEnd();
};
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****


// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {
    $.Ajax.__ajax = new $.Ajax();
    $.Loader.__loader = new $.Loader();
    $.post = function(url, data, callback, type) {
        ///<summary>
        /// 用post方法Ajax请求
        ///</summary>
        ///<param name="url" type="string">
        /// Ajax请求地址
        ///</param>
        ///<param name="url" type="object">
        /// Post 参数
        ///</param>
        ///<param name="url" type="object">
        /// 回调函数
        ///</param>
        ///<param name="url" type="object">
        /// 类型，[可选，默认"text"]
        ///</param>
        var options = {
            url: url,
            method: "POST",
            data: data,
            onSuccess: callback
        };
        var ajax = $.Ajax.__ajax;
        switch (type) {
            case "json":
                ajax.json(options);
                break;
            default:
                ajax.text(options);
        }
    };
    var objToQueryString = function(obj) {
        var s = [];
        for (var p in obj) {
            s.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return s.join("&");
    }
    $.load = function(url, data, callback) {
        ///<summary>
        /// 用loader方法请求
        ///</summary>
        ///<param name="url" type="string">
        /// loader请求地址
        ///</param>
        ///<param name="url" type="object">
        /// 传输参数
        ///</param>
        ///<param name="url" type="object">
        /// 回调函数
        ///</param>
        $.Loader.__loader.load({
            url: url + "?" + objToQueryString(data),
            callback: callback,
            param: true
        });
    };
    $.postJSON = function(url, data, callback) {
        ///<summary>
        /// 用post方法Ajax请求JSON
        ///</summary>
        ///<param name="url" type="string">
        /// Ajax请求地址
        ///</param>
        ///<param name="url" type="object">
        /// Post 参数
        ///</param>
        ///<param name="url" type="object">
        /// 回调函数
        ///</param>
        $.post(url, data, callback, "json");
    }
})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {
    $.Window.implement({
        width: function(w) {
            if (w) this.dimension({ width: w });
            else return this.dimension().width;
        },
        height: function(h) {
            if (h) this.dimension({ height: h });
            else return this.dimension().height;
        },
        scroll_left: function(l) {
            if (l) this.scrollPos({ x: l });
            else return this.scrollPos().x;
        },
        scroll_top: function(t) {
            if (t) this.dimension({ y: t });
            else return this.scrollPos().y;
        }
    });

    $.Element.implement({
        pd: function(left, top, width, height) {
            return this.css({
                left: left,
                top: top,
                width: width,
                height: height
            });
        },
        w: function(w) {
            if (w) this.dimension({ width: w });
            else return this.dimension().width;
        },
        h: function(h) {
            if (h) this.dimension({ height: h });
            else return this.dimension().height;
        }
    });

})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {
    $.format = $.empty;

    $.Element.implement({
        format: function(name, options) {
            var args = [].slice.call(arguments, 0); // also: Array.prototype.slice.call(arguments)
            args.shift();
            if ($.format[name]) $.format[name].apply(this, args);
            else err("[NOT IMPLEMENT] $.format." + name + "();");
            return this;
        }
    });




})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {

    $.format.borderRadius = function(radius) {
        ///<summary>
        /// 添加圆角样式
        ///</summary>
        ///<param name="radius" type="int">
        /// 圆角样式大小
        ///</param>
        ///<returns type="$.Element" />
        var $o = this;
        if (mozilla) {
            return $o.css("-moz-border-radius", radius + "px");
        }
        else if (webkit) {
            return $o.css("-webkit-border-radius", radius += "px");
        }
        else if (opera) {
            return $o.css("-khtml-border-radius", radius += "px");
        }
        else if (msie) {
            var width = parseInt($o.w()) - parseInt($o.css("border-width"));
            var height = parseInt($o.h()) - parseInt($o.css("border-width"));
            var roundrect = document.createElement("v:roundrect");
            var $roundrect = $(roundrect).attr({
                arcsize: radius / Math.min(width, height),
                id: $o.attr("id"),
                fillcolor: $o.css("background-color")
            }).css({
                width: width,
                height: height,
                padding: 0,
                border: 0,
                background: "none",
                left: $o.css("left"),
                top: $o.css("top"),
                position: "absolute"
            });
            if (parseInt($o.css("border-width")) > 0) {
                $roundrect.attr("strokecolor", $o.css("border-color"));
                $roundrect.attr("strokeweight", $o.css("border-width"));
                $roundrect.css({
                    left: ($o.css("left") == "auto" ? 0 : $o.css("left")) + parseInt(parseInt($o.css("border-width")) / 2),
                    top: ($o.css("top") == "auto" ? 0 : $o.css("left")) + parseInt(parseInt($o.css("border-width")) / 2)
                });
            }
            else {
                $roundrect.attr("stroked", "false");
            }
            var opacity = $o.css("opacity");
            if (opacity && opacity <= 1) {
                roundrect.appendChild(document.createElement("<v:fill opacity=" + $o.css("opacity") + "></v:fill>"));
            }
            var div = document.createElement("div");
            var $div = $(div).css({
                padding: $o.css("padding"),
                margin: $o.css("border-width")
            }).html($o.html());
            roundrect.appendChild(div);
            return $o.replaceWith(roundrect);
        }
        else {
            return $o.css("border-radius", radius += "px");
        }
    }
})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {
    $.format.flip = function(dir) {
        ///<summary>
        /// 翻转元素
        ///</summary>
        ///<param name="dir" type="string">
        /// "H" 或者 "h": 水平翻转；
        /// "V" 或者 "v": 垂直翻转；
        /// "hv"，"vh"，"HV"或者"VH": 垂直和水平翻转；
        ///</param>
        ///<returns type="$.Element" />
        var $o = this;
        switch (dir) {
            case "H":
            case "h":
                $o.css({
                    transform: "matrix(-1, 0, 0, -1, 0, 0)",
                    MozTransform: "matrix(-1, 0, 0, -1, 0, 0)",
                    webkitTransform: "matrix(-1, 0, 0, -1, 0, 0)",
                    oTransform: "matrix(-1, 0, 0, -1, 0, 0)",

                    filter: "FlipH"
                });
                return;
            case "V":
            case "v":
                $o.css({
                    transform: "matrix(1, 0, 0, -1, 0, 0)",
                    MozTransform: "matrix(1, 0, 0, -1, 0, 0)",
                    webkitTransform: "matrix(1, 0, 0, -1, 0, 0)",
                    oTransform: "matrix(1, 0, 0, -1, 0, 0)",

                    filter: "FlipV"
                });
                break;
            case "hv":
            case "vh":
            case "HV":
            case "VH":
                $o.css({
                    transform: "matrix(-1, 0, 0, 1, 0, 0)",
                    MozTransform: "matrix(-1, 0, 0, 1, 0, 0)",
                    webkitTransform: "matrix(-1, 0, 0, 1, 0, 0)",
                    oTransform: "matrix(-1, 0, 0, 1, 0, 0)",
                    filter: "FlipH FlipV"
                });
                break;
            default:
                err("[PARAM ERROR] (flip) dir only support: \"H\" or \"V\"");
                break;
        }
    }
})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

$.format.photo = function() {
    ///<summary>
    /// 根据图片大小缩放图片到给定的容器
    ///</summary>
    ///<returns type="$.Element" />
    var $o = this;
    var W = parseInt($o.css("width"));
    var H = parseInt($o.css("height"));
    var $img = $o.getElement("img");
    var onload = function() {
        var w = this.width;
        var h = this.height;
        if (w == 1 && h == 1) return;
        var w_h = w / h;
        if (W < H) {
            var $img_height = W / w_h;
            if ($img_height > H) {
                $img.height = H;
                var $img_width = H * w_h;
                $img.width = $img_width;
                $img.css("margin-left", (W - $img_width) / 2);
            }
            else {
                $img.width = W;
                $img.height = $img_height;
                $img.css("margin-top", (H - $img_height) / 2);
            }
        }
        else {
            var $img_width = H * w_h;
            if ($img_width > W) {
                $img.width = W;
                var $img_height = W / w_h;
                $img.height = $img_height;
                $img.css("margin-top", (H - $img_height) / 2);
            }
            else {
                $img.height = H;
                $img.width = $img_width;
                $img.css("margin-left", (W - $img_width) / 2);
            }
        }
        $o.css("overflow", "hidden");
        $img.css({
            visibility: "visible",
            display: "block"
        });
    };
    $img.onload = onload;
    $img.src = $img.alt;
    return $o;
};
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {
    $.format.rotate = function(deg) {
        ///<summary>
        /// 旋转元素
        ///</summary>
        ///<param name="deg" type="int">
        /// 0, 90, 180, 270 这些角度
        ///</param>
        ///<returns type="$.Element" />
        var $o = this;
        deg = parseInt(deg);
        var w = $o.w();
        var h = $o.h();
        var l = parseInt($o.css("left"));
        var t = parseInt($o.css("top"));
        switch (deg) {
            case 0:
                break;
            case 90:
                $o.css({
                    "transform": 'rotate(270deg)',
                    "transform-origin": "0 0",
                    "-moz-transform": 'rotate(270deg)',
                    "-moz-transform-origin": "0 0",
                    "-webkit-transform": 'rotate(270deg)',
                    "-webkit-transform-origin": "0 0",
                    "-o-transform": 'rotate(270deg)',
                    "-o-transform-origin": "0 0",
                    filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)",
                    top: msie ? t : t + w
                });
                break;
            case 180:
                $o.css({
                    "transform": 'rotate(180deg)',
                    "transform-origin": "0 0",
                    "-moz-transform": 'rotate(180deg)',
                    "-moz-transform-origin": "0 0",
                    "-webkit-transform": 'rotate(180deg)',
                    "-webkit-transform-origin": "0 0",
                    "-o-transform": 'rotate(180deg)',
                    "-o-transform-origin": "0 0",
                    filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2)",
                    top: msie ? t : t + h,
                    left: msie ? l : l + w
                });
                break;
            case 270:
                $o.css({
                    "transform": 'rotate(90deg)',
                    "transform-origin": "0 0",
                    "-moz-transform": 'rotate(90deg)',
                    "-moz-transform-origin": "0 0",
                    "-webkit-transform": 'rotate(90deg)',
                    "-webkit-transform-origin": "0 0",
                    "-o-transform": 'rotate(90deg)',
                    "-o-transform-origin": "0 0",
                    filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)",
                    left: msie ? l : l + h
                });
                break;
            default:
                err("[PARAM ERROR] (rotate) deg only support: 0, 90, 180, 270");
                break;
        }
        return $o;
    }
})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {
    $.format.shadow = function(type, options) {
        switch (type) {
            case "box":
                var opts = options.split(" ");
                var offX = opts[0];
                var offY = opts[1];
                var color = opts[2];
                if (color.length == 4) {
                    c = color.split("");
                    color = [c[0], c[1], c[1], c[2], c[2], c[3], c[3]].join("");
                }
                this.css({
                    MozBoxShadow: options,
                    webkitBoxShadow: options,
                    boxShadow: options,
                    filter: "progid:DXImageTransform.Microsoft.dropshadow(offx=" + parseInt(offX) + ", offy=" + parseInt(offY) + ", color=" + color + ")"
                });
                break;
            case "text":
                var opts = options.split(" ");
                var offX = opts[0];
                var offY = opts[1];
                var color = opts[2];
                if (color.length == 4) {
                    c = color.split("");
                    color = [c[0], c[1], c[1], c[2], c[2], c[3], c[3]].join("");
                }
                this.css({
                    textShadow: options,
                    filter: "progid:DXImageTransform.Microsoft.dropshadow(offx=" + parseInt(offX) + ", offy=" + parseInt(offY) + ", color=" + color + ")"
                });
                break;
            case "boxGlow":
                var opts = options.split(" ");
                var strength = opts[0];
                var color = opts[1];
                if (color.length == 4) {
                    c = color.split("");
                    color = [c[0], c[1], c[1], c[2], c[2], c[3], c[3]].join("");
                }
                var l = parseInt(this.css("left"));
                var t = parseInt(this.css("top"));
                var w = this.w();
                var h = this.h();

                this.css({
                    MozBoxShadow: "0px 0px " + strength + " " + options,
                    webkitBoxShadow: "0px 0px " + strength + " " + options,
                    boxShadow: "0px 0px " + strength + " " + options,
                    filter: "progid:DXImageTransform.Microsoft.glow(color=" + color + ",strength=" + parseInt(strength) + ")",
                    left: ie ? l - parseInt(strength) : l,
                    top: ie ? t - parseInt(strength) : t

                });
                break;
            case "textGlow":
                var opts = options.split(" ");
                var strength = opts[0];
                var color = opts[1];
                if (color.length == 4) {
                    c = color.split("");
                    color = [c[0], c[1], c[1], c[2], c[2], c[3], c[3]].join("");
                }
                this.css({
                    textShadow: "0px 0px " + options,
                    filter: "progid:DXImageTransform.Microsoft.glow(color=" + color + ", strength=" + parseInt(strength) / 2 + ")"
                });
                break;
            default:
                err("[PARAM ERROR] (shadow) type only support: \"box\"");
        }
    }
})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {
    $.Element.implement({
        show: function() {
            ///<summary>
            /// 显示Element
            ///</summary>
            ///<returns type="$.Element" />
            var cache_display = this.cache("__display__");
            return this.css("display", cache_display && cache_display != "none" ? cache_display : "block");
        },
        hide: function() {
            ///<summary>
            /// 隐藏Element
            ///</summary>
            ///<returns type="$.Element" />
            this.cache("__display__", this.css("display"));
            return this.css("display", "none");
        },
        slideDown: function(duration, easing, callback) {
            if (!duration) duration = 1000;
            this.show().stop();
            var h = this.css("height");
            if (parseInt(h) == 0) {
                this.css("height", "auto");
                var h = this.css("height");
            }
            var h = this.h();
            var paddingTop = parseInt(this.css("padding-top"));
            var paddingBottom = parseInt(this.css("padding-bottom"));
            this.css({
                height: 0,
                overflow: "hidden"
            }).animate({ height: h - paddingTop - paddingBottom }, duration, easing, callback);
        },
        slideUp: function(duration, easing, callback) {
            if (!duration) duration = 1000;
            this.show().stop();
            this.css("height", "auto");
            var h = this.h();
            var paddingTop = parseInt(this.css("padding-top"));
            var paddingBottom = parseInt(this.css("padding-bottom"));
            this.css({
                height: h - paddingTop - paddingBottom,
                overflow: "hidden"
            }).animate({ height: 0 }, duration, easing, function() {
                log(this);
                //this.hide();
                //if (callback) callback.call(this);
            });
        },
        stop: function() {
            ///<summary>
            /// 停止动画
            ///</summary>
            ///<returns type="$.Element" />
            var cache_animate = this.cache("__animate__");
            if (cache_animate) cache_animate.stopTimer();
            return this;
        },
        animate: function(properties, duration, easing, callback) {
            ///<summary>
            /// 设置动画
            ///</summary>
            ///<param name="properties" type="object">
            ///   要变化的样式
            ///</param>
            ///<param name="duration" type="int">
            ///   动画持续时间（毫秒）
            ///</param>
            ///<param name="easing" type="int">
            ///   [可选，默认"Swing:in"]动画缓动样式
            ///</param>
            ///<param name="callback" type="int">
            ///   [可选]动画完成时的回调函数
            ///</param>
            ///<returns type="$.Element" />
            switch (arguments.length) {
                case 2:
                    easing = "Swing:in";
                    callback = $.empty;
                    break;
                case 3:
                    if (typeof easing == "string") {
                        callback = $.empty;
                    }
                    else {
                        callback = easing;
                        easing = "Swing:in";
                    }
                    break;
                case 4:
                    break;
                default:
                    err("PARAM ERROR - .animate(properties, duration[, easing[, callback]])");
                    break;
            }
            var styles = {};
            for (var k in properties) styles[k] = [this.css(k), properties[k]];
            var aMorph = new $.Fx.Morph(this, { fps: 100, duration: duration, effect: easing, onComplete: callback }).start(styles);
            this.cache("__animate__", aMorph);
            return this;
        }
    });
    var transitions = {
        Vibration: function(x) {
            return -Math.pow(Math.E, -5 * x) * Math.cos(x / 18 * 500) + 1;
        },
        Swing: function(x) {
            return -Math.cos(x * Math.PI) / 2 + 0.5;
        }
    }
    for (t in transitions) {
        $.Fx.Transitions[t] = (function(t) {
            return {
                easeIn: function(pos, seg) {
                    return transitions[t](pos, seg);
                },
                easeOut: function(pos, seg) {
                    return 1 - transitions[t](1 - pos, seg);
                },
                easeInOut: function(pos, seg) {
                    return (pos <= 0.5) ? transitions[t](2 * pos, seg) / 2 : (2 - transitions[t](2 * (1 - pos), seg)) / 2;
                }
            }
        })(t);
    }




})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {

    var events = ["mouseover", "mousedown", "mouseup", "click", "dblclick", "mouseout", "mousemove", "keypress", "keyup", "keydown"];
    var objEvents = {};
    var fnCreateEvent = function(sEvents) {
        return function(f) {
            return this.addEvent(sEvents, f);
        }
    };
    for (var i = 0; i < events.length; i++) {
        var sEvents = events[i];
        objEvents[sEvents] = fnCreateEvent(sEvents);
    }
    $.Element.implement(objEvents);
    $.Window.implement(objEvents);

    var withinElement = function(event) {
        if (!event.target) {
            event.target = event.srcElement || document;
        }
        if (!event.relatedTarget && event.fromElement) {
            event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
        }
        var parent = event.relatedTarget;
        try {
            while (parent && parent !== this) {
                parent = parent.parentNode;
            }
        } catch (e) { }
        return !!parent;
    };


    $.Element.implement({
        mouseenter: function(fnOver) {
            ///<summary>
            /// 鼠标进入事件
            ///</summary>
            ///<param name="fnOver" type="function">
            /// 触发的函数
            ///</param>
            ///<returns type="$.Element" />

            this.mouseover(function(e) {
                if (!this.cache("__mouseenter__")) {
                    e.type = "mouseenter";
                    fnOver.call(this, e);
                    this.cache("__mouseenter__", true);
                }
            });
            return this;
        },
        mouseleave: function(fnOut) {
            ///<summary>
            /// 鼠标离开事件
            ///</summary>
            ///<param name="fnOut" type="function">
            /// 触发的函数
            ///</param>
            ///<returns type="$.Element" />
            this.mouseout(function(e) {
                if (!withinElement.call(this, e.event)) {
                    e.type = "mouseleave";
                    fnOut.call(this, e);
                    this.cache("__mouseenter__", false);
                }
            });
            return this;
        },
        hover: function(fnOver, fnOut) {
            ///<summary>
            /// 鼠标进入和离开事件
            ///</summary>
            ///<param name="fnOver" type="function">
            /// 触发的函数
            ///</param>
            ///<param name="fnOut" type="function">
            /// [可选，默认和进入事件相同] 触发的函数
            ///</param>
            ///<returns type="$.Element" />
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }
    });

    ///<summary>
    /// 绑定一个自定义事件
    ///</summary>
    ///<param name="type" type="function">
    /// 自定义事件类型（名称）
    ///</param>
    ///<param name="data" type="object">
    /// [可选] 事件要使用的数据，可以在函数中用event.data访问
    ///</param>
    ///<param name="fn" type="function">
    /// 事件的函数
    ///</param>
    ///<returns type="{data: data, fn: fn}" />
    $.bind = function() {
        var type = arguments[0];
        switch (arguments.length) {
            case 2:
                var data = {};
                var fn = arguments[1];
                break;
            case 3:
                var data = arguments[1];
                var fn = arguments[2];
                break;
            default:
                return;
        }
        var events = arguments.callee._events;
        if (!events[type]) events[type] = [];
        var theEvent = { data: data, fn: fn };
        events[type].push(theEvent);
        return theEvent;
    };

    ///<summary>
    /// 触发一个自定义事件
    ///</summary>
    ///<param name="type" type="function">
    /// 自定义事件类型（名称）
    ///</param>
    ///<param name="data" type="array">
    /// [可选] 事件要使用的数据，函数中第一个是event参数，接下来的就是data。
    ///</param>
    ///<returns type="event length" />
    $.trigger = function(type, data) {
        if (!data) var data = [];
        var theEvent = $.bind._events[type];
        if (!theEvent) return;
        for (var i = 0; i < theEvent.length; i++) {
            var e = { data: theEvent[i].data };
            data.unshift(e);
            theEvent[i].fn.apply(null, data);
        }
        return theEvent.length;
    };
    $.bind._events = {};

})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {


    $.Element.implement({
        ///<summary>
        /// 替换元素
        ///</summary>
        ///<param name="o" type="$.Element">
        /// 要替换的元素
        ///</param>
        ///<returns type="$.Element" />
        replaceWith: function(o) {
            this.parentNode.replaceChild(o, this);
            return this;
        }

    });

})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($) {
    var consts = {
        msie: $.browser.ie > 0,
        msie6: $.browser.ie == 6,
        msie7: $.browser.ie == 7,
        msie8: $.browser.ie == 8,
        mozilla: !!$.browser.gecko,
        opera: !!$.browser.opera,
        webkit: !!$.browser.webkit
    };
    for (var k in consts) {
        window[k] = consts[k];
    }
})(JUI);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

(function($$) {
    $$.random = function(min, max) {
        var random = Math.random;
        switch (arguments.length) {
            case 0:
                return random();
            case 1:
                return random() * arguments[0];
            case 2:
                return random() * (arguments[1] - arguments[0]) + arguments[0];
        }
    };

    $$.initArray = function(n, v) {
        var arr = new Array(n);
        for (var i = 0; i < n; i++) arr[i] = v;
        return arr;
    };

    $$.pick = function(arr) {
        return arr[Math.floor($$.random(arr.length))];
    };

})(jui_ext);
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

// $$.DateTime - Class

(function($$) {

    $$.Dtm = $$.DateTime = function(sDateTime) /*() || (sDate) || (sDateTime) */{
        switch (arguments.length) {
            case 0:
                this._dtm = new Date();
                break;
            case 1:
                switch (sDateTime.length) {
                    case 10:
                        var sData = sDateTime.split("-");
                        this._dtm = new Date(sData[0], sData[1] - 1, sData[2]);
                        break;
                    case 19:
                        var sData = sDateTime.split(" ");
                        var sDate = sData[0].split("-");
                        var sTime = sData[1].split(":");
                        this._dtm = new Date(sDate[0], sDate[1] - 1, sDate[2], sTime[0], sTime[1], sTime[2]);
                        break;
                }
                break;
        }
    };

    var methods = {
        toString: function() {
            return this._dtm.toString();
        },
        valueOf: function() {
            return this._dtm.valueOf();
        },
        getYear: function() {
            return this._dtm.getFullYear();
        },
        getMonth: function() {
            return this._dtm.getMonth() + 1;
        },
        getDay: function() {
            return this._dtm.getDate();
        },
        getDay_Week: function() {
            return this._dtm.getDay();
        },
        getHour: function() {
            return this._dtm.getHours();
        },
        getMinute: function() {
            return this._dtm.getMinutes();
        },
        getSecond: function() {
            return this._dtm.getSeconds();
        },
        getMs: function() {
            return this._dtm.getMilliseconds();
        },
        toDBDateString: function() {
            var month = this.getMonth().toString();
            var day = this.getDay().toString();
            return [this.getYear(), (month.length == 2 ? "" : 0) + month, (day.length == 2 ? "" : 0) + day].join("-");
        },
        toDBTimeString: function() {
            var hour = this.getHour().toString();
            var minute = this.getMinute().toString();
            var second = this.getSecond().toString();
            return [(hour.length == 2 ? "" : 0) + hour, (minute.length == 2 ? "" : 0) + minute, (second.length == 2 ? "" : 0) + second].join(":");
        },
        toDBDateTimeString: function() {
            return this.toDBDateString() + " " + this.toDBTimeString();
        },
        toDBDateTimeMsString: function() {
            var sMs = this.getMs().toString();
            switch (sMs.length) {
                case 1:
                    sMs = "00" + sMs;
                    break;
                case 2:
                    sMs = "0" + sMs;
                    break;
                default:
                    break;
            }
            return this.toDBDateTimeString() + "." + sMs;
        }
    };

    for (var name in methods) {
        var method = methods[name];
        $$.DateTime.prototype[name] = method;
    }



})(jui_ext);

// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****


// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

$$.copyClip = function(text, onSuccess, onFail) {
    ///<summary>
    /// 将内容复制到剪贴板中
    ///</summary>
    ///<param name="text" type="string">
    /// 要复制的文本
    ///</param>
    ///<param name="onSuccess" type="string">
    /// [可选，默认alert复制成功] 复制成功回调函数
    ///</param>
    ///<param name="onFail" type="string">
    /// [可选，默认alert复制失败] 复制失败回调函数
    ///</param>
    ///<returns type="boolean" />
    if (!onSuccess) {
        onSuccess = function() {
            alert(Txt.copySuccess);
        };
    }
    if (!onFail) {
        onFail = function() {
            alert(Txt.copyFail);
        };
    }
    if (window.clipboardData) {
        window.clipboardData.clearData();
        window.clipboardData.setData("Text", text);
        onSuccess();
        return true;
    } else if (navigator.userAgent.indexOf("Opera") != -1) {
        window.location = text;
        onSuccess();
        return true;
    } else if (window.netscape) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (e) {
            onFail();
            return false;
        }
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if (!clip) {
            return false;
        }
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if (!trans) {
            return false;
        }
        trans.addDataFlavor('text/unicode');
        var str = {};
        var len = {};
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = text;
        str.data = copytext;
        trans.setTransferData("text/unicode", str, copytext.length * 2);
        var clipid = Components.interfaces.nsIClipboard;
        if (!clip) { return false; }
        clip.setData(trans, null, clipid.kGlobalClipboard);
        onSuccess();
        return true;
    }
}
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****


// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****



$$.Image = function(options) {
    ///<summary>
    /// 插入一个多功能图片
    ///</summary>
    ///<param name="options" type="object">
    ///配置[可选]
    /// {
    ///    img: [array, 图片地址，宽，高],
    ///    rect: [array, 图片截取的左，上，宽，高 或就宽，高][可选，默认全选],
    ///    pos: [array, 图片位置的左，上，Z层][可选，默认0],
    ///    rot: [int, 旋转角度][可选，默认0],
    ///    scale: [int, 缩放比例][可选，默认1],
    ///    c: [array, 旋转或缩放操作中心，x，y][可选，默认图片中心]
    /// }
    ///</param>
    ///<returns type="$.Element" />

    var src = options.img[0];
    var image_width = options.img[1];
    var image_height = options.img[2];
    var parent = options.parent;

    if (options.rect) {
        var rect_left = options.rect[0];
        var rect_top = options.rect[1];
        var rect_width = options.rect[2];
        var rect_height = options.rect[3];
    }
    else {
        var rect_left = 0;
        var rect_top = 0;
        var rect_width = image_width;
        var rect_height = image_height;
    }

    if (options.pos) {
        var position_left = options.pos[0];
        var position_top = options.pos[1];
        var position_layer = options.pos[2];
    }
    else {
        var position_left = 0;
        var position_top = 0;
        var position_layer = 0;
    }
    var rotation = options.rot ? options.rot : 0;
    var scale = options.scale ? options.scale : 1;
    if (options.c) {
        var center_left = options.c[0];
        var center_top = options.c[1];
    }
    else {
        var center_left = rect_width / 2;
        var center_top = rect_height / 2;
    }
    var image = new Image();
    image.src = src;

    var rotation_deg = -rotation;
    rotation_deg = rotation_deg % 360;
    var rotation_rad = ((rotation_deg >= 0) ? rotation_deg : (360 + rotation_deg)) * Math.PI / 180;
    var costheta = Math.cos(rotation_rad);
    var sintheta = Math.sin(rotation_rad);
    var x = rect_width / 2 - center_left;
    var y = rect_height / 2 - center_top;
    var X = (x * costheta - y * sintheta) * scale;
    var Y = (x * sintheta + y * costheta) * scale;
    var left = position_left - x - center_left;
    var top = position_top - y - center_top;

    if (ie) {

        var cropleft = rect_left / image_width;
        var croptop = rect_top / image_height;
        var cropright = (image_width - rect_width - rect_left) / image_width;
        var cropbottom = (image_height - rect_height - rect_top) / image_height;
        left += (rect_width - rect_width * scale) / 2 + X;
        top += (rect_height - rect_height * scale) / 2 + Y;
        var width = rect_width * scale;
        var height = rect_height * scale;
        var vImage = document.createElement("v:image");
        var $sprite = $(vImage).attr({
            src: image.src,
            cropleft: cropleft,
            croptop: croptop,
            cropright: cropright,
            cropbottom: cropbottom
        }).css({
            left: Math.round(left),
            top: Math.round(top),
            width: Math.round(width),
            height: Math.round(height),
            rotation: rotation_deg,
            position: "absolute",
            zIndex: position_layer
        });
        parent.appendChild(vImage);
    }
    else {
        var width = (Math.abs(costheta * rect_width) + Math.abs(sintheta * rect_height)) * scale;
        var height = (Math.abs(costheta * rect_height) + Math.abs(sintheta * rect_width)) * scale;
        left += (rect_width - width) / 2 + X;
        top += (rect_height - height) / 2 + Y;

        var canvas = document.createElement("canvas");
        $(canvas).css({
            left: Math.round(left),
            top: Math.round(top),
            position: "absolute",
            zIndex: position_layer
        });
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        var context = canvas.getContext('2d');
        context.save();
        if (rotation_rad <= 0.5 * Math.PI) context.translate(sintheta * (rect_height * scale), 0);
        else if (rotation_rad <= Math.PI) context.translate(width, -costheta * (rect_height * scale));
        else if (rotation_rad <= 1.5 * Math.PI) context.translate(-costheta * (rect_width * scale), height);
        else context.translate(0, -sintheta * (rect_width * scale));
        context.rotate(rotation_rad);
        image.onload = function() {
            context.drawImage(image, rect_left, rect_top, rect_width, rect_height, 0, 0, rect_width * scale, rect_height * scale);
            context.restore();
            parent.appendChild(canvas);
        };
    }
};
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

$$.modal = function(s, options) {
    ///<summary>
    /// 浮层
    ///</summary>
    ///<param name="options" type="object">
    /// 浮层内html
    ///</param>
    ///<param name="options" type="object">
    ///配置[可选]
    /// {
    ///    width: [int, 浮层宽],
    ///    height: [int, 浮层高],
    ///    top: [int, 浮层Y],
    /// }
    ///</param>

    if (!$$.modal.self) {
        $$.modal.self = true;
        var $doc_w = document.body.offsetWidth;
        var $doc_h = document.body.offsetHeight;
        var w = $$.modal._w = options.width;
        var h = $$.modal._h = options.height;
        var t = $$.modal._t = options.top;
        var $modal_bg = document.createElement("div");
        document.body.appendChild($modal_bg);

        var $modal = document.createElement("div");
        document.body.appendChild($modal);

        $modal_bg = $$.modal._b = $($modal_bg).css({
            position: "absolute",
            zIndex: 9995,
            cursor: "default",
            height: $doc_h + (msie ? $(window).scroll_top() : 0),
            width: $doc_w + (msie ? $(window).scroll_left() : 0),
            opacity: 0.5,
            background: "#000",
            left: 0,
            top: 0
        });
        var $modal = $$.modal._m = $($modal).css({
            left: ($doc_w - w) / 2 + $(window).scroll_left(),
            position: "absolute",
            top: -h,
            width: w,
            height: h,
            zIndex: 9997
        }).animate({
            left: ($doc_w - w) / 2 + $(window).scroll_left(),
            top: t + $(window).scroll_top()
        }, 200);
        $modal.html(s);
    }
};
$$.modal.self = false;

$$.modal.reposition = function() {
    if ($$.modal.self) {
        var $doc_w = document.body.offsetWidth;
        var $doc_h = document.body.offsetHeight;
        $$.modal._m.animate({
            top: $$.modal._t + $(window).scroll_top(),
            left: ($doc_w - $$.modal._w) / 2 + $(window).scroll_left()
        }, 500);
        $$.modal._b.css({
            height: $doc_h + (msie ? $(window).scroll_top() : 0),
            width: $doc_w + (msie ? $(window).scroll_left() : 0)
        });
    }
};

$$.modal.close = function() {
    var $doc_w = document.body.offsetWidth;
    var $doc_h = document.body.offsetHeight;
    var w = $$.modal._w;
    var h = $$.modal._h;

    $$.modal._m.animate({
        top: -h
    }, 200, function() {
        $$.modal._m.remove();
    });

    $$.modal._b.remove();
    $$.modal.self = false;
};

$(window).addEvent("scroll", $$.modal.reposition);
$(window).addEvent("resize", $$.modal.reposition);


$$.alert = function(s, callback) {
    ///<summary>
    /// alert浮层
    ///</summary>
    ///<param name="s" type="string">
    /// alert内文字
    ///</param>
    ///<param name="callback" type="function">
    ///配置[可选]
    /// {
    ///    width: [int, 浮层宽],
    ///    height: [int, 浮层高]
    /// }
    ///</param>
    var html = "\
    <div style='border: solid 1px #333; background: #ccc; padding: 10px; color: #000;'>\
    <p>" + s + "</p>\
    <p style='text-align: center; margin-top: 10px;'><input onclick='$$.alert.close();' style='width: 75px;' type='button' value='" + Txt.OK + "' /></p>\
    </div>";
    $$.alert._cb = callback ? callback : $.empty;
    $$.modal(html, { width: 300, height: 70 });
};

$$.alert.close = function() {
    $$.modal.close();
    $$.alert._cb();
};
// *******1*********2*********3*********4*********5*********6*********7****
// Copyright (c) Chen Cong.  All rights reserved.
// *******1*********2*********3*********4*********5*********6*********7****

$$.tabView = function(tabs, views, type, n) {
    switch (arguments.length) {
        case 2:
            type = "click";
            n = 0;
            break;
        case 3:
            if (isNaN(type)) n = 0;
            else {
                n = type;
                type = "click";
            }
            break;
        case 4:
            break;
        default:
            err("PARAM ERROR - $$.tabView(tabs, views, type, n)");
            break;
    }
    var tb = new $.TabView(tabs, views, function(t1, t2) {
        t1.removeClass("now");
        t2.addClass("now");
    }, {
        tabTriggerEvent: type
    });
    tb.changeTab(n);
};


(function() {
    var Player = {
        playList: [],
        palyer: null,

        setPlayList: function(list) {
            this.playList = list;
        },

        init: function(el) {
            this.boxel = el;
            this.initSwfPlayer();
        },

        play: function(index) {
            try { this.player.startPlay(index); } catch (e) { }
        },

        /************************************************************************************flash*/
        ready: function() {
            this.player = this.getSwf('videoPlayer');
            var ix = null;
            for (var i = 0; i < this.playList.length; i++) {
                var o = this.playList[i];
                this.player.playListAdd({ 'title': o.title, 'flvName': o.link, 'fileType': 'flv', 'sourceType': '', 'port': -1, 'refer': '', 'rid': '', 'maxNo': 20 });
                if (o.defaultPlay) {
                    ix = i;
                }
            }
            this.player.videoResize();
            this.play(ix);
        },

        _preStatus: '',

        mediaEnded: function(status) {
            var vol = status[1];
            status = status[0];
        },

        mediaChanged: function(status, vol) {
            var ss = status;
            status = ss[0];
            vol = parseInt(ss[1]);

            if (status == 'vafail') {
                this.showHelp();
            }

            if (status == 'pause' && this._preStatus == 'start') {
                setTimeout(function() {
                    Player.player.openResume();
                }, 400);
            }
            this._preStatus = status;
        },

        /************************************************************************************/

        showHelp: function() {
            var ss = [
                    '<p>想要继续观看完整的节目，请安装最新版PP加速器 ',
                    '<a href="http://ppvaupdateexe.pplive.com/ppva/promotion_pplive/all/ppliveva_setup_0.3.0.0217_s_promotion_pplive.exe">下载PP加速器</a><br/>',
                    '在本地手动安装，并在安装结束后<a href="javascript:;" onclick="window.location.reload();">刷新</a>页面',
                    '<br />(如果安装程序被杀毒或防火墙软件阻止，请您取消此阻止)',
                '</p>'].join('');
            this.boxel.innerHTML = ss.join('');
        },

        getSwf: function(name) {
            if (navigator.appName.indexOf("Microsoft") != -1) {
                return window[name];
            }
            return document[name];
        },

        initSwfPlayer: function(el) {
            var version = [0, 0, 0, 0], v = [], l = 0, SHOCKWAVE_FLASH = 'Shockwave Flash';
            if (typeof navigator.plugins && typeof navigator.plugins[SHOCKWAVE_FLASH] == 'object') {
                var x = navigator.plugins[SHOCKWAVE_FLASH];
                if (x && x.description) {
                    v = x.description.replace(/^.*\s+(\S+)\s+\S+$/g, '$1').split('.');
                }
            } else if (typeof window.ActiveXObject) {
                try {
                    var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    v = axo.GetVariable("$version").split(/\s+/)[1].split(',');
                } catch (e) {
                }
            }
            l = v.length;
            while (l--) { version[l] = parseInt(v[l], 10); }

            var swfv = 'pptv4_player.swf?' + Math.random();
            var html = '<p>您没有安装FlashPlayer或者FlashPlayer版本过低，<a target="_blank" href="http://download.pplive.com/flash_player_10_ax.exe">请点击此处下载安装最新的FlashPlayer</a>。</p><p>安装时请关闭浏览器，待安装完成后再启动浏览器。</p>';
            if (version[0] > 9 || (version[0] == 9 && version[2] >= 115)) {
                html = ['<object id="videoPlayer" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="100%" height="100%" align="middle">',
					'<param name="allowscriptaccess" value="always" />',
					'<param name="allowfullscreen" value="true" />',
					'<param name="allownetworking" value="all" />',
					'<param name="movie" value="', swfv, '" />',
					'<param name="quality" value="high" />',
					'<param name="wmode" value="window" />',
					'<param name="bgcolor" value="#000000" />',
					'<embed src="', swfv, '" name="videoPlayer" quality="high" wmode="window" bgcolor="#000000" width="100%" height="100%" align="middle" allownetworking="all" allowscriptaccess="always" allowfullscreen="true" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer"/>',
					'</object>'].join('');
            }

            this.boxel.innerHTML = html;
        }
    };

    window.IkanPlayer = Player;

})();

/**
* PPLive ActiveX detection and embed
*
* file: PPLiveActiveX.js
* version: 1.0.3.0
* create: 2008-09-23
* last modify: 2008-09-25
* author: fdreamShi@pplive.com
* 
*/

var PPLiveActiveX = function(options) {
    var _installed = false, _tipsIn = false, _hasBindInstallEvent = false;

    // 用来保存用户设置的宽和高
    var _width = '100%', _height = '100%';

    // related dom and html codes
    var _playerDom = null, _playerHtml = '', _installTips = '';

    function empty() { }

    // 获取用户设置
    var _onReady = options.ready ? options.ready : empty;
    var _onBoot = options.boot ? options.boot : empty;
    var _onInstall = options.installing ? options.installing : empty;
    var _onNotSupport = options.notSupport ? options.notSupport : empty;
    var _checkInterval = options.checkInterval ? options.checkInterval : 3000;
    var _readyInterval = options.readyInterval ? options.readyInterval : 200;

    var _onCheckVersion = options.checkVersion ? options.checkVersion : empty;

    var _onNotInstall = options.notInstall ? options.notInstall : empty;

    // 内部类 Settings
    // 用来保存相关设置
    var Settings = function() {
        this.initSettings = {};

        this.set = function(name, value) {
            this.initSettings[name] = value;
            return this;
        };

        this.setProperties = function(options) {
            for (var p in options) {
                this.set(p, options[p]);
            }
        };

        this.get = function(name) {
            var ret = this.initSettings[name];
            ret = ret ? ret : '';
            return ret;
        };
    };

    // 设置默认属性
    var attributeMan = new Settings();
    attributeMan.setProperties({
        'id': 'PPLivePlayerActiveX',
        'width': '1px', 		// used to hide activeX
        'height': '1px', 	    // used to hide activeX
        'codebase': 'http://dl.pplive.com/PluginSetup.cab'
    });

    // 设置默认参数
    var paramMan = new Settings();
    paramMan.setProperties({
        'logourl': 'http://static1.pplive.cn/ikan3/090512/player/playerbg.jpg',
        'logoposition': 'center',       // logo居中显示
        'dbclicktofullscreen': true,
        'showcontextmenu': true,
        'showstateinfo': true,
        'showchannelname': true,
        'showplayerbuffer': true,
        'showdownloadbuffer': true,
        'showdownloadrate': true,
        'showplaycontroller': true,
        'showplayprogress': true,
        'showloadingad': false,
        'showadcountdown': false,
        'adcfgurl': '',
        'enableupdate': 'true',
        'enableupdatetip': 'true',
        'updateurl': '',
        'url': '',
        'forceversion': '2.3.6.0007',
        'skinpath': 'skins\\Default'
    });

    // 初始化用户设置的参数
    if (options != null) {
        var props = options.properties;
        for (var p in props) {
            switch (p.toLowerCase()) {
                case 'id':
                    attributeMan.set('id', props[p]);
                case 'width':
                    _width = props[p];     // 保存用户设置值
                    //attributeMan.set('width', props[p]);
                    break;
                case 'height':
                    _height = props[p];     // 保存用户设置值
                    //attributeMan.set('height', props[p]);
                    break;
                case 'codebase':
                    attributeMan.set('codebase', props[p]);
                    break;
                default:
                    p = p.toLowerCase();
                    paramMan.set(p, props[p]);
                    break;
            }
        }

        var params = options.params;
        for (var p in params) {
            paramMan.set(p.toLowerCase(), params[p]);
        }
    }

    ///<summary>
    /// 单独设置播放器的属性（Attribute），返回当前对象（PPLiveActiveX）
    ///</summary>
    ///<param name="name" type="String">attribute的名称，例如：showcontextmenu</param>
    ///<param name="value" type="String">attribute的值，例如：true</param>
    ///<returns type="PPLiveActiveX" />
    this.setAttribute = function(name, value) {
        attributeMan.set(name.toLowerCase(), value);
        return this;
    };

    ///<summary>
    /// 批量设置播放器的属性（Attribute），返回当前对象（PPLiveActiveX）
    ///</summary>
    ///<param name="attributes" type="Object">一个对象，包含attribute的名称和值，例如{width: 400, height: 120}</param>
    ///<returns type="PPLiveActiveX" />
    this.setAttributes = function(attributes) {
        for (var a in attributes) {
            attributeMan.set(a.toLowerCase(), attributes[a]);
        }
        return this;
    };

    ///<summary>
    /// 单独设置播放器的参数（Param），返回当前对象（PPLiveActiveX）
    ///</summary>
    ///<param name="name" type="String">param的名称，例如：showcontextmenu</param>
    ///<param name="value" type="String">param的值，例如：true</param>
    ///<returns type="PPLiveActiveX" />
    this.setParam = function(name, value) {
        paramMan.set(name.toLowerCase(), value);
        return this;
    };

    ///<summary>
    /// 批量设置播放器的参数（Param），返回当前对象（PPLiveActiveX）
    ///</summary>
    ///<param name="params" type="Object">一个对象，包含param的名称和值，例如{showcontextmenu: true, showstateinfo: true}</param>
    ///<returns type="PPLiveActiveX" />
    this.setParams = function(params) {
        for (var p in params) {
            paramMan.set(p.toLowerCase(), params[p]);
        }
        return this;
    };

    /**********************************
    * 生成播放器的HTML代码
    * 由于不知道是IE还是OCX的bug
    * 不能隐藏OCX，必须让其一直显示，
    * 否则可能造成OCX被销毁的情况，
    * 只好讨巧设置OCX的宽和高为1px
    * 用来隐藏播放器，以显示安装提示
    **********************************/
    function getHtml() {
        var pplString = ['<object classid="CLSID:ef0d1a14-1033-41a2-a589-240c01edc078"'];
        // add attributes
        for (var a in attributeMan.initSettings) {
            pplString.push([' ', a, '="', attributeMan.get(a), '"'].join(''))
        }
        pplString.push('>');

        // add params
        for (var p in paramMan.initSettings) {
            pplString.push(['<param name="', p, '" value="', paramMan.get(p), '">'].join(''));
        }

        pplString.push('</object>');

        return pplString.join('');
    }

    ///<summary>
    /// 把播放器代码写入页面内，返回当前对象（PPLiveActiveX）
    ///</summary>
    ///<param name="dom" type="Object">要写入到的HTML DOM的ID或者HTML DOM对象</param>
    ///<returns type="PPLiveActiveX" />
    this.write = function(dom) {
        // get dom object
        if (typeof (dom) == 'string') {
            _playerDom = document.getElementById(dom);
        }
        else {
            _playerDom = dom;
        }

        // if is not IE, don't check activex
        if (navigator.userAgent.search('MSIE') <= 0) {
            _playerDom.innerHTML = '<p>对不起，目前PPLive网页插件（98KB）暂不支持Firefox、Opera等浏览器，请使用IE观看，谢谢^_^</p>';
            _onNotSupport();
            return;
        }

        _installTips = _playerDom.innerHTML;
        _playerHtml = getHtml();

        _playerDom.innerHTML = _playerHtml;

        _checkInstalled();

        return this;
    };

    ///<summary>
    /// 获取播放器实例，返回Object
    ///</summary>
    ///<returns type="Object" />
    this.getPlayer = function() {
        return _player;
    };

    function _checkInstalled() {
        _player = document.getElementById(attributeMan.get('id'));
        //_player.style.display = 'none';

        if ((_player || 0).IsReady != undefined) {
            // show player
            this.installed = true;
            //_playerDom.innerHTML = _playerHtml;
            //_player = document.getElementById(attributeMan.get('id'));
            //_player.style.display = 'block';
            while (_playerDom.children.length > 1) {
                var temp = _playerDom.removeChild(_playerDom.children[0]);
                delete temp;
            }
            _player.style.width = _width;
            _player.style.height = _height;

            _onCheckVersion(_player.version);

            _checkReady();
        }
        else {
            // check it again
            if (!_tipsIn) {
                _playerDom.innerHTML = _installTips + _playerHtml;
                _tipsIn = true;
                _onNotInstall();
            }
            setTimeout(_checkInstalled, _checkInterval);
        }
    }

    // 检测播放器初始化情况
    function _checkReady() {
        if (_player.IsReady) {
            // fire ready event
            // with current player instance
            try {
                _player.onFrameInstall = null;
            }
            catch (e) {
            }
            _onReady(_player);
        }
        else if (_player.IsReady != undefined && !_hasBindInstallEvent) {
            _player.onFrameInstall = _checkProgress;
            _hasBindInstallEvent = true;
            _onBoot(_player);
            setTimeout(_checkReady, _readyInterval);
        }
        else {
            setTimeout(_checkReady, _readyInterval);
        }
    }

    // 安装进度控制
    function _checkProgress(status, percent) {
        try {
            // fire installing event
            // with status and percent
            _onInstall(status, percent);
        }
        catch (e) {
        }
    }

    return this;
};
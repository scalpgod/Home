! function(e) {
    var n;
    if ("function" == typeof define && define.amd && (define(e), n = !0), "object" == typeof exports && (module.exports = e(), n = !0), !n) {
        var t = window.Cookies,
            o = window.Cookies = e();
        o.noConflict = function() {
            return window.Cookies = t, o
        }
    }
}(function() {
    function e() {
        for (var e = 0, n = {}; e < arguments.length; e++) {
            var t = arguments[e];
            for (var o in t) n[o] = t[o]
        }
        return n
    }

    function n(e) {
        return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
    }
    return function t(o) {
        function r() {}

        function i(n, t, i) {
            if ("undefined" != typeof document) {
                "number" == typeof(i = e({
                    path: "/"
                }, r.defaults, i)).expires && (i.expires = new Date(1 * new Date + 864e5 * i.expires)), i.expires = i.expires ? i.expires.toUTCString() : "";
                try {
                    var c = JSON.stringify(t);
                    /^[\{\[]/.test(c) && (t = c)
                } catch (e) {}
                t = o.write ? o.write(t, n) : encodeURIComponent(String(t)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), n = encodeURIComponent(String(n)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
                var f = "";
                for (var u in i) i[u] && (f += "; " + u, !0 !== i[u] && (f += "=" + i[u].split(";")[0]));
                return document.cookie = n + "=" + t + f
            }
        }

        function c(e, t) {
            if ("undefined" != typeof document) {
                for (var r = {}, i = document.cookie ? document.cookie.split("; ") : [], c = 0; c < i.length; c++) {
                    var f = i[c].split("="),
                        u = f.slice(1).join("=");
                    t || '"' !== u.charAt(0) || (u = u.slice(1, -1));
                    try {
                        var a = n(f[0]);
                        if (u = (o.read || o)(u, a) || n(u), t) try {
                            u = JSON.parse(u)
                        } catch (e) {}
                        if (r[a] = u, e === a) break
                    } catch (e) {}
                }
                return e ? r[e] : r
            }
        }
        return r.set = i, r.get = function(e) {
            return c(e, !1)
        }, r.getJSON = function(e) {
            return c(e, !0)
        }, r.remove = function(n, t) {
            i(n, "", e(t, {
                expires: -1
            }))
        }, r.defaults = {}, r.withConverter = t, r
    }(function() {})
});
(function(t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
})(function(t) {
    t.ui = t.ui || {}, t.ui.version = "1.12.1";
    var e = 0,
        i = Array.prototype.slice;
    t.cleanData = function(e) {
        return function(i) {
            var s, n, o;
            for (o = 0; null != (n = i[o]); o++) try {
                s = t._data(n, "events"), s && s.remove && t(n).triggerHandler("remove")
            } catch (a) {}
            e(i)
        }
    }(t.cleanData), t.widget = function(e, i, s) {
        var n, o, a, r = {},
            h = e.split(".")[0];
        e = e.split(".")[1];
        var l = h + "-" + e;
        return s || (s = i, i = t.Widget), t.isArray(s) && (s = t.extend.apply(null, [{}].concat(s))), t.expr[":"][l.toLowerCase()] = function(e) {
            return !!t.data(e, l)
        }, t[h] = t[h] || {}, n = t[h][e], o = t[h][e] = function(t, e) {
            return this._createWidget ? (arguments.length && this._createWidget(t, e), void 0) : new o(t, e)
        }, t.extend(o, n, {
            version: s.version,
            _proto: t.extend({}, s),
            _childConstructors: []
        }), a = new i, a.options = t.widget.extend({}, a.options), t.each(s, function(e, s) {
            return t.isFunction(s) ? (r[e] = function() {
                function t() {
                    return i.prototype[e].apply(this, arguments)
                }

                function n(t) {
                    return i.prototype[e].apply(this, t)
                }
                return function() {
                    var e, i = this._super,
                        o = this._superApply;
                    return this._super = t, this._superApply = n, e = s.apply(this, arguments), this._super = i, this._superApply = o, e
                }
            }(), void 0) : (r[e] = s, void 0)
        }), o.prototype = t.widget.extend(a, {
            widgetEventPrefix: n ? a.widgetEventPrefix || e : e
        }, r, {
            constructor: o,
            namespace: h,
            widgetName: e,
            widgetFullName: l
        }), n ? (t.each(n._childConstructors, function(e, i) {
            var s = i.prototype;
            t.widget(s.namespace + "." + s.widgetName, o, i._proto)
        }), delete n._childConstructors) : i._childConstructors.push(o), t.widget.bridge(e, o), o
    }, t.widget.extend = function(e) {
        for (var s, n, o = i.call(arguments, 1), a = 0, r = o.length; r > a; a++)
            for (s in o[a]) n = o[a][s], o[a].hasOwnProperty(s) && void 0 !== n && (e[s] = t.isPlainObject(n) ? t.isPlainObject(e[s]) ? t.widget.extend({}, e[s], n) : t.widget.extend({}, n) : n);
        return e
    }, t.widget.bridge = function(e, s) {
        var n = s.prototype.widgetFullName || e;
        t.fn[e] = function(o) {
            var a = "string" == typeof o,
                r = i.call(arguments, 1),
                h = this;
            return a ? this.length || "instance" !== o ? this.each(function() {
                var i, s = t.data(this, n);
                return "instance" === o ? (h = s, !1) : s ? t.isFunction(s[o]) && "_" !== o.charAt(0) ? (i = s[o].apply(s, r), i !== s && void 0 !== i ? (h = i && i.jquery ? h.pushStack(i.get()) : i, !1) : void 0) : t.error("no such method '" + o + "' for " + e + " widget instance") : t.error("cannot call methods on " + e + " prior to initialization; " + "attempted to call method '" + o + "'")
            }) : h = void 0 : (r.length && (o = t.widget.extend.apply(null, [o].concat(r))), this.each(function() {
                var e = t.data(this, n);
                e ? (e.option(o || {}), e._init && e._init()) : t.data(this, n, new s(o, this))
            })), h
        }
    }, t.Widget = function() {}, t.Widget._childConstructors = [], t.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            classes: {},
            disabled: !1,
            create: null
        },
        _createWidget: function(i, s) {
            s = t(s || this.defaultElement || this)[0], this.element = t(s), this.uuid = e++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = t(), this.hoverable = t(), this.focusable = t(), this.classesElementLookup = {}, s !== this && (t.data(s, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function(t) {
                    t.target === s && this.destroy()
                }
            }), this.document = t(s.style ? s.ownerDocument : s.document || s), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), this.options = t.widget.extend({}, this.options, this._getCreateOptions(), i), this._create(), this.options.disabled && this._setOptionDisabled(this.options.disabled), this._trigger("create", null, this._getCreateEventData()), this._init()
        },
        _getCreateOptions: function() {
            return {}
        },
        _getCreateEventData: t.noop,
        _create: t.noop,
        _init: t.noop,
        destroy: function() {
            var e = this;
            this._destroy(), t.each(this.classesElementLookup, function(t, i) {
                e._removeClass(i, t)
            }), this.element.off(this.eventNamespace).removeData(this.widgetFullName), this.widget().off(this.eventNamespace).removeAttr("aria-disabled"), this.bindings.off(this.eventNamespace)
        },
        _destroy: t.noop,
        widget: function() {
            return this.element
        },
        option: function(e, i) {
            var s, n, o, a = e;
            if (0 === arguments.length) return t.widget.extend({}, this.options);
            if ("string" == typeof e)
                if (a = {}, s = e.split("."), e = s.shift(), s.length) {
                    for (n = a[e] = t.widget.extend({}, this.options[e]), o = 0; s.length - 1 > o; o++) n[s[o]] = n[s[o]] || {}, n = n[s[o]];
                    if (e = s.pop(), 1 === arguments.length) return void 0 === n[e] ? null : n[e];
                    n[e] = i
                } else {
                    if (1 === arguments.length) return void 0 === this.options[e] ? null : this.options[e];
                    a[e] = i
                } return this._setOptions(a), this
        },
        _setOptions: function(t) {
            var e;
            for (e in t) this._setOption(e, t[e]);
            return this
        },
        _setOption: function(t, e) {
            return "classes" === t && this._setOptionClasses(e), this.options[t] = e, "disabled" === t && this._setOptionDisabled(e), this
        },
        _setOptionClasses: function(e) {
            var i, s, n;
            for (i in e) n = this.classesElementLookup[i], e[i] !== this.options.classes[i] && n && n.length && (s = t(n.get()), this._removeClass(n, i), s.addClass(this._classes({
                element: s,
                keys: i,
                classes: e,
                add: !0
            })))
        },
        _setOptionDisabled: function(t) {
            this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!t), t && (this._removeClass(this.hoverable, null, "ui-state-hover"), this._removeClass(this.focusable, null, "ui-state-focus"))
        },
        enable: function() {
            return this._setOptions({
                disabled: !1
            })
        },
        disable: function() {
            return this._setOptions({
                disabled: !0
            })
        },
        _classes: function(e) {
            function i(i, o) {
                var a, r;
                for (r = 0; i.length > r; r++) a = n.classesElementLookup[i[r]] || t(), a = e.add ? t(t.unique(a.get().concat(e.element.get()))) : t(a.not(e.element).get()), n.classesElementLookup[i[r]] = a, s.push(i[r]), o && e.classes[i[r]] && s.push(e.classes[i[r]])
            }
            var s = [],
                n = this;
            return e = t.extend({
                element: this.element,
                classes: this.options.classes || {}
            }, e), this._on(e.element, {
                remove: "_untrackClassesElement"
            }), e.keys && i(e.keys.match(/\S+/g) || [], !0), e.extra && i(e.extra.match(/\S+/g) || []), s.join(" ")
        },
        _untrackClassesElement: function(e) {
            var i = this;
            t.each(i.classesElementLookup, function(s, n) {
                -1 !== t.inArray(e.target, n) && (i.classesElementLookup[s] = t(n.not(e.target).get()))
            })
        },
        _removeClass: function(t, e, i) {
            return this._toggleClass(t, e, i, !1)
        },
        _addClass: function(t, e, i) {
            return this._toggleClass(t, e, i, !0)
        },
        _toggleClass: function(t, e, i, s) {
            s = "boolean" == typeof s ? s : i;
            var n = "string" == typeof t || null === t,
                o = {
                    extra: n ? e : i,
                    keys: n ? t : e,
                    element: n ? this.element : t,
                    add: s
                };
            return o.element.toggleClass(this._classes(o), s), this
        },
        _on: function(e, i, s) {
            var n, o = this;
            "boolean" != typeof e && (s = i, i = e, e = !1), s ? (i = n = t(i), this.bindings = this.bindings.add(i)) : (s = i, i = this.element, n = this.widget()), t.each(s, function(s, a) {
                function r() {
                    return e || o.options.disabled !== !0 && !t(this).hasClass("ui-state-disabled") ? ("string" == typeof a ? o[a] : a).apply(o, arguments) : void 0
                }
                "string" != typeof a && (r.guid = a.guid = a.guid || r.guid || t.guid++);
                var h = s.match(/^([\w:-]*)\s*(.*)$/),
                    l = h[1] + o.eventNamespace,
                    c = h[2];
                c ? n.on(l, c, r) : i.on(l, r)
            })
        },
        _off: function(e, i) {
            i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.off(i).off(i), this.bindings = t(this.bindings.not(e).get()), this.focusable = t(this.focusable.not(e).get()), this.hoverable = t(this.hoverable.not(e).get())
        },
        _delay: function(t, e) {
            function i() {
                return ("string" == typeof t ? s[t] : t).apply(s, arguments)
            }
            var s = this;
            return setTimeout(i, e || 0)
        },
        _hoverable: function(e) {
            this.hoverable = this.hoverable.add(e), this._on(e, {
                mouseenter: function(e) {
                    this._addClass(t(e.currentTarget), null, "ui-state-hover")
                },
                mouseleave: function(e) {
                    this._removeClass(t(e.currentTarget), null, "ui-state-hover")
                }
            })
        },
        _focusable: function(e) {
            this.focusable = this.focusable.add(e), this._on(e, {
                focusin: function(e) {
                    this._addClass(t(e.currentTarget), null, "ui-state-focus")
                },
                focusout: function(e) {
                    this._removeClass(t(e.currentTarget), null, "ui-state-focus")
                }
            })
        },
        _trigger: function(e, i, s) {
            var n, o, a = this.options[e];
            if (s = s || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent)
                for (n in o) n in i || (i[n] = o[n]);
            return this.element.trigger(i, s), !(t.isFunction(a) && a.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented())
        }
    }, t.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(e, i) {
        t.Widget.prototype["_" + e] = function(s, n, o) {
            "string" == typeof n && (n = {
                effect: n
            });
            var a, r = n ? n === !0 || "number" == typeof n ? i : n.effect || i : e;
            n = n || {}, "number" == typeof n && (n = {
                duration: n
            }), a = !t.isEmptyObject(n), n.complete = o, n.delay && s.delay(n.delay), a && t.effects && t.effects.effect[r] ? s[e](n) : r !== e && s[r] ? s[r](n.duration, n.easing, o) : s.queue(function(i) {
                t(this)[e](), o && o.call(s[0]), i()
            })
        }
    }), t.widget, t.extend(t.expr[":"], {
        data: t.expr.createPseudo ? t.expr.createPseudo(function(e) {
            return function(i) {
                return !!t.data(i, e)
            }
        }) : function(e, i, s) {
            return !!t.data(e, s[3])
        }
    }), t.fn.scrollParent = function(e) {
        var i = this.css("position"),
            s = "absolute" === i,
            n = e ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
            o = this.parents().filter(function() {
                var e = t(this);
                return s && "static" === e.css("position") ? !1 : n.test(e.css("overflow") + e.css("overflow-y") + e.css("overflow-x"))
            }).eq(0);
        return "fixed" !== i && o.length ? o : t(this[0].ownerDocument || document)
    }, t.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
    var s = !1;
    t(document).on("mouseup", function() {
        s = !1
    }), t.widget("ui.mouse", {
        version: "1.12.1",
        options: {
            cancel: "input, textarea, button, select, option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var e = this;
            this.element.on("mousedown." + this.widgetName, function(t) {
                return e._mouseDown(t)
            }).on("click." + this.widgetName, function(i) {
                return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : void 0
            }), this.started = !1
        },
        _mouseDestroy: function() {
            this.element.off("." + this.widgetName), this._mouseMoveDelegate && this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function(e) {
            if (!s) {
                this._mouseMoved = !1, this._mouseStarted && this._mouseUp(e), this._mouseDownEvent = e;
                var i = this,
                    n = 1 === e.which,
                    o = "string" == typeof this.options.cancel && e.target.nodeName ? t(e.target).closest(this.options.cancel).length : !1;
                return n && !o && this._mouseCapture(e) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    i.mouseDelayMet = !0
                }, this.options.delay)), this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(e) !== !1, !this._mouseStarted) ? (e.preventDefault(), !0) : (!0 === t.data(e.target, this.widgetName + ".preventClickEvent") && t.removeData(e.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(t) {
                    return i._mouseMove(t)
                }, this._mouseUpDelegate = function(t) {
                    return i._mouseUp(t)
                }, this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate), e.preventDefault(), s = !0, !0)) : !0
            }
        },
        _mouseMove: function(e) {
            if (this._mouseMoved) {
                if (t.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button) return this._mouseUp(e);
                if (!e.which)
                    if (e.originalEvent.altKey || e.originalEvent.ctrlKey || e.originalEvent.metaKey || e.originalEvent.shiftKey) this.ignoreMissingWhich = !0;
                    else if (!this.ignoreMissingWhich) return this._mouseUp(e)
            }
            return (e.which || e.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted)
        },
        _mouseUp: function(e) {
            this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), this._mouseDelayTimer && (clearTimeout(this._mouseDelayTimer), delete this._mouseDelayTimer), this.ignoreMissingWhich = !1, s = !1, e.preventDefault()
        },
        _mouseDistanceMet: function(t) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return !0
        }
    }), t.ui.plugin = {
        add: function(e, i, s) {
            var n, o = t.ui[e].prototype;
            for (n in s) o.plugins[n] = o.plugins[n] || [], o.plugins[n].push([i, s[n]])
        },
        call: function(t, e, i, s) {
            var n, o = t.plugins[e];
            if (o && (s || t.element[0].parentNode && 11 !== t.element[0].parentNode.nodeType))
                for (n = 0; o.length > n; n++) t.options[o[n][0]] && o[n][1].apply(t.element, i)
        }
    }, t.ui.safeActiveElement = function(t) {
        var e;
        try {
            e = t.activeElement
        } catch (i) {
            e = t.body
        }
        return e || (e = t.body), e.nodeName || (e = t.body), e
    }, t.ui.safeBlur = function(e) {
        e && "body" !== e.nodeName.toLowerCase() && t(e).trigger("blur")
    }, t.widget("ui.draggable", t.ui.mouse, {
        version: "1.12.1",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function() {
            "original" === this.options.helper && this._setPositionRelative(), this.options.addClasses && this._addClass("ui-draggable"), this._setHandleClassName(), this._mouseInit()
        },
        _setOption: function(t, e) {
            this._super(t, e), "handle" === t && (this._removeHandleClassName(), this._setHandleClassName())
        },
        _destroy: function() {
            return (this.helper || this.element).is(".ui-draggable-dragging") ? (this.destroyOnClear = !0, void 0) : (this._removeHandleClassName(), this._mouseDestroy(), void 0)
        },
        _mouseCapture: function(e) {
            var i = this.options;
            return this.helper || i.disabled || t(e.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(e), this.handle ? (this._blurActiveElement(e), this._blockFrames(i.iframeFix === !0 ? "iframe" : i.iframeFix), !0) : !1)
        },
        _blockFrames: function(e) {
            this.iframeBlocks = this.document.find(e).map(function() {
                var e = t(this);
                return t("<div>").css("position", "absolute").appendTo(e.parent()).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).offset(e.offset())[0]
            })
        },
        _unblockFrames: function() {
            this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
        },
        _blurActiveElement: function(e) {
            var i = t.ui.safeActiveElement(this.document[0]),
                s = t(e.target);
            s.closest(i).length || t.ui.safeBlur(i)
        },
        _mouseStart: function(e) {
            var i = this.options;
            return this.helper = this._createHelper(e), this._addClass(this.helper, "ui-draggable-dragging"), this._cacheHelperProportions(), t.ui.ddmanager && (t.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = this.helper.parents().filter(function() {
                return "fixed" === t(this).css("position")
            }).length > 0, this.positionAbs = this.element.offset(), this._refreshOffsets(e), this.originalPosition = this.position = this._generatePosition(e, !1), this.originalPageX = e.pageX, this.originalPageY = e.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt), this._setContainment(), this._trigger("start", e) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), t.ui.ddmanager && !i.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this._mouseDrag(e, !0), t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e), !0)
        },
        _refreshOffsets: function(t) {
            this.offset = {
                top: this.positionAbs.top - this.margins.top,
                left: this.positionAbs.left - this.margins.left,
                scroll: !1,
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }, this.offset.click = {
                left: t.pageX - this.offset.left,
                top: t.pageY - this.offset.top
            }
        },
        _mouseDrag: function(e, i) {
            if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(e, !0), this.positionAbs = this._convertPositionTo("absolute"), !i) {
                var s = this._uiHash();
                if (this._trigger("drag", e, s) === !1) return this._mouseUp(new t.Event("mouseup", e)), !1;
                this.position = s.position
            }
            return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", t.ui.ddmanager && t.ui.ddmanager.drag(this, e), !1
        },
        _mouseStop: function(e) {
            var i = this,
                s = !1;
            return t.ui.ddmanager && !this.options.dropBehaviour && (s = t.ui.ddmanager.drop(this, e)), this.dropped && (s = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !s || "valid" === this.options.revert && s || this.options.revert === !0 || t.isFunction(this.options.revert) && this.options.revert.call(this.element, s) ? t(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                i._trigger("stop", e) !== !1 && i._clear()
            }) : this._trigger("stop", e) !== !1 && this._clear(), !1
        },
        _mouseUp: function(e) {
            return this._unblockFrames(), t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e), this.handleElement.is(e.target) && this.element.trigger("focus"), t.ui.mouse.prototype._mouseUp.call(this, e)
        },
        cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp(new t.Event("mouseup", {
                target: this.element[0]
            })) : this._clear(), this
        },
        _getHandle: function(e) {
            return this.options.handle ? !!t(e.target).closest(this.element.find(this.options.handle)).length : !0
        },
        _setHandleClassName: function() {
            this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element, this._addClass(this.handleElement, "ui-draggable-handle")
        },
        _removeHandleClassName: function() {
            this._removeClass(this.handleElement, "ui-draggable-handle")
        },
        _createHelper: function(e) {
            var i = this.options,
                s = t.isFunction(i.helper),
                n = s ? t(i.helper.apply(this.element[0], [e])) : "clone" === i.helper ? this.element.clone().removeAttr("id") : this.element;
            return n.parents("body").length || n.appendTo("parent" === i.appendTo ? this.element[0].parentNode : i.appendTo), s && n[0] === this.element[0] && this._setPositionRelative(), n[0] === this.element[0] || /(fixed|absolute)/.test(n.css("position")) || n.css("position", "absolute"), n
        },
        _setPositionRelative: function() {
            /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
        },
        _adjustOffsetFromHelper: function(e) {
            "string" == typeof e && (e = e.split(" ")), t.isArray(e) && (e = {
                left: +e[0],
                top: +e[1] || 0
            }), "left" in e && (this.offset.click.left = e.left + this.margins.left), "right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left), "top" in e && (this.offset.click.top = e.top + this.margins.top), "bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top)
        },
        _isRootNode: function(t) {
            return /(html|body)/i.test(t.tagName) || t === this.document[0]
        },
        _getParentOffset: function() {
            var e = this.offsetParent.offset(),
                i = this.document[0];
            return "absolute" === this.cssPosition && this.scrollParent[0] !== i && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), e.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (e = {
                top: 0,
                left: 0
            }), {
                top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            if ("relative" !== this.cssPosition) return {
                top: 0,
                left: 0
            };
            var t = this.element.position(),
                e = this._isRootNode(this.scrollParent[0]);
            return {
                top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + (e ? 0 : this.scrollParent.scrollTop()),
                left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + (e ? 0 : this.scrollParent.scrollLeft())
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var e, i, s, n = this.options,
                o = this.document[0];
            return this.relativeContainer = null, n.containment ? "window" === n.containment ? (this.containment = [t(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, t(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, t(window).scrollLeft() + t(window).width() - this.helperProportions.width - this.margins.left, t(window).scrollTop() + (t(window).height() || o.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : "document" === n.containment ? (this.containment = [0, 0, t(o).width() - this.helperProportions.width - this.margins.left, (t(o).height() || o.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : n.containment.constructor === Array ? (this.containment = n.containment, void 0) : ("parent" === n.containment && (n.containment = this.helper[0].parentNode), i = t(n.containment), s = i[0], s && (e = /(scroll|auto)/.test(i.css("overflow")), this.containment = [(parseInt(i.css("borderLeftWidth"), 10) || 0) + (parseInt(i.css("paddingLeft"), 10) || 0), (parseInt(i.css("borderTopWidth"), 10) || 0) + (parseInt(i.css("paddingTop"), 10) || 0), (e ? Math.max(s.scrollWidth, s.offsetWidth) : s.offsetWidth) - (parseInt(i.css("borderRightWidth"), 10) || 0) - (parseInt(i.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (e ? Math.max(s.scrollHeight, s.offsetHeight) : s.offsetHeight) - (parseInt(i.css("borderBottomWidth"), 10) || 0) - (parseInt(i.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relativeContainer = i), void 0) : (this.containment = null, void 0)
        },
        _convertPositionTo: function(t, e) {
            e || (e = this.position);
            var i = "absolute" === t ? 1 : -1,
                s = this._isRootNode(this.scrollParent[0]);
            return {
                top: e.top + this.offset.relative.top * i + this.offset.parent.top * i - ("fixed" === this.cssPosition ? -this.offset.scroll.top : s ? 0 : this.offset.scroll.top) * i,
                left: e.left + this.offset.relative.left * i + this.offset.parent.left * i - ("fixed" === this.cssPosition ? -this.offset.scroll.left : s ? 0 : this.offset.scroll.left) * i
            }
        },
        _generatePosition: function(t, e) {
            var i, s, n, o, a = this.options,
                r = this._isRootNode(this.scrollParent[0]),
                h = t.pageX,
                l = t.pageY;
            return r && this.offset.scroll || (this.offset.scroll = {
                top: this.scrollParent.scrollTop(),
                left: this.scrollParent.scrollLeft()
            }), e && (this.containment && (this.relativeContainer ? (s = this.relativeContainer.offset(), i = [this.containment[0] + s.left, this.containment[1] + s.top, this.containment[2] + s.left, this.containment[3] + s.top]) : i = this.containment, t.pageX - this.offset.click.left < i[0] && (h = i[0] + this.offset.click.left), t.pageY - this.offset.click.top < i[1] && (l = i[1] + this.offset.click.top), t.pageX - this.offset.click.left > i[2] && (h = i[2] + this.offset.click.left), t.pageY - this.offset.click.top > i[3] && (l = i[3] + this.offset.click.top)), a.grid && (n = a.grid[1] ? this.originalPageY + Math.round((l - this.originalPageY) / a.grid[1]) * a.grid[1] : this.originalPageY, l = i ? n - this.offset.click.top >= i[1] || n - this.offset.click.top > i[3] ? n : n - this.offset.click.top >= i[1] ? n - a.grid[1] : n + a.grid[1] : n, o = a.grid[0] ? this.originalPageX + Math.round((h - this.originalPageX) / a.grid[0]) * a.grid[0] : this.originalPageX, h = i ? o - this.offset.click.left >= i[0] || o - this.offset.click.left > i[2] ? o : o - this.offset.click.left >= i[0] ? o - a.grid[0] : o + a.grid[0] : o), "y" === a.axis && (h = this.originalPageX), "x" === a.axis && (l = this.originalPageY)), {
                top: l - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : r ? 0 : this.offset.scroll.top),
                left: h - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : r ? 0 : this.offset.scroll.left)
            }
        },
        _clear: function() {
            this._removeClass(this.helper, "ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1, this.destroyOnClear && this.destroy()
        },
        _trigger: function(e, i, s) {
            return s = s || this._uiHash(), t.ui.plugin.call(this, e, [i, s, this], !0), /^(drag|start|stop)/.test(e) && (this.positionAbs = this._convertPositionTo("absolute"), s.offset = this.positionAbs), t.Widget.prototype._trigger.call(this, e, i, s)
        },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    }), t.ui.plugin.add("draggable", "connectToSortable", {
        start: function(e, i, s) {
            var n = t.extend({}, i, {
                item: s.element
            });
            s.sortables = [], t(s.options.connectToSortable).each(function() {
                var i = t(this).sortable("instance");
                i && !i.options.disabled && (s.sortables.push(i), i.refreshPositions(), i._trigger("activate", e, n))
            })
        },
        stop: function(e, i, s) {
            var n = t.extend({}, i, {
                item: s.element
            });
            s.cancelHelperRemoval = !1, t.each(s.sortables, function() {
                var t = this;
                t.isOver ? (t.isOver = 0, s.cancelHelperRemoval = !0, t.cancelHelperRemoval = !1, t._storedCSS = {
                    position: t.placeholder.css("position"),
                    top: t.placeholder.css("top"),
                    left: t.placeholder.css("left")
                }, t._mouseStop(e), t.options.helper = t.options._helper) : (t.cancelHelperRemoval = !0, t._trigger("deactivate", e, n))
            })
        },
        drag: function(e, i, s) {
            t.each(s.sortables, function() {
                var n = !1,
                    o = this;
                o.positionAbs = s.positionAbs, o.helperProportions = s.helperProportions, o.offset.click = s.offset.click, o._intersectsWith(o.containerCache) && (n = !0, t.each(s.sortables, function() {
                    return this.positionAbs = s.positionAbs, this.helperProportions = s.helperProportions, this.offset.click = s.offset.click, this !== o && this._intersectsWith(this.containerCache) && t.contains(o.element[0], this.element[0]) && (n = !1), n
                })), n ? (o.isOver || (o.isOver = 1, s._parent = i.helper.parent(), o.currentItem = i.helper.appendTo(o.element).data("ui-sortable-item", !0), o.options._helper = o.options.helper, o.options.helper = function() {
                    return i.helper[0]
                }, e.target = o.currentItem[0], o._mouseCapture(e, !0), o._mouseStart(e, !0, !0), o.offset.click.top = s.offset.click.top, o.offset.click.left = s.offset.click.left, o.offset.parent.left -= s.offset.parent.left - o.offset.parent.left, o.offset.parent.top -= s.offset.parent.top - o.offset.parent.top, s._trigger("toSortable", e), s.dropped = o.element, t.each(s.sortables, function() {
                    this.refreshPositions()
                }), s.currentItem = s.element, o.fromOutside = s), o.currentItem && (o._mouseDrag(e), i.position = o.position)) : o.isOver && (o.isOver = 0, o.cancelHelperRemoval = !0, o.options._revert = o.options.revert, o.options.revert = !1, o._trigger("out", e, o._uiHash(o)), o._mouseStop(e, !0), o.options.revert = o.options._revert, o.options.helper = o.options._helper, o.placeholder && o.placeholder.remove(), i.helper.appendTo(s._parent), s._refreshOffsets(e), i.position = s._generatePosition(e, !0), s._trigger("fromSortable", e), s.dropped = !1, t.each(s.sortables, function() {
                    this.refreshPositions()
                }))
            })
        }
    }), t.ui.plugin.add("draggable", "cursor", {
        start: function(e, i, s) {
            var n = t("body"),
                o = s.options;
            n.css("cursor") && (o._cursor = n.css("cursor")), n.css("cursor", o.cursor)
        },
        stop: function(e, i, s) {
            var n = s.options;
            n._cursor && t("body").css("cursor", n._cursor)
        }
    }), t.ui.plugin.add("draggable", "opacity", {
        start: function(e, i, s) {
            var n = t(i.helper),
                o = s.options;
            n.css("opacity") && (o._opacity = n.css("opacity")), n.css("opacity", o.opacity)
        },
        stop: function(e, i, s) {
            var n = s.options;
            n._opacity && t(i.helper).css("opacity", n._opacity)
        }
    }), t.ui.plugin.add("draggable", "scroll", {
        start: function(t, e, i) {
            i.scrollParentNotHidden || (i.scrollParentNotHidden = i.helper.scrollParent(!1)), i.scrollParentNotHidden[0] !== i.document[0] && "HTML" !== i.scrollParentNotHidden[0].tagName && (i.overflowOffset = i.scrollParentNotHidden.offset())
        },
        drag: function(e, i, s) {
            var n = s.options,
                o = !1,
                a = s.scrollParentNotHidden[0],
                r = s.document[0];
            a !== r && "HTML" !== a.tagName ? (n.axis && "x" === n.axis || (s.overflowOffset.top + a.offsetHeight - e.pageY < n.scrollSensitivity ? a.scrollTop = o = a.scrollTop + n.scrollSpeed : e.pageY - s.overflowOffset.top < n.scrollSensitivity && (a.scrollTop = o = a.scrollTop - n.scrollSpeed)), n.axis && "y" === n.axis || (s.overflowOffset.left + a.offsetWidth - e.pageX < n.scrollSensitivity ? a.scrollLeft = o = a.scrollLeft + n.scrollSpeed : e.pageX - s.overflowOffset.left < n.scrollSensitivity && (a.scrollLeft = o = a.scrollLeft - n.scrollSpeed))) : (n.axis && "x" === n.axis || (e.pageY - t(r).scrollTop() < n.scrollSensitivity ? o = t(r).scrollTop(t(r).scrollTop() - n.scrollSpeed) : t(window).height() - (e.pageY - t(r).scrollTop()) < n.scrollSensitivity && (o = t(r).scrollTop(t(r).scrollTop() + n.scrollSpeed))), n.axis && "y" === n.axis || (e.pageX - t(r).scrollLeft() < n.scrollSensitivity ? o = t(r).scrollLeft(t(r).scrollLeft() - n.scrollSpeed) : t(window).width() - (e.pageX - t(r).scrollLeft()) < n.scrollSensitivity && (o = t(r).scrollLeft(t(r).scrollLeft() + n.scrollSpeed)))), o !== !1 && t.ui.ddmanager && !n.dropBehaviour && t.ui.ddmanager.prepareOffsets(s, e)
        }
    }), t.ui.plugin.add("draggable", "snap", {
        start: function(e, i, s) {
            var n = s.options;
            s.snapElements = [], t(n.snap.constructor !== String ? n.snap.items || ":data(ui-draggable)" : n.snap).each(function() {
                var e = t(this),
                    i = e.offset();
                this !== s.element[0] && s.snapElements.push({
                    item: this,
                    width: e.outerWidth(),
                    height: e.outerHeight(),
                    top: i.top,
                    left: i.left
                })
            })
        },
        drag: function(e, i, s) {
            var n, o, a, r, h, l, c, u, d, p, f = s.options,
                m = f.snapTolerance,
                g = i.offset.left,
                _ = g + s.helperProportions.width,
                v = i.offset.top,
                b = v + s.helperProportions.height;
            for (d = s.snapElements.length - 1; d >= 0; d--) h = s.snapElements[d].left - s.margins.left, l = h + s.snapElements[d].width, c = s.snapElements[d].top - s.margins.top, u = c + s.snapElements[d].height, h - m > _ || g > l + m || c - m > b || v > u + m || !t.contains(s.snapElements[d].item.ownerDocument, s.snapElements[d].item) ? (s.snapElements[d].snapping && s.options.snap.release && s.options.snap.release.call(s.element, e, t.extend(s._uiHash(), {
                snapItem: s.snapElements[d].item
            })), s.snapElements[d].snapping = !1) : ("inner" !== f.snapMode && (n = m >= Math.abs(c - b), o = m >= Math.abs(u - v), a = m >= Math.abs(h - _), r = m >= Math.abs(l - g), n && (i.position.top = s._convertPositionTo("relative", {
                top: c - s.helperProportions.height,
                left: 0
            }).top), o && (i.position.top = s._convertPositionTo("relative", {
                top: u,
                left: 0
            }).top), a && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: h - s.helperProportions.width
            }).left), r && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: l
            }).left)), p = n || o || a || r, "outer" !== f.snapMode && (n = m >= Math.abs(c - v), o = m >= Math.abs(u - b), a = m >= Math.abs(h - g), r = m >= Math.abs(l - _), n && (i.position.top = s._convertPositionTo("relative", {
                top: c,
                left: 0
            }).top), o && (i.position.top = s._convertPositionTo("relative", {
                top: u - s.helperProportions.height,
                left: 0
            }).top), a && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: h
            }).left), r && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: l - s.helperProportions.width
            }).left)), !s.snapElements[d].snapping && (n || o || a || r || p) && s.options.snap.snap && s.options.snap.snap.call(s.element, e, t.extend(s._uiHash(), {
                snapItem: s.snapElements[d].item
            })), s.snapElements[d].snapping = n || o || a || r || p)
        }
    }), t.ui.plugin.add("draggable", "stack", {
        start: function(e, i, s) {
            var n, o = s.options,
                a = t.makeArray(t(o.stack)).sort(function(e, i) {
                    return (parseInt(t(e).css("zIndex"), 10) || 0) - (parseInt(t(i).css("zIndex"), 10) || 0)
                });
            a.length && (n = parseInt(t(a[0]).css("zIndex"), 10) || 0, t(a).each(function(e) {
                t(this).css("zIndex", n + e)
            }), this.css("zIndex", n + a.length))
        }
    }), t.ui.plugin.add("draggable", "zIndex", {
        start: function(e, i, s) {
            var n = t(i.helper),
                o = s.options;
            n.css("zIndex") && (o._zIndex = n.css("zIndex")), n.css("zIndex", o.zIndex)
        },
        stop: function(e, i, s) {
            var n = s.options;
            n._zIndex && t(i.helper).css("zIndex", n._zIndex)
        }
    }), t.ui.draggable
});
! function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.io = e() : t.io = e()
}(this, function() {
    return function(t) {
        function e(n) {
            if (r[n]) return r[n].exports;
            var o = r[n] = {
                exports: {},
                id: n,
                loaded: !1
            };
            return t[n].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports
        }
        var r = {};
        return e.m = t, e.c = r, e.p = "", e(0)
    }([function(t, e, r) {
        "use strict";

        function n(t, e) {
            "object" === ("undefined" == typeof t ? "undefined" : i(t)) && (e = t, t = void 0), e = e || {};
            var r, n = s(t),
                a = n.source,
                p = n.id,
                f = n.path,
                l = h[p] && f in h[p].nsps,
                d = e.forceNew || e["force new connection"] || !1 === e.multiplex || l;
            return d ? (u("ignoring socket cache for %s", a), r = c(a, e)) : (h[p] || (u("new io instance for %s", a), h[p] = c(a, e)), r = h[p]), n.query && !e.query ? e.query = n.query : e && "object" === i(e.query) && (e.query = o(e.query)), r.socket(n.path, e)
        }

        function o(t) {
            var e = [];
            for (var r in t) t.hasOwnProperty(r) && e.push(encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
            return e.join("&")
        }
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            },
            s = r(1),
            a = r(7),
            c = r(17),
            u = r(3)("socket.io-client");
        t.exports = e = n;
        var h = e.managers = {};
        e.protocol = a.protocol, e.connect = n, e.Manager = r(17), e.Socket = r(44)
    }, function(t, e, r) {
        (function(e) {
            "use strict";

            function n(t, r) {
                var n = t;
                r = r || e.location, null == t && (t = r.protocol + "//" + r.host), "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? r.protocol + t : r.host + t), /^(https?|wss?):\/\//.test(t) || (i("protocol-less url %s", t), t = "undefined" != typeof r ? r.protocol + "//" + t : "https://" + t), i("parse %s", t), n = o(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
                var s = n.host.indexOf(":") !== -1,
                    a = s ? "[" + n.host + "]" : n.host;
                return n.id = n.protocol + "://" + a + ":" + n.port, n.href = n.protocol + "://" + a + (r && r.port === n.port ? "" : ":" + n.port), n
            }
            var o = r(2),
                i = r(3)("socket.io-client:url");
            t.exports = n
        }).call(e, function() {
            return this
        }())
    }, function(t, e) {
        var r = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
            n = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
        t.exports = function(t) {
            var e = t,
                o = t.indexOf("["),
                i = t.indexOf("]");
            o != -1 && i != -1 && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length));
            for (var s = r.exec(t || ""), a = {}, c = 14; c--;) a[n[c]] = s[c] || "";
            return o != -1 && i != -1 && (a.source = e, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), a.ipv6uri = !0), a
        }
    }, function(t, e, r) {
        (function(n) {
            function o() {
                return "undefined" != typeof document && "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
            }

            function i() {
                var t = arguments,
                    r = this.useColors;
                if (t[0] = (r ? "%c" : "") + this.namespace + (r ? " %c" : " ") + t[0] + (r ? "%c " : " ") + "+" + e.humanize(this.diff), !r) return t;
                var n = "color: " + this.color;
                t = [t[0], n, "color: inherit"].concat(Array.prototype.slice.call(t, 1));
                var o = 0,
                    i = 0;
                return t[0].replace(/%[a-z%]/g, function(t) {
                    "%%" !== t && (o++, "%c" === t && (i = o))
                }), t.splice(i, 0, n), t
            }

            function s() {
                return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
            }

            function a(t) {
                try {
                    null == t ? e.storage.removeItem("debug") : e.storage.debug = t
                } catch (t) {}
            }

            function c() {
                try {
                    return e.storage.debug
                } catch (t) {}
                if ("undefined" != typeof n && "env" in n) return n.env.DEBUG
            }

            function u() {
                try {
                    return window.localStorage
                } catch (t) {}
            }
            e = t.exports = r(5), e.log = s, e.formatArgs = i, e.save = a, e.load = c, e.useColors = o, e.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : u(), e.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], e.formatters.j = function(t) {
                try {
                    return JSON.stringify(t)
                } catch (t) {
                    return "[UnexpectedJSONParseError]: " + t.message
                }
            }, e.enable(c())
        }).call(e, r(4))
    }, function(t, e) {
        function r() {
            throw new Error("setTimeout has not been defined")
        }

        function n() {
            throw new Error("clearTimeout has not been defined")
        }

        function o(t) {
            if (h === setTimeout) return setTimeout(t, 0);
            if ((h === r || !h) && setTimeout) return h = setTimeout, setTimeout(t, 0);
            try {
                return h(t, 0)
            } catch (e) {
                try {
                    return h.call(null, t, 0)
                } catch (e) {
                    return h.call(this, t, 0)
                }
            }
        }

        function i(t) {
            if (p === clearTimeout) return clearTimeout(t);
            if ((p === n || !p) && clearTimeout) return p = clearTimeout, clearTimeout(t);
            try {
                return p(t)
            } catch (e) {
                try {
                    return p.call(null, t)
                } catch (e) {
                    return p.call(this, t)
                }
            }
        }

        function s() {
            y && l && (y = !1, l.length ? d = l.concat(d) : g = -1, d.length && a())
        }

        function a() {
            if (!y) {
                var t = o(s);
                y = !0;
                for (var e = d.length; e;) {
                    for (l = d, d = []; ++g < e;) l && l[g].run();
                    g = -1, e = d.length
                }
                l = null, y = !1, i(t)
            }
        }

        function c(t, e) {
            this.fun = t, this.array = e
        }

        function u() {}
        var h, p, f = t.exports = {};
        ! function() {
            try {
                h = "function" == typeof setTimeout ? setTimeout : r
            } catch (t) {
                h = r
            }
            try {
                p = "function" == typeof clearTimeout ? clearTimeout : n
            } catch (t) {
                p = n
            }
        }();
        var l, d = [],
            y = !1,
            g = -1;
        f.nextTick = function(t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
            d.push(new c(t, e)), 1 !== d.length || y || o(a)
        }, c.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, f.title = "browser", f.browser = !0, f.env = {}, f.argv = [], f.version = "", f.versions = {}, f.on = u, f.addListener = u, f.once = u, f.off = u, f.removeListener = u, f.removeAllListeners = u, f.emit = u, f.binding = function(t) {
            throw new Error("process.binding is not supported")
        }, f.cwd = function() {
            return "/"
        }, f.chdir = function(t) {
            throw new Error("process.chdir is not supported")
        }, f.umask = function() {
            return 0
        }
    }, function(t, e, r) {
        function n() {
            return e.colors[h++ % e.colors.length]
        }

        function o(t) {
            function r() {}

            function o() {
                var t = o,
                    r = +new Date,
                    i = r - (u || r);
                t.diff = i, t.prev = u, t.curr = r, u = r, null == t.useColors && (t.useColors = e.useColors()), null == t.color && t.useColors && (t.color = n());
                for (var s = new Array(arguments.length), a = 0; a < s.length; a++) s[a] = arguments[a];
                s[0] = e.coerce(s[0]), "string" != typeof s[0] && (s = ["%o"].concat(s));
                var c = 0;
                s[0] = s[0].replace(/%([a-z%])/g, function(r, n) {
                    if ("%%" === r) return r;
                    c++;
                    var o = e.formatters[n];
                    if ("function" == typeof o) {
                        var i = s[c];
                        r = o.call(t, i), s.splice(c, 1), c--
                    }
                    return r
                }), s = e.formatArgs.apply(t, s);
                var h = o.log || e.log || console.log.bind(console);
                h.apply(t, s)
            }
            r.enabled = !1, o.enabled = !0;
            var i = e.enabled(t) ? o : r;
            return i.namespace = t, i
        }

        function i(t) {
            e.save(t);
            for (var r = (t || "").split(/[\s,]+/), n = r.length, o = 0; o < n; o++) r[o] && (t = r[o].replace(/[\\^$+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*?"), "-" === t[0] ? e.skips.push(new RegExp("^" + t.substr(1) + "$")) : e.names.push(new RegExp("^" + t + "$")))
        }

        function s() {
            e.enable("")
        }

        function a(t) {
            var r, n;
            for (r = 0, n = e.skips.length; r < n; r++)
                if (e.skips[r].test(t)) return !1;
            for (r = 0, n = e.names.length; r < n; r++)
                if (e.names[r].test(t)) return !0;
            return !1
        }

        function c(t) {
            return t instanceof Error ? t.stack || t.message : t
        }
        e = t.exports = o.debug = o, e.coerce = c, e.disable = s, e.enable = i, e.enabled = a, e.humanize = r(6), e.names = [], e.skips = [], e.formatters = {};
        var u, h = 0
    }, function(t, e) {
        function r(t) {
            if (t = String(t), !(t.length > 1e4)) {
                var e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);
                if (e) {
                    var r = parseFloat(e[1]),
                        n = (e[2] || "ms").toLowerCase();
                    switch (n) {
                        case "years":
                        case "year":
                        case "yrs":
                        case "yr":
                        case "y":
                            return r * h;
                        case "days":
                        case "day":
                        case "d":
                            return r * u;
                        case "hours":
                        case "hour":
                        case "hrs":
                        case "hr":
                        case "h":
                            return r * c;
                        case "minutes":
                        case "minute":
                        case "mins":
                        case "min":
                        case "m":
                            return r * a;
                        case "seconds":
                        case "second":
                        case "secs":
                        case "sec":
                        case "s":
                            return r * s;
                        case "milliseconds":
                        case "millisecond":
                        case "msecs":
                        case "msec":
                        case "ms":
                            return r;
                        default:
                            return
                    }
                }
            }
        }

        function n(t) {
            return t >= u ? Math.round(t / u) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= s ? Math.round(t / s) + "s" : t + "ms"
        }

        function o(t) {
            return i(t, u, "day") || i(t, c, "hour") || i(t, a, "minute") || i(t, s, "second") || t + " ms"
        }

        function i(t, e, r) {
            if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + " " + r : Math.ceil(t / e) + " " + r + "s"
        }
        var s = 1e3,
            a = 60 * s,
            c = 60 * a,
            u = 24 * c,
            h = 365.25 * u;
        t.exports = function(t, e) {
            e = e || {};
            var i = typeof t;
            if ("string" === i && t.length > 0) return r(t);
            if ("number" === i && isNaN(t) === !1) return e.long ? o(t) : n(t);
            throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(t))
        }
    }, function(t, e, r) {
        function n() {}

        function o(t) {
            var r = "",
                n = !1;
            return r += t.type, e.BINARY_EVENT != t.type && e.BINARY_ACK != t.type || (r += t.attachments, r += "-"), t.nsp && "/" != t.nsp && (n = !0, r += t.nsp), null != t.id && (n && (r += ",", n = !1), r += t.id), null != t.data && (n && (r += ","), r += f.stringify(t.data)), p("encoded %j as %s", t, r), r
        }

        function i(t, e) {
            function r(t) {
                var r = d.deconstructPacket(t),
                    n = o(r.packet),
                    i = r.buffers;
                i.unshift(n), e(i)
            }
            d.removeBlobs(t, r)
        }

        function s() {
            this.reconstructor = null
        }

        function a(t) {
            var r = {},
                n = 0;
            if (r.type = Number(t.charAt(0)), null == e.types[r.type]) return h();
            if (e.BINARY_EVENT == r.type || e.BINARY_ACK == r.type) {
                for (var o = "";
                    "-" != t.charAt(++n) && (o += t.charAt(n), n != t.length););
                if (o != Number(o) || "-" != t.charAt(n)) throw new Error("Illegal attachments");
                r.attachments = Number(o)
            }
            if ("/" == t.charAt(n + 1))
                for (r.nsp = ""; ++n;) {
                    var i = t.charAt(n);
                    if ("," == i) break;
                    if (r.nsp += i, n == t.length) break
                } else r.nsp = "/";
            var s = t.charAt(n + 1);
            if ("" !== s && Number(s) == s) {
                for (r.id = ""; ++n;) {
                    var i = t.charAt(n);
                    if (null == i || Number(i) != i) {
                        --n;
                        break
                    }
                    if (r.id += t.charAt(n), n == t.length) break
                }
                r.id = Number(r.id)
            }
            return t.charAt(++n) && (r = c(r, t.substr(n))), p("decoded %s as %j", t, r), r
        }

        function c(t, e) {
            try {
                t.data = f.parse(e)
            } catch (t) {
                return h()
            }
            return t
        }

        function u(t) {
            this.reconPack = t, this.buffers = []
        }

        function h(t) {
            return {
                type: e.ERROR,
                data: "parser error"
            }
        }
        var p = r(8)("socket.io-parser"),
            f = r(11),
            l = r(13),
            d = r(14),
            y = r(16);
        e.protocol = 4, e.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"], e.CONNECT = 0, e.DISCONNECT = 1, e.EVENT = 2, e.ACK = 3, e.ERROR = 4, e.BINARY_EVENT = 5, e.BINARY_ACK = 6, e.Encoder = n, e.Decoder = s, n.prototype.encode = function(t, r) {
            if (p("encoding packet %j", t), e.BINARY_EVENT == t.type || e.BINARY_ACK == t.type) i(t, r);
            else {
                var n = o(t);
                r([n])
            }
        }, l(s.prototype), s.prototype.add = function(t) {
            var r;
            if ("string" == typeof t) r = a(t), e.BINARY_EVENT == r.type || e.BINARY_ACK == r.type ? (this.reconstructor = new u(r), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", r)) : this.emit("decoded", r);
            else {
                if (!y(t) && !t.base64) throw new Error("Unknown type: " + t);
                if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                r = this.reconstructor.takeBinaryData(t), r && (this.reconstructor = null, this.emit("decoded", r))
            }
        }, s.prototype.destroy = function() {
            this.reconstructor && this.reconstructor.finishedReconstruction()
        }, u.prototype.takeBinaryData = function(t) {
            if (this.buffers.push(t), this.buffers.length == this.reconPack.attachments) {
                var e = d.reconstructPacket(this.reconPack, this.buffers);
                return this.finishedReconstruction(), e
            }
            return null
        }, u.prototype.finishedReconstruction = function() {
            this.reconPack = null, this.buffers = []
        }
    }, function(t, e, r) {
        function n() {
            return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
        }

        function o() {
            var t = arguments,
                r = this.useColors;
            if (t[0] = (r ? "%c" : "") + this.namespace + (r ? " %c" : " ") + t[0] + (r ? "%c " : " ") + "+" + e.humanize(this.diff), !r) return t;
            var n = "color: " + this.color;
            t = [t[0], n, "color: inherit"].concat(Array.prototype.slice.call(t, 1));
            var o = 0,
                i = 0;
            return t[0].replace(/%[a-z%]/g, function(t) {
                "%%" !== t && (o++, "%c" === t && (i = o))
            }), t.splice(i, 0, n), t
        }

        function i() {
            return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
        }

        function s(t) {
            try {
                null == t ? e.storage.removeItem("debug") : e.storage.debug = t
            } catch (t) {}
        }

        function a() {
            var t;
            try {
                t = e.storage.debug
            } catch (t) {}
            return t
        }

        function c() {
            try {
                return window.localStorage
            } catch (t) {}
        }
        e = t.exports = r(9), e.log = i, e.formatArgs = o, e.save = s, e.load = a, e.useColors = n, e.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : c(), e.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], e.formatters.j = function(t) {
            return JSON.stringify(t)
        }, e.enable(a())
    }, function(t, e, r) {
        function n() {
            return e.colors[h++ % e.colors.length]
        }

        function o(t) {
            function r() {}

            function o() {
                var t = o,
                    r = +new Date,
                    i = r - (u || r);
                t.diff = i, t.prev = u, t.curr = r, u = r, null == t.useColors && (t.useColors = e.useColors()), null == t.color && t.useColors && (t.color = n());
                var s = Array.prototype.slice.call(arguments);
                s[0] = e.coerce(s[0]), "string" != typeof s[0] && (s = ["%o"].concat(s));
                var a = 0;
                s[0] = s[0].replace(/%([a-z%])/g, function(r, n) {
                    if ("%%" === r) return r;
                    a++;
                    var o = e.formatters[n];
                    if ("function" == typeof o) {
                        var i = s[a];
                        r = o.call(t, i), s.splice(a, 1), a--
                    }
                    return r
                }), "function" == typeof e.formatArgs && (s = e.formatArgs.apply(t, s));
                var c = o.log || e.log || console.log.bind(console);
                c.apply(t, s)
            }
            r.enabled = !1, o.enabled = !0;
            var i = e.enabled(t) ? o : r;
            return i.namespace = t, i
        }

        function i(t) {
            e.save(t);
            for (var r = (t || "").split(/[\s,]+/), n = r.length, o = 0; o < n; o++) r[o] && (t = r[o].replace(/\*/g, ".*?"), "-" === t[0] ? e.skips.push(new RegExp("^" + t.substr(1) + "$")) : e.names.push(new RegExp("^" + t + "$")))
        }

        function s() {
            e.enable("")
        }

        function a(t) {
            var r, n;
            for (r = 0, n = e.skips.length; r < n; r++)
                if (e.skips[r].test(t)) return !1;
            for (r = 0, n = e.names.length; r < n; r++)
                if (e.names[r].test(t)) return !0;
            return !1
        }

        function c(t) {
            return t instanceof Error ? t.stack || t.message : t
        }
        e = t.exports = o, e.coerce = c, e.disable = s, e.enable = i, e.enabled = a, e.humanize = r(10), e.names = [], e.skips = [], e.formatters = {};
        var u, h = 0
    }, function(t, e) {
        function r(t) {
            if (t = "" + t, !(t.length > 1e4)) {
                var e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);
                if (e) {
                    var r = parseFloat(e[1]),
                        n = (e[2] || "ms").toLowerCase();
                    switch (n) {
                        case "years":
                        case "year":
                        case "yrs":
                        case "yr":
                        case "y":
                            return r * h;
                        case "days":
                        case "day":
                        case "d":
                            return r * u;
                        case "hours":
                        case "hour":
                        case "hrs":
                        case "hr":
                        case "h":
                            return r * c;
                        case "minutes":
                        case "minute":
                        case "mins":
                        case "min":
                        case "m":
                            return r * a;
                        case "seconds":
                        case "second":
                        case "secs":
                        case "sec":
                        case "s":
                            return r * s;
                        case "milliseconds":
                        case "millisecond":
                        case "msecs":
                        case "msec":
                        case "ms":
                            return r
                    }
                }
            }
        }

        function n(t) {
            return t >= u ? Math.round(t / u) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= s ? Math.round(t / s) + "s" : t + "ms"
        }

        function o(t) {
            return i(t, u, "day") || i(t, c, "hour") || i(t, a, "minute") || i(t, s, "second") || t + " ms"
        }

        function i(t, e, r) {
            if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + " " + r : Math.ceil(t / e) + " " + r + "s"
        }
        var s = 1e3,
            a = 60 * s,
            c = 60 * a,
            u = 24 * c,
            h = 365.25 * u;
        t.exports = function(t, e) {
            return e = e || {}, "string" == typeof t ? r(t) : e.long ? o(t) : n(t)
        }
    }, function(t, e, r) {
        (function(t, r) {
            var n = !1;
            (function() {
                function o(t, e) {
                    function r(t) {
                        if (r[t] !== g) return r[t];
                        var o;
                        if ("bug-string-char-index" == t) o = "a" != "a" [0];
                        else if ("json" == t) o = r("json-stringify") && r("json-parse");
                        else {
                            var s, a = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                            if ("json-stringify" == t) {
                                var c = e.stringify,
                                    h = "function" == typeof c && b;
                                if (h) {
                                    (s = function() {
                                        return 1
                                    }).toJSON = s;
                                    try {
                                        h = "0" === c(0) && "0" === c(new n) && '""' == c(new i) && c(v) === g && c(g) === g && c() === g && "1" === c(s) && "[1]" == c([s]) && "[null]" == c([g]) && "null" == c(null) && "[null,null,null]" == c([g, v, null]) && c({
                                            a: [s, !0, !1, null, "\0\b\n\f\r\t"]
                                        }) == a && "1" === c(null, s) && "[\n 1,\n 2\n]" == c([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == c(new u(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == c(new u(864e13)) && '"-000001-01-01T00:00:00.000Z"' == c(new u(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == c(new u(-1))
                                    } catch (t) {
                                        h = !1
                                    }
                                }
                                o = h
                            }
                            if ("json-parse" == t) {
                                var p = e.parse;
                                if ("function" == typeof p) try {
                                    if (0 === p("0") && !p(!1)) {
                                        s = p(a);
                                        var f = 5 == s.a.length && 1 === s.a[0];
                                        if (f) {
                                            try {
                                                f = !p('"\t"')
                                            } catch (t) {}
                                            if (f) try {
                                                f = 1 !== p("01")
                                            } catch (t) {}
                                            if (f) try {
                                                f = 1 !== p("1.")
                                            } catch (t) {}
                                        }
                                    }
                                } catch (t) {
                                    f = !1
                                }
                                o = f
                            }
                        }
                        return r[t] = !!o
                    }
                    t || (t = c.Object()), e || (e = c.Object());
                    var n = t.Number || c.Number,
                        i = t.String || c.String,
                        a = t.Object || c.Object,
                        u = t.Date || c.Date,
                        h = t.SyntaxError || c.SyntaxError,
                        p = t.TypeError || c.TypeError,
                        f = t.Math || c.Math,
                        l = t.JSON || c.JSON;
                    "object" == typeof l && l && (e.stringify = l.stringify, e.parse = l.parse);
                    var d, y, g, m = a.prototype,
                        v = m.toString,
                        b = new u(-0xc782b5b800cec);
                    try {
                        b = b.getUTCFullYear() == -109252 && 0 === b.getUTCMonth() && 1 === b.getUTCDate() && 10 == b.getUTCHours() && 37 == b.getUTCMinutes() && 6 == b.getUTCSeconds() && 708 == b.getUTCMilliseconds()
                    } catch (t) {}
                    if (!r("json")) {
                        var w = "[object Function]",
                            k = "[object Date]",
                            x = "[object Number]",
                            A = "[object String]",
                            C = "[object Array]",
                            B = "[object Boolean]",
                            S = r("bug-string-char-index");
                        if (!b) var T = f.floor,
                            E = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                            _ = function(t, e) {
                                return E[e] + 365 * (t - 1970) + T((t - 1969 + (e = +(e > 1))) / 4) - T((t - 1901 + e) / 100) + T((t - 1601 + e) / 400)
                            };
                        if ((d = m.hasOwnProperty) || (d = function(t) {
                                var e, r = {};
                                return (r.__proto__ = null, r.__proto__ = {
                                    toString: 1
                                }, r).toString != v ? d = function(t) {
                                    var e = this.__proto__,
                                        r = t in (this.__proto__ = null, this);
                                    return this.__proto__ = e, r
                                } : (e = r.constructor, d = function(t) {
                                    var r = (this.constructor || e).prototype;
                                    return t in this && !(t in r && this[t] === r[t])
                                }), r = null, d.call(this, t)
                            }), y = function(t, e) {
                                var r, n, o, i = 0;
                                (r = function() {
                                    this.valueOf = 0
                                }).prototype.valueOf = 0, n = new r;
                                for (o in n) d.call(n, o) && i++;
                                return r = n = null, i ? y = 2 == i ? function(t, e) {
                                    var r, n = {},
                                        o = v.call(t) == w;
                                    for (r in t) o && "prototype" == r || d.call(n, r) || !(n[r] = 1) || !d.call(t, r) || e(r)
                                } : function(t, e) {
                                    var r, n, o = v.call(t) == w;
                                    for (r in t) o && "prototype" == r || !d.call(t, r) || (n = "constructor" === r) || e(r);
                                    (n || d.call(t, r = "constructor")) && e(r)
                                } : (n = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], y = function(t, e) {
                                    var r, o, i = v.call(t) == w,
                                        a = !i && "function" != typeof t.constructor && s[typeof t.hasOwnProperty] && t.hasOwnProperty || d;
                                    for (r in t) i && "prototype" == r || !a.call(t, r) || e(r);
                                    for (o = n.length; r = n[--o]; a.call(t, r) && e(r));
                                }), y(t, e)
                            }, !r("json-stringify")) {
                            var N = {
                                    92: "\\\\",
                                    34: '\\"',
                                    8: "\\b",
                                    12: "\\f",
                                    10: "\\n",
                                    13: "\\r",
                                    9: "\\t"
                                },
                                j = "000000",
                                O = function(t, e) {
                                    return (j + (e || 0)).slice(-t)
                                },
                                P = "\\u00",
                                R = function(t) {
                                    for (var e = '"', r = 0, n = t.length, o = !S || n > 10, i = o && (S ? t.split("") : t); r < n; r++) {
                                        var s = t.charCodeAt(r);
                                        switch (s) {
                                            case 8:
                                            case 9:
                                            case 10:
                                            case 12:
                                            case 13:
                                            case 34:
                                            case 92:
                                                e += N[s];
                                                break;
                                            default:
                                                if (s < 32) {
                                                    e += P + O(2, s.toString(16));
                                                    break
                                                }
                                                e += o ? i[r] : t.charAt(r)
                                        }
                                    }
                                    return e + '"'
                                },
                                D = function(t, e, r, n, o, i, s) {
                                    var a, c, u, h, f, l, m, b, w, S, E, N, j, P, q, U;
                                    try {
                                        a = e[t]
                                    } catch (t) {}
                                    if ("object" == typeof a && a)
                                        if (c = v.call(a), c != k || d.call(a, "toJSON")) "function" == typeof a.toJSON && (c != x && c != A && c != C || d.call(a, "toJSON")) && (a = a.toJSON(t));
                                        else if (a > -1 / 0 && a < 1 / 0) {
                                        if (_) {
                                            for (f = T(a / 864e5), u = T(f / 365.2425) + 1970 - 1; _(u + 1, 0) <= f; u++);
                                            for (h = T((f - _(u, 0)) / 30.42); _(u, h + 1) <= f; h++);
                                            f = 1 + f - _(u, h), l = (a % 864e5 + 864e5) % 864e5, m = T(l / 36e5) % 24, b = T(l / 6e4) % 60, w = T(l / 1e3) % 60, S = l % 1e3
                                        } else u = a.getUTCFullYear(), h = a.getUTCMonth(), f = a.getUTCDate(), m = a.getUTCHours(), b = a.getUTCMinutes(), w = a.getUTCSeconds(), S = a.getUTCMilliseconds();
                                        a = (u <= 0 || u >= 1e4 ? (u < 0 ? "-" : "+") + O(6, u < 0 ? -u : u) : O(4, u)) + "-" + O(2, h + 1) + "-" + O(2, f) + "T" + O(2, m) + ":" + O(2, b) + ":" + O(2, w) + "." + O(3, S) + "Z"
                                    } else a = null;
                                    if (r && (a = r.call(e, t, a)), null === a) return "null";
                                    if (c = v.call(a), c == B) return "" + a;
                                    if (c == x) return a > -1 / 0 && a < 1 / 0 ? "" + a : "null";
                                    if (c == A) return R("" + a);
                                    if ("object" == typeof a) {
                                        for (P = s.length; P--;)
                                            if (s[P] === a) throw p();
                                        if (s.push(a), E = [], q = i, i += o, c == C) {
                                            for (j = 0, P = a.length; j < P; j++) N = D(j, a, r, n, o, i, s), E.push(N === g ? "null" : N);
                                            U = E.length ? o ? "[\n" + i + E.join(",\n" + i) + "\n" + q + "]" : "[" + E.join(",") + "]" : "[]"
                                        } else y(n || a, function(t) {
                                            var e = D(t, a, r, n, o, i, s);
                                            e !== g && E.push(R(t) + ":" + (o ? " " : "") + e)
                                        }), U = E.length ? o ? "{\n" + i + E.join(",\n" + i) + "\n" + q + "}" : "{" + E.join(",") + "}" : "{}";
                                        return s.pop(), U
                                    }
                                };
                            e.stringify = function(t, e, r) {
                                var n, o, i, a;
                                if (s[typeof e] && e)
                                    if ((a = v.call(e)) == w) o = e;
                                    else if (a == C) {
                                    i = {};
                                    for (var c, u = 0, h = e.length; u < h; c = e[u++], a = v.call(c), (a == A || a == x) && (i[c] = 1));
                                }
                                if (r)
                                    if ((a = v.call(r)) == x) {
                                        if ((r -= r % 1) > 0)
                                            for (n = "", r > 10 && (r = 10); n.length < r; n += " ");
                                    } else a == A && (n = r.length <= 10 ? r : r.slice(0, 10));
                                return D("", (c = {}, c[""] = t, c), o, i, n, "", [])
                            }
                        }
                        if (!r("json-parse")) {
                            var q, U, M = i.fromCharCode,
                                L = {
                                    92: "\\",
                                    34: '"',
                                    47: "/",
                                    98: "\b",
                                    116: "\t",
                                    110: "\n",
                                    102: "\f",
                                    114: "\r"
                                },
                                I = function() {
                                    throw q = U = null, h()
                                },
                                H = function() {
                                    for (var t, e, r, n, o, i = U, s = i.length; q < s;) switch (o = i.charCodeAt(q)) {
                                        case 9:
                                        case 10:
                                        case 13:
                                        case 32:
                                            q++;
                                            break;
                                        case 123:
                                        case 125:
                                        case 91:
                                        case 93:
                                        case 58:
                                        case 44:
                                            return t = S ? i.charAt(q) : i[q], q++, t;
                                        case 34:
                                            for (t = "@", q++; q < s;)
                                                if (o = i.charCodeAt(q), o < 32) I();
                                                else if (92 == o) switch (o = i.charCodeAt(++q)) {
                                                case 92:
                                                case 34:
                                                case 47:
                                                case 98:
                                                case 116:
                                                case 110:
                                                case 102:
                                                case 114:
                                                    t += L[o], q++;
                                                    break;
                                                case 117:
                                                    for (e = ++q, r = q + 4; q < r; q++) o = i.charCodeAt(q), o >= 48 && o <= 57 || o >= 97 && o <= 102 || o >= 65 && o <= 70 || I();
                                                    t += M("0x" + i.slice(e, q));
                                                    break;
                                                default:
                                                    I()
                                            } else {
                                                if (34 == o) break;
                                                for (o = i.charCodeAt(q), e = q; o >= 32 && 92 != o && 34 != o;) o = i.charCodeAt(++q);
                                                t += i.slice(e, q)
                                            }
                                            if (34 == i.charCodeAt(q)) return q++, t;
                                            I();
                                        default:
                                            if (e = q, 45 == o && (n = !0, o = i.charCodeAt(++q)), o >= 48 && o <= 57) {
                                                for (48 == o && (o = i.charCodeAt(q + 1), o >= 48 && o <= 57) && I(), n = !1; q < s && (o = i.charCodeAt(q), o >= 48 && o <= 57); q++);
                                                if (46 == i.charCodeAt(q)) {
                                                    for (r = ++q; r < s && (o = i.charCodeAt(r), o >= 48 && o <= 57); r++);
                                                    r == q && I(), q = r
                                                }
                                                if (o = i.charCodeAt(q), 101 == o || 69 == o) {
                                                    for (o = i.charCodeAt(++q), 43 != o && 45 != o || q++, r = q; r < s && (o = i.charCodeAt(r), o >= 48 && o <= 57); r++);
                                                    r == q && I(), q = r
                                                }
                                                return +i.slice(e, q)
                                            }
                                            if (n && I(), "true" == i.slice(q, q + 4)) return q += 4, !0;
                                            if ("false" == i.slice(q, q + 5)) return q += 5, !1;
                                            if ("null" == i.slice(q, q + 4)) return q += 4, null;
                                            I()
                                    }
                                    return "$"
                                },
                                z = function(t) {
                                    var e, r;
                                    if ("$" == t && I(), "string" == typeof t) {
                                        if ("@" == (S ? t.charAt(0) : t[0])) return t.slice(1);
                                        if ("[" == t) {
                                            for (e = []; t = H(), "]" != t; r || (r = !0)) r && ("," == t ? (t = H(), "]" == t && I()) : I()), "," == t && I(), e.push(z(t));
                                            return e
                                        }
                                        if ("{" == t) {
                                            for (e = {}; t = H(), "}" != t; r || (r = !0)) r && ("," == t ? (t = H(), "}" == t && I()) : I()), "," != t && "string" == typeof t && "@" == (S ? t.charAt(0) : t[0]) && ":" == H() || I(), e[t.slice(1)] = z(H());
                                            return e
                                        }
                                        I()
                                    }
                                    return t
                                },
                                J = function(t, e, r) {
                                    var n = X(t, e, r);
                                    n === g ? delete t[e] : t[e] = n
                                },
                                X = function(t, e, r) {
                                    var n, o = t[e];
                                    if ("object" == typeof o && o)
                                        if (v.call(o) == C)
                                            for (n = o.length; n--;) J(o, n, r);
                                        else y(o, function(t) {
                                            J(o, t, r)
                                        });
                                    return r.call(t, e, o)
                                };
                            e.parse = function(t, e) {
                                var r, n;
                                return q = 0, U = "" + t, r = z(H()), "$" != H() && I(), q = U = null, e && v.call(e) == w ? X((n = {}, n[""] = r, n), "", e) : r
                            }
                        }
                    }
                    return e.runInContext = o, e
                }
                var i = "function" == typeof n && n.amd,
                    s = {
                        function: !0,
                        object: !0
                    },
                    a = s[typeof e] && e && !e.nodeType && e,
                    c = s[typeof window] && window || this,
                    u = a && s[typeof t] && t && !t.nodeType && "object" == typeof r && r;
                if (!u || u.global !== u && u.window !== u && u.self !== u || (c = u), a && !i) o(c, a);
                else {
                    var h = c.JSON,
                        p = c.JSON3,
                        f = !1,
                        l = o(c, c.JSON3 = {
                            noConflict: function() {
                                return f || (f = !0, c.JSON = h, c.JSON3 = p, h = p = null), l
                            }
                        });
                    c.JSON = {
                        parse: l.parse,
                        stringify: l.stringify
                    }
                }
                i && n(function() {
                    return l
                })
            }).call(this)
        }).call(e, r(12)(t), function() {
            return this
        }())
    }, function(t, e) {
        t.exports = function(t) {
            return t.webpackPolyfill || (t.deprecate = function() {}, t.paths = [], t.children = [], t.webpackPolyfill = 1), t
        }
    }, function(t, e) {
        function r(t) {
            if (t) return n(t)
        }

        function n(t) {
            for (var e in r.prototype) t[e] = r.prototype[e];
            return t
        }
        t.exports = r, r.prototype.on = r.prototype.addEventListener = function(t, e) {
            return this._callbacks = this._callbacks || {}, (this._callbacks[t] = this._callbacks[t] || []).push(e), this
        }, r.prototype.once = function(t, e) {
            function r() {
                n.off(t, r), e.apply(this, arguments)
            }
            var n = this;
            return this._callbacks = this._callbacks || {}, r.fn = e, this.on(t, r), this
        }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function(t, e) {
            if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
            var r = this._callbacks[t];
            if (!r) return this;
            if (1 == arguments.length) return delete this._callbacks[t], this;
            for (var n, o = 0; o < r.length; o++)
                if (n = r[o], n === e || n.fn === e) {
                    r.splice(o, 1);
                    break
                } return this
        }, r.prototype.emit = function(t) {
            this._callbacks = this._callbacks || {};
            var e = [].slice.call(arguments, 1),
                r = this._callbacks[t];
            if (r) {
                r = r.slice(0);
                for (var n = 0, o = r.length; n < o; ++n) r[n].apply(this, e)
            }
            return this
        }, r.prototype.listeners = function(t) {
            return this._callbacks = this._callbacks || {}, this._callbacks[t] || []
        }, r.prototype.hasListeners = function(t) {
            return !!this.listeners(t).length
        }
    }, function(t, e, r) {
        (function(t) {
            var n = r(15),
                o = r(16);
            e.deconstructPacket = function(t) {
                function e(t) {
                    if (!t) return t;
                    if (o(t)) {
                        var i = {
                            _placeholder: !0,
                            num: r.length
                        };
                        return r.push(t), i
                    }
                    if (n(t)) {
                        for (var s = new Array(t.length), a = 0; a < t.length; a++) s[a] = e(t[a]);
                        return s
                    }
                    if ("object" == typeof t && !(t instanceof Date)) {
                        var s = {};
                        for (var c in t) s[c] = e(t[c]);
                        return s
                    }
                    return t
                }
                var r = [],
                    i = t.data,
                    s = t;
                return s.data = e(i), s.attachments = r.length, {
                    packet: s,
                    buffers: r
                }
            }, e.reconstructPacket = function(t, e) {
                function r(t) {
                    if (t && t._placeholder) {
                        var o = e[t.num];
                        return o
                    }
                    if (n(t)) {
                        for (var i = 0; i < t.length; i++) t[i] = r(t[i]);
                        return t
                    }
                    if (t && "object" == typeof t) {
                        for (var s in t) t[s] = r(t[s]);
                        return t
                    }
                    return t
                }
                return t.data = r(t.data), t.attachments = void 0, t
            }, e.removeBlobs = function(e, r) {
                function i(e, c, u) {
                    if (!e) return e;
                    if (t.Blob && e instanceof Blob || t.File && e instanceof File) {
                        s++;
                        var h = new FileReader;
                        h.onload = function() {
                            u ? u[c] = this.result : a = this.result, --s || r(a)
                        }, h.readAsArrayBuffer(e)
                    } else if (n(e))
                        for (var p = 0; p < e.length; p++) i(e[p], p, e);
                    else if (e && "object" == typeof e && !o(e))
                        for (var f in e) i(e[f], f, e)
                }
                var s = 0,
                    a = e;
                i(a), s || r(a)
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e) {
        t.exports = Array.isArray || function(t) {
            return "[object Array]" == Object.prototype.toString.call(t)
        }
    }, function(t, e) {
        (function(e) {
            function r(t) {
                return e.Buffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer
            }
            t.exports = r
        }).call(e, function() {
            return this
        }())
    }, function(t, e, r) {
        "use strict";

        function n(t, e) {
            return this instanceof n ? (t && "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t, t = void 0), e = e || {}, e.path = e.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = e, this.reconnection(e.reconnection !== !1), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), this.randomizationFactor(e.randomizationFactor || .5), this.backoff = new l({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor()
            }), this.timeout(null == e.timeout ? 2e4 : e.timeout), this.readyState = "closed", this.uri = t, this.connecting = [], this.lastPing = null, this.encoding = !1, this.packetBuffer = [], this.encoder = new c.Encoder, this.decoder = new c.Decoder, this.autoConnect = e.autoConnect !== !1, void(this.autoConnect && this.open())) : new n(t, e)
        }
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            },
            i = r(18),
            s = r(44),
            a = r(35),
            c = r(7),
            u = r(46),
            h = r(47),
            p = r(3)("socket.io-client:manager"),
            f = r(42),
            l = r(48),
            d = Object.prototype.hasOwnProperty;
        t.exports = n, n.prototype.emitAll = function() {
            this.emit.apply(this, arguments);
            for (var t in this.nsps) d.call(this.nsps, t) && this.nsps[t].emit.apply(this.nsps[t], arguments)
        }, n.prototype.updateSocketIds = function() {
            for (var t in this.nsps) d.call(this.nsps, t) && (this.nsps[t].id = this.engine.id)
        }, a(n.prototype), n.prototype.reconnection = function(t) {
            return arguments.length ? (this._reconnection = !!t, this) : this._reconnection
        }, n.prototype.reconnectionAttempts = function(t) {
            return arguments.length ? (this._reconnectionAttempts = t, this) : this._reconnectionAttempts
        }, n.prototype.reconnectionDelay = function(t) {
            return arguments.length ? (this._reconnectionDelay = t, this.backoff && this.backoff.setMin(t), this) : this._reconnectionDelay
        }, n.prototype.randomizationFactor = function(t) {
            return arguments.length ? (this._randomizationFactor = t, this.backoff && this.backoff.setJitter(t), this) : this._randomizationFactor
        }, n.prototype.reconnectionDelayMax = function(t) {
            return arguments.length ? (this._reconnectionDelayMax = t, this.backoff && this.backoff.setMax(t), this) : this._reconnectionDelayMax
        }, n.prototype.timeout = function(t) {
            return arguments.length ? (this._timeout = t, this) : this._timeout
        }, n.prototype.maybeReconnectOnOpen = function() {
            !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
        }, n.prototype.open = n.prototype.connect = function(t, e) {
            if (p("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
            p("opening %s", this.uri), this.engine = i(this.uri, this.opts);
            var r = this.engine,
                n = this;
            this.readyState = "opening", this.skipReconnect = !1;
            var o = u(r, "open", function() {
                    n.onopen(), t && t()
                }),
                s = u(r, "error", function(e) {
                    if (p("connect_error"), n.cleanup(), n.readyState = "closed", n.emitAll("connect_error", e), t) {
                        var r = new Error("Connection error");
                        r.data = e, t(r)
                    } else n.maybeReconnectOnOpen()
                });
            if (!1 !== this._timeout) {
                var a = this._timeout;
                p("connect attempt will timeout after %d", a);
                var c = setTimeout(function() {
                    p("connect attempt timed out after %d", a), o.destroy(), r.close(), r.emit("error", "timeout"), n.emitAll("connect_timeout", a)
                }, a);
                this.subs.push({
                    destroy: function() {
                        clearTimeout(c)
                    }
                })
            }
            return this.subs.push(o), this.subs.push(s), this
        }, n.prototype.onopen = function() {
            p("open"), this.cleanup(), this.readyState = "open", this.emit("open");
            var t = this.engine;
            this.subs.push(u(t, "data", h(this, "ondata"))), this.subs.push(u(t, "ping", h(this, "onping"))), this.subs.push(u(t, "pong", h(this, "onpong"))), this.subs.push(u(t, "error", h(this, "onerror"))), this.subs.push(u(t, "close", h(this, "onclose"))), this.subs.push(u(this.decoder, "decoded", h(this, "ondecoded")))
        }, n.prototype.onping = function() {
            this.lastPing = new Date, this.emitAll("ping")
        }, n.prototype.onpong = function() {
            this.emitAll("pong", new Date - this.lastPing)
        }, n.prototype.ondata = function(t) {
            this.decoder.add(t)
        }, n.prototype.ondecoded = function(t) {
            this.emit("packet", t)
        }, n.prototype.onerror = function(t) {
            p("error", t), this.emitAll("error", t)
        }, n.prototype.socket = function(t, e) {
            function r() {
                ~f(o.connecting, n) || o.connecting.push(n)
            }
            var n = this.nsps[t];
            if (!n) {
                n = new s(this, t, e), this.nsps[t] = n;
                var o = this;
                n.on("connecting", r), n.on("connect", function() {
                    n.id = o.engine.id
                }), this.autoConnect && r()
            }
            return n
        }, n.prototype.destroy = function(t) {
            var e = f(this.connecting, t);
            ~e && this.connecting.splice(e, 1), this.connecting.length || this.close()
        }, n.prototype.packet = function(t) {
            p("writing packet %j", t);
            var e = this;
            t.query && 0 === t.type && (t.nsp += "?" + t.query), e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0, this.encoder.encode(t, function(r) {
                for (var n = 0; n < r.length; n++) e.engine.write(r[n], t.options);
                e.encoding = !1, e.processPacketQueue()
            }))
        }, n.prototype.processPacketQueue = function() {
            if (this.packetBuffer.length > 0 && !this.encoding) {
                var t = this.packetBuffer.shift();
                this.packet(t)
            }
        }, n.prototype.cleanup = function() {
            p("cleanup");
            for (var t = this.subs.length, e = 0; e < t; e++) {
                var r = this.subs.shift();
                r.destroy()
            }
            this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy()
        }, n.prototype.close = n.prototype.disconnect = function() {
            p("disconnect"), this.skipReconnect = !0, this.reconnecting = !1, "opening" === this.readyState && this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close()
        }, n.prototype.onclose = function(t) {
            p("onclose"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", t), this._reconnection && !this.skipReconnect && this.reconnect()
        }, n.prototype.reconnect = function() {
            if (this.reconnecting || this.skipReconnect) return this;
            var t = this;
            if (this.backoff.attempts >= this._reconnectionAttempts) p("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1;
            else {
                var e = this.backoff.duration();
                p("will wait %dms before reconnect attempt", e), this.reconnecting = !0;
                var r = setTimeout(function() {
                    t.skipReconnect || (p("attempting reconnect"), t.emitAll("reconnect_attempt", t.backoff.attempts), t.emitAll("reconnecting", t.backoff.attempts), t.skipReconnect || t.open(function(e) {
                        e ? (p("reconnect attempt error"), t.reconnecting = !1, t.reconnect(), t.emitAll("reconnect_error", e.data)) : (p("reconnect success"), t.onreconnect())
                    }))
                }, e);
                this.subs.push({
                    destroy: function() {
                        clearTimeout(r)
                    }
                })
            }
        }, n.prototype.onreconnect = function() {
            var t = this.backoff.attempts;
            this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", t)
        }
    }, function(t, e, r) {
        t.exports = r(19)
    }, function(t, e, r) {
        t.exports = r(20), t.exports.parser = r(27)
    }, function(t, e, r) {
        (function(e) {
            function n(t, r) {
                if (!(this instanceof n)) return new n(t, r);
                r = r || {}, t && "object" == typeof t && (r = t, t = null), t ? (t = h(t), r.hostname = t.host, r.secure = "https" === t.protocol || "wss" === t.protocol, r.port = t.port, t.query && (r.query = t.query)) : r.host && (r.hostname = h(r.host).host), this.secure = null != r.secure ? r.secure : e.location && "https:" === location.protocol, r.hostname && !r.port && (r.port = this.secure ? "443" : "80"), this.agent = r.agent || !1, this.hostname = r.hostname || (e.location ? location.hostname : "localhost"), this.port = r.port || (e.location && location.port ? location.port : this.secure ? 443 : 80), this.query = r.query || {}, "string" == typeof this.query && (this.query = f.decode(this.query)), this.upgrade = !1 !== r.upgrade, this.path = (r.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!r.forceJSONP, this.jsonp = !1 !== r.jsonp, this.forceBase64 = !!r.forceBase64, this.enablesXDR = !!r.enablesXDR, this.timestampParam = r.timestampParam || "t", this.timestampRequests = r.timestampRequests, this.transports = r.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.prevBufferLen = 0, this.policyPort = r.policyPort || 843, this.rememberUpgrade = r.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = r.onlyBinaryUpgrades, this.perMessageDeflate = !1 !== r.perMessageDeflate && (r.perMessageDeflate || {}), !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), this.pfx = r.pfx || null, this.key = r.key || null, this.passphrase = r.passphrase || null, this.cert = r.cert || null, this.ca = r.ca || null, this.ciphers = r.ciphers || null, this.rejectUnauthorized = void 0 === r.rejectUnauthorized ? null : r.rejectUnauthorized, this.forceNode = !!r.forceNode;
                var o = "object" == typeof e && e;
                o.global === o && (r.extraHeaders && Object.keys(r.extraHeaders).length > 0 && (this.extraHeaders = r.extraHeaders), r.localAddress && (this.localAddress = r.localAddress)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingIntervalTimer = null, this.pingTimeoutTimer = null, this.open()
            }

            function o(t) {
                var e = {};
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
                return e
            }
            var i = r(21),
                s = r(35),
                a = r(3)("engine.io-client:socket"),
                c = r(42),
                u = r(27),
                h = r(2),
                p = r(43),
                f = r(36);
            t.exports = n, n.priorWebsocketSuccess = !1, s(n.prototype), n.protocol = u.protocol, n.Socket = n, n.Transport = r(26), n.transports = r(21), n.parser = r(27), n.prototype.createTransport = function(t) {
                a('creating transport "%s"', t);
                var e = o(this.query);
                e.EIO = u.protocol, e.transport = t, this.id && (e.sid = this.id);
                var r = new i[t]({
                    agent: this.agent,
                    hostname: this.hostname,
                    port: this.port,
                    secure: this.secure,
                    path: this.path,
                    query: e,
                    forceJSONP: this.forceJSONP,
                    jsonp: this.jsonp,
                    forceBase64: this.forceBase64,
                    enablesXDR: this.enablesXDR,
                    timestampRequests: this.timestampRequests,
                    timestampParam: this.timestampParam,
                    policyPort: this.policyPort,
                    socket: this,
                    pfx: this.pfx,
                    key: this.key,
                    passphrase: this.passphrase,
                    cert: this.cert,
                    ca: this.ca,
                    ciphers: this.ciphers,
                    rejectUnauthorized: this.rejectUnauthorized,
                    perMessageDeflate: this.perMessageDeflate,
                    extraHeaders: this.extraHeaders,
                    forceNode: this.forceNode,
                    localAddress: this.localAddress
                });
                return r
            }, n.prototype.open = function() {
                var t;
                if (this.rememberUpgrade && n.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1) t = "websocket";
                else {
                    if (0 === this.transports.length) {
                        var e = this;
                        return void setTimeout(function() {
                            e.emit("error", "No transports available")
                        }, 0)
                    }
                    t = this.transports[0]
                }
                this.readyState = "opening";
                try {
                    t = this.createTransport(t)
                } catch (t) {
                    return this.transports.shift(), void this.open()
                }
                t.open(), this.setTransport(t)
            }, n.prototype.setTransport = function(t) {
                a("setting transport %s", t.name);
                var e = this;
                this.transport && (a("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = t, t.on("drain", function() {
                    e.onDrain()
                }).on("packet", function(t) {
                    e.onPacket(t)
                }).on("error", function(t) {
                    e.onError(t)
                }).on("close", function() {
                    e.onClose("transport close")
                })
            }, n.prototype.probe = function(t) {
                function e() {
                    if (f.onlyBinaryUpgrades) {
                        var e = !this.supportsBinary && f.transport.supportsBinary;
                        p = p || e
                    }
                    p || (a('probe transport "%s" opened', t), h.send([{
                        type: "ping",
                        data: "probe"
                    }]), h.once("packet", function(e) {
                        if (!p)
                            if ("pong" === e.type && "probe" === e.data) {
                                if (a('probe transport "%s" pong', t), f.upgrading = !0, f.emit("upgrading", h), !h) return;
                                n.priorWebsocketSuccess = "websocket" === h.name, a('pausing current transport "%s"', f.transport.name), f.transport.pause(function() {
                                    p || "closed" !== f.readyState && (a("changing transport and sending upgrade packet"), u(), f.setTransport(h), h.send([{
                                        type: "upgrade"
                                    }]), f.emit("upgrade", h), h = null, f.upgrading = !1, f.flush())
                                })
                            } else {
                                a('probe transport "%s" failed', t);
                                var r = new Error("probe error");
                                r.transport = h.name, f.emit("upgradeError", r)
                            }
                    }))
                }

                function r() {
                    p || (p = !0, u(), h.close(), h = null)
                }

                function o(e) {
                    var n = new Error("probe error: " + e);
                    n.transport = h.name, r(), a('probe transport "%s" failed because of error: %s', t, e), f.emit("upgradeError", n)
                }

                function i() {
                    o("transport closed")
                }

                function s() {
                    o("socket closed")
                }

                function c(t) {
                    h && t.name !== h.name && (a('"%s" works - aborting "%s"', t.name, h.name), r())
                }

                function u() {
                    h.removeListener("open", e), h.removeListener("error", o), h.removeListener("close", i), f.removeListener("close", s), f.removeListener("upgrading", c)
                }
                a('probing transport "%s"', t);
                var h = this.createTransport(t, {
                        probe: 1
                    }),
                    p = !1,
                    f = this;
                n.priorWebsocketSuccess = !1, h.once("open", e), h.once("error", o), h.once("close", i), this.once("close", s), this.once("upgrading", c), h.open()
            }, n.prototype.onOpen = function() {
                if (a("socket open"), this.readyState = "open", n.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.upgrade && this.transport.pause) {
                    a("starting upgrade probes");
                    for (var t = 0, e = this.upgrades.length; t < e; t++) this.probe(this.upgrades[t])
                }
            }, n.prototype.onPacket = function(t) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (a('socket receive: type "%s", data "%s"', t.type, t.data), this.emit("packet", t), this.emit("heartbeat"), t.type) {
                    case "open":
                        this.onHandshake(p(t.data));
                        break;
                    case "pong":
                        this.setPing(), this.emit("pong");
                        break;
                    case "error":
                        var e = new Error("server error");
                        e.code = t.data, this.onError(e);
                        break;
                    case "message":
                        this.emit("data", t.data), this.emit("message", t.data)
                } else a('packet received with socket readyState "%s"', this.readyState)
            }, n.prototype.onHandshake = function(t) {
                this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), "closed" !== this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat))
            }, n.prototype.onHeartbeat = function(t) {
                clearTimeout(this.pingTimeoutTimer);
                var e = this;
                e.pingTimeoutTimer = setTimeout(function() {
                    "closed" !== e.readyState && e.onClose("ping timeout")
                }, t || e.pingInterval + e.pingTimeout)
            }, n.prototype.setPing = function() {
                var t = this;
                clearTimeout(t.pingIntervalTimer), t.pingIntervalTimer = setTimeout(function() {
                    a("writing ping packet - expecting pong within %sms", t.pingTimeout), t.ping(), t.onHeartbeat(t.pingTimeout)
                }, t.pingInterval)
            }, n.prototype.ping = function() {
                var t = this;
                this.sendPacket("ping", function() {
                    t.emit("ping")
                })
            }, n.prototype.onDrain = function() {
                this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush()
            }, n.prototype.flush = function() {
                "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
            }, n.prototype.write = n.prototype.send = function(t, e, r) {
                return this.sendPacket("message", t, e, r), this
            }, n.prototype.sendPacket = function(t, e, r, n) {
                if ("function" == typeof e && (n = e, e = void 0), "function" == typeof r && (n = r, r = null), "closing" !== this.readyState && "closed" !== this.readyState) {
                    r = r || {}, r.compress = !1 !== r.compress;
                    var o = {
                        type: t,
                        data: e,
                        options: r
                    };
                    this.emit("packetCreate", o), this.writeBuffer.push(o), n && this.once("flush", n), this.flush()
                }
            }, n.prototype.close = function() {
                function t() {
                    n.onClose("forced close"), a("socket closing - telling transport to close"), n.transport.close()
                }

                function e() {
                    n.removeListener("upgrade", e), n.removeListener("upgradeError", e), t()
                }

                function r() {
                    n.once("upgrade", e), n.once("upgradeError", e)
                }
                if ("opening" === this.readyState || "open" === this.readyState) {
                    this.readyState = "closing";
                    var n = this;
                    this.writeBuffer.length ? this.once("drain", function() {
                        this.upgrading ? r() : t()
                    }) : this.upgrading ? r() : t()
                }
                return this
            }, n.prototype.onError = function(t) {
                a("socket error %j", t), n.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t)
            }, n.prototype.onClose = function(t, e) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
                    a('socket close with reason: "%s"', t);
                    var r = this;
                    clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", t, e), r.writeBuffer = [], r.prevBufferLen = 0
                }
            }, n.prototype.filterUpgrades = function(t) {
                for (var e = [], r = 0, n = t.length; r < n; r++) ~c(this.transports, t[r]) && e.push(t[r]);
                return e
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e, r) {
        (function(t) {
            function n(e) {
                var r, n = !1,
                    a = !1,
                    c = !1 !== e.jsonp;
                if (t.location) {
                    var u = "https:" === location.protocol,
                        h = location.port;
                    h || (h = u ? 443 : 80), n = e.hostname !== location.hostname || h !== e.port, a = e.secure !== u
                }
                if (e.xdomain = n, e.xscheme = a, r = new o(e), "open" in r && !e.forceJSONP) return new i(e);
                if (!c) throw new Error("JSONP disabled");
                return new s(e)
            }
            var o = r(22),
                i = r(24),
                s = r(39),
                a = r(40);
            e.polling = n, e.websocket = a
        }).call(e, function() {
            return this
        }())
    }, function(t, e, r) {
        (function(e) {
            var n = r(23);
            t.exports = function(t) {
                var r = t.xdomain,
                    o = t.xscheme,
                    i = t.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!r || n)) return new XMLHttpRequest
                } catch (t) {}
                try {
                    if ("undefined" != typeof XDomainRequest && !o && i) return new XDomainRequest
                } catch (t) {}
                if (!r) try {
                    return new(e[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                } catch (t) {}
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e) {
        try {
            t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest
        } catch (e) {
            t.exports = !1
        }
    }, function(t, e, r) {
        (function(e) {
            function n() {}

            function o(t) {
                if (c.call(this, t), this.requestTimeout = t.requestTimeout, e.location) {
                    var r = "https:" === location.protocol,
                        n = location.port;
                    n || (n = r ? 443 : 80), this.xd = t.hostname !== e.location.hostname || n !== t.port, this.xs = t.secure !== r
                } else this.extraHeaders = t.extraHeaders
            }

            function i(t) {
                this.method = t.method || "GET", this.uri = t.uri, this.xd = !!t.xd, this.xs = !!t.xs, this.async = !1 !== t.async, this.data = void 0 !== t.data ? t.data : null, this.agent = t.agent, this.isBinary = t.isBinary, this.supportsBinary = t.supportsBinary, this.enablesXDR = t.enablesXDR, this.requestTimeout = t.requestTimeout, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.extraHeaders = t.extraHeaders, this.create()
            }

            function s() {
                for (var t in i.requests) i.requests.hasOwnProperty(t) && i.requests[t].abort()
            }
            var a = r(22),
                c = r(25),
                u = r(35),
                h = r(37),
                p = r(3)("engine.io-client:polling-xhr");
            t.exports = o, t.exports.Request = i, h(o, c), o.prototype.supportsBinary = !0, o.prototype.request = function(t) {
                return t = t || {}, t.uri = this.uri(), t.xd = this.xd, t.xs = this.xs, t.agent = this.agent || !1, t.supportsBinary = this.supportsBinary, t.enablesXDR = this.enablesXDR, t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, t.requestTimeout = this.requestTimeout, t.extraHeaders = this.extraHeaders, new i(t)
            }, o.prototype.doWrite = function(t, e) {
                var r = "string" != typeof t && void 0 !== t,
                    n = this.request({
                        method: "POST",
                        data: t,
                        isBinary: r
                    }),
                    o = this;
                n.on("success", e), n.on("error", function(t) {
                    o.onError("xhr post error", t)
                }), this.sendXhr = n
            }, o.prototype.doPoll = function() {
                p("xhr poll");
                var t = this.request(),
                    e = this;
                t.on("data", function(t) {
                    e.onData(t)
                }), t.on("error", function(t) {
                    e.onError("xhr poll error", t)
                }), this.pollXhr = t
            }, u(i.prototype), i.prototype.create = function() {
                var t = {
                    agent: this.agent,
                    xdomain: this.xd,
                    xscheme: this.xs,
                    enablesXDR: this.enablesXDR
                };
                t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized;
                var r = this.xhr = new a(t),
                    n = this;
                try {
                    p("xhr open %s: %s", this.method, this.uri), r.open(this.method, this.uri, this.async);
                    try {
                        if (this.extraHeaders) {
                            r.setDisableHeaderCheck(!0);
                            for (var o in this.extraHeaders) this.extraHeaders.hasOwnProperty(o) && r.setRequestHeader(o, this.extraHeaders[o])
                        }
                    } catch (t) {}
                    if (this.supportsBinary && (r.responseType = "arraybuffer"), "POST" === this.method) try {
                        this.isBinary ? r.setRequestHeader("Content-type", "application/octet-stream") : r.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                    } catch (t) {}
                    try {
                        r.setRequestHeader("Accept", "*/*")
                    } catch (t) {}
                    "withCredentials" in r && (r.withCredentials = !0), this.requestTimeout && (r.timeout = this.requestTimeout), this.hasXDR() ? (r.onload = function() {
                        n.onLoad()
                    }, r.onerror = function() {
                        n.onError(r.responseText)
                    }) : r.onreadystatechange = function() {
                        4 === r.readyState && (200 === r.status || 1223 === r.status ? n.onLoad() : setTimeout(function() {
                            n.onError(r.status)
                        }, 0))
                    }, p("xhr data %s", this.data), r.send(this.data)
                } catch (t) {
                    return void setTimeout(function() {
                        n.onError(t)
                    }, 0)
                }
                e.document && (this.index = i.requestsCount++, i.requests[this.index] = this)
            }, i.prototype.onSuccess = function() {
                this.emit("success"), this.cleanup()
            }, i.prototype.onData = function(t) {
                this.emit("data", t), this.onSuccess()
            }, i.prototype.onError = function(t) {
                this.emit("error", t), this.cleanup(!0)
            }, i.prototype.cleanup = function(t) {
                if ("undefined" != typeof this.xhr && null !== this.xhr) {
                    if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = n : this.xhr.onreadystatechange = n, t) try {
                        this.xhr.abort()
                    } catch (t) {}
                    e.document && delete i.requests[this.index], this.xhr = null
                }
            }, i.prototype.onLoad = function() {
                var t;
                try {
                    var e;
                    try {
                        e = this.xhr.getResponseHeader("Content-Type").split(";")[0]
                    } catch (t) {}
                    if ("application/octet-stream" === e) t = this.xhr.response || this.xhr.responseText;
                    else if (this.supportsBinary) try {
                        t = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response))
                    } catch (e) {
                        for (var r = new Uint8Array(this.xhr.response), n = [], o = 0, i = r.length; o < i; o++) n.push(r[o]);
                        t = String.fromCharCode.apply(null, n)
                    } else t = this.xhr.responseText
                } catch (t) {
                    this.onError(t)
                }
                null != t && this.onData(t)
            }, i.prototype.hasXDR = function() {
                return "undefined" != typeof e.XDomainRequest && !this.xs && this.enablesXDR
            }, i.prototype.abort = function() {
                this.cleanup()
            }, i.requestsCount = 0, i.requests = {}, e.document && (e.attachEvent ? e.attachEvent("onunload", s) : e.addEventListener && e.addEventListener("beforeunload", s, !1))
        }).call(e, function() {
            return this
        }())
    }, function(t, e, r) {
        function n(t) {
            var e = t && t.forceBase64;
            h && !e || (this.supportsBinary = !1), o.call(this, t)
        }
        var o = r(26),
            i = r(36),
            s = r(27),
            a = r(37),
            c = r(38),
            u = r(3)("engine.io-client:polling");
        t.exports = n;
        var h = function() {
            var t = r(22),
                e = new t({
                    xdomain: !1
                });
            return null != e.responseType
        }();
        a(n, o), n.prototype.name = "polling", n.prototype.doOpen = function() {
            this.poll()
        }, n.prototype.pause = function(t) {
            function e() {
                u("paused"), r.readyState = "paused", t()
            }
            var r = this;
            if (this.readyState = "pausing", this.polling || !this.writable) {
                var n = 0;
                this.polling && (u("we are currently polling - waiting to pause"), n++, this.once("pollComplete", function() {
                    u("pre-pause polling complete"), --n || e()
                })), this.writable || (u("we are currently writing - waiting to pause"), n++, this.once("drain", function() {
                    u("pre-pause writing complete"), --n || e()
                }))
            } else e()
        }, n.prototype.poll = function() {
            u("polling"), this.polling = !0, this.doPoll(), this.emit("poll")
        }, n.prototype.onData = function(t) {
            var e = this;
            u("polling got data %s", t);
            var r = function(t, r, n) {
                return "opening" === e.readyState && e.onOpen(), "close" === t.type ? (e.onClose(), !1) : void e.onPacket(t)
            };
            s.decodePayload(t, this.socket.binaryType, r), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState ? this.poll() : u('ignoring poll - transport state "%s"', this.readyState))
        }, n.prototype.doClose = function() {
            function t() {
                u("writing close packet"), e.write([{
                    type: "close"
                }])
            }
            var e = this;
            "open" === this.readyState ? (u("transport open - closing"), t()) : (u("transport not open - deferring close"), this.once("open", t))
        }, n.prototype.write = function(t) {
            var e = this;
            this.writable = !1;
            var r = function() {
                e.writable = !0, e.emit("drain")
            };
            s.encodePayload(t, this.supportsBinary, function(t) {
                e.doWrite(t, r)
            })
        }, n.prototype.uri = function() {
            var t = this.query || {},
                e = this.secure ? "https" : "http",
                r = "";
            !1 !== this.timestampRequests && (t[this.timestampParam] = c()), this.supportsBinary || t.sid || (t.b64 = 1), t = i.encode(t), this.port && ("https" === e && 443 !== Number(this.port) || "http" === e && 80 !== Number(this.port)) && (r = ":" + this.port), t.length && (t = "?" + t);
            var n = this.hostname.indexOf(":") !== -1;
            return e + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t
        }
    }, function(t, e, r) {
        function n(t) {
            this.path = t.path, this.hostname = t.hostname, this.port = t.port, this.secure = t.secure, this.query = t.query, this.timestampParam = t.timestampParam, this.timestampRequests = t.timestampRequests, this.readyState = "", this.agent = t.agent || !1, this.socket = t.socket, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.forceNode = t.forceNode, this.extraHeaders = t.extraHeaders, this.localAddress = t.localAddress
        }
        var o = r(27),
            i = r(35);
        t.exports = n, i(n.prototype), n.prototype.onError = function(t, e) {
            var r = new Error(t);
            return r.type = "TransportError", r.description = e, this.emit("error", r), this
        }, n.prototype.open = function() {
            return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this
        }, n.prototype.close = function() {
            return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this
        }, n.prototype.send = function(t) {
            if ("open" !== this.readyState) throw new Error("Transport not open");
            this.write(t)
        }, n.prototype.onOpen = function() {
            this.readyState = "open", this.writable = !0, this.emit("open")
        }, n.prototype.onData = function(t) {
            var e = o.decodePacket(t, this.socket.binaryType);
            this.onPacket(e)
        }, n.prototype.onPacket = function(t) {
            this.emit("packet", t)
        }, n.prototype.onClose = function() {
            this.readyState = "closed", this.emit("close")
        }
    }, function(t, e, r) {
        (function(t) {
            function n(t, r) {
                var n = "b" + e.packets[t.type] + t.data.data;
                return r(n)
            }

            function o(t, r, n) {
                if (!r) return e.encodeBase64Packet(t, n);
                var o = t.data,
                    i = new Uint8Array(o),
                    s = new Uint8Array(1 + o.byteLength);
                s[0] = v[t.type];
                for (var a = 0; a < i.length; a++) s[a + 1] = i[a];
                return n(s.buffer)
            }

            function i(t, r, n) {
                if (!r) return e.encodeBase64Packet(t, n);
                var o = new FileReader;
                return o.onload = function() {
                    t.data = o.result, e.encodePacket(t, r, !0, n)
                }, o.readAsArrayBuffer(t.data)
            }

            function s(t, r, n) {
                if (!r) return e.encodeBase64Packet(t, n);
                if (m) return i(t, r, n);
                var o = new Uint8Array(1);
                o[0] = v[t.type];
                var s = new k([o.buffer, t.data]);
                return n(s)
            }

            function a(t) {
                try {
                    t = d.decode(t)
                } catch (t) {
                    return !1
                }
                return t
            }

            function c(t, e, r) {
                for (var n = new Array(t.length), o = l(t.length, r), i = function(t, r, o) {
                        e(r, function(e, r) {
                            n[t] = r, o(e, n)
                        })
                    }, s = 0; s < t.length; s++) i(s, t[s], o)
            }
            var u, h = r(28),
                p = r(29),
                f = r(30),
                l = r(31),
                d = r(32);
            t && t.ArrayBuffer && (u = r(33));
            var y = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent),
                g = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent),
                m = y || g;
            e.protocol = 3;
            var v = e.packets = {
                    open: 0,
                    close: 1,
                    ping: 2,
                    pong: 3,
                    message: 4,
                    upgrade: 5,
                    noop: 6
                },
                b = h(v),
                w = {
                    type: "error",
                    data: "parser error"
                },
                k = r(34);
            e.encodePacket = function(e, r, i, a) {
                "function" == typeof r && (a = r, r = !1), "function" == typeof i && (a = i, i = null);
                var c = void 0 === e.data ? void 0 : e.data.buffer || e.data;
                if (t.ArrayBuffer && c instanceof ArrayBuffer) return o(e, r, a);
                if (k && c instanceof t.Blob) return s(e, r, a);
                if (c && c.base64) return n(e, a);
                var u = v[e.type];
                return void 0 !== e.data && (u += i ? d.encode(String(e.data)) : String(e.data)), a("" + u)
            }, e.encodeBase64Packet = function(r, n) {
                var o = "b" + e.packets[r.type];
                if (k && r.data instanceof t.Blob) {
                    var i = new FileReader;
                    return i.onload = function() {
                        var t = i.result.split(",")[1];
                        n(o + t)
                    }, i.readAsDataURL(r.data)
                }
                var s;
                try {
                    s = String.fromCharCode.apply(null, new Uint8Array(r.data))
                } catch (t) {
                    for (var a = new Uint8Array(r.data), c = new Array(a.length), u = 0; u < a.length; u++) c[u] = a[u];
                    s = String.fromCharCode.apply(null, c)
                }
                return o += t.btoa(s), n(o)
            }, e.decodePacket = function(t, r, n) {
                if (void 0 === t) return w;
                if ("string" == typeof t) {
                    if ("b" == t.charAt(0)) return e.decodeBase64Packet(t.substr(1), r);
                    if (n && (t = a(t), t === !1)) return w;
                    var o = t.charAt(0);
                    return Number(o) == o && b[o] ? t.length > 1 ? {
                        type: b[o],
                        data: t.substring(1)
                    } : {
                        type: b[o]
                    } : w
                }
                var i = new Uint8Array(t),
                    o = i[0],
                    s = f(t, 1);
                return k && "blob" === r && (s = new k([s])), {
                    type: b[o],
                    data: s
                }
            }, e.decodeBase64Packet = function(t, e) {
                var r = b[t.charAt(0)];
                if (!u) return {
                    type: r,
                    data: {
                        base64: !0,
                        data: t.substr(1)
                    }
                };
                var n = u.decode(t.substr(1));
                return "blob" === e && k && (n = new k([n])), {
                    type: r,
                    data: n
                }
            }, e.encodePayload = function(t, r, n) {
                function o(t) {
                    return t.length + ":" + t
                }

                function i(t, n) {
                    e.encodePacket(t, !!s && r, !0, function(t) {
                        n(null, o(t))
                    })
                }
                "function" == typeof r && (n = r, r = null);
                var s = p(t);
                return r && s ? k && !m ? e.encodePayloadAsBlob(t, n) : e.encodePayloadAsArrayBuffer(t, n) : t.length ? void c(t, i, function(t, e) {
                    return n(e.join(""))
                }) : n("0:")
            }, e.decodePayload = function(t, r, n) {
                if ("string" != typeof t) return e.decodePayloadAsBinary(t, r, n);
                "function" == typeof r && (n = r, r = null);
                var o;
                if ("" == t) return n(w, 0, 1);
                for (var i, s, a = "", c = 0, u = t.length; c < u; c++) {
                    var h = t.charAt(c);
                    if (":" != h) a += h;
                    else {
                        if ("" == a || a != (i = Number(a))) return n(w, 0, 1);
                        if (s = t.substr(c + 1, i), a != s.length) return n(w, 0, 1);
                        if (s.length) {
                            if (o = e.decodePacket(s, r, !0), w.type == o.type && w.data == o.data) return n(w, 0, 1);
                            var p = n(o, c + i, u);
                            if (!1 === p) return
                        }
                        c += i, a = ""
                    }
                }
                return "" != a ? n(w, 0, 1) : void 0
            }, e.encodePayloadAsArrayBuffer = function(t, r) {
                function n(t, r) {
                    e.encodePacket(t, !0, !0, function(t) {
                        return r(null, t)
                    })
                }
                return t.length ? void c(t, n, function(t, e) {
                    var n = e.reduce(function(t, e) {
                            var r;
                            return r = "string" == typeof e ? e.length : e.byteLength, t + r.toString().length + r + 2
                        }, 0),
                        o = new Uint8Array(n),
                        i = 0;
                    return e.forEach(function(t) {
                        var e = "string" == typeof t,
                            r = t;
                        if (e) {
                            for (var n = new Uint8Array(t.length), s = 0; s < t.length; s++) n[s] = t.charCodeAt(s);
                            r = n.buffer
                        }
                        e ? o[i++] = 0 : o[i++] = 1;
                        for (var a = r.byteLength.toString(), s = 0; s < a.length; s++) o[i++] = parseInt(a[s]);
                        o[i++] = 255;
                        for (var n = new Uint8Array(r), s = 0; s < n.length; s++) o[i++] = n[s]
                    }), r(o.buffer)
                }) : r(new ArrayBuffer(0))
            }, e.encodePayloadAsBlob = function(t, r) {
                function n(t, r) {
                    e.encodePacket(t, !0, !0, function(t) {
                        var e = new Uint8Array(1);
                        if (e[0] = 1, "string" == typeof t) {
                            for (var n = new Uint8Array(t.length), o = 0; o < t.length; o++) n[o] = t.charCodeAt(o);
                            t = n.buffer, e[0] = 0
                        }
                        for (var i = t instanceof ArrayBuffer ? t.byteLength : t.size, s = i.toString(), a = new Uint8Array(s.length + 1), o = 0; o < s.length; o++) a[o] = parseInt(s[o]);
                        if (a[s.length] = 255, k) {
                            var c = new k([e.buffer, a.buffer, t]);
                            r(null, c)
                        }
                    })
                }
                c(t, n, function(t, e) {
                    return r(new k(e))
                })
            }, e.decodePayloadAsBinary = function(t, r, n) {
                "function" == typeof r && (n = r, r = null);
                for (var o = t, i = [], s = !1; o.byteLength > 0;) {
                    for (var a = new Uint8Array(o), c = 0 === a[0], u = "", h = 1; 255 != a[h]; h++) {
                        if (u.length > 310) {
                            s = !0;
                            break
                        }
                        u += a[h]
                    }
                    if (s) return n(w, 0, 1);
                    o = f(o, 2 + u.length), u = parseInt(u);
                    var p = f(o, 0, u);
                    if (c) try {
                        p = String.fromCharCode.apply(null, new Uint8Array(p))
                    } catch (t) {
                        var l = new Uint8Array(p);
                        p = "";
                        for (var h = 0; h < l.length; h++) p += String.fromCharCode(l[h])
                    }
                    i.push(p), o = f(o, u)
                }
                var d = i.length;
                i.forEach(function(t, o) {
                    n(e.decodePacket(t, r, !0), o, d)
                })
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e) {
        t.exports = Object.keys || function(t) {
            var e = [],
                r = Object.prototype.hasOwnProperty;
            for (var n in t) r.call(t, n) && e.push(n);
            return e
        }
    }, function(t, e, r) {
        (function(e) {
            function n(t) {
                function r(t) {
                    if (!t) return !1;
                    if (e.Buffer && e.Buffer.isBuffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer || e.Blob && t instanceof Blob || e.File && t instanceof File) return !0;
                    if (o(t)) {
                        for (var n = 0; n < t.length; n++)
                            if (r(t[n])) return !0
                    } else if (t && "object" == typeof t) {
                        t.toJSON && "function" == typeof t.toJSON && (t = t.toJSON());
                        for (var i in t)
                            if (Object.prototype.hasOwnProperty.call(t, i) && r(t[i])) return !0
                    }
                    return !1
                }
                return r(t)
            }
            var o = r(15);
            t.exports = n
        }).call(e, function() {
            return this
        }())
    }, function(t, e) {
        t.exports = function(t, e, r) {
            var n = t.byteLength;
            if (e = e || 0, r = r || n, t.slice) return t.slice(e, r);
            if (e < 0 && (e += n), r < 0 && (r += n), r > n && (r = n), e >= n || e >= r || 0 === n) return new ArrayBuffer(0);
            for (var o = new Uint8Array(t), i = new Uint8Array(r - e), s = e, a = 0; s < r; s++, a++) i[a] = o[s];
            return i.buffer
        }
    }, function(t, e) {
        function r(t, e, r) {
            function o(t, n) {
                if (o.count <= 0) throw new Error("after called too many times");
                --o.count, t ? (i = !0, e(t), e = r) : 0 !== o.count || i || e(null, n)
            }
            var i = !1;
            return r = r || n, o.count = t, 0 === t ? e() : o
        }

        function n() {}
        t.exports = r
    }, function(t, e, r) {
        var n;
        (function(t, o) {
            ! function(i) {
                function s(t) {
                    for (var e, r, n = [], o = 0, i = t.length; o < i;) e = t.charCodeAt(o++), e >= 55296 && e <= 56319 && o < i ? (r = t.charCodeAt(o++), 56320 == (64512 & r) ? n.push(((1023 & e) << 10) + (1023 & r) + 65536) : (n.push(e), o--)) : n.push(e);
                    return n
                }

                function a(t) {
                    for (var e, r = t.length, n = -1, o = ""; ++n < r;) e = t[n], e > 65535 && (e -= 65536, o += b(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), o += b(e);
                    return o
                }

                function c(t, e) {
                    return b(t >> e & 63 | 128)
                }

                function u(t) {
                    if (0 == (4294967168 & t)) return b(t);
                    var e = "";
                    return 0 == (4294965248 & t) ? e = b(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (e = b(t >> 12 & 15 | 224), e += c(t, 6)) : 0 == (4292870144 & t) && (e = b(t >> 18 & 7 | 240), e += c(t, 12), e += c(t, 6)), e += b(63 & t | 128)
                }

                function h(t) {
                    for (var e, r = s(t), n = r.length, o = -1, i = ""; ++o < n;) e = r[o], i += u(e);
                    return i
                }

                function p() {
                    if (v >= m) throw Error("Invalid byte index");
                    var t = 255 & g[v];
                    if (v++, 128 == (192 & t)) return 63 & t;
                    throw Error("Invalid continuation byte")
                }

                function f() {
                    var t, e, r, n, o;
                    if (v > m) throw Error("Invalid byte index");
                    if (v == m) return !1;
                    if (t = 255 & g[v], v++, 0 == (128 & t)) return t;
                    if (192 == (224 & t)) {
                        var e = p();
                        if (o = (31 & t) << 6 | e, o >= 128) return o;
                        throw Error("Invalid continuation byte")
                    }
                    if (224 == (240 & t)) {
                        if (e = p(), r = p(), o = (15 & t) << 12 | e << 6 | r, o >= 2048) return o;
                        throw Error("Invalid continuation byte")
                    }
                    if (240 == (248 & t) && (e = p(), r = p(), n = p(), o = (15 & t) << 18 | e << 12 | r << 6 | n, o >= 65536 && o <= 1114111)) return o;
                    throw Error("Invalid WTF-8 detected")
                }

                function l(t) {
                    g = s(t), m = g.length, v = 0;
                    for (var e, r = [];
                        (e = f()) !== !1;) r.push(e);
                    return a(r)
                }
                var d = "object" == typeof e && e,
                    y = ("object" == typeof t && t && t.exports == d && t, "object" == typeof o && o);
                y.global !== y && y.window !== y || (i = y);
                var g, m, v, b = String.fromCharCode,
                    w = {
                        version: "1.0.0",
                        encode: h,
                        decode: l
                    };
                n = function() {
                    return w
                }.call(e, r, e, t), !(void 0 !== n && (t.exports = n))
            }(this)
        }).call(e, r(12)(t), function() {
            return this
        }())
    }, function(t, e) {
        ! function() {
            "use strict";
            for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = new Uint8Array(256), n = 0; n < t.length; n++) r[t.charCodeAt(n)] = n;
            e.encode = function(e) {
                var r, n = new Uint8Array(e),
                    o = n.length,
                    i = "";
                for (r = 0; r < o; r += 3) i += t[n[r] >> 2], i += t[(3 & n[r]) << 4 | n[r + 1] >> 4], i += t[(15 & n[r + 1]) << 2 | n[r + 2] >> 6], i += t[63 & n[r + 2]];
                return o % 3 === 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 === 1 && (i = i.substring(0, i.length - 2) + "=="), i
            }, e.decode = function(t) {
                var e, n, o, i, s, a = .75 * t.length,
                    c = t.length,
                    u = 0;
                "=" === t[t.length - 1] && (a--, "=" === t[t.length - 2] && a--);
                var h = new ArrayBuffer(a),
                    p = new Uint8Array(h);
                for (e = 0; e < c; e += 4) n = r[t.charCodeAt(e)], o = r[t.charCodeAt(e + 1)], i = r[t.charCodeAt(e + 2)], s = r[t.charCodeAt(e + 3)], p[u++] = n << 2 | o >> 4, p[u++] = (15 & o) << 4 | i >> 2, p[u++] = (3 & i) << 6 | 63 & s;
                return h
            }
        }()
    }, function(t, e) {
        (function(e) {
            function r(t) {
                for (var e = 0; e < t.length; e++) {
                    var r = t[e];
                    if (r.buffer instanceof ArrayBuffer) {
                        var n = r.buffer;
                        if (r.byteLength !== n.byteLength) {
                            var o = new Uint8Array(r.byteLength);
                            o.set(new Uint8Array(n, r.byteOffset, r.byteLength)), n = o.buffer
                        }
                        t[e] = n
                    }
                }
            }

            function n(t, e) {
                e = e || {};
                var n = new i;
                r(t);
                for (var o = 0; o < t.length; o++) n.append(t[o]);
                return e.type ? n.getBlob(e.type) : n.getBlob()
            }

            function o(t, e) {
                return r(t), new Blob(t, e || {})
            }
            var i = e.BlobBuilder || e.WebKitBlobBuilder || e.MSBlobBuilder || e.MozBlobBuilder,
                s = function() {
                    try {
                        var t = new Blob(["hi"]);
                        return 2 === t.size
                    } catch (t) {
                        return !1
                    }
                }(),
                a = s && function() {
                    try {
                        var t = new Blob([new Uint8Array([1, 2])]);
                        return 2 === t.size
                    } catch (t) {
                        return !1
                    }
                }(),
                c = i && i.prototype.append && i.prototype.getBlob;
            t.exports = function() {
                return s ? a ? e.Blob : o : c ? n : void 0
            }()
        }).call(e, function() {
            return this
        }())
    }, function(t, e, r) {
        function n(t) {
            if (t) return o(t)
        }

        function o(t) {
            for (var e in n.prototype) t[e] = n.prototype[e];
            return t
        }
        t.exports = n, n.prototype.on = n.prototype.addEventListener = function(t, e) {
            return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this
        }, n.prototype.once = function(t, e) {
            function r() {
                this.off(t, r), e.apply(this, arguments)
            }
            return r.fn = e, this.on(t, r), this
        }, n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function(t, e) {
            if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
            var r = this._callbacks["$" + t];
            if (!r) return this;
            if (1 == arguments.length) return delete this._callbacks["$" + t], this;
            for (var n, o = 0; o < r.length; o++)
                if (n = r[o], n === e || n.fn === e) {
                    r.splice(o, 1);
                    break
                } return this
        }, n.prototype.emit = function(t) {
            this._callbacks = this._callbacks || {};
            var e = [].slice.call(arguments, 1),
                r = this._callbacks["$" + t];
            if (r) {
                r = r.slice(0);
                for (var n = 0, o = r.length; n < o; ++n) r[n].apply(this, e)
            }
            return this
        }, n.prototype.listeners = function(t) {
            return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || []
        }, n.prototype.hasListeners = function(t) {
            return !!this.listeners(t).length
        }
    }, function(t, e) {
        e.encode = function(t) {
            var e = "";
            for (var r in t) t.hasOwnProperty(r) && (e.length && (e += "&"), e += encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
            return e
        }, e.decode = function(t) {
            for (var e = {}, r = t.split("&"), n = 0, o = r.length; n < o; n++) {
                var i = r[n].split("=");
                e[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
            }
            return e
        }
    }, function(t, e) {
        t.exports = function(t, e) {
            var r = function() {};
            r.prototype = e.prototype, t.prototype = new r, t.prototype.constructor = t
        }
    }, function(t, e) {
        "use strict";

        function r(t) {
            var e = "";
            do e = s[t % a] + e, t = Math.floor(t / a); while (t > 0);
            return e
        }

        function n(t) {
            var e = 0;
            for (h = 0; h < t.length; h++) e = e * a + c[t.charAt(h)];
            return e
        }

        function o() {
            var t = r(+new Date);
            return t !== i ? (u = 0, i = t) : t + "." + r(u++)
        }
        for (var i, s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), a = 64, c = {}, u = 0, h = 0; h < a; h++) c[s[h]] = h;
        o.encode = r, o.decode = n, t.exports = o
    }, function(t, e, r) {
        (function(e) {
            function n() {}

            function o(t) {
                i.call(this, t), this.query = this.query || {}, a || (e.___eio || (e.___eio = []), a = e.___eio), this.index = a.length;
                var r = this;
                a.push(function(t) {
                    r.onData(t)
                }), this.query.j = this.index, e.document && e.addEventListener && e.addEventListener("beforeunload", function() {
                    r.script && (r.script.onerror = n)
                }, !1)
            }
            var i = r(25),
                s = r(37);
            t.exports = o;
            var a, c = /\n/g,
                u = /\\n/g;
            s(o, i), o.prototype.supportsBinary = !1, o.prototype.doClose = function() {
                this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), i.prototype.doClose.call(this)
            }, o.prototype.doPoll = function() {
                var t = this,
                    e = document.createElement("script");
                this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function(e) {
                    t.onError("jsonp poll error", e)
                };
                var r = document.getElementsByTagName("script")[0];
                r ? r.parentNode.insertBefore(e, r) : (document.head || document.body).appendChild(e), this.script = e;
                var n = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                n && setTimeout(function() {
                    var t = document.createElement("iframe");
                    document.body.appendChild(t), document.body.removeChild(t)
                }, 100)
            }, o.prototype.doWrite = function(t, e) {
                function r() {
                    n(), e()
                }

                function n() {
                    if (o.iframe) try {
                        o.form.removeChild(o.iframe)
                    } catch (t) {
                        o.onError("jsonp polling iframe removal error", t)
                    }
                    try {
                        var t = '<iframe src="javascript:0" name="' + o.iframeId + '">';
                        i = document.createElement(t)
                    } catch (t) {
                        i = document.createElement("iframe"), i.name = o.iframeId, i.src = "javascript:0"
                    }
                    i.id = o.iframeId, o.form.appendChild(i), o.iframe = i
                }
                var o = this;
                if (!this.form) {
                    var i, s = document.createElement("form"),
                        a = document.createElement("textarea"),
                        h = this.iframeId = "eio_iframe_" + this.index;
                    s.className = "socketio", s.style.position = "absolute", s.style.top = "-1000px", s.style.left = "-1000px", s.target = h, s.method = "POST", s.setAttribute("accept-charset", "utf-8"), a.name = "d", s.appendChild(a), document.body.appendChild(s), this.form = s, this.area = a
                }
                this.form.action = this.uri(), n(), t = t.replace(u, "\\\n"), this.area.value = t.replace(c, "\\n");
                try {
                    this.form.submit()
                } catch (t) {}
                this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                    "complete" === o.iframe.readyState && r();
                } : this.iframe.onload = r
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e, r) {
        (function(e) {
            function n(t) {
                var e = t && t.forceBase64;
                e && (this.supportsBinary = !1), this.perMessageDeflate = t.perMessageDeflate, this.usingBrowserWebSocket = p && !t.forceNode, this.usingBrowserWebSocket || (f = o), i.call(this, t)
            }
            var o, i = r(26),
                s = r(27),
                a = r(36),
                c = r(37),
                u = r(38),
                h = r(3)("engine.io-client:websocket"),
                p = e.WebSocket || e.MozWebSocket;
            if ("undefined" == typeof window) try {
                o = r(41)
            } catch (t) {}
            var f = p;
            f || "undefined" != typeof window || (f = o), t.exports = n, c(n, i), n.prototype.name = "websocket", n.prototype.supportsBinary = !0, n.prototype.doOpen = function() {
                if (this.check()) {
                    var t = this.uri(),
                        e = void 0,
                        r = {
                            agent: this.agent,
                            perMessageDeflate: this.perMessageDeflate
                        };
                    r.pfx = this.pfx, r.key = this.key, r.passphrase = this.passphrase, r.cert = this.cert, r.ca = this.ca, r.ciphers = this.ciphers, r.rejectUnauthorized = this.rejectUnauthorized, this.extraHeaders && (r.headers = this.extraHeaders), this.localAddress && (r.localAddress = this.localAddress);
                    try {
                        this.ws = this.usingBrowserWebSocket ? new f(t) : new f(t, e, r)
                    } catch (t) {
                        return this.emit("error", t)
                    }
                    void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners()
                }
            }, n.prototype.addEventListeners = function() {
                var t = this;
                this.ws.onopen = function() {
                    t.onOpen()
                }, this.ws.onclose = function() {
                    t.onClose()
                }, this.ws.onmessage = function(e) {
                    t.onData(e.data)
                }, this.ws.onerror = function(e) {
                    t.onError("websocket error", e)
                }
            }, n.prototype.write = function(t) {
                function r() {
                    n.emit("flush"), setTimeout(function() {
                        n.writable = !0, n.emit("drain")
                    }, 0)
                }
                var n = this;
                this.writable = !1;
                for (var o = t.length, i = 0, a = o; i < a; i++) ! function(t) {
                    s.encodePacket(t, n.supportsBinary, function(i) {
                        if (!n.usingBrowserWebSocket) {
                            var s = {};
                            if (t.options && (s.compress = t.options.compress), n.perMessageDeflate) {
                                var a = "string" == typeof i ? e.Buffer.byteLength(i) : i.length;
                                a < n.perMessageDeflate.threshold && (s.compress = !1)
                            }
                        }
                        try {
                            n.usingBrowserWebSocket ? n.ws.send(i) : n.ws.send(i, s)
                        } catch (t) {
                            h("websocket closed before onclose event")
                        }--o || r()
                    })
                }(t[i])
            }, n.prototype.onClose = function() {
                i.prototype.onClose.call(this)
            }, n.prototype.doClose = function() {
                "undefined" != typeof this.ws && this.ws.close()
            }, n.prototype.uri = function() {
                var t = this.query || {},
                    e = this.secure ? "wss" : "ws",
                    r = "";
                this.port && ("wss" === e && 443 !== Number(this.port) || "ws" === e && 80 !== Number(this.port)) && (r = ":" + this.port), this.timestampRequests && (t[this.timestampParam] = u()), this.supportsBinary || (t.b64 = 1), t = a.encode(t), t.length && (t = "?" + t);
                var n = this.hostname.indexOf(":") !== -1;
                return e + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t
            }, n.prototype.check = function() {
                return !(!f || "__initialize" in f && this.name === n.prototype.name)
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e) {}, function(t, e) {
        var r = [].indexOf;
        t.exports = function(t, e) {
            if (r) return t.indexOf(e);
            for (var n = 0; n < t.length; ++n)
                if (t[n] === e) return n;
            return -1
        }
    }, function(t, e) {
        (function(e) {
            var r = /^[\],:{}\s]*$/,
                n = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                o = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                i = /(?:^|:|,)(?:\s*\[)+/g,
                s = /^\s+/,
                a = /\s+$/;
            t.exports = function(t) {
                return "string" == typeof t && t ? (t = t.replace(s, "").replace(a, ""), e.JSON && JSON.parse ? JSON.parse(t) : r.test(t.replace(n, "@").replace(o, "]").replace(i, "")) ? new Function("return " + t)() : void 0) : null
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e, r) {
        "use strict";

        function n(t, e, r) {
            this.io = t, this.nsp = e, this.json = this, this.ids = 0, this.acks = {}, this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0, r && r.query && (this.query = r.query), this.io.autoConnect && this.open()
        }
        var o = r(7),
            i = r(35),
            s = r(45),
            a = r(46),
            c = r(47),
            u = r(3)("socket.io-client:socket"),
            h = r(29);
        t.exports = e = n;
        var p = {
                connect: 1,
                connect_error: 1,
                connect_timeout: 1,
                connecting: 1,
                disconnect: 1,
                error: 1,
                reconnect: 1,
                reconnect_attempt: 1,
                reconnect_failed: 1,
                reconnect_error: 1,
                reconnecting: 1,
                ping: 1,
                pong: 1
            },
            f = i.prototype.emit;
        i(n.prototype), n.prototype.subEvents = function() {
            if (!this.subs) {
                var t = this.io;
                this.subs = [a(t, "open", c(this, "onopen")), a(t, "packet", c(this, "onpacket")), a(t, "close", c(this, "onclose"))]
            }
        }, n.prototype.open = n.prototype.connect = function() {
            return this.connected ? this : (this.subEvents(), this.io.open(), "open" === this.io.readyState && this.onopen(), this.emit("connecting"), this)
        }, n.prototype.send = function() {
            var t = s(arguments);
            return t.unshift("message"), this.emit.apply(this, t), this
        }, n.prototype.emit = function(t) {
            if (p.hasOwnProperty(t)) return f.apply(this, arguments), this;
            var e = s(arguments),
                r = o.EVENT;
            h(e) && (r = o.BINARY_EVENT);
            var n = {
                type: r,
                data: e
            };
            return n.options = {}, n.options.compress = !this.flags || !1 !== this.flags.compress, "function" == typeof e[e.length - 1] && (u("emitting packet with ack id %d", this.ids), this.acks[this.ids] = e.pop(), n.id = this.ids++), this.connected ? this.packet(n) : this.sendBuffer.push(n), delete this.flags, this
        }, n.prototype.packet = function(t) {
            t.nsp = this.nsp, this.io.packet(t)
        }, n.prototype.onopen = function() {
            u("transport is open - connecting"), "/" !== this.nsp && (this.query ? this.packet({
                type: o.CONNECT,
                query: this.query
            }) : this.packet({
                type: o.CONNECT
            }))
        }, n.prototype.onclose = function(t) {
            u("close (%s)", t), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", t)
        }, n.prototype.onpacket = function(t) {
            if (t.nsp === this.nsp) switch (t.type) {
                case o.CONNECT:
                    this.onconnect();
                    break;
                case o.EVENT:
                    this.onevent(t);
                    break;
                case o.BINARY_EVENT:
                    this.onevent(t);
                    break;
                case o.ACK:
                    this.onack(t);
                    break;
                case o.BINARY_ACK:
                    this.onack(t);
                    break;
                case o.DISCONNECT:
                    this.ondisconnect();
                    break;
                case o.ERROR:
                    this.emit("error", t.data)
            }
        }, n.prototype.onevent = function(t) {
            var e = t.data || [];
            u("emitting event %j", e), null != t.id && (u("attaching ack callback to event"), e.push(this.ack(t.id))), this.connected ? f.apply(this, e) : this.receiveBuffer.push(e)
        }, n.prototype.ack = function(t) {
            var e = this,
                r = !1;
            return function() {
                if (!r) {
                    r = !0;
                    var n = s(arguments);
                    u("sending ack %j", n);
                    var i = h(n) ? o.BINARY_ACK : o.ACK;
                    e.packet({
                        type: i,
                        id: t,
                        data: n
                    })
                }
            }
        }, n.prototype.onack = function(t) {
            var e = this.acks[t.id];
            "function" == typeof e ? (u("calling ack %s with %j", t.id, t.data), e.apply(this, t.data), delete this.acks[t.id]) : u("bad ack %s", t.id)
        }, n.prototype.onconnect = function() {
            this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered()
        }, n.prototype.emitBuffered = function() {
            var t;
            for (t = 0; t < this.receiveBuffer.length; t++) f.apply(this, this.receiveBuffer[t]);
            for (this.receiveBuffer = [], t = 0; t < this.sendBuffer.length; t++) this.packet(this.sendBuffer[t]);
            this.sendBuffer = []
        }, n.prototype.ondisconnect = function() {
            u("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect")
        }, n.prototype.destroy = function() {
            if (this.subs) {
                for (var t = 0; t < this.subs.length; t++) this.subs[t].destroy();
                this.subs = null
            }
            this.io.destroy(this)
        }, n.prototype.close = n.prototype.disconnect = function() {
            return this.connected && (u("performing disconnect (%s)", this.nsp), this.packet({
                type: o.DISCONNECT
            })), this.destroy(), this.connected && this.onclose("io client disconnect"), this
        }, n.prototype.compress = function(t) {
            return this.flags = this.flags || {}, this.flags.compress = t, this
        }
    }, function(t, e) {
        function r(t, e) {
            var r = [];
            e = e || 0;
            for (var n = e || 0; n < t.length; n++) r[n - e] = t[n];
            return r
        }
        t.exports = r
    }, function(t, e) {
        "use strict";

        function r(t, e, r) {
            return t.on(e, r), {
                destroy: function() {
                    t.removeListener(e, r)
                }
            }
        }
        t.exports = r
    }, function(t, e) {
        var r = [].slice;
        t.exports = function(t, e) {
            if ("string" == typeof e && (e = t[e]), "function" != typeof e) throw new Error("bind() requires a function");
            var n = r.call(arguments, 2);
            return function() {
                return e.apply(t, n.concat(r.call(arguments)))
            }
        }
    }, function(t, e) {
        function r(t) {
            t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0
        }
        t.exports = r, r.prototype.duration = function() {
            var t = this.ms * Math.pow(this.factor, this.attempts++);
            if (this.jitter) {
                var e = Math.random(),
                    r = Math.floor(e * this.jitter * t);
                t = 0 == (1 & Math.floor(10 * e)) ? t - r : t + r
            }
            return 0 | Math.min(t, this.max)
        }, r.prototype.reset = function() {
            this.attempts = 0
        }, r.prototype.setMin = function(t) {
            this.ms = t
        }, r.prototype.setMax = function(t) {
            this.max = t
        }, r.prototype.setJitter = function(t) {
            this.jitter = t
        }
    }])
});
(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.adapter = f()
    }
})(function() {
    var define, module, exports;
    return (function() {
        function r(e, n, t) {
            function o(i, f) {
                if (!n[i]) {
                    if (!e[i]) {
                        var c = "function" == typeof require && require;
                        if (!f && c) return c(i, !0);
                        if (u) return u(i, !0);
                        var a = new Error("Cannot find module '" + i + "'");
                        throw a.code = "MODULE_NOT_FOUND", a
                    }
                    var p = n[i] = {
                        exports: {}
                    };
                    e[i][0].call(p.exports, function(r) {
                        var n = e[i][1][r];
                        return o(n || r)
                    }, p, p.exports, r, e, n, t)
                }
                return n[i].exports
            }
            for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
            return o
        }
        return r
    })()({
        1: [function(require, module, exports) {
            'use strict';
            var _adapter_factory = require('./adapter_factory.js');
            var adapter = (0, _adapter_factory.adapterFactory)({
                window: typeof window === 'undefined' ? undefined : window
            });
            module.exports = adapter;
        }, {
            "./adapter_factory.js": 2
        }],
        2: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.adapterFactory = adapterFactory;
            var _utils = require('./utils');
            var utils = _interopRequireWildcard(_utils);
            var _chrome_shim = require('./chrome/chrome_shim');
            var chromeShim = _interopRequireWildcard(_chrome_shim);
            var _edge_shim = require('./edge/edge_shim');
            var edgeShim = _interopRequireWildcard(_edge_shim);
            var _firefox_shim = require('./firefox/firefox_shim');
            var firefoxShim = _interopRequireWildcard(_firefox_shim);
            var _safari_shim = require('./safari/safari_shim');
            var safariShim = _interopRequireWildcard(_safari_shim);
            var _common_shim = require('./common_shim');
            var commonShim = _interopRequireWildcard(_common_shim);

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                        }
                    }
                    newObj.default = obj;
                    return newObj;
                }
            }

            function adapterFactory() {
                var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    window = _ref.window;
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
                    shimChrome: true,
                    shimFirefox: true,
                    shimEdge: true,
                    shimSafari: true
                };
                var logging = utils.log;
                var browserDetails = utils.detectBrowser(window);
                var adapter = {
                    browserDetails: browserDetails,
                    commonShim: commonShim,
                    extractVersion: utils.extractVersion,
                    disableLog: utils.disableLog,
                    disableWarnings: utils.disableWarnings
                };
                switch (browserDetails.browser) {
                    case 'chrome':
                        if (!chromeShim || !chromeShim.shimPeerConnection || !options.shimChrome) {
                            logging('Chrome shim is not included in this adapter release.');
                            return adapter;
                        }
                        if (browserDetails.version === null) {
                            logging('Chrome shim can not determine version, not shimming.');
                            return adapter;
                        }
                        logging('adapter.js shimming chrome.');
                        adapter.browserShim = chromeShim;
                        chromeShim.shimGetUserMedia(window);
                        chromeShim.shimMediaStream(window);
                        chromeShim.shimPeerConnection(window);
                        chromeShim.shimOnTrack(window);
                        chromeShim.shimAddTrackRemoveTrack(window);
                        chromeShim.shimGetSendersWithDtmf(window);
                        chromeShim.shimGetStats(window);
                        chromeShim.shimSenderReceiverGetStats(window);
                        chromeShim.fixNegotiationNeeded(window);
                        commonShim.shimRTCIceCandidate(window);
                        commonShim.shimConnectionState(window);
                        commonShim.shimMaxMessageSize(window);
                        commonShim.shimSendThrowTypeError(window);
                        commonShim.removeAllowExtmapMixed(window);
                        break;
                    case 'firefox':
                        if (!firefoxShim || !firefoxShim.shimPeerConnection || !options.shimFirefox) {
                            logging('Firefox shim is not included in this adapter release.');
                            return adapter;
                        }
                        logging('adapter.js shimming firefox.');
                        adapter.browserShim = firefoxShim;
                        firefoxShim.shimGetUserMedia(window);
                        firefoxShim.shimPeerConnection(window);
                        firefoxShim.shimOnTrack(window);
                        firefoxShim.shimRemoveStream(window);
                        firefoxShim.shimSenderGetStats(window);
                        firefoxShim.shimReceiverGetStats(window);
                        firefoxShim.shimRTCDataChannel(window);
                        firefoxShim.shimAddTransceiver(window);
                        firefoxShim.shimGetParameters(window);
                        firefoxShim.shimCreateOffer(window);
                        firefoxShim.shimCreateAnswer(window);
                        commonShim.shimRTCIceCandidate(window);
                        commonShim.shimConnectionState(window);
                        commonShim.shimMaxMessageSize(window);
                        commonShim.shimSendThrowTypeError(window);
                        break;
                    case 'edge':
                        if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
                            logging('MS edge shim is not included in this adapter release.');
                            return adapter;
                        }
                        logging('adapter.js shimming edge.');
                        adapter.browserShim = edgeShim;
                        edgeShim.shimGetUserMedia(window);
                        edgeShim.shimGetDisplayMedia(window);
                        edgeShim.shimPeerConnection(window);
                        edgeShim.shimReplaceTrack(window);
                        commonShim.shimMaxMessageSize(window);
                        commonShim.shimSendThrowTypeError(window);
                        break;
                    case 'safari':
                        if (!safariShim || !options.shimSafari) {
                            logging('Safari shim is not included in this adapter release.');
                            return adapter;
                        }
                        logging('adapter.js shimming safari.');
                        adapter.browserShim = safariShim;
                        safariShim.shimRTCIceServerUrls(window);
                        safariShim.shimCreateOfferLegacy(window);
                        safariShim.shimCallbacksAPI(window);
                        safariShim.shimLocalStreamsAPI(window);
                        safariShim.shimRemoteStreamsAPI(window);
                        safariShim.shimTrackEventTransceiver(window);
                        safariShim.shimGetUserMedia(window);
                        safariShim.shimAudioContext(window);
                        commonShim.shimRTCIceCandidate(window);
                        commonShim.shimMaxMessageSize(window);
                        commonShim.shimSendThrowTypeError(window);
                        commonShim.removeAllowExtmapMixed(window);
                        break;
                    default:
                        logging('Unsupported browser!');
                        break;
                }
                return adapter;
            }
        }, {
            "./chrome/chrome_shim": 3,
            "./common_shim": 6,
            "./edge/edge_shim": 7,
            "./firefox/firefox_shim": 11,
            "./safari/safari_shim": 14,
            "./utils": 15
        }],
        3: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            var _getusermedia = require('./getusermedia');
            Object.defineProperty(exports, 'shimGetUserMedia', {
                enumerable: true,
                get: function get() {
                    return _getusermedia.shimGetUserMedia;
                }
            });
            var _getdisplaymedia = require('./getdisplaymedia');
            Object.defineProperty(exports, 'shimGetDisplayMedia', {
                enumerable: true,
                get: function get() {
                    return _getdisplaymedia.shimGetDisplayMedia;
                }
            });
            exports.shimMediaStream = shimMediaStream;
            exports.shimOnTrack = shimOnTrack;
            exports.shimGetSendersWithDtmf = shimGetSendersWithDtmf;
            exports.shimGetStats = shimGetStats;
            exports.shimSenderReceiverGetStats = shimSenderReceiverGetStats;
            exports.shimAddTrackRemoveTrackWithNative = shimAddTrackRemoveTrackWithNative;
            exports.shimAddTrackRemoveTrack = shimAddTrackRemoveTrack;
            exports.shimPeerConnection = shimPeerConnection;
            exports.fixNegotiationNeeded = fixNegotiationNeeded;
            var _utils = require('../utils.js');
            var utils = _interopRequireWildcard(_utils);

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                        }
                    }
                    newObj.default = obj;
                    return newObj;
                }
            }

            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    obj[key] = value;
                }
                return obj;
            }

            function shimMediaStream(window) {
                window.MediaStream = window.MediaStream || window.webkitMediaStream;
            }

            function shimOnTrack(window) {
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
                    Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
                        get: function get() {
                            return this._ontrack;
                        },
                        set: function set(f) {
                            if (this._ontrack) {
                                this.removeEventListener('track', this._ontrack);
                            }
                            this.addEventListener('track', this._ontrack = f);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
                    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
                        var _this = this;
                        if (!this._ontrackpoly) {
                            this._ontrackpoly = function(e) {
                                e.stream.addEventListener('addtrack', function(te) {
                                    var receiver = void 0;
                                    if (window.RTCPeerConnection.prototype.getReceivers) {
                                        receiver = _this.getReceivers().find(function(r) {
                                            return r.track && r.track.id === te.track.id;
                                        });
                                    } else {
                                        receiver = {
                                            track: te.track
                                        };
                                    }
                                    var event = new Event('track');
                                    event.track = te.track;
                                    event.receiver = receiver;
                                    event.transceiver = {
                                        receiver: receiver
                                    };
                                    event.streams = [e.stream];
                                    _this.dispatchEvent(event);
                                });
                                e.stream.getTracks().forEach(function(track) {
                                    var receiver = void 0;
                                    if (window.RTCPeerConnection.prototype.getReceivers) {
                                        receiver = _this.getReceivers().find(function(r) {
                                            return r.track && r.track.id === track.id;
                                        });
                                    } else {
                                        receiver = {
                                            track: track
                                        };
                                    }
                                    var event = new Event('track');
                                    event.track = track;
                                    event.receiver = receiver;
                                    event.transceiver = {
                                        receiver: receiver
                                    };
                                    event.streams = [e.stream];
                                    _this.dispatchEvent(event);
                                });
                            };
                            this.addEventListener('addstream', this._ontrackpoly);
                        }
                        return origSetRemoteDescription.apply(this, arguments);
                    };
                } else {
                    utils.wrapPeerConnectionEvent(window, 'track', function(e) {
                        if (!e.transceiver) {
                            Object.defineProperty(e, 'transceiver', {
                                value: {
                                    receiver: e.receiver
                                }
                            });
                        }
                        return e;
                    });
                }
            }

            function shimGetSendersWithDtmf(window) {
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('getSenders' in window.RTCPeerConnection.prototype) && 'createDTMFSender' in window.RTCPeerConnection.prototype) {
                    var shimSenderWithDtmf = function shimSenderWithDtmf(pc, track) {
                        return {
                            track: track,
                            get dtmf() {
                                if (this._dtmf === undefined) {
                                    if (track.kind === 'audio') {
                                        this._dtmf = pc.createDTMFSender(track);
                                    } else {
                                        this._dtmf = null;
                                    }
                                }
                                return this._dtmf;
                            },
                            _pc: pc
                        };
                    };
                    if (!window.RTCPeerConnection.prototype.getSenders) {
                        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
                            this._senders = this._senders || [];
                            return this._senders.slice();
                        };
                        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
                        window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
                            var sender = origAddTrack.apply(this, arguments);
                            if (!sender) {
                                sender = shimSenderWithDtmf(this, track);
                                this._senders.push(sender);
                            }
                            return sender;
                        };
                        var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
                        window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
                            origRemoveTrack.apply(this, arguments);
                            var idx = this._senders.indexOf(sender);
                            if (idx !== -1) {
                                this._senders.splice(idx, 1);
                            }
                        };
                    }
                    var origAddStream = window.RTCPeerConnection.prototype.addStream;
                    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
                        var _this2 = this;
                        this._senders = this._senders || [];
                        origAddStream.apply(this, [stream]);
                        stream.getTracks().forEach(function(track) {
                            _this2._senders.push(shimSenderWithDtmf(_this2, track));
                        });
                    };
                    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
                    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
                        var _this3 = this;
                        this._senders = this._senders || [];
                        origRemoveStream.apply(this, [stream]);
                        stream.getTracks().forEach(function(track) {
                            var sender = _this3._senders.find(function(s) {
                                return s.track === track;
                            });
                            if (sender) {
                                _this3._senders.splice(_this3._senders.indexOf(sender), 1);
                            }
                        });
                    };
                } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && 'getSenders' in window.RTCPeerConnection.prototype && 'createDTMFSender' in window.RTCPeerConnection.prototype && window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
                    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
                    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
                        var _this4 = this;
                        var senders = origGetSenders.apply(this, []);
                        senders.forEach(function(sender) {
                            return sender._pc = _this4;
                        });
                        return senders;
                    };
                    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
                        get: function get() {
                            if (this._dtmf === undefined) {
                                if (this.track.kind === 'audio') {
                                    this._dtmf = this._pc.createDTMFSender(this.track);
                                } else {
                                    this._dtmf = null;
                                }
                            }
                            return this._dtmf;
                        }
                    });
                }
            }

            function shimGetStats(window) {
                if (!window.RTCPeerConnection) {
                    return;
                }
                var origGetStats = window.RTCPeerConnection.prototype.getStats;
                window.RTCPeerConnection.prototype.getStats = function getStats() {
                    var _this5 = this;
                    var _arguments = Array.prototype.slice.call(arguments),
                        selector = _arguments[0],
                        onSucc = _arguments[1],
                        onErr = _arguments[2];
                    if (arguments.length > 0 && typeof selector === 'function') {
                        return origGetStats.apply(this, arguments);
                    }
                    if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== 'function')) {
                        return origGetStats.apply(this, []);
                    }
                    var fixChromeStats_ = function fixChromeStats_(response) {
                        var standardReport = {};
                        var reports = response.result();
                        reports.forEach(function(report) {
                            var standardStats = {
                                id: report.id,
                                timestamp: report.timestamp,
                                type: {
                                    localcandidate: 'local-candidate',
                                    remotecandidate: 'remote-candidate'
                                } [report.type] || report.type
                            };
                            report.names().forEach(function(name) {
                                standardStats[name] = report.stat(name);
                            });
                            standardReport[standardStats.id] = standardStats;
                        });
                        return standardReport;
                    };
                    var makeMapStats = function makeMapStats(stats) {
                        return new Map(Object.keys(stats).map(function(key) {
                            return [key, stats[key]];
                        }));
                    };
                    if (arguments.length >= 2) {
                        var successCallbackWrapper_ = function successCallbackWrapper_(response) {
                            onSucc(makeMapStats(fixChromeStats_(response)));
                        };
                        return origGetStats.apply(this, [successCallbackWrapper_, selector]);
                    }
                    return new Promise(function(resolve, reject) {
                        origGetStats.apply(_this5, [function(response) {
                            resolve(makeMapStats(fixChromeStats_(response)));
                        }, reject]);
                    }).then(onSucc, onErr);
                };
            }

            function shimSenderReceiverGetStats(window) {
                if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) {
                    return;
                }
                if (!('getStats' in window.RTCRtpSender.prototype)) {
                    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
                    if (origGetSenders) {
                        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
                            var _this6 = this;
                            var senders = origGetSenders.apply(this, []);
                            senders.forEach(function(sender) {
                                return sender._pc = _this6;
                            });
                            return senders;
                        };
                    }
                    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
                    if (origAddTrack) {
                        window.RTCPeerConnection.prototype.addTrack = function addTrack() {
                            var sender = origAddTrack.apply(this, arguments);
                            sender._pc = this;
                            return sender;
                        };
                    }
                    window.RTCRtpSender.prototype.getStats = function getStats() {
                        var sender = this;
                        return this._pc.getStats().then(function(result) {
                            return (utils.filterStats(result, sender.track, true));
                        });
                    };
                }
                if (!('getStats' in window.RTCRtpReceiver.prototype)) {
                    var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
                    if (origGetReceivers) {
                        window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
                            var _this7 = this;
                            var receivers = origGetReceivers.apply(this, []);
                            receivers.forEach(function(receiver) {
                                return receiver._pc = _this7;
                            });
                            return receivers;
                        };
                    }
                    utils.wrapPeerConnectionEvent(window, 'track', function(e) {
                        e.receiver._pc = e.srcElement;
                        return e;
                    });
                    window.RTCRtpReceiver.prototype.getStats = function getStats() {
                        var receiver = this;
                        return this._pc.getStats().then(function(result) {
                            return utils.filterStats(result, receiver.track, false);
                        });
                    };
                }
                if (!('getStats' in window.RTCRtpSender.prototype && 'getStats' in window.RTCRtpReceiver.prototype)) {
                    return;
                }
                var origGetStats = window.RTCPeerConnection.prototype.getStats;
                window.RTCPeerConnection.prototype.getStats = function getStats() {
                    if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
                        var track = arguments[0];
                        var sender = void 0;
                        var receiver = void 0;
                        var err = void 0;
                        this.getSenders().forEach(function(s) {
                            if (s.track === track) {
                                if (sender) {
                                    err = true;
                                } else {
                                    sender = s;
                                }
                            }
                        });
                        this.getReceivers().forEach(function(r) {
                            if (r.track === track) {
                                if (receiver) {
                                    err = true;
                                } else {
                                    receiver = r;
                                }
                            }
                            return r.track === track;
                        });
                        if (err || sender && receiver) {
                            return Promise.reject(new DOMException('There are more than one sender or receiver for the track.', 'InvalidAccessError'));
                        } else if (sender) {
                            return sender.getStats();
                        } else if (receiver) {
                            return receiver.getStats();
                        }
                        return Promise.reject(new DOMException('There is no sender or receiver for the track.', 'InvalidAccessError'));
                    }
                    return origGetStats.apply(this, arguments);
                };
            }

            function shimAddTrackRemoveTrackWithNative(window) {
                window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
                    var _this8 = this;
                    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                    return Object.keys(this._shimmedLocalStreams).map(function(streamId) {
                        return _this8._shimmedLocalStreams[streamId][0];
                    });
                };
                var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
                window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
                    if (!stream) {
                        return origAddTrack.apply(this, arguments);
                    }
                    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                    var sender = origAddTrack.apply(this, arguments);
                    if (!this._shimmedLocalStreams[stream.id]) {
                        this._shimmedLocalStreams[stream.id] = [stream, sender];
                    } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
                        this._shimmedLocalStreams[stream.id].push(sender);
                    }
                    return sender;
                };
                var origAddStream = window.RTCPeerConnection.prototype.addStream;
                window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
                    var _this9 = this;
                    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                    stream.getTracks().forEach(function(track) {
                        var alreadyExists = _this9.getSenders().find(function(s) {
                            return s.track === track;
                        });
                        if (alreadyExists) {
                            throw new DOMException('Track already exists.', 'InvalidAccessError');
                        }
                    });
                    var existingSenders = this.getSenders();
                    origAddStream.apply(this, arguments);
                    var newSenders = this.getSenders().filter(function(newSender) {
                        return existingSenders.indexOf(newSender) === -1;
                    });
                    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
                };
                var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
                window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
                    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                    delete this._shimmedLocalStreams[stream.id];
                    return origRemoveStream.apply(this, arguments);
                };
                var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
                window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
                    var _this10 = this;
                    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                    if (sender) {
                        Object.keys(this._shimmedLocalStreams).forEach(function(streamId) {
                            var idx = _this10._shimmedLocalStreams[streamId].indexOf(sender);
                            if (idx !== -1) {
                                _this10._shimmedLocalStreams[streamId].splice(idx, 1);
                            }
                            if (_this10._shimmedLocalStreams[streamId].length === 1) {
                                delete _this10._shimmedLocalStreams[streamId];
                            }
                        });
                    }
                    return origRemoveTrack.apply(this, arguments);
                };
            }

            function shimAddTrackRemoveTrack(window) {
                if (!window.RTCPeerConnection) {
                    return;
                }
                var browserDetails = utils.detectBrowser(window);
                if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
                    return shimAddTrackRemoveTrackWithNative(window);
                }
                var origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
                window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
                    var _this11 = this;
                    var nativeStreams = origGetLocalStreams.apply(this);
                    this._reverseStreams = this._reverseStreams || {};
                    return nativeStreams.map(function(stream) {
                        return _this11._reverseStreams[stream.id];
                    });
                };
                var origAddStream = window.RTCPeerConnection.prototype.addStream;
                window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
                    var _this12 = this;
                    this._streams = this._streams || {};
                    this._reverseStreams = this._reverseStreams || {};
                    stream.getTracks().forEach(function(track) {
                        var alreadyExists = _this12.getSenders().find(function(s) {
                            return s.track === track;
                        });
                        if (alreadyExists) {
                            throw new DOMException('Track already exists.', 'InvalidAccessError');
                        }
                    });
                    if (!this._reverseStreams[stream.id]) {
                        var newStream = new window.MediaStream(stream.getTracks());
                        this._streams[stream.id] = newStream;
                        this._reverseStreams[newStream.id] = stream;
                        stream = newStream;
                    }
                    origAddStream.apply(this, [stream]);
                };
                var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
                window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
                    this._streams = this._streams || {};
                    this._reverseStreams = this._reverseStreams || {};
                    origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
                    delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
                    delete this._streams[stream.id];
                };
                window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
                    var _this13 = this;
                    if (this.signalingState === 'closed') {
                        throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
                    }
                    var streams = [].slice.call(arguments, 1);
                    if (streams.length !== 1 || !streams[0].getTracks().find(function(t) {
                            return t === track;
                        })) {
                        throw new DOMException('The adapter.js addTrack polyfill only supports a single ' + ' stream which is associated with the specified track.', 'NotSupportedError');
                    }
                    var alreadyExists = this.getSenders().find(function(s) {
                        return s.track === track;
                    });
                    if (alreadyExists) {
                        throw new DOMException('Track already exists.', 'InvalidAccessError');
                    }
                    this._streams = this._streams || {};
                    this._reverseStreams = this._reverseStreams || {};
                    var oldStream = this._streams[stream.id];
                    if (oldStream) {
                        oldStream.addTrack(track);
                        Promise.resolve().then(function() {
                            _this13.dispatchEvent(new Event('negotiationneeded'));
                        });
                    } else {
                        var newStream = new window.MediaStream([track]);
                        this._streams[stream.id] = newStream;
                        this._reverseStreams[newStream.id] = stream;
                        this.addStream(newStream);
                    }
                    return this.getSenders().find(function(s) {
                        return s.track === track;
                    });
                };

                function replaceInternalStreamId(pc, description) {
                    var sdp = description.sdp;
                    Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
                        var externalStream = pc._reverseStreams[internalId];
                        var internalStream = pc._streams[externalStream.id];
                        sdp = sdp.replace(new RegExp(internalStream.id, 'g'), externalStream.id);
                    });
                    return new RTCSessionDescription({
                        type: description.type,
                        sdp: sdp
                    });
                }

                function replaceExternalStreamId(pc, description) {
                    var sdp = description.sdp;
                    Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
                        var externalStream = pc._reverseStreams[internalId];
                        var internalStream = pc._streams[externalStream.id];
                        sdp = sdp.replace(new RegExp(externalStream.id, 'g'), internalStream.id);
                    });
                    return new RTCSessionDescription({
                        type: description.type,
                        sdp: sdp
                    });
                }
                ['createOffer', 'createAnswer'].forEach(function(method) {
                    var nativeMethod = window.RTCPeerConnection.prototype[method];
                    var methodObj = _defineProperty({}, method, function() {
                        var _this14 = this;
                        var args = arguments;
                        var isLegacyCall = arguments.length && typeof arguments[0] === 'function';
                        if (isLegacyCall) {
                            return nativeMethod.apply(this, [function(description) {
                                var desc = replaceInternalStreamId(_this14, description);
                                args[0].apply(null, [desc]);
                            }, function(err) {
                                if (args[1]) {
                                    args[1].apply(null, err);
                                }
                            }, arguments[2]]);
                        }
                        return nativeMethod.apply(this, arguments).then(function(description) {
                            return replaceInternalStreamId(_this14, description);
                        });
                    });
                    window.RTCPeerConnection.prototype[method] = methodObj[method];
                });
                var origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
                window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
                    if (!arguments.length || !arguments[0].type) {
                        return origSetLocalDescription.apply(this, arguments);
                    }
                    arguments[0] = replaceExternalStreamId(this, arguments[0]);
                    return origSetLocalDescription.apply(this, arguments);
                };
                var origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, 'localDescription');
                Object.defineProperty(window.RTCPeerConnection.prototype, 'localDescription', {
                    get: function get() {
                        var description = origLocalDescription.get.apply(this);
                        if (description.type === '') {
                            return description;
                        }
                        return replaceInternalStreamId(this, description);
                    }
                });
                window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
                    var _this15 = this;
                    if (this.signalingState === 'closed') {
                        throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
                    }
                    if (!sender._pc) {
                        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.', 'TypeError');
                    }
                    var isLocal = sender._pc === this;
                    if (!isLocal) {
                        throw new DOMException('Sender was not created by this connection.', 'InvalidAccessError');
                    }
                    this._streams = this._streams || {};
                    var stream = void 0;
                    Object.keys(this._streams).forEach(function(streamid) {
                        var hasTrack = _this15._streams[streamid].getTracks().find(function(track) {
                            return sender.track === track;
                        });
                        if (hasTrack) {
                            stream = _this15._streams[streamid];
                        }
                    });
                    if (stream) {
                        if (stream.getTracks().length === 1) {
                            this.removeStream(this._reverseStreams[stream.id]);
                        } else {
                            stream.removeTrack(sender.track);
                        }
                        this.dispatchEvent(new Event('negotiationneeded'));
                    }
                };
            }

            function shimPeerConnection(window) {
                var browserDetails = utils.detectBrowser(window);
                if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
                    window.RTCPeerConnection = window.webkitRTCPeerConnection;
                }
                if (!window.RTCPeerConnection) {
                    return;
                }
                var addIceCandidateNullSupported = window.RTCPeerConnection.prototype.addIceCandidate.length === 0;
                if (browserDetails.version < 53) {
                    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function(method) {
                        var nativeMethod = window.RTCPeerConnection.prototype[method];
                        var methodObj = _defineProperty({}, method, function() {
                            arguments[0] = new(method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
                            return nativeMethod.apply(this, arguments);
                        });
                        window.RTCPeerConnection.prototype[method] = methodObj[method];
                    });
                }
                var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
                window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
                    if (!addIceCandidateNullSupported && !arguments[0]) {
                        if (arguments[1]) {
                            arguments[1].apply(null);
                        }
                        return Promise.resolve();
                    }
                    if (browserDetails.version < 78 && arguments[0] && arguments[0].candidate === '') {
                        return Promise.resolve();
                    }
                    return nativeAddIceCandidate.apply(this, arguments);
                };
            }

            function fixNegotiationNeeded(window) {
                var browserDetails = utils.detectBrowser(window);
                utils.wrapPeerConnectionEvent(window, 'negotiationneeded', function(e) {
                    var pc = e.target;
                    if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === 'plan-b') {
                        if (pc.signalingState !== 'stable') {
                            return;
                        }
                    }
                    return e;
                });
            }
        }, {
            "../utils.js": 15,
            "./getdisplaymedia": 4,
            "./getusermedia": 5
        }],
        4: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.shimGetDisplayMedia = shimGetDisplayMedia;

            function shimGetDisplayMedia(window, getSourceId) {
                if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
                    return;
                }
                if (!window.navigator.mediaDevices) {
                    return;
                }
                if (typeof getSourceId !== 'function') {
                    console.error('shimGetDisplayMedia: getSourceId argument is not ' + 'a function');
                    return;
                }
                window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
                    return getSourceId(constraints).then(function(sourceId) {
                        var widthSpecified = constraints.video && constraints.video.width;
                        var heightSpecified = constraints.video && constraints.video.height;
                        var frameRateSpecified = constraints.video && constraints.video.frameRate;
                        constraints.video = {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: sourceId,
                                maxFrameRate: frameRateSpecified || 3
                            }
                        };
                        if (widthSpecified) {
                            constraints.video.mandatory.maxWidth = widthSpecified;
                        }
                        if (heightSpecified) {
                            constraints.video.mandatory.maxHeight = heightSpecified;
                        }
                        return window.navigator.mediaDevices.getUserMedia(constraints);
                    });
                };
            }
        }, {}],
        5: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            exports.shimGetUserMedia = shimGetUserMedia;
            var _utils = require('../utils.js');
            var utils = _interopRequireWildcard(_utils);

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                        }
                    }
                    newObj.default = obj;
                    return newObj;
                }
            }
            var logging = utils.log;

            function shimGetUserMedia(window) {
                var navigator = window && window.navigator;
                if (!navigator.mediaDevices) {
                    return;
                }
                var browserDetails = utils.detectBrowser(window);
                var constraintsToChrome_ = function constraintsToChrome_(c) {
                    if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) !== 'object' || c.mandatory || c.optional) {
                        return c;
                    }
                    var cc = {};
                    Object.keys(c).forEach(function(key) {
                        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
                            return;
                        }
                        var r = _typeof(c[key]) === 'object' ? c[key] : {
                            ideal: c[key]
                        };
                        if (r.exact !== undefined && typeof r.exact === 'number') {
                            r.min = r.max = r.exact;
                        }
                        var oldname_ = function oldname_(prefix, name) {
                            if (prefix) {
                                return prefix + name.charAt(0).toUpperCase() + name.slice(1);
                            }
                            return name === 'deviceId' ? 'sourceId' : name;
                        };
                        if (r.ideal !== undefined) {
                            cc.optional = cc.optional || [];
                            var oc = {};
                            if (typeof r.ideal === 'number') {
                                oc[oldname_('min', key)] = r.ideal;
                                cc.optional.push(oc);
                                oc = {};
                                oc[oldname_('max', key)] = r.ideal;
                                cc.optional.push(oc);
                            } else {
                                oc[oldname_('', key)] = r.ideal;
                                cc.optional.push(oc);
                            }
                        }
                        if (r.exact !== undefined && typeof r.exact !== 'number') {
                            cc.mandatory = cc.mandatory || {};
                            cc.mandatory[oldname_('', key)] = r.exact;
                        } else {
                            ['min', 'max'].forEach(function(mix) {
                                if (r[mix] !== undefined) {
                                    cc.mandatory = cc.mandatory || {};
                                    cc.mandatory[oldname_(mix, key)] = r[mix];
                                }
                            });
                        }
                    });
                    if (c.advanced) {
                        cc.optional = (cc.optional || []).concat(c.advanced);
                    }
                    return cc;
                };
                var shimConstraints_ = function shimConstraints_(constraints, func) {
                    if (browserDetails.version >= 61) {
                        return func(constraints);
                    }
                    constraints = JSON.parse(JSON.stringify(constraints));
                    if (constraints && _typeof(constraints.audio) === 'object') {
                        var remap = function remap(obj, a, b) {
                            if (a in obj && !(b in obj)) {
                                obj[b] = obj[a];
                                delete obj[a];
                            }
                        };
                        constraints = JSON.parse(JSON.stringify(constraints));
                        remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
                        remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
                        constraints.audio = constraintsToChrome_(constraints.audio);
                    }
                    if (constraints && _typeof(constraints.video) === 'object') {
                        var face = constraints.video.facingMode;
                        face = face && ((typeof face === 'undefined' ? 'undefined' : _typeof(face)) === 'object' ? face : {
                            ideal: face
                        });
                        var getSupportedFacingModeLies = browserDetails.version < 66;
                        if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
                            delete constraints.video.facingMode;
                            var matches = void 0;
                            if (face.exact === 'environment' || face.ideal === 'environment') {
                                matches = ['back', 'rear'];
                            } else if (face.exact === 'user' || face.ideal === 'user') {
                                matches = ['front'];
                            }
                            if (matches) {
                                return navigator.mediaDevices.enumerateDevices().then(function(devices) {
                                    devices = devices.filter(function(d) {
                                        return d.kind === 'videoinput';
                                    });
                                    var dev = devices.find(function(d) {
                                        return matches.some(function(match) {
                                            return d.label.toLowerCase().includes(match);
                                        });
                                    });
                                    if (!dev && devices.length && matches.includes('back')) {
                                        dev = devices[devices.length - 1];
                                    }
                                    if (dev) {
                                        constraints.video.deviceId = face.exact ? {
                                            exact: dev.deviceId
                                        } : {
                                            ideal: dev.deviceId
                                        };
                                    }
                                    constraints.video = constraintsToChrome_(constraints.video);
                                    logging('chrome: ' + JSON.stringify(constraints));
                                    return func(constraints);
                                });
                            }
                        }
                        constraints.video = constraintsToChrome_(constraints.video);
                    }
                    logging('chrome: ' + JSON.stringify(constraints));
                    return func(constraints);
                };
                var shimError_ = function shimError_(e) {
                    if (browserDetails.version >= 64) {
                        return e;
                    }
                    return {
                        name: {
                            PermissionDeniedError: 'NotAllowedError',
                            PermissionDismissedError: 'NotAllowedError',
                            InvalidStateError: 'NotAllowedError',
                            DevicesNotFoundError: 'NotFoundError',
                            ConstraintNotSatisfiedError: 'OverconstrainedError',
                            TrackStartError: 'NotReadableError',
                            MediaDeviceFailedDueToShutdown: 'NotAllowedError',
                            MediaDeviceKillSwitchOn: 'NotAllowedError',
                            TabCaptureError: 'AbortError',
                            ScreenCaptureError: 'AbortError',
                            DeviceCaptureError: 'AbortError'
                        } [e.name] || e.name,
                        message: e.message,
                        constraint: e.constraint || e.constraintName,
                        toString: function toString() {
                            return this.name + (this.message && ': ') + this.message;
                        }
                    };
                };
                var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
                    shimConstraints_(constraints, function(c) {
                        navigator.webkitGetUserMedia(c, onSuccess, function(e) {
                            if (onError) {
                                onError(shimError_(e));
                            }
                        });
                    });
                };
                navigator.getUserMedia = getUserMedia_.bind(navigator);
                if (navigator.mediaDevices.getUserMedia) {
                    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getUserMedia = function(cs) {
                        return shimConstraints_(cs, function(c) {
                            return origGetUserMedia(c).then(function(stream) {
                                if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
                                    stream.getTracks().forEach(function(track) {
                                        track.stop();
                                    });
                                    throw new DOMException('', 'NotFoundError');
                                }
                                return stream;
                            }, function(e) {
                                return Promise.reject(shimError_(e));
                            });
                        });
                    };
                }
            }
        }, {
            "../utils.js": 15
        }],
        6: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            exports.shimRTCIceCandidate = shimRTCIceCandidate;
            exports.shimMaxMessageSize = shimMaxMessageSize;
            exports.shimSendThrowTypeError = shimSendThrowTypeError;
            exports.shimConnectionState = shimConnectionState;
            exports.removeAllowExtmapMixed = removeAllowExtmapMixed;
            var _sdp = require('sdp');
            var _sdp2 = _interopRequireDefault(_sdp);
            var _utils = require('./utils');
            var utils = _interopRequireWildcard(_utils);

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                        }
                    }
                    newObj.default = obj;
                    return newObj;
                }
            }

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }

            function shimRTCIceCandidate(window) {
                if (!window.RTCIceCandidate || window.RTCIceCandidate && 'foundation' in window.RTCIceCandidate.prototype) {
                    return;
                }
                var NativeRTCIceCandidate = window.RTCIceCandidate;
                window.RTCIceCandidate = function RTCIceCandidate(args) {
                    if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' && args.candidate && args.candidate.indexOf('a=') === 0) {
                        args = JSON.parse(JSON.stringify(args));
                        args.candidate = args.candidate.substr(2);
                    }
                    if (args.candidate && args.candidate.length) {
                        var nativeCandidate = new NativeRTCIceCandidate(args);
                        var parsedCandidate = _sdp2.default.parseCandidate(args.candidate);
                        var augmentedCandidate = Object.assign(nativeCandidate, parsedCandidate);
                        augmentedCandidate.toJSON = function toJSON() {
                            return {
                                candidate: augmentedCandidate.candidate,
                                sdpMid: augmentedCandidate.sdpMid,
                                sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
                                usernameFragment: augmentedCandidate.usernameFragment
                            };
                        };
                        return augmentedCandidate;
                    }
                    return new NativeRTCIceCandidate(args);
                };
                window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
                utils.wrapPeerConnectionEvent(window, 'icecandidate', function(e) {
                    if (e.candidate) {
                        Object.defineProperty(e, 'candidate', {
                            value: new window.RTCIceCandidate(e.candidate),
                            writable: 'false'
                        });
                    }
                    return e;
                });
            }

            function shimMaxMessageSize(window) {
                if (!window.RTCPeerConnection) {
                    return;
                }
                var browserDetails = utils.detectBrowser(window);
                if (!('sctp' in window.RTCPeerConnection.prototype)) {
                    Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
                        get: function get() {
                            return typeof this._sctp === 'undefined' ? null : this._sctp;
                        }
                    });
                }
                var sctpInDescription = function sctpInDescription(description) {
                    if (!description || !description.sdp) {
                        return false;
                    }
                    var sections = _sdp2.default.splitSections(description.sdp);
                    sections.shift();
                    return sections.some(function(mediaSection) {
                        var mLine = _sdp2.default.parseMLine(mediaSection);
                        return mLine && mLine.kind === 'application' && mLine.protocol.indexOf('SCTP') !== -1;
                    });
                };
                var getRemoteFirefoxVersion = function getRemoteFirefoxVersion(description) {
                    var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
                    if (match === null || match.length < 2) {
                        return -1;
                    }
                    var version = parseInt(match[1], 10);
                    return version !== version ? -1 : version;
                };
                var getCanSendMaxMessageSize = function getCanSendMaxMessageSize(remoteIsFirefox) {
                    var canSendMaxMessageSize = 65536;
                    if (browserDetails.browser === 'firefox') {
                        if (browserDetails.version < 57) {
                            if (remoteIsFirefox === -1) {
                                canSendMaxMessageSize = 16384;
                            } else {
                                canSendMaxMessageSize = 2147483637;
                            }
                        } else if (browserDetails.version < 60) {
                            canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
                        } else {
                            canSendMaxMessageSize = 2147483637;
                        }
                    }
                    return canSendMaxMessageSize;
                };
                var getMaxMessageSize = function getMaxMessageSize(description, remoteIsFirefox) {
                    var maxMessageSize = 65536;
                    if (browserDetails.browser === 'firefox' && browserDetails.version === 57) {
                        maxMessageSize = 65535;
                    }
                    var match = _sdp2.default.matchPrefix(description.sdp, 'a=max-message-size:');
                    if (match.length > 0) {
                        maxMessageSize = parseInt(match[0].substr(19), 10);
                    } else if (browserDetails.browser === 'firefox' && remoteIsFirefox !== -1) {
                        maxMessageSize = 2147483637;
                    }
                    return maxMessageSize;
                };
                var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
                window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
                    this._sctp = null;
                    if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
                        var _getConfiguration = this.getConfiguration(),
                            sdpSemantics = _getConfiguration.sdpSemantics;
                        if (sdpSemantics === 'plan-b') {
                            Object.defineProperty(this, 'sctp', {
                                get: function get() {
                                    return typeof this._sctp === 'undefined' ? null : this._sctp;
                                },
                                enumerable: true,
                                configurable: true
                            });
                        }
                    }
                    if (sctpInDescription(arguments[0])) {
                        var isFirefox = getRemoteFirefoxVersion(arguments[0]);
                        var canSendMMS = getCanSendMaxMessageSize(isFirefox);
                        var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
                        var maxMessageSize = void 0;
                        if (canSendMMS === 0 && remoteMMS === 0) {
                            maxMessageSize = Number.POSITIVE_INFINITY;
                        } else if (canSendMMS === 0 || remoteMMS === 0) {
                            maxMessageSize = Math.max(canSendMMS, remoteMMS);
                        } else {
                            maxMessageSize = Math.min(canSendMMS, remoteMMS);
                        }
                        var sctp = {};
                        Object.defineProperty(sctp, 'maxMessageSize', {
                            get: function get() {
                                return maxMessageSize;
                            }
                        });
                        this._sctp = sctp;
                    }
                    return origSetRemoteDescription.apply(this, arguments);
                };
            }

            function shimSendThrowTypeError(window) {
                if (!(window.RTCPeerConnection && 'createDataChannel' in window.RTCPeerConnection.prototype)) {
                    return;
                }

                function wrapDcSend(dc, pc) {
                    var origDataChannelSend = dc.send;
                    dc.send = function send() {
                        var data = arguments[0];
                        var length = data.length || data.size || data.byteLength;
                        if (dc.readyState === 'open' && pc.sctp && length > pc.sctp.maxMessageSize) {
                            throw new TypeError('Message too large (can send a maximum of ' + pc.sctp.maxMessageSize + ' bytes)');
                        }
                        return origDataChannelSend.apply(dc, arguments);
                    };
                }
                var origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
                window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
                    var dataChannel = origCreateDataChannel.apply(this, arguments);
                    wrapDcSend(dataChannel, this);
                    return dataChannel;
                };
                utils.wrapPeerConnectionEvent(window, 'datachannel', function(e) {
                    wrapDcSend(e.channel, e.target);
                    return e;
                });
            }

            function shimConnectionState(window) {
                if (!window.RTCPeerConnection || 'connectionState' in window.RTCPeerConnection.prototype) {
                    return;
                }
                var proto = window.RTCPeerConnection.prototype;
                Object.defineProperty(proto, 'connectionState', {
                    get: function get() {
                        return {
                            completed: 'connected',
                            checking: 'connecting'
                        } [this.iceConnectionState] || this.iceConnectionState;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(proto, 'onconnectionstatechange', {
                    get: function get() {
                        return this._onconnectionstatechange || null;
                    },
                    set: function set(cb) {
                        if (this._onconnectionstatechange) {
                            this.removeEventListener('connectionstatechange', this._onconnectionstatechange);
                            delete this._onconnectionstatechange;
                        }
                        if (cb) {
                            this.addEventListener('connectionstatechange', this._onconnectionstatechange = cb);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ['setLocalDescription', 'setRemoteDescription'].forEach(function(method) {
                    var origMethod = proto[method];
                    proto[method] = function() {
                        if (!this._connectionstatechangepoly) {
                            this._connectionstatechangepoly = function(e) {
                                var pc = e.target;
                                if (pc._lastConnectionState !== pc.connectionState) {
                                    pc._lastConnectionState = pc.connectionState;
                                    var newEvent = new Event('connectionstatechange', e);
                                    pc.dispatchEvent(newEvent);
                                }
                                return e;
                            };
                            this.addEventListener('iceconnectionstatechange', this._connectionstatechangepoly);
                        }
                        return origMethod.apply(this, arguments);
                    };
                });
            }

            function removeAllowExtmapMixed(window) {
                if (!window.RTCPeerConnection) {
                    return;
                }
                var browserDetails = utils.detectBrowser(window);
                if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
                    return;
                }
                if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
                    return;
                }
                var nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
                window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
                    if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
                        desc.sdp = desc.sdp.split('\n').filter(function(line) {
                            return line.trim() !== 'a=extmap-allow-mixed';
                        }).join('\n');
                    }
                    return nativeSRD.apply(this, arguments);
                };
            }
        }, {
            "./utils": 15,
            "sdp": 17
        }],
        7: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
            var _getusermedia = require('./getusermedia');
            Object.defineProperty(exports, 'shimGetUserMedia', {
                enumerable: true,
                get: function get() {
                    return _getusermedia.shimGetUserMedia;
                }
            });
            var _getdisplaymedia = require('./getdisplaymedia');
            Object.defineProperty(exports, 'shimGetDisplayMedia', {
                enumerable: true,
                get: function get() {
                    return _getdisplaymedia.shimGetDisplayMedia;
                }
            });
            exports.shimPeerConnection = shimPeerConnection;
            exports.shimReplaceTrack = shimReplaceTrack;
            var _utils = require('../utils');
            var utils = _interopRequireWildcard(_utils);
            var _filtericeservers = require('./filtericeservers');
            var _rtcpeerconnectionShim = require('rtcpeerconnection-shim');
            var _rtcpeerconnectionShim2 = _interopRequireDefault(_rtcpeerconnectionShim);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                        }
                    }
                    newObj.default = obj;
                    return newObj;
                }
            }

            function shimPeerConnection(window) {
                var browserDetails = utils.detectBrowser(window);
                if (window.RTCIceGatherer) {
                    if (!window.RTCIceCandidate) {
                        window.RTCIceCandidate = function RTCIceCandidate(args) {
                            return args;
                        };
                    }
                    if (!window.RTCSessionDescription) {
                        window.RTCSessionDescription = function RTCSessionDescription(args) {
                            return args;
                        };
                    }
                    if (browserDetails.version < 15025) {
                        var origMSTEnabled = Object.getOwnPropertyDescriptor(window.MediaStreamTrack.prototype, 'enabled');
                        Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
                            set: function set(value) {
                                origMSTEnabled.set.call(this, value);
                                var ev = new Event('enabled');
                                ev.enabled = value;
                                this.dispatchEvent(ev);
                            }
                        });
                    }
                }
                if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
                    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
                        get: function get() {
                            if (this._dtmf === undefined) {
                                if (this.track.kind === 'audio') {
                                    this._dtmf = new window.RTCDtmfSender(this);
                                } else if (this.track.kind === 'video') {
                                    this._dtmf = null;
                                }
                            }
                            return this._dtmf;
                        }
                    });
                }
                if (window.RTCDtmfSender && !window.RTCDTMFSender) {
                    window.RTCDTMFSender = window.RTCDtmfSender;
                }
                var RTCPeerConnectionShim = (0, _rtcpeerconnectionShim2.default)(window, browserDetails.version);
                window.RTCPeerConnection = function RTCPeerConnection(config) {
                    if (config && config.iceServers) {
                        config.iceServers = (0, _filtericeservers.filterIceServers)(config.iceServers, browserDetails.version);
                        utils.log('ICE servers after filtering:', config.iceServers);
                    }
                    return new RTCPeerConnectionShim(config);
                };
                window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
            }

            function shimReplaceTrack(window) {
                if (window.RTCRtpSender && !('replaceTrack' in window.RTCRtpSender.prototype)) {
                    window.RTCRtpSender.prototype.replaceTrack = window.RTCRtpSender.prototype.setTrack;
                }
            }
        }, {
            "../utils": 15,
            "./filtericeservers": 8,
            "./getdisplaymedia": 9,
            "./getusermedia": 10,
            "rtcpeerconnection-shim": 16
        }],
        8: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.filterIceServers = filterIceServers;
            var _utils = require('../utils');
            var utils = _interopRequireWildcard(_utils);

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                        }
                    }
                    newObj.default = obj;
                    return newObj;
                }
            }

            function filterIceServers(iceServers, edgeVersion) {
                var hasTurn = false;
                iceServers = JSON.parse(JSON.stringify(iceServers));
                return iceServers.filter(function(server) {
                    if (server && (server.urls || server.url)) {
                        var urls = server.urls || server.url;
                        if (server.url && !server.urls) {
                            utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
                        }
                        var isString = typeof urls === 'string';
                        if (isString) {
                            urls = [urls];
                        }
                        urls = urls.filter(function(url) {
                            if (url.indexOf('stun:') === 0) {
                                return false;
                            }
                            var validTurn = url.startsWith('turn') && !url.startsWith('turn:[') && url.includes('transport=udp');
                            if (validTurn && !hasTurn) {
                                hasTurn = true;
                                return true;
                            }
                            return validTurn && !hasTurn;
                        });
                        delete server.url;
                        server.urls = isString ? urls[0] : urls;
                        return !!urls.length;
                    }
                });
            }
        }, {
            "../utils": 15
        }],
        9: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.shimGetDisplayMedia = shimGetDisplayMedia;

            function shimGetDisplayMedia(window) {
                if (!('getDisplayMedia' in window.navigator)) {
                    return;
                }
                if (!window.navigator.mediaDevices) {
                    return;
                }
                if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
                    return;
                }
                window.navigator.mediaDevices.getDisplayMedia = window.navigator.getDisplayMedia.bind(window.navigator);
            }
        }, {}],
        10: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.shimGetUserMedia = shimGetUserMedia;

            function shimGetUserMedia(window) {
                var navigator = window && window.navigator;
                var shimError_ = function shimError_(e) {
                    return {
                        name: {
                            PermissionDeniedError: 'NotAllowedError'
                        } [e.name] || e.name,
                        message: e.message,
                        constraint: e.constraint,
                        toString: function toString() {
                            return this.name;
                        }
                    };
                };
                var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                navigator.mediaDevices.getUserMedia = function(c) {
                    return origGetUserMedia(c).catch(function(e) {
                        return Promise.reject(shimError_(e));
                    });
                };
            }
        }, {}],
        11: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            var _getusermedia = require('./getusermedia');
            Object.defineProperty(exports, 'shimGetUserMedia', {
                enumerable: true,
                get: function get() {
                    return _getusermedia.shimGetUserMedia;
                }
            });
            var _getdisplaymedia = require('./getdisplaymedia');
            Object.defineProperty(exports, 'shimGetDisplayMedia', {
                enumerable: true,
                get: function get() {
                    return _getdisplaymedia.shimGetDisplayMedia;
                }
            });
            exports.shimOnTrack = shimOnTrack;
            exports.shimPeerConnection = shimPeerConnection;
            exports.shimSenderGetStats = shimSenderGetStats;
            exports.shimReceiverGetStats = shimReceiverGetStats;
            exports.shimRemoveStream = shimRemoveStream;
            exports.shimRTCDataChannel = shimRTCDataChannel;
            exports.shimAddTransceiver = shimAddTransceiver;
            exports.shimGetParameters = shimGetParameters;
            exports.shimCreateOffer = shimCreateOffer;
            exports.shimCreateAnswer = shimCreateAnswer;
            var _utils = require('../utils');
            var utils = _interopRequireWildcard(_utils);

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                        }
                    }
                    newObj.default = obj;
                    return newObj;
                }
            }

            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    obj[key] = value;
                }
                return obj;
            }

            function shimOnTrack(window) {
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
                    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
                        get: function get() {
                            return {
                                receiver: this.receiver
                            };
                        }
                    });
                }
            }

            function shimPeerConnection(window) {
                var browserDetails = utils.detectBrowser(window);
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
                    return;
                }
                if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
                    window.RTCPeerConnection = window.mozRTCPeerConnection;
                }
                if (browserDetails.version < 53) {
                    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function(method) {
                        var nativeMethod = window.RTCPeerConnection.prototype[method];
                        var methodObj = _defineProperty({}, method, function() {
                            arguments[0] = new(method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
                            return nativeMethod.apply(this, arguments);
                        });
                        window.RTCPeerConnection.prototype[method] = methodObj[method];
                    });
                }
                if (browserDetails.version < 68) {
                    var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
                    window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
                        if (!arguments[0]) {
                            if (arguments[1]) {
                                arguments[1].apply(null);
                            }
                            return Promise.resolve();
                        }
                        if (arguments[0] && arguments[0].candidate === '') {
                            return Promise.resolve();
                        }
                        return nativeAddIceCandidate.apply(this, arguments);
                    };
                }
                var modernStatsTypes = {
                    inboundrtp: 'inbound-rtp',
                    outboundrtp: 'outbound-rtp',
                    candidatepair: 'candidate-pair',
                    localcandidate: 'local-candidate',
                    remotecandidate: 'remote-candidate'
                };
                var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
                window.RTCPeerConnection.prototype.getStats = function getStats() {
                    var _arguments = Array.prototype.slice.call(arguments),
                        selector = _arguments[0],
                        onSucc = _arguments[1],
                        onErr = _arguments[2];
                    return nativeGetStats.apply(this, [selector || null]).then(function(stats) {
                        if (browserDetails.version < 53 && !onSucc) {
                            try {
                                stats.forEach(function(stat) {
                                    stat.type = modernStatsTypes[stat.type] || stat.type;
                                });
                            } catch (e) {
                                if (e.name !== 'TypeError') {
                                    throw e;
                                }
                                stats.forEach(function(stat, i) {
                                    stats.set(i, Object.assign({}, stat, {
                                        type: modernStatsTypes[stat.type] || stat.type
                                    }));
                                });
                            }
                        }
                        return stats;
                    }).then(onSucc, onErr);
                };
            }

            function shimSenderGetStats(window) {
                if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
                    return;
                }
                if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
                    return;
                }
                var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
                if (origGetSenders) {
                    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
                        var _this = this;
                        var senders = origGetSenders.apply(this, []);
                        senders.forEach(function(sender) {
                            return sender._pc = _this;
                        });
                        return senders;
                    };
                }
                var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
                if (origAddTrack) {
                    window.RTCPeerConnection.prototype.addTrack = function addTrack() {
                        var sender = origAddTrack.apply(this, arguments);
                        sender._pc = this;
                        return sender;
                    };
                }
                window.RTCRtpSender.prototype.getStats = function getStats() {
                    return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
                };
            }

            function shimReceiverGetStats(window) {
                if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
                    return;
                }
                if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
                    return;
                }
                var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
                if (origGetReceivers) {
                    window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
                        var _this2 = this;
                        var receivers = origGetReceivers.apply(this, []);
                        receivers.forEach(function(receiver) {
                            return receiver._pc = _this2;
                        });
                        return receivers;
                    };
                }
                utils.wrapPeerConnectionEvent(window, 'track', function(e) {
                    e.receiver._pc = e.srcElement;
                    return e;
                });
                window.RTCRtpReceiver.prototype.getStats = function getStats() {
                    return this._pc.getStats(this.track);
                };
            }

            function shimRemoveStream(window) {
                if (!window.RTCPeerConnection || 'removeStream' in window.RTCPeerConnection.prototype) {
                    return;
                }
                window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
                    var _this3 = this;
                    utils.deprecated('removeStream', 'removeTrack');
                    this.getSenders().forEach(function(sender) {
                        if (sender.track && stream.getTracks().includes(sender.track)) {
                            _this3.removeTrack(sender);
                        }
                    });
                };
            }

            function shimRTCDataChannel(window) {
                if (window.DataChannel && !window.RTCDataChannel) {
                    window.RTCDataChannel = window.DataChannel;
                }
            }

            function shimAddTransceiver(window) {
                if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
                    return;
                }
                var origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
                if (origAddTransceiver) {
                    window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
                        this.setParametersPromises = [];
                        var initParameters = arguments[1];
                        var shouldPerformCheck = initParameters && 'sendEncodings' in initParameters;
                        if (shouldPerformCheck) {
                            initParameters.sendEncodings.forEach(function(encodingParam) {
                                if ('rid' in encodingParam) {
                                    var ridRegex = /^[a-z0-9]{0,16}$/i;
                                    if (!ridRegex.test(encodingParam.rid)) {
                                        throw new TypeError('Invalid RID value provided.');
                                    }
                                }
                                if ('scaleResolutionDownBy' in encodingParam) {
                                    if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                                        throw new RangeError('scale_resolution_down_by must be >= 1.0');
                                    }
                                }
                                if ('maxFramerate' in encodingParam) {
                                    if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                                        throw new RangeError('max_framerate must be >= 0.0');
                                    }
                                }
                            });
                        }
                        var transceiver = origAddTransceiver.apply(this, arguments);
                        if (shouldPerformCheck) {
                            var sender = transceiver.sender;
                            var params = sender.getParameters();
                            if (!('encodings' in params) || params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
                                params.encodings = initParameters.sendEncodings;
                                sender.sendEncodings = initParameters.sendEncodings;
                                this.setParametersPromises.push(sender.setParameters(params).then(function() {
                                    delete sender.sendEncodings;
                                }).catch(function() {
                                    delete sender.sendEncodings;
                                }));
                            }
                        }
                        return transceiver;
                    };
                }
            }

            function shimGetParameters(window) {
                if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCRtpSender)) {
                    return;
                }
                var origGetParameters = window.RTCRtpSender.prototype.getParameters;
                if (origGetParameters) {
                    window.RTCRtpSender.prototype.getParameters = function getParameters() {
                        var params = origGetParameters.apply(this, arguments);
                        if (!('encodings' in params)) {
                            params.encodings = [].concat(this.sendEncodings || [{}]);
                        }
                        return params;
                    };
                }
            }

            function shimCreateOffer(window) {
                if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
                    return;
                }
                var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
                window.RTCPeerConnection.prototype.createOffer = function createOffer() {
                    var _this4 = this,
                        _arguments2 = arguments;
                    if (this.setParametersPromises && this.setParametersPromises.length) {
                        return Promise.all(this.setParametersPromises).then(function() {
                            return origCreateOffer.apply(_this4, _arguments2);
                        }).finally(function() {
                            _this4.setParametersPromises = [];
                        });
                    }
                    return origCreateOffer.apply(this, arguments);
                };
            }

            function shimCreateAnswer(window) {
                if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
                    return;
                }
                var origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
                window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
                    var _this5 = this,
                        _arguments3 = arguments;
                    if (this.setParametersPromises && this.setParametersPromises.length) {
                        return Promise.all(this.setParametersPromises).then(function() {
                            return origCreateAnswer.apply(_this5, _arguments3);
                        }).finally(function() {
                            _this5.setParametersPromises = [];
                        });
                    }
                    return origCreateAnswer.apply(this, arguments);
                };
            }
        }, {
            "../utils": 15,
            "./getdisplaymedia": 12,
            "./getusermedia": 13
        }],
        12: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.shimGetDisplayMedia = shimGetDisplayMedia;

            function shimGetDisplayMedia(window, preferredMediaSource) {
                if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
                    return;
                }
                if (!window.navigator.mediaDevices) {
                    return;
                }
                window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
                    if (!(constraints && constraints.video)) {
                        var err = new DOMException('getDisplayMedia without video ' + 'constraints is undefined');
                        err.name = 'NotFoundError';
                        err.code = 8;
                        return Promise.reject(err);
                    }
                    if (constraints.video === true) {
                        constraints.video = {
                            mediaSource: preferredMediaSource
                        };
                    } else {
                        constraints.video.mediaSource = preferredMediaSource;
                    }
                    return window.navigator.mediaDevices.getUserMedia(constraints);
                };
            }
        }, {}],
        13: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            exports.shimGetUserMedia = shimGetUserMedia;
            var _utils = require('../utils');
            var utils = _interopRequireWildcard(_utils);

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                        }
                    }
                    newObj.default = obj;
                    return newObj;
                }
            }

            function shimGetUserMedia(window) {
                var browserDetails = utils.detectBrowser(window);
                var navigator = window && window.navigator;
                var MediaStreamTrack = window && window.MediaStreamTrack;
                navigator.getUserMedia = function(constraints, onSuccess, onError) {
                    utils.deprecated('navigator.getUserMedia', 'navigator.mediaDevices.getUserMedia');
                    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
                };
                if (!(browserDetails.version > 55 && 'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
                    var remap = function remap(obj, a, b) {
                        if (a in obj && !(b in obj)) {
                            obj[b] = obj[a];
                            delete obj[a];
                        }
                    };
                    var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getUserMedia = function(c) {
                        if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object' && _typeof(c.audio) === 'object') {
                            c = JSON.parse(JSON.stringify(c));
                            remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
                            remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
                        }
                        return nativeGetUserMedia(c);
                    };
                    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
                        var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
                        MediaStreamTrack.prototype.getSettings = function() {
                            var obj = nativeGetSettings.apply(this, arguments);
                            remap(obj, 'mozAutoGainControl', 'autoGainControl');
                            remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
                            return obj;
                        };
                    }
                    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
                        var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
                        MediaStreamTrack.prototype.applyConstraints = function(c) {
                            if (this.kind === 'audio' && (typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
                                c = JSON.parse(JSON.stringify(c));
                                remap(c, 'autoGainControl', 'mozAutoGainControl');
                                remap(c, 'noiseSuppression', 'mozNoiseSuppression');
                            }
                            return nativeApplyConstraints.apply(this, [c]);
                        };
                    }
                }
            }
        }, {
            "../utils": 15
        }],
        14: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            exports.shimLocalStreamsAPI = shimLocalStreamsAPI;
            exports.shimRemoteStreamsAPI = shimRemoteStreamsAPI;
            exports.shimCallbacksAPI = shimCallbacksAPI;
            exports.shimGetUserMedia = shimGetUserMedia;
            exports.shimConstraints = shimConstraints;
            exports.shimRTCIceServerUrls = shimRTCIceServerUrls;
            exports.shimTrackEventTransceiver = shimTrackEventTransceiver;
            exports.shimCreateOfferLegacy = shimCreateOfferLegacy;
            exports.shimAudioContext = shimAudioContext;
            var _utils = require('../utils');
            var utils = _interopRequireWildcard(_utils);

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                        }
                    }
                    newObj.default = obj;
                    return newObj;
                }
            }

            function shimLocalStreamsAPI(window) {
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
                    return;
                }
                if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
                    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
                        if (!this._localStreams) {
                            this._localStreams = [];
                        }
                        return this._localStreams;
                    };
                }
                if (!('addStream' in window.RTCPeerConnection.prototype)) {
                    var _addTrack = window.RTCPeerConnection.prototype.addTrack;
                    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
                        var _this = this;
                        if (!this._localStreams) {
                            this._localStreams = [];
                        }
                        if (!this._localStreams.includes(stream)) {
                            this._localStreams.push(stream);
                        }
                        stream.getAudioTracks().forEach(function(track) {
                            return _addTrack.call(_this, track, stream);
                        });
                        stream.getVideoTracks().forEach(function(track) {
                            return _addTrack.call(_this, track, stream);
                        });
                    };
                    window.RTCPeerConnection.prototype.addTrack = function addTrack(track) {
                        var _this2 = this;
                        for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                            streams[_key - 1] = arguments[_key];
                        }
                        if (streams) {
                            streams.forEach(function(stream) {
                                if (!_this2._localStreams) {
                                    _this2._localStreams = [stream];
                                } else if (!_this2._localStreams.includes(stream)) {
                                    _this2._localStreams.push(stream);
                                }
                            });
                        }
                        return _addTrack.apply(this, arguments);
                    };
                }
                if (!('removeStream' in window.RTCPeerConnection.prototype)) {
                    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
                        var _this3 = this;
                        if (!this._localStreams) {
                            this._localStreams = [];
                        }
                        var index = this._localStreams.indexOf(stream);
                        if (index === -1) {
                            return;
                        }
                        this._localStreams.splice(index, 1);
                        var tracks = stream.getTracks();
                        this.getSenders().forEach(function(sender) {
                            if (tracks.includes(sender.track)) {
                                _this3.removeTrack(sender);
                            }
                        });
                    };
                }
            }

            function shimRemoteStreamsAPI(window) {
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
                    return;
                }
                if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
                    window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
                        return this._remoteStreams ? this._remoteStreams : [];
                    };
                }
                if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
                    Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
                        get: function get() {
                            return this._onaddstream;
                        },
                        set: function set(f) {
                            var _this4 = this;
                            if (this._onaddstream) {
                                this.removeEventListener('addstream', this._onaddstream);
                                this.removeEventListener('track', this._onaddstreampoly);
                            }
                            this.addEventListener('addstream', this._onaddstream = f);
                            this.addEventListener('track', this._onaddstreampoly = function(e) {
                                e.streams.forEach(function(stream) {
                                    if (!_this4._remoteStreams) {
                                        _this4._remoteStreams = [];
                                    }
                                    if (_this4._remoteStreams.includes(stream)) {
                                        return;
                                    }
                                    _this4._remoteStreams.push(stream);
                                    var event = new Event('addstream');
                                    event.stream = stream;
                                    _this4.dispatchEvent(event);
                                });
                            });
                        }
                    });
                    var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
                    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
                        var pc = this;
                        if (!this._onaddstreampoly) {
                            this.addEventListener('track', this._onaddstreampoly = function(e) {
                                e.streams.forEach(function(stream) {
                                    if (!pc._remoteStreams) {
                                        pc._remoteStreams = [];
                                    }
                                    if (pc._remoteStreams.indexOf(stream) >= 0) {
                                        return;
                                    }
                                    pc._remoteStreams.push(stream);
                                    var event = new Event('addstream');
                                    event.stream = stream;
                                    pc.dispatchEvent(event);
                                });
                            });
                        }
                        return origSetRemoteDescription.apply(pc, arguments);
                    };
                }
            }

            function shimCallbacksAPI(window) {
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
                    return;
                }
                var prototype = window.RTCPeerConnection.prototype;
                var origCreateOffer = prototype.createOffer;
                var origCreateAnswer = prototype.createAnswer;
                var setLocalDescription = prototype.setLocalDescription;
                var setRemoteDescription = prototype.setRemoteDescription;
                var addIceCandidate = prototype.addIceCandidate;
                prototype.createOffer = function createOffer(successCallback, failureCallback) {
                    var options = arguments.length >= 2 ? arguments[2] : arguments[0];
                    var promise = origCreateOffer.apply(this, [options]);
                    if (!failureCallback) {
                        return promise;
                    }
                    promise.then(successCallback, failureCallback);
                    return Promise.resolve();
                };
                prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
                    var options = arguments.length >= 2 ? arguments[2] : arguments[0];
                    var promise = origCreateAnswer.apply(this, [options]);
                    if (!failureCallback) {
                        return promise;
                    }
                    promise.then(successCallback, failureCallback);
                    return Promise.resolve();
                };
                var withCallback = function withCallback(description, successCallback, failureCallback) {
                    var promise = setLocalDescription.apply(this, [description]);
                    if (!failureCallback) {
                        return promise;
                    }
                    promise.then(successCallback, failureCallback);
                    return Promise.resolve();
                };
                prototype.setLocalDescription = withCallback;
                withCallback = function withCallback(description, successCallback, failureCallback) {
                    var promise = setRemoteDescription.apply(this, [description]);
                    if (!failureCallback) {
                        return promise;
                    }
                    promise.then(successCallback, failureCallback);
                    return Promise.resolve();
                };
                prototype.setRemoteDescription = withCallback;
                withCallback = function withCallback(candidate, successCallback, failureCallback) {
                    var promise = addIceCandidate.apply(this, [candidate]);
                    if (!failureCallback) {
                        return promise;
                    }
                    promise.then(successCallback, failureCallback);
                    return Promise.resolve();
                };
                prototype.addIceCandidate = withCallback;
            }

            function shimGetUserMedia(window) {
                var navigator = window && window.navigator;
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    var mediaDevices = navigator.mediaDevices;
                    var _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
                    navigator.mediaDevices.getUserMedia = function(constraints) {
                        return _getUserMedia(shimConstraints(constraints));
                    };
                }
                if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
                        navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
                    }.bind(navigator);
                }
            }

            function shimConstraints(constraints) {
                if (constraints && constraints.video !== undefined) {
                    return Object.assign({}, constraints, {
                        video: utils.compactObject(constraints.video)
                    });
                }
                return constraints;
            }

            function shimRTCIceServerUrls(window) {
                if (!window.RTCPeerConnection) {
                    return;
                }
                var OrigPeerConnection = window.RTCPeerConnection;
                window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
                    if (pcConfig && pcConfig.iceServers) {
                        var newIceServers = [];
                        for (var i = 0; i < pcConfig.iceServers.length; i++) {
                            var server = pcConfig.iceServers[i];
                            if (!server.hasOwnProperty('urls') && server.hasOwnProperty('url')) {
                                utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
                                server = JSON.parse(JSON.stringify(server));
                                server.urls = server.url;
                                delete server.url;
                                newIceServers.push(server);
                            } else {
                                newIceServers.push(pcConfig.iceServers[i]);
                            }
                        }
                        pcConfig.iceServers = newIceServers;
                    }
                    return new OrigPeerConnection(pcConfig, pcConstraints);
                };
                window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
                if ('generateCertificate' in OrigPeerConnection) {
                    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
                        get: function get() {
                            return OrigPeerConnection.generateCertificate;
                        }
                    });
                }
            }

            function shimTrackEventTransceiver(window) {
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
                    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
                        get: function get() {
                            return {
                                receiver: this.receiver
                            };
                        }
                    });
                }
            }

            function shimCreateOfferLegacy(window) {
                var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
                window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
                    if (offerOptions) {
                        if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
                            offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
                        }
                        var audioTransceiver = this.getTransceivers().find(function(transceiver) {
                            return transceiver.receiver.track.kind === 'audio';
                        });
                        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
                            if (audioTransceiver.direction === 'sendrecv') {
                                if (audioTransceiver.setDirection) {
                                    audioTransceiver.setDirection('sendonly');
                                } else {
                                    audioTransceiver.direction = 'sendonly';
                                }
                            } else if (audioTransceiver.direction === 'recvonly') {
                                if (audioTransceiver.setDirection) {
                                    audioTransceiver.setDirection('inactive');
                                } else {
                                    audioTransceiver.direction = 'inactive';
                                }
                            }
                        } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
                            this.addTransceiver('audio');
                        }
                        if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
                            offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
                        }
                        var videoTransceiver = this.getTransceivers().find(function(transceiver) {
                            return transceiver.receiver.track.kind === 'video';
                        });
                        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
                            if (videoTransceiver.direction === 'sendrecv') {
                                if (videoTransceiver.setDirection) {
                                    videoTransceiver.setDirection('sendonly');
                                } else {
                                    videoTransceiver.direction = 'sendonly';
                                }
                            } else if (videoTransceiver.direction === 'recvonly') {
                                if (videoTransceiver.setDirection) {
                                    videoTransceiver.setDirection('inactive');
                                } else {
                                    videoTransceiver.direction = 'inactive';
                                }
                            }
                        } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
                            this.addTransceiver('video');
                        }
                    }
                    return origCreateOffer.apply(this, arguments);
                };
            }

            function shimAudioContext(window) {
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || window.AudioContext) {
                    return;
                }
                window.AudioContext = window.webkitAudioContext;
            }
        }, {
            "../utils": 15
        }],
        15: [function(require, module, exports) {
            'use strict';
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            exports.extractVersion = extractVersion;
            exports.wrapPeerConnectionEvent = wrapPeerConnectionEvent;
            exports.disableLog = disableLog;
            exports.disableWarnings = disableWarnings;
            exports.log = log;
            exports.deprecated = deprecated;
            exports.detectBrowser = detectBrowser;
            exports.compactObject = compactObject;
            exports.walkStats = walkStats;
            exports.filterStats = filterStats;

            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    obj[key] = value;
                }
                return obj;
            }
            var logDisabled_ = true;
            var deprecationWarnings_ = true;

            function extractVersion(uastring, expr, pos) {
                var match = uastring.match(expr);
                return match && match.length >= pos && parseInt(match[pos], 10);
            }

            function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
                if (!window.RTCPeerConnection) {
                    return;
                }
                var proto = window.RTCPeerConnection.prototype;
                var nativeAddEventListener = proto.addEventListener;
                proto.addEventListener = function(nativeEventName, cb) {
                    if (nativeEventName !== eventNameToWrap) {
                        return nativeAddEventListener.apply(this, arguments);
                    }
                    var wrappedCallback = function wrappedCallback(e) {
                        var modifiedEvent = wrapper(e);
                        if (modifiedEvent) {
                            if (cb.handleEvent) {
                                cb.handleEvent(modifiedEvent);
                            } else {
                                cb(modifiedEvent);
                            }
                        }
                    };
                    this._eventMap = this._eventMap || {};
                    if (!this._eventMap[eventNameToWrap]) {
                        this._eventMap[eventNameToWrap] = new Map();
                    }
                    this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
                    return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
                };
                var nativeRemoveEventListener = proto.removeEventListener;
                proto.removeEventListener = function(nativeEventName, cb) {
                    if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
                        return nativeRemoveEventListener.apply(this, arguments);
                    }
                    if (!this._eventMap[eventNameToWrap].has(cb)) {
                        return nativeRemoveEventListener.apply(this, arguments);
                    }
                    var unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
                    this._eventMap[eventNameToWrap].delete(cb);
                    if (this._eventMap[eventNameToWrap].size === 0) {
                        delete this._eventMap[eventNameToWrap];
                    }
                    if (Object.keys(this._eventMap).length === 0) {
                        delete this._eventMap;
                    }
                    return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
                };
                Object.defineProperty(proto, 'on' + eventNameToWrap, {
                    get: function get() {
                        return this['_on' + eventNameToWrap];
                    },
                    set: function set(cb) {
                        if (this['_on' + eventNameToWrap]) {
                            this.removeEventListener(eventNameToWrap, this['_on' + eventNameToWrap]);
                            delete this['_on' + eventNameToWrap];
                        }
                        if (cb) {
                            this.addEventListener(eventNameToWrap, this['_on' + eventNameToWrap] = cb);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
            }

            function disableLog(bool) {
                if (typeof bool !== 'boolean') {
                    return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
                }
                logDisabled_ = bool;
                return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
            }

            function disableWarnings(bool) {
                if (typeof bool !== 'boolean') {
                    return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
                }
                deprecationWarnings_ = !bool;
                return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
            }

            function log() {
                if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
                    if (logDisabled_) {
                        return;
                    }
                    if (typeof console !== 'undefined' && typeof console.log === 'function') {
                        console.log.apply(console, arguments);
                    }
                }
            }

            function deprecated(oldMethod, newMethod) {
                if (!deprecationWarnings_) {
                    return;
                }
                console.warn(oldMethod + ' is deprecated, please use ' + newMethod + ' instead.');
            }

            function detectBrowser(window) {
                var result = {
                    browser: null,
                    version: null
                };
                if (typeof window === 'undefined' || !window.navigator) {
                    result.browser = 'Not a browser.';
                    return result;
                }
                var navigator = window.navigator;
                if (navigator.mozGetUserMedia) {
                    result.browser = 'firefox';
                    result.version = extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
                } else if (navigator.webkitGetUserMedia || window.isSecureContext === false && window.webkitRTCPeerConnection && !window.RTCIceGatherer) {
                    result.browser = 'chrome';
                    result.version = extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
                } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
                    result.browser = 'edge';
                    result.version = extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);
                } else if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
                    result.browser = 'safari';
                    result.version = extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
                    result.supportsUnifiedPlan = window.RTCRtpTransceiver && 'currentDirection' in window.RTCRtpTransceiver.prototype;
                } else {
                    result.browser = 'Not a supported browser.';
                    return result;
                }
                return result;
            }

            function isObject(val) {
                return Object.prototype.toString.call(val) === '[object Object]';
            }

            function compactObject(data) {
                if (!isObject(data)) {
                    return data;
                }
                return Object.keys(data).reduce(function(accumulator, key) {
                    var isObj = isObject(data[key]);
                    var value = isObj ? compactObject(data[key]) : data[key];
                    var isEmptyObject = isObj && !Object.keys(value).length;
                    if (value === undefined || isEmptyObject) {
                        return accumulator;
                    }
                    return Object.assign(accumulator, _defineProperty({}, key, value));
                }, {});
            }

            function walkStats(stats, base, resultSet) {
                if (!base || resultSet.has(base.id)) {
                    return;
                }
                resultSet.set(base.id, base);
                Object.keys(base).forEach(function(name) {
                    if (name.endsWith('Id')) {
                        walkStats(stats, stats.get(base[name]), resultSet);
                    } else if (name.endsWith('Ids')) {
                        base[name].forEach(function(id) {
                            walkStats(stats, stats.get(id), resultSet);
                        });
                    }
                });
            }

            function filterStats(result, track, outbound) {
                var streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
                var filteredResult = new Map();
                if (track === null) {
                    return filteredResult;
                }
                var trackStats = [];
                result.forEach(function(value) {
                    if (value.type === 'track' && value.trackIdentifier === track.id) {
                        trackStats.push(value);
                    }
                });
                trackStats.forEach(function(trackStat) {
                    result.forEach(function(stats) {
                        if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
                            walkStats(result, stats, filteredResult);
                        }
                    });
                });
                return filteredResult;
            }
        }, {}],
        16: [function(require, module, exports) {
            'use strict';
            var SDPUtils = require('sdp');

            function fixStatsType(stat) {
                return {
                    inboundrtp: 'inbound-rtp',
                    outboundrtp: 'outbound-rtp',
                    candidatepair: 'candidate-pair',
                    localcandidate: 'local-candidate',
                    remotecandidate: 'remote-candidate'
                } [stat.type] || stat.type;
            }

            function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
                var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
                sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters());
                sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === 'offer' ? 'actpass' : dtlsRole || 'active');
                sdp += 'a=mid:' + transceiver.mid + '\r\n';
                if (transceiver.rtpSender && transceiver.rtpReceiver) {
                    sdp += 'a=sendrecv\r\n';
                } else if (transceiver.rtpSender) {
                    sdp += 'a=sendonly\r\n';
                } else if (transceiver.rtpReceiver) {
                    sdp += 'a=recvonly\r\n';
                } else {
                    sdp += 'a=inactive\r\n';
                }
                if (transceiver.rtpSender) {
                    var trackId = transceiver.rtpSender._initialTrackId || transceiver.rtpSender.track.id;
                    transceiver.rtpSender._initialTrackId = trackId;
                    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
                        trackId + '\r\n';
                    sdp += 'a=' + msid;
                    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
                        ' ' + msid;
                    if (transceiver.sendEncodingParameters[0].rtx) {
                        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
                            ' ' + msid;
                        sdp += 'a=ssrc-group:FID ' +
                            transceiver.sendEncodingParameters[0].ssrc + ' ' +
                            transceiver.sendEncodingParameters[0].rtx.ssrc +
                            '\r\n';
                    }
                }
                sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
                    ' cname:' + SDPUtils.localCName + '\r\n';
                if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
                    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
                        ' cname:' + SDPUtils.localCName + '\r\n';
                }
                return sdp;
            }

            function filterIceServers(iceServers, edgeVersion) {
                var hasTurn = false;
                iceServers = JSON.parse(JSON.stringify(iceServers));
                return iceServers.filter(function(server) {
                    if (server && (server.urls || server.url)) {
                        var urls = server.urls || server.url;
                        if (server.url && !server.urls) {
                            console.warn('RTCIceServer.url is deprecated! Use urls instead.');
                        }
                        var isString = typeof urls === 'string';
                        if (isString) {
                            urls = [urls];
                        }
                        urls = urls.filter(function(url) {
                            var validTurn = url.indexOf('turn:') === 0 && url.indexOf('transport=udp') !== -1 && url.indexOf('turn:[') === -1 && !hasTurn;
                            if (validTurn) {
                                hasTurn = true;
                                return true;
                            }
                            return url.indexOf('stun:') === 0 && edgeVersion >= 14393 && url.indexOf('?transport=udp') === -1;
                        });
                        delete server.url;
                        server.urls = isString ? urls[0] : urls;
                        return !!urls.length;
                    }
                });
            }

            function getCommonCapabilities(localCapabilities, remoteCapabilities) {
                var commonCapabilities = {
                    codecs: [],
                    headerExtensions: [],
                    fecMechanisms: []
                };
                var findCodecByPayloadType = function(pt, codecs) {
                    pt = parseInt(pt, 10);
                    for (var i = 0; i < codecs.length; i++) {
                        if (codecs[i].payloadType === pt || codecs[i].preferredPayloadType === pt) {
                            return codecs[i];
                        }
                    }
                };
                var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
                    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
                    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
                    return lCodec && rCodec && lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
                };
                localCapabilities.codecs.forEach(function(lCodec) {
                    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
                        var rCodec = remoteCapabilities.codecs[i];
                        if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() && lCodec.clockRate === rCodec.clockRate) {
                            if (lCodec.name.toLowerCase() === 'rtx' && lCodec.parameters && rCodec.parameters.apt) {
                                if (!rtxCapabilityMatches(lCodec, rCodec, localCapabilities.codecs, remoteCapabilities.codecs)) {
                                    continue;
                                }
                            }
                            rCodec = JSON.parse(JSON.stringify(rCodec));
                            rCodec.numChannels = Math.min(lCodec.numChannels, rCodec.numChannels);
                            commonCapabilities.codecs.push(rCodec);
                            rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
                                for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                                    if (lCodec.rtcpFeedback[j].type === fb.type && lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                                        return true;
                                    }
                                }
                                return false;
                            });
                            break;
                        }
                    }
                });
                localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
                    for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
                        var rHeaderExtension = remoteCapabilities.headerExtensions[i];
                        if (lHeaderExtension.uri === rHeaderExtension.uri) {
                            commonCapabilities.headerExtensions.push(rHeaderExtension);
                            break;
                        }
                    }
                });
                return commonCapabilities;
            }

            function isActionAllowedInSignalingState(action, type, signalingState) {
                return {
                    offer: {
                        setLocalDescription: ['stable', 'have-local-offer'],
                        setRemoteDescription: ['stable', 'have-remote-offer']
                    },
                    answer: {
                        setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
                        setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
                    }
                } [type][action].indexOf(signalingState) !== -1;
            }

            function maybeAddCandidate(iceTransport, candidate) {
                var alreadyAdded = iceTransport.getRemoteCandidates().find(function(remoteCandidate) {
                    return candidate.foundation === remoteCandidate.foundation && candidate.ip === remoteCandidate.ip && candidate.port === remoteCandidate.port && candidate.priority === remoteCandidate.priority && candidate.protocol === remoteCandidate.protocol && candidate.type === remoteCandidate.type;
                });
                if (!alreadyAdded) {
                    iceTransport.addRemoteCandidate(candidate);
                }
                return !alreadyAdded;
            }

            function makeError(name, description) {
                var e = new Error(description);
                e.name = name;
                e.code = {
                    NotSupportedError: 9,
                    InvalidStateError: 11,
                    InvalidAccessError: 15,
                    TypeError: undefined,
                    OperationError: undefined
                } [name];
                return e;
            }
            module.exports = function(window, edgeVersion) {
                function addTrackToStreamAndFireEvent(track, stream) {
                    stream.addTrack(track);
                    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack', {
                        track: track
                    }));
                }

                function removeTrackFromStreamAndFireEvent(track, stream) {
                    stream.removeTrack(track);
                    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack', {
                        track: track
                    }));
                }

                function fireAddTrack(pc, track, receiver, streams) {
                    var trackEvent = new Event('track');
                    trackEvent.track = track;
                    trackEvent.receiver = receiver;
                    trackEvent.transceiver = {
                        receiver: receiver
                    };
                    trackEvent.streams = streams;
                    window.setTimeout(function() {
                        pc._dispatchEvent('track', trackEvent);
                    });
                }
                var RTCPeerConnection = function(config) {
                    var pc = this;
                    var _eventTarget = document.createDocumentFragment();
                    ['addEventListener', 'removeEventListener', 'dispatchEvent'].forEach(function(method) {
                        pc[method] = _eventTarget[method].bind(_eventTarget);
                    });
                    this.canTrickleIceCandidates = null;
                    this.needNegotiation = false;
                    this.localStreams = [];
                    this.remoteStreams = [];
                    this._localDescription = null;
                    this._remoteDescription = null;
                    this.signalingState = 'stable';
                    this.iceConnectionState = 'new';
                    this.connectionState = 'new';
                    this.iceGatheringState = 'new';
                    config = JSON.parse(JSON.stringify(config || {}));
                    this.usingBundle = config.bundlePolicy === 'max-bundle';
                    if (config.rtcpMuxPolicy === 'negotiate') {
                        throw (makeError('NotSupportedError', 'rtcpMuxPolicy \'negotiate\' is not supported'));
                    } else if (!config.rtcpMuxPolicy) {
                        config.rtcpMuxPolicy = 'require';
                    }
                    switch (config.iceTransportPolicy) {
                        case 'all':
                        case 'relay':
                            break;
                        default:
                            config.iceTransportPolicy = 'all';
                            break;
                    }
                    switch (config.bundlePolicy) {
                        case 'balanced':
                        case 'max-compat':
                        case 'max-bundle':
                            break;
                        default:
                            config.bundlePolicy = 'balanced';
                            break;
                    }
                    config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);
                    this._iceGatherers = [];
                    if (config.iceCandidatePoolSize) {
                        for (var i = config.iceCandidatePoolSize; i > 0; i--) {
                            this._iceGatherers.push(new window.RTCIceGatherer({
                                iceServers: config.iceServers,
                                gatherPolicy: config.iceTransportPolicy
                            }));
                        }
                    } else {
                        config.iceCandidatePoolSize = 0;
                    }
                    this._config = config;
                    this.transceivers = [];
                    this._sdpSessionId = SDPUtils.generateSessionId();
                    this._sdpSessionVersion = 0;
                    this._dtlsRole = undefined;
                    this._isClosed = false;
                };
                Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
                    configurable: true,
                    get: function() {
                        return this._localDescription;
                    }
                });
                Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
                    configurable: true,
                    get: function() {
                        return this._remoteDescription;
                    }
                });
                RTCPeerConnection.prototype.onicecandidate = null;
                RTCPeerConnection.prototype.onaddstream = null;
                RTCPeerConnection.prototype.ontrack = null;
                RTCPeerConnection.prototype.onremovestream = null;
                RTCPeerConnection.prototype.onsignalingstatechange = null;
                RTCPeerConnection.prototype.oniceconnectionstatechange = null;
                RTCPeerConnection.prototype.onconnectionstatechange = null;
                RTCPeerConnection.prototype.onicegatheringstatechange = null;
                RTCPeerConnection.prototype.onnegotiationneeded = null;
                RTCPeerConnection.prototype.ondatachannel = null;
                RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
                    if (this._isClosed) {
                        return;
                    }
                    this.dispatchEvent(event);
                    if (typeof this['on' + name] === 'function') {
                        this['on' + name](event);
                    }
                };
                RTCPeerConnection.prototype._emitGatheringStateChange = function() {
                    var event = new Event('icegatheringstatechange');
                    this._dispatchEvent('icegatheringstatechange', event);
                };
                RTCPeerConnection.prototype.getConfiguration = function() {
                    return this._config;
                };
                RTCPeerConnection.prototype.getLocalStreams = function() {
                    return this.localStreams;
                };
                RTCPeerConnection.prototype.getRemoteStreams = function() {
                    return this.remoteStreams;
                };
                RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
                    var hasBundleTransport = this.transceivers.length > 0;
                    var transceiver = {
                        track: null,
                        iceGatherer: null,
                        iceTransport: null,
                        dtlsTransport: null,
                        localCapabilities: null,
                        remoteCapabilities: null,
                        rtpSender: null,
                        rtpReceiver: null,
                        kind: kind,
                        mid: null,
                        sendEncodingParameters: null,
                        recvEncodingParameters: null,
                        stream: null,
                        associatedRemoteMediaStreams: [],
                        wantReceive: true
                    };
                    if (this.usingBundle && hasBundleTransport) {
                        transceiver.iceTransport = this.transceivers[0].iceTransport;
                        transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
                    } else {
                        var transports = this._createIceAndDtlsTransports();
                        transceiver.iceTransport = transports.iceTransport;
                        transceiver.dtlsTransport = transports.dtlsTransport;
                    }
                    if (!doNotAdd) {
                        this.transceivers.push(transceiver);
                    }
                    return transceiver;
                };
                RTCPeerConnection.prototype.addTrack = function(track, stream) {
                    if (this._isClosed) {
                        throw makeError('InvalidStateError', 'Attempted to call addTrack on a closed peerconnection.');
                    }
                    var alreadyExists = this.transceivers.find(function(s) {
                        return s.track === track;
                    });
                    if (alreadyExists) {
                        throw makeError('InvalidAccessError', 'Track already exists.');
                    }
                    var transceiver;
                    for (var i = 0; i < this.transceivers.length; i++) {
                        if (!this.transceivers[i].track && this.transceivers[i].kind === track.kind) {
                            transceiver = this.transceivers[i];
                        }
                    }
                    if (!transceiver) {
                        transceiver = this._createTransceiver(track.kind);
                    }
                    this._maybeFireNegotiationNeeded();
                    if (this.localStreams.indexOf(stream) === -1) {
                        this.localStreams.push(stream);
                    }
                    transceiver.track = track;
                    transceiver.stream = stream;
                    transceiver.rtpSender = new window.RTCRtpSender(track, transceiver.dtlsTransport);
                    return transceiver.rtpSender;
                };
                RTCPeerConnection.prototype.addStream = function(stream) {
                    var pc = this;
                    if (edgeVersion >= 15025) {
                        stream.getTracks().forEach(function(track) {
                            pc.addTrack(track, stream);
                        });
                    } else {
                        var clonedStream = stream.clone();
                        stream.getTracks().forEach(function(track, idx) {
                            var clonedTrack = clonedStream.getTracks()[idx];
                            track.addEventListener('enabled', function(event) {
                                clonedTrack.enabled = event.enabled;
                            });
                        });
                        clonedStream.getTracks().forEach(function(track) {
                            pc.addTrack(track, clonedStream);
                        });
                    }
                };
                RTCPeerConnection.prototype.removeTrack = function(sender) {
                    if (this._isClosed) {
                        throw makeError('InvalidStateError', 'Attempted to call removeTrack on a closed peerconnection.');
                    }
                    if (!(sender instanceof window.RTCRtpSender)) {
                        throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
                            'does not implement interface RTCRtpSender.');
                    }
                    var transceiver = this.transceivers.find(function(t) {
                        return t.rtpSender === sender;
                    });
                    if (!transceiver) {
                        throw makeError('InvalidAccessError', 'Sender was not created by this connection.');
                    }
                    var stream = transceiver.stream;
                    transceiver.rtpSender.stop();
                    transceiver.rtpSender = null;
                    transceiver.track = null;
                    transceiver.stream = null;
                    var localStreams = this.transceivers.map(function(t) {
                        return t.stream;
                    });
                    if (localStreams.indexOf(stream) === -1 && this.localStreams.indexOf(stream) > -1) {
                        this.localStreams.splice(this.localStreams.indexOf(stream), 1);
                    }
                    this._maybeFireNegotiationNeeded();
                };
                RTCPeerConnection.prototype.removeStream = function(stream) {
                    var pc = this;
                    stream.getTracks().forEach(function(track) {
                        var sender = pc.getSenders().find(function(s) {
                            return s.track === track;
                        });
                        if (sender) {
                            pc.removeTrack(sender);
                        }
                    });
                };
                RTCPeerConnection.prototype.getSenders = function() {
                    return this.transceivers.filter(function(transceiver) {
                        return !!transceiver.rtpSender;
                    }).map(function(transceiver) {
                        return transceiver.rtpSender;
                    });
                };
                RTCPeerConnection.prototype.getReceivers = function() {
                    return this.transceivers.filter(function(transceiver) {
                        return !!transceiver.rtpReceiver;
                    }).map(function(transceiver) {
                        return transceiver.rtpReceiver;
                    });
                };
                RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex, usingBundle) {
                    var pc = this;
                    if (usingBundle && sdpMLineIndex > 0) {
                        return this.transceivers[0].iceGatherer;
                    } else if (this._iceGatherers.length) {
                        return this._iceGatherers.shift();
                    }
                    var iceGatherer = new window.RTCIceGatherer({
                        iceServers: this._config.iceServers,
                        gatherPolicy: this._config.iceTransportPolicy
                    });
                    Object.defineProperty(iceGatherer, 'state', {
                        value: 'new',
                        writable: true
                    });
                    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
                    this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
                        var end = !event.candidate || Object.keys(event.candidate).length === 0;
                        iceGatherer.state = end ? 'completed' : 'gathering';
                        if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
                            pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
                        }
                    };
                    iceGatherer.addEventListener('localcandidate', this.transceivers[sdpMLineIndex].bufferCandidates);
                    return iceGatherer;
                };
                RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
                    var pc = this;
                    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
                    if (iceGatherer.onlocalcandidate) {
                        return;
                    }
                    var bufferedCandidateEvents = this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
                    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
                    iceGatherer.removeEventListener('localcandidate', this.transceivers[sdpMLineIndex].bufferCandidates);
                    iceGatherer.onlocalcandidate = function(evt) {
                        if (pc.usingBundle && sdpMLineIndex > 0) {
                            return;
                        }
                        var event = new Event('icecandidate');
                        event.candidate = {
                            sdpMid: mid,
                            sdpMLineIndex: sdpMLineIndex
                        };
                        var cand = evt.candidate;
                        var end = !cand || Object.keys(cand).length === 0;
                        if (end) {
                            if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
                                iceGatherer.state = 'completed';
                            }
                        } else {
                            if (iceGatherer.state === 'new') {
                                iceGatherer.state = 'gathering';
                            }
                            cand.component = 1;
                            cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;
                            var serializedCandidate = SDPUtils.writeCandidate(cand);
                            event.candidate = Object.assign(event.candidate, SDPUtils.parseCandidate(serializedCandidate));
                            event.candidate.candidate = serializedCandidate;
                            event.candidate.toJSON = function() {
                                return {
                                    candidate: event.candidate.candidate,
                                    sdpMid: event.candidate.sdpMid,
                                    sdpMLineIndex: event.candidate.sdpMLineIndex,
                                    usernameFragment: event.candidate.usernameFragment
                                };
                            };
                        }
                        var sections = SDPUtils.getMediaSections(pc._localDescription.sdp);
                        if (!end) {
                            sections[event.candidate.sdpMLineIndex] += 'a=' + event.candidate.candidate + '\r\n';
                        } else {
                            sections[event.candidate.sdpMLineIndex] += 'a=end-of-candidates\r\n';
                        }
                        pc._localDescription.sdp = SDPUtils.getDescription(pc._localDescription.sdp) +
                            sections.join('');
                        var complete = pc.transceivers.every(function(transceiver) {
                            return transceiver.iceGatherer && transceiver.iceGatherer.state === 'completed';
                        });
                        if (pc.iceGatheringState !== 'gathering') {
                            pc.iceGatheringState = 'gathering';
                            pc._emitGatheringStateChange();
                        }
                        if (!end) {
                            pc._dispatchEvent('icecandidate', event);
                        }
                        if (complete) {
                            pc._dispatchEvent('icecandidate', new Event('icecandidate'));
                            pc.iceGatheringState = 'complete';
                            pc._emitGatheringStateChange();
                        }
                    };
                    window.setTimeout(function() {
                        bufferedCandidateEvents.forEach(function(e) {
                            iceGatherer.onlocalcandidate(e);
                        });
                    }, 0);
                };
                RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
                    var pc = this;
                    var iceTransport = new window.RTCIceTransport(null);
                    iceTransport.onicestatechange = function() {
                        pc._updateIceConnectionState();
                        pc._updateConnectionState();
                    };
                    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
                    dtlsTransport.ondtlsstatechange = function() {
                        pc._updateConnectionState();
                    };
                    dtlsTransport.onerror = function() {
                        Object.defineProperty(dtlsTransport, 'state', {
                            value: 'failed',
                            writable: true
                        });
                        pc._updateConnectionState();
                    };
                    return {
                        iceTransport: iceTransport,
                        dtlsTransport: dtlsTransport
                    };
                };
                RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(sdpMLineIndex) {
                    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
                    if (iceGatherer) {
                        delete iceGatherer.onlocalcandidate;
                        delete this.transceivers[sdpMLineIndex].iceGatherer;
                    }
                    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
                    if (iceTransport) {
                        delete iceTransport.onicestatechange;
                        delete this.transceivers[sdpMLineIndex].iceTransport;
                    }
                    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
                    if (dtlsTransport) {
                        delete dtlsTransport.ondtlsstatechange;
                        delete dtlsTransport.onerror;
                        delete this.transceivers[sdpMLineIndex].dtlsTransport;
                    }
                };
                RTCPeerConnection.prototype._transceive = function(transceiver, send, recv) {
                    var params = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
                    if (send && transceiver.rtpSender) {
                        params.encodings = transceiver.sendEncodingParameters;
                        params.rtcp = {
                            cname: SDPUtils.localCName,
                            compound: transceiver.rtcpParameters.compound
                        };
                        if (transceiver.recvEncodingParameters.length) {
                            params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
                        }
                        transceiver.rtpSender.send(params);
                    }
                    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
                        if (transceiver.kind === 'video' && transceiver.recvEncodingParameters && edgeVersion < 15019) {
                            transceiver.recvEncodingParameters.forEach(function(p) {
                                delete p.rtx;
                            });
                        }
                        if (transceiver.recvEncodingParameters.length) {
                            params.encodings = transceiver.recvEncodingParameters;
                        } else {
                            params.encodings = [{}];
                        }
                        params.rtcp = {
                            compound: transceiver.rtcpParameters.compound
                        };
                        if (transceiver.rtcpParameters.cname) {
                            params.rtcp.cname = transceiver.rtcpParameters.cname;
                        }
                        if (transceiver.sendEncodingParameters.length) {
                            params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
                        }
                        transceiver.rtpReceiver.receive(params);
                    }
                };
                RTCPeerConnection.prototype.setLocalDescription = function(description) {
                    var pc = this;
                    if (['offer', 'answer'].indexOf(description.type) === -1) {
                        return Promise.reject(makeError('TypeError', 'Unsupported type "' + description.type + '"'));
                    }
                    if (!isActionAllowedInSignalingState('setLocalDescription', description.type, pc.signalingState) || pc._isClosed) {
                        return Promise.reject(makeError('InvalidStateError', 'Can not set local ' + description.type +
                            ' in state ' + pc.signalingState));
                    }
                    var sections;
                    var sessionpart;
                    if (description.type === 'offer') {
                        sections = SDPUtils.splitSections(description.sdp);
                        sessionpart = sections.shift();
                        sections.forEach(function(mediaSection, sdpMLineIndex) {
                            var caps = SDPUtils.parseRtpParameters(mediaSection);
                            pc.transceivers[sdpMLineIndex].localCapabilities = caps;
                        });
                        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
                            pc._gather(transceiver.mid, sdpMLineIndex);
                        });
                    } else if (description.type === 'answer') {
                        sections = SDPUtils.splitSections(pc._remoteDescription.sdp);
                        sessionpart = sections.shift();
                        var isIceLite = SDPUtils.matchPrefix(sessionpart, 'a=ice-lite').length > 0;
                        sections.forEach(function(mediaSection, sdpMLineIndex) {
                            var transceiver = pc.transceivers[sdpMLineIndex];
                            var iceGatherer = transceiver.iceGatherer;
                            var iceTransport = transceiver.iceTransport;
                            var dtlsTransport = transceiver.dtlsTransport;
                            var localCapabilities = transceiver.localCapabilities;
                            var remoteCapabilities = transceiver.remoteCapabilities;
                            var rejected = SDPUtils.isRejected(mediaSection) && SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
                            if (!rejected && !transceiver.rejected) {
                                var remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
                                var remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
                                if (isIceLite) {
                                    remoteDtlsParameters.role = 'server';
                                }
                                if (!pc.usingBundle || sdpMLineIndex === 0) {
                                    pc._gather(transceiver.mid, sdpMLineIndex);
                                    if (iceTransport.state === 'new') {
                                        iceTransport.start(iceGatherer, remoteIceParameters, isIceLite ? 'controlling' : 'controlled');
                                    }
                                    if (dtlsTransport.state === 'new') {
                                        dtlsTransport.start(remoteDtlsParameters);
                                    }
                                }
                                var params = getCommonCapabilities(localCapabilities, remoteCapabilities);
                                pc._transceive(transceiver, params.codecs.length > 0, false);
                            }
                        });
                    }
                    pc._localDescription = {
                        type: description.type,
                        sdp: description.sdp
                    };
                    if (description.type === 'offer') {
                        pc._updateSignalingState('have-local-offer');
                    } else {
                        pc._updateSignalingState('stable');
                    }
                    return Promise.resolve();
                };
                RTCPeerConnection.prototype.setRemoteDescription = function(description) {
                    var pc = this;
                    if (['offer', 'answer'].indexOf(description.type) === -1) {
                        return Promise.reject(makeError('TypeError', 'Unsupported type "' + description.type + '"'));
                    }
                    if (!isActionAllowedInSignalingState('setRemoteDescription', description.type, pc.signalingState) || pc._isClosed) {
                        return Promise.reject(makeError('InvalidStateError', 'Can not set remote ' + description.type +
                            ' in state ' + pc.signalingState));
                    }
                    var streams = {};
                    pc.remoteStreams.forEach(function(stream) {
                        streams[stream.id] = stream;
                    });
                    var receiverList = [];
                    var sections = SDPUtils.splitSections(description.sdp);
                    var sessionpart = sections.shift();
                    var isIceLite = SDPUtils.matchPrefix(sessionpart, 'a=ice-lite').length > 0;
                    var usingBundle = SDPUtils.matchPrefix(sessionpart, 'a=group:BUNDLE ').length > 0;
                    pc.usingBundle = usingBundle;
                    var iceOptions = SDPUtils.matchPrefix(sessionpart, 'a=ice-options:')[0];
                    if (iceOptions) {
                        pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ').indexOf('trickle') >= 0;
                    } else {
                        pc.canTrickleIceCandidates = false;
                    }
                    sections.forEach(function(mediaSection, sdpMLineIndex) {
                        var lines = SDPUtils.splitLines(mediaSection);
                        var kind = SDPUtils.getKind(mediaSection);
                        var rejected = SDPUtils.isRejected(mediaSection) && SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
                        var protocol = lines[0].substr(2).split(' ')[2];
                        var direction = SDPUtils.getDirection(mediaSection, sessionpart);
                        var remoteMsid = SDPUtils.parseMsid(mediaSection);
                        var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();
                        if (rejected || (kind === 'application' && (protocol === 'DTLS/SCTP' || protocol === 'UDP/DTLS/SCTP'))) {
                            pc.transceivers[sdpMLineIndex] = {
                                mid: mid,
                                kind: kind,
                                protocol: protocol,
                                rejected: true
                            };
                            return;
                        }
                        if (!rejected && pc.transceivers[sdpMLineIndex] && pc.transceivers[sdpMLineIndex].rejected) {
                            pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
                        }
                        var transceiver;
                        var iceGatherer;
                        var iceTransport;
                        var dtlsTransport;
                        var rtpReceiver;
                        var sendEncodingParameters;
                        var recvEncodingParameters;
                        var localCapabilities;
                        var track;
                        var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
                        var remoteIceParameters;
                        var remoteDtlsParameters;
                        if (!rejected) {
                            remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
                            remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
                            remoteDtlsParameters.role = 'client';
                        }
                        recvEncodingParameters = SDPUtils.parseRtpEncodingParameters(mediaSection);
                        var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);
                        var isComplete = SDPUtils.matchPrefix(mediaSection, 'a=end-of-candidates', sessionpart).length > 0;
                        var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:').map(function(cand) {
                            return SDPUtils.parseCandidate(cand);
                        }).filter(function(cand) {
                            return cand.component === 1;
                        });
                        if ((description.type === 'offer' || description.type === 'answer') && !rejected && usingBundle && sdpMLineIndex > 0 && pc.transceivers[sdpMLineIndex]) {
                            pc._disposeIceAndDtlsTransports(sdpMLineIndex);
                            pc.transceivers[sdpMLineIndex].iceGatherer = pc.transceivers[0].iceGatherer;
                            pc.transceivers[sdpMLineIndex].iceTransport = pc.transceivers[0].iceTransport;
                            pc.transceivers[sdpMLineIndex].dtlsTransport = pc.transceivers[0].dtlsTransport;
                            if (pc.transceivers[sdpMLineIndex].rtpSender) {
                                pc.transceivers[sdpMLineIndex].rtpSender.setTransport(pc.transceivers[0].dtlsTransport);
                            }
                            if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
                                pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(pc.transceivers[0].dtlsTransport);
                            }
                        }
                        if (description.type === 'offer' && !rejected) {
                            transceiver = pc.transceivers[sdpMLineIndex] || pc._createTransceiver(kind);
                            transceiver.mid = mid;
                            if (!transceiver.iceGatherer) {
                                transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex, usingBundle);
                            }
                            if (cands.length && transceiver.iceTransport.state === 'new') {
                                if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
                                    transceiver.iceTransport.setRemoteCandidates(cands);
                                } else {
                                    cands.forEach(function(candidate) {
                                        maybeAddCandidate(transceiver.iceTransport, candidate);
                                    });
                                }
                            }
                            localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);
                            if (edgeVersion < 15019) {
                                localCapabilities.codecs = localCapabilities.codecs.filter(function(codec) {
                                    return codec.name !== 'rtx';
                                });
                            }
                            sendEncodingParameters = transceiver.sendEncodingParameters || [{
                                ssrc: (2 * sdpMLineIndex + 2) * 1001
                            }];
                            var isNewTrack = false;
                            if (direction === 'sendrecv' || direction === 'sendonly') {
                                isNewTrack = !transceiver.rtpReceiver;
                                rtpReceiver = transceiver.rtpReceiver || new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);
                                if (isNewTrack) {
                                    var stream;
                                    track = rtpReceiver.track;
                                    if (remoteMsid && remoteMsid.stream === '-') {} else if (remoteMsid) {
                                        if (!streams[remoteMsid.stream]) {
                                            streams[remoteMsid.stream] = new window.MediaStream();
                                            Object.defineProperty(streams[remoteMsid.stream], 'id', {
                                                get: function() {
                                                    return remoteMsid.stream;
                                                }
                                            });
                                        }
                                        Object.defineProperty(track, 'id', {
                                            get: function() {
                                                return remoteMsid.track;
                                            }
                                        });
                                        stream = streams[remoteMsid.stream];
                                    } else {
                                        if (!streams.default) {
                                            streams.default = new window.MediaStream();
                                        }
                                        stream = streams.default;
                                    }
                                    if (stream) {
                                        addTrackToStreamAndFireEvent(track, stream);
                                        transceiver.associatedRemoteMediaStreams.push(stream);
                                    }
                                    receiverList.push([track, rtpReceiver, stream]);
                                }
                            } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
                                transceiver.associatedRemoteMediaStreams.forEach(function(s) {
                                    var nativeTrack = s.getTracks().find(function(t) {
                                        return t.id === transceiver.rtpReceiver.track.id;
                                    });
                                    if (nativeTrack) {
                                        removeTrackFromStreamAndFireEvent(nativeTrack, s);
                                    }
                                });
                                transceiver.associatedRemoteMediaStreams = [];
                            }
                            transceiver.localCapabilities = localCapabilities;
                            transceiver.remoteCapabilities = remoteCapabilities;
                            transceiver.rtpReceiver = rtpReceiver;
                            transceiver.rtcpParameters = rtcpParameters;
                            transceiver.sendEncodingParameters = sendEncodingParameters;
                            transceiver.recvEncodingParameters = recvEncodingParameters;
                            pc._transceive(pc.transceivers[sdpMLineIndex], false, isNewTrack);
                        } else if (description.type === 'answer' && !rejected) {
                            transceiver = pc.transceivers[sdpMLineIndex];
                            iceGatherer = transceiver.iceGatherer;
                            iceTransport = transceiver.iceTransport;
                            dtlsTransport = transceiver.dtlsTransport;
                            rtpReceiver = transceiver.rtpReceiver;
                            sendEncodingParameters = transceiver.sendEncodingParameters;
                            localCapabilities = transceiver.localCapabilities;
                            pc.transceivers[sdpMLineIndex].recvEncodingParameters = recvEncodingParameters;
                            pc.transceivers[sdpMLineIndex].remoteCapabilities = remoteCapabilities;
                            pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;
                            if (cands.length && iceTransport.state === 'new') {
                                if ((isIceLite || isComplete) && (!usingBundle || sdpMLineIndex === 0)) {
                                    iceTransport.setRemoteCandidates(cands);
                                } else {
                                    cands.forEach(function(candidate) {
                                        maybeAddCandidate(transceiver.iceTransport, candidate);
                                    });
                                }
                            }
                            if (!usingBundle || sdpMLineIndex === 0) {
                                if (iceTransport.state === 'new') {
                                    iceTransport.start(iceGatherer, remoteIceParameters, 'controlling');
                                }
                                if (dtlsTransport.state === 'new') {
                                    dtlsTransport.start(remoteDtlsParameters);
                                }
                            }
                            var commonCapabilities = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
                            var hasRtx = commonCapabilities.codecs.filter(function(c) {
                                return c.name.toLowerCase() === 'rtx';
                            }).length;
                            if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
                                delete transceiver.sendEncodingParameters[0].rtx;
                            }
                            pc._transceive(transceiver, direction === 'sendrecv' || direction === 'recvonly', direction === 'sendrecv' || direction === 'sendonly');
                            if (rtpReceiver && (direction === 'sendrecv' || direction === 'sendonly')) {
                                track = rtpReceiver.track;
                                if (remoteMsid) {
                                    if (!streams[remoteMsid.stream]) {
                                        streams[remoteMsid.stream] = new window.MediaStream();
                                    }
                                    addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
                                    receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
                                } else {
                                    if (!streams.default) {
                                        streams.default = new window.MediaStream();
                                    }
                                    addTrackToStreamAndFireEvent(track, streams.default);
                                    receiverList.push([track, rtpReceiver, streams.default]);
                                }
                            } else {
                                delete transceiver.rtpReceiver;
                            }
                        }
                    });
                    if (pc._dtlsRole === undefined) {
                        pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
                    }
                    pc._remoteDescription = {
                        type: description.type,
                        sdp: description.sdp
                    };
                    if (description.type === 'offer') {
                        pc._updateSignalingState('have-remote-offer');
                    } else {
                        pc._updateSignalingState('stable');
                    }
                    Object.keys(streams).forEach(function(sid) {
                        var stream = streams[sid];
                        if (stream.getTracks().length) {
                            if (pc.remoteStreams.indexOf(stream) === -1) {
                                pc.remoteStreams.push(stream);
                                var event = new Event('addstream');
                                event.stream = stream;
                                window.setTimeout(function() {
                                    pc._dispatchEvent('addstream', event);
                                });
                            }
                            receiverList.forEach(function(item) {
                                var track = item[0];
                                var receiver = item[1];
                                if (stream.id !== item[2].id) {
                                    return;
                                }
                                fireAddTrack(pc, track, receiver, [stream]);
                            });
                        }
                    });
                    receiverList.forEach(function(item) {
                        if (item[2]) {
                            return;
                        }
                        fireAddTrack(pc, item[0], item[1], []);
                    });
                    window.setTimeout(function() {
                        if (!(pc && pc.transceivers)) {
                            return;
                        }
                        pc.transceivers.forEach(function(transceiver) {
                            if (transceiver.iceTransport && transceiver.iceTransport.state === 'new' && transceiver.iceTransport.getRemoteCandidates().length > 0) {
                                console.warn('Timeout for addRemoteCandidate. Consider sending ' +
                                    'an end-of-candidates notification');
                                transceiver.iceTransport.addRemoteCandidate({});
                            }
                        });
                    }, 4000);
                    return Promise.resolve();
                };
                RTCPeerConnection.prototype.close = function() {
                    this.transceivers.forEach(function(transceiver) {
                        if (transceiver.iceTransport) {
                            transceiver.iceTransport.stop();
                        }
                        if (transceiver.dtlsTransport) {
                            transceiver.dtlsTransport.stop();
                        }
                        if (transceiver.rtpSender) {
                            transceiver.rtpSender.stop();
                        }
                        if (transceiver.rtpReceiver) {
                            transceiver.rtpReceiver.stop();
                        }
                    });
                    this._isClosed = true;
                    this._updateSignalingState('closed');
                };
                RTCPeerConnection.prototype._updateSignalingState = function(newState) {
                    this.signalingState = newState;
                    var event = new Event('signalingstatechange');
                    this._dispatchEvent('signalingstatechange', event);
                };
                RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
                    var pc = this;
                    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
                        return;
                    }
                    this.needNegotiation = true;
                    window.setTimeout(function() {
                        if (pc.needNegotiation) {
                            pc.needNegotiation = false;
                            var event = new Event('negotiationneeded');
                            pc._dispatchEvent('negotiationneeded', event);
                        }
                    }, 0);
                };
                RTCPeerConnection.prototype._updateIceConnectionState = function() {
                    var newState;
                    var states = {
                        'new': 0,
                        closed: 0,
                        checking: 0,
                        connected: 0,
                        completed: 0,
                        disconnected: 0,
                        failed: 0
                    };
                    this.transceivers.forEach(function(transceiver) {
                        if (transceiver.iceTransport && !transceiver.rejected) {
                            states[transceiver.iceTransport.state]++;
                        }
                    });
                    newState = 'new';
                    if (states.failed > 0) {
                        newState = 'failed';
                    } else if (states.checking > 0) {
                        newState = 'checking';
                    } else if (states.disconnected > 0) {
                        newState = 'disconnected';
                    } else if (states.new > 0) {
                        newState = 'new';
                    } else if (states.connected > 0) {
                        newState = 'connected';
                    } else if (states.completed > 0) {
                        newState = 'completed';
                    }
                    if (newState !== this.iceConnectionState) {
                        this.iceConnectionState = newState;
                        var event = new Event('iceconnectionstatechange');
                        this._dispatchEvent('iceconnectionstatechange', event);
                    }
                };
                RTCPeerConnection.prototype._updateConnectionState = function() {
                    var newState;
                    var states = {
                        'new': 0,
                        closed: 0,
                        connecting: 0,
                        connected: 0,
                        completed: 0,
                        disconnected: 0,
                        failed: 0
                    };
                    this.transceivers.forEach(function(transceiver) {
                        if (transceiver.iceTransport && transceiver.dtlsTransport && !transceiver.rejected) {
                            states[transceiver.iceTransport.state]++;
                            states[transceiver.dtlsTransport.state]++;
                        }
                    });
                    states.connected += states.completed;
                    newState = 'new';
                    if (states.failed > 0) {
                        newState = 'failed';
                    } else if (states.connecting > 0) {
                        newState = 'connecting';
                    } else if (states.disconnected > 0) {
                        newState = 'disconnected';
                    } else if (states.new > 0) {
                        newState = 'new';
                    } else if (states.connected > 0) {
                        newState = 'connected';
                    }
                    if (newState !== this.connectionState) {
                        this.connectionState = newState;
                        var event = new Event('connectionstatechange');
                        this._dispatchEvent('connectionstatechange', event);
                    }
                };
                RTCPeerConnection.prototype.createOffer = function() {
                    var pc = this;
                    if (pc._isClosed) {
                        return Promise.reject(makeError('InvalidStateError', 'Can not call createOffer after close'));
                    }
                    var numAudioTracks = pc.transceivers.filter(function(t) {
                        return t.kind === 'audio';
                    }).length;
                    var numVideoTracks = pc.transceivers.filter(function(t) {
                        return t.kind === 'video';
                    }).length;
                    var offerOptions = arguments[0];
                    if (offerOptions) {
                        if (offerOptions.mandatory || offerOptions.optional) {
                            throw new TypeError('Legacy mandatory/optional constraints not supported.');
                        }
                        if (offerOptions.offerToReceiveAudio !== undefined) {
                            if (offerOptions.offerToReceiveAudio === true) {
                                numAudioTracks = 1;
                            } else if (offerOptions.offerToReceiveAudio === false) {
                                numAudioTracks = 0;
                            } else {
                                numAudioTracks = offerOptions.offerToReceiveAudio;
                            }
                        }
                        if (offerOptions.offerToReceiveVideo !== undefined) {
                            if (offerOptions.offerToReceiveVideo === true) {
                                numVideoTracks = 1;
                            } else if (offerOptions.offerToReceiveVideo === false) {
                                numVideoTracks = 0;
                            } else {
                                numVideoTracks = offerOptions.offerToReceiveVideo;
                            }
                        }
                    }
                    pc.transceivers.forEach(function(transceiver) {
                        if (transceiver.kind === 'audio') {
                            numAudioTracks--;
                            if (numAudioTracks < 0) {
                                transceiver.wantReceive = false;
                            }
                        } else if (transceiver.kind === 'video') {
                            numVideoTracks--;
                            if (numVideoTracks < 0) {
                                transceiver.wantReceive = false;
                            }
                        }
                    });
                    while (numAudioTracks > 0 || numVideoTracks > 0) {
                        if (numAudioTracks > 0) {
                            pc._createTransceiver('audio');
                            numAudioTracks--;
                        }
                        if (numVideoTracks > 0) {
                            pc._createTransceiver('video');
                            numVideoTracks--;
                        }
                    }
                    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId, pc._sdpSessionVersion++);
                    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
                        var track = transceiver.track;
                        var kind = transceiver.kind;
                        var mid = transceiver.mid || SDPUtils.generateIdentifier();
                        transceiver.mid = mid;
                        if (!transceiver.iceGatherer) {
                            transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex, pc.usingBundle);
                        }
                        var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
                        if (edgeVersion < 15019) {
                            localCapabilities.codecs = localCapabilities.codecs.filter(function(codec) {
                                return codec.name !== 'rtx';
                            });
                        }
                        localCapabilities.codecs.forEach(function(codec) {
                            if (codec.name === 'H264' && codec.parameters['level-asymmetry-allowed'] === undefined) {
                                codec.parameters['level-asymmetry-allowed'] = '1';
                            }
                            if (transceiver.remoteCapabilities && transceiver.remoteCapabilities.codecs) {
                                transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
                                    if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() && codec.clockRate === remoteCodec.clockRate) {
                                        codec.preferredPayloadType = remoteCodec.payloadType;
                                    }
                                });
                            }
                        });
                        localCapabilities.headerExtensions.forEach(function(hdrExt) {
                            var remoteExtensions = transceiver.remoteCapabilities && transceiver.remoteCapabilities.headerExtensions || [];
                            remoteExtensions.forEach(function(rHdrExt) {
                                if (hdrExt.uri === rHdrExt.uri) {
                                    hdrExt.id = rHdrExt.id;
                                }
                            });
                        });
                        var sendEncodingParameters = transceiver.sendEncodingParameters || [{
                            ssrc: (2 * sdpMLineIndex + 1) * 1001
                        }];
                        if (track) {
                            if (edgeVersion >= 15019 && kind === 'video' && !sendEncodingParameters[0].rtx) {
                                sendEncodingParameters[0].rtx = {
                                    ssrc: sendEncodingParameters[0].ssrc + 1
                                };
                            }
                        }
                        if (transceiver.wantReceive) {
                            transceiver.rtpReceiver = new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);
                        }
                        transceiver.localCapabilities = localCapabilities;
                        transceiver.sendEncodingParameters = sendEncodingParameters;
                    });
                    if (pc._config.bundlePolicy !== 'max-compat') {
                        sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
                            return t.mid;
                        }).join(' ') + '\r\n';
                    }
                    sdp += 'a=ice-options:trickle\r\n';
                    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
                        sdp += writeMediaSection(transceiver, transceiver.localCapabilities, 'offer', transceiver.stream, pc._dtlsRole);
                        sdp += 'a=rtcp-rsize\r\n';
                        if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' && (sdpMLineIndex === 0 || !pc.usingBundle)) {
                            transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
                                cand.component = 1;
                                sdp += 'a=' + SDPUtils.writeCandidate(cand) + '\r\n';
                            });
                            if (transceiver.iceGatherer.state === 'completed') {
                                sdp += 'a=end-of-candidates\r\n';
                            }
                        }
                    });
                    var desc = new window.RTCSessionDescription({
                        type: 'offer',
                        sdp: sdp
                    });
                    return Promise.resolve(desc);
                };
                RTCPeerConnection.prototype.createAnswer = function() {
                    var pc = this;
                    if (pc._isClosed) {
                        return Promise.reject(makeError('InvalidStateError', 'Can not call createAnswer after close'));
                    }
                    if (!(pc.signalingState === 'have-remote-offer' || pc.signalingState === 'have-local-pranswer')) {
                        return Promise.reject(makeError('InvalidStateError', 'Can not call createAnswer in signalingState ' + pc.signalingState));
                    }
                    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId, pc._sdpSessionVersion++);
                    if (pc.usingBundle) {
                        sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
                            return t.mid;
                        }).join(' ') + '\r\n';
                    }
                    sdp += 'a=ice-options:trickle\r\n';
                    var mediaSectionsInOffer = SDPUtils.getMediaSections(pc._remoteDescription.sdp).length;
                    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
                        if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
                            return;
                        }
                        if (transceiver.rejected) {
                            if (transceiver.kind === 'application') {
                                if (transceiver.protocol === 'DTLS/SCTP') {
                                    sdp += 'm=application 0 DTLS/SCTP 5000\r\n';
                                } else {
                                    sdp += 'm=application 0 ' + transceiver.protocol +
                                        ' webrtc-datachannel\r\n';
                                }
                            } else if (transceiver.kind === 'audio') {
                                sdp += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' +
                                    'a=rtpmap:0 PCMU/8000\r\n';
                            } else if (transceiver.kind === 'video') {
                                sdp += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' +
                                    'a=rtpmap:120 VP8/90000\r\n';
                            }
                            sdp += 'c=IN IP4 0.0.0.0\r\n' +
                                'a=inactive\r\n' +
                                'a=mid:' + transceiver.mid + '\r\n';
                            return;
                        }
                        if (transceiver.stream) {
                            var localTrack;
                            if (transceiver.kind === 'audio') {
                                localTrack = transceiver.stream.getAudioTracks()[0];
                            } else if (transceiver.kind === 'video') {
                                localTrack = transceiver.stream.getVideoTracks()[0];
                            }
                            if (localTrack) {
                                if (edgeVersion >= 15019 && transceiver.kind === 'video' && !transceiver.sendEncodingParameters[0].rtx) {
                                    transceiver.sendEncodingParameters[0].rtx = {
                                        ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
                                    };
                                }
                            }
                        }
                        var commonCapabilities = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
                        var hasRtx = commonCapabilities.codecs.filter(function(c) {
                            return c.name.toLowerCase() === 'rtx';
                        }).length;
                        if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
                            delete transceiver.sendEncodingParameters[0].rtx;
                        }
                        sdp += writeMediaSection(transceiver, commonCapabilities, 'answer', transceiver.stream, pc._dtlsRole);
                        if (transceiver.rtcpParameters && transceiver.rtcpParameters.reducedSize) {
                            sdp += 'a=rtcp-rsize\r\n';
                        }
                    });
                    var desc = new window.RTCSessionDescription({
                        type: 'answer',
                        sdp: sdp
                    });
                    return Promise.resolve(desc);
                };
                RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
                    var pc = this;
                    var sections;
                    if (candidate && !(candidate.sdpMLineIndex !== undefined || candidate.sdpMid)) {
                        return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
                    }
                    return new Promise(function(resolve, reject) {
                        if (!pc._remoteDescription) {
                            return reject(makeError('InvalidStateError', 'Can not add ICE candidate without a remote description'));
                        } else if (!candidate || candidate.candidate === '') {
                            for (var j = 0; j < pc.transceivers.length; j++) {
                                if (pc.transceivers[j].rejected) {
                                    continue;
                                }
                                pc.transceivers[j].iceTransport.addRemoteCandidate({});
                                sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
                                sections[j] += 'a=end-of-candidates\r\n';
                                pc._remoteDescription.sdp = SDPUtils.getDescription(pc._remoteDescription.sdp) +
                                    sections.join('');
                                if (pc.usingBundle) {
                                    break;
                                }
                            }
                        } else {
                            var sdpMLineIndex = candidate.sdpMLineIndex;
                            if (candidate.sdpMid) {
                                for (var i = 0; i < pc.transceivers.length; i++) {
                                    if (pc.transceivers[i].mid === candidate.sdpMid) {
                                        sdpMLineIndex = i;
                                        break;
                                    }
                                }
                            }
                            var transceiver = pc.transceivers[sdpMLineIndex];
                            if (transceiver) {
                                if (transceiver.rejected) {
                                    return resolve();
                                }
                                var cand = Object.keys(candidate.candidate).length > 0 ? SDPUtils.parseCandidate(candidate.candidate) : {};
                                if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
                                    return resolve();
                                }
                                if (cand.component && cand.component !== 1) {
                                    return resolve();
                                }
                                if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 && transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
                                    if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
                                        return reject(makeError('OperationError', 'Can not add ICE candidate'));
                                    }
                                }
                                var candidateString = candidate.candidate.trim();
                                if (candidateString.indexOf('a=') === 0) {
                                    candidateString = candidateString.substr(2);
                                }
                                sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
                                sections[sdpMLineIndex] += 'a=' +
                                    (cand.type ? candidateString : 'end-of-candidates') +
                                    '\r\n';
                                pc._remoteDescription.sdp = SDPUtils.getDescription(pc._remoteDescription.sdp) +
                                    sections.join('');
                            } else {
                                return reject(makeError('OperationError', 'Can not add ICE candidate'));
                            }
                        }
                        resolve();
                    });
                };
                RTCPeerConnection.prototype.getStats = function(selector) {
                    if (selector && selector instanceof window.MediaStreamTrack) {
                        var senderOrReceiver = null;
                        this.transceivers.forEach(function(transceiver) {
                            if (transceiver.rtpSender && transceiver.rtpSender.track === selector) {
                                senderOrReceiver = transceiver.rtpSender;
                            } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track === selector) {
                                senderOrReceiver = transceiver.rtpReceiver;
                            }
                        });
                        if (!senderOrReceiver) {
                            throw makeError('InvalidAccessError', 'Invalid selector.');
                        }
                        return senderOrReceiver.getStats();
                    }
                    var promises = [];
                    this.transceivers.forEach(function(transceiver) {
                        ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport', 'dtlsTransport'].forEach(function(method) {
                            if (transceiver[method]) {
                                promises.push(transceiver[method].getStats());
                            }
                        });
                    });
                    return Promise.all(promises).then(function(allStats) {
                        var results = new Map();
                        allStats.forEach(function(stats) {
                            stats.forEach(function(stat) {
                                results.set(stat.id, stat);
                            });
                        });
                        return results;
                    });
                };
                var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer', 'RTCIceTransport', 'RTCDtlsTransport'];
                ortcObjects.forEach(function(ortcObjectName) {
                    var obj = window[ortcObjectName];
                    if (obj && obj.prototype && obj.prototype.getStats) {
                        var nativeGetstats = obj.prototype.getStats;
                        obj.prototype.getStats = function() {
                            return nativeGetstats.apply(this).then(function(nativeStats) {
                                var mapStats = new Map();
                                Object.keys(nativeStats).forEach(function(id) {
                                    nativeStats[id].type = fixStatsType(nativeStats[id]);
                                    mapStats.set(id, nativeStats[id]);
                                });
                                return mapStats;
                            });
                        };
                    }
                });
                var methods = ['createOffer', 'createAnswer'];
                methods.forEach(function(method) {
                    var nativeMethod = RTCPeerConnection.prototype[method];
                    RTCPeerConnection.prototype[method] = function() {
                        var args = arguments;
                        if (typeof args[0] === 'function' || typeof args[1] === 'function') {
                            return nativeMethod.apply(this, [arguments[2]]).then(function(description) {
                                if (typeof args[0] === 'function') {
                                    args[0].apply(null, [description]);
                                }
                            }, function(error) {
                                if (typeof args[1] === 'function') {
                                    args[1].apply(null, [error]);
                                }
                            });
                        }
                        return nativeMethod.apply(this, arguments);
                    };
                });
                methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
                methods.forEach(function(method) {
                    var nativeMethod = RTCPeerConnection.prototype[method];
                    RTCPeerConnection.prototype[method] = function() {
                        var args = arguments;
                        if (typeof args[1] === 'function' || typeof args[2] === 'function') {
                            return nativeMethod.apply(this, arguments).then(function() {
                                if (typeof args[1] === 'function') {
                                    args[1].apply(null);
                                }
                            }, function(error) {
                                if (typeof args[2] === 'function') {
                                    args[2].apply(null, [error]);
                                }
                            });
                        }
                        return nativeMethod.apply(this, arguments);
                    };
                });
                ['getStats'].forEach(function(method) {
                    var nativeMethod = RTCPeerConnection.prototype[method];
                    RTCPeerConnection.prototype[method] = function() {
                        var args = arguments;
                        if (typeof args[1] === 'function') {
                            return nativeMethod.apply(this, arguments).then(function() {
                                if (typeof args[1] === 'function') {
                                    args[1].apply(null);
                                }
                            });
                        }
                        return nativeMethod.apply(this, arguments);
                    };
                });
                return RTCPeerConnection;
            };
        }, {
            "sdp": 17
        }],
        17: [function(require, module, exports) {
            'use strict';
            var SDPUtils = {};
            SDPUtils.generateIdentifier = function() {
                return Math.random().toString(36).substr(2, 10);
            };
            SDPUtils.localCName = SDPUtils.generateIdentifier();
            SDPUtils.splitLines = function(blob) {
                return blob.trim().split('\n').map(function(line) {
                    return line.trim();
                });
            };
            SDPUtils.splitSections = function(blob) {
                var parts = blob.split('\nm=');
                return parts.map(function(part, index) {
                    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
                });
            };
            SDPUtils.getDescription = function(blob) {
                var sections = SDPUtils.splitSections(blob);
                return sections && sections[0];
            };
            SDPUtils.getMediaSections = function(blob) {
                var sections = SDPUtils.splitSections(blob);
                sections.shift();
                return sections;
            };
            SDPUtils.matchPrefix = function(blob, prefix) {
                return SDPUtils.splitLines(blob).filter(function(line) {
                    return line.indexOf(prefix) === 0;
                });
            };
            SDPUtils.parseCandidate = function(line) {
                var parts;
                if (line.indexOf('a=candidate:') === 0) {
                    parts = line.substring(12).split(' ');
                } else {
                    parts = line.substring(10).split(' ');
                }
                var candidate = {
                    foundation: parts[0],
                    component: parseInt(parts[1], 10),
                    protocol: parts[2].toLowerCase(),
                    priority: parseInt(parts[3], 10),
                    ip: parts[4],
                    address: parts[4],
                    port: parseInt(parts[5], 10),
                    type: parts[7]
                };
                for (var i = 8; i < parts.length; i += 2) {
                    switch (parts[i]) {
                        case 'raddr':
                            candidate.relatedAddress = parts[i + 1];
                            break;
                        case 'rport':
                            candidate.relatedPort = parseInt(parts[i + 1], 10);
                            break;
                        case 'tcptype':
                            candidate.tcpType = parts[i + 1];
                            break;
                        case 'ufrag':
                            candidate.ufrag = parts[i + 1];
                            candidate.usernameFragment = parts[i + 1];
                            break;
                        default:
                            candidate[parts[i]] = parts[i + 1];
                            break;
                    }
                }
                return candidate;
            };
            SDPUtils.writeCandidate = function(candidate) {
                var sdp = [];
                sdp.push(candidate.foundation);
                sdp.push(candidate.component);
                sdp.push(candidate.protocol.toUpperCase());
                sdp.push(candidate.priority);
                sdp.push(candidate.address || candidate.ip);
                sdp.push(candidate.port);
                var type = candidate.type;
                sdp.push('typ');
                sdp.push(type);
                if (type !== 'host' && candidate.relatedAddress && candidate.relatedPort) {
                    sdp.push('raddr');
                    sdp.push(candidate.relatedAddress);
                    sdp.push('rport');
                    sdp.push(candidate.relatedPort);
                }
                if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
                    sdp.push('tcptype');
                    sdp.push(candidate.tcpType);
                }
                if (candidate.usernameFragment || candidate.ufrag) {
                    sdp.push('ufrag');
                    sdp.push(candidate.usernameFragment || candidate.ufrag);
                }
                return 'candidate:' + sdp.join(' ');
            };
            SDPUtils.parseIceOptions = function(line) {
                return line.substr(14).split(' ');
            };
            SDPUtils.parseRtpMap = function(line) {
                var parts = line.substr(9).split(' ');
                var parsed = {
                    payloadType: parseInt(parts.shift(), 10)
                };
                parts = parts[0].split('/');
                parsed.name = parts[0];
                parsed.clockRate = parseInt(parts[1], 10);
                parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
                parsed.numChannels = parsed.channels;
                return parsed;
            };
            SDPUtils.writeRtpMap = function(codec) {
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                    pt = codec.preferredPayloadType;
                }
                var channels = codec.channels || codec.numChannels || 1;
                return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
                    (channels !== 1 ? '/' + channels : '') + '\r\n';
            };
            SDPUtils.parseExtmap = function(line) {
                var parts = line.substr(9).split(' ');
                return {
                    id: parseInt(parts[0], 10),
                    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
                    uri: parts[1]
                };
            };
            SDPUtils.writeExtmap = function(headerExtension) {
                return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
                    (headerExtension.direction && headerExtension.direction !== 'sendrecv' ? '/' + headerExtension.direction : '') +
                    ' ' + headerExtension.uri + '\r\n';
            };
            SDPUtils.parseFmtp = function(line) {
                var parsed = {};
                var kv;
                var parts = line.substr(line.indexOf(' ') + 1).split(';');
                for (var j = 0; j < parts.length; j++) {
                    kv = parts[j].trim().split('=');
                    parsed[kv[0].trim()] = kv[1];
                }
                return parsed;
            };
            SDPUtils.writeFmtp = function(codec) {
                var line = '';
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                    pt = codec.preferredPayloadType;
                }
                if (codec.parameters && Object.keys(codec.parameters).length) {
                    var params = [];
                    Object.keys(codec.parameters).forEach(function(param) {
                        if (codec.parameters[param]) {
                            params.push(param + '=' + codec.parameters[param]);
                        } else {
                            params.push(param);
                        }
                    });
                    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
                }
                return line;
            };
            SDPUtils.parseRtcpFb = function(line) {
                var parts = line.substr(line.indexOf(' ') + 1).split(' ');
                return {
                    type: parts.shift(),
                    parameter: parts.join(' ')
                };
            };
            SDPUtils.writeRtcpFb = function(codec) {
                var lines = '';
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                    pt = codec.preferredPayloadType;
                }
                if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
                    codec.rtcpFeedback.forEach(function(fb) {
                        lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
                            (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
                            '\r\n';
                    });
                }
                return lines;
            };
            SDPUtils.parseSsrcMedia = function(line) {
                var sp = line.indexOf(' ');
                var parts = {
                    ssrc: parseInt(line.substr(7, sp - 7), 10)
                };
                var colon = line.indexOf(':', sp);
                if (colon > -1) {
                    parts.attribute = line.substr(sp + 1, colon - sp - 1);
                    parts.value = line.substr(colon + 1);
                } else {
                    parts.attribute = line.substr(sp + 1);
                }
                return parts;
            };
            SDPUtils.parseSsrcGroup = function(line) {
                var parts = line.substr(13).split(' ');
                return {
                    semantics: parts.shift(),
                    ssrcs: parts.map(function(ssrc) {
                        return parseInt(ssrc, 10);
                    })
                };
            };
            SDPUtils.getMid = function(mediaSection) {
                var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
                if (mid) {
                    return mid.substr(6);
                }
            };
            SDPUtils.parseFingerprint = function(line) {
                var parts = line.substr(14).split(' ');
                return {
                    algorithm: parts[0].toLowerCase(),
                    value: parts[1]
                };
            };
            SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
                var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=fingerprint:');
                return {
                    role: 'auto',
                    fingerprints: lines.map(SDPUtils.parseFingerprint)
                };
            };
            SDPUtils.writeDtlsParameters = function(params, setupType) {
                var sdp = 'a=setup:' + setupType + '\r\n';
                params.fingerprints.forEach(function(fp) {
                    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
                });
                return sdp;
            };
            SDPUtils.parseCryptoLine = function(line) {
                var parts = line.substr(9).split(' ');
                return {
                    tag: parseInt(parts[0], 10),
                    cryptoSuite: parts[1],
                    keyParams: parts[2],
                    sessionParams: parts.slice(3),
                };
            };
            SDPUtils.writeCryptoLine = function(parameters) {
                return 'a=crypto:' + parameters.tag + ' ' +
                    parameters.cryptoSuite + ' ' +
                    (typeof parameters.keyParams === 'object' ? SDPUtils.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) +
                    (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') +
                    '\r\n';
            };
            SDPUtils.parseCryptoKeyParams = function(keyParams) {
                if (keyParams.indexOf('inline:') !== 0) {
                    return null;
                }
                var parts = keyParams.substr(7).split('|');
                return {
                    keyMethod: 'inline',
                    keySalt: parts[0],
                    lifeTime: parts[1],
                    mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
                    mkiLength: parts[2] ? parts[2].split(':')[1] : undefined,
                };
            };
            SDPUtils.writeCryptoKeyParams = function(keyParams) {
                return keyParams.keyMethod + ':' +
                    keyParams.keySalt +
                    (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') +
                    (keyParams.mkiValue && keyParams.mkiLength ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength : '');
            };
            SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
                var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=crypto:');
                return lines.map(SDPUtils.parseCryptoLine);
            };
            SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
                var ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-ufrag:')[0];
                var pwd = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-pwd:')[0];
                if (!(ufrag && pwd)) {
                    return null;
                }
                return {
                    usernameFragment: ufrag.substr(12),
                    password: pwd.substr(10),
                };
            };
            SDPUtils.writeIceParameters = function(params) {
                return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
                    'a=ice-pwd:' + params.password + '\r\n';
            };
            SDPUtils.parseRtpParameters = function(mediaSection) {
                var description = {
                    codecs: [],
                    headerExtensions: [],
                    fecMechanisms: [],
                    rtcp: []
                };
                var lines = SDPUtils.splitLines(mediaSection);
                var mline = lines[0].split(' ');
                for (var i = 3; i < mline.length; i++) {
                    var pt = mline[i];
                    var rtpmapline = SDPUtils.matchPrefix(mediaSection, 'a=rtpmap:' + pt + ' ')[0];
                    if (rtpmapline) {
                        var codec = SDPUtils.parseRtpMap(rtpmapline);
                        var fmtps = SDPUtils.matchPrefix(mediaSection, 'a=fmtp:' + pt + ' ');
                        codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
                        codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:' + pt + ' ').map(SDPUtils.parseRtcpFb);
                        description.codecs.push(codec);
                        switch (codec.name.toUpperCase()) {
                            case 'RED':
                            case 'ULPFEC':
                                description.fecMechanisms.push(codec.name.toUpperCase());
                                break;
                            default:
                                break;
                        }
                    }
                }
                SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
                    description.headerExtensions.push(SDPUtils.parseExtmap(line));
                });
                return description;
            };
            SDPUtils.writeRtpDescription = function(kind, caps) {
                var sdp = '';
                sdp += 'm=' + kind + ' ';
                sdp += caps.codecs.length > 0 ? '9' : '0';
                sdp += ' UDP/TLS/RTP/SAVPF ';
                sdp += caps.codecs.map(function(codec) {
                    if (codec.preferredPayloadType !== undefined) {
                        return codec.preferredPayloadType;
                    }
                    return codec.payloadType;
                }).join(' ') + '\r\n';
                sdp += 'c=IN IP4 0.0.0.0\r\n';
                sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';
                caps.codecs.forEach(function(codec) {
                    sdp += SDPUtils.writeRtpMap(codec);
                    sdp += SDPUtils.writeFmtp(codec);
                    sdp += SDPUtils.writeRtcpFb(codec);
                });
                var maxptime = 0;
                caps.codecs.forEach(function(codec) {
                    if (codec.maxptime > maxptime) {
                        maxptime = codec.maxptime;
                    }
                });
                if (maxptime > 0) {
                    sdp += 'a=maxptime:' + maxptime + '\r\n';
                }
                sdp += 'a=rtcp-mux\r\n';
                if (caps.headerExtensions) {
                    caps.headerExtensions.forEach(function(extension) {
                        sdp += SDPUtils.writeExtmap(extension);
                    });
                }
                return sdp;
            };
            SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
                var encodingParameters = [];
                var description = SDPUtils.parseRtpParameters(mediaSection);
                var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
                var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;
                var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function(line) {
                    return SDPUtils.parseSsrcMedia(line);
                }).filter(function(parts) {
                    return parts.attribute === 'cname';
                });
                var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
                var secondarySsrc;
                var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID').map(function(line) {
                    var parts = line.substr(17).split(' ');
                    return parts.map(function(part) {
                        return parseInt(part, 10);
                    });
                });
                if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
                    secondarySsrc = flows[0][1];
                }
                description.codecs.forEach(function(codec) {
                    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
                        var encParam = {
                            ssrc: primarySsrc,
                            codecPayloadType: parseInt(codec.parameters.apt, 10)
                        };
                        if (primarySsrc && secondarySsrc) {
                            encParam.rtx = {
                                ssrc: secondarySsrc
                            };
                        }
                        encodingParameters.push(encParam);
                        if (hasRed) {
                            encParam = JSON.parse(JSON.stringify(encParam));
                            encParam.fec = {
                                ssrc: primarySsrc,
                                mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
                            };
                            encodingParameters.push(encParam);
                        }
                    }
                });
                if (encodingParameters.length === 0 && primarySsrc) {
                    encodingParameters.push({
                        ssrc: primarySsrc
                    });
                }
                var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
                if (bandwidth.length) {
                    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
                        bandwidth = parseInt(bandwidth[0].substr(7), 10);
                    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
                        bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95 -
                            (50 * 40 * 8);
                    } else {
                        bandwidth = undefined;
                    }
                    encodingParameters.forEach(function(params) {
                        params.maxBitrate = bandwidth;
                    });
                }
                return encodingParameters;
            };
            SDPUtils.parseRtcpParameters = function(mediaSection) {
                var rtcpParameters = {};
                var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function(line) {
                    return SDPUtils.parseSsrcMedia(line);
                }).filter(function(obj) {
                    return obj.attribute === 'cname';
                })[0];
                if (remoteSsrc) {
                    rtcpParameters.cname = remoteSsrc.value;
                    rtcpParameters.ssrc = remoteSsrc.ssrc;
                }
                var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
                rtcpParameters.reducedSize = rsize.length > 0;
                rtcpParameters.compound = rsize.length === 0;
                var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
                rtcpParameters.mux = mux.length > 0;
                return rtcpParameters;
            };
            SDPUtils.parseMsid = function(mediaSection) {
                var parts;
                var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
                if (spec.length === 1) {
                    parts = spec[0].substr(7).split(' ');
                    return {
                        stream: parts[0],
                        track: parts[1]
                    };
                }
                var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function(line) {
                    return SDPUtils.parseSsrcMedia(line);
                }).filter(function(msidParts) {
                    return msidParts.attribute === 'msid';
                });
                if (planB.length > 0) {
                    parts = planB[0].value.split(' ');
                    return {
                        stream: parts[0],
                        track: parts[1]
                    };
                }
            };
            SDPUtils.parseSctpDescription = function(mediaSection) {
                var mline = SDPUtils.parseMLine(mediaSection);
                var maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
                var maxMessageSize;
                if (maxSizeLine.length > 0) {
                    maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
                }
                if (isNaN(maxMessageSize)) {
                    maxMessageSize = 65536;
                }
                var sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
                if (sctpPort.length > 0) {
                    return {
                        port: parseInt(sctpPort[0].substr(12), 10),
                        protocol: mline.fmt,
                        maxMessageSize: maxMessageSize
                    };
                }
                var sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
                if (sctpMapLines.length > 0) {
                    var parts = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:')[0].substr(10).split(' ');
                    return {
                        port: parseInt(parts[0], 10),
                        protocol: parts[1],
                        maxMessageSize: maxMessageSize
                    };
                }
            };
            SDPUtils.writeSctpDescription = function(media, sctp) {
                var output = [];
                if (media.protocol !== 'DTLS/SCTP') {
                    output = ['m=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n', 'c=IN IP4 0.0.0.0\r\n', 'a=sctp-port:' + sctp.port + '\r\n'];
                } else {
                    output = ['m=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n', 'c=IN IP4 0.0.0.0\r\n', 'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'];
                }
                if (sctp.maxMessageSize !== undefined) {
                    output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
                }
                return output.join('');
            };
            SDPUtils.generateSessionId = function() {
                return Math.random().toString().substr(2, 21);
            };
            SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
                var sessionId;
                var version = sessVer !== undefined ? sessVer : 2;
                if (sessId) {
                    sessionId = sessId;
                } else {
                    sessionId = SDPUtils.generateSessionId();
                }
                var user = sessUser || 'thisisadapterortc';
                return 'v=0\r\n' +
                    'o=' + user + ' ' + sessionId + ' ' + version +
                    ' IN IP4 127.0.0.1\r\n' +
                    's=-\r\n' +
                    't=0 0\r\n';
            };
            SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
                var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
                sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters());
                sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === 'offer' ? 'actpass' : 'active');
                sdp += 'a=mid:' + transceiver.mid + '\r\n';
                if (transceiver.direction) {
                    sdp += 'a=' + transceiver.direction + '\r\n';
                } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
                    sdp += 'a=sendrecv\r\n';
                } else if (transceiver.rtpSender) {
                    sdp += 'a=sendonly\r\n';
                } else if (transceiver.rtpReceiver) {
                    sdp += 'a=recvonly\r\n';
                } else {
                    sdp += 'a=inactive\r\n';
                }
                if (transceiver.rtpSender) {
                    var msid = 'msid:' + stream.id + ' ' +
                        transceiver.rtpSender.track.id + '\r\n';
                    sdp += 'a=' + msid;
                    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
                        ' ' + msid;
                    if (transceiver.sendEncodingParameters[0].rtx) {
                        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
                            ' ' + msid;
                        sdp += 'a=ssrc-group:FID ' +
                            transceiver.sendEncodingParameters[0].ssrc + ' ' +
                            transceiver.sendEncodingParameters[0].rtx.ssrc +
                            '\r\n';
                    }
                }
                sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
                    ' cname:' + SDPUtils.localCName + '\r\n';
                if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
                    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
                        ' cname:' + SDPUtils.localCName + '\r\n';
                }
                return sdp;
            };
            SDPUtils.getDirection = function(mediaSection, sessionpart) {
                var lines = SDPUtils.splitLines(mediaSection);
                for (var i = 0; i < lines.length; i++) {
                    switch (lines[i]) {
                        case 'a=sendrecv':
                        case 'a=sendonly':
                        case 'a=recvonly':
                        case 'a=inactive':
                            return lines[i].substr(2);
                        default:
                    }
                }
                if (sessionpart) {
                    return SDPUtils.getDirection(sessionpart);
                }
                return 'sendrecv';
            };
            SDPUtils.getKind = function(mediaSection) {
                var lines = SDPUtils.splitLines(mediaSection);
                var mline = lines[0].split(' ');
                return mline[0].substr(2);
            };
            SDPUtils.isRejected = function(mediaSection) {
                return mediaSection.split(' ', 2)[1] === '0';
            };
            SDPUtils.parseMLine = function(mediaSection) {
                var lines = SDPUtils.splitLines(mediaSection);
                var parts = lines[0].substr(2).split(' ');
                return {
                    kind: parts[0],
                    port: parseInt(parts[1], 10),
                    protocol: parts[2],
                    fmt: parts.slice(3).join(' ')
                };
            };
            SDPUtils.parseOLine = function(mediaSection) {
                var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
                var parts = line.substr(2).split(' ');
                return {
                    username: parts[0],
                    sessionId: parts[1],
                    sessionVersion: parseInt(parts[2], 10),
                    netType: parts[3],
                    addressType: parts[4],
                    address: parts[5]
                };
            };
            SDPUtils.isValidSDP = function(blob) {
                if (typeof blob !== 'string' || blob.length === 0) {
                    return false;
                }
                var lines = SDPUtils.splitLines(blob);
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
                        return false;
                    }
                }
                return true;
            };
            if (typeof module === 'object') {
                module.exports = SDPUtils;
            }
        }, {}]
    }, {}, [1])(1)
});
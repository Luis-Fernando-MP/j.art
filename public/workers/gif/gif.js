!(function (t, e) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
      ? define([], e)
      : 'object' == typeof exports
        ? (exports.GIF = e())
        : (t.GIF = e())
})(this, function () {
  return (function (t) {
    function e(n) {
      if (i[n]) return i[n].exports
      var r = (i[n] = { exports: {}, id: n, loaded: !1 })
      return t[n].call(r.exports, r, r.exports, e), (r.loaded = !0), r.exports
    }
    var i = {}
    return (e.m = t), (e.c = i), (e.p = ''), e(0)
  })([
    function (t, e, i) {
      var n,
        r,
        s,
        o = function (t, e) {
          function i() {
            this.constructor = t
          }
          for (var n in e) a.call(e, n) && (t[n] = e[n])
          return (i.prototype = e.prototype), (t.prototype = new i()), (t.__super__ = e.prototype), t
        },
        a = {}.hasOwnProperty,
        h =
          [].indexOf ||
          function (t) {
            for (var e = 0, i = this.length; e < i; e++) if (e in this && this[e] === t) return e
            return -1
          }
      ;(n = i(1).EventEmitter),
        (s = i(2)),
        (r = (function (t) {
          function e(t) {
            var e, n, r
            ;(this.running = !1),
              (this.options = {}),
              (this.frames = []),
              (this.groups = new Map()),
              (this.freeWorkers = []),
              (this.activeWorkers = []),
              this.setOptions(t)
            for (n in i) (r = i[n]), null == (e = this.options)[n] && (e[n] = r)
          }
          var i, n
          return (
            o(e, t),
            (i = {
              workerScript: 'gif.worker.js',
              workers: 2,
              repeat: 0,
              background: '#fff',
              quality: 10,
              width: null,
              height: null,
              transparent: null,
              debug: !1
            }),
            (n = { delay: 500, copy: !1 }),
            (e.prototype.setOption = function (t, e) {
              if (((this.options[t] = e), null != this._canvas && ('width' === t || 'height' === t))) return (this._canvas[t] = e)
            }),
            (e.prototype.setOptions = function (t) {
              var e, i, n
              i = []
              for (e in t) a.call(t, e) && ((n = t[e]), i.push(this.setOption(e, n)))
              return i
            }),
            (e.prototype.addFrame = function (t, e) {
              var i, r, s
              null == e && (e = {}), (i = {}), (i.transparent = this.options.transparent)
              for (s in n) i[s] = e[s] || n[s]
              if (
                (null == this.options.width && this.setOption('width', t.width),
                null == this.options.height && this.setOption('height', t.height),
                'undefined' != typeof ImageData && null !== ImageData && t instanceof ImageData)
              )
                i.data = t.data
              else if (
                ('undefined' != typeof CanvasRenderingContext2D &&
                  null !== CanvasRenderingContext2D &&
                  t instanceof CanvasRenderingContext2D) ||
                ('undefined' != typeof WebGLRenderingContext &&
                  null !== WebGLRenderingContext &&
                  t instanceof WebGLRenderingContext)
              )
                e.copy ? (i.data = this.getContextData(t)) : (i.context = t)
              else {
                if (null == t.childNodes) throw new Error('Invalid image')
                e.copy ? (i.data = this.getImageData(t)) : (i.image = t)
              }
              return (
                (r = this.frames.length),
                r > 0 && i.data && (this.groups.has(i.data) ? this.groups.get(i.data).push(r) : this.groups.set(i.data, [r])),
                this.frames.push(i)
              )
            }),
            (e.prototype.render = function () {
              var t, e, i, n
              if (this.running) throw new Error('Already running')
              if (null == this.options.width || null == this.options.height)
                throw new Error('Width and height must be set prior to rendering')
              if (
                ((this.running = !0),
                (this.nextFrame = 0),
                (this.finishedFrames = 0),
                (this.imageParts = function () {
                  var e, i, n
                  for (n = [], t = e = 0, i = this.frames.length; 0 <= i ? e < i : e > i; t = 0 <= i ? ++e : --e) n.push(null)
                  return n
                }.call(this)),
                (i = this.spawnWorkers()),
                this.options.globalPalette === !0)
              )
                this.renderNextFrame()
              else for (t = e = 0, n = i; 0 <= n ? e < n : e > n; t = 0 <= n ? ++e : --e) this.renderNextFrame()
              return this.emit('start'), this.emit('progress', 0)
            }),
            (e.prototype.abort = function () {
              for (var t; ; ) {
                if (((t = this.activeWorkers.shift()), null == t)) break
                this.log('killing active worker'), t.terminate()
              }
              return (this.running = !1), this.emit('abort')
            }),
            (e.prototype.spawnWorkers = function () {
              var t, e, i
              return (
                (t = Math.min(this.options.workers, this.frames.length)),
                function () {
                  i = []
                  for (var n = (e = this.freeWorkers.length); e <= t ? n < t : n > t; e <= t ? n++ : n--) i.push(n)
                  return i
                }
                  .apply(this)
                  .forEach(
                    (function (t) {
                      return function (e) {
                        var i
                        return (
                          t.log('spawning worker ' + e),
                          (i = new Worker(t.options.workerScript)),
                          (i.onmessage = function (e) {
                            return (
                              t.activeWorkers.splice(t.activeWorkers.indexOf(i), 1),
                              t.freeWorkers.push(i),
                              t.frameFinished(e.data, !1)
                            )
                          }),
                          t.freeWorkers.push(i)
                        )
                      }
                    })(this)
                  ),
                t
              )
            }),
            (e.prototype.frameFinished = function (t, e) {
              var i, n, r, s, o
              if (
                (this.finishedFrames++,
                e
                  ? ((n = this.frames.indexOf(t)),
                    (r = this.groups.get(t.data)[0]),
                    this.log('frame ' + (n + 1) + ' is duplicate of ' + r + ' - ' + this.activeWorkers.length + ' active'),
                    (this.imageParts[n] = { indexOfFirstInGroup: r }))
                  : (this.log('frame ' + (t.index + 1) + ' finished - ' + this.activeWorkers.length + ' active'),
                    this.emit('progress', this.finishedFrames / this.frames.length),
                    (this.imageParts[t.index] = t)),
                this.options.globalPalette === !0 &&
                  !e &&
                  ((this.options.globalPalette = t.globalPalette), this.log('global palette analyzed'), this.frames.length > 2))
              )
                for (i = s = 1, o = this.freeWorkers.length; 1 <= o ? s < o : s > o; i = 1 <= o ? ++s : --s)
                  this.renderNextFrame()
              return h.call(this.imageParts, null) >= 0 ? this.renderNextFrame() : this.finishRendering()
            }),
            (e.prototype.finishRendering = function () {
              var t, e, i, n, r, s, o, a, h, l, f, p, u, d, c, g, v, m, y, _
              for (v = this.imageParts, r = s = 0, l = v.length; s < l; r = ++s)
                (e = v[r]), e.indexOfFirstInGroup && (this.imageParts[r] = this.imageParts[e.indexOfFirstInGroup])
              for (h = 0, m = this.imageParts, o = 0, f = m.length; o < f; o++)
                (e = m[o]), (h += (e.data.length - 1) * e.pageSize + e.cursor)
              for (
                h += e.pageSize - e.cursor,
                  this.log('rendering finished - filesize ' + Math.round(h / 1e3) + 'kb'),
                  t = new Uint8Array(h),
                  c = 0,
                  y = this.imageParts,
                  a = 0,
                  p = y.length;
                a < p;
                a++
              )
                for (e = y[a], _ = e.data, i = d = 0, u = _.length; d < u; i = ++d)
                  (g = _[i]), t.set(g, c), (c += i === e.data.length - 1 ? e.cursor : e.pageSize)
              return (n = new Blob([t], { type: 'image/gif' })), this.emit('finished', n, t)
            }),
            (e.prototype.renderNextFrame = function () {
              var t, e, i, n
              if (0 === this.freeWorkers.length) throw new Error('No free workers')
              if (!(this.nextFrame >= this.frames.length))
                return (
                  (t = this.frames[this.nextFrame++]),
                  (e = this.frames.indexOf(t)),
                  e > 0 && this.groups.has(t.data) && this.groups.get(t.data)[0] !== e
                    ? void setTimeout(
                        (function (e) {
                          return function () {
                            return e.frameFinished(t, !0)
                          }
                        })(this),
                        0
                      )
                    : ((n = this.freeWorkers.shift()),
                      (i = this.getTask(t)),
                      this.log('starting frame ' + (i.index + 1) + ' of ' + this.frames.length),
                      this.activeWorkers.push(n),
                      n.postMessage(i))
                )
            }),
            (e.prototype.getContextData = function (t) {
              return t.getImageData(0, 0, this.options.width, this.options.height).data
            }),
            (e.prototype.getImageData = function (t) {
              var e
              return (
                null == this._canvas &&
                  ((this._canvas = document.createElement('canvas')),
                  (this._canvas.width = this.options.width),
                  (this._canvas.height = this.options.height)),
                (e = this._canvas.getContext('2d')),
                (e.setFill = this.options.background),
                e.fillRect(0, 0, this.options.width, this.options.height),
                e.drawImage(t, 0, 0),
                this.getContextData(e)
              )
            }),
            (e.prototype.getTask = function (t) {
              var e, i
              if (
                ((e = this.frames.indexOf(t)),
                (i = {
                  index: e,
                  last: e === this.frames.length - 1,
                  delay: t.delay,
                  transparent: t.transparent,
                  width: this.options.width,
                  height: this.options.height,
                  quality: this.options.quality,
                  dither: this.options.dither,
                  globalPalette: this.options.globalPalette,
                  repeat: this.options.repeat,
                  canTransfer: !0
                }),
                null != t.data)
              )
                i.data = t.data
              else if (null != t.context) i.data = this.getContextData(t.context)
              else {
                if (null == t.image) throw new Error('Invalid frame')
                i.data = this.getImageData(t.image)
              }
              return i
            }),
            (e.prototype.log = function (t) {
              if (this.options.debug) return console.log(t)
            }),
            e
          )
        })(n)),
        (t.exports = r)
    },
    function (t, e) {
      function i() {
        ;(this._events = this._events || {}), (this._maxListeners = this._maxListeners || void 0)
      }
      function n(t) {
        return 'function' == typeof t
      }
      function r(t) {
        return 'number' == typeof t
      }
      function s(t) {
        return 'object' == typeof t && null !== t
      }
      function o(t) {
        return void 0 === t
      }
      ;(t.exports = i),
        (i.EventEmitter = i),
        (i.prototype._events = void 0),
        (i.prototype._maxListeners = void 0),
        (i.defaultMaxListeners = 10),
        (i.prototype.setMaxListeners = function (t) {
          if (!r(t) || t < 0 || isNaN(t)) throw TypeError('n must be a positive number')
          return (this._maxListeners = t), this
        }),
        (i.prototype.emit = function (t) {
          var e, i, r, a, h, l
          if (
            (this._events || (this._events = {}),
            'error' === t && (!this._events.error || (s(this._events.error) && !this._events.error.length)))
          ) {
            if (((e = arguments[1]), e instanceof Error)) throw e
            var f = new Error('Uncaught, unspecified "error" event. (' + e + ')')
            throw ((f.context = e), f)
          }
          if (((i = this._events[t]), o(i))) return !1
          if (n(i))
            switch (arguments.length) {
              case 1:
                i.call(this)
                break
              case 2:
                i.call(this, arguments[1])
                break
              case 3:
                i.call(this, arguments[1], arguments[2])
                break
              default:
                ;(a = Array.prototype.slice.call(arguments, 1)), i.apply(this, a)
            }
          else if (s(i))
            for (a = Array.prototype.slice.call(arguments, 1), l = i.slice(), r = l.length, h = 0; h < r; h++) l[h].apply(this, a)
          return !0
        }),
        (i.prototype.addListener = function (t, e) {
          var r
          if (!n(e)) throw TypeError('listener must be a function')
          return (
            this._events || (this._events = {}),
            this._events.newListener && this.emit('newListener', t, n(e.listener) ? e.listener : e),
            this._events[t]
              ? s(this._events[t])
                ? this._events[t].push(e)
                : (this._events[t] = [this._events[t], e])
              : (this._events[t] = e),
            s(this._events[t]) &&
              !this._events[t].warned &&
              ((r = o(this._maxListeners) ? i.defaultMaxListeners : this._maxListeners),
              r &&
                r > 0 &&
                this._events[t].length > r &&
                ((this._events[t].warned = !0),
                console.error(
                  '(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.',
                  this._events[t].length
                ),
                'function' == typeof console.trace && console.trace())),
            this
          )
        }),
        (i.prototype.on = i.prototype.addListener),
        (i.prototype.once = function (t, e) {
          function i() {
            this.removeListener(t, i), r || ((r = !0), e.apply(this, arguments))
          }
          if (!n(e)) throw TypeError('listener must be a function')
          var r = !1
          return (i.listener = e), this.on(t, i), this
        }),
        (i.prototype.removeListener = function (t, e) {
          var i, r, o, a
          if (!n(e)) throw TypeError('listener must be a function')
          if (!this._events || !this._events[t]) return this
          if (((i = this._events[t]), (o = i.length), (r = -1), i === e || (n(i.listener) && i.listener === e)))
            delete this._events[t], this._events.removeListener && this.emit('removeListener', t, e)
          else if (s(i)) {
            for (a = o; a-- > 0; )
              if (i[a] === e || (i[a].listener && i[a].listener === e)) {
                r = a
                break
              }
            if (r < 0) return this
            1 === i.length ? ((i.length = 0), delete this._events[t]) : i.splice(r, 1),
              this._events.removeListener && this.emit('removeListener', t, e)
          }
          return this
        }),
        (i.prototype.removeAllListeners = function (t) {
          var e, i
          if (!this._events) return this
          if (!this._events.removeListener)
            return 0 === arguments.length ? (this._events = {}) : this._events[t] && delete this._events[t], this
          if (0 === arguments.length) {
            for (e in this._events) 'removeListener' !== e && this.removeAllListeners(e)
            return this.removeAllListeners('removeListener'), (this._events = {}), this
          }
          if (((i = this._events[t]), n(i))) this.removeListener(t, i)
          else if (i) for (; i.length; ) this.removeListener(t, i[i.length - 1])
          return delete this._events[t], this
        }),
        (i.prototype.listeners = function (t) {
          var e
          return (e = this._events && this._events[t] ? (n(this._events[t]) ? [this._events[t]] : this._events[t].slice()) : [])
        }),
        (i.prototype.listenerCount = function (t) {
          if (this._events) {
            var e = this._events[t]
            if (n(e)) return 1
            if (e) return e.length
          }
          return 0
        }),
        (i.listenerCount = function (t, e) {
          return t.listenerCount(e)
        })
    },
    function (t, e) {
      var i, n, r, s, o
      ;(o = navigator.userAgent.toLowerCase()),
        (s = navigator.platform.toLowerCase()),
        (i = o.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [
          null,
          'unknown',
          0
        ]),
        (r = 'ie' === i[1] && document.documentMode),
        (n = {
          name: 'version' === i[1] ? i[3] : i[1],
          version: r || parseFloat('opera' === i[1] && i[4] ? i[4] : i[2]),
          platform: {
            name: o.match(/ip(?:ad|od|hone)/) ? 'ios' : (o.match(/(?:webos|android)/) || s.match(/mac|win|linux/) || ['other'])[0]
          }
        }),
        (n[n.name] = !0),
        (n[n.name + parseInt(n.version, 10)] = !0),
        (n.platform[n.platform.name] = !0),
        (t.exports = n)
    }
  ])
})
//# sourceMappingURL=gif.js.map

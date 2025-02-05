!(function (r, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports.parse_curl_js = e())
    : (r.parse_curl_js = e());
})("undefined" != typeof self ? self : this, function () {
  return (function (r) {
    function e(n) {
      if (t[n]) return t[n].exports;
      var u = (t[n] = { i: n, l: !1, exports: {} });
      return r[n].call(u.exports, u, u.exports, e), (u.l = !0), u.exports;
    }
    var t = {};
    return (
      (e.m = r),
      (e.c = t),
      (e.d = function (r, t, n) {
        e.o(r, t) ||
          Object.defineProperty(r, t, {
            configurable: !1,
            enumerable: !0,
            get: n,
          });
      }),
      (e.n = function (r) {
        var t =
          r && r.__esModule
            ? function () {
                return r.default;
              }
            : function () {
                return r;
              };
        return e.d(t, "a", t), t;
      }),
      (e.o = function (r, e) {
        return Object.prototype.hasOwnProperty.call(r, e);
      }),
      (e.p = ""),
      e((e.s = 0))
    );
  })([
    function (r, e, t) {
      "use strict";
      function n(r) {
        if (!r) return "";
        var e = { url: "" };
        if (b(r)) {
          r.match(u).forEach(function (r) {
            var t = c(r);
            if (g(t)) {
              var n = y(t),
                u = n.url,
                a = n.queryStrings;
              (e.url = u), (e.queryStrings = a);
            } else if (i(t)) {
              var o = p(t),
                f = o.key,
                l = o.value;
              (e.headers = e.headers || {}), (e.headers[f] = l);
            } else s(t) ? (e.body = v(t)) : console.log("Skipped Header " + r);
          }),
            (e.body = d(e));
        }
        return e;
      }
      Object.defineProperty(e, "__esModule", { value: !0 }), (e.parse = n);
      var u =
          /(--[a-zA-Z\-]+ '.*?')|(--[a-zA-Z\-]+)|(-[a-zA-Z\-]+? '.+?')|('?[a-z]+:\/\/.*?'+?)|("?[a-z]+:\/\/.*?"+?)/g,
        a =
          /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)$/,
        o = function (r, e) {
          for (var t = 0; t < r.length; t += 1)
            if (e.startsWith(r[t])) return !0;
          return !1;
        },
        i = function (r) {
          return o(["-H ", "--headers "], r);
        },
        s = function (r) {
          return o(
            [
              "--data ",
              "--data-ascii ",
              "-d ",
              "--data-raw ",
              "--dta-urlencode ",
              "--data-binary ",
            ],
            r
          );
        },
        c = function (r) {
          var e = ["'", '"'],
            t = r.trim();
          return e.includes(t[0]) ? t.substr(1, t.length - 2) : t;
        },
        f = function (r, e) {
          var t = r.indexOf(e);
          return r.substr(t);
        },
        l = function (h) {
          return (
            h["content-type"] &&
            -1 !== h["content-type"].indexOf("application/json")
          );
        },
        d = function (r) {
          var e = r.body,
            t = r.headers;
          if (e && l(t))
            try {
              var n = e.replace('\\"', '"').replace("\\'", "'");
              return JSON.parse(n);
            } catch (r) {
              console.log("Cannot parse JSON Data " + r.message);
            }
          return e;
        },
        p = function (r) {
          var e = f(r, " ").split(":");
          return { key: e[0].trim(), value: e[1].trim() };
        },
        h = function (r) {
          var e = r.indexOf("?"),
            t = {};
          if (-1 !== e) {
            (r.substr(e + 1).split("&") || []).forEach(function (r) {
              var e = r.split("=");
              t[e[0]] = e[1];
            });
          }
          return t;
        },
        y = function (r) {
          var e = r.match(a) || [];
          if (e.length) {
            var t = e[0];
            return { url: t, queryStrings: h(t) };
          }
          return { url: "", queryStrings: {} };
        },
        v = function (r) {
          return c(f(r, " "));
        },
        b = function (r) {
          return r.trim().startsWith("curl ");
        },
        g = function (r) {
          return !!(r.match(a) || []).length;
        };
      e.default = n;
    },
  ]);
});
//# sourceMappingURL=parse-curl-js.js.map

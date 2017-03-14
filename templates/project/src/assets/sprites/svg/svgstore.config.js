/* eslint no-undef:0 */
const CDN_DOMAIN              = 'undefined' === typeof __CDN_DOMAIN__ ? '/' : __CDN_DOMAIN__;
const SVG_NAMESPACE           = 'http://www.w3.org/1999/xlink';
const SVGSTORE_PLUGIN_NEST_ID = 'webpack-svgstore-plugin';
const __svg__                 = {
  path : './**/*.svg',
  name : 'panels/svgsprite.[hash].svg',
};

window.__SVG_SPRITE__ = SVGSpritesRequest(__svg__) || '';

export function SVGSpritesRequest (options) {
  if (!options.filename) {
    return;
  }

  let conflit = document.getElementById(SVGSTORE_PLUGIN_NEST_ID);
  conflit && conflit.parentNode.removeChild(conflit);

  let xhr = new XMLHttpRequest();
  if ('undefined' !== typeof XDomainRequest) {
    xhr = new XDomainRequest();
  }

  xhr.open('GET', options.filename, true);
  xhr.onload = function () {
    if (!xhr.responseText || '<svg' !== xhr.responseText.substr(0, 4)) {
      throw new Error('Invalid SVG Response');
    }

    if (200 > xhr.status || 300 <= xhr.status) {
      return;
    }

    let x       = document.createElement('x');
    x.id        = SVGSTORE_PLUGIN_NEST_ID;
    x.innerHTML = xhr.responseText;

    let body = document.body;
    let svg  = x.getElementsByTagName('svg')[0];

    if (svg) {
      svg.setAttribute('aria-hidden', 'true');

      svg.style.position = 'absolute';
      svg.style.width    = 0;
      svg.style.height   = 0;
      svg.style.overflow = 'hidden';

      let uses = svg.getElementsByTagName('use');
      Array.prototype.forEach.call(uses, function (use) {
        let id = use.getAttributeNS(SVG_NAMESPACE, 'href');
        /^#/.exec(id) && use.setAttributeNS(SVG_NAMESPACE, 'href', '//' + CDN_DOMAIN + options.filename + id);
      });

      body.insertBefore(svg, body.firstChild);
    }
  };

  xhr.send();

  return options.filename;
}

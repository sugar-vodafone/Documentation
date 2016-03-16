'use strict';

exports.__esModule = true;
exports.fromRange = fromRange;
exports.toRange = toRange;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _getDocument = require('get-document');

var _getDocument2 = _interopRequireDefault(_getDocument);

var _domSeek = require('dom-seek');

var _domSeek2 = _interopRequireDefault(_domSeek);

var _simpleXpathPosition = require('simple-xpath-position');

var xpath = _interopRequireWildcard(_simpleXpathPosition);

var SHOW_TEXT = 4;

/**
 * Convert a `Range` to a pair of XPath expressions and offsets.
 *
 * If the optional parameter `root` is supplied, the computed XPath expressions
 * will be relative to it.
 *
 * @param {Range} range The Range to convert.
 * @param {Node} [root] The root context for the XPath expressions.
 * @returns {{start, startOffset, end, endOffset}}
 */

function fromRange(range, root) {
  var sc = range.startContainer;
  var so = range.startOffset;
  var ec = range.endContainer;
  var eo = range.endOffset;

  var start = xpath.fromNode(sc, root);
  var end = xpath.fromNode(ec, root);

  return {
    start: start,
    end: end,
    startOffset: so,
    endOffset: eo
  };
}

/**
 * Construct a `Range` from the given XPath expressions and offsets.
 *
 * If the optional parameter `root` is supplied, the XPath expressions are
 * evaluated as relative to it.
 *
 * @param {string} startPath An XPath expression for the start container.
 * @param {Number} startOffset The textual offset within the start container.
 * @param {string} endPath An XPath expression for the end container.
 * @param {Number} endOffset The textual offset within the end container.
 * @param {Node} [root] The root context for the XPath expressions.
 * @returns Range
 */

function toRange(startPath, startOffset, endPath, endOffset, root) {
  var document = _getDocument2['default'](root);

  var sc = xpath.toNode(startPath, root);
  if (sc === null) throw notFound('start');

  var si = document.createNodeIterator(sc, SHOW_TEXT);
  var so = startOffset - _domSeek2['default'](si, startOffset);

  sc = si.referenceNode;
  if (!si.pointerBeforeReferenceNode) {
    if (so > 0) throw indexSize('start');
    so += sc.length;
  }

  var ec = xpath.toNode(endPath, root);
  if (ec === null) throw notFound('end');

  var ei = document.createNodeIterator(ec, SHOW_TEXT);
  var eo = endOffset - _domSeek2['default'](ei, endOffset);

  ec = ei.referenceNode;
  if (!ei.pointerBeforeReferenceNode) {
    if (eo > 0) throw indexSize('end');
    eo += ec.length;
  }

  var range = document.createRange();
  range.setStart(sc, so);
  range.setEnd(ec, eo);

  return range;

  function notFound(which) {
    var error = new Error('The ' + which + ' node was not found.');
    error.name = 'NotFoundError';
    return error;
  }

  function indexSize(which) {
    var error = new Error('There is no text at the requested ' + which + ' offset.');
    error.name = 'IndexSizeError';
    return error;
  }
}
//# sourceMappingURL=data:application/json;base64,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LFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDdkIsUUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLFVBQVEsS0FBSywwQkFBdUIsQ0FBQTtBQUN6RCxTQUFLLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQTtBQUM1QixXQUFPLEtBQUssQ0FBQTtHQUNiOztBQUVELFdBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtBQUN4QixRQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssd0NBQXNDLEtBQUssY0FBVyxDQUFBO0FBQzNFLFNBQUssQ0FBQyxJQUFJLEdBQUcsZ0JBQWdCLENBQUE7QUFDN0IsV0FBTyxLQUFLLENBQUE7R0FDYjtDQUNGIiwiZmlsZSI6InJhbmdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdldERvY3VtZW50IGZyb20gJ2dldC1kb2N1bWVudCdcbmltcG9ydCBzZWVrIGZyb20gJ2RvbS1zZWVrJ1xuaW1wb3J0ICogYXMgeHBhdGggZnJvbSAnc2ltcGxlLXhwYXRoLXBvc2l0aW9uJ1xuXG5jb25zdCBTSE9XX1RFWFQgPSA0XG5cblxuLyoqXG4gKiBDb252ZXJ0IGEgYFJhbmdlYCB0byBhIHBhaXIgb2YgWFBhdGggZXhwcmVzc2lvbnMgYW5kIG9mZnNldHMuXG4gKlxuICogSWYgdGhlIG9wdGlvbmFsIHBhcmFtZXRlciBgcm9vdGAgaXMgc3VwcGxpZWQsIHRoZSBjb21wdXRlZCBYUGF0aCBleHByZXNzaW9uc1xuICogd2lsbCBiZSByZWxhdGl2ZSB0byBpdC5cbiAqXG4gKiBAcGFyYW0ge1JhbmdlfSByYW5nZSBUaGUgUmFuZ2UgdG8gY29udmVydC5cbiAqIEBwYXJhbSB7Tm9kZX0gW3Jvb3RdIFRoZSByb290IGNvbnRleHQgZm9yIHRoZSBYUGF0aCBleHByZXNzaW9ucy5cbiAqIEByZXR1cm5zIHt7c3RhcnQsIHN0YXJ0T2Zmc2V0LCBlbmQsIGVuZE9mZnNldH19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUmFuZ2UocmFuZ2UsIHJvb3QpIHtcbiAgbGV0IHNjID0gcmFuZ2Uuc3RhcnRDb250YWluZXJcbiAgbGV0IHNvID0gcmFuZ2Uuc3RhcnRPZmZzZXRcbiAgbGV0IGVjID0gcmFuZ2UuZW5kQ29udGFpbmVyXG4gIGxldCBlbyA9IHJhbmdlLmVuZE9mZnNldFxuXG4gIGxldCBzdGFydCA9IHhwYXRoLmZyb21Ob2RlKHNjLCByb290KVxuICBsZXQgZW5kID0geHBhdGguZnJvbU5vZGUoZWMsIHJvb3QpXG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogc3RhcnQsXG4gICAgZW5kOiBlbmQsXG4gICAgc3RhcnRPZmZzZXQ6IHNvLFxuICAgIGVuZE9mZnNldDogZW8sXG4gIH1cbn1cblxuXG4vKipcbiAqIENvbnN0cnVjdCBhIGBSYW5nZWAgZnJvbSB0aGUgZ2l2ZW4gWFBhdGggZXhwcmVzc2lvbnMgYW5kIG9mZnNldHMuXG4gKlxuICogSWYgdGhlIG9wdGlvbmFsIHBhcmFtZXRlciBgcm9vdGAgaXMgc3VwcGxpZWQsIHRoZSBYUGF0aCBleHByZXNzaW9ucyBhcmVcbiAqIGV2YWx1YXRlZCBhcyByZWxhdGl2ZSB0byBpdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RhcnRQYXRoIEFuIFhQYXRoIGV4cHJlc3Npb24gZm9yIHRoZSBzdGFydCBjb250YWluZXIuXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhcnRPZmZzZXQgVGhlIHRleHR1YWwgb2Zmc2V0IHdpdGhpbiB0aGUgc3RhcnQgY29udGFpbmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZFBhdGggQW4gWFBhdGggZXhwcmVzc2lvbiBmb3IgdGhlIGVuZCBjb250YWluZXIuXG4gKiBAcGFyYW0ge051bWJlcn0gZW5kT2Zmc2V0IFRoZSB0ZXh0dWFsIG9mZnNldCB3aXRoaW4gdGhlIGVuZCBjb250YWluZXIuXG4gKiBAcGFyYW0ge05vZGV9IFtyb290XSBUaGUgcm9vdCBjb250ZXh0IGZvciB0aGUgWFBhdGggZXhwcmVzc2lvbnMuXG4gKiBAcmV0dXJucyBSYW5nZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9SYW5nZShzdGFydFBhdGgsIHN0YXJ0T2Zmc2V0LCBlbmRQYXRoLCBlbmRPZmZzZXQsIHJvb3QpIHtcbiAgbGV0IGRvY3VtZW50ID0gZ2V0RG9jdW1lbnQocm9vdClcblxuICBsZXQgc2MgPSB4cGF0aC50b05vZGUoc3RhcnRQYXRoLCByb290KVxuICBpZiAoc2MgPT09IG51bGwpIHRocm93IG5vdEZvdW5kKCdzdGFydCcpXG5cbiAgbGV0IHNpID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKHNjLCBTSE9XX1RFWFQpXG4gIGxldCBzbyA9IHN0YXJ0T2Zmc2V0IC0gc2VlayhzaSwgc3RhcnRPZmZzZXQpXG5cbiAgc2MgPSBzaS5yZWZlcmVuY2VOb2RlXG4gIGlmICghc2kucG9pbnRlckJlZm9yZVJlZmVyZW5jZU5vZGUpIHtcbiAgICBpZiAoc28gPiAwKSB0aHJvdyBpbmRleFNpemUoJ3N0YXJ0JylcbiAgICBzbyArPSBzYy5sZW5ndGhcbiAgfVxuXG4gIGxldCBlYyA9IHhwYXRoLnRvTm9kZShlbmRQYXRoLCByb290KVxuICBpZiAoZWMgPT09IG51bGwpIHRocm93IG5vdEZvdW5kKCdlbmQnKVxuXG4gIGxldCBlaSA9IGRvY3VtZW50LmNyZWF0ZU5vZGVJdGVyYXRvcihlYywgU0hPV19URVhUKVxuICBsZXQgZW8gPSBlbmRPZmZzZXQgLSBzZWVrKGVpLCBlbmRPZmZzZXQpXG5cbiAgZWMgPSBlaS5yZWZlcmVuY2VOb2RlXG4gIGlmICghZWkucG9pbnRlckJlZm9yZVJlZmVyZW5jZU5vZGUpIHtcbiAgICBpZiAoZW8gPiAwKSB0aHJvdyBpbmRleFNpemUoJ2VuZCcpXG4gICAgZW8gKz0gZWMubGVuZ3RoXG4gIH1cblxuICBsZXQgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpXG4gIHJhbmdlLnNldFN0YXJ0KHNjLCBzbylcbiAgcmFuZ2Uuc2V0RW5kKGVjLCBlbylcblxuICByZXR1cm4gcmFuZ2VcblxuICBmdW5jdGlvbiBub3RGb3VuZCh3aGljaCkge1xuICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcihgVGhlICR7d2hpY2h9IG5vZGUgd2FzIG5vdCBmb3VuZC5gKVxuICAgIGVycm9yLm5hbWUgPSAnTm90Rm91bmRFcnJvcidcbiAgICByZXR1cm4gZXJyb3JcbiAgfVxuXG4gIGZ1bmN0aW9uIGluZGV4U2l6ZSh3aGljaCkge1xuICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gdGV4dCBhdCB0aGUgcmVxdWVzdGVkICR7d2hpY2h9IG9mZnNldC5gKVxuICAgIGVycm9yLm5hbWUgPSAnSW5kZXhTaXplRXJyb3InXG4gICAgcmV0dXJuIGVycm9yXG4gIH1cbn1cbiJdfQ==
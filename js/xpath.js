'use strict';

/**
 * Compute an XPath expression for the given node.
 *
 * If the optional parameter `root` is supplied, the computed XPath expression
 * will be relative to it.
 *
 * @param {Node} node The node for which to compute an XPath expression.
 * @param {Node} [root] The root context for the XPath expression.
 * @returns {string}
 */

function fromNode(node) {
  var root = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

  var path = '/';
  while (node !== root) {
    if (!node) {
      var message = 'The supplied node is not contained by the root node.';
      var _name = 'InvalidNodeTypeError';
      throw new _domException2['default'](message, _name);
    }
    path = '/' + nodeName(node) + '[' + nodePosition(node) + ']' + path;
    node = node.parentNode;
  }
  return path.replace(/\/$/, '');
}

/**
 * Find a node using an XPath relative to the given root node.
 *
 * If the optional parameter `root` is supplied, the XPath expressions are
 * evaluated as relative to it.
 *
 * If the optional parameter `resolver` is supplied, it will be used to resolve
 * any namespaces within the XPath.
 *
 * @param {string} path An XPath String to evaluate.
 * @param {Node} [root] The root context for the XPath expression.
 * @returns {Node|null} The first matching Node or null if none is found.
 */

function toNode(path) {
  var root = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];
  var resolver = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  // Check for resolver but no root argument.
  if (typeof root === 'function') {
    resolver = root;
    root = document;
  }

  // Make the path relative to the root, if not the document.
  if (root !== document) path = path.replace(/^\//, './');

  // Make a default resolver.
  if (resolver === null && document.lookupNamespaceURI) {
    (function () {
      var documentElement = _getDocument2['default'](root).documentElement;
      var defaultNS = documentElement.lookupNamespaceURI(null) || HTML_NAMESPACE;
      resolver = function (prefix) {
        var ns = { '_default_': defaultNS };
        return ns[prefix] || documentElement.lookupNamespaceURI(prefix);
      };
    })();
  }

  return resolve(path, root, resolver);
}

// Get the XPath node name.
function nodeName(node) {
  switch (node.nodeName) {
    case '#text':
      return 'text()';
    case '#comment':
      return 'comment()';
    case '#cdata-section':
      return 'cdata-section()';
    default:
      return node.nodeName.toLowerCase();
  }
}

// Get the ordinal position of this node among its siblings of the same name.
function nodePosition(node) {
  var name = node.nodeName;
  var position = 1;
  while (node = node.previousSibling) {
    if (node.nodeName === name) position += 1;
  }
  return position;
}

// Find a single node with XPath `path`
function resolve(path, root, resolver) {
  try {
    // Add a default value to each path part lacking a prefix.
    var nspath = path.replace(/\/(?!\.)([^\/:\(]+)(?=\/|$)/g, '/_default_:$1');
    return platformResolve(nspath, root, resolver);
  } catch (err) {
    return fallbackResolve(path, root);
  }
}

// Find a single node with XPath `path` using the simple, built-in evaluator.
function fallbackResolve(path, root) {
  var steps = path.split("/");
  var node = root;
  while (node) {
    var step = steps.shift();
    if (step === undefined) break;
    if (step === '.') continue;

    var _step$split = step.split(/[\[\]]/);

    var _name2 = _step$split[0];
    var position = _step$split[1];

    _name2 = _name2.replace('_default_:', '');
    position = position ? parseInt(position) : 1;
    node = findChild(node, _name2, position);
  }
  return node;
}

// Find a single node with XPath `path` using `document.evaluate`.
function platformResolve(path, root, resolver) {
  var r = document.evaluate(path, root, resolver, FIRST_ORDERED_NODE_TYPE, null);
  return r.singleNodeValue;
}

// Find the child of the given node by name and ordinal position.
function findChild(node, name, position) {
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (nodeName(node) === name && --position === 0) return node;
  }
  return null;
}
//# sourceMappingURL=data:application/json;base64,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QUFDLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzlFLFNBQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQTtDQUN6Qjs7O0FBSUQsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDdkMsT0FBSyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRyxJQUFJLEVBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDNUQsUUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsUUFBUSxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQTtHQUM3RDtBQUNELFNBQU8sSUFBSSxDQUFBO0NBQ1oiLCJmaWxlIjoieHBhdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2V0RG9jdW1lbnQgZnJvbSAnZ2V0LWRvY3VtZW50J1xuXG5pbXBvcnQgRE9NRXhjZXB0aW9uIGZyb20gJy4vZG9tLWV4Y2VwdGlvbidcblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9YUGF0aFJlc3VsdFxuY29uc3QgRklSU1RfT1JERVJFRF9OT0RFX1RZUEUgPSA5XG5cbi8vIERlZmF1bHQgbmFtZXNwYWNlIGZvciBYSFRNTCBkb2N1bWVudHNcbmNvbnN0IEhUTUxfTkFNRVNQQUNFID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnXG5cblxuLyoqXG4gKiBDb21wdXRlIGFuIFhQYXRoIGV4cHJlc3Npb24gZm9yIHRoZSBnaXZlbiBub2RlLlxuICpcbiAqIElmIHRoZSBvcHRpb25hbCBwYXJhbWV0ZXIgYHJvb3RgIGlzIHN1cHBsaWVkLCB0aGUgY29tcHV0ZWQgWFBhdGggZXhwcmVzc2lvblxuICogd2lsbCBiZSByZWxhdGl2ZSB0byBpdC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgVGhlIG5vZGUgZm9yIHdoaWNoIHRvIGNvbXB1dGUgYW4gWFBhdGggZXhwcmVzc2lvbi5cbiAqIEBwYXJhbSB7Tm9kZX0gW3Jvb3RdIFRoZSByb290IGNvbnRleHQgZm9yIHRoZSBYUGF0aCBleHByZXNzaW9uLlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21Ob2RlKG5vZGUsIHJvb3QgPSBkb2N1bWVudCkge1xuICBsZXQgcGF0aCA9ICcvJ1xuICB3aGlsZSAobm9kZSAhPT0gcm9vdCkge1xuICAgIGlmICghbm9kZSkge1xuICAgICAgbGV0IG1lc3NhZ2UgPSAnVGhlIHN1cHBsaWVkIG5vZGUgaXMgbm90IGNvbnRhaW5lZCBieSB0aGUgcm9vdCBub2RlLidcbiAgICAgIGxldCBuYW1lID0gJ0ludmFsaWROb2RlVHlwZUVycm9yJ1xuICAgICAgdGhyb3cgbmV3IERPTUV4Y2VwdGlvbihtZXNzYWdlLCBuYW1lKVxuICAgIH1cbiAgICBwYXRoID0gYC8ke25vZGVOYW1lKG5vZGUpfVske25vZGVQb3NpdGlvbihub2RlKX1dJHtwYXRofWBcbiAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlXG4gIH1cbiAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFwvJC8sICcnKVxufVxuXG5cbi8qKlxuICogRmluZCBhIG5vZGUgdXNpbmcgYW4gWFBhdGggcmVsYXRpdmUgdG8gdGhlIGdpdmVuIHJvb3Qgbm9kZS5cbiAqXG4gKiBJZiB0aGUgb3B0aW9uYWwgcGFyYW1ldGVyIGByb290YCBpcyBzdXBwbGllZCwgdGhlIFhQYXRoIGV4cHJlc3Npb25zIGFyZVxuICogZXZhbHVhdGVkIGFzIHJlbGF0aXZlIHRvIGl0LlxuICpcbiAqIElmIHRoZSBvcHRpb25hbCBwYXJhbWV0ZXIgYHJlc29sdmVyYCBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSB1c2VkIHRvIHJlc29sdmVcbiAqIGFueSBuYW1lc3BhY2VzIHdpdGhpbiB0aGUgWFBhdGguXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggQW4gWFBhdGggU3RyaW5nIHRvIGV2YWx1YXRlLlxuICogQHBhcmFtIHtOb2RlfSBbcm9vdF0gVGhlIHJvb3QgY29udGV4dCBmb3IgdGhlIFhQYXRoIGV4cHJlc3Npb24uXG4gKiBAcmV0dXJucyB7Tm9kZXxudWxsfSBUaGUgZmlyc3QgbWF0Y2hpbmcgTm9kZSBvciBudWxsIGlmIG5vbmUgaXMgZm91bmQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b05vZGUocGF0aCwgcm9vdCA9IGRvY3VtZW50LCByZXNvbHZlciA9IG51bGwpIHtcbiAgLy8gQ2hlY2sgZm9yIHJlc29sdmVyIGJ1dCBubyByb290IGFyZ3VtZW50LlxuICBpZiAodHlwZW9mKHJvb3QpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmVzb2x2ZXIgPSByb290XG4gICAgcm9vdCA9IGRvY3VtZW50XG4gIH1cblxuICAvLyBNYWtlIHRoZSBwYXRoIHJlbGF0aXZlIHRvIHRoZSByb290LCBpZiBub3QgdGhlIGRvY3VtZW50LlxuICBpZiAocm9vdCAhPT0gZG9jdW1lbnQpIHBhdGggPSBwYXRoLnJlcGxhY2UoL15cXC8vLCAnLi8nKVxuXG4gIC8vIE1ha2UgYSBkZWZhdWx0IHJlc29sdmVyLlxuICBpZiAocmVzb2x2ZXIgPT09IG51bGwgJiYgZG9jdW1lbnQubG9va3VwTmFtZXNwYWNlVVJJKSB7XG4gICAgbGV0IGRvY3VtZW50RWxlbWVudCA9IGdldERvY3VtZW50KHJvb3QpLmRvY3VtZW50RWxlbWVudFxuICAgIGxldCBkZWZhdWx0TlMgPSBkb2N1bWVudEVsZW1lbnQubG9va3VwTmFtZXNwYWNlVVJJKG51bGwpIHx8IEhUTUxfTkFNRVNQQUNFXG4gICAgcmVzb2x2ZXIgPSAocHJlZml4KSA9PiB7XG4gICAgICBsZXQgbnMgPSB7J19kZWZhdWx0Xyc6IGRlZmF1bHROU31cbiAgICAgIHJldHVybiBuc1twcmVmaXhdIHx8IGRvY3VtZW50RWxlbWVudC5sb29rdXBOYW1lc3BhY2VVUkkocHJlZml4KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXNvbHZlKHBhdGgsIHJvb3QsIHJlc29sdmVyKVxufVxuXG5cbi8vIEdldCB0aGUgWFBhdGggbm9kZSBuYW1lLlxuZnVuY3Rpb24gbm9kZU5hbWUobm9kZSkge1xuICBzd2l0Y2ggKG5vZGUubm9kZU5hbWUpIHtcbiAgY2FzZSAnI3RleHQnOiByZXR1cm4gJ3RleHQoKSdcbiAgY2FzZSAnI2NvbW1lbnQnOiByZXR1cm4gJ2NvbW1lbnQoKSdcbiAgY2FzZSAnI2NkYXRhLXNlY3Rpb24nOiByZXR1cm4gJ2NkYXRhLXNlY3Rpb24oKSdcbiAgZGVmYXVsdDogcmV0dXJuIG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuICB9XG59XG5cblxuLy8gR2V0IHRoZSBvcmRpbmFsIHBvc2l0aW9uIG9mIHRoaXMgbm9kZSBhbW9uZyBpdHMgc2libGluZ3Mgb2YgdGhlIHNhbWUgbmFtZS5cbmZ1bmN0aW9uIG5vZGVQb3NpdGlvbihub2RlKSB7XG4gIGxldCBuYW1lID0gbm9kZS5ub2RlTmFtZVxuICBsZXQgcG9zaXRpb24gPSAxXG4gIHdoaWxlICgobm9kZSA9IG5vZGUucHJldmlvdXNTaWJsaW5nKSkge1xuICAgIGlmIChub2RlLm5vZGVOYW1lID09PSBuYW1lKSBwb3NpdGlvbiArPSAxXG4gIH1cbiAgcmV0dXJuIHBvc2l0aW9uXG59XG5cblxuLy8gRmluZCBhIHNpbmdsZSBub2RlIHdpdGggWFBhdGggYHBhdGhgXG5mdW5jdGlvbiByZXNvbHZlKHBhdGgsIHJvb3QsIHJlc29sdmVyKSB7XG4gIHRyeSB7XG4gICAgLy8gQWRkIGEgZGVmYXVsdCB2YWx1ZSB0byBlYWNoIHBhdGggcGFydCBsYWNraW5nIGEgcHJlZml4LlxuICAgIGxldCBuc3BhdGggPSBwYXRoLnJlcGxhY2UoL1xcLyg/IVxcLikoW15cXC86XFwoXSspKD89XFwvfCQpL2csICcvX2RlZmF1bHRfOiQxJylcbiAgICByZXR1cm4gcGxhdGZvcm1SZXNvbHZlKG5zcGF0aCwgcm9vdCwgcmVzb2x2ZXIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBmYWxsYmFja1Jlc29sdmUocGF0aCwgcm9vdClcbiAgfVxufVxuXG5cbi8vIEZpbmQgYSBzaW5nbGUgbm9kZSB3aXRoIFhQYXRoIGBwYXRoYCB1c2luZyB0aGUgc2ltcGxlLCBidWlsdC1pbiBldmFsdWF0b3IuXG5mdW5jdGlvbiBmYWxsYmFja1Jlc29sdmUocGF0aCwgcm9vdCkge1xuICBsZXQgc3RlcHMgPSBwYXRoLnNwbGl0KFwiL1wiKVxuICBsZXQgbm9kZSA9IHJvb3RcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBsZXQgc3RlcCA9IHN0ZXBzLnNoaWZ0KClcbiAgICBpZiAoc3RlcCA9PT0gdW5kZWZpbmVkKSBicmVha1xuICAgIGlmIChzdGVwID09PSAnLicpIGNvbnRpbnVlXG4gICAgbGV0IFtuYW1lLCBwb3NpdGlvbl0gPSBzdGVwLnNwbGl0KC9bXFxbXFxdXS8pXG4gICAgbmFtZSA9IG5hbWUucmVwbGFjZSgnX2RlZmF1bHRfOicsICcnKVxuICAgIHBvc2l0aW9uID0gcG9zaXRpb24gPyBwYXJzZUludChwb3NpdGlvbikgOiAxXG4gICAgbm9kZSA9IGZpbmRDaGlsZChub2RlLCBuYW1lLCBwb3NpdGlvbilcbiAgfVxuICByZXR1cm4gbm9kZVxufVxuXG5cbi8vIEZpbmQgYSBzaW5nbGUgbm9kZSB3aXRoIFhQYXRoIGBwYXRoYCB1c2luZyBgZG9jdW1lbnQuZXZhbHVhdGVgLlxuZnVuY3Rpb24gcGxhdGZvcm1SZXNvbHZlKHBhdGgsIHJvb3QsIHJlc29sdmVyKSB7XG4gIGxldCByID0gZG9jdW1lbnQuZXZhbHVhdGUocGF0aCwgcm9vdCwgcmVzb2x2ZXIsIEZJUlNUX09SREVSRURfTk9ERV9UWVBFLCBudWxsKVxuICByZXR1cm4gci5zaW5nbGVOb2RlVmFsdWVcbn1cblxuXG4vLyBGaW5kIHRoZSBjaGlsZCBvZiB0aGUgZ2l2ZW4gbm9kZSBieSBuYW1lIGFuZCBvcmRpbmFsIHBvc2l0aW9uLlxuZnVuY3Rpb24gZmluZENoaWxkKG5vZGUsIG5hbWUsIHBvc2l0aW9uKSB7XG4gIGZvciAobm9kZSA9IG5vZGUuZmlyc3RDaGlsZCA7IG5vZGUgOyBub2RlID0gbm9kZS5uZXh0U2libGluZykge1xuICAgIGlmIChub2RlTmFtZShub2RlKSA9PT0gbmFtZSAmJiAtLXBvc2l0aW9uID09PSAwKSByZXR1cm4gbm9kZVxuICB9XG4gIHJldHVybiBudWxsXG59XG4iXX0=
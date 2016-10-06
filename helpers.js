function escapeHtml(string) {
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&apos;',
    "/": '&#x2F;'
  };

  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}

function encodeHtml(string) {
  var entityMap = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    '&quot;': '"',
    "&apos;": "'",
    "&#x2F;": '/'
  };

  return String(string).replace(/(&amp;|&lt;|&gt;|&quot;|&apos;|&#x2F;)/g, function (s) {
    return entityMap[s];
  });
}

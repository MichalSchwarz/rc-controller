var fs = require('fs');
fs.readFile('www/index.html', 'utf8', function(err, controllerContent) {
  if(err) {
    throw err;
  }
  var noNewlines = controllerContent.replace(/(\r\n|\n|\r)/gm, "");
  var replaceQuotes = noNewlines.replace(/"/gm, '\\"');
  fs.readFile('src/build/index_html_skeleton.h', 'utf8', function(err, skeletonContent) {
    if(err) {
      throw err;
    }
    var result = skeletonContent.replace(/INSERT_HERE/, replaceQuotes);
    fs.writeFile("dist/index_html.h", result, function(err) {
      if(err) {
        throw err;
      }
    });
  });
});
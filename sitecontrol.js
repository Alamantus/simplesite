$(document).ready(function() {
  // Get site data and process it.
  $.getJSON('sitedata.json', function(data) {
    var htmlContent = '<div class="container">';

      htmlContent += '<div class="header"><a href="./">\
        <h2 class="site-title">' + data.siteTitle + '</h2>\
        <h4 class="site-tagline">' + data.siteTagline + '</h4>\
      </a></div>';

      htmlContent += '<div class="site-content">';

        htmlContent += '<div class="menu-bar">';

          htmlContent += '<ul>';

          for (var i = 0; i < data.pages.length; i++) {
            htmlContent += buildSidebarContent(i, data.pages[i].title, data.pages[i].text, data.pages[i].type);
          }

          htmlContent += '</ul>';

        // End of menu-bar
        htmlContent += '</div>';
        

      // End of site-content
      htmlContent += '</div>';

    // End of container
    htmlContent += '</div>';

    $('#site').html(htmlContent);

    $('.page-container').each(function () {
      var page = $(this).detach();
      $('#site').append(page);
    });

    // Set Up Listeners
    $('.menu-item').click(function() {
      $('#' + this.id + 'Page').fadeIn();
    });

    $('.close-page-button').click(function() {
      $('#menu' + this.id + 'Page').fadeOut();
    });

  });
});

function buildSidebarContent(index, title, text, type) {
  index = index.toString();
  var result = '<li>';

  if (type === 'link') {
    result += '<a href="' + encodeHtml(text) + '" target="_blank">' + title + '</a>';
  } else {
    result += '<span id="menu' + index + '" class="menu-item">' + title + '</span>';
    result += '<div id="menu' + index + 'Page" class="page-container" style="display: none;"><div class="page">';

      result += '<div class="page-content-container"><div id="menu' + index + 'Content" class="page-content">'
        + encodeHtml(text)
      + '</div></div>';

      result += '<button id="' + index + '" class="close-page-button">&times;</button>';

    result += '</div></div>';
  }

  result += '</li>';

  return result;
}

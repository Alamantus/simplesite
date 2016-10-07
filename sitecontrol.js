$(document).ready(function() {
  // Get site data and process it.
  $.getJSON('sitedata.json?nocache=' + moment().valueOf().toString(), function(data) {
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

        htmlContent += '<div class="news-bar">';

          htmlContent += '<h4>News</h4>';

          htmlContent += '<ul>';

          for (var i = 0; i < data.news.length; i++) {
            if (moment().valueOf() > data.news[i].published) {
              htmlContent += buildNewsContent(i, data.news[i].title, data.news[i].text, data.news[i].published);
            }
          }

          htmlContent += '</ul>';

        // End of news-bar
        htmlContent += '</div>';

        htmlContent += '<div class="footer">';

          htmlContent += '<div class="left-box">';

            htmlContent += '<span>something goes here</span>';

          htmlContent += '</div>';

          htmlContent += '<div class="right-box">';

            htmlContent += '<span>and here</span>';

          htmlContent += '</div>';

        // End of footer
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
      $('#' + this.id.replace('Link', 'Page')).fadeIn();
    });

    $('.close-page-button').click(function() {
      $('#' + this.id + 'Page').fadeOut();
    });

  });
});

function buildSidebarContent(index, title, text, type) {
  index = index.toString();
  var result = '<li>';

  if (type === 'link') {
    result += '<a href="' + encodeHtml(text) + '" target="_blank">' + title + '</a>';
  } else {
    result += '<span id="menu' + index + 'Link" class="menu-item">' + title + '</span>';
    result += '<div id="menu' + index + 'Page" class="page-container" style="display: none;"><div class="page">';

      result += '<div class="page-content-container"><div id="menu' + index + 'Content" class="page-content">'
        + encodeHtml(text)
      + '</div></div>';

      result += '<button id="news' + index + '" class="close-page-button">&times;</button>';

    result += '</div></div>';
  }

  result += '</li>';

  return result;
}

function buildNewsContent(index, title, text, date) {
  index = index.toString();
  var result = '<li>';

    result += '<span id="news' + index + 'Link" class="menu-item">' + title + '</span>';
    result += '<small id="news' + index + 'Published">' + moment(date).format('h:mm:ssa D/M/YYYY') + '</small>';
    result += '<div id="news' + index + 'Page" class="page-container" style="display: none;"><div class="page">';

      result += '<div class="page-content-container"><div id="news' + index + 'Content" class="page-content">'
        + encodeHtml(text)
      + '</div></div>';

      result += '<button id="news' + index + '" class="close-page-button">&times;</button>';

    result += '</div></div>';

  result += '</li>';

  return result;
}

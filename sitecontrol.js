$(document).ready(function() {
  // Get site data and process it.
  $.getJSON('sitedata.json?nocache=' + moment().valueOf().toString(), function(data) {
    var htmlContent = '<div class="container">';

      htmlContent += '<div class="header"><a href="./">\
        <span class="site-title" style="' + data.titleStyles + '">' + data.siteTitle + '</span>\
      </a></div>';

      htmlContent += '<div class="site-content">';

        htmlContent += '<div class="menu-bar"><div class="menu-bar-contents">';

          htmlContent += '<ul>';

          for (var i = 0; i < data.pages.length; i++) {
            htmlContent += buildSidebarContent(i, data.pages[i].title, data.pages[i].text, data.pages[i].type);
          }

          htmlContent += '</ul>';

        // End of menu-bar
        htmlContent += '</div></div>';

        htmlContent += '<div class="news-bar"><div class="news-box-container"><div class="news-box">';

          htmlContent += '<span style="' + data.newsHeadlineStyles + '">' + data.newsHeadline + '</span>';

          htmlContent += '<ul>';

          for (var i = 0; i < data.news.length; i++) {
            if (moment().valueOf() > data.news[i].published) {
              htmlContent += buildNewsContent(i, data.news[i].title, data.news[i].text, data.news[i].published);
            }
          }

          htmlContent += '</ul>';

        // End of news-bar
        htmlContent += '</div></div></div>';

        htmlContent += '<div class="footer">';

          htmlContent += '<div class="left-box">';

            htmlContent += '<span id="footerLeftLink" class="footer-link">' + data.footerLeft.title + '</span>';

            htmlContent += '<div id="footerLeftPage" class="page-container" style="display: none;"><div class="page">';

              htmlContent += '<div class="page-content-container"><div id="footerLeftContent" class="page-content fill-space">'
                + '<iframe id="footerLeftPageIFrame" src="" data-src="' + encodeHtml(data.footerLeft.text) + '"></iframe>'
              + '</div></div>';

              htmlContent += '<button id="footerLeft" class="close-page-button">&times;</button>';

            // End of footerLeft Page
            htmlContent += '</div></div>';

          htmlContent += '</div>';

          htmlContent += '<div class="right-box">';

            htmlContent += '<span id="footerRightLink" class="footer-link">' + data.footerRight.title + '</span>';

            htmlContent += '<div id="footerRightPage" class="page-container" style="display: none;"><div class="page">';

              htmlContent += '<div class="page-content-container"><div id="footerRightContent" class="page-content">'
                + encodeHtml(data.footerRight.text)
              + '</div></div>';

              htmlContent += '<button id="footerRight" class="close-page-button">&times;</button>';

            // End of footerRight Page
            htmlContent += '</div></div>';

          htmlContent += '</div>';

        // End of footer
        htmlContent += '</div>';

      // End of site-content
      htmlContent += '</div>';

    // End of container
    htmlContent += '</div>';

    $('#site').html(htmlContent);

    $('.menu-bar, .news-box, .page-content-container').perfectScrollbar();

    $('.page-container').each(function () {
      var page = $(this).detach();
      $('#site').append(page);
    });

    // Set Up Listeners
    $('.menu-item, .footer-link').click(function() {
      var targetId = this.id.replace('Link', 'Page');
      $('#' + targetId + 'IFrame').attr('src', $('#' + targetId + 'IFrame').attr('data-src'));
      $('#' + targetId).fadeIn();
    });

    $('.close-page-button').click(function() {
      var targetId = this.id + 'Page';
      $('#' + targetId + 'IFrame').attr('src', '');
      $('#' + targetId).fadeOut();
    });

  });
});

function buildSidebarContent(index, title, text, type) {
  index = index.toString();
  var result = '<li>';

    result += '<span id="menu' + index + 'Link" class="menu-item">' + title + '</span>';
    result += '<div id="menu' + index + 'Page" class="page-container" style="display: none;"><div class="page">';

      result += '<div class="page-content-container"><div id="menu' + index + 'Content" class="page-content' + ((type === 'link') ? ' fill-space' : '') + '">';

      if (type === 'link') {
        result += '<iframe id="menu' + index + 'PageIFrame" src="" data-src="' + encodeHtml(text) + '"></iframe>';
      } else {
        result += encodeHtml(text);
      }

      result += '</div></div>';

      result += '<button id="menu' + index + '" class="close-page-button">&times;</button>';

    result += '</div></div>';

  result += '</li>';

  return result;
}

function buildNewsContent(index, title, text, date) {
  index = index.toString();
  var hasText = (text !== '');

  var result = '<li>';

  if (!hasText) {
    result += title;
  } else {
    result += '<span id="news' + index + 'Link" class="menu-item">' + title + '</span>';

    result += '<div id="news' + index + 'Page" class="page-container" style="display: none;"><div class="page">';

      result += '<div class="page-content-container"><div id="news' + index + 'Content" class="page-content">'
        + encodeHtml(text)
      + '</div></div>';

      result += '<button id="news' + index + '" class="close-page-button">&times;</button>';

    result += '</div></div>';
  }

  result += '</li>';

  return result;
}

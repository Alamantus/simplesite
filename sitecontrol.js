$(document).ready(function() {
  // Get site data and process it.
  $.getJSON('sitedata.json?nocache=' + moment().valueOf().toString(), function(data) {
    var htmlContent = '<div class="container">';


      htmlContent += '<div class="site-content">';

        htmlContent += '<div class="menu-bar">';

          htmlContent += '<div class="menu-bar-contents">';

          htmlContent += '<div class="header"><a href="./">\
            <span class="site-title" style="' + data.titleStyles + '">' + data.siteTitle + '</span>\
          </a></div>';

          if (data.siteTagline && data.siteTagline !== '') {
            htmlContent += '<div class="header">\
              <span class="site-subtitle">' + data.siteTagline + '</span>\
            </div>';
          }

          htmlContent += '<ul>';

          for (var i = 0; i < data.pages.length; i++) {
            htmlContent += buildSidebarContent(i, data.pages[i].title, data.pages[i].text, data.pages[i].type, data.menuEntryStyles);
          }

          htmlContent += '</ul>';

        // End of menu-bar
        htmlContent += '</div></div>';

        htmlContent += '<div class="news-bar"><div class="news-box-container"><div class="news-box">';

          htmlContent += '<span style="' + data.newsHeadlineStyles + '">' + encodeHtml(data.newsHeadline) + '</span>';

          htmlContent += '<ul>';

          for (var i = 0; i < data.news.length; i++) {
            if (moment().valueOf() > data.news[i].published) {
              htmlContent += buildNewsContent(i, data.news[i].title, data.news[i].text, data.news[i].published, data.newsEntryStyles);
            }
          }

          htmlContent += '</ul>';

        // End of news-bar
        htmlContent += '</div></div></div>';

        htmlContent += '<div class="footer">';
        console.log(data.footer);
        for (var i = 0; i < data.footer.length; i++) {
          htmlContent += buildFooterBox(i, data.footer[i].title, data.footer[i].text, data.footerLinkStyles);
        }

        // End of footer
        htmlContent += '</div>';

      // End of site-content
      htmlContent += '</div>';

    // End of container
    htmlContent += '</div>';

    $('#site').html(htmlContent);

    $('.menu-bar-contents, .news-box, .page-content-container, .iframe-scroll-wrapper').perfectScrollbar();

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

function buildSidebarContent(index, title, text, type, style) {
  index = index.toString();
  var result = '<li style="' + style + '">';

  if (type !== 'link') {
    result += '<span id="menu' + index + 'Link" class="menu-item">' + title + '</span>';
    result += '<div id="menu' + index + 'Page" class="page-container" style="display: none;"><div class="page">';

      result += '<div class="page-content-container"><div id="menu' + index + 'Content" class="page-content' + ((type === 'link') ? ' fill-space' : '') + '">';

      if (type === 'iframe') {
        result += '<div class="iframe-scroll-wrapper"><iframe id="menu' + index + 'PageIFrame" src="" data-src="' + encodeHtml(text) + '"></iframe></div>';
      } else {
        result += encodeHtml(text);
      }

      result += '</div></div>';

      result += '<button id="menu' + index + '" class="close-page-button">&times;</button>';

    result += '</div></div>';
  } else {
    result += '<a href="' + encodeHtml(text) + '" target="_blank"><span id="menu' + index + 'Link" class="menu-item">' + title + '</span></a>';
  }

  result += '</li>';

  return result;
}

function buildNewsContent(index, title, text, date, style) {
  index = index.toString();
  var encodedTitle = encodeHtml(title);
  var hasText = (text !== '');

  var result = '<li style="' + style + '">';

  if (!hasText) {
    result += encodedTitle;
  } else {
    result += '<span id="news' + index + 'Link" class="menu-item">' + encodedTitle + '</span>';

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

function buildFooterBox(index, title, text, style) {
  index = index.toString();

  var result = '<div class="footer-box">';

  result += '<span id="footer' + index + 'Link" class="footer-link" style="' + style + '">' + title + '</span>';

  result += '<div id="footer' + index + 'Page" class="page-container" style="display: none;"><div class="page">';

    result += '<div class="page-content-container"><div id="footer' + index + 'Content" class="page-content fill-space">'
      + '<iframe id="footer' + index + 'PageIFrame" src="" data-src="' + encodeHtml(text) + '"></iframe>'
    + '</div></div>';

    result += '<button id="footer' + index + '" class="close-page-button">&times;</button>';

  // End of footer box Page
  result += '</div></div>';

  // End of footer box
  result += '</div>';

  return result;
}

function sizeIFrameOnLoad(id) {
  var iframe = document.getElementById('idIframe');
  if (iframe) {
    // here you can make the height, I delete it first, then I make it again
    iframe.width = "";
    iframe.width = iframe.contentWindow.document.body.scrollWidth + "px";
    iframe.height = "";
    iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
  } 
}

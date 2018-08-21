var nextPageIndex = 0;
var nextNewsIndex = 0;
var nextFooterLinkIndex = 0;

var sortableSettings = {
  handle: '.sort-handle',
  cursorAt: {
    top: 0,
    left: 0
  },
  opacity: 0.5,
  start: function (event) {
    $('.wysiwyg, .wysiwyg-simple').each(function () {
      // tinymce bugs out while dragging, so disable it while dragging
      tinymce.execCommand('mceRemoveEditor', false, this.id);
    });
  },
  stop: function (event) {
    $('.wysiwyg, .wysiwyg-simple').each(function () {
      // tinymce bugs out while dragging, so re-enable it after dragging
      tinymce.execCommand('mceAddEditor', false, this.id);
    });
  }
};

$(document).ready(function() {

  // Hide elements
  $('#notifications').hide();

  // Get site data and process it.
  $.getJSON('sitedata.json?nocache=' + moment().valueOf().toString(), function(data) {
    var htmlContent = '<div class="content-container"><h2 class="content-title">General Site Data <span id="toggleGlobalContent" data-target="globalContent" class="toggle-button">collapse</span></h2>';

      htmlContent += '<div id="globalContent" class="content-area">';

        htmlContent += '<label><span>Website Title</span>\
          <input type="text" id="siteTitle" value="' + data.siteTitle + '" />\
        </label>';

        htmlContent += '<label><span>Website Tagline</span>\
          <input type="text" id="siteTagline" value="' + data.siteTagline + '" />\
        </label>';

        htmlContent += '<label class="full-width"><span>Title Styles</span>\
          <input type="text" id="titleStyles" value="' + data.titleStyles + '" />\
        </label>';

        htmlContent += '<label class="full-width"><span>Menu Entries Styles</span>\
          <small>Overall style of the menu links/pages on the left.</small>\
          <input type="text" id="menuEntryStyles" value="' + data.menuEntryStyles + '" />\
        </label>';

        htmlContent += '<label><span>News Headline</span>\
          <input type="text" id="newsHeadline" value="' + data.newsHeadline + '" />\
        </label>';

        htmlContent += '<label class="full-width"><span>News Headline Styles</span>\
          <small>The CSS Styles for the headline above news entries.</small>\
          <input type="text" id="newsHeadlineStyles" value="' + data.newsHeadlineStyles + '" />\
        </label>';

        htmlContent += '<label class="full-width"><span>News Entries Styles</span>\
          <small>Overall style of the news entries on the right.</small>\
          <input type="text" id="newsEntryStyles" value="' + data.newsEntryStyles + '" />\
        </label>';

        htmlContent += '<label class="full-width"><span>Footer Link Styles</span>\
          <input type="text" id="footerLinkStyles" value="' + data.footerLinkStyles + '" />\
        </label>';

        // FIXME: Add website image upload when I feel like it.
        /*htmlContent += '<label><span>Website Image</span>\
          <small>The image that displays when sharing on social media.</small>\
          <input type="file" accept=".jpg, .png, .gif" id="siteImage" value="' + data.siteImage + '" />\
        </label>';*/

      // End of content-area
      htmlContent += '</div>';

    // End of global content
    htmlContent += '</div>';

    htmlContent += '<div class="content-container"><h2 class="content-title">Menu Entries <span id="togglePages" data-target="pages" class="toggle-button">collapse</span></h2>';

      htmlContent += '<button id="newPageButton">Add Menu Entry</button>';

      htmlContent += '<div id="pages">';

    for (var p = 0; p < data.pages.length; p++) {
      htmlContent += buildPageEntry(p, data.pages[p].title, data.pages[p].text, data.pages[p].type);
      nextPageIndex++;
    }

    // End of pages
    htmlContent += '</div>\
    </div>';

    htmlContent += '<div class="content-container"><h2 class="content-title">News <span id="toggleNews" data-target="news" class="toggle-button">collapse</span></h2>';

      htmlContent += '<button id="newNewsButton">Add News</button>';

      htmlContent += '<div id="news">';

    for (var n = 0; n < data.news.length; n++) {
      htmlContent += buildNewsEntry(n, data.news[n].title, data.news[n].text, moment(data.news[n].published).format('h:mm:ssa D/M/YYYY'));
      nextNewsIndex++;
    }

    // End of News
    htmlContent += '</div>\
    </div>';

    htmlContent += '<div class="content-container"><h2 class="content-title">Footer Links <span id="toggleFooter" data-target="footerLinks" class="toggle-button">collapse</span></h2>';

      htmlContent += '<button id="newFooterLinkButton">Add Footer Link</button>&nbsp;<button onClick="addNewFooterLink(true)">Add Footer Link To End</button>';

      htmlContent += '<div id="footerLinks">';

    for (var f = 0; f < data.footer.length; f++) {
      htmlContent += buildFooterLinkEntry(f, data.footer[f].title, data.footer[f].text);
      nextFooterLinkIndex++;
    }

    // End of footerLink
    htmlContent += '</div>\
    </div>';

    $('#admin').html(htmlContent);

    // Activate Tiny MCE on textareas.
    convertTextAreas('.wysiwyg');
    convertTextAreasSimple('.wysiwyg-simple');

    // Make content sortable
    $('#pages, #footerLinks').sortable(sortableSettings);
    $('#pages, #footerLinks').disableSelection();

    // Set Up Listeners
    $('#closeNotifications').click(function() {
      $('#notifications').hide();
    });

    $('#toggleGlobalContent, #togglePages, #toggleNews, #toggleFooter').click(function() {
      toggleSectionVisibility(this, '#' + $(this).attr('data-target'));
    });

    $('#newPageButton').click(function() {
      addNewPage();
    });

    $('#newNewsButton').click(function() {
      addNewNews();
    });

    $('#newFooterLinkButton').click(function() {
      addNewFooterLink();
    });

    $('#saveChanges').click(function() {
      saveSiteData();
    });

    $('.delete-page-button').click(function() {
      deletePage(this.id);
    });

    $('.delete-news-button').click(function() {
      deleteNews(this.id);
    });

    $('.delete-footer-button').click(function() {
      deleteFooterLink(this.id);
    });

    $('.page-type').change(function () {
      toggleTypeForm(this);
    });

    $('.show-text-checkbox').change(function () {
      toggleNewsText(this);
    });
  });
});

function toggleSectionVisibility(buttonReference, contentId) {
  var button = buttonReference;
  $(contentId).slideToggle(function () {
    if ($(buttonReference).is(':visible')) {
      $(button).text('collapse');
    } else {
      $(button).text('expand');
    }
  });
}

function convertTextAreas(selector) {
  tinymce.init({
    selector: selector,
    plugins: 'link code image',
    height: 200,
    menubar: false,
    toolbar: [
      'undo redo removeformat | formatselect | bold italic underline strikethrough subscript superscript | alignleft aligncenter alignright | bullist numlist | outdent indent blockquote | link image code',
      'fontselect fontsizeselect'
    ],
    image_dimensions: false
  });
}

function convertTextAreasSimple(selector) {
  tinymce.init({
    selector: selector,
    height: 50,
    resize: false,
    statusbar: false,
    forced_root_block: false,
    plugins: 'link',
    menubar: false,
    toolbar: 'bold italic underline strikethrough | link'
  });
}

function buildPageEntry(index, title, text, type) {
  var result = '<div id="page' + index.toString() + '" class="content-area">';

    result += '<span id="page' + index.toString() + 'SortHandle" class="sort-handle left ui-icon ui-icon-arrowthick-2-n-s"></span>'

    result += '<button id="' + index.toString() + '" class="delete-page-button">Delete</button>'
      
    result += '<label>\
        <span>Type</span>\
        <select id="page' + index.toString() + 'Type" class="page-type">\
          <option value="page"' + ((type === 'page') ? ' selected="selected"' : '') + '>Page</option>\
          <option value="iframe"' + ((type === 'iframe') ? ' selected="selected"' : '') + '>iFrame</option>\
          <option value="link"' + ((type === 'link') ? ' selected="selected"' : '') + '>External Link</option>\
        </select>\
      </label>';
      
    result += '<label>\
        <span id="page' + index.toString() + 'TitleLabel">' + ((type !== 'link') ? 'Page' : 'Link') + ' Title</span>\
        <input type="text" id="page' + index.toString() + 'Title" class="page-title" value="' + title + '" />\
      </label>';

    result += '<div id="page' + index.toString() + 'TextContainer" style="display:' + ((type === 'page') ? 'block' : 'none') + ';">\
        <label>\
          <span>Page Text</span>\
        </label>\
        <textarea id="page' + index.toString() + 'Text" class="wysiwyg">' + text + '</textarea>\
      </div>';

    result += '<label id="page' + index.toString() + 'URLContainer" class="full-width" style="display:' + ((type !== 'page') ? 'block' : 'none') + ';">\
        <span>Link URL</span>\
        <input type="text" id="page' + index.toString() + 'URL" class="page-url" value="' + text + '" />\
      </label>';

  // End of content-area
  result += '</div>';

  return result;
}

function addNewPage() {
  var newPageIndex = nextPageIndex++;

  $('#pages').prepend(buildPageEntry(newPageIndex, 'New Page', 'New Page Content'));

  convertTextAreas('#page' + newPageIndex.toString() + 'Text');

  // Add Listeners
  $('#page #' + newPageIndex.toString()).click(function() {
    deletePage(this.id);
  });

  $('#page' + newPageIndex.toString() + 'Type').change(function() {
    toggleTypeForm(this);
  });
}

function deletePage(pageIndex) {
  if (confirm('Do you really want to delete page "' + $('#page' + pageIndex + 'Title').val() + '"?\nIf you click "OK", it will be deleted forever, and there is no way to restore it!')) {
    var idToDelete = 'page' + pageIndex;

    $('#' + idToDelete).remove();
  }
}

function buildNewsEntry(index, title, text, date) {
  var result = '<div id="news' + index.toString() + '" class="content-area">';

    result += '<button id="' + index.toString() + '" class="delete-news-button">Delete</button>'

    result += '<div id="news' + index.toString() + 'TitleContainer">\
        <label>\
          <span>News Title</span>\
        </label>\
        <textarea id="news' + index.toString() + 'Title"  class="news-title wysiwyg-simple">' + title + '</textarea>\
      </div>';

    result += '<label>\
          <span>Show Text Entry for Page</span>\
          <input id="news' + index.toString() + 'Checkbox" class="show-text-checkbox" type="checkbox"' + ((text !== '') ? ' checked="checked"' : '') + ' />\
        </label>';

    result += '<div id="news' + index.toString() + 'TextContainer" style="display:' + ((text !== '') ? 'block' : 'none') + ';">\
        <label>\
          <span>News Text</span>\
        </label>\
        <textarea id="news' + index.toString() + 'Text" class="news-text wysiwyg">' + text + '</textarea>\
      </div>';
      
    result += '<label class="full-width">\
        <span id="news' + index.toString() + 'TitleLabel">Publish Date</span>\
        <small>Please use "h:mm:ssa D/M/YYYY" format, i.e. "8:24:00pm 6/10/2016".<br />Set a date in the future to postpone publishing until that date/time!</small>\
        <input type="text" id="news' + index.toString() + 'Published" value="' + date + '" />\
      </label>';

  // End of content-area
  result += '</div>';

  return result;
}

function addNewNews() {
  var newNewsIndex = nextNewsIndex++;

  $('#news').prepend(buildNewsEntry(newNewsIndex, 'New News', '', moment().format('h:mm:ssa D/M/YYYY')));

  convertTextAreasSimple('#news' + newNewsIndex + 'Title');

  convertTextAreas('#news' + newNewsIndex + 'Text');

  // Add Listeners
  $('#news #' + newNewsIndex).click(function() {
    deleteNews(this.id);
  });

  $('#news' + newNewsIndex + 'Checkbox').change(function() {
    toggleNewsText(this);
  });
}

function deleteNews(newsIndex) {
  if (confirm('Do you really want to delete news "' + $('#news' + newsIndex + 'Title').val() + '"?\nIf you click "OK", it will be deleted forever, and there is no way to restore it!')) {
    var idToDelete = 'news' + newsIndex;

    $('#' + idToDelete).remove();
  }
}

function buildFooterLinkEntry(index, title, text) {
  var result = '<div id="footer' + index.toString() + '" class="content-area">';

    result += '<span id="footer' + index.toString() + 'SortHandle" class="sort-handle left ui-icon ui-icon-arrowthick-2-n-s"></span>'

    result += '<button id="' + index.toString() + '" class="delete-footer-button">Delete</button>'
      
    result += '<label>\
        <span id="footer' + index.toString() + 'TitleLabel">Footer Title</span>\
        <input type="text" id="footer' + index.toString() + 'Title" class="footer-title" value="' + title + '" />\
      </label>';
      
    result += '<label class="full-width">\
        <span id="footer' + index.toString() + 'TextLabel">Footer Link</span>\
        <input type="text" id="footer' + index.toString() + 'Text" class="footer-text" value="' + text + '" />\
      </label>';

  // End of content-area
  result += '</div>';

  return result;
}

function addNewFooterLink(addToBack) {
  var newFooterLinkIndex = nextFooterLinkIndex++;

  if (addToBack) {
    $('#footerLinks').append(buildFooterLinkEntry(newFooterLinkIndex, 'New Footer Link', ''));
  } else {
    $('#footerLinks').prepend(buildFooterLinkEntry(newFooterLinkIndex, 'New Footer Link', ''));
  }

  // convertTextAreas('#footer' + newFooterLinkIndex + 'Text');

  // Add Listeners
  $('#footerLinks #' + newFooterLinkIndex).click(function() {
    deleteFooterLink(this.id);
  });
}

function deleteFooterLink(footerIndex) {
  if (confirm('Do you really want to delete footer link "' + $('#footer' + footerIndex + 'Title').val() + '"?\nIf you click "OK", it will be deleted forever, and there is no way to restore it!')) {
    var idToDelete = 'footer' + footerIndex;

    $('#' + idToDelete).remove();
  }
}

function toggleTypeForm(element) {
  var titleLabelId = element.id.replace('Type', 'TitleLabel'),
      textareaId = element.id.replace('Type', 'TextContainer'),
      urlId = element.id.replace('Type', 'URLContainer');

  if ($(element).val() === 'link') {
    $('#' + titleLabelId).text('Link Title');
    $('#' + urlId).show();
    $('#' + textareaId).hide();
  } else if ($(element).val() === 'iframe') {
    $('#' + titleLabelId).text('IFrame Title');
    $('#' + urlId).show();
    $('#' + textareaId).hide();
  } else {
    $('#' + titleLabelId).text('Page Title');
    $('#' + textareaId).show();
    $('#' + urlId).hide();
  }
}

function toggleNewsText(element) {
  var targetId = element.id.replace('Checkbox', 'TextContainer');

  if ($(element).prop('checked')) {
    $('#' + targetId).show();
  } else {
    $('#' + targetId).hide();
  }
}

function saveSiteData() {
  if (confirm('The data entered here will REPLACE the data currently on the site.\nIf you are sure everything is correct, click "OK" to save your changes.')) {
    var newSiteData = {
      siteTitle: $('#siteTitle').val(),
      siteTagline: $('#siteTagline').val(),
      titleStyles: $('#titleStyles').val(),
      newsHeadline: $('#newsHeadline').val(),
      newsHeadlineStyles: $('#newsHeadlineStyles').val(),
      menuEntryStyles: $('#menuEntryStyles').val(),
      newsEntryStyles: $('#newsEntryStyles').val(),
      footerLinkStyles: $('#newsEntryStyles').val(),
      pages: [],
      news: [],
      footer: []
    }

    var pageEntries = $('#pages').children('.content-area');

    for (var i = 0; i < pageEntries.length; i++) {
      var pageId = pageEntries[i].id;
      var type = $('#' + pageId + 'Type').val();
      var text;

      if (type === 'page') {
        text = escapeHtml($('#' + pageId + 'Text').tinymce().getContent());
      } else {
        text = escapeHtml($('#' + pageId + 'URL').val())
      }

      newSiteData.pages.push({
        type: type,
        title: $('#' + pageId + 'Title').val(),
        text: text
      });
    }

    var newsEntries = $('#news').children('.content-area');

    for (var i = 0; i < newsEntries.length; i++) {
      var newsId = newsEntries[i].id;
      var title = escapeHtml($('#' + newsId + 'Title').tinymce().getContent());
      var text = escapeHtml($('#' + newsId + 'Text').tinymce().getContent());
      var published = $('#' + newsId + 'Published').val();

      newSiteData.news.push({
        title: title,
        text: text,
        published: moment(published, 'h:mm:ssa D/M/YYYY').valueOf()
      });
    }

    var footerEntries = $('#footerLinks').children('.content-area');

    for (var i = 0; i < footerEntries.length; i++) {
      var footerId = footerEntries[i].id;
      var text = escapeHtml($('#' + footerId + 'Text').val());

      newSiteData.footer.push({
        title: escapeHtml($('#' + footerId + 'Title').val()),
        text: text,
      });
    }

    // Sort the news by date, descending.
    newSiteData.news.sort(dynamicSort(['-published']));

    // Debug for no PHP server
    // console.log(JSON.stringify(newSiteData));
    // showNotification('Check the console!');

    // Uncomment below once on PHP server.
    $.post('savesitedata.php', {pw: window.adminpw, sitedata: JSON.stringify(newSiteData)}, function (data) {
      var linkToPage = ((data.indexOf('success') > -1) ? '<br /><a href="./" target="_blank">Go to Site</a>' : '');

      showNotification(data + linkToPage);
    });
  }
}

function showNotification(notificationText) {
  $('#notificationText').html(notificationText);
  $('#notifications').fadeIn()
    .delay(5000)
    .fadeOut();
}

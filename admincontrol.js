window.adminpw = 'test';
var nextPageIndex = 0;
var nextNewsIndex = 0;

$(document).ready(function() {

  // Hide elements
  $('#notifications').hide();

  // Get site data and process it.
  $.getJSON('sitedata.json', function(data) {
    var htmlContent = '<div><h2 class="content-title">General Site Data <span id="toggleGlobalContent" class="toggle-button">collapse</span></h2>';

      htmlContent += '<div id="globalContent" class="content-area">';

        htmlContent += '<label><span>Website Title</span>\
          <input type="text" id="siteTitle" value="' + data.siteTitle + '" />\
        </label>';

        htmlContent += '<label><span>Website Tagline</span>\
          <input type="text" id="siteTagline" value="' + data.siteTagline + '" />\
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

    htmlContent += '<div><h2 class="content-title">Pages/Links <span id="togglePages" class="toggle-button">collapse</span></h2><div id="pages">';

    for (var p = 0; p < data.pages.length; p++) {
      htmlContent += buildPageEntry(p, data.pages[p].title, data.pages[p].text, data.pages[p].type);
      nextPageIndex++;
    }

    // End of pages
    htmlContent += '</div>\
      <button id="newPageButton">Add Page/Link</button>\
    </div>';

    htmlContent += '<div><h2 class="content-title">News <span id="toggleNews" class="toggle-button">collapse</span></h2><div id="news">';

    for (var n = 0; n < data.news.length; n++) {
      htmlContent += buildNewsEntry(n, data.news[n].title, data.news[n].text, moment(data.news[n].published).format('h:mm:ssa D/M/YYYY'));
      nextNewsIndex++;
    }

    // End of News
    htmlContent += '</div>\
      <button id="newNewsButton">Add News</button>\
    </div>';

    $('#admin').html(htmlContent);

    // Activate Tiny MCE on textareas.
    convertTextAreas('textarea');

    // Make content sortable
    $('#pages').sortable({
      handle: '.sort-handle',
      cursorAt: {
        top: 0,
        left: 0
      },
      tolerance: 'pointer',
      opacity: 0.5,
      start: function () {
        $('.wysiwyg').each(function () {
          // tinymce bugs out while dragging, so disable it while dragging
          tinymce.execCommand('mceRemoveEditor', false, this.id);
        });
      },
      stop: function () {
        $('.wysiwyg').each(function () {
          // tinymce bugs out while dragging, so re-enable it after dragging
          tinymce.execCommand('mceAddEditor', false, this.id);
        });
      }
    });
    $( '#pages' ).disableSelection();

    // Set Up Listeners
    $('#closeNotifications').click(function() {
      $('#notifications').hide();
    });

    $('#toggleGlobalContent').click(function() {
      toggleSectionVisibility(this, '#globalContent');
    });

    $('#togglePages').click(function() {
      toggleSectionVisibility(this, '#pages');
    });

    $('#toggleNews').click(function() {
      toggleSectionVisibility(this, '#news');
    });

    $('#newPageButton').click(function() {
      addNewPage();
    });

    $('#newNewsButton').click(function() {
      addNewNews();
    });

    $('#saveChanges').click(function() {
      saveSiteData();
    });

    $('button.delete-button').click(function() {
      deletePage(this.id);
    });

    $('.page-type').change(function () {
      toggleTypeForm(this);
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
    plugins: 'link code',
    menubar: false,
    toolbar: [
      'undo redo removeformat | formatselect | bold italic underline strikethrough subscript superscript | alignleft aligncenter alignright | bullist numlist | outdent indent blockquote | link code',
      'fontselect fontsizeselect'
    ]
  });
}

function buildPageEntry(index, title, text, type) {
  var result = '<div id="page' + index.toString() + '" class="content-area">';

    result += '<span class="sort-handle left ui-icon ui-icon-arrowthick-2-n-s"></span>'

    result += '<button id="' + index.toString() + '" class="delete-button">Delete</button>'
      
    result += '<label>\
        <span>Type</span>\
        <select id="page' + index.toString() + 'Type" class="page-type">\
          <option value="page"' + ((type !== 'link') ? ' selected="selected"' : '') + '>Page</option>\
          <option value="link"' + ((type === 'link') ? ' selected="selected"' : '') + '>External Link</option>\
        </select>\
      </label>';
      
    result += '<label>\
        <span id="page' + index.toString() + 'TitleLabel">' + ((type !== 'link') ? 'Page' : 'Link') + ' Title</span>\
        <input type="text" id="page' + index.toString() + 'Title" class="page-title" value="' + title + '" />\
      </label>';

    result += '<div id="page' + index.toString() + 'TextContainer" style="display:' + ((type !== 'link') ? 'block' : 'none') + ';">\
        <label>\
          <span>Page Text</span>\
        </label>\
        <textarea id="page' + index.toString() + 'Text" class="wysiwyg">' + text + '</textarea>\
      </div>';

    result += '<label id="page' + index.toString() + 'URLContainer" style="display:' + ((type === 'link') ? 'block' : 'none') + ';">\
        <span>Link URL</span>\
        <input type="text" id="page' + index.toString() + 'URL" class="page-url" value="' + text + '" />\
      </label>';

  // End of content-area
  result += '</div>';

  return result;
}

function addNewPage() {
  var newPageIndex = nextPageIndex++;

  $('#pages').append(buildPageEntry(newPageIndex, 'New Page', 'New Page Content'));

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

    result += '<button id="' + index.toString() + '" class="delete-button">Delete</button>'
      
    result += '<label>\
        <span id="news' + index.toString() + 'TitleLabel">News Title</span>\
        <input type="text" id="news' + index.toString() + 'Title" class="news-title" value="' + title + '" />\
      </label>';

    result += '<div id="news' + index.toString() + 'TextContainer">\
        <label>\
          <span>News Text</span>\
        </label>\
        <textarea id="news' + index.toString() + 'Text" class="news-text">' + text + '</textarea>\
      </div>';
      
    result += '<label>\
        <span id="news' + index.toString() + 'TitleLabel">Publish Date</span>\
        <small>Please use "h:mm:ssa D/M/YYYY" format, i.e. "8:24:00pm 6/10/2016". Set a date in the future to postpone publishing until that date/time!</small>\
        <input type="text" id="news' + index.toString() + 'Published" value="' + date + '" />\
      </label>';

  // End of content-area
  result += '</div>';

  return result;
}

function addNewNews() {
  var newNewsIndex = nextNewsIndex++;

  $('#news').append(buildNewsEntry(newNewsIndex, 'New News', 'New News Content', moment().format('h:mm:ssa D/M/YYYY')));

  convertTextAreas('#news' + newNewsIndex + 'Text');

  // Add Listeners
  $('#news #' + newNewsIndex).click(function() {
    deleteNews(this.id);
  });
}

function deleteNews(newsIndex) {
  if (confirm('Do you really want to delete news "' + $('#news' + newsIndex + 'Title').val() + '"?\nIf you click "OK", it will be deleted forever, and there is no way to restore it!')) {
    var idToDelete = 'news' + newsIndex;

    $('#' + idToDelete).remove();
  }
}

function toggleTypeForm(element) {
  var titleLabelId = element.id.replace('Type', 'TitleLabel'),
      textareaId = element.id.replace('Type', 'TextContainer'),
      urlId = element.id.replace('Type', 'URLContainer');

  if ($(element).val() !== 'link') {
    $('#' + titleLabelId).text('Page Title');
    $('#' + textareaId).show();
    $('#' + urlId).hide();
  } else {
    $('#' + titleLabelId).text('Link Title');
    $('#' + urlId).show();
    $('#' + textareaId).hide();
  }
}

function saveSiteData() {
  if (confirm('The data entered here will REPLACE the data currently on the site.\nIf you are sure everything is correct, click "OK" to save your changes.')) {
    var newSiteData = {
      siteTitle: $('#siteTitle').val(),
      siteTagline: $('#siteTagline').val(),
      pages: [],
      news: []
    }

    var pageEntries = $('#pages').children('.content-area');

    for (var i = 0; i < pageEntries.length; i++) {
      var pageId = pageEntries[i].id;
      var type = $('#' + pageId + 'Type').val();
      var text;

      if (type !== 'link') {
        text = escapeHtml($('#' + pageId + 'Text').tinymce().getContent());
      } else {
        text = $('#' + pageId + 'URL').val()
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
      var text = escapeHtml($('#' + newsId + 'Text').tinymce().getContent());
      var published = $('#' + newsId + 'Published').val();

      newSiteData.news.push({
        title: $('#' + newsId + 'Title').val(),
        text: text,
        published: moment(published, 'h:mm:ssa D/M/YYYY').valueOf()
      });
    }

    // Sort the news by date, descending.
    newSiteData.news.sort(dynamicSort(['-published']));

    // Debug for no PHP server
    // console.log(JSON.stringify(newSiteData));
    // showNotification('Check the console!');

    // Uncomment below once on PHP server.
    $.post('savesitedata.php', {pw: window.adminpw, sitedata: JSON.stringify(newSiteData)}, function (data) {
      showNotification(data);
    });
  }
}

function showNotification(notificationText) {
  $('#notificationText').html(notificationText);
  $('#notifications').fadeIn()
    .delay(5000)
    .fadeOut();
}

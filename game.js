(function($) {
  var mainHolder;
  var btnRandom, btnClear, btnDownload;
  var svgObject, svgColor;
  var chosenColor = '#FFFFFF';
  //Cornell branding colors.  Replace with your color pallet.
  var colors = [
    '#FFFFFF',
    '#B31B1B',
    '#981E29',
    '#EA002A',
    '#D7D2CB',
    '#EFEDEA',
    '#000000',
    '#4EC3E0',
    '#7F54E5',
    '#F3E600',
    '#006699',
    '#6EB43F',
    '#4B7B2B',
    '#F8981D',
    '#073949',
    '#996515',
    '#7B3F00',
    '#FFC0CB',
    '#C08081',
  ];

  function swatchClick() {
    $('.swatchHolder li').removeClass('picked');
    chosenColor = $(this).data('color');
    $(this).addClass('picked');
  }

  function colorMe() {
    $(this).css('fill', chosenColor);
  }
  function svgRandom() {
    $(svgColor).each(function() {
      var randomNum = Math.floor(Math.random() * colors.length + 1);
      $(this).css('fill', colors[randomNum]);
    });
  }
  function svgClear() {
    $(svgColor).each(function() {
      $(this).css({ fill: 'white' });
    });
  }
  function svgDownloadPNG() {
    // Select the element
    var svgElement = document.getElementById('drawing').querySelector('svg');
    // Serialize the svg to xml string
    var svgString = new XMLSerializer().serializeToString(svgElement);
    // Use blob to convert the svg string
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    // convert the blob object to a dedicated URL
    const svgData = URL.createObjectURL(svgBlob);
    //Loading the xml data string into a img element
    var img = new Image();
    //Converting the img element to a dataURL using a canvas element
    img.addEventListener('load', () => {
      // draw the image on an ad-hoc canvas
      const bbox = svgElement.getBBox();

      const canvas = document.createElement('canvas');
      canvas.width = bbox.width;
      canvas.height = bbox.height;

      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0, bbox.width, bbox.height);

      URL.revokeObjectURL(svgData);

      // trigger a synthetic download operation with a temporary link
      const a = document.createElement('a');
      a.download = 'CornellColoring.png';
      document.body.appendChild(a);
      a.href = canvas.toDataURL();
      a.click();
      a.remove();
    });
    img.src = svgData;
  }

  $.fn.makeSwatches = function() {
    var swatchHolder = $('.swatchHolder');
    $(swatchHolder).html('');
    $.each(colors, function() {
      var swatch = $('<li/ tabindex="0">').appendTo(swatchHolder);
      $(swatch).css('background-color', this);
      $(swatch).data('color', this);
      $(swatch).on('click', swatchClick);
    });
  };
  $.fn.makeSVGcolor = function(svgURL) {
    mainHolder = this;
    $(this).load(svgURL, function() {
      svgObject = $('svg', this);
      // Select elements with class 'st0' or 'cls-1'
      // By default, Adobe generate SVG with class name 'st0' or 'cls-1'.
      // It is critical that you are using the correct class name that matches the SVG images.
      // Change the class name as needed, as long as it matches the SVG images.
      // And make sure all the SVG images use the same class name.
      svgColor = $('.cls-1');
      $(svgColor).each(function() {
        $(this).css({ fill: 'white' });
      });
      $(svgColor).on('click', colorMe);
      $(mainHolder).makeSwatches();
    });
  };

  $.fn.btnRandom = function() {
    btnRandom = this;
    $(btnRandom).on('click', svgRandom);
  };
  $.fn.btnClear = function() {
    btnClear = this;
    $(btnClear).on('click', svgClear);
  };
  $.fn.btnDownload = function() {
    btnDownload = this;
    $(btnDownload).on('click', svgDownloadPNG);
  };
})(jQuery);

var selectSVG = './1.svg';
$('#drawing').makeSVGcolor(selectSVG);
//Bind the confirm buttons on the alert modals to the functions.
$('#btnRandomModal').btnRandom();
$('#btnClearModal').btnClear();
$('#btnDownload').btnDownload();
$('.gallery-option').click(function(event) {
  var id = $(this).data('id');
  selectSVG = './' + id + '.svg';
  $('#drawing').makeSVGcolor(selectSVG);
  $('#galleryModal').modal('hide');
});
// Force modal show on page load.
window.onload = () => {
  const myModal = new bootstrap.Modal('#galleryModal');
  myModal.show();
};
var autoAlertHide = 'N';
var restartAlertHide = 'N';
$('#btnClear').click(function() {
  if (restartAlertHide == 'Y') {
    //Execute the click event
    $('#btnClearModal').click();
  } else {
    $('#restartAlertModal').modal('show');
  }
});
$('#restartAlertChecked').change(function() {
  if ($('#restartAlertChecked').is(':checked')) {
    restartAlertHide = 'Y';
  }
});
$('#btnRandom').click(function() {
  if (autoAlertHide == 'Y') {
    //Execute the click event
    $('#btnRandomModal').click();
  } else {
    $('#autoAlertModal').modal('show');
  }
});
$('#autoAlertChecked').change(function() {
  if ($('#autoAlertChecked').is(':checked')) {
    autoAlertHide = 'Y';
  }
});
$(document).ready(function() {
  $('#shareBtn').click(function() {
    // Select the element
    var svgElement = document.getElementById('drawing').querySelector('svg');
    // Serialize the svg to xml string
    var svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    // convert the blob object to a dedicated URL
    const svgData = URL.createObjectURL(svgBlob);
    var img = new Image();
    img.src = svgData;
    img.width = 280;
    img.alt = 'My Coloring page';
    $('#myImage').html(img);
  });
});

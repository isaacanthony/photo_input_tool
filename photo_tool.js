/**
 * Photo Input Tool Module
 */
var PhotoInputTool = (function() {

  /**
   * At least one dimension of photo must be >= this px size.
   */
  var MIN_SIZE = 500;

  /**
   * Step 1: gets file from file input context.fileId.
   */
  var getFile = function(context) {
    context.file = document.getElementById(context.fileId).files[0];
    if (!context.file) {
      context.error = 'Image not found.';
      context.failure();
    } else {
      readFile(context);
    }
  };

  /**
   * Step 2: reads file attributes from context.file.
   */
  var readFile = function(context) {
    var reader = new FileReader();

    reader.onloadend = function() {
      context.photo = {
        name:   context.file.name,
        type:   context.file.type,
        size:   context.file.size,
        base64: reader.result
      };
      if (context.photo.type === 'image/jpeg' || context.photo.type === 'image/png') {
        getDimensions(context);
      } else {
        context.error = 'Invalid input type.';
        context.failure();
      }
    };

    reader.readAsDataURL(context.file);
  };

  /**
   * Step 3: gets dimensions of context.photo.
   */
  var getDimensions = function(context) {
    var img = new Image;

    img.onload = function() {
      context.image        = img;
      context.photo.height = img.height;
      context.photo.width  = img.width;
      resizePhoto(context);
    };

    img.src = context.photo.base64;
  };

  /**
   * Step 4: pads context.photo to match MIN_SIZE.
   */
  var resizePhoto = function(context) {
    if (context.photo.height < MIN_SIZE && context.photo.width < MIN_SIZE) {
      var canvas = document.createElement('canvas');
      canvas.height = MIN_SIZE;
      canvas.width = MIN_SIZE;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, MIN_SIZE, MIN_SIZE);

      var imageX = Math.round((MIN_SIZE / 2) - (context.photo.width / 2));
      var imageY = Math.round((MIN_SIZE / 2) - (context.photo.height / 2));

      ctx.drawImage(context.image, imageX, imageY, context.photo.width, context.photo.height);
      var dataURL = canvas.toDataURL(context.photo.type);

      if (!dataURL) {
        context.error = 'Unable to resize photo.';
        context.failure();
        return;
      }

      context.photo.originalBase64 = context.photo.base64;
      context.photo.base64 = dataURL;
    }
    context.success();
  };

  return {

    /**
      * Processes file input.
      * @params context
      * {
      *   fileId  (string):   HTML input[type = file] id
      *   success (function): Callback executed on success
      *   failure (function): Callback executed on failure
      * }
      */
    process: function(context) {
      getFile(context);
    }

  };

})();

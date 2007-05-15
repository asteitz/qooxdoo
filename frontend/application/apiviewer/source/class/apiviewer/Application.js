/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Til Schneider (til132)
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************

#module(apiviewer)
#resource(css:css)
#resource(image:image)
#embed(apiviewer.css/*)

************************************************************************ */

/**
 * The main application class.
 */
qx.Class.define("apiviewer.Application",
{
  extend : qx.application.Gui,

  members :
  {
    main : function()
    {
      this.base(arguments);

      // Define alias for custom resource path
      qx.manager.object.AliasManager.getInstance().add("api", qx.core.Setting.get("apiviewer.resourceUri"));

      // Include CSS file
      qx.html.StyleSheet.includeFile(qx.manager.object.AliasManager.getInstance().resolvePath("api/css/apiviewer.css"));

      // preload images
      var preloader = new qx.io.image.PreloaderSystem(apiviewer.TreeUtil.PRELOAD_IMAGES);
      preloader.start();

      // Initialize the viewer
      this.viewer = new apiviewer.Viewer;
      this.controller = new apiviewer.Controller(this.viewer);
      this.viewer.addToDocument();

      // Load data file
      qx.client.Timer.once(this._load, this, 0);
    },

    _load : function()
    {
      // Finally load the data
      this.controller.load("script/apidata.js");
    }
  },

  settings : {
    "apiviewer.resourceUri" : "./resource"
  },



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this._disposeObjects("viewer", "controller");
  }
});

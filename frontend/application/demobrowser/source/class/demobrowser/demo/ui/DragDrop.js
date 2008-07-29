/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************


************************************************************************ */

qx.Class.define("demobrowser.demo.ui.DragDrop",
{
  extend : qx.application.Standalone,

  members :
  {
    main: function()
    {
      this.base(arguments);

      var root = this.getRoot();

      var target = new qx.ui.form.List;
      target.setDropable(true);
      target.setSelectionMode("multi");
      target.setDragSelection(false);
      root.add(target, { left : 20, top: 20 });

      var source = new qx.ui.form.List;
      source.setDragable(true);
      source.setSelectionMode("multi");
      source.setDragSelection(false);
      for (var i=0; i<20; i++) {
        source.add(new qx.ui.form.ListItem("Item " + i));
      }
      root.add(source, { left : 200, top : 20 });


      var data = null;

      source.addListener("dragstart", function(e)
      {
        this.debug("UI Start");

        e.addData("value", this.getValue());
        e.addData("items", this.getSelection());
      });

      source.addListener("dragend", function(e)
      {
        this.debug("UI End");
      });

      target.addListener("dragover", function(e)
      {
        this.debug("UI Over");

        if (!e.supportsType("items"))
        {
          this.debug("UI Over STOP!");
          //e.preventDefault();
        }
      });

      target.addListener("dragout", function(e)
      {
        this.debug("UI Out");
      });

      target.addListener("dragdrop", function(e)
      {
        this.debug("UI DragDrop");

        var items = e.getData("items");
        for (var i=0, l=items.length; i<l; i++) {
          this.add(items[i]);
        }
      });
    }
  }
});

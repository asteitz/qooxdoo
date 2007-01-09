/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 by 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL 2.1: http://www.gnu.org/licenses/lgpl.html

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/* ************************************************************************

#module(ui_menu)

************************************************************************ */

qx.OO.defineClass("qx.ui.menubar.Button", qx.ui.toolbar.MenuButton,
function(vText, vMenu, vIcon, vIconWidth, vIconHeight, vFlash) {
  qx.ui.toolbar.MenuButton.call(this, vText, vMenu, vIcon, vIconWidth, vIconHeight, vFlash);
});

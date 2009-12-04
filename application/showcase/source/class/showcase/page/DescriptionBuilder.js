/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)
     * Fabian Jakobs (fjakobs)

************************************************************************ */
qx.Class.define("showcase.page.DescriptionBuilder", 
{
  statics :
  {
    _demoPrefix : "http://demo.qooxdoo.org/" + 
      qx.core.Setting.get("qx.version") + "/demobrowser/",
    _apiPrefix : "http://demo.qooxdoo.org/" + 
      qx.core.Setting.get("qx.version") +"/apiviewer/",
      
      
    build : function(header, text, features, demos, api) 
    {
      var description = [];
      description.push(
        "<div id='description'>",
        "<h1>", header, "</h1>",
        "<p>", text, "</p>",
        "<h2>Features</h2>",
        this.__makeList(features),
        "<h2>Demos</h2>",
        this.__makeLinkList(this._demoPrefix, demos),
        "<h2>Api</h2>",
        this.__makeLinkList(this._apiPrefix, api),
        "</div>"
      );
      return description.join("");
    },
    
    
    __makeLinkList : function(prefix, links) 
    {
      var linkList = ["<ul>"];
      for (var key in links) {
        linkList.push(
          "<li><a href='", prefix, key, "' target='_blank'>",
          links[key],
          "</a></li>"
        );
      };
      linkList.push("</ul>");
      return linkList.join("");
    },
    
    
    __makeList : function(items) 
    {
      var list = ["<ul>"];
      for (var key in items) {
        list.push(
          "<li><strong>", key, "</strong>: ", items[key], "</li>"
        );
      };
      list.push("</ul>");
      return list.join("");
    }    
  }
});

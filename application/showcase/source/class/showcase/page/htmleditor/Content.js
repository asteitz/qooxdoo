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
     * Martin Wittemann (martinwittemann)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************

#asset(qx/icon/Oxygen/16/actions/format-*.png)
#asset(qx/icon/Oxygen/16/actions/edit-*.png)
#asset(qx/icon/Oxygen/16/actions/insert-image.png)
#asset(qx/icon/Oxygen/16/actions/insert-table.png)
#asset(qx/icon/Oxygen/16/actions/insert-link.png)
#asset(qx/icon/Oxygen/16/actions/insert-text.png)
#asset(qx/icon/Oxygen/16/actions/insert-horizontal-rule.png)
#asset(showcase/htmleditor/*)

************************************************************************ */
qx.Class.define("showcase.page.htmleditor.Content",
{
  extend : showcase.page.AbstractDesktopContent,
  
  
  construct : function(page) {
    this.base(arguments, page);
  },
  
  
  members : {  
    __htmlArea : null,
    __editorComponent : null,
    
      
    _addWindowContent : function(win) {
      win.set({
        layout: new qx.ui.layout.Canvas(),
        width: 540,
        height: 400,
        caption: "Editor"
      });
      
      var demoContent = '<h1>About</h1><p>qooxdoo (pronounced [ku:ksdu:]) is a comprehensive and innovative Ajax application framework. Leveraging object-oriented JavaScript allows developers to build impressive cross-browser applications. No <acronym title="HyperText Markup Language">HTML</acronym>, <acronym title="Cascading Style Sheets">CSS</acronym> nor <acronym title="Document Object Model">DOM</acronym> knowledge is needed. qooxdoo includes a platform-independent development tool chain, a state-of-the-art <acronym title="Graphical User Interface">GUI</acronym> toolkit and an advanced client-server communication layer. It is Open Source under an <acronym title="GNU Lesser General Public License">LGPL</acronym>/<acronym title="Eclipse Public License">EPL</acronym> dual <a href="http://qooxdoo.org/license" class="wikilink1" title="license" target="_blank">license</a>.</p>';

      this.__htmlArea = new qx.ui.embed.HtmlArea(demoContent, null, "blank.html");
      this.__htmlArea.set({
        width: 540, 
        height: 370,
        margin: 5
      });
      
      var vb = new qx.ui.layout.VBox(0);
      var vbContainer = new qx.ui.container.Composite(vb).set({
        width: 540, 
        height: 370,
        backgroundColor: "white"
      });

      var toolbar = this.__setupToolbar();
      
      // Add toolbar and HtmlArea widget
      vbContainer.add(toolbar);
      vbContainer.add(this.__htmlArea, {flex: 1});      

      win.add(vbContainer, {edge: 0});     
    },
    
    
    /**
     * Handler method for font color 
     * 
     * @param e {qx.event.type.Event} event instance
     */
    __fontColorHandler : function(e)
    {
      var result = window.prompt("Color (Hex): ", "#");
      this.setTextColor(result);
    },
    
    
    /**
     * Handler method for text background color 
     * 
     * @param e {qx.event.type.Event} event instance
     */  
    __textBackgroundColorHandler : function(e)
    {
      var result = window.prompt("BgColor (Hex): ", "#");
      this.setTextBackgroundColor(result);
    },
    
    
    /**
     * Handler method for inserting images 
     * 
     * @param e {qx.event.type.Event} event instance
     */  
    __insertImageHandler : function(e)
    {
      var attributes = { src    : qx.util.ResourceManager.getInstance().toUri("htmlarea/image/qooxdoo_logo.png"),
                         border : 0,
                         title  : "qooxdoo logo",
                         alt    : "qooxdoo logo" };
      
      this.insertImage(attributes);
    },
      
    /**
     * Handler method for inserting tables 
     * 
     * @param e {qx.event.type.Event} event instance
     */
    __insertTableHandler : function(e)
    {
      var table = "<table border='1'>" + 
                    "<tbody>" +
                      "<tr>" +
                        "<td>First Row, First cell</td>" +
                        "<td>First Row, Second cell</td>" +
                      "</tr>" +
                      "<tr>" +
                        "<td>Second Row, First cell</td>" +
                        "<td>Second Row, Second cell</td>" +
                      "</tr>" +
                    "</tbody>" +
                  "</table>";
      this.insertHtml(table);
    },
    
    
    /**
     * Handler method for inserting links 
     * 
     * @param e {qx.event.type.Event} event instance
     */
    __insertLinkHandler : function(e)
    {
      var createLinkWindow = new qx.ui.window.Window("Insert Hyperlink");
      createLinkWindow.setLayout(new qx.ui.layout.VBox(20));
      createLinkWindow.set({ width: 400, showMaximize: false, showMinimize: false });
      
      var textField = new qx.ui.form.TextField("http://");
      createLinkWindow.add(textField);
      
      var hBoxLayout = new qx.ui.layout.HBox(10);
      hBoxLayout.setAlignX("right");
      var buttonContainer = new qx.ui.container.Composite(hBoxLayout);
      
      var okButton = new qx.ui.form.Button("OK");
      okButton.setWidth(60);
      okButton.addListener("execute", function(e) {
        this.insertHyperLink(textField.getValue());
        createLinkWindow.close();
      }, this);
      buttonContainer.add(okButton);
      
      var cancelButton = new qx.ui.form.Button("Cancel");
      cancelButton.setWidth(60);
      cancelButton.addListener("execute", function(e) { 
        createLinkWindow.close();
      }, this);
      buttonContainer.add(cancelButton);
      
      createLinkWindow.add(buttonContainer);
      
      createLinkWindow.center();
      createLinkWindow.open();
      
      this.__editorComponent.saveRange();
    },
    
    
    /**
     * Handler method for inserting HTML code 
     * 
     * @param e {qx.event.type.Event} event instance
     */
    __insertHTMLHandler : function(e)
    {
      var result = window.prompt("HTML Code:", "");
      this.insertHtml(result);
    },
    
      
    /* ***************************************
     * 
     *            Toolbar info
     *  
     * ***************************************
     */
    
    /**
     * Creates the "font-family" toolbar dropdown
     * 
     * @return {qx.ui.form.SelectBox} select box button
     */  
    __fontFamilyToolbarEntry : function()
    {
      var button = new qx.ui.form.SelectBox;
      button.set({ toolTipText: "Change Font Family",
                   focusable: false,
                   keepFocus: true,
                   width: 120,
                   height: 16,
                   margin: [ 4, 0 ] });
      button.add(new qx.ui.form.ListItem(""));
      
      var entries = ["Tahoma", "Verdana", "Times New Roman", "Arial", 
                     "Arial Black", "Courier New", "Courier", "Georgia",
                     "Impact", "Comic Sans MS", "Lucida Console" ];

      var entry;
      for (var i=0, j=entries.length;i<j;i++)
      {
        entry = new qx.ui.form.ListItem(entries[i]);
        entry.set({ focusable : false, 
                    keepFocus : true,
                    font: qx.bom.Font.fromString("12px " + entries[i]) });
        button.add(entry);
      }
      
      button.addListener("changeSelection", function(e)
      {
        var value = e.getData()[0].getLabel();
        if (value != "") {
          this.setFontFamily(value);
          button.setSelection([ button.getChildren()[0] ]);
        }
      }, this.__htmlArea);
      
      return button;
    }, 
    
    
    /**
     * Creates the "font-size" toolbar dropdown
     * 
     * @return {qx.ui.form.SelectBox} select box button
     */  
    __fontSizeToolbarEntry : function()
    {
      var button = new qx.ui.form.SelectBox;
      button.set({ toolTipText: "Change Font Size",
                   focusable: false,
                   keepFocus: true,
                   width: 50,
                   height: 16,
                   margin: [ 4, 0 ] });
      button.add(new qx.ui.form.ListItem(""));
      
      var entry;
      for (var i=1;i<=7;i++)
      {
        entry = new qx.ui.form.ListItem(i+"");
        entry.set({ focusable : false, 
                    keepFocus : true });
        button.add(entry);
      }
      
      button.addListener("changeSelection", function(e)
      {
        var value = e.getData()[0].getLabel();
        if (value != "") {
          this.setFontSize(value);
          button.setSelection([ button.getChildren()[0] ]);
        }
      }, this.__htmlArea);
      
      return button;
    },
    
    
    /**
     * Toolbar entries
     *
     * @return {Array} toolbar entries
     */  
    __getToolbarEntries : function()
    {
      return [
        {
          bold:                { text: "Format Bold", image: "qx/icon/Oxygen/16/actions/format-text-bold.png", action: this.__htmlArea.setBold },
          italic:              { text: "Format Italic", image: "qx/icon/Oxygen/16/actions/format-text-italic.png", action: this.__htmlArea.setItalic },
          underline:           { text: "Format Underline", image: "qx/icon/Oxygen/16/actions/format-text-underline.png", action: this.__htmlArea.setUnderline },
          strikethrough:       { text: "Format Strikethrough", image: "qx/icon/Oxygen/16/actions/format-text-strikethrough.png", action: this.__htmlArea.setStrikeThrough },
          removeFormat:        { text: "Remove Format", image: "qx/icon/Oxygen/16/actions/edit-clear.png", action: this.__htmlArea.removeFormat }
        },
        
        {
          alignLeft:           { text: "Align Left", image: "qx/icon/Oxygen/16/actions/format-justify-left.png", action: this.__htmlArea.setJustifyLeft },
          alignCenter:         { text: "Align Center", image: "qx/icon/Oxygen/16/actions/format-justify-center.png", action: this.__htmlArea.setJustifyCenter },
          alignRight:          { text: "Align Right", image: "qx/icon/Oxygen/16/actions/format-justify-right.png", action: this.__htmlArea.setJustifyRight },
          alignJustify:        { text: "Align Justify", image: "qx/icon/Oxygen/16/actions/format-justify-fill.png", action: this.__htmlArea.setJustifyFull }
        },
          
        {
          indent:              { text: "Indent More", image: "qx/icon/Oxygen/16/actions/format-indent-more.png", action: this.__htmlArea.insertIndent },
          outdent:             { text: "Indent Less", image: "qx/icon/Oxygen/16/actions/format-indent-less.png", action: this.__htmlArea.insertOutdent }
        },
        
        {
          ol:                  { text: "Insert Ordered List", image: "showcase/htmleditor/format-list-ordered.png", action: this.__htmlArea.insertOrderedList },
          ul:                  { text: "Inserted Unordered List", image: "showcase/htmleditor/format-list-unordered.png", action: this.__htmlArea.insertUnorderedList }
        },
        
        {
          undo:                { text: "Undo Last Change", image: "qx/icon/Oxygen/16/actions/edit-undo.png", action: this.__htmlArea.undo },
          redo:                { text: "Redo Last Undo Step", image: "qx/icon/Oxygen/16/actions/edit-redo.png", action: this.__htmlArea.redo }
        }
      ];
    },
      
    
    /**
     * Creates the toolbar entries
     * 
     * @return {qx.ui.toolbarToolBar} toolbar widget
     */  
    __setupToolbar : function()
    {  
      var toolbar = new qx.ui.toolbar.ToolBar;
      
      // Put together toolbar entries
      var button;
      var toolbarEntries = this.__getToolbarEntries();
      for (var i=0, j=toolbarEntries.length; i<j; i++)
      {
        var part = new qx.ui.toolbar.Part;
        toolbar.add(part);
        
        for (var entry in toolbarEntries[i])
        {
          var infos = toolbarEntries[i][entry];
          
          if(infos.custom) {
            button = infos.custom.call(this);
          }
          else 
          {
            button = new qx.ui.toolbar.Button(null, infos.image);
            button.set({ focusable : false, 
                         keepFocus : true,
                         center : true,
                         toolTipText : infos.text ? infos.text : "" });
            button.addListener("execute", infos.action, this.__htmlArea);
          }
          part.add(button);
        }        
      }
      
      return toolbar;
    }    
  }
});
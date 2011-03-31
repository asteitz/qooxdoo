/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * EXPERIMENTAL - NOT READY FOR PRODUCTION
 * 
 * A page is a widget which provides a screen with which users 
 * can interact in order to do something. Most times a page provides a single task
 * or a group of related tasks.
 * 
 * A qooxdoo mobile application is usually composed of one or more loosely bound
 * pages. Typically there is one page that presents the "main" view.
 * 
 * Pages can have one or more child widgets from the {@link qx.ui.mobile}
 * namespace. Normally a page provides a {@link qx.ui.mobile.navigationbar.NavigationBar}
 * for the navigation between pages.
 * 
 * To navigate between two pages, just inform the next page by calling the
 * {@link #show} method. Depending on the used page manager 
 * ({@link qx.ui.mobile.page.manager.Simple} or {@link qx.ui.mobile.page.manager.Animation})
 * a page transition will be animated. There are several animations available. Have
 * a look at the {@link qx.ui.mobile.page.manager.Animation} manager for more information.
 * 
 * A page has predefined lifecycle methods that get called by the used page manger
 * when a page gets shown. Each time another page is requested to be shown the current shown page
 * is stopped. The other page, will be, if shown for the first time, initialized and started
 * afterwards. For all called methods an event is fired.
 * 
 * Call of the {@link #show} method triggers the following lifecycle methods:
 * 
 * <ul>
 *   <li><strong>stop</strong>: Stops the current page</li>
 *   <li><strong>initialize</strong>: Initializes the page to show</li>
 *   <li><strong>start</strong>: Gets called when the page to show is started</li>
 * <ul>
 * 
 * IMPORTANT: Define all child widgets of a page when the {@link #initialize} lifecycle
 * method is called, either by listening to the {@link #initialize} event or overriding 
 * the {@link #_initialize} method. This is because a page can be instanced during
 * application startup and would then decrease performance when the widgets would be
 * added during constructor call. The {@link #initialize} lifecycle method is only called
 * when the page is shown for the first time.
 */
qx.Class.define("qx.ui.mobile.page.Page",
{
  extend : qx.ui.mobile.container.Composite,


 /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(layout)
  {
    this.base(arguments, layout);
    if (!layout) {
      this.setLayout(new qx.ui.mobile.layout.VBox());
    }
    qx.ui.mobile.page.Page.getManager().add(this);
    this._resize();
    qx.event.Registration.addListener(window, "orientationchange", this._resize, this);
    // TODO: only add this event for desktop browsers
    qx.event.Registration.addListener(window, "resize", this._resize, this);
  },




 /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fired when the lifecycle method {@link #initialize} is called */
    "initialize" : "qx.event.type.Event",

    /** Fired when the lifecycle method {@link #start} is called */
    "start" : "qx.event.type.Event",

    /** Fired when the lifecycle method {@link #stop} is called */
    "stop" : "qx.event.type.Event",

    /** Fired when the lifecycle method {@link #pause} is called */
    "pause" : "qx.event.type.Event",

    /** Fired when the lifecycle method {@link #resume} is called */
    "resume" : "qx.event.type.Event",

    /** Fired when the method {@link #back} is called */
    "back" : "qx.event.type.Event",

    /** Fired when the method {@link #menu} is called */
    "menu" : "qx.event.type.Event"
  },




 /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    defaultCssClass :
    {
      refine : true,
      init : "page"
    }
  },




 /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    __manager : null,
    __managerClass : null,


    /**
     * Returns the current page manager. The page manager is responsible for the
     * page transition and calling the lifecycle methods of a page.
     * 
     * @return {var} The currently used page manager
     */
    getManager : function()
    {
      if (!this.__manager) {
        this.__manager = new qx.ui.mobile.page.Page.__managerClass();
      }
      return qx.ui.mobile.page.Page.__manager;
    },


    /**
     * Sets the page manager to use.
     * 
     * @param clazz {Class} The page manger Class to use
     */
    setManagerClass : function(clazz)
    {
      qx.ui.mobile.page.Page.__managerClass = clazz;
    }
  },




 /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __initialized : false,


    /**
     * Resizes the page to the current window.innerHeight.
     */
    _resize : function()
    {
      if (qx.core.Environment.get("qx.mobile.nativescroll"))
      {
        this._setStyle("minHeight", window.innerHeight + "px");
      } else {
        this._setStyle("height", window.innerHeight + "px");
      }
    },


    // overridden
    _applyId : function(value, old)
    {
      this.base(arguments, value, old);
      if (old != null) {
        qx.ui.mobile.page.Page.getManager().remove(old);
      }

      qx.ui.mobile.page.Page.getManager().add(this);
    },



    /**
     * Fires the <code>back</code> event. Call this method if you want to request
     * a back action. For Android PhoneGap applications this method gets called
     * by the used page manager when the back button was pressed. Return <code>true</code>
     * to exit the application.
     * 
     * @return {Boolean} Whether the exit should be exit or not. Return <code>true</code
     *     to exit the application. Only needed for Android PhoneGap applications.
     */
    back : function()
    {
      this.fireEvent("back");
      var value = this._back();
      return value || false;
    },


    /**
     * Override this method if you want to perform a certain action when back
     * is called.
     * 
     * @return {Boolean} Whether the exit should be exit or not. Return <code>true</code
     *     to exit the application. Only needed for Android PhoneGap applications.
     * @see #back
     */
    _back : function()
    {
      
    },


    /**
     * Only used by Android PhoneGap applications. Called by the used page manger
     * when the menu button was pressed. Fires the <code>menu</code> event.
     */
    menu : function() {
      this.fireEvent("menu");
    },


    /**
     * The show method displays the page. Depending on the used page manager,
     * the transition is animated or not. Calls the <code>show</code> method of
     * the used page manager. See {@link qx.ui.mobile.page.manager.Simple#start}
     * or {@link qx.ui.mobile.page.manager.Animation#start} for more information.
     * 
     * @param data {var?null} The data that is used by the currently set page manger. 
     */
    show : function(data)
    {
      qx.ui.mobile.page.Page.getManager().show(this, data);
    },

    /*
    ---------------------------------------------------------------------------
      Lifecycle Methods
    ---------------------------------------------------------------------------
    */

    initialize : function()
    {
      if (!this.isInitialized())
      {
        this._initialize();
        this.__initialized = true;
        this.fireEvent("initialize");
      }
    },


    /**
     * Abstract method.
     */
    _initialize : function()
    {

    },


    isInitialized : function()
    {
      return this.__initialized;
    },


    start : function() {
      this._start();
      this.fireEvent("start");
    },


    /**
     * Abstract method.
     */
    _start : function()
    {

    },


    stop : function()
    {
      this._stop();
      this.fireEvent("stop");
    },


     /**
     * Abstract method.
     */
    _stop : function()
    {

    },


    pause : function() {
      this._pause();
      this.fireEvent("pause");
    },


    /**
     * Abstract method.
     */
    _pause : function()
    {

    },


    resume : function() {
      this._resume();
      this.fireEvent("resume");
    },


    /**
     * Abstract method.
     */
    _resume : function()
    {

    }
  },




 /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    qx.event.Registration.removeListener(window, "orientationchange", this._resize, this);
    // TODO: only add this event for desktop browsers
    qx.event.Registration.removeListener(window, "resize", this._resize, this);
    this.__initialized = null;
    if (!qx.core.ObjectRegistry.inShutDown)
    {
      if (this.getId()) {
        qx.ui.mobile.page.Page.getManager().remove(this.getId());
      }
    }
  },




 /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics)
  {
    if (qx.core.Environment.get("css.translate3d")) {
      statics.setManagerClass(qx.ui.mobile.page.manager.Animation);
    } else {
      statics.setManagerClass(qx.ui.mobile.page.manager.Simple);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2006 by 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL 2.1: http://www.gnu.org/licenses/lgpl.html

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/* ************************************************************************


************************************************************************ */

/*!
  Global timer support. Simplifies javascript intervals for objects.
*/
qx.OO.defineClass("qx.client.Timer", qx.core.Target,
function(vInterval)
{
  qx.core.Target.call(this);

  this.setEnabled(false);

  if (qx.util.Validation.isValidNumber(vInterval)) {
    this.setInterval(vInterval);
  }

  // Object wrapper to timer event
  var o = this;
  this.__oninterval = function() { o._oninterval(); }
});

qx.OO.addProperty({ name : "interval", type : qx.constant.Type.NUMBER, defaultValue : 1000 });

qx.Proto._intervalHandle = null;



/*
---------------------------------------------------------------------------
  MODIFIER
---------------------------------------------------------------------------
*/

qx.Proto._modifyEnabled = function(propValue, propOldValue, propData)
{
  if (propOldValue)
  {
    window.clearInterval(this._intervalHandle);
    this._intervalHandle = null;
  }
  else if (propValue)
  {
    this._intervalHandle = window.setInterval(this.__oninterval, this.getInterval());
  }

  return true;
}




/*
---------------------------------------------------------------------------
  USER-ACCESS
---------------------------------------------------------------------------
*/

qx.Proto.start = function() {
  this.setEnabled(true);
}

qx.Proto.startWith = function(vInterval)
{
  this.setInterval(vInterval);
  this.start();
}

qx.Proto.stop = function() {
  this.setEnabled(false);
}

qx.Proto.restart = function()
{
  this.stop();
  this.start();
}

qx.Proto.restartWith = function(vInterval)
{
  this.stop();
  this.startWith(vInterval);
}




/*
---------------------------------------------------------------------------
  EVENT-MAPPER
---------------------------------------------------------------------------
*/

qx.Proto._oninterval = function()
{
  if (this.getEnabled()) {
    this.createDispatchEvent(qx.constant.Event.INTERVAL);
  }
}





/*
---------------------------------------------------------------------------
  DISPOSER
---------------------------------------------------------------------------
*/

qx.Proto.dispose = function()
{
  if(this.getDisposed()) {
    return;
  }

  // Stop interval
  this.stop();

  // Clear handle
  if (this._intervalHandler)
  {
    window.clearInterval(this._intervalHandle);
    this._intervalHandler = null;
  }

  // Clear object wrapper function
  this.__oninterval = null;

  // Call qx.core.Target to do the other dispose work
  return qx.core.Target.prototype.dispose.call(this);
}





/*
---------------------------------------------------------------------------
  HELPER
---------------------------------------------------------------------------
*/

qx.client.Timer.once = function(vFunction, vObject, vTimeout)
{
  // Create time instance
  var vTimer = new qx.client.Timer(vTimeout);

  // Add event listener to interval
  vTimer.addEventListener(qx.constant.Event.INTERVAL, function(e)
  {
    vFunction.call(vObject, e);
    vTimer.dispose();

    vObject = null;
  }, vObject);

  // Directly start timer
  vTimer.start();
}

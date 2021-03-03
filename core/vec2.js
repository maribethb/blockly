goog.provide('goog.math.Vec2');

/**
 * Class for a two-dimensional vector object and assorted functions useful for
 * manipulating points.
 *
 * @param {number} x The x coordinate for the vector.
 * @param {number} y The y coordinate for the vector.
 * @struct
 * @constructor
 */
goog.math.Vec2 = function(x, y) {
  'use strict';
  /**
     * X-value
     * @type {number}
     */
  this.x = x;
  
  /**
     * Y-value
     * @type {number}
     */
  this.y = y;
};
  
/**
   * Scales this coordinate by the given scale factors. The x and y values are
   * scaled by `sx` and `opt_sy` respectively.  If `opt_sy`
   * is not given, then `sx` is used for both x and y.
   * @param {number} sx The scale factor to use for the x dimension.
   * @param {number=} opt_sy The scale factor to use for the y dimension.
   * @return {!goog.math.Vec2} This vector after scaling.
   */
goog.math.Vec2.prototype.scale = function(sx, opt_sy) {
  var sy = (typeof opt_sy === 'number') ? opt_sy : sx;
  this.x *= sx;
  this.y *= sy;
  return this;
};

/**
 * Subtracts another vector from this vector in-place.
 * @param {!goog.math.Vec2} b The vector to subtract.
 * @return {!goog.math.Vec2} This vector with `b` subtracted.
 */
goog.math.Vec2.prototype.subtract = function(b) {
  this.x -= b.x;
  this.y -= b.y;
  return this;
};

/**
 * Adds another vector to this vector in-place.
 * @param {!goog.math.Vec2} b The vector to add.
 * @return {!goog.math.Vec2}  This vector with `b` added.
 */
goog.math.Vec2.prototype.add = function(b) {
  this.x += b.x;
  this.y += b.y;
  return this;
};

/** @override */
goog.math.Vec2.prototype.equals = function(b) {
  'use strict';
  if (this === b) {
    return true;
  }
  return b instanceof goog.math.Vec2 && !!b && this.x == b.x && this.y == b.y;
};

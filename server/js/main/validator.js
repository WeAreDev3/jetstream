/*

End result is to have these two expressions === each other

val('myUsern4me').isAlphanumeric().isLength(3).result;
val.isAlphanumeric('myUsern4me') && val.isLength('myUsern4me', 3);

*/

// var Valid = function(test) {
//     this.test = test;
//     this.result = true;
// };

// Valid.prototype.isAlpha = function() {
//     if (this.result) {
//         this.result = validator.isAlpha(this.test);
//     }

//     return this;
// };

// Valid.prototype.isAlphanumeric = function() {
//     if (this.result) {
//         this.result = validator.isAlphanumeric(this.test);
//     }

//     return this;
// };

// Valid.prototype.isNumeric = function() {
//     if (this.result) {
//         this.result = validator.isNumeric(this.test);
//     }
    
//     return this;
// };

// Valid.prototype.isLength = function(min, max) {
//     if (this.result) {
//         this.result = validator.isLength(this.test, min, max);
//     }
    
//     return this;
// };

// var val = function(test) {
//     return new Valid(test);
// };

// val.isAlpha = function(str) {
//     var args = Array.prototype.slice.call(arguments);
//     return validator.isAlpha.apply(validator, args);
// };

// val.isAlphanumeric = function(str) {
//     var args = Array.prototype.slice.call(arguments);
//     return validator.isAlphanumeric.apply(validator, args);
// };

// val.isNumeric = function(str) {
//     var args = Array.prototype.slice.call(arguments);
//     return validator.isNumeric.apply(validator, args);
// };

// val.isLength = function(str, min, max) {
//     var args = Array.prototype.slice.call(arguments);
//     return validator.isLength.apply(validator, args);
// };
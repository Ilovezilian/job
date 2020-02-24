# learning about jquery.
## how jquery works
### launching code on document ready
To ensure that their code runs after the browser finishes loading the document, many JavaScript programmers wrap their code in an onload function:
```javascipt
window.onload = function() {
 
    alert( "welcome" );
 
};
```
Unfortunately, the code doesn't run until all images are finished downloading, including banner ads. 
To run code as soon as the document is ready to be manipulated, jQuery has a statement known as the ready event:
```javascript
$( document ).ready(function() {
 
    // Your code here.
 
});
```
> Note: The jQuery library exposes its methods and properties via two properties of the window object called jQuery and $. $ is simply an alias for jQuery and it's often employed because it's shorter and faster to write.


### adding and removing an html class
```javascript
<style>
a.test {
    font-weight: bold;
}
</style>
```
```javascript
// All <a> elements are now bold.
$("a").addClass("test");
```
```javascript
// remove an existing class
$("a").removeClass("test");
```
### callbacks and functions
``` javascript 
// Callback without Arguments
$.get( "myhtmlpage.html", function() {
 
    myCallBack( param1, param2 );
 
});
```

### selecting elements
* selecting elements by ID
```javascript
$("#myId");  // Note IDs must be unique per page.
```
* selecting elements by class name
```javascript
$(".myClass");
```
* selecting elements by attribute
```javascript
$("input[name='first_name']");
```
* selecting elements by compound css selector 
```javascript
$("#contents url.people li");
```
* selecting elements with a comma-separated list of selectors
```javascript
$("div.myClass, ul.people");
```
* pseudo-selectors
```javascript
$("a.external:first");
$("tr:odd");

// select all input-like elements in a form (more on this below).
$("myForm :input");
$("div:visible");

// all except the first three divs.
$("div:gt(2)");
// all currently animated divs.
$("div:animated");
```
> Note: When using the :visible and :hidden pseudo-selectors, jQuery tests the actual visibility of the element, not its CSS visibility or display properties. jQuery looks to see if the element's physical height and width on the page are both greater than zero.

### new user remember.
* Methods called on jQuery selections are in the $.fn namespace, and automatically receive and return the selection as this.
* Methods in the $ namespace are generally utility-type methods, and do not work with selections; they are not automatically passed any arguments, and their return value will vary.

### manipulating elements
#### getting and setting information about elements
* .html() – Get or set the HTML contents.
* .text() – Get or set the text contents; HTML will be stripped.
* .attr() – Get or set the value of the provided attribute.
* .width() – Get or set the width in pixels of the first element in the selection as an integer.
* .height() – Get or set the height in pixels of the first element in the selection as an integer.
* .position() – Get an object with position information for the first element in the selection, relative to its first positioned ancestor. This is a getter only.
* .val() – Get or set the value of form elements.



[![npm version](https://badge.fury.io/js/ubiquisync.svg)](http://badge.fury.io/js/ubiquisync)

# Ubiquisync

Sync methods for backbone and ampersand that work in node and the browser.

# Example

```js

var sync = require('ubiquisync');
var AmpModel = require('ampersand-model');


var Person = AmpModel.extend({
    url: function(){
        var url = 'https://api.example.com/person';
        if(!this.isNew()){
            url = url + '/' + this.id;
        }
        return url;
    },
    props: {
        name: 'string'
    },
    sync: sync    
});

module.exports = Person;

```
..or something.

The model can then `fetch`, `save` etc both in node and on the browser.




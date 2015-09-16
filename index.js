'use strict';

var marked = require('marked');

function Oblivion( options ) {
   // Ensure its an object
   if ( !( this instanceof Oblivion ) ) { return new Oblivion(options); }

   options = options || {};
   this.blogPath = options.blogPath || 'blogs';
}

Oblivion.prototype.get_posts = function get_posts() {
   var self = this;

   return fetch(this.blogPath + '/index.json').then(function(response) {
      return response.json();
   }).then(function(json) {

      function addPost(response) {
         return response.text();
      }

      var posts = [];

      for ( var i = 0; i < json.length; i++ ) {
         posts.push( fetch(self.blogPath + '/' + json[i]).then(addPost) );
      }
      return Promise.all(posts);
   }).catch(function(ex) {
      console.log('parsing failed', ex);
   });
};

Oblivion.prototype.render_posts = function render_posts( posts ) {
   var i      = posts.length,
       output = '';

   while ( i -- ) {
      output += marked(posts[i]);
   }

   return output;
};

module.exports = Oblivion;

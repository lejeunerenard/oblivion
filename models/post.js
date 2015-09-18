'use strict';

var marked = require('meta-marked');

function Post(options) {
   // Ensure its an object
   if ( !( this instanceof Post ) ) { return new Post(options); }

   if ( ! options.oblivion ) {
      throw new Error('Post requires Oblivion object');
   }
   this.oblivion = options.oblivion;

   this.path = options.path;
}

Post.prototype.fetch = function fetch() {
   var self = this;
   return new Promise( function(resolve, reject) {
      self.oblivion.repo.read( self.oblivion.branch, self.path, function(err, data) {
         if ( err ) { return reject( err ); }

         var parsed = marked(data);
         self.html = parsed.html;
         self.meta = parsed.meta;
         resolve(self);
      });
   });
};

module.exports = Post;

'use strict';

var marked = require('meta-marked');
var Github = require('github-api');

require('es6-promise').polyfill();

function Oblivion( options ) {
   // Ensure its an object
   if ( !( this instanceof Oblivion ) ) { return new Oblivion(options); }

   options = options || {};
   this.blogPath = options.blogPath || 'blogs';
   this.branch = options.branch || 'gh-pages';

   // Setup Repo
   if ( ! options.repo ) {
      throw new Error('Oblivion : repo must be provided');
   }
   var userRepo = options.repo.split('/');
   this.repoUser = userRepo[0];
   this.repoName = userRepo[1];

   this.github = new Github({});

   this.repo = this.github.getRepo(this.repoUser, this.repoName);
}

Oblivion.prototype.get_posts = function get_posts() {
   var self = this,
       posts = [];

   return new Promise(function(resolve, reject) {

      self.repo.contents(self.branch, self.blogPath, function(err, data) {
         if ( err ) { return reject( err ); }

         // Get only markdown files
         var files = data.filter(function(item) {
            return item.type === 'file' && /\.md$/.test(item.name);
         });

         var i = files.length;
         while ( i -- ) {
            var file = files[i];
            posts.push( new Promise( function(resolve, reject) {
               self.repo.read( self.branch, file.path, function(err, data) {
                  if ( err ) { return reject( err ); }
                  resolve(data);
               });
            }) );
         }

         resolve(Promise.all(posts));
      });

   });
};

Oblivion.prototype.render_posts = function render_posts( posts ) {
   var i      = posts.length,
       output = '';

   while ( i -- ) {
      var post = marked(posts[i]);
      output += post.html;
      console.log('meta', post.meta);
   }

   return output;
};

module.exports = Oblivion;

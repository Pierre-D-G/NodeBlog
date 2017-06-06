# NodeBlog
Node Express Mongodb Blog Website


## Features

A homepage which displays all blog posts.

Forms to add a new blog posts,categories and comments

A page which displays blog posts which have the same category

A page which displays all the content of a blog post including comments

Editing and deleting already submitted blog posts

Access Control

## Usage

### Requires mongodb installed on your device to work

* Download or clone the repository with: git clone https://github.com/Pierre-D-G/NodeBlog.git .

* Install required packages with: 

`$ npm install

* Start mongodb with: 

     $ mongod 

* To seed the database run:

     $ mongoimport --db nodeblog --collection posts --drop --file posts-seed.json --jsonArray 

    AND 

    $ mongoimport --db nodeblog --collection categories --drop --file categories-seed.json --jsonArray

* Set the admin login credentials in admin-seed.json and enter it into the database with:

    $ mongoimport --db nodeblog --collection login --drop --file admin-seed.json --jsonArray

* Run the app with: 

     $ npm start
   
* Using a browser,got to http://localhost:3000 to use the application

## TODO

~~Modules,Middleware and Templates~~

~~Homepage for blog posts~~

~~Add posts and categories~~

~~View Posts by categories~~

~~Single blog post~~

~~Blog post comments~~

~~Edit Blog Posts~~

~~Delete Blog Posts~~

Access Control:

* ~~Admin Login~~

* ~~Admin Only Access to create,edit,delete blogs and categories~~








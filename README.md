# NodeBlog
Node Express Mongodb Blog Website


## Features

Homepage for blog posts

Add posts and categories to the posts

View posts by category

Blog post page with comments

## Usage

### Requires mongodb installed on your device to work

* Download or clone the repository with: git clone https://github.com/Pierre-D-G/NodeBlog.git .

* Install required packages with: npm install

* Start mongodb with: mongod 

* To seed the database run:

     mongoimport --db nodeblog --collection posts --drop --file posts-seed.json --jsonArray 

    AND 

    mongoimport --db nodeblog --collection categories --drop --file categories-seed.json --jsonArray

* Run the app with: npm start

## TODO

~~Modules,Middleware and Templates~~

~~Homepage for blog posts~~

~~Add posts and categories~~

~~View Posts by categories~~

~~Single blog post~~

~~Blog comments~~

Edit Blog Posts

Delete Blog Posts

## Future Development

Implement Content Management System For Blog Owner

Implement Social Media Sharing Of Blog Articles

Social Media Login and Commenting







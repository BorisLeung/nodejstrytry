# nodejstrytry
This is a repo for testing `node.js` and `mongodb`. The main project in this repo is located inside the "Servers" folder where a forum server is hosted.

## Table of contents
* [Installation](#installation)
* [Setup](#setup)
* [Usage](#usage)

## Installation
Use `npm` to install the necessary packages
```bash
npm install
```

## Setup
Before running the server, a .env file has to be created manually under the "Servers" folder. Type the following into the file:
```
DB_CONNECTION=[YOUR_DB_LINK]
PORT=[YOUR_PORT]
```
>Replace [YOUR_DB_LINK] with the connection link to your mongodb server and [YOUR_PORT] with any port number preferred

Change the current directory to the "Servers" folder and run:
```bash
nodemon app
```

## Usage
#### `/` Login
> Allows users to login to the forum. Direct users to the main page upon successful login.

#### `/register` Account registration
> Allows users to create a new account.

#### `/createAdmin` Admin creation
> Creates/resets the default admin account. The username and password for the account are `admin` and `admin123` respectively.

#### `/logout` Logout
> Logouts the current user

#### `/posts` Posts display
> Displays all the posts

#### `/posts/addpost` Post addition
> Allows users to create a new post after login. Directs users to the main page upon succesful new post creation.

#### `/posts/edit/:post_id` Post edit
> Allows users and admins to edit or delete a post

#### `/user/self` Account information
> Displays the account information of the current user.

#### `user/:user_id` User information
> Allows admins to view a user's information by id

#### `user/self/change` Account alteration
> Allows users to change their username and password upon giving their current password succesfully

#### `user/:user_id/change` User's account alteration
> Allow admins to edit other user's account by id

#### `user/all` Users list
> Displays all users in a list for admins

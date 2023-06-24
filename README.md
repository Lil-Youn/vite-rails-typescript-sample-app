# README

# $rails new <your-app-name> --minimal

this command builds a new rails application with minimal gems

# $cd <your-app-name>

to move in the project directory

# $rails g controller Homepage index

create a new controller to show your page in the frontend with the index method
In routes.rb, link the root route to the index method.
your routes.rb file should now look like this

Rails.application.routes.draw do
get 'homepage/index'
root 'homepage#index'

end

# Set up the database

Start with rails db:create, this creates the test_app_development and test_app_test databases for development

# Start the App

use command $rails s to start the app

You should now see a simple site with this text:

Homepage#index
Find me in app/views/homepage/index.html.erb

# Creating APIs

We have a minimal setup which we can add APIs to. To create APIs, we have to generate models, controllers and the relevant API endpoints.

We will create a simple friends app, so lets set up the model:
use $rails generate model Friend first_name:string last_name:string email:string twitter:string

This sets up our database for Friends and adds some extra files for managing the database model

Then perform database migrations with $rails db:migrate. Run this command each time you make changes to the databases, such as adding or modifying models.

# Generating controllers

Our API code will be written in controller files. To create a controller for articles, run this command:$rails generate controller api/v1/Friends index --skip-routes. The controller is namespaced with api/v1 to indicate that the controllers are for APIs and to version the APIs.

This should generate this files:

     create  app/controllers/api/v1/friends_controller.rb
      invoke  erb
      create    app/views/api/v1/friends
      create    app/views/api/v1/friends/index.html.erb
      invoke  test_unit
      create    test/controllers/api/v1/friends_controller_test.rb
      invoke  helper
      create    app/helpers/api/v1/friends_helper.rb
      invoke    test_unit

open this file: sample-app/app/controllers/api/v1/friends_controller.rb

and add this:

def index
@friends = Friend.all
render json: @friends
end
end

This retrieves articles from the database and renders the articles in JSON.

# Add API endpoints

Our frontend app needs to call APIs via an API endpoint. In config/routes.rb, add the following:

namespace :api do
namespace :v1 do
resources :friends, only: [:index]
end
end
end

This adds a route at api/v1/friends and links it to the index method in the Friends controller. For this tutorial, I will only be creating the index API, but as more CRUD APIs are created, feel free to remove the only: [:index] code to generate routes for all CRUD operations.

# Adding test data

lets add some test data and use the db/seeds.rb file for this.

write this in your file:

Friend.create([{first_name: 'John', last_name: 'Smith', email: 'john.smith@gmail.com', twitter: '@johnsmith'},{first_name:'Jane', last_name: 'Doe', email: 'jane.doe@gmail.com', twitter: '@janedoe'},{first_name: 'Bob', last_name: 'Jones', email: 'bob.jones@gmail.com', twitter: '@bobjones'}])

# This will create three friends in the database. You can verify this by running rails db:seed

head over to: http://localhost:3000/api/v1/friends
to see the results in your db. the test data we wrote in the seed.rb file should now be displayed in JSON format:

[{"id":1,"first_name":"John","last_name":"Smith","email":"john.smith@gmail.com","twitter":"@johnsmith","created_at":"2023-06-24T05:31:13.458Z","updated_at":"2023-06-24T05:31:13.458Z"},{"id":2,"first_name":"Jane","last_name":"Doe","email":"jane.doe@gmail.com","twitter":"@janedoe","created_at":"2023-06-24T05:31:13.465Z","updated_at":"2023-06-24T05:31:13.465Z"},{"id":3,"first_name":"Bob","last_name":"Jones","email":"bob.jones@gmail.com","twitter":"@bobjones","created_at":"2023-06-24T05:31:13.469Z","updated_at":"2023-06-24T05:31:13.469Z"}]

# Integrating Vite

We have created APIs in our Rails app, and are now ready to set up the frontend app with React and Vite.

# Installing Vite

First, install the vite_rails gem by including this in your Gemfile: gem 'vite_rails'.

Install the gem in your project with the $bundle install command.

Run $bundle exec vite install to install the relevant Javascript dependencies and sample files.

define a script to run the Vite development server in our package.json:

{
"devDependencies": {
"vite": "^2.4.4",
"vite-plugin-ruby": "^2.0.5"
},
"scripts": {
"dev": "bin/vite dev"
}
}

# run $bin/vite upgrade

to upgrade vite to the newest version

open the devtools/console when on localhost:3000 and see “Vite ⚡️ Rails” printed on the console

# writing React code

run $npm install react react-dom

then move to sample-app/app/frontend/entrypoints/application.js, remove this file and create a new file: sample-app/app/frontend/entrypoints/index.jsx

write this code into the new index.jsx file

import React from 'react';
import ReactDOM from 'react-dom';

import App from '../components/App';

ReactDOM.render(
<React.StrictMode>
<App />
</React.StrictMode>,
document.getElementById('root')
);

# create a new App.jsx file in your frontend folder

i included the App.jsx file into a new subfolder calleds "components" in our frontend folder

sample-app/app/frontend/components/App.jsx

should look like this

import React from 'react';

const App = () => {
return (

<div>
Friends
</div>
);
};

export default App;

# Including the app in Rails

Now that we have created our React components, we can integrate them into our Rails app. The page that will be displayed on the Rails app is app/views/layouts/application.html.erb, so we have to link our React components to this file. This is similar to the index.html page that are in create-react-app setups, where the index.html page links React components to that page.

Remove the <%= vite_javascript_tag ‘application' %> as we have deletedapp/javascript/entrypoints/application.js. Include this javascript tag: <%= vite_javascript_tag ‘index.jsx' %> to load the index.jsx file we have defined earlier.

In app/views/homepage/index.html.erb, replace the existing code with <div id="root /> so the contents of the React app can be displayed in this div tag.

# show the data in a more beautiful way

edit the App.jsx file like this:

import React from "react";

const App = () => {
const [data, setData] = React.useState([]);
React.useEffect(() => {
fetch("/api/v1/friends")
.then((res) => res.json())
.then((data) => setData(data));
}, []);
return (

<div>
<h1>Friends</h1>
<hr />
{data.map(({ first_name, last_name, email, twitter }) => (
<>
<h3>Name</h3>
<div>
{first_name} {last_name}
</div>

          <h3>Contact</h3>
          <div>Email: {email}</div>
          <div>Twitter: {twitter}</div>
          <hr />
        </>
      ))}
    </div>

);
};

export default App;

this should render the whola component in a more readable way.

# Lets add Typescript to this project...

run $npm i typescript

package installed. you should be able to rename your App.jsx file to App.tsx and write typescript code now... BOOOOOOM!

# Rails and Vite information

-Vite Ruby Documentation, in particular, the overview section: https://vite-ruby.netlify.app/overview.html
-Rails guides on the asset pipeline: https://guides.rubyonrails.org/asset_pipeline.html

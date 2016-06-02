# User Profiles II
### Understanding Services with $http
The first time we created this app we did it using fake data located in our service. In this repo we will use a live API instead and hit it using $http, or AJAX.

In this repository, we have created the usersProfile app based on the instructions found [here](https://github.com/devmountain/mini-userProfiles).

# Step 1 - Our Service
Our service has all this data inside of it:
``` javascript
  [
    {
        "id": 1,
        "first_name": "george",
        "last_name": "bluth",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
    },
    {
        "id": 2,
        "first_name": "lucille",
        "last_name": "bluth",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
    },
    {
        "id": 3,
        "first_name": "oscar",
        "last_name": "bluth",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"
    }
  ]
```

In the real world, we won't be storing data in our files at all. This is what databases are for. Instead, our Angular app makes requests to web servers which go and fetch the data. We will do that by using the built in Angular service of $http. $http is a service that makes AJAX requests to APIs. With Ajax, Web applications can send data to and retrieve from a server asynchronously (in the background) without interfering with the display and behavior of the existing page. AJAX is super important to web development. Let's remove our data and replace it with an  request.

- Remove the data variable from the code so that our service looks like this:

``` javascript
var app = angular.module('userProfiles');

app.service('mainService', function() {
  this.getUsers = function() {
    return data;
  }
});
```

- Now we need to inject $http into our service, and replace our getUsers method with a getUsers AJAX request

``` javascript
var app = angular.module('userProfiles');

app.service('mainService', function($http) {
  this.getUsers = function() {
    return $http({
      method: 'GET',
      url: 'http://reqres.in/api/users?page=1'
    });
  }
});
```

What we are doing here is returning an AJAX request by using $http. The METHOD part tells the API we're hitting what kind of request we are making. There are a lot of different types of requests, but the most common are GET (getting data), POST (creating data), PUT (updating data), and delete (don't make me say it).

In this example, we are getting data. All we want to do is get the current user data.

The URL part is our endpoint. Whenever a backend engineer creates a webserver they make endpoints. An endpoint is essentially a url that accesses particular data. When you type www.google.com into your web browser you are making a GET request at the endpoint of www.google.com, and what you're getting is a webpage.

In this case we're just getting raw user data back.

# Step 2 - Our Controller
Now that our service is making a real life - grown up GET request our controller needs to grow up a little in order to handle it.

Here is what our controller currently looks like:

``` javascript
var app = angular.module('userProfiles');

app.controller('MainController', function($scope, mainService) {
  $scope.getUsers = function() {
    $scope.users = mainService.getUsers();
  }

  $scope.getUsers();
});
```
We are simply setting our users equal to the result of our service's getUsers function. This won't work anymore. If we tried to leave the controller the same, we would end up getting the response from our request without data. The reason why is because when hitting a real API, it takes some time to retrieve the data. While the data is still trying to come back, Angular has already defined $scope.users, and it's defined it without having any data!

What we need to do is implement a promise! A promise will keep Angular from jumping to conclusions. Instead of defning $scope.users ASAP, Angular will wait until the data comes through to define it.

- Replace the old getUsers method with a new one which has a promise!
``` javascript
var app = angular.module('userProfiles');

app.controller('MainController', function($scope, mainService) {
  $scope.getUsers = function() {
    mainService.getUsers().then(function(response) {
      $scope.users = response.data.data;
    });
  }
  $scope.getUsers();
});
```

All we are doing here is calling the mainService.getUsers function, and saying that once we finish that function, THEN define $scope.users.

The response is a giant JSON object that contains a lot of information we don't necessarily need right now. That's why $scope.users is equal to response.data.data. Data is a child of response, and it has a child named data. The second child named data is where our user profile information lives.

If all goes well we should get the same response in our HTML file and not have to manipulate our view at all.

# User Profiles III
### Understanding Services with $q
Now returning to our project where we are pulling user profiles, we've made some good progress. We can now make real life API requests for data using $http (AJAX requests)!

But what happens if we want to have a bit more granular control over our code. Sometimes you'll want to manipulate your data before you send it over to the controller. That's where $q comes into play!

$q allows us to hold off on sending our data over until we're ready. It's fairly simple. All we need to do is edit our service.

## Step 1 Our Service
- Inject $q into the service
``` javascript
angular.module('userProfiles').service('mainService', function($http, $q) {
  this.getUsers = function() {
    return $http({
        method: 'GET',
        url: 'http://reqres.in/api/users?page=1'
    })
  }
});
```

- Once injected we can begin using it by adding a deffered variable to handle it

``` javascript
angular.module('userProfiles').service('mainService', function($http, $q) {
  this.getUsers = function() {
    var deferred = $q.defer();
    return $http({
        method: 'GET',
        url: 'http://reqres.in/api/users?page=1'
    })
  }
});
```

- Now let's add a promise to our service

``` javascript
angular.module('userProfiles').service('mainService', function($http, $q) {
  this.getUsers = function() {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: 'http://reqres.in/api/users?page=1'
    }).then(function(response) {
      deferred.resolve(response)
    })
    return deferred.promise;
  }
});
```

Right now, our code should still work the same, so what's the point of $q? Why are we adding all of this weird code to our service?

Well imagine you wanted to make a change to your data before you sent it over to the controller. For instance, currently we have this happening in our controller:

``` javascript
mainService.getUsers().then(function(dataFromService) {
  $scope.users = dataFromService.data.data;
});
```

dataFromService.data.data??? We are loading a lot of unnecessary data into our $scope object. Rather than filter it out in our controller we can use $q to filter it out as we pull it through our service.

``` javascript
angular.module('userProfiles').service('mainService', function($http, $q) {
  this.getUsers = function() {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: 'http://reqres.in/api/users?page=1'
    }).then(function(response) {
      var parsedResponse = response.data.data
      deferred.resolve(parsedResponse)
    })
    return deferred.promise;
  }
});
```

Now our controller can just take what it's given and not have to filter anything out. Like so:

``` javascript
angular.module('userProfiles').controller('MainController', function($scope, mainService) {
  $scope.getUsers = function() {
    mainService.getUsers().then(function(dataFromService) {
      $scope.users = dataFromService;
    });
  }

  $scope.getUsers();

});
```

Cool stuff!

Let's go ahead and do something a little less relevant, but more fun. Let's change everyones first_name in the service to Ralf.

``` javascript
angular.module('userProfiles').service('mainService', function($http, $q) {
  this.getUsers = function() {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: 'http://reqres.in/api/users?page=1'
    }).then(function(response) {
      var parsedResponse = response.data.data
      for(var i = 0; i < parsedResponse.length; i++) {
        parsedResponse[i].first_name = 'Ralf'
      }
      deferred.resolve(parsedResponse)
    })
    return deferred.promise;
  }
});
```

Now all of our user's first names are Ralf. While it isn't a very good real world example, it's good to see how we can manipulate things. $q!

## Copyright

© DevMountain LLC, 2016. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

angular.module('userProfiles').controller('MainController', function($scope, mainService){



    $scope.thisAppIsBroken = "This angular app is working";

      $scope.getUsers = function() {
        mainService.getUsers().then(function(response) {
          console.log(response);
          $scope.users = response.data.data;
        });
      }
      //calls the service's getUser's function. A promise (.then) will keep Angular from jumping to conclusions. Instead of defning $scope.users ASAP, Angular will wait until the data comes through to define it.

      $scope.getUsers();
      // we invoke right after the function is created because we want to get the users right away when the page loads.


    $scope.toggleFavorite = function(idx){
        //we pass through the index # and it changes the ng-class on the user (.isFavorite) to the 'opposite' of what it currently is. since it simply changes to the 'opposite', it is able to toggle back and forth
        $scope.users[idx].isFavorite = !$scope.users[idx].isFavorite;

        console.log("favorite btn clicked... user.isFavorite =", $scope.users[idx].isFavorite); // as you click the favorite button you'll see that the user's .isFavorite class is changing back and forth between true and false in the console. ng-class is now seeing what user.isFavorite is evaluating to and is able to apply the class accordingly.
    }

    $scope.removeUser =function(idx){
        //we use 'track by $index' in the ng-repeat in the index.html - we pass in $index on the ng-click function that invokes removeUser. $index is simply the index (which is a #) each object is in the array.
        console.log("before delete", $scope.users); // the array before we remove a user.

        $scope.users = mainService.removeUser(idx); // now we invoke the removeUser func in the service and pass through the index (which is a #) again. The service's removeUser function is returning the new/updated user's array. So we have to reset $scope.users to that updated array.

        console.log("after delete", $scope.users); // the array after we remove a user.

        //we have to reset $scope.users to the new array of users after we delete a user. If we don't, the ng-repeat of $scope.users doesn't change.
    };

    $scope.removeUser = function(idx){
        $scope.users.splice(idx, 1); // removes the user at the given index
    }

});

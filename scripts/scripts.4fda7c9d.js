"use strict";angular.module("minionsManagedNgApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).otherwise({redirectTo:"/"})}]),angular.module("minionsManagedNgApp").controller("MainCtrl",["$scope","mmApi",function(a,b){function c(a,b){return 1===a?b:b+"s"}a.workerTypes=["gecko-t-win7-32","gecko-t-win7-32-gpu","gecko-t-win10-64","gecko-t-win10-64-gpu","gecko-1-b-win2012","gecko-2-b-win2012","gecko-3-b-win2012"],a.dataCenters=["use1","use2","usw1","usw2","euc1"],a.selected={workerType:a.workerTypes[0],dataCenter:a.dataCenters[0]},a.loading=!0,b.query({},function(b){a.counts={},a.workerTypes.forEach(function(c){a.counts[c]={count:0},a.dataCenters.forEach(function(d){a.counts[c][d]=b.filter(function(a){return a.workerType==c&&a.dataCenter==d}).length,a.counts[c].count+=a.counts[c][d]})}),a.allMinions=b,a.minions=b.filter(function(b){return b.workerType==a.selected.workerType}),a.loading=!1}),a.getData=function(b,c){a.counts[b][c]>0&&(a.loading=!0,a.selected.workerType=b,a.selected.dataCenter=c,a.minions=a.allMinions.filter(function(a){return a.workerType===b&&a.dataCenter===c}),a.loading=!1)},a.getUptime=function(a){if(null==a)return"unknown";var b=(new Date-new Date(a))/1e3,d=Math.floor(b/86400),e=Math.floor((b-86400*d)/3600),f=Math.floor((b-86400*d-3600*e)/60),g=Math.floor(b-86400*d-3600*e-60*f);return d>0?d+" "+c(d,"day"):e>0?e+" "+c(e,"hour"):f>0?f+" "+c(f,"minute"):g+c(g,"second")},a.getRegion=function(a){switch(a){case"use1":return"us-east-1";case"use2":return"us-east-2";case"usw1":return"us-west-1";case"usw2":return"us-west-2";case"euc1":return"eu-central-1";default:return a}}}]),angular.module("minionsManagedNgApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("minionsManagedNgApp").factory("mmApi",["$resource",function(a){return a("https://api.minions-managed.tk/minions/alive",{},{query:{isArray:!0}})}]),angular.module("minionsManagedNgApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/main.html",'<ul class="nav nav-tabs"> <li ng-repeat="workerType in workerTypes" ng-class="{active: workerType === selected.workerType}" ng-show="counts[workerType].count"> <a ng-click="getData(workerType, selected.dataCenter)">{{workerType}} ({{counts[workerType].count}})</a> </li> </ul> <div style="padding: 10px"> <ul class="nav nav-tabs"> <li ng-repeat="dataCenter in dataCenters" ng-class="{active: dataCenter === selected.dataCenter}" ng-show="counts[selected.workerType][dataCenter]"> <a ng-click="getData(selected.workerType, dataCenter)">{{getRegion(dataCenter)}} ({{counts[selected.workerType][dataCenter]}})</a> </li> </ul> </div> <div ng-show="loading" class="spinner"> <div class="cube1"></div> <div class="cube2"></div> </div> <div class="clearfix col-sm-2" ng-repeat="minion in minions | orderBy : \'created\' : reverse"> <div class="panel" ng-class="{\n    \'panel-default\': (minion.tasks.length === 0 && (minion.restarts.length - minion.tasks.length) < 2),\n    \'panel-info\': (minion.tasks.length > 0 && (minion.restarts.length - minion.tasks.length) < 2),\n    \'panel-warning\': ((minion.restarts.length - minion.tasks.length) === 2),\n    \'panel-danger\': ((minion.restarts.length - minion.tasks.length) > 2)\n  }"> <div class="panel-heading"> <h4 class="panel-title"> <a style="cursor: pointer" ng-click="minion.showbody=!minion.showbody">{{minion._id.replace(\'0000000\', \'i-\')}}</a> </h4> tasks: {{minion.tasks.length}}, restarts: {{minion.restarts.length}}, uptime: <span>{{getUptime(minion.created)}}</span> </div> <div class="panel-body" ng-show="minion.showbody"> <ul> <li>ip: {{minion.ipAddress}}</li> <li>created: {{minion.created}}</li> <li> <a href="https://papertrailapp.com/groups/2488493/events?q={{minion._id.replace(\'0000000\', \'i-\')}}">event logs</a> </li> <li> <a href="https://console.aws.amazon.com/ec2/v2/home?region={{getRegion(minion.dataCenter)}}#Instances:instanceId={{minion._id.replace(\'0000000\', \'i-\')}}">ec2 console</a> </li> <li> <a style="cursor: pointer" ng-click="minion.showtasks=!minion.showtasks">tasks ({{minion.tasks.length}})</a> <ul ng-show="minion.tasks.length && minion.showtasks"> <li ng-repeat="task in minion.tasks"> <a href="https://tools.taskcluster.net/task-inspector/#{{task.id}}">{{task.id}}</a> </li> </ul> </li> <li> <a style="cursor: pointer" ng-click="minion.showrestarts=!minion.showrestarts">restarts ({{minion.restarts.length}})</a> <ul ng-show="minion.restarts.length && minion.showrestarts"> <li ng-repeat="restart in minion.restarts"> {{restart.time}} {{restart.comment}} </li> </ul> </li> </ul> </div> </div> </div>')}]);
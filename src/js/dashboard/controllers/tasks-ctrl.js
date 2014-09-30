/**
 * Tasks Controller
 */
app.controller('TasksCtrl', function TasksCtrl($scope, Task, $controller, $modal) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Task
  $scope.search.orFields = ['name', 'phone']
  $scope.includes = ['ssc', 'doctor', 'project']
  
  $scope.showCreate = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/task-create.html',
      controller: createModalInstanceCtrl,
      size: 'lg'
    })

    modalInstance.result.then(function (tasks) {
      $scope.fetch()
    }, function () {
    })
  }
  
  $scope.showDetail = function (entity) {
    $modal.open({
      templateUrl: 'partials/task-detail.html',
      controller: detailModalInstanceCtrl,
      size: 'lg',
      resolve: {
        task: function () {
          return entity
        }
      }
    }).result.then(function (task) {
      
    })
  }
})

var createModalInstanceCtrl = function ($scope, $modalInstance, Ssc, Task) {
  $scope.alerts = []
  $scope.entities = []
  $scope.total = 0

  $scope.ssc = {
    cardNo: '20012345678',
    "name": '',
    balance: 0,
    total: 0
  }
  
  $scope.fetch = function () {
    var filter = { 
      where: {cardNo: $scope.ssc.cardNo}
    }
    
    $scope.alerts = []

    Ssc.findOne({filter: filter}, function (ssc) {
      $scope.ssc = ssc
      
      filter.where = {"status": 'settling'}
      filter.include = ['doctor', 'project']
      filter.order = 'created DESC'
      Task.find({filter: filter}, function (tasks) {
        var total = 0
        angular.forEach(tasks, function (task) {
          task.ssc = ssc
          total += task.cost
        })
        $scope.total = total
        $scope.entities = tasks
      })
    }, function (error) {
      $scope.alerts = [{type: 'danger', msg: error.data.error.message}]
    })
  }
  
  $scope.settle = function () {
    if($scope.ssc.name === '') {
      return $scope.alerts = [{type: 'danger', msg: '没有找到患者，请将医保卡插入读卡器或输入卡号！'}]
    } else if ($scope.entities.length === 0) {
      return $scope.alerts = [{type: 'danger', msg: '没有找到患者的待检单，请确认患者信息！'}]
    }
    async.each($scope.entities, function (task, cb) {
      Task.upsert({id:task.id, "status": 'working', collector: $scope.currentUser.collectorId}, function (t) {
        cb()
      }, cb)
    }, function (err) {
      if(err) {
        return $scope.alerts = [{type: 'danger', msg: err}]
      }
      $scope.alerts = [{type: 'success', msg: '支付成功'}]
      $modalInstance.close($scope.entities)
    })
  } 
  
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }
}

var detailModalInstanceCtrl = function ($scope, $modalInstance, task) {
  $scope.task = task
  $scope.close = function () {
    $modalInstance.dismiss()
  }
}
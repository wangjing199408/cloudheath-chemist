app.
filter("statusText", function () {
  var statusFormatString = {
    "settling": "等待付款",
    "working": "检测中",
    "done": "检测完成"
  }
  
  return function (st) {
    return statusFormatString[st];
  }
})
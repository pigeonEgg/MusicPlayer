function API() {}

//序列化参数
API.prototype.queryString = function (params) {
    var str = '';
    for (var key in params) {
        str += key + '=' + params[key] + '&';
    }

    str = str.slice(0, -1);

    return str;
}

//GET请求
API.prototype.get = function (o) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            o.success(this.responseText);
        }
    }

    var str = this.queryString(o.params);

    xhr.open('GET', o.url + '?' + str, o.isAsync);

    xhr.send();

}

//POST请求
API.prototype.post = function (o) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            o.success(this.responseText);
        }
    }

    xhr.open('POST', o.url, o.isAsync);

    var str = this.queryString(o.params);

    xhr.send(str);
}


// 集成get，post
API.prototype.ajax = function (o) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            o.success(this.responseText);
        }
    }

    var str = this.queryString(o.data);

    xhr.open(o.type.toUpperCase(), o.url + '?' + str, o.isAsync);

    xhr.send();
}

//jsonp跨域请求
API.prototype.jsonp = function (o) {
    /*
        {
            url,
            data,
            success: function () {}
            //后台约定回调函数名称
            jsonpCallback,
        }
    */

    //创建script
    var script = document.createElement('script');

    //全局函数名称, 防止和全局变量同名
    var fnName = 'jsonp' + new Date().getTime();
    window[fnName] = o.success;

    var src = o.url + '?' + this.queryString(o.data) + '&' + o.jsonpCallback + '=' + fnName;

    script.src = src;

    document.body.appendChild(script);

    setTimeout(function () {
        //延迟600毫秒删除script
        script.remove();
    }, 600)

}


var api = new API();
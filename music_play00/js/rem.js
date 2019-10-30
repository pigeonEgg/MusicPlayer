(function ($) {
    //rem: 相对于html元素的字体大小
    //767px: 手机端 100px = 1rem
    //>=768px: 100px = 1rem;

    var id = null;
    function setRem() {
        id = new Date().getTime();

        var fontSize = innerWidth >= 768 ? '100px' : innerWidth / 767 * 100 + 'px';

        var style = $('<style>html{font-size: ' + fontSize + ';}</style>');
        style.attr('id', id);

        $('head').append(style);
    }

    setRem();
    

    //保存所有定时器序号
    var timers = [];

    $(window).on('resize', function () {
       //函数节流，函数防抖
        var timer = setTimeout(function () {
            //清除后续定时器，只保留第一个定时器，减少setRem()函数执行次数
            for (var i = 1; i < timers.length; i++) {
                clearTimeout(timers[i]);
            }

            //移除原本创建的style与元素
            $('#' + id).remove();

            //重设rem
            setRem();

            timers = [];

        }, 500)


        timers.push(timer);
    })

})(jQuery);

	
	function dealSongTime(time) {
	    var second = Math.floor(time / 1000 % 60);
	    second = second >= 10 ? second : '0' + second;
	    var minute = Math.floor(time / 1000 / 60);
	    minute = minute >= 10 ? minute : '0' + minute;
	
	    return minute + ':' + second;
	
	}
	
	audio.onplay = function(){
		$('#St').children().eq(1).css("display","block");
		$('#St').children().eq(0).css("display","none");
		
		// $("#i0").css("display","block");
		// $("#i1").css("display","none");
		$(".point00").css("display","block");
		$('#St').data("play", 1);
	}
	audio.onpause = function(){
		$('#St').children().eq(1).css("display","none");
		$('#St').children().eq(0).css("display","block");
		
		// $("#i0").css("display","block");
		// $("#i1").css("display","none");
		$(".point00").css("display","none");
		$('#St').data("play", 0);
	}
	
	
	
	
	$(function() {
		
		//播放条
		var audio = $('#audio')[0];
		var url = 'https://music.163.com/song/media/outer/url?id=';
		
		console.log(audio);
		var duration = audio.duration;
		var $mask = $('.mask');
		
		// 时间格式
		function formatTime(time) {
			var minutes = Math.floor(time / 60);
			minutes = minutes >= 10 ? minutes : '0' + minutes;
			var seconds = Math.floor(time % 60);
			seconds = seconds >= 10 ? seconds : '0' + seconds;
			return minutes + ':' + seconds;
		}

		// 播放暂停按钮
		$('#St').on('click', function() {
			
			
			if ($(this).data('play') == 0) {
				
				if(index==-1){
					index=0;
					var id = $(".currentList li").eq(index).data("id");
					// console.log("id==>",id);
					audio.src = url + id;
					
					
					$("#songDuration").text(dealSongTime($(".currentList li").eq(index).data("dt")*1000));
					$("#sn01").text($(".currentList li").eq(index).find(".one-text").text());
					$("#songName").text($(".currentList li").eq(index).find(".one-text").text());
					$(".pic img").attr("src",$(".currentList li").eq(index).data("img"));
					
					$(".currentList li").find(".ani").css("visibility", "hidden");
					$(".currentList li").eq(index).find(".ani").css("visibility", "visible");
					
				}
				
				
				audio.play();
				$(this).children().eq(0).css("display", "none");
				$(this).children().eq(1).css("display", "block");
				$(this).data("play", 1);
				$(".pic").css({
					"animation": "rotate 5s linear infinite"
				});
				$(".point00").css("display","block");
			} else {
				audio.pause();
				$(this).children().eq(1).css("display", "none");
				$(this).children().eq(0).css("display", "block");
				$(this).data("play", 0);
				$(".pic").css("animation", "rotate 5s linear infinite paused");
				$(".point00").css("display","none");
			}
			
		})
		
		

		audio.oncanplay = function() {
			console.log('a');
			// duration = this.duration;
			// $("#songDuration").text(dealSongTime(duration*1000));
			var self = this;
			
			var id = $(".currentList li").eq(index).data("id");
			
			$.ajax({
				type:'GET',
				url:'http://www.arthurdon.top:10099/lyric?id=' + id,
				success:function(data){
					console.log(data);
					 $('.words-box').empty();
					  var lyric = data.lrc.lyric.split(/[\n\r]+/);
					  
					  for (var i = 0; i < lyric.length; i++) {
					      var lrc = lyric[i].split(']');
					      //歌词文本
					      var text = lrc[1];
					      // console.log('text ==> ', text);
					  
					      if (text) {
					          //歌词时刻
					          var time = lrc[0].slice(1).split(':');
					  
					          var second = Number(time[0]) * 60 + Number(time[1]);
					  
					          // console.log('time ==> ', time);
					          // console.log('text ==> ', text);
					  
					          var $p = $(`<p data-time="${second}">${text}</p>`);
					  
					          $('.words-box').append($p);
					      }
					  
					  
					  }
					 
				}
			})
			
			
		}


		audio.onended = function() {
			console.log('finished');
			$('#St').children().eq(1).css("display", "none");
			$('#St').children().eq(0).css("display", "block");
			$('#St').data("play", 0);
			$(".pic").css("animation", "rotate 5s linear infinite paused");
			$(".point00").css("display","none");
		}
		// 播放暂停按钮 end


		// 滑块事件

		var maskWidth = $mask.width();
		var progressWidth = $('.progress').width();
		var minLeft = 0;
		var maxLeft = progressWidth - maskWidth;
		var $layer = $('.layer');
		var $progress = $('#progress');
		var isChange = false;
		var currentTime = 0;
		var wordsBoxTop = parseFloat($('.words-box').css('top'));
		//调整播放进度

		//监听音频实时变化(跟着音乐的播放地方改变滑块和激活条的位置和场地)
		//(跟着音乐的播放地方改变滑块和激活条的位置和场地,播放时间songCurrent)
		audio.ontimeupdate = function() {
			
			
			var $ps = $('.words-box>p');
			
			var height = $ps.height();
			for (var i = 0; i < $ps.length; i++) {
			    //获取当前的p和下一个p元素
			    var currentTime = $ps.eq(i).data('time');
			    var nextTime = $ps.eq(i + 1).data('time');
			
			    // console.log('currentTime ==> ', currentTime);
			    // console.log('this.currentTime ==> ', this.currentTime);
			    // console.log('nextTime ==> ', nextTime);
			
			    if (i + 1 == $ps.length) {
			        nextTime = Number.MAX_VALUE;
			    }
			
			    if (this.currentTime >= currentTime && this.currentTime < nextTime) {
			
			        $('.words-box').animate({
			            top: - height * (i-4) + 'px'
			        }, 150)
			
			        if (i - 1 >= 0) {
			            $ps.eq(i - 1).removeClass('sactive');
			        }
			
			        $ps.eq(i).addClass('sactive');
			
			        break;
			    }
			
			}
			
			
			
			
			if (!isChange) {
				currentTime = this.currentTime;
				duration = this.duration;
				// console.log('currentTime ==> ', currentTime);
				// console.log('duration ==> ', duration);
				var percent = currentTime / duration;
				$("#songCurrent").text(dealSongTime(this.currentTime*1000));
				// console.log(dealSongTime(currentTime*1000))
				// console.log(percent);
				$mask.css({
					"left": percent * maxLeft + "px"
				});
				// console.log('---', maxLeft)
				$(".progress-active").css({
					"width": percent * maxLeft + "px"
				});
			}
		}

		//滑块移动
		function move(e) {
			//获取触碰屏幕X坐标
			var x = e.targetTouches[0].pageX;
			// console.log('x ==> ', x);
			var offsetLeft = $(this).offset().left;
			// console.log('offsetLeft ==> ', offsetLeft);

			var left = x - offsetLeft - maskWidth / 2;
			left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;

			$mask.css({
				left: left + 'px'
			})

			//激活进度条的宽度
			var w = x - offsetLeft;
			w = w >= progressWidth ? progressWidth : w <= 0 ? 0 : w;
			$('.progress-active').css({
				width: w + 'px'
			})

			var percent01 = progressWidth / w;
			audio.currentTime = duration / percent01;

		}

		//开始触碰屏幕
		$layer.on('touchstart', function(e) {
			// console.log('e ==> ', e);
			move.call(this, e);
		})

		//触碰移动
		$layer.on('touchmove', function(e) {
			// console.log(e);
			move.call(this, e);
		})
		
		//播放条结束
		
		
		
		// 点击页面切换事件
		$("#list01").on("click",function(){
			$(".page01").css("display","none");
			$(".page02").css("display","block");
			$(".page03").css("display","none");
			
			 // console.log(songsId);
			 // if (previewIds.length == 0) {
			 //     previewIds = previewIds.concat(songsId.slice(startsIndex, endIndex));
			 //     startsIndex = endIndex;
			 //     endIndex += endIndex;
			 // }
			 // 
			 // //加载15首歌曲
			 // if ($(this).data('title') == $('.page02').data('title')) {
			 //     return;
			 // }
			 // 
			 // console.log('a');
			 // $('.page02').empty();
			 // loadSongs(previewIds.length, songsDetail);
			 // 
			 
			
		})
		
		$(".sn_page2").on("click",function(){
			$(".page01").css("display","block");
			$(".page02").css("display","none");
			$(".page03").css("display","none");
		})
		
		$(".ci").on("click",function(){
			
			$(".page01").css("display","none");
			$(".page02").css("display","none");
			$(".page03").css("display","block");
		})
		
		$(".sn_page03").on("click",function(){
			$(".page01").css("display","none");
			$(".page02").css("display","block");
			$(".page03").css("display","none");
		})
		
		
		var songId = [];
		//歌曲详情
		//ajax引入歌曲
		var songDetail = [];
		
		var d = localStorage.songs;
		
		if(d){
			d = JSON.parse(d);
			songDetail = d.playlist.tracks.concat();
			
			//保存歌曲id
			for(var i = 0; i<d.privileges.length;i++){
				songId.push(d.privileges[i].id);
			}
			$('#songNum01').text(songId.length);
			
			loadSongs(15,songDetail);
		}else{
			
			$.ajax({
				type:'GET',
				url:'http://www.arthurdon.top:10099/top/list?idx=1',
				success:function(data){
					console.log("data==>",data);
					
					localStorage.setItem('songs',JSON.stringify(data))
					
					songDetail = data.playlist.tracks.concat();
					
					//保存歌曲id
					
					for(var i = 0;i<data.privileges.length;i++){
						songId.push(data.privileges[i].id);
					}
					
					$('.local-song').text(songId.length);
					
					songDetail(15,songDetail);
										
				}
			})			
		}
		
		var previewIds = [];
		var startsIndex = 0;
		var endIndex = 15;
		//初始化加载歌曲
		//加载page02的歌曲列表
		function loadSongs(length,data){
			for(var i = 0;i<length;i++){
				
				var $li = $(`<li data-id="${data[i].id}" name="0" data-img="${data[i].al.picUrl}" data-dt="${data[i].dt / 1000}">
					   <div class="song-list-one">
							<div class="song-list-one-img">	
								<img class="auto-img" src="${data[i].al.picUrl}" />
							</div>
							<div class="info">
								<div class="one-text">
									${data[i].name}
								</div>
								
							</div>
							<div class="s-time">
								<div class="dt">
									${dealSongTime(data[i].dt)}
								</div>
								<div class="ani">
									<div class="point00">
										
										<div class="point01"></div>
										
									</div>
								</div>
								
							</div>
							
					    </div>
					</li>`); 
					
					var sg = [];
					
					for(var j = 0;j< data[i].ar.length;j++){
						 sg.push(data[i].ar[j].name);
					}
					
					var $singers = $(`<div class="two-text">${sg.join(' / ')}</div>`);
					
					$li.find('.info').append($singers);
					
					$('.currentList').append($li);	
					
					// console.log( $li);
			}		
		}
		
		var $animate = null;
		var index = -1;
		
		// 点击li
		$(".currentList").on("click","li",function(){
			
			if($(this).index()==index){
				console.log($(this).index(),index)
				console.log($(this).attr('name')== 0);
				
				if($(this).attr('name')== 0){
					$(this).attr('name', 1);
					
					// $('#St').children().eq(0).css("display","block");
					// $('#St').children().eq(1).css("display","none");
					
					// $("#i0").css("display","block");
					// $("#i1").css("display","none");
					
					// $('#St').data("play", 0);
					// console.log($('#St').data("play"))
					audio.pause();
					
					
					// console.log($("#St img"));
				}else{
					$(this).attr('name', 0);
					
					// $('#St').children().eq(0).css("display","none");
					// $('#St').children().eq(1).css("display","block");
					
					// $('#St').data("play", 1);
					console.log($('#St').data("play"))
					audio.play();
					
					
				}
			}else{
			
			var id = $(this).data("id");
			console.log("id==>",id);
			audio.src = url + id;
			audio.play();
			
			console.log($(this).data("img"));
			$(".pic img").attr("src",$(this).data("img"));
			
			
			}
			
			$("#songDuration").text(dealSongTime($(this).data("dt")*1000));
			$("#sn01").text($(this).find(".one-text").text());
			$("#songName").text($(this).find(".one-text").text());
			
			
			$('#St').children().eq(0).css("display", "none");
			$('#St').children().eq(1).css("display", "block");
			$('#St').data("play", 1);
			
			//动画出现与消失
			$(".currentList li").find(".ani").css("visibility", "hidden");
			$(this).find(".ani").css("visibility", "visible");
			
			
			$(".pic").css({
				"animation": "rotate 5s linear infinite"
			});
			$(".point00").css("display","block");
			
			// if($(this).attr("name")==0){
			// 	$(this).attr("name",1);
			// 	audio.play();
			// }
			index = $(this).index();
			// console.log('index==',index);
		})
		
		$(".beforeS").on("click",function(){
			if(index==0||index==-1){
				index=14;
			}else{
				index = index-1;
			}
			
			var id = $(".currentList li").eq(index).data("id");
			$("#songDuration").text(dealSongTime($(".currentList li").eq(index).data("dt")*1000));
			$("#sn01").text($(".currentList li").eq(index).find(".one-text").text());
			$("#songName").text($(".currentList li").eq(index).find(".one-text").text());
			$(".pic img").attr("src",$(".currentList li").eq(index).data("img"));
			
			$(".currentList li").find(".ani").css("visibility", "hidden");
			$(".currentList li").eq(index).find(".ani").css("visibility", "visible");
			
			audio.src = url + id;
			audio.play();
			$('#St').children().eq(0).css("display", "none");
			$('#St').children().eq(1).css("display", "block");
			$('#St').data("play", 1);
			$(".pic").css({
				"animation": "rotate 5s linear infinite"
			});
			$(".point00").css("display","block");
			
			
		})
		
		$(".nextS").on("click",function(){
			if(index==14||index==-1){
				index=0;
			}else{
				index = index+1;
			}
			
			var id = $(".currentList li").eq(index).data("id");
			$("#songDuration").text(dealSongTime($(".currentList li").eq(index).data("dt")*1000));
			$("#sn01").text($(".currentList li").eq(index).find(".one-text").text());
			$("#songName").text($(".currentList li").eq(index).find(".one-text").text());
			$(".pic img").attr("src",$(".currentList li").eq(index).data("img"));
			
			$(".currentList li").find(".ani").css("visibility", "hidden");
			$(".currentList li").eq(index).find(".ani").css("visibility", "visible");
			
			audio.src = url + id;
			audio.play();
			$('#St').children().eq(0).css("display", "none");
			$('#St').children().eq(1).css("display", "block");
			$('#St').data("play", 1);
			$(".pic").css({
				"animation": "rotate 5s linear infinite"
			});
			$(".point00").css("display","block");
			
			
		})
		
	})

	



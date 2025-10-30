/**
 * ロード
 */
$(function(){
	'use strict';
	
	$('#game').hide();
	$('#win').hide();
	$('#lose').hide();
	$('#index').show();
	
	
	var clickevent = 'click';
	
	$('#easy').on(clickevent, function(){
		event.easy();
	});
	
	$('#normal').on(clickevent, function(){
		event.normal();
	});
	
	$('#hard').on(clickevent, function(){
		event.hard();
	});
	
	$('#veryhard').on(clickevent, function(){
		event.veryhard();
	});
	
	$('#next').on(clickevent, function(){
		event.next();
	});
	
	$('.init').on(clickevent, function(){
		event.init();
	});
});

/**
 * 画面イベント
 */
var event = new function(){
	'use strict';
	
	// 定数
	var 問題数 = 30;
	var 回答中 = 1;
	var 答え表示中 = 2;
	
	// 変数
	var 一問時間 = 0;
	var 何問目 = 0;
	var 一歩距離 = 0;
	
	var 分子_第一項範囲;
	var 分母_第二項範囲;
	
	var 約数_範囲;
	
	var カービ移動回数 = 0;
	var デデデ移動回数 = 0;
	
	var 開始時間;
	
	/**
	 * 音楽開始
	 */
	this.startMusic = function(){
		var audio = $('#audio').get(0);
		audio.play();
	};

	/**
	 * 音楽終了
	 */
	this.stopMusic = function(){
		var audio = $('#audio').get(0);
		audio.pause();
		audio.currentTime = 0;
	};
	
	
	/**
	 * かんたん
	 */
	this.easy = function(){
		event.startMusic();
		一問時間 = 4 * 1000;
		
		分子_第一項範囲 = [1, 3];
		分母_第二項範囲 = [2, 6];
		約数_範囲 = [2, 5];
		
		event.countDown();
	};
	
	/**
	 * ふつう
	 */
	this.normal = function(){
		event.startMusic();
		一問時間 = 9 * 1000;
		
		分子_第一項範囲 = [1, 5];
		分母_第二項範囲 = [2, 9];
		約数_範囲 = [2, 9];
		
		event.countDown();
	};

	/**
	 * むずかしい
	 */
	this.hard = function(){	
		event.startMusic();
		一問時間 = 12 * 1000;
		
		分子_第一項範囲 = [2, 5];
		分母_第二項範囲 = [4, 9];
		約数_範囲 = [5, 17];
		
		event.countDown();
	};
	
	/**
	 * げきむず
	 */
	this.veryhard = function(){
		event.startMusic();
		一問時間 = 3 * 1000;
		
		分子_第一項範囲 = [2, 5];
		分母_第二項範囲 = [6, 13];
		約数_範囲 = [7, 17];
		
		event.countDown();
	};
	
	
	/**
	 * カウントダウン開始
	 */
	this.countDown = function() {
		$('#index').hide();
		$('#game').show();
		$('#next').hide();
		$('#answer').hide();
		$('#game-text').show();
		
		何問目 = 0;
		カービ移動回数 = 0;
		デデデ移動回数 = 0;
		
		開始時間 = new Date();
		
		// 移動距離計算
		一歩距離 = ($('body').get(0).clientWidth - 50) / (問題数 - 1);
		$('#race-kirby').css('left', 0);
		$('#race-dedede').css('left', 0);
		
		var count = 3;
		var text = $('#game-text');
		text.html(count);
		var id = setInterval(function(){
			count--;
			if(count == 0) {
				clearInterval(id);
				event.takeMondai();
				// デデデ走り出す！
				event.runDedede();
			}else {
				text.html(count);
			}
		},1000);
	};
	
	
	/**
	 * 問題を出題する
	 */
	this.takeMondai = function() {
		$('#next').show();
		$('#answer').hide();

		何問目++;
		
		var num1 = 0;
		var num2 = 0;
		
		// 分母分子のランダム採番
		while(true) {
			num1 = Math.floor(Math.random() * (分子_第一項範囲[1] - 分子_第一項範囲[0])) + 分子_第一項範囲[0];
			num2 = Math.floor(Math.random() * (分母_第二項範囲[1] - 分母_第二項範囲[0])) + 分母_第二項範囲[0];
			if(num1 < num2) {
				break;
			}
		}
		
		// 発行の時点で約分できないか確認
		var v = this.reduction(num1, num2);
		var yakusu = Math.floor(Math.random() * (約数_範囲[1] - 約数_範囲[0])) + 約数_範囲[0];
		
		num1 = v[0] * yakusu;
		num2 = v[1] * yakusu;
		
		$('#game-text').html(
		  "<table align='center' style='text-align:center;'><tr><td style='border-bottom:10px solid;'><span style='padding:0px 30px 0px 30px;'>" + num1 +
		  "</span></td></tr><tr><td><span style='padding:0px 30px 0px 30px;'>" + num2 +
		  "</span></td></tr></table>"
		);
		
		$('#answer').html(
		  "<table align='center' style='text-align:center;'><tr><td style='border-bottom:10px solid;'><span style='padding:0px 30px 0px 30px;'>" + v[0] +
		  "</span></td></tr><tr><td><span style='padding:0px 30px 0px 30px;'>" + v[1] +
		  "</span></td></tr></table>"
		);
	};
	
	
	/**
	 * つぎへ
	 */
	this.next = function(){

		$('#game-text').hide();
		$('#answer').show();
		$('#next').hide();
		
		// カービィ移動
		event.moveKirby();
		
		// ０．５秒で自動的に次の問題へ
		setTimeout(function(){
			
			$('#game-text').show();
			$('#answer').hide();
			$('#next').show();
			
			// カービゴール
			if(何問目 >= 問題数) {

				clearInterval(dededeAnimeId);
				
				if(カービ移動回数 >= デデデ移動回数) {
					event.win();
				}else{
					event.lose();
				}
				return;
			}
		
			event.takeMondai();
			
		}, 500);
	};
	
	
	/**
	 * カービィ前へ
	 */
	this.moveKirby = function(){
	
		event.moveTargetNext($('#race-kirby'), カービ移動回数, 一歩距離);
		カービ移動回数++;
	};
	
	// デデデアニメのID（時間数以外でクリアするため）
	var dededeAnimeId;
	/**
	 * デデデ走り出す
	 */
	this.runDedede = function(){
		
		dededeAnimeId = setInterval(function(){
			
			if(デデデ移動回数 >= 問題数) {
				clearInterval(dededeAnimeId);
				return;
			}
			
			if(デデデ移動回数 >= カービ移動回数 - 3) {
				// 通常移動
				event.moveTargetNext($('#race-dedede'), デデデ移動回数, 一歩距離);
				デデデ移動回数++;
			} else {
				// スローカーブースト
				event.moveTargetNext($('#race-dedede'), デデデ移動回数, 一歩距離 * 2);
				デデデ移動回数++;
				デデデ移動回数++;
			}
		},一問時間);
	};
	
	/**
	 * 対象を移動させる
	 */
	this.moveTargetNext = function(target, 移動回数, 進む距離){
		
		var cnt = 1;
		var moveAnimeId = setInterval(function(){
			
			var position = (移動回数 * 一歩距離) + (進む距離 / 50) * cnt;
			target.css('left', position);
			
			if(cnt >= 50) {
				clearInterval(moveAnimeId);
				return;
			}
			
			cnt++;
			
		}, 10);
	};
	
	
	/**
	 * かち
	 */
	this.win = function(){
		clearInterval(dededeAnimeId);
		event.stopMusic();
		event.showTime();
		var audio = $('#audio-win').get(0);
		audio.play();
		$('#game').hide();
		$('#win').show();
	};
	
	/**
	 * まけ
	 */
	this.lose = function(){
		clearInterval(dededeAnimeId);
		event.stopMusic();
		event.showTime();
		var audio = $('#audio-lose').get(0);
		audio.play();
		$('#game').hide();
		$('#lose').show();
	};
	
	/**
	 * さいしょへ戻る
	 */
	this.init = function(){
		$('#game').hide();
		$('#win').hide();
		$('#lose').hide();
		$('#index').show();
	};
	
	/**
	 * 時間表示
	 */
	this.showTime = function(){
		// 時間計算
		var 終了時間 = new Date();
		var TimeDefference = 終了時間.getTime() - 開始時間.getTime()

		var Hour = TimeDefference / (1000 * 60 * 60);    
		//「時間」の部分を「Hour」に代入
		var Minute = (Hour - Math.floor(Hour)) * 60;
		//「分」の部分をMinuteに代入
		var Second = (Minute - Math.floor(Minute)) * 60;
		//TimeDefference = (('00' + Math.floor(Hour)).slice(-2) + ':' + ('00' + Math.floor(Minute)).slice(-2) + ':' + ('00' + Math.floor(Second)).slice(-2));
		TimeDefference = (('00' + Math.floor(Minute)).slice(-2) + ':' + ('00' + Math.floor(Second)).slice(-2));
		
		$('.time').html(TimeDefference);
	};
	
	
	// 二つの値を約分する 
	this.reduction = function(value1,value2) {

	        // 小数以下の桁数取得
	    const digit1 = this.getdecimalPrecision(value1);
	    const digit2 = this.getdecimalPrecision(value2);
	    if( digit1 === false || digit2 === false ) return false;

	        // 符号取得
	    const sign = [Math.sign( value1 ),Math.sign( value2 )];

	        // 整数化
	    const digit = 10 ** Math.max( digit1 , digit2 );
	    const v1 = Math.abs( Math.round( value1 * digit ) );
	    const v2 = Math.abs( Math.round( value2 * digit ) );

	        // 公倍数を求める
	    const gcd = this.greatestCommonDivisor2( v1 , v2 );

	        // 約分して返す
	    return [ Math.round( v1 / gcd ) * sign[0] , Math.round( v2 / gcd ) * sign[1] ];
	};
	
	// 最大公約数を求める https://note.affi-sapo-sv.com/js-greatest-common-divisor.php
	this.greatestCommonDivisor2 = function( value1 , value2 ) {
	    let r , a = value1 , b = value2;

	    do{
	        r = a % b;
	        a = b;b = r;
	    }while( r !== 0 );

	    return a;
	};
	
	// 小数部の桁数を求める https://note.affi-sapo-sv.com/js-get-fractional-digits.php
	this.getdecimalPrecision = function(number, digits) {
	            // 数値文字列かどうかのチェック
	    if( typeof number !== "number" ) return false;

	    const f = number.toFixed(digits).split(".")[1];
	    if( f === undefined || f.length === 0) return 0;

	        // 後方の"0"を取り除いた桁数取得
	    return f.length - ["1",...f].reverse().findIndex( e=>e!="0");

	};
	
};

import request from '@/utils/request'
import { getTokenQN } from '@/api/storage'

export function qiniu_config(){
	var _this = {
	    localStorageKey:"_ght_qiniu_token",
		expiresKey:"_ght_qiniu_token_expires",
		getUploadFilePath:function(res){
			return _this.qiniuDomain()+"/"+res.key;
		},
		getDeadline:function (input) {
			if(!input){
				return;
			}
			input = input.substring(input.lastIndexOf(':')+1);
			
	        var output = "";
	        var chr1, chr2, chr3;
	        var enc1, enc2, enc3, enc4;
	        var i = 0;
	        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
	        while (i < input.length) {
	            enc1 = _keyStr.indexOf(input.charAt(i++));
	            enc2 = _keyStr.indexOf(input.charAt(i++));
	            enc3 = _keyStr.indexOf(input.charAt(i++));
	            enc4 = _keyStr.indexOf(input.charAt(i++));
	            chr1 = (enc1 << 2) | (enc2 >> 4);
	            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	            chr3 = ((enc3 & 3) << 6) | enc4;
	            output = output + String.fromCharCode(chr1);
	            if (enc3 != 64) {
	                output = output + String.fromCharCode(chr2);
	            }
	            if (enc4 != 64) {
	                output = output + String.fromCharCode(chr3);
	            }
	        }
	        output = eval('(' + output + ')')
	        return output.deadline-600;
	    },
		getToken:function(){
			var _token = localStorage.getItem(_this.localStorageKey);
			var expires = parseInt(localStorage.getItem(_this.expiresKey));
			let timestamp = parseInt(new Date().getTime()/1000);
			if(!_token||!expires||(timestamp>=expires)){
				_token=null;
				localStorage.setItem(_this.localStorageKey,"");
				getTokenQN().then(response => {
					var _token = response.data.data
					//保存token
					localStorage.setItem(_this.localStorageKey,_token)
					//过期时间
					localStorage.setItem(_this.expiresKey,_this.getDeadline(_token));
				})
			}
			return _token;
		},
		config:{
				
				//config.useCdnDomain: 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
				//config.disableStatisticsReport: 是否禁用日志报告，为布尔值，默认为false。
				//config.region: 选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域
				//config.retryCount: 上传自动重试次数（整体重试次数，而不是某个分片的重试次数）；默认 3 次（即上传失败后最多重试两次）；
				//					  目前仅在上传过程中产生 599 内部错误时生效，但是未来很可能会扩展为支持更多的情况。
				//config.concurrentRequestLimit: 分片上传的并发请求量，number，默认为3；因为浏览器本身也会限制最大并发量，
				//								所以最大并发量与浏览器有关。
				//config.checkByMD5: 是否开启 MD5 校验，为布尔值；在断点续传时，开启 MD5 校验会将已上传的分片与当前分片进行 MD5 值比对，
				//					若不一致，则重传该分片，避免使用错误的分片。读取分片内容并计算 MD5 需要花费一定的时间，
				//					因此会稍微增加断点续传时的耗时，默认为 false，不开启。
		},
		putExtra:{
			  fname: "",
			  params: {},
			  mimeType: ["image/png", "image/jpeg", "image/gif" , "image/jpg"] || null
			//fname: string，文件原文件名
				//params: object，用来放置自定义变量
				//mimeType: null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；
				//			限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
			},
		callBack:{
			  next(res){
				  //next: 接收上传进度信息，res 参数是一个带有 total 字段的 object，包含loaded、total、percent三个属性，提供上传进度信息。
				  //total.loaded: number，已上传大小，单位为字节。
				  //total.total: number，本次上传的总量控制信息，单位为字节，注意这里的 total 跟文件大小并不一致。
				  //total.percent: number，当前上传进度，范围：0～100。
			  },
			  error(err){
			    // error: 上传错误后触发，当不是 xhr 请求错误时，会把当前错误产生原因直接抛出，诸如 JSON 解析异常等；当产生 xhr 请求错误时，参数 err 为一个包含 code、message、isRequestError 三个属性的 object：
				// err.isRequestError: 用于区分是否 xhr 请求错误；当 xhr 请求出现错误并且后端通过 HTTP 状态码返回了错误信息时，该参数为 true；否则为 undefined 。
				// err.reqId: string，xhr请求错误的 X-Reqid。
				// err.code: number，请求错误状态码，只有在 err.isRequestError 为 true 的时候才有效，可查阅码值对应说明。
				// err.message: string，错误信息，包含错误码，当后端返回提示信息时也会有相应的错误信息。
			  }, 
			  complete(res){
				  //complete: 接收上传完成后的后端返回信息，res 参数为一个 object， 为上传成功后后端返回的信息，具体返回结构取决于后端sdk的配置，可参考上传策略。
			  }
		},
		uploadFile:function(file,key,callBack){
			
			//file: Blob 对象，上传的文件
			//key: 文件资源名
			//token: 上传验证信息，前端通过接口请求后端获得
			//config: object
			var interId = setInterval(function(){
					var _token = _this.getToken();
					if(_token){
						clearInterval(interId);
						//开始上传
						var observable =  qiniu.upload(file, key||null, _this.getToken(), _this.putExtra,_this.config);
						observable.subscribe(callBack)
					}
				},50)
		},
		unsubscribe:function(){
			//_this.subscription.unsubscribe() // 上传取消
		}
	}
	return _this;
}

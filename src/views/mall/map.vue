<template>
	<div id="app">
		<div id="allmap" ref="allmap"></div>
		<!--<el-button type="primary" @click="createDataMap" class="btn">确定</el-button>-->
	</div>
</template>

<script>
	export default {
		name: 'App',
		data(){
				return {
					lng:120,
					lat:39
				}
			},
		props:{
			addressmap:{
				type:String,
				required:true
			}
			
		},
		methods: {
			 parentHandleclick(e) {
        console.log(e)
     },
			map() {
				console.log(this.addressmap);
				var _this = this ; 
				var map = new BMap.Map("allmap");
				var point = new BMap.Point(116.404, 39.915);
				map.centerAndZoom(decodeURI(this.addressmap), 17);
				function showInfo(e) {
					var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建点
					map.clearOverlays(marker);   
					map.addOverlay(marker); 
					_this.createDataMapmsg(e.point.lng,e.point.lat);
					
				}
				map.addEventListener("click", showInfo);
				map.enableScrollWheelZoom();
				map.enableInertialDragging();
				map.enableContinuousZoom();
				var size = new BMap.Size(10, 20);
				map.addControl(new BMap.CityListControl({
					anchor: BMAP_ANCHOR_TOP_LEFT,
					offset: size,
					// 切换城市之间事件
					// onChangeBefore: function(){
					//    alert('before');
					// },
					// 切换城市之后事件
					// onChangeAfter:function(){
					//   alert('after');
					// }
				}));
			},
			createDataMapmsg(lng,lat){
				this.$emit('createDataMapmsg',lng+","+lat);
			}

		},
		mounted() {
			this.map()

		}
	}
</script>

<style scoped>
	#app {}
	
	#allmap {
		height: 500px;
		overflow: hidden;
	}
	.btn{
		position: fixed;
		right: 50px;
		bottom: 100px;
		
	}
</style>
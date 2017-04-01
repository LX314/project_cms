(function(global) {
	var DATA = global.VM.data;
	DATA.infos = [];

	var INDEX = new Vue(global.VM);
	DATA.infos = [
		{
			color: 'aqua',
			icon:  'ion ion-ios-gear-outline',
			name:  '图片推荐位',
			data:  '90,540'
		},
		{
			color: 'red',
			icon:  'fa fa-google-plus',
			name:  '文本推荐位',
			data:  '41,410'
		},
		{
			color: 'green',
			icon:  'ion ion-ios-cart-outline',
			name:  '落地页',
			data:  '760'
		}
	];
}(this));

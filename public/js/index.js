(function(global) {
	var DATA = global.VM.data;
	DATA.infos = [];

	var INDEX = new Vue(global.VM);
	DATA.infos = [
		{
			color: 'aqua',
			icon:  'ion ion-ios-gear-outline',
			name:  'CPU Traffic',
			data:  '90<small>%</small>'
		},
		{
			color: 'red',
			icon:  'fa fa-google-plus',
			name:  'Likes',
			data:  '41,410'
		},
		{
			color: 'green',
			icon:  'ion ion-ios-cart-outline',
			name:  'Sales',
			data:  '760'
		}
	];
}(this));

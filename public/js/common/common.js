(function(global) {

if (!global.CMS) {
	global.VM = {
		el: '#vApp',
		data: {
			user: {}
		}
	};
	global.CMS = {
		init: function() {
			$.ajax({
				url: '/api/user/getUserInfo'
			})
			.done(function(o) {
				console.log(o);
				if (o.code === '0000') {
					global.VM.data.user = o.data;
				}
			});
		}
	};
	global.CMS.init();
}

}(this));
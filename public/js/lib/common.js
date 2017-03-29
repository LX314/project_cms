(function(MJJS, window) {
	MJJS.server.api = '/api';
	MJJS.define('MJJS.common', {
		init: function() {
		}
	});
	MJJS.define('MJJS.http', {
		ajax: function(type, url, data, success, error) {
			var _data, _success, _error;
			if (typeof(data)==='function') {
				_data    = {};
				_success = data;
				_error   = success;
			} else {
				_data    = data;
				_success = success;
				_error   = error;
			}
			$.ajax({
				url: MJJS.server.api + (url || ''),
				data: _data,
				type: type,
				success: function(d) {
					if (d.code === '0') {
						if (typeof(_success)==='function') _success(d.data);
					} else if (d.code === '4000004' || d.code === '4000008' || d.code === '4000009') {
						MJJS.page.dialog.alert(d.msg, function() {
							window.location.href = '/logout';
						});
					} else {
						if (typeof(_error)==='function') _error(d);
					}
				},
				error: function(err) {
					if (typeof(_error)==='function') _error(err);
				}
			});
		},
		get: function(url, data, success, error) {
			this.ajax('get', url, data, success, error);
		},
		post: function(url, data, success, error) {
			this.ajax('post', url, data, success, error);
		}
	});
	MJJS.define('MJJS.header', {
		userInfo: {},
		getUser: function(callback) {
			var me = this;
			MJJS.http.get('/loginUser/info', function(data) {
				me.userInfo = data;
				me.permit(data);
				$('#username').parent().attr({ title: data.userName });
				if ($.isFunction(me.load) && me._load) {
					me.load(data);
					me._load = false;
				} else {
					$.isFunction(callback) && callback(data);
				}
				$('#loginName').html(data.loginName);
			}, function(err) {
				console.log(err);
			})
		}
	});

	MJJS.common.init();
})(MJJS, window);
(function(MJJS, window) {
	var opportunityView = {
		init: function() {
			this._init();
		},
		_init: function(){
			var n  = $('#createDate').html();
			if(!n){
				var formatTime = new Date(n).format('yyyy-mm-dd');
				$('#createDate').html(formatTime);	
			}
		}
	};
	opportunityView.init();
})(MJJS, window);
(function(MJJS, window) {
	var API = {
		read: '/clue/info',							//线索信息接口地址
		submit: '/clue/add',						//线索信息添加地址
		distractToList: '/employee/user'			//分配至下拉列表
	};
	var hrefEdit = window.location.href.indexOf('edit') > -1;       // 判断页面路径为编辑 true：编辑 false: 创建
	
	var customerCode = location.href.replace(/\S+[edit]\/|\?\S+/g, '');
	if(hrefEdit){
		API.submit = '/clue/update';
	}
	var _vForm,version,industry1,industry2,updateSex;
	var clueAdd = {
		init: function() {
			this.$datePirck = $('input[name="date"]');
			this._init();
			//MJJS.ui.icheck('.icheck input', 'blue');
			this.datePirck();
			this.validator();
			this.address();
			this.selectList();
			this.industry();
		},
		_init: function() {
			var me = this;
			var _date 				=  new Date().format('yyyy-mm-dd');
			this.$clientName  		= $('[name=clientNameXSUpdate]');
			this.$contactName 		= $('[name=contactName]');
			this.$gender      		= $('#gender');
			this.$contactTel  		= $('[name=contactTelXSUpdate]');
			this.$industryOne 		= $('select[name=industryOne]');
			this.$industryTwo 		= $('select[name=industryTwo]');
			this.$address     		= $('input[name=address]');
			this.$Email       		= $('input[name=Email]');
			this.$intentPro   		= $('#intentPro');
			this.$distractStatus	= $('#distractStatus');
			this.$createDate  		= $('[name=createTime]');
			this.$emergence  		= $('#emergence');
			this.$contactQQ   		= $('[name=contactQQ]');
			this.$fixedTel 			= $('[name=fixedTel]');
			this.$discribe    		= $('textarea[name=describe]');
			this.$distractTo  		= $('select[name=distractTo]')
			this.$datePirck.val(_date);
			if (hrefEdit){
					$('.noStatic').show();
					$('.static').hide();
					this.getInfo(function (o) {
						customerCode = o.customerCode;
						industry1 = o.industry;
						industry2 = o.industrySecond;
						clueAdd.writeInfo(o);
				})
			}else{
				$('.noStatic').hide();
				$('.static').show();	
			}	
		},
		selectList: function(){
			MJJS.http.get(API.distractToList,function(o) {
				var b = [];
				b.push('<option  value="">请选择</option>');
				for(var i = 0;i<o.length;i++){
					b.push('<option value='+o[i].value+'>'+o[i].label+'</option>');
				} 
				$('[name=distractTo]').html(b.join(''));
			}, function(err) {
				
			});
		},
		getInfo: function (callback) {
			MJJS.http.get(API.read, { customerCode: customerCode }, function(o) {
				$.isFunction(callback) && callback(o)
			}, function(err) {
				
			});
		},
		writeInfo: function (o) {
			var _creatTime 			= new Date(o.createTime).format('yyyy-mm-dd');
			var productIdArr 		= o.intentionProducts;
			window.xscustomerCode 	= o.customerCode;
			version 				= o.version;
			this.$clientName.val(o.customerName);								//客户名称
			this.$contactName.val(o.contacter);									//联系人
			this.$gender.val(o.sexLabel);										//性别				
			this.$contactTel.val(o.mobile);										//联系电话
			this.$industryOne.val(o.industry);									//一级行业
			this.$industryTwo.val(o.industrySecond);							//二级行业
			this.$address.val(o.address);										//地址
			this.$Email.val(o.email);											//email
			this.$intentPro.val(o.intentionProductsLabel);						//意向产品
			this.$distractStatus.val(o.statusLabel);							//分配状态
			this.$createDate.val(_creatTime);									//创建时间
			this.$emergence.val(o.isAccelerate);								//是否加急
			this.$contactQQ.val(o.qq);											//qq
			this.$discribe.val(o.remark);										//备注
			this.$fixedTel.val(o.phone);										//固定电话
			this.$distractTo.val(o.clueBelonger);								//分配至
			//性别1,2分别代表男,女
			if(o.sex===2){
				$('input[name="gender"]').eq(1).attr('checked', 'checked');
			}
			$('.radio').each(function(){
				$(this).find('[name="gender"]').on('click',function(){
				$(this).siblings().find('input[name="gender"]').removeAttr('checked','checked');
					updateSex = $(this).val();
				});
			});
			//是否加急
			if(o.isAccelerate="☆"){
				$('input[name="emergence"]').eq(1).attr('checked', 'checked');
			}else{
				$('input[name="emergence"]').eq(0).attr('checked', 'checked');		
			}
			for(var i=0;i<productIdArr.length;i++){
				if(productIdArr[i]) $('input[name=intentPro][value='+ productIdArr[i] +']').attr('checked',true);
			}
			//分配至
			//区域选择联动触发
			$('select[name=province] option[value='+o.province+']').attr('selected', true);
			$('select[name=city] option[value='+o.city+']').attr('selected', true);
			$('select[name=area] option[value='+o.county+']').attr('selected', true);
			// 一二级行业改动触发
			if(industry1){
				$('select[name=industryOne] option[value='+industry1+']').attr('selected', true);
				$('select[name=industryOne]').change();
				if(industry2){
					$('select[name=industryTwo] option[value='+industry2+']').attr('selected', true);
					$('select[name=industryTwo]').change();
				}
			}
		},
		datePirck:function(){  
			MJJS.ui.timepicker('.d2d', {
				format: "yyyy-mm-dd",
				showMeridian: true,
				startView:"month",
				startDate: new Date(),
				autoclose: true,
				callback: function(o) {	
					//console.log(o.target.value)		
				}
			});
		},
		// 表单验证
		validator: function() {
			var me = this;
			var obj = MJJS.form.valid.filter(['clientNameXS','contactTelXS','contactName','clientNameXSUpdate','contactTelXSUpdate','contactQQ','Email','fixedTel','describe']);
			MJJS.form.validator('#clueAdd', obj, {
				success: function(e) {
					e.preventDefault();
					var o = MJJS.form.valid.getData('#clueAdd', ['clientNameXS', 'contactTelXS', 'contactName','contactTelXSUpdate','clientNameXSUpdate', 'gender', 'contactQQ', 'Email', 'fixedTel','province','city','area', 'address', 'industryOne', 'industryTwo', 'emergence', 'distractTo', 'intentPro', 'describe']);
					
					var modifyInfor = {
						customerName:o.clientNameXS,				//客户名称
						contacter:o.contactName,					//联系人
						mobile:o.contactTelXS,						//联系电话
						province:o.province,						//省
						city:o.city,								//市
						county:o.area,								//区
						sex:o.gender,								//性别
						industry:o.industryOne,						//一级行业
						industrySecond:o.industryTwo,				//二级行业
						address:o.address,							//地址
						email:o.Email,								//邮箱
						phone:o.fixedTel,							//座机
						intensionProducts:o.intentPro,				//意向产品
						clueUserCode:o.distractTo,					//分配至
						qq:o.contactQQ,								//QQ
						isAccelerate:o.emergence,					//加急
						//expectSignTime:o.date,					//预计成单时间
						remark:o.describe,							//备注
						version:o.version, 							//数据版本
					}
					if(hrefEdit){
						modifyInfor.customerName 	= o.clientNameXSUpdate,
						modifyInfor.mobile 			= o.contactTelXSUpdate,
						modifyInfor.customerCode	= customerCode,
						modifyInfor.gender 			= updateSex,
						modifyInfor.version 		= version
					}
					me.postSubmit(modifyInfor);
				},
				init: function(data) {
					_vForm = data;
				}
			});
		},
		postSubmit: function (data) {
			MJJS.http.post(API.submit,data,function (o) {
				var message = '线索创建成功';
				if(hrefEdit) message = '线索编辑成功'
				MJJS.page.dialog.alert(message,function () {
					window.location.href = '/clue'
				});
			},function (err) {
				MJJS.page.dialog.alert(err.msg,function () {
						
				});
			});
		},
		address: function() {
			MJJS.data.area.set('[name=province]', {
				city:        '[name=city]',
				nation:      '[name=area]',
				address:     '[name=address]',
				valueKey:    'name',
				nameKey:     'name',
				callback:    function(o) {
				},
				load: function(o) {
				}
			});
		},
		industry: function() {
			MJJS.data.cascade.set('[name=industryOne]', {
				defName:   '选择客户一级行业',
				defValue:  '',
				defName2:  '选择客户二级行业',
				defValue2: '',
				type:     'industry',
				level2:   '[name=industryTwo]',
				valueKey: 'code',
				nameKey:  'name',
				callback: function(o) {
				},
				load: function(o) {
					
				}
			});
		}
	};
	clueAdd.init();
})(MJJS, window);
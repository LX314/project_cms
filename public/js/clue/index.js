(function(MJJS, window) {
	var API = {
		list: '/api/clue/list',								//线索列表
		opporDistribute: '/clue/assign',					//分配线索
		oppordiscard: '/clue/discard', 						//废弃线索
		upgrade: '/clue/upgrade',							//升级线索
		opporReport: '/api/clue/export',					//导出线索列表
		searchList: '/api/employee/user/list'				//分配线索查询列表
	};
	var distributeName = '';  													// 存储弹出框中输入的查询信息
	var checkedStaffNum = '';  													// 弹出框中选中的员工编号
	var cluePar = [],_table,_table2,_vForm1,_vForm2,customerCode,searchVal,version,userCrmId;		// 线索列表传递的参数
	var clueList = {
		init: function() {
			nicheAuth = MJJS.header.userInfo.nicheAuth;
			this._init()
			this.filter();
			this.distributeValidator();								//分配线索表单验证
			this.discardValidator();								//废弃线索表单验证
		},
		_init: function () {
			this.$clueDistrModel 	= $('#clueDistr');    			// 商机分配模态框
			this.$clueDeleteModel 	= $('#clueDelete');     		// 废弃线索模态框
			this.$distributeSearBtn = $('#distributeSear'); 		// 弹出框查询按钮
			this.$distributeName 	= $('#distributeName');
			//this.$btnSubmitBtn 		= $('#btnSubmitBtn');
			this.$clientName  		= $('#clueDistr #clientName');
			this.$clientID    		= $('#clueDistr #clientID');
			this.$contacter 		= $('#clueDistr #contactName');
			this.$contactTel  		= $('#clueDistr #contactTel');
		},
		// 更新列表
		tableUpdate: function () {
			_table._fnPageChange(1);
			_table._fnAjaxUpdate();
		},
		tableUpdate2: function () {
			_table2._fnPageChange(1);
			_table2._fnAjaxUpdate();
		},
		bindEvent: function () {
			var me = this;
			// 升级线索
			$('.adv-table').on('click', '.update', function() {
				me.update($(this));
			});
			// 废弃线索
			$('.adv-table').on('click', '.del', function() {
				$('[name=dropReason]').val('');
				me.delete($(this));
			});	
			// 分配线索
			$('.adv-table').on('click', '.distribute', function() {
				$('[name=distributeNameXS]').val('');
				userCrmId = '';
				if($('#advTable1 tbody')){
					$('#advTable1 tbody,.clueTable .iTable-info,.clueTable .iTable-page').empty();
				}
				me.distribute($(this));
			});	
			//分配查询
			$('#distributeSear').on('click',function(){
				searchVal = $('#distributeNameXS').val();
				clueList.table1();
			});
			//分配线索提交
			$('#distriSubmit').on('click',function(){
				var modifyInfor = {
					employeeCode: userCrmId || searchVal,
					customerCode: customerCode,
					version: version
				};
				clueList.distributeSubmit(modifyInfor);
			});
			// 监听模态框关闭时重置表单
			this.$clueDistrModel.on('hide.bs.modal', function() {
				clueList.tableUpdate();
				if($('#advTable1 tbody')){
					$('#advTable1 .tbody,#advTable1 .iTable-info,advTable1 .iTable-page').remove();
				}
				_vForm1.resetForm();
			});
			this.$clueDeleteModel.on('hide.bs.modal', function() {
				_vForm2.resetForm();
			});
			//导出
			$('#btnReport').on('click',function(){
				var da = [];
				for (var p in cluePar) {
					da.push(p + '=' + encodeURI(cluePar[p])) ;		
				}
				var url = API.opporReport +'?'+ da.join('&');
				$(this).attr({
					target:'_blank',href:url
				});
			});
			//分配选中
			$('#advTable1').on('click', 'tr', function () {
				$(this).siblings('tr').css('backgroundColor','');
				$(this).css('backgroundColor','#ddd');
				checkedStaffNum = $($(this).find('td')[0]).find('span').attr('data-usercrmid');
				userCrmId = checkedStaffNum;
			})
		},
		// 升级
		update: function (obj) {
			var customerCode = obj.attr('data-customerCode');
			var version = obj.attr('data-version');
			MJJS.page.dialog.confirm({
				title: '线索升级',
				type: 'type-default',
				message: '是否升级此条线索为商机？',
				btnOKLabel: '确定',
				btnCancelLabel: '取消',
				btnOKClass: 'btn-info',
				callback: function(result) {
					if (result) {
						MJJS.http.post(API.upgrade,{
							customerCode:customerCode,
							version: version	
						}, function() {
							MJJS.page.dialog.alert('升级线索成功',function () {
								clueList.tableUpdate();
							});
						}, function(err) {
							MJJS.page.dialog.alert(err.msg,function () {
							});
						})
					}
				}
			});	
		},
		//废弃线索
		delete: function (obj) {
			var contacter  = obj.attr('data-contacter');
			var mobile     = obj.attr('data-mobile');
			customerCode   = obj.attr('data-customerCode');
			version = obj.attr('data-version');
			$('#clueDelete #contactName').html(contacter);
			$('#clueDelete #contactTel').html(mobile);
			this.$clueDeleteModel.modal('show');
		},
		// 分配线索
		distribute: function (obj) {
			var clientName = obj.attr('data-customerName');
			var contacter  = obj.attr('data-contacter');
			var mobile     = obj.attr('data-mobile');
			customerCode   = obj.attr('data-customerCode');
			version = obj.attr('data-version');
			window.discustomerCode 	=customerCode;
			window.version 	=version;
			this.$contactTel.html(mobile);
			this.$clientName.html(clientName);
			this.$contacter.html(contacter);
			this.$clueDistrModel.modal('show');
		},
		//一二级联动
		industry: function() {
			MJJS.data.cascade.set('[id=industryOne]', {
				defName:   '选择客户一级行业',
				defValue:  '',
				defName2:  '选择客户二级行业',
				defValue2: '',
				type:      'industry',
				level2:    '[id=industryTwo]',
				valueKey:  'code',
				nameKey:   'name',
				callback: function(o) {
				},
				load: function(o) {
				}
			});
		},
		filter: function() {
			MJJS.form.filter('#advSearch', {
				params: [
					[
						{
							type: 'select',
							columns: 2,
							key: 'clueStatus',
							option: [
								{
									name: '选择线索状态',
									value: ''
								},
								{
									name: '未分配',
									value: '10'
								},
								{
									name: '已分配',
									value: '20'
								},
								{
									name: '已升级',
									value: '40'
								}
							]
						},{
							type: 'inputSelect',
							columns: 3,
							auto: 1,
							option: [
								{
									name: '客户地区',
									key: 'customerArea'
								},{
									name: '电话号码',
									key: 'mobile'
								}
							]
						},{
							type: 'text',
							text: '创建时间',
							dir: 'right',
							columns: 1
						},{
							type: 'inputDateGroup',
							placeholder: '日期',
							key1: 'createTimeFrom',
							key2: 'createTimeTo',
							columns: 3
						},{
							type: 'button',
							name: '查询'
						},{
							type: 'button',
							name: '导出',
							ID: 'btnReport'
						},{
							ID: 'clueAdd',
							type: 'button',
							name: '创建',
							href: '/clue/add'
						}
					],
					[	
						{
							type: 'select',
							columns: 2,
							key: 'industry',
							ID: 'industryOne',
							option: [
								
							]
						},{
							type: 'select',
							columns: 3,
							key: 'industrySecond',
							ID: 'industryTwo',
							option: [
								
							]
						}
					]
				],
				load: function(o) {
					// 页面加载时的回调
					if (!('/api/clue/add' in MJJS.header.userPermit)) {
						$('#clueAdd').remove();
					}
					cluePar = o ;
					clueList.industry();
					clueList.bindEvent();
					clueList.table();
				},
				reload: function(o) {
					// 页面初次加载后的回调，比如改变筛选项后的回调函数
					if(o.customerArea){
						var _customerArea = decodeURI(o.customerArea)
						o.customerArea = encodeURI(_customerArea);
					}
					cluePar = o ;
					clueList.tableUpdate();
				}
			});
		},
		//线索列表
		table: function() {
			MJJS.ui.iTable('#advTable', {
				default: MJJS.common.defaultTable,
				columns: [
					'no',									//NO
					'contacter',							//联系人
					'mobile',								//联系电话
					'customerName',							//客户名称
					'sexLabel',								//性别
					'email',								//邮箱
					'qq',									//QQ
					'province',								//地区
					'createTime',							//创建时间
					'createBy',								//创建人员
					'isAccelerate',							//紧急程度
					'unUpgradeDays',						//未升级天数
					'statusLabel',							//状态
					'name'									//操作
				],
				render: {
					0: function(o) {
						return o.no || '-';
					},
					8: function(o) {
						var n  = o.createTime;
						return new Date(n).format('yyyy-mm-dd');
					},
					13: function(o) {
							// 10: 未分配
							// 20: 已分配
							// 40: 已升级
							var clueStatus = o.status;
							var ct = nicheAuth['s_' + clueStatus];
							var ctr = clueList.nicheAuth(ct);
							var ctrl = ctr[0];
							var ctrlMore = ctr[1];
							var opts = {
								view:       { name: '查看', api: '/clue/info', url: '/clue/view/' + o.customerCode },
								edit:       { name: '编辑', api: '/clue/update', url: '/clue/edit/' + o.customerCode },
								discade:    { name: '废弃', api: '/clue/discard', customerCode: o.customerCode, version:o.version ,contacter: o.contacter, mobile: o.mobile,},
								update:     { name: '升级', api: '/clue/upgrade', customerCode: o.customerCode, version: o.version },
								distribute: { name: '分配', api: '/clue/assign', customerCode: o.customerCode, customerName: o.customerName, contacter: o.contacter, mobile: o.mobile, version:o.version }
							};
							var str = MJJS.header.ctrlFilter(ctrl, opts);
							var strMore = MJJS.header.ctrlFilter(ctrlMore, opts);
							strMore = strMore? '<div class="more" title="更多"><span>更多</span><div class="more-ul more-order">' + strMore + '</div></div>': '';
							return (str || strMore)? '<div class="icon-ctrl">'+str+strMore+'</div>': '-';
					}
				},
				data: function(o){
					MJJS.data.objMergeTable(_table, cluePar);
				},
				searchEmpty: '搜索不到数据',
				load: function(table) {
					_table = table;
				},
				error: function(err) {
					if (err.code === '4000004') {
						MJJS.page.dialog.alert(err.msg, function() {
							window.location.href = '/logout';
						});
					}
				},
				url: API.list
			});
		},
		//废弃线索表单验证
		discardValidator: function() {
			var me = this;
			var obj = MJJS.form.valid.filter(['dropReason']);
			MJJS.form.validator('#clueDelete', obj, {
				success: function(e,data) {
					e.preventDefault();
					var o = MJJS.form.valid.getData('#clueDelete', ['dropReason']);
					
					var modifyInfor = {
						note: o.dropReason,
						customerCode: customerCode,
						version: version
					}
					data.resetForm();
					me.discardSubmit(modifyInfor);
					me.$clueDeleteModel.modal('hide');
				},
				init: function(data) {
					_vForm2 = data;
				}
			});
		},
		//废弃线索提交
		discardSubmit: function (data) {
			var me = this;
			MJJS.http.post(API.oppordiscard,data,function (o) {
				MJJS.page.dialog.alert('废弃线索提交成功',function () {
					me.tableUpdate();
				});
			},function (err) {
				me.$clueDeleteModel.modal('hide');
				MJJS.page.dialog.alert(err.msg,function () {
						
				});
			});
		},
		//分配线索表单验证
		distributeValidator: function() {
			var me = this;
			var obj = MJJS.form.valid.filter(['distributeNameXS']);
			MJJS.form.validator('#clueDistr', obj, {
				success: function(e,data) {
					e.preventDefault();
					var o = MJJS.form.valid.getData('#clueDistr', ['distributeNameXS']);
					//分配商机
					me.$clueDistrModel.modal('hide');
				},
				init: function(data) {
					_vForm1 = data;
				}
			});
		},	
		//分配线索提交
		distributeSubmit: function (data) {
			var me = this;
			MJJS.http.post(API.opporDistribute,data,function (o) {
				MJJS.page.dialog.alert('分配线索提交成功',function () {
					me.$clueDistrModel.modal('hide');
					me.tableUpdate();
				});
			},function (err) {
				me.$clueDistrModel.modal('hide');
				MJJS.page.dialog.alert(err.msg,function () {
						
				});
			});
		},
		//分配线索查询列表
		table1: function() {
			MJJS.ui.iTable('#advTable1', {
				default: MJJS.common.defaultTable,
				columns: [
					'userCode',				//员工编号
					'userName',				//名称
					'firstDeptName',		//一级部门
					'secondDeptName',		//二级部门
					'rankName',				//职级
					'ownerCurrClue'			//现有线索数量
				],
				render: {
					0: function (o) {
						userCrmId = o.userCrmId;
						return '<span data-userCrmId='+userCrmId+'>'+o.userCode+'</span>'
					}
				},
				searchEmpty: '搜索不到数据',
				data: function(o){
					var _searchVal = decodeURI(searchVal);
					o.condition = encodeURI(_searchVal);
				},
				load: function(table) {
					_table2 = table;
				},
				url: API.searchList
			});
		},
		// 操作拆分 普通&更多
		nicheAuth: function(arr) {
			var len = arr.length;
			var ctr = [];
			var more = [];
			for (var i = 0; i < len; i++) {
				var str = arr[i];
				if (str === 'view' || str === 'edit' || str === 'distribute') {
					ctr.push(str);
				} else {
					more.push(str);
				}
			}
			return [ctr, more];
		}
	};
	MJJS.header.load = function() {
		clueList.init();
	};
})(MJJS, window);
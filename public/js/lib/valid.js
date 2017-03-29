(function($, window, undefined) {
	"use strict";
	var ico_err = '<i class="fa fa-exclamation-circle"></i>';
	var temp = {
		err: function(name, opts) {
			var data = {
				message: ico_err + '请输入正确的' + name
			}
			if (opts) {
				if (opts.regexp) data.regexp = opts.regexp;
				if (opts.message) data.message = opts.message;
				if (opts.field) data.field = opts.field;
				if (opts.remote) data.remote = opts.remote;
			}
			return data
		},
		empty: function(name, callback) {
			return {
				message: ico_err + name + '不能为空',
				callback: function(_, __) {
					$.isFunction(callback) && callback(_, __);
				}
			}
		},
		max: function(name, max) {
			return {
				max: max,
				message: ico_err + '请输入' + max + '字符以内的' + name
			}
		},
		min: function(name, min) {
			return {
				min: min,
				message: ico_err + '请输入不少于' + min + '字符的' + name
			}
		},
		range: function(name, max, min) {
			return {
				min: min,
				max: max,
				message: ico_err + '请输入' + min + '-' + max + '字符的' + name
			}
		},
		only: function(num) {
			return {
				min: num,
				message: ico_err + '至少选择 ' + num + ' 个'
			}
		},
		select: function(name) {
			return {
				message: ico_err  + '请选择' + name
			}
		},
		between: function(name, min, max, msg) {
			var msg = msg? msg: '请输入' + min + '至' + max + '间的数值'
			return {
				min: min,
				max: max,
				message: ico_err + msg
			}
		}
	};
	var fields = {
		/* 申请API接入 */
		// // 接入广告样式
		// style: {
		// 	validators: {
		// 		choice: temp.only(1)
		// 	}
		// },
		// // 预计日接入流量
		// flow: {
		// 	validators: {
		// 		notEmpty: temp.empty('预计日接入流量'),
		// 		integer: temp.err('数字')
		// 	}
		// },
		// // CPM预期
		// cpm: {
		// 	validators: {
		// 		integer: temp.err('数字')
		// 	}
		// },
		// /* 添加网站 */
		// // 域名
		// domain: {
		// 	validators: {
		// 		notEmpty: temp.empty('域名'),
		// 		regexp: temp.err('', {
		// 			regexp: /^[A-Za-z0-9_]+(\.(com|cn|net))$/,
		// 			message: ico_err + '请输入正确的域名，如：example.com'
		// 		}),
		// 		condition: {
		// 			fun: function(o) {
		// 				return $.isFunction(window.checkd)? window.checkd(o): o;
		// 			},
		// 			message: ico_err + '请输入正确的广告位地址'
		// 		},
		// 		remote: {
		// 			url: MJJS.server.api + '/domain/checkdomain',
		// 			condition: function(o) {
		// 				return $.isFunction(window.checkdomain)? window.checkdomain(o): o;
		// 			},
		// 			message: ico_err + '请输入正确的域名，如：example.com'
		// 		}
		// 	}
		// },
		// // 网站名称
		// webname: {
		// 	validators: {
		// 		notEmpty: temp.empty('网站名称'),
		// 		stringLength: temp.max('网站名称', 20),
		// 		remote: {
		// 			url: MJJS.server.api + '/app/h5/checkName',
		// 			data: function(o){
		// 				return {
		// 					name: o._cacheFields.webname.val()
		// 				}
		// 			},
		// 			condition: function(o) {
		// 				o.valid = !Number(o.data);
		// 				return o;
		// 			},
		// 			message: ico_err + '该网站名称已存在'
		// 		}
		// 	}
		// },


		// /* 注册 */
		// //注册邮箱
		// regEmail: {
		// 	validators: {
		// 		notEmpty: temp.empty('注册邮箱'),
		// 		regexp: temp.err('', {
		// 			regexp: /^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
		// 			message: ico_err + '请输入正确的邮件地址，如：123@example.com'
		// 		}),
		// 		remote: {
		// 			url: MJJS.server.api + '/publisher/isRepeat',
		// 			data: function(v) {
		// 				return {
		// 					registerName: v._cacheFields.regEmail.val()
		// 				}
		// 			},
		// 			condition: function(o) {
		// 				o.valid = !o.data.is_repeat;
		// 				if (!o.valid) o.message = '该邮箱已注册';
		// 				return o;
		// 			},
		// 			message: ico_err + '请输入正确的邮件地址，如：123@example.com'
		// 		}
		// 	}
		// },
		// //邮编
		// postCode: {
		// 	validators: {
		// 		regexp: temp.err('邮编', {
		// 			regexp: /^[1-9]\d{5}(?!\d)$/
		// 		})
		// 	}
		// },
		// //checkbox
		// checkbox: {
		// 	validators: {
		// 		notEmpty: temp.read('《盟聚开发者协议》', {
		// 			message: ''
		// 		})
		// 	}
		// },
		//线索 添加页面 
		//客户名称(选填,去重)
		clientNameXS: {
			validators: {
				remote: {
					url: MJJS.server.api + '/customer/info/name',
					data: function(o){
						console.log(o._cacheFields)
						return{
							customerName: encodeURIComponent(o._cacheFields.clientNameXS.val())
						}	
					},
					condition: function(o) {
						o.valid = !Number(o.data);
						if (!o.valid) o.message = '客户已存在，无法创建线索';
						return o;
					}
				}
			}
		},
		//联系电话(必填,去重)
		contactTelXS: {
			validators: {
				notEmpty: temp.empty('联系人电话'),
				stringLength: temp.max('联系人电话', 20),
				regexp: temp.err('联系人电话', {
					regexp: /^((0\d{2,3}-\d{7,8})|(1[3|4|5|7|8]\d{9}))$/
				}),
				remote: {
					url: MJJS.server.api + '/customer/info/mobile',
					data: function(o){
						var mobile = o._cacheFields.contactTelXS.val().replace(/\s+/g,"");
						return{
							mobile: mobile
						}	
					},
					condition: function(o) {
						o.valid = !Number(o.data);
						if (!o.valid) o.message = '电话已存在，无法创建线索';
						return o;
					}
				}
			}
		},
		//线索页面 再次编辑页面 客户名称(需要去重  选填)
		clientNameXSUpdate: {
			validators: {
				remote: {
					url: MJJS.server.api + '/customer/info/update/name',
					data: function(o){
						console.log(o._cacheFields)
						return{
							customerName: encodeURIComponent(o._cacheFields.clientNameXSUpdate.val()),
							customerCode: ''|| xscustomerCode
						}	
					},
					condition: function(o) {
						o.valid = !Number(o.data);
						if (!o.valid) o.message = '客户已存在，无法创建线索';
						return o;
					}
				}
			}
		},
		//线索页面 再次编辑页面 联系电话(需要去重  必填)
		contactTelXSUpdate: {
			validators: {
				notEmpty: temp.empty('联系人电话'),
				stringLength: temp.max('联系人电话', 20),
				regexp: temp.err('联系人电话', {
					regexp: /^((0\d{2,3}-\d{7,8})|(1[3|4|5|7|8]\d{9}))$/
				}),
				remote: {
					url: MJJS.server.api + '/customer/info/update/mobile',
					data: function(o){
						var mobile = o._cacheFields.contactTelXS.val().replace(/\s+/g,"");
						
						return{
							mobile: mobile,
							customerCode: ''|| xscustomerCode
						}	
					},
					condition: function(o) {
						o.valid = !Number(o.data);
						if (!o.valid) o.message = '电话已存在，无法创建线索';
						return o;
					}
				}
			}
		},
		//线索列表页面 分配商机 必填,不能为空
		distributeNameXS: {
			validators: {
				notEmpty: temp.empty('分配选项'),
				stringLength: temp.max('分配选项', 20)
			}
		},
		// 商机添加页面
		//客户名称，不用必填，但需要查重
		ClientName1: {
			validators: {
				stringLength: temp.max('客户名称', 30),
				// remote: {
				// 	url: MJJS.server.api + '/adloc/checkName',
				// 	data: function(o){
				// 		console.log(o._cacheFields)
				// 		return{
				// 			name: o._cacheFields.ClientName.val()
				// 		}	
				// 	},
				// 	condition: function(o) {
				// 		o.valid = !Number(o.data);
				// 		//if (!o.valid) o.message = '客户已存在，无法创建商机';
				// 		return o;
				// 	}
				// }
			}
		},
		//客户名称,必填 (商机)
		ClientNameSJ: {
			validators: {
				notEmpty: temp.empty('客户名称'),
				stringLength: temp.max('客户名称', 30),
				remote: {
					url: MJJS.server.api + '/customer/info/name',
					data: function(o){
						console.log(o._cacheFields)
						return{
							customerName: encodeURIComponent(o._cacheFields.ClientNameSJ.val())
						}	
					},
					condition: function(o) {
						o.valid = !Number(o.data);
						if (!o.valid) o.message = '客户已存在，无法创建商机';
						return o;
					}
				}
			}
		},
		//商机页面 再次编辑页面 客户名称(需要去重  必填)
		ClientNameUpdate: {
			validators: {
				notEmpty: temp.empty('客户名称'),
				stringLength: temp.max('客户名称', 30),
				remote: {
					url: MJJS.server.api + '/customer/info/update/name',
					data: function(o){
						console.log(o._cacheFields)
						return{
							customerName: encodeURIComponent(o._cacheFields.ClientNameUpdate.val()),
							customerCode: ''|| buscustomerCode
						}	
					},
					condition: function(o) {
						o.valid = !Number(o.data);
						if (!o.valid) o.message = '客户已存在，无法创建商机';
						return o;
					}
				}
			}
		},
		//商机页面 再次编辑页面 联系电话(需要去重  必填)
		contactTelUpdate: {
			validators: {
				notEmpty: temp.empty('联系人电话'),
				stringLength: temp.max('联系人电话', 20),
				regexp: temp.err('联系人电话', {
					regexp: /^((0\d{2,3}-\d{7,8})|(1[3|4|5|7|8]\d{9}))$/
				}),
				remote: {
					url: MJJS.server.api + '/customer/info/update/mobile',
					data: function(o){
						var mobile = o._cacheFields.contactTelUpdate.val().replace(/\s+/g,"")
						return{
							mobile: mobile,
							customerCode: ''|| buscustomerCode
						}	
					},
					condition: function(o) {
						o.valid = !Number(o.data);
						if (!o.valid) o.message = '电话已存在，无法创建商机';
						return o;
					}
				}
			}
		},
		//商机页面 审核不通过原因
		other_reason: {
			validators: {
				notEmpty: temp.empty('审核不通过原因'),
				stringLength: temp.max('审核不通过原因', 100)
			}
		},
		//商机列表页面 废弃商机 discardReason必填,不能为空
		discardReason: {
			validators: {
				notEmpty: temp.empty('废弃原因'),
				stringLength: temp.max('废弃原因', 100)
			}
		},
		//商机列表页面 放弃商机 discardReason必填,不能为空
		dropReason: {
			validators: {
				notEmpty: temp.empty('放弃原因'),
				stringLength: temp.max('放弃原因', 100)
			}
		},
		//商机列表页面 分配商机 userCrmId必填,不能为空
		distributeNameSJ: {
			validators: {
				notEmpty: temp.empty('分配选项'),
				stringLength: temp.max('分配选项', 20)
				// remote: {
				// 	url: MJJS.server.api + '/niche/assign',
				// 	data: function(o){
				// 		console.log(o._cacheFields)
				// 		return{
				// 			userCrmId: o._cacheFields.distributeNameSJ.val(),
				// 			customerCode: ''|| discustomerCode,
				// 			version: '' || version
				// 		}	
				// 	},
				// 	condition: function(o) {
				// 		o.valid = o.code==1?false:true;
				// 		if (!o.valid) o.message = o.msg;
				// 		return o;
				// 	}
				// }
			}
		},
		//客户名称,必填 (订单)
		customerName: {
			validators: {
				notEmpty: temp.empty(''),
				stringLength: temp.max('客户名称', 30),
				notEmpty: temp.empty('客户名称', {
		 			message: ''
		 		}),
				remote: {
					url: MJJS.server.api + '/customer/info_name',
					data: function(o){
						return{
							customerName: encodeURI(o._cacheFields.customerName.val())
						}	
					},
					condition: function(o) {
						o.valid =o.code==0?true:false;
						if (!o.valid){
				 			o.message = o.msg;
				 			window._customerCode ='';
				 		}else{
				 			window._customerCode =''||o.data.customerCode;
				 		}
						return o;
					}
				}
			}
		},
		//创建订单 关联合同,必填&&查询是否存在
		contractCode: {
			validators: {
				notEmpty: temp.empty('合同名称', {
		 			message: ''
		 		}),
		 		remote: {
				 	url: MJJS.server.api + '/contract/info',
				 	data: function(o){
				 		return{
				 			contractCode: o._cacheFields.contractCode.val()
				 		}	
				 	},
				 	condition: function(o) {
				 		//o.valid = !Number(o.data);
				 		var $dom =$('#domHref a')
				 		o.valid =o.code==0?true:false;
				 		if (!o.valid){
				 			o.message = o.msg;
				 			$dom.html('');
				 		}else{
				 			window._sta =o.data.status;
				 			$dom.html(o.data.contractCode+o.data.contractNameLabel);
				 			$dom.prop('href','/agreement/view/'+o.data.contractCode+'');
				 		}
				 		return o;
				 	}
				}
			}
		},
		//联系电话（需要去重，必填）
		contactTel1: {
			validators: {
				notEmpty: temp.empty('联系人电话'),
				stringLength: temp.max('联系人电话', 20),
				regexp: temp.err('联系人电话', {
					regexp: /^((0\d{2,3}-\d{7,8})|(1[3|4|5|7|8]\d{9}))$/
				}),

				remote: {
					url: MJJS.server.api + '/customer/info/mobile',
					data: function(o){
						var mobile = o._cacheFields.contactTel1.val()
						return{
							mobile: mobile.replace(/\s+/g,"")
						}	
					},
					condition: function(o) {
						o.valid = !Number(o.data);
						if (!o.valid) o.message = '电话已存在，无法创建商机';
						return o;
					}
				}
			}
		},
		
		//联系电话(不需要去重,必填)
		contactTel: {
			validators: {
				notEmpty: temp.empty('联系人电话'),
				stringLength: temp.max('联系人电话', 20),
				regexp: temp.err('联系人电话', {
					regexp: /^(1[3|4|5|7|8]\d{9})$/
				}),
				// remote: {
				// 	url: MJJS.server.api + '/adloc/checkName',
				// 	data: function(o){
				// 		console.log(o._cacheFields)
				// 		return{
				// 			name: o._cacheFields.ClientName.val()
				// 		}	
				// 	},
				// 	condition: function(o) {
				// 		o.valid = !Number(o.data);
				// 		//if (!o.valid) o.message = '电话已存在，无法创建商机';
				// 		return o;
				// 	}
				// }
			}
		},
		
		//省
		province: {
			validators: {
				notEmpty: temp.select('省', {
		 			message: ''
		 		})
			}
		},
		//地址
		address: {
			validators: {
				notEmpty: temp.empty('地址'),
				stringLength: temp.max('地址', 30)
			}
		},
		//联系人姓名
		contactName: {
			validators: {
				notEmpty: temp.empty('联系人姓名'),
				stringLength: temp.max('联系人姓名', 10),
				regexp: temp.err('联系人姓名', {
					regexp: /^[A-Za-z \u4E00-\u9FA5\.]+$/
				})				
			}
		},
		//一级行业
		industryOne: {
			validators: {
				notEmpty: temp.select('一级行业', {
		 			message: ''
		 		})
			}
		},
		//二级行业
		industryTwo: {
			validators: {
				notEmpty: temp.select('二级行业', {
		 			message: ''
		 		})
			}
		},
		//联系人QQ
		contactQQ: {
			validators: {
				regexp: temp.err('QQ号', {
					regexp: /^[1-9][0-9]{4,19}$/
				})
			}
		},
		//邮箱
		Email: {
			validators: {
				regexp: temp.err('', {
					regexp: /^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
					message: ico_err + '请输入正确的邮件地址，如：123@example.com'
				})
			}
		},
		//固定电话fixedTel
		fixedTel: {
			validators: {
				stringLength: temp.max('联系人电话', 20),
				regexp: temp.err('联系人电话', {
					regexp: /^(0\d{2,3}-\d{7,8})$/
				})
			}
		},

		//备注
		describe: {
			validators: {
				stringLength: temp.max('备注', 100)
			}
		},
		// 商机跟进
		//商机跟进记录
		followLog: {
			validators: {
				stringLength: temp.max('商机跟进记录', 200)
			}
		},
		//人员销售配额页面
		//每日被分配线索上限
		maxClueDay: {
			validators: {
				notEmpty: temp.empty('每日被分配线索上限'),
				digits:true
			}
		},
		//最大持有线索总数
		ownerMaxClue: {
			validators: {
				notEmpty: temp.empty('最大持有线索总数'),
				digits:true
			}
		},
		//最大持有商机总数
		ownerMaxNiche: {
			validators: {
				notEmpty: temp.empty('最大持有商机总数'),
				digits:true
			}
		},
		// 人员添加
		// 员工姓名
		employeeName: {
			validators: {
				notEmpty: temp.empty('员工名称'),
				stringLength: temp.max('员工名称', 20)
			}
		},
		//员工编号
		employeeNum: {
			validators: {
				notEmpty: temp.empty('员工编号'),
				remote: {
					url: '/api/employee/check',
					data: function(o){
						return{
							userCode: o._cacheFields.employeeNum.val()
						}	
					},
					condition: function(o) {
						o.valid = !o.data;
						if (!o.valid) o.message = '员工编号已存在！';
						return o;
					}
				}
			}
		},
		// 员工CRM账号
		employeeCRMNum: {
			validators: {
				notEmpty: temp.empty('员工CRM账号')
			}
		},
		//一级部门
		departOne: {
			validators: {
				notEmpty: temp.select('一级部门', {
		 			message: ''
		 		})
			}
		},
		level: {
			validators: {
			}
		},
		//上级名称
		leader: {
			validators: {
				notEmpty: temp.empty('上级名称'),
				remote: {
					url: '/api/employee/leader/check',
					data: function(o){
						return{
							userName: encodeURI(o._cacheFields.leader.val()),
							rank: o._cacheFields.level.val()
						}	
					},
					condition: function(o) {
						o.valid = o.data;
						if (!o.valid) o.message = '上级名称不存在！';
						return o;
					}
				}
			}
		},
		// 合同创建
		//合同名称
		agreementName: {
			validators: {
				notEmpty: temp.select('合同名称', {
		 			message: ''
		 		})
			}
		},
		//客户名称，必填，但不需要查重
		ClientName2: {
			validators: {
				notEmpty: temp.empty('客户名称'),
				stringLength: temp.max('客户名称', 30),
			}
		},
		//合同金额
		agreementAmount: {
			validators: {
				notEmpty: temp.empty('合同金额'),
				stringLength: temp.max('合同金额', 10),
			}
		},
		//开始日期
		startDate: {
			validators: {
				notEmpty: temp.empty('开始日期')
			}
		},
		//结束日期
		endDate: {
			validators: {
				notEmpty: temp.empty('结束日期')
			}
		},
		//签约日期
		signDate: {
			validators: {
				notEmpty: temp.empty('签约日期')
			}
		},
		//签约产品
		signPro: {
			validators: {
		 		notEmpty: temp.empty('签约产品', {
		 			message: ''
		 		})
		 	}
		},
		//客户方签约人
		clientSignName: {
			validators: {
				notEmpty: temp.empty('客户方签约人'),
				stringLength: temp.max('客户方签约人', 10)
			}
		},
		//我方签约人
		usSignName: {
			validators: {
				notEmpty: temp.empty('我方签约人'),
				stringLength: temp.max('我方签约人', 10),
		 		remote: {
					url:' /api/agent/user_name/check',
					data: function(o){
						console.log(o._cacheFields)
						return{
							name:encodeURI(o._cacheFields.usSignName.val())
						}	
					},
					condition: function(o) {
						o.valid = o.data;
						if (!o.data) o.message = '我方签约人姓名不存在！';
						return o;
					}				
				}
			}
		},
		// 订单创建
		//订单总金额
		ordertAmount: {
			validators: {
				notEmpty: temp.empty('订单总金额')
			}
		},
		//服务费 订单创建&&订单编辑
		serviceAmount: {
			validators: {
				regexp: temp.err('服务费', {
					//regexp: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数'
				}),
				//between: temp.between('服务费', 0, 10000, '请输入正确的数值'),
				notEmpty: temp.empty('服务费', function(q,a) {
					if(q&&/^(\d+(?:\.\d{1,2})?|-1)$/.test(a)){
				  		_getValFun();
					}
			    })
			}
		},
		//订单描述/条款
		orderDescribe: {
			validators: {
				stringLength: temp.max('订单描述/条款', 50)
			}
		},
		//合同名称需要查重
		agreementName1: {
			validators: {
				notEmpty: temp.empty('合同名称', {
		 			message: ''
		 		})//,
		 		// remote: {
				// 	url: MJJS.server.api + '/adloc/checkName',
				// 	data: function(o){
				// 		console.log(o._cacheFields)
				// 		return{
				// 			name: o._cacheFields.ClientName.val()
				// 		}	
				// 	},
				// 	condition: function(o) {
				// 		o.valid = !Number(o.data);
				// 		//if (!o.valid) o.message = '员工编号已存在！';
				// 		return o;
				// 	}
				// }
			}
		},
		//产品名
		gdtName: {
			validators: {
				notEmpty: temp.empty('广点通客户名称')
			}
		},
		//产品ID
		gdtID: {
			validators: {
				notEmpty: temp.empty('广点通客户ID')
			}
		},
		//充值金额
		gdtMoney: {
			validators: {
				regexp: temp.err('充值金额', {
				    //regexp: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
				    //regexp: /^\d{1,8}(\.\d{1,2})?$/,//小数点前面8位整数
					regexp: /^(\d+(?:\.\d{2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		pyqName: {
			validators: {
				notEmpty: temp.empty('公众号名称')
			}
		},
		//产品ID
		pyqID: {
			validators: {
				notEmpty: temp.empty('原始ID')
			}
		},
		//充值金额
		pyqMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		zhtName: {
			validators: {
				notEmpty: temp.empty('广告主')
			}
		},
		//产品ID
		zhtID: {
			validators: {
				notEmpty: temp.empty('账户ID')
			}
		},
		//充值金额
		zhtMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		mjggName: {
			validators: {
				notEmpty: temp.empty('盟聚广告财务ID')
			}
		},
		//充值金额
		mjggMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		jinriName: {
			validators: {
				notEmpty: temp.empty('账户ID/广告主公司名')
			}
		},
		//充值金额
		jinriMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		xlfyName: {
			validators: {
				notEmpty: temp.empty('账户ID/广告主公司名')
			}
		},
		//充值金额
		xlfyMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		xlfsName: {
			validators: {
				notEmpty: temp.empty('账户ID/广告主公司名')
			}
		},
		//充值金额
		xlfsMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		shhsName: {
			validators: {
				notEmpty: temp.empty('账户ID/广告主公司名')
			}
		},
		//充值金额
		shhsMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		mmName: {
			validators: {
				notEmpty: temp.empty('账户ID/广告主公司名')
			}
		},
		//充值金额
		mmMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		yktdName: {
			validators: {
				notEmpty: temp.empty('账户ID/广告主公司名')
			}
		},
		//充值金额
		yktdMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		wyydName: {
			validators: {
				notEmpty: temp.empty('账户ID/广告主公司名')
			}
		},
		//充值金额
		wyydMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		ucxxlName: {
			validators: {
				notEmpty: temp.empty('账户ID/广告主公司名')
			}
		},
		//充值金额
		ucxxlMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		wyxwName: {
			validators: {
				notEmpty: temp.empty('账户ID/广告主公司名')
			}
		},
		//充值金额
		wyxwMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		//产品名
		wifiName: {
			validators: {
				notEmpty: temp.empty('账户ID/广告主公司名')
			}
		},
		//充值金额
		wifiMoney: {
			validators: {
				regexp: temp.err('充值金额', {
					regexp: /^(\d+(?:\.\d{1,2})?|-1)$/,
					message:'只能输入数字、小数点(小数点后面为两位小数)'
				}),
				notEmpty: temp.empty('充值金额', function(q,a) {
					if(q&&orderReg.test(a)){
						_getValFun(a);
					}
				})
			}
		},
		// 业务————代理商
		//代理商联系人姓名（不必填）
		contactName1: {
			validators: {
				stringLength: temp.max('联系人姓名', 10),
				regexp: temp.err('联系人姓名', {
					regexp: /^[A-Za-z \u4E00-\u9FA5\.]+$/
				})	
			}
		},
		//联系电话(不需要去重，不必填)
		contactTel2: {
			validators: {
				stringLength: temp.max('联系人电话', 20),
				regexp: temp.err('联系人电话', {
					regexp: /^(1[3|4|5|7|8]\d{9})$/
				}),
				// remote: {
				// 	url: MJJS.server.api + '/adloc/checkName',
				// 	data: function(o){
				// 		console.log(o._cacheFields)
				// 		return{
				// 			name: o._cacheFields.ClientName.val()
				// 		}	
				// 	},
				// 	condition: function(o) {
				// 		o.valid = !Number(o.data);
				// 		//if (!o.valid) o.message = '电话已存在，无法创建商机';
				// 		return o;
				// 	}
				// }
			}
		},
		//代理商公司名称（需要去重）
		agentComName: {
			validators: {
				notEmpty: temp.empty('代理商公司名称'),
				stringLength: temp.max('代理商公司名称', 30),
				remote: {
					url: '/api/agent/company_check',
					data: function(o){
						return{
							agentCompany: encodeURI( o._cacheFields.agentComName.val())
						}	
					},
					condition: function(o) {
						o.valid = !o.data;
						if (!o.valid) o.message = '代理商公司名称已存在，无法创建代理商';
						return o;
					}
				}
			}
		},
		//代理商类型
		agentType: {
			validators: {
				notEmpty: temp.select('代理商类型')
			}
		},
		//代理商CRM账号
		agentCRM: {
			validators: {
				notEmpty: temp.empty('代理商CRM账号'),
				stringLength: temp.max('代理商CRM账号', 20)//,
			}
		},
		//密码
		agentCRMPSD1: {
			validators: {
				notEmpty: temp.empty('密码'),
				stringLength: temp.range('密码', 8, 6),
				identical: temp.err('密码',{
					field: 'agentCRMPSD2',
					message: ico_err + '两次输入的'+ name +'不一致'
				})
			}
		},
		//确认密码
		agentCRMPSD2: {
			validators: {
				notEmpty: temp.empty('密码'),
				stringLength: temp.range('密码', 18, 6),
				identical: temp.err('密码',{
					field: 'agentCRMPSD1',
					message: ico_err + '两次输入的'+ name +'不一致'
				})
			}
		},

		//渠道经理
		qudaoManager: {
			validators: {
				notEmpty: temp.empty('渠道经理'),
				remote: {
					url: '/api/employee/leader/channel/check',
					data: function(o){
						return{
							userName: encodeURI(o._cacheFields.qudaoManager.val())
						}	
					},
					condition: function(o) {
						o.valid = o.data;
						if (!o.valid) o.message = '此员工不存在或不是渠道经理';
						return o;
					}
				}
			}
		},
		//冻结原因
		freezeReason:{
			validators: {
				notEmpty: temp.empty('冻结原因'),
				stringLength: temp.max('冻结原因', 100)
			}
		},
		unfreezeReason: {
			validators: {
				notEmpty: temp.empty('解冻原因'),
				stringLength: temp.max('解冻原因', 100)
			}
		},
		//充值单创建
		//客户全称
		clientFull: {
			validators: {
				notEmpty: temp.empty('客户全称'),
				stringLength: temp.max('客户全称', 20)
			}
		},
		//渠道公司全称
		qudaoComName: {
			validators: {
				notEmpty: temp.empty('渠道公司全称'),
				stringLength: temp.max('渠道公司全称', 20)
			}
		},		
		// 关联订单编号
		orderNum: {
			validators: {
				notEmpty: temp.empty('关联订单编号'),
				remote: {
					url:'/api/order/info',
					data: function(o){
						return{
							orderCode: o._cacheFields.orderNum.val()
						}	
					},
					condition: function(o) {
						return $.isFunction(window.checkOrder)? window.checkOrder(o): o;
					},
					message: ico_err + '订单不存在'
				}
			}
		},
		// 服务费
		serviceMoney: {
			validators: {
				notEmpty: temp.empty('服务费'),
				digits:true
			}
		},
		//前返点
		cutOffMoney: {
			validators: {
				notEmpty: temp.empty('前返点'),
				between: temp.between('前返点', 0, 100, '请输入正确的数值')
			}
		},
		//本次到款金额
		thisMoney: {
			validators: {
				notEmpty: temp.empty('本次到款金额')
			}
		},
		//本次充值金额
		thisPaidMoney: {
			validators: {
				notEmpty: temp.empty('本次充值金额'),
				remote: {
					url:'/api/charge/rebateAmount/get',
					data: function(o){
						return{
							offerType: o.$form.find('input[name=orderAttr]:checked').val(),
							rebate: o.$form.find('#rebate').html() || '0',
							adPreAmount: o._cacheFields.thisPaidMoney.val()
						}
					},
					condition: function(o) {
						return $.isFunction(window.calMoney)? window.calMoney(o): o;
					},
					message: ico_err + '请输入本次充值金额'
				}
			}
		},
		//付款账户名称/ID
		accountIDName: {
			validators: {
				notEmpty: temp.empty('付款账户名称/ID')
			}
		}
	};
	$.extend(MJJS.form.valid, {
		// 获取对应的模块的校验规则
		filter: function() {
			if (!arguments.length) return false;
			var arr, obj = {};
			if($.isArray(arguments[0])) {
				arr = arguments[0];
			} else {
				arr = arguments;
			}
			$.each(arr, function(i, e) {
				if (fields[e]) obj[e] = fields[e];
			});
			return obj;
		},
		// 添加校验规则
		addField: function(valid, value) {
			if (!valid || !value) return false;
			var arr = [];
			if ($.isArray(value)) {
				arr = value;
			} else {
				arr.push(value);
			}
			$.each(arr, function(i, name) {
				if (fields[name]) valid.addField(name, fields[name]);
			});
		},
		// 删除校验规则
		removeField: function(valid, value) {
			if (!valid || !value) return false;
			var arr = [];
			if ($.isArray(value)) {
				arr = value;
			} else if (typeof(value) === 'string') {
				arr.push(value);
			} else {
				return false;
			}
			$.each(arr, function(i, name) {
				if (fields[name]) valid.removeField(name);
			});
		},
		revalidate: function(valid, value) {
			if (!valid || !value) return false;
			var arr = [];
			if ($.isArray(value)) {
				arr = value;
			} else if (typeof(value) === 'string') {
				arr.push(value);
			} else {
				return false;
			}
			$.each(arr, function(i, name) {
				if (fields[name]) valid.revalidateField(name);
			});
		},
		// 重置校验规则
		resetField: function(valid, value) {
			if (!valid || !value) return false;
			if (!(value instanceof Object) || $.isEmptyObject(value)) return false;
			for (var name in value) {
				if (fields[name]) {
					var ele = value[name];
					if (ele instanceof Object && !$.isEmptyObject(ele)) {
						valid.resetField(name, ele);
					}
				}
			}
		},
		// 获取form表单对应name的数据
		getData: function(form, value) {
			if (!form || !value) return false;
			var arr = [];
			var obj = {};
			if ($.isArray(value)) {
				arr = value;
			} else if (typeof(value) === 'string') {
				arr.push(value);
			} else {
				return false;
			}
			$.each(arr, function(i, name) {
				var ipt = $(form).find('[name="'+name+'"]');
				if (!ipt.length) return;
				var tag  = ipt.eq(0).tagName();
				var type = ipt.eq(0).attr('type');
				var tagFn = {
					input: function(type) {
						try {
							typeFn[type](name);
						} catch (err) {
							console.log(err.message);
						}
					},
					select: function() {
						obj[name] = ipt.val();
					},
					textarea: function() {
						obj[name] = ipt.val();
					}
				};
				var typeFn = {
					text: function() {
						if(ipt.length > 1) {
							var arr2 = [];
							$.each(ipt, function(j, f) {
								if (f.value.trim()) arr2.push(f.value);
							});
							obj[name] = arr2.join(',');
						} else {
							obj[name] = ipt.val();
						}
					},
					radio: function(name) {
						var _ipt = $(form).find('[name="'+name+'"]:checked');
						obj[name] = _ipt.val();
					},
					checkbox: function(name) {
						var _ipt = $(form).find('[name="'+name+'"]:checked');
						var arr2 = [];
						$.each(_ipt, function(j, f) {
							arr2.push(f.value);
						});
						obj[name] = arr2.join(',');
					}
				};
				try {
					tagFn[tag](type);
				} catch (err) {
					console.log(err.message);
				}
			});
			return obj;
		}
	});

})(jQuery, window);
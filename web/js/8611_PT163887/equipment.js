
shr.defineClass("shr.ats.Equipment", shr.framework.List, {
	 
	initalizeDOM : function () {
		var that = this;
		shr.ats.Equipment.superClass.initalizeDOM.call(this);
//		var billIds=sessionStorage.getItem("billIds");
//		//alert(billIds);
//		if('Y9n68m6KTOulXb/Oob13H5Nzh54='==billIds){
//		$('#equipment').hide();
//		}else{
//		$('#addNew').hide();
//		$('#delete').hide();
//		var breadHtml = $($("#breadcrumb").children()[1]).children("a").html();
//		$("#breadcrumb").children().last().html(breadHtml);
//		var list=document.getElementById("breadcrumb");
//		list.removeChild(list.childNodes[1]);
//		var liText=document.createTextNode('金蝶考勤机');
//		list.appendChild(liText);
//		}
	},
	equipmentAction:function(){
	
	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceEquipmentEditHandler&method=getInformation";
			   shr.ajax({
				dataType: "json",
				type:"post",
				async:false,
				data: {
					"billId":"billId"
				},
				url:url,
				success:function(res){
					if(res.datas=="true"){
					window.location.href="http://shr.renshi100.com/ATS/AttendanceEquipment.aspx?"+res.SecretKey;
					}else{
					shr.showWarning({"message" : res.errorMessageString});
					}
				}
			});
	},
 	viewAction: function(billId) {
		
	}
	
});




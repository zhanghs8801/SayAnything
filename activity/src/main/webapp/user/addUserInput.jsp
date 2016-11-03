<%@ page contentType="text/html; charset=UTF-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>
添加用户
</title>
<link href="css/style.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="js/comm.js"></script>
	<script type="text/javascript" src="js/My97DatePicker/WdatePicker.js"></script>
	<style type="text/css">
		.content{
			background: none repeat scroll 0 0 #eeeeee
		}
	</style>
</head>
<body style=".content">
	<!--main-container-part-->
	<div id="content">
		<div id="content-header">
			<div id="breadcrumb">
				<a href="#" class="tip-bottom" data-original-title="Go to Home">
				<i class="icon-home"></i>首页</a> 
				<a href="users" class="tip-bottom" data-original-title="">用户管理</a> 
				<a href="" class="current">添加用户</a>
			</div>
		</div>
		<div class="container-fluid">
			<div id="container">
				<ul id="myTab" class="nav nav-tabs">
					<li class="active">
						<a href="#home" data-toggle="tab">添加用户 </a>
					</li>
				</ul>
				<div id="myTabContent" class="tab-content">
					<div class="tab-pane fade in active" id="home">
						<form class="form-horizontal" action="doAddUser" method="post" id="addUserForm">
						  <div class="control-group">
						    <label class="control-label">用户名</label>
						    <div class="controls">
						      <input type="text" class="form-control" size="50" name="username" id="username" style="width:300px"><span style="color: red"></span>
						    </div>
						  </div>
						  <div class="control-group">
						    <label class="control-label">密码</label>
						    <div class="controls">
						      <input type="text" class="form-control" size="50" name="password" id="password" style="width:300px"><span style="color: red"></span>
						    </div>
						  </div>
						  <div class="control-group">
						    <label class="control-label">用户类型</label>
						    <div class="controls">
							    <label class="radio" style="width:600px">
									  <input type="radio" name="roleId" value="1"><span style="float:left;padding-right: 30px;">系统管理员</span>
									  <input type="radio" name="roleId" value="2" checked="checked"><span style="float:left;padding-right: 30px;">普通用户</span>
								</label>
						    </div>
						  </div>
						  <div id="operateModule" class="control-group">
						    <label class="control-label">操作模块</label>
						    <div class="controls">
							    <label class="checkbox" style="width:600px">
							    	  <c:forEach var="m" items="${modules }">
										  <input type="checkbox" name="moduleId" value="${m.moduleId}"><span style="float:left;padding-right: 30px;">${m.moduleName }</span>
							    	  </c:forEach>
								</label>
						    </div>
						  </div>
						  <div class="control-group">
						    <div class="controls">
						      <button type="submit" id="save1" class="btn btn-primary">保存</button>
							  <button type="button" class="btn btn-info" onclick="history.back(-1);">返回</button>
						    </div>
						  </div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

<script type="text/javascript" src="js/jquery.form.js"></script>
<script type="text/javascript" src="js/ajaxfileupload.js"></script>
<script type="text/javascript" src="js/popalert.js"></script>
<script type="text/javascript">

//判断中文和英文的混合字符的长度
function getStrLength(str) {  
    var cArr = str.match(/[^\x00-\xff]/ig);  
    return str.length + (cArr == null ? 0 : cArr.length);  
}
	
	
$(function(){
	$("input[type=radio][name=roleId]").change(function() {
		var checkedVal = $('input[type=radio][name=roleId]:checked').val();
		if(checkedVal == 1){
			$('#operateModule').css('display','none');
		}else{
			$('#operateModule').css('display','block');
		}
	});
	
	$("#addUserForm").ajaxForm({
		dataType:'json',
		beforeSend:function(){
			var username = $.trim($("#username").val());
			if(username==""){
				alert("用户名不能为空");
				return false;
			}
			if(getStrLength(username)>50){
				alert("用户名不能超过50个字符");
				return false;
			}
		},
		success:function(data){
			if(data.errorcode==0){
				window.location.href="<%=path%>/users";
			}else{
				alert(data.message);
			}
		}
	});
	
});
</script>
</body>
</html>
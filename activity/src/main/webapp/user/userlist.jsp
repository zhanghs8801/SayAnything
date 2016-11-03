<%@ page contentType="text/html; charset=UTF-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<% 
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户列表</title>
<link href="css/style.css" rel="stylesheet" type="text/css">
<style type="text/css">
.btn-xs{
	padding: 1px 5px;
    font-size: 14px;
    line-height: 1.5;
    border-radius: 3px;
}
</style>
	<script type="text/javascript" src="js/comm.js"></script>
	<script type="text/javascript" src="js/My97DatePicker/WdatePicker.js"></script>
</head>
<body>
	<!--main-container-part-->
	<div id="content">
		<div id="content-header">
			<div id="breadcrumb">
				<a href="#" class="tip-bottom" data-original-title="Go to Home"><i class="icon-home"></i>首页</a> 
				<a href="users" class="tip-bottom" data-original-title="">用户管理</a> 
				<a href="#" class="current">用户列表</a>
			</div>
		</div>
		<div class="container-fluid">
			<div id="container">
				<fieldset class="order_fieldset">
					<form name="form" action="users" method="post" class="form-control">
						<table width="100%" border="0" cellspacing="1" cellpadding="2" style="margin: 5px 0;">
							<tr>
								<td width="82%">
									<input name="pageNum" type="hidden"	id="pageNum" value="1" size="20" maxlength="30"> 
									<input name="pageSize" type="hidden" id="pageSize" value="${queryPageBean.pageSize }" size="20" maxlength="30">
									&nbsp&nbsp 
									用户名称: <input name="username" id="username" type="text" class="form-input" placeholder="请输入用户名称" value="${user.username}"/>
									 &nbsp&nbsp 
									<input type="submit" class="btn btn-primary" value="查询 ">
								</td>
							</tr>
						</table>
					</form>
				</fieldset>
				<button class="btn btn-info" id="addUser">添加用户</button>
				<br />
				<br />
				<table width="100%" border="2" cellspacing="1" cellpadding="2" style="background-color: #b9d8f3;">
					<tr style="text-align: center; COLOR: #0076C8; BACKGROUND-COLOR: #F4FAFF; font-weight: bold">
						<td width="5%" align="center">用户名称</td>
						<td width="5%" align="center">密码</td>
						<td width="5%" align="center">角色</td>
						<td width="5%" align="center">创建时间</td>
						<td width="10%" align="center">操作</td>
					</tr>
					<c:forEach var="c" items="${queryPageBean.list}">
						<tr bgcolor='#F4FAFF'>
							<td style="text-align: center;">${c.username}</td>
							<td style="text-align: center;">${c.password}</td>
							<td style="text-align: center;">
								<c:if test="${c.roleId ==1}">
									系统管理员 
								</c:if>
								<c:if test="${c.roleId ==2}">
									普通用户 
								</c:if>
							</td>
							<td style="text-align: center;">${c.createTime}</td>
							<td style="text-align: center;">
								<a href="updateUser?id=${c.id}"><button class="btn btn-primary btn-xs">编辑</button></a>&nbsp 
								<a href="javascript:void(0)" onclick="delteData('${c.id}','${c.id }')" ><button class="btn btn-danger btn-xs">删除</button></a>  &nbsp
							</td>
						</tr>
					</c:forEach>
				</table>
				<br />
				<div align="center">
					每页<input type="text" style="width: 20px" value="${queryPageBean.pageSize}" id="pageSize" />条，共[${queryPageBean.totalRecord}]条记录，
					当前[${queryPageBean.currentPage}]页，共[${queryPageBean.totalPage}]页，
					<c:if test="${queryPageBean.currentPage!=1}">
						<a href="javascript:void(0)"
							onclick="gotoPageNum(${queryPageBean.currentPage}-1)">上一页
						</a>
					</c:if>
					&nbsp;&nbsp;
					<c:forEach var="num" items="${queryPageBean.pageBar}">
						<c:if test="${queryPageBean.currentPage==num}">
							<font color="red">${num}</font>
						</c:if>
						<c:if test="${queryPageBean.currentPage!=num}">
							<a href="javascript:void(0)" onclick="gotoPageNum(${num})">${num}</a>
						</c:if>
					</c:forEach>
					&nbsp;&nbsp;
					<c:if test="${queryPageBean.currentPage!=queryPageBean.totalPage}">
						<a href="javascript:void(0)" onclick="gotoPageNum(${queryPageBean.currentPage}+1)">下一页</a>
					</c:if>
					&nbsp;&nbsp; 跳转到<input type="text" id="forward" style="width: 20px" value="${queryPageBean.currentPage}">页 
					<input type="button" value="GO" onclick="go(${queryPageBean.totalPage})" class="btn btn-primary" />
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="js/popalert.js"></script>
	<script type="text/javascript">
	$(document).ready(function(){
		$("#addUser").click(function(){
			location.href="addUser";
		});
	});
	
	function delteData(id, msgId){
		if(!confirm("确认要删除吗")){
			return;
		}
		location.href="deleteUser?id="+id;
	}
	
function gotoPageNum(pageNum) {
  $("body").append('<form id="pageForm"></form>');
  $form = $("#pageForm");
  $form.attr('action', 'users');
  $form.attr('method', 'post');
  
  $form.append("<input type='hidden' id='pageNumInput' name='pageNum'/>");
  pageNumInput = $("#pageNumInput");
  pageNumInput.attr('value', pageNum);
  
  $form.append("<input type='hidden' id='pageSizeInput' name='pageSize'/>");  
  $("#pageSizeInput").attr('value', $("#pageSize").val());
  
  
  $form.append("<input type='hidden' id='couponNameInput' name='name'/>");  
  $("#couponNameInput").attr('value', $("#couponName").val());
  
  
  $form.append("<input type='hidden' id='usernameInput' name='username'/>");  
  $("#usernameInput").attr('value', $("#username").val());
  
  $form.submit();
}

function go(totalPage) {
  $("body").append('<form id="pageForm"></form>');
  $form = $("#pageForm");
  $form.attr('action', 'users');
  $form.attr('method', 'post');
  
  var pageNum = $("#forward").val();
  if(pageNum > totalPage) {
	 pageNum = totalPage;
  }
  if(pageNum <= 0) {
	  pageNum = 1;
  }	 
  $form.append("<input type='hidden' id='pageNumInput' name='pageNum'/>");
  pageNumInput = $("#pageNumInput");
  pageNumInput.attr('value', pageNum);
  
  $form.append("<input type='hidden' id='pageSizeInput' name='pageSize'/>");  
  var pageSize = $("#pageSize").val();
  pageSizeInput = $("#pageSizeInput");
  pageSizeInput.attr('value', pageSize);
  
  $form.append("<input type='hidden' id='usernameInput' name='username'/>");  
  $("#usernameInput").attr('value', $("#username").val());
  
  $form.submit();
}
</script>
</body>
</html>
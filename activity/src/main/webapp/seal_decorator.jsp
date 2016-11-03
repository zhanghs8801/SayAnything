<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://shiro.apache.org/tags" prefix="shiro" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<%
String path  = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String requestPath = basePath + "?" + (request.getQueryString() != null ? request.getQueryString() : "");
%>
<!DOCTYPE html>
<html lang="en">

<head>
    <title>后台管理系统</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="<%=basePath%>newcss/bootstrap.min.css" />
    <link rel="stylesheet" href="<%=basePath%>newcss/bootstrap-responsive.min.css" />
    <link rel="stylesheet" href="<%=basePath%>newcss/fullcalendar.css" />
    <link rel="stylesheet" href="<%=basePath%>newcss/matrix-style.css" />
    <link rel="stylesheet" href="<%=basePath%>newcss/matrix-media.css" />
    <link href="<%=basePath%>font-awesome/css/font-awesome.css" rel="stylesheet" />
    <link rel="stylesheet" href="<%=basePath%>newcss/jquery.gritter.css" />
     <sitemesh:write property="head"/>
     <!--end-Footer-part-->
    <script src="<%=basePath%>newjs/jquery.min.js"></script>
    <script src="<%=basePath%>newjs/bootstrap.min.js"></script>
    <script src="<%=basePath%>newjs/jquery.flot.min.js"></script>
    <script src="<%=basePath%>newjs/jquery.flot.pie.min.js"></script>    
    <script src="<%=basePath%>newjs/jquery.flot.resize.min.js"></script>
    <script src="<%=basePath%>newjs/fullcalendar.min.js"></script>
    <script src="<%=basePath%>newjs/matrix.js"></script>
	<script src="<%=basePath%>newjs/jquery.peity.min.js"></script>
	<script type="text/javascript">
		$(function(){
			var serialSpan = $('span[name="serialNum"]');
			$.each(serialSpan,function(index,spanElement){
				var serialNum = index+1;
				$(spanElement).text(serialNum);
			});
		});
	</script>
</head>

<body>
    <!--Header-part-->
    <div id="header">
        <h1><a href="javascript:;">后台管理系统</a></h1>
    </div>
    <!--close-Header-part-->
    <!--top-Header-menu-->
    <div id="user-nav" class="navbar navbar-inverse">
        <ul class="nav">
			<li class="dropdown" id="profile-messages">
			<a title="" href="#" data-toggle="dropdown" data-target="#profile-messages" class="dropdown-toggle">
				<i class="icon icon-user"></i> 
				<span class="text"> 
					Welcome > <shiro:user>[<shiro:principal/>]</shiro:user>
				</span>
				<b class="caret"></b>
			</a>
			<ul class="dropdown-menu">
				<li>
					<a href="<%=request.getContextPath()%>/logout"><i class="icon-key"></i>退出</a>
				</li>
			</ul>
			</li>
			<li class="dropdown" id="menu-messages" style="display:none;"><a href="#" data-toggle="dropdown" data-target="#menu-messages" class="dropdown-toggle"><i class="icon icon-envelope"></i> <span class="text"> 消息</span> <span class="label label-important">5</span> <b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a class="sAdd" title="" href="#"><i class="icon-plus"></i> 新消息</a></li>
                </ul>
            </li>
        </ul>
    </div>
    <!--close-top-Header-menu-->
    <!--start-top-serch-->
    <div id="search" style="display:none;">
        <input type="text" placeholder="输入搜索内容" />
        <button type="submit" class="tip-bottom" title="Search"><i class="icon-search icon-white"></i></button>
    </div>
    <!--close-top-serch-->
    <!--sidebar-menu-->
    <div id="sidebar">
	<ul>
	<shiro:hasRole name="1">
		<li class="submenu">
			<a href="JavaScript:;"><i class="icon icon-th"></i> <span>用户管理</span><span name="serialNum" class="label label-important"></span></a>
			<ul>
				<li><a href="users">用户列表</a></li>
			</ul>
		</li>
	</shiro:hasRole>
	<shiro:hasPermission name="YYG">
		<li class="submenu">
			<a href="JavaScript:;"><i class="icon icon-th"></i> <span>一元购管理</span><span name="serialNum" class="label label-important"></span></a>
			<ul>
				<li><a href="queryLogisticsInfo">一元购物流列表</a></li>
			</ul>
		</li>
	</shiro:hasPermission>
	<shiro:hasPermission name="FLS">
		<li class="submenu">
			<a href="JavaScript:;"><i class="icon icon-th"></i> <span>会员福利管理</span><span name="serialNum" class="label label-important"></span></a>
			<ul>
				<li><a href="couponList">优惠券列表</a></li>
				<li><a href="couponRecordList">优惠券领取记录</a></li>
			</ul>
		</li>	
	</shiro:hasPermission>
	<shiro:hasPermission name="MESSAGE">
		<li class="submenu">
			<a href="JavaScript:;"><i class="icon icon-th"></i> <span>推送消息管理</span><span name="serialNum" class="label label-important"></span></a>
			<ul>
				<li><a href="messages">推送消息列表</a></li>
			</ul>
		</li>
	</shiro:hasPermission>
	<shiro:hasPermission name="COMMENT">
		<li class="submenu">
			<a href="JavaScript:;"><i class="icon icon-th"></i> <span>评论审核后台</span><span name="serialNum" class="label label-important"></span></a>
			<ul>
				<li><a href="comments">评论列表</a></li>
			</ul>
		</li>
	</shiro:hasPermission>
	</ul>
    </div>
    <!--sidebar-menu-->
    <!-- nav end -->
	<sitemesh:write property="body" />
    <!--Footer-part-->
    <div class="row-fluid">
       <div id="footer" class="span12">Copyright © 2007-2016 All Rights Reserved.</div>
    </div>
</body>
</html>
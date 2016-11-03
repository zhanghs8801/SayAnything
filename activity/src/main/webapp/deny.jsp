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
<title>Forbidden</title>
<link href="css/style.css" rel="stylesheet" type="text/css">
<style type="text/css">
.btn-xs{
	padding: 1px 5px;
    font-size: 14px;
    line-height: 1.5;
    border-radius: 3px;
}
</style>
</head>
<body>
	<div id="content">
		<div class="container-fluid">
			<div id="container">
				<img alt="403" src="<%=request.getContextPath()%>/images/403.png">
			</div>
		</div>
	</div>

</body>
</html>
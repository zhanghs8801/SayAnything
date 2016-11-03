package cn.say.anything.conrtoller;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import cn.say.anything.bean.Define;
import cn.say.anything.bean.QueryPageInfo;

public class CommonController {

	public static void outputJSON(HttpServletResponse res, String json)
			throws IOException {
		res.setContentType("application/json;charset=UTF-8");
		res.setCharacterEncoding("UTF-8");
		res.getWriter().write(json);

	}
	
	protected QueryPageInfo constractQueryPageInfo(String pageNum,String pageSize){
		if (pageNum == null || "".equals(pageNum)) {
			pageNum = Define.PAGE_NUM;
		}

		if (pageSize == null || "".equals(pageSize)) {
			pageSize = Define.PAGE_SIZE;
		}
		QueryPageInfo queryPageInfo = new QueryPageInfo();
		queryPageInfo.setCurrentPage(Integer.parseInt(pageNum));
		queryPageInfo.setPageSize(Integer.parseInt(pageSize));
		return queryPageInfo;
	}
}

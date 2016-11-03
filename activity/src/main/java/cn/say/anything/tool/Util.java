package cn.say.anything.tool;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Util {

	private static int FIRST_HALF_YEAR = 1;
	private static int SECOND_HALF_YEAR = 2;
	private static int MIDDLE_MONTH = 7;

	/* 通用系统信息显示方法 */
	public static void callInfo(String strMessage, javax.servlet.http.HttpServletRequest request,
			javax.servlet.http.HttpServletResponse response) {
		callInfo(strMessage, true, null, request, response);
	}

	public static void callInfo(String strMessage, String backURL, javax.servlet.http.HttpServletRequest request,
			javax.servlet.http.HttpServletResponse response) {
		callInfo(strMessage, true, backURL, request, response);
	}

	public static void callInfo(String strMessage, boolean showBack, String backURL,
			javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) {
		try {
			request.setAttribute("commMessage", strMessage);
			if (!showBack)
				request.setAttribute("showback", "N");
			else
				request.setAttribute("showback_url", backURL);
			javax.servlet.RequestDispatcher disp = request.getRequestDispatcher("comminfo.jsp");
			disp.forward(request, response);
		}
		catch (Exception e) {
			try {
				response.sendRedirect("comminfo.jsp");
			}
			catch (Exception ex) {
			}
		}
	}

	public static String encodeUrl(String url) throws UnsupportedEncodingException {
		return encodeUrl(url, Constant.CHARSET);
	}

	public static String decodeUrl(String url) throws UnsupportedEncodingException {
		return URLDecoder.decode(url, Constant.CHARSET);
	}

	public static String encodeUrl(String url, String charset) throws UnsupportedEncodingException {
		return URLEncoder.encode(url, charset);
	}

	public static String decodeUrl(String url, String charset) throws UnsupportedEncodingException {
		return URLDecoder.decode(url, charset);
	}

	public static SuperDate getDateFromRequest(String prefix, HttpServletRequest request) {
		String date = SuperString.notNull(request.getParameter(prefix + "date"));
		String hour = SuperString.notNull(request.getParameter(prefix + "hour"));
		String min = SuperString.notNull(request.getParameter(prefix + "min"));
		String sec = SuperString.notNull(request.getParameter(prefix + "sec"));
		String datestr = date + " " + hour + ":" + min + ":" + sec;
		try {
			return new SuperDate(datestr);
		}
		catch (Exception e) {
			return null;
		}
	}

	public static String generateSelectList(String name, String[] arrText, int seletedValue, int width,
			String firstRowText) {
		StringBuffer sb = new StringBuffer();
		sb.append("<select name=\"").append(name).append("\" id=\"").append(name).append("\" class=\"input_list_01\"");
		if (width > 0)
			sb.append(" style=\"width:").append(width).append("px\"");
		sb.append(">\n");
		if (firstRowText != null && firstRowText.length() > 0)
			sb.append("<option value=\"\">").append(firstRowText).append("</option>\n");
		for (int i = 0; i < arrText.length; i++) {
			sb.append("<option value=\"").append(String.valueOf(i)).append("\"");
			if (seletedValue == i)
				sb.append(" selected class=\"input_list_01sel\"");
			sb.append(">").append(arrText[i]).append("</option>\n");
		}
		sb.append("</select>\n");
		return sb.toString();
	}

	public static String openURL(String _url) {
		try {
			URL url = new URL(_url);
			InputStream is = url.openStream();
			BufferedReader reader = new BufferedReader(new InputStreamReader(is));
			StringBuffer sb = new StringBuffer();
			String input_info = "";
			while ((input_info = reader.readLine()) != null) {
				sb.append(input_info.trim());
			}
			reader.close();
			is.close();
			return SuperString.notNullTrim(sb.toString());
		}
		catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	}

	public static String openURL(String _url, String charset) {
		try {
			URL url = new URL(_url);
			InputStream is = url.openStream();
			BufferedReader reader = new BufferedReader(new InputStreamReader(is, charset));
			StringBuffer sb = new StringBuffer();
			String input_info = "";
			while ((input_info = reader.readLine()) != null) {
				sb.append(input_info.trim());
			}
			reader.close();
			is.close();
			return SuperString.notNullTrim(sb.toString());
		}
		catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	}

	public static String getURLText(String _url) {
		try {
			URL url = new URL(_url);
			InputStream is = url.openStream();
			BufferedReader reader = new BufferedReader(new InputStreamReader(is));
			String content = "";
			String inLine = "";
			while ((inLine = reader.readLine()) != null) {
				content += (content.length() > 0 ? "\n" : "") + inLine;
			}
			reader.close();
			is.close();
			return content;
		}
		catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	}

	public static String dealCodeIDs(String ids) {
		if (ids == null)
			return "";
		while (ids.startsWith(","))
			ids = ids.substring(1);
		while (ids.endsWith(","))
			ids = ids.substring(0, ids.length() - 1);
		return "";
	}

	public static boolean existInStrs(String strs, String str) {
		return SuperString.strToList(strs).contains(str);
	}

	public static String addToStrs(String strs, String str) {
		List<String> list = SuperString.strToList(strs);
		if (!list.contains(str))
			list.add(str);
		return SuperString.listToStr(list);
	}

	public static String removeFromStrs(String strs, String str) {
		List<String> list = SuperString.strToList(strs);
		list.remove(str);
		return SuperString.listToStr(list);
	}

	public static String getAreaCode(String mobile) {
		if (mobile == null || mobile.length() == 0 || mobile.length() < 10 || !mobile.startsWith("0"))
			return "";
		if (mobile.startsWith("01") || mobile.startsWith("02")) {
			return mobile.substring(0, 3);
		}
		else {
			return mobile.substring(0, 4);
		}
	}

	public static SuperDate getSuperDate(int imonth) {
		String mstr = String.valueOf(imonth);
		if (mstr.length() != 6)
			return null;
		return new SuperDate(mstr.substring(0, 4) + "-" + mstr.substring(4, 6) + "-01 00:00:00");
	}

	public static int getPrevMonth(int imonth) {
		SuperDate sdtemp = getSuperDate(imonth);
		if (sdtemp == null)
			return 0;
		sdtemp.add(Calendar.MONTH, -1);
		return SuperString.getInt(sdtemp.getYearMonthValue());
	}

	public static int getNextMonth(int imonth) {
		SuperDate sdtemp = getSuperDate(imonth);
		if (sdtemp == null)
			return 0;
		sdtemp.add(Calendar.MONTH, 1);
		return SuperString.getInt(sdtemp.getYearMonthValue());
	}

	public static String getTableSuffix(HttpServletRequest request) {
		String datamonth = SuperString.notNull(request.getParameter("datamonth"));
		if (datamonth.length() == 0)
			return "";
		return "_" + String.valueOf(datamonth);
	}

	public static String generateProgramOptions() {
		StringBuffer sb = new StringBuffer();
		return sb.toString();
	}

	public static String getParamsStrs(ArrayList<?> params) {
		if (params == null || params.size() <= 0)
			return "";
		String r = "";
		for (int i = 0; i < params.size(); i++) {
			Object param = params.get(i);
			r += String.valueOf(i) + "=" + param.toString() + "|";
		}
		return r;
	}

	public static String dealSQLText(String sql, ArrayList<?> params) {
		if (sql == null || sql.length() == 0)
			return "";
		int index = 0;
		while (sql.indexOf("?") >= 0) {
			sql = SuperString.replaceOnce(sql, "?", "${" + String.valueOf(index) + "}");
			index++;
		}
		if (params != null) {
			for (int i = 0; i < params.size(); i++) {
				Object param = params.get(i);
				String ovalue = "";
				if (param instanceof Integer) {
					ovalue = String.valueOf(((Integer)param).intValue());
				}
				else if (param instanceof String) {
					ovalue = "'" + dealSQLStringChar((String)param) + "'";
				}
				else if (param instanceof Double) {
					ovalue = String.valueOf(((Double)param).doubleValue());
				}
				else if (param instanceof Float) {
					ovalue = String.valueOf(((Float)param).floatValue());
				}
				else if (param instanceof Long) {
					ovalue = String.valueOf(((Long)param).longValue());
				}
				else if (param instanceof Boolean) {
					ovalue = String.valueOf(((Boolean)param).booleanValue());
				}
				else if (param instanceof Date) {
					ovalue = "'" + new SuperDate((Date)param).getDateTimeString() + "'";
				}
				else {
					ovalue = "'" + dealSQLStringChar(SuperString.notNull(param.toString())) + "'";
				}
				ovalue = SuperString.replace(ovalue, "?", "\\?");
				sql = SuperString.replace(sql, "${" + String.valueOf(i) + "}", ovalue);
			}
		}
		return sql;
	}

	public static String getOrderByImgHTML(String order, String cur_order_by) {
		String imgHTML = "<img src=[src] width=10 height=11 border=0 align=absmiddle>";
		return cur_order_by.startsWith(order) ? SuperString.replace(imgHTML, "[src]",
				"images/comm/" + (cur_order_by.endsWith("desc") ? "desc.gif" : "asc.gif")) : "";
	}

	public static String getOrderUrl(String order, String cur_order_by, HttpServletRequest request) {
		String orderby = cur_order_by.startsWith(order)
				|| (cur_order_by.length() > 0 && order.startsWith(cur_order_by)) ? (cur_order_by.endsWith("desc")
				|| order.endsWith(" desc") ? (order.endsWith(" desc") && cur_order_by.endsWith(" desc") ? order
				.substring(0, order.length() - " desc".length()) : order) : order + " desc") : (order
				.endsWith(" 2desc") ? order.substring(0, order.length() - " desc".length()) : order);
		return request.getRequestURI() + "?order=" + orderby + SuperPage.getQueryAnd(request, "order");
	}

	public static String dealSQLStringChar(String s) {
		s = SuperString.replace(s, "'", "\\'");
		return s;
	}

	public static String getActText(String act) {
		if (act.equalsIgnoreCase("add"))
			return "增加";
		if (act.equalsIgnoreCase("mod"))
			return "修改";
		if (act.equalsIgnoreCase("del"))
			return "删除";
		return "";
	}

	public static String dealScore(float score, String class1, String class2) {
		StringBuffer sb = new StringBuffer();
		String _score = SuperNumber.format(score, "0.1");
		sb.append("<span class=").append(class1).append(">").append(_score.substring(0, _score.indexOf(".")))
				.append("</span><span class=").append(class2).append(">").append(_score.substring(_score.indexOf(".")))
				.append("</span>");
		return sb.toString();
	}

	public static String dealAnonymousIP(String ip) {
		if (ip == null || "".equals(ip))
			return "";
		String[] aip = ip.split("\\.");
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < aip.length; i++) {
			sb.append(aip[i]).append(".");
			if (i >= 1) {
				sb.append("*");
				break;
			}
		}
		return sb.toString();
	}

	public static String getIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0) {
			ip = request.getRemoteAddr();
		}
		if (ip != null && ip.indexOf(",") > 0) {
			ip = ip.substring(0, ip.indexOf(","));
		}
		return ip;
	}

	public static String getIPRootPath(HttpServletRequest request) {
		String rootpath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
				+ request.getContextPath();
		return rootpath;
	}

	public static String getRootPath(HttpServletRequest request) {
		/*
		 * String rootpath = request.getScheme() + "://" + request.getServerName() + ":" +
		 * request.getServerPort()+request.getContextPath();
		 */
		return getPropertiesPath("VIP_WEB_URL", true);
	}

	public static String getWhereSQL(StringBuffer sbw) {
		String strwhere = SuperString.notNull(sbw.toString());
		while (strwhere.startsWith(" "))
			strwhere = strwhere.substring(1);
		if (strwhere.startsWith("and "))
			strwhere = strwhere.substring("and ".length());
		if (strwhere.length() > 0)
			strwhere = " where " + strwhere;
		return strwhere;
	}

	public static boolean isCompletedHTML(String str) {
		if (str == null || "".equals(str))
			return false;
		int b = str.indexOf("<!--{header}//-->");
		int e = str.indexOf("<!--{footer}//-->");
		return b > 0 && e > 0 && b < e;
	}

	public static String getHiddenCharString(String str, String fillchar, boolean fromEnd, int offset, int len) {
		if (str == null)
			str = "";
		if (str.length() < offset)
			return str;
		if (fromEnd && len > offset)
			len = offset;
		if (!fromEnd && offset + len > str.length())
			len = str.length() - offset;
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < len; i++)
			sb.append(fillchar);
		if (fromEnd)
			return str.substring(0, str.length() - offset) + sb.toString() + str.substring(str.length() - offset + len);
		else
			return str.substring(0, offset) + sb.toString() + str.substring(offset + len);
	}

	public static String getProperties(String key) {
		return PropUtil.getInstance("constant").getProperty(key);
	}

	public static int getPropertiesInt(String key) {
		return SuperString.getInt(PropUtil.getInstance("constant").getProperty(key));
	}

	public static boolean getPropertiesBoolean(String key) {
		return Boolean.valueOf(PropUtil.getInstance("constant").getProperty(key));
	}

	public static String getPropertiesPath(String key, boolean incsuffix) {
		String p = SuperString.notNullTrim(getProperties(key));
		if (p.length() > 0 && incsuffix && !p.endsWith("/"))
			p += "/";
		return p;
	}

	public static void writeChannelLog(HttpServletRequest request, String username, String page) {
		Log log = LogFactory.getLog("CHANNEL");
		log.debug("|" + username + "|" + SuperPage.getQueryString(request) + "|" + page + "|" + getIpAddr(request)
				+ "|");
	}

	public static void writeChannelLog(String channel, String username, String page) {
		Log log = LogFactory.getLog("CHANNEL");
		log.debug("|" + username + "|" + channel + "|" + page + "|");
	}

	/**
	 * 获取某个范围内的随机数
	 * 
	 * @param a
	 * @param b
	 * @return
	 */
	public static int generateRandom(int a, int b) {
		int temp = 0;
		try {
			if (a > b) {
				temp = new Random().nextInt(a - b);
				return temp + b;
			}
			else {
				temp = new Random().nextInt(b - a);
				return temp + a;
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return temp + a;
	}

	/**
	 * 获取某个范围内的字符串随机数（位数不足自动补0）
	 * 
	 * @param a
	 * @param b
	 * @return
	 */
	public static String generateRandomStr(int a, int b) {
		String result = "";
		int rdnum = generateRandom(a, b);
		if ((rdnum + "").length() < (b + "").length()) {
			int i = (b + "").length() - (rdnum + "").length();
			while (i > 0) {
				result += "0";
				i--;
			}
			result += rdnum;
		}
		else {
			result = rdnum + "";
		}
		return result;
	}

	public static String getTableName(SuperDate createTime, SuperDate mergeTime) throws ParseException {
		String initTableName = "vip_pay_order";
		StringBuilder resultTableName = new StringBuilder(initTableName);
		if (createTime.before(mergeTime)) {
			int year = createTime.getYear();
			int month = createTime.getMonth();
			int scope = getScopeValue(month);
			resultTableName.append("_").append(year).append("_").append(scope);
		}
		return resultTableName.toString();
	}

	private static int getScopeValue(int month) {
		if (month >= MIDDLE_MONTH) {
			return SECOND_HALF_YEAR;
		}
		return FIRST_HALF_YEAR;
	}
	
	/**
	 * 判断混合中文英文的长度
	 * @param s
	 * @return
	 */
	public static int length(String s) {  
	       if (s == null)  
	           return 0;  
	       char[] c = s.toCharArray();  
	       int len = 0;  
	       for (int i = 0; i < c.length; i++) {  
	           len++;  
	           if (!isLetter(c[i])) {  
	               len++;  
	           }  
	       }  
	       return len;  
	} 
	
	private static boolean isLetter(char c) {   
	       int k = 0x80;   
	       return c / k == 0 ? true : false;   
    }
}

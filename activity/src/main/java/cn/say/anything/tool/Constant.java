package cn.say.anything.tool;

import javax.servlet.ServletContext;

public class Constant {

	public static String ROOTPATH = "";
	public static String CLASSPATH = "";
	public static ServletContext context = null;

	public static String RESSUFFIX = "";

	public static String CHARSET = "utf-8";

	public static void init() {
		RESSUFFIX = SuperString.notNull(Util.getProperties("RES_SUFFIX"));
	}

	/**
	 * 当添加一个新模块，先在act_module表里添加一条记录
	 * 此次出定义每个模块的操作权限：act_module表里的module_id
	 */
	public static final String ADMIN_ROLE = "1";
	public static final String YYG_PERMISSION_KEY = "YYG";
	public static final String FLS_PERMISSION_KEY = "FLS";
	public static final String MESSAGE_PERMISSION_KEY = "MESSAGE";
	public static final String COMMENT_PERMISSION_KEY = "COMMENT";
}
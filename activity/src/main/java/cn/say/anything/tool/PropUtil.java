package cn.say.anything.tool;

import java.io.FileInputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class PropUtil {
	private static Log logger = LogFactory.getLog(PropUtil.class);

	private static Map<String, Properties> propsM = new HashMap<String, Properties>();

	public static void init(String propFiles) throws Exception {
		if (SuperString.notNullTrim(propFiles).equals("")){
			return;
		}
		String[] properties = propFiles.split(",");
		for (int i = 0; i < properties.length; i++) {
			propsM.put(properties[i], loadProperties(properties[i]));
		}
		Constant.init();
		logger.info("");
		logger.info("*************** Properties File Reloading ... OK ****************");
		logger.info("");
	}

	public static Properties getInstance(String fileName) {
		return propsM.get(fileName + ".properties");
	}

	public static Properties loadProperties(String fileName) throws Exception {
		Properties properties = new Properties();
		String filepath = Constant.CLASSPATH + fileName;
		properties.load(new FileInputStream(filepath));
		return properties;
	}
}

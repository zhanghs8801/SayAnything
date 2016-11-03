package cn.say.anything.tool;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

public class HttpUtil {
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
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	}

	public static String doPost(String urlstring, Map<String, String> parameters) throws Exception {
		URL url = new URL(urlstring);
		HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
		httpURLConnection.setDoOutput(true);
		httpURLConnection.setDoInput(true);
		httpURLConnection.setRequestMethod("POST");
		httpURLConnection.setConnectTimeout(50000);
		httpURLConnection.setReadTimeout(50000);
		httpURLConnection.connect();
		StringBuilder s = new StringBuilder();
		String[] array = parameters.keySet().toArray(new String[0]);
		for (int i = 0; i < array.length; i++) {
			s.append(array[i] + "=" + parameters.get(array[i]));
			if (i != array.length - 1) {
				s.append("&");
			}
		}
		BufferedWriter out = new BufferedWriter(new OutputStreamWriter(httpURLConnection.getOutputStream(), "utf-8"));
		out.write(s.toString());
		out.flush();
		out.close();

		// 读取post之后的返回值
		BufferedReader in = new BufferedReader(new InputStreamReader((InputStream) httpURLConnection.getInputStream(), "utf-8"));
		String line = null;
		StringBuilder sb = new StringBuilder();
		while ((line = in.readLine()) != null) {
			sb.append(line);
		}
		in.close();
		httpURLConnection.disconnect();// 断开连接
		return sb.toString();
	}

}

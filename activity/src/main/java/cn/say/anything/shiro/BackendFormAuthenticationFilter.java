package cn.say.anything.shiro;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.stereotype.Service;

import cn.say.anything.tool.Constant;

@Service
public class BackendFormAuthenticationFilter extends FormAuthenticationFilter{
	
	@Override
	protected boolean preHandle(ServletRequest servletRequest, ServletResponse servletResponse) throws Exception {
		Subject currentSubject = SecurityUtils.getSubject();
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		if (currentSubject != null && currentSubject.isAuthenticated() && request.getRequestURI().endsWith("login.jsp")) {
			return redirect(currentSubject, servletRequest, servletResponse);
		} 
		boolean result = super.preHandle(servletRequest, servletResponse);
		return result;
	}
	
	@Override
	protected String getPassword(ServletRequest request) {
		String password = super.getPassword(request);
		Md5Hash md5Hash = new Md5Hash(password);
		String tokenCredentials = md5Hash.toString();
		return tokenCredentials;
	}
	
	@Override
	protected AuthenticationToken createToken(ServletRequest request, ServletResponse response) {
		return new UsernamePasswordToken(getUsername(request), getPassword(request));
	}
	
	@Override
	protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request, ServletResponse response) throws Exception {
		WebUtils.getAndClearSavedRequest(request);// 清除原先的请求地址
		return redirect(subject, request, response);
	}
	
	private boolean redirect(Subject subject, ServletRequest request, ServletResponse response) throws Exception {
		if (subject.hasRole(Constant.ADMIN_ROLE)) {
			WebUtils.redirectToSavedRequest(request, response, "/users");
			return true;
		}
		if (subject.isPermitted(Constant.YYG_PERMISSION_KEY)) {
			WebUtils.redirectToSavedRequest(request, response, "/queryLogisticsInfo");
			return true;
		}
		if (subject.isPermitted(Constant.FLS_PERMISSION_KEY)) {
			WebUtils.redirectToSavedRequest(request, response, "/couponList");
			return true;
		}
		if (subject.isPermitted(Constant.MESSAGE_PERMISSION_KEY)) {
			WebUtils.redirectToSavedRequest(request, response, "/messages");
			return true;
		}
		if (subject.isPermitted(Constant.COMMENT_PERMISSION_KEY)) {
			WebUtils.redirectToSavedRequest(request, response, "/comments");
			return true;
		}
		return false;
	}
	
	@Override
	protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request, ServletResponse response) {
		String message = "";
        if (e instanceof IncorrectCredentialsException || e instanceof UnknownAccountException){
            message = "用户或密码错误, 请重试.";
        } else if (e.getMessage() != null && e.getMessage().startsWith("msg:")){
            message = StringUtils.replace(e.getMessage(), "msg:", "");
        } else{
            message = "系统出现点问题，请稍后再试！";
            e.printStackTrace();
        }
        request.setAttribute(getFailureKeyAttribute(), e.getClass().getName());
        request.setAttribute("message", message);
        return true;
	}
}

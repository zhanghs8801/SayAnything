package cn.say.anything.shiro;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cn.say.anything.bean.BackendUser;
import cn.say.anything.service.BackendUserService;
import cn.say.anything.service.PermissionService;

@Component
public class BackendAuthorizingRealm extends AuthorizingRealm{
	@Autowired
	private BackendUserService userService;
	@Autowired
	private PermissionService permService;
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principal) {
		String username = (String) principal.getPrimaryPrincipal();
		List<BackendUser> users = userService.queryUserByName(username);
		if (users == null || users.size() == 0) {
			return null;
		}
		BackendUser user = users.get(0);
		Set<String> roles = new HashSet<String>();
		roles.add(String.valueOf(user.getRoleId()));

		List<String> perms = null;
		if(user.getRoleId() == 1){
			// 添加所有权限
			perms = permService.getAllPermissions();
		}else{
			perms = permService.getPermissions(username);
		}
		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
		authorizationInfo.setRoles(roles);
		if (perms != null && perms.size() > 0) {
			authorizationInfo.setStringPermissions(new HashSet<String>(perms));
		}
		return authorizationInfo;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		UsernamePasswordToken usernamePasswordToken = (UsernamePasswordToken) token;
		String userName = usernamePasswordToken.getUsername();
		if(StringUtils.isEmpty(userName)){
			return null;			
		}
		
		List<BackendUser> users = userService.queryUserByName(userName);
		if(users == null || users.size() == 0){
			return null;
		}
		
		BackendUser user = users.get(0);
		if(user == null){
			return null;
		}
		// 登录成功后跳转到Shiro的successUrl对应的url里，这个是由Shiro自己来完成，不需要LoginController之类的代码
		return new SimpleAuthenticationInfo(userName, user.getPassword(), user.getUsername());
	}

}

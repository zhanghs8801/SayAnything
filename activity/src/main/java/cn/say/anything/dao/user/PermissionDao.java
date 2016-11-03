package cn.say.anything.dao.user;

import java.util.List;

import cn.say.anything.bean.Permission;

public interface PermissionDao {
	public List<String> getAllPermissions();
	
	public Permission getPermission(String username, String moduleId);
	
	public List<String> getPermissions(String username);
	
	public void addPermission(String username, String moudle_id);
	
	public void deletePermission(String username, String moduleId);
	
	public void deletePermissionByUser(String username);
}

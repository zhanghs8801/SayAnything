package cn.say.anything.service;

import java.util.List;

import cn.say.anything.bean.Permission;

public interface PermissionService {
	
	public Permission getPermission(String username, String moduleId);

	public List<String> getAllPermissions();

	public List<String> getPermissions(String username);

	public void addPermission(String username, String moudle_id);

	public void deletePermission(String username, String moduleId);
}

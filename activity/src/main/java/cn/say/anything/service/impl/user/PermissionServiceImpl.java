package cn.say.anything.service.impl.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.say.anything.bean.Module;
import cn.say.anything.bean.Permission;
import cn.say.anything.dao.user.ModuleDao;
import cn.say.anything.dao.user.PermissionDao;
import cn.say.anything.service.PermissionService;

@Service
public class PermissionServiceImpl implements PermissionService{

	@Autowired
	private PermissionDao permDao;
	@Autowired
	private ModuleDao moduleDao;
	
	@Override
	public List<String> getAllPermissions() {
		List<Module> allModules = moduleDao.getModules();
		List<String> allPermissions = new ArrayList<String>();
		for (Module module : allModules) {
			allPermissions.add(module.getModuleId());
		}
		return allPermissions;
	}
	
	@Override
	public Permission getPermission(String username, String moduleId) {
		return permDao.getPermission(username, moduleId);
	}

	@Override
	public List<String> getPermissions(String username) {
		return permDao.getPermissions(username);
	}

	@Override
	public void addPermission(String username, String moudle_id) {
		permDao.addPermission(username, moudle_id);
	}

	@Override
	public void deletePermission(String username, String moduleId) {
		permDao.deletePermission(username, moduleId);
	}

}

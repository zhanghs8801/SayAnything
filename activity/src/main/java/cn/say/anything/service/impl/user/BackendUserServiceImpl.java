package cn.say.anything.service.impl.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.say.anything.bean.BackendUser;
import cn.say.anything.dao.user.BackendUserDao;
import cn.say.anything.dao.user.BaseDao;
import cn.say.anything.dao.user.PermissionDao;
import cn.say.anything.service.BackendUserService;

@Service
public class BackendUserServiceImpl extends BaseServiceImpl<BackendUser> implements BackendUserService {
	@Autowired
	private BackendUserDao userDao;
	@Autowired
	private PermissionDao permDao;
	
	@Override
	public List<BackendUser> queryAllUser() {
		return userDao.queryAllUser();
	}
	@Override
	public BackendUser queryUser(String username, String password) {
		return null;
	}

	@Override
	public List<BackendUser> queryUserByName(String username) {
		return userDao.queryUserByName(username);
	}
	
	@Override
	@Transactional
	public void addUser(BackendUser user, String[] moduleIds) {
		userDao.addUser(user);
		String username = user.getUsername();
		for(String moduleId: moduleIds){
			permDao.addPermission(username, moduleId);
		}
	}
	
	@Override
	@Transactional
	public void updateUser(BackendUser user, String[] moduleIds) {
		userDao.updateUser(user);
		String username = user.getUsername();
		
		if(user.getRoleId() == 1){
			// 系统管理员拥有所有模块的操作权限，因此删除掉permission表里的所有相关记录
			permDao.deletePermissionByUser(username);
			return ;
		}
		
		List<String> permList = permDao.getPermissions(username);
		if (permList == null || permList.size() == 0) {
			for (String moduleId : moduleIds) {
				permDao.addPermission(username, moduleId);
			}
			return;
		}
		List<String> samePerm = new ArrayList<String>();
		
		for (String moduleId : moduleIds) {
			// 区分开新建还是删除的
			if (permList.contains(moduleId)) {
				samePerm.add(moduleId);
			}
		}
		
		for (String perm : permList) {
			if (samePerm.contains(perm)) {
				continue;
			}
			permDao.deletePermission(username, perm);
		}

		for (String moduleId : moduleIds) {
			if (samePerm.contains(moduleId)) {
				continue;
			}
			permDao.addPermission(username, moduleId);
		}
	}
	
	@Override
	@Transactional
	public void deleteBeanById(int id) {
		BackendUser user = super.getBeanById(id);
		super.deleteBeanById(id);
		permDao.deletePermissionByUser(user.getUsername());
	}

	@Override
	protected BaseDao<BackendUser> getBaseDao() {
		return userDao;
	}
}

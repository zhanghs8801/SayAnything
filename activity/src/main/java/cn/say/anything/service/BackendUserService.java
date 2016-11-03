package cn.say.anything.service;

import java.util.List;

import cn.say.anything.bean.BackendUser;

public interface BackendUserService extends BaseService<BackendUser>{
	
	public List<BackendUser> queryAllUser();
	
	public List<BackendUser> queryUserByName(String username);

	public BackendUser queryUser(String username, String password);
	
	public void addUser(BackendUser user, String[] moduleIds);

	public void updateUser(BackendUser user, String[] moduleIds);
}

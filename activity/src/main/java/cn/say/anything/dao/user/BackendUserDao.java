package cn.say.anything.dao.user;

import java.util.List;

import cn.say.anything.bean.BackendUser;

public interface BackendUserDao extends BaseDao<BackendUser>{
	public List<BackendUser> queryAllUser();
	
	public List<BackendUser> queryUserByName(String username);
	
	public BackendUser queryUser(String username, String password);
	
	public long addUser(BackendUser user);
	
	public void updateUser(BackendUser user);

}

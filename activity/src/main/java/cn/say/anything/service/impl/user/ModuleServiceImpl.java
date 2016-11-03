package cn.say.anything.service.impl.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.say.anything.bean.Module;
import cn.say.anything.dao.user.ModuleDao;
import cn.say.anything.service.ModuleService;

@Service
public class ModuleServiceImpl implements ModuleService{
	@Autowired
	private ModuleDao moduleDao;
	@Override
	public List<Module> getModules() {
		return moduleDao.getModules();
	}

}

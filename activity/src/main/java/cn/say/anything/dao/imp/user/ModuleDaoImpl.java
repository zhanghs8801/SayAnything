package cn.say.anything.dao.imp.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import cn.say.anything.bean.Module;
import cn.say.anything.dao.user.ModuleDao;

@Repository
public class ModuleDaoImpl implements ModuleDao {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public List<Module> getModules() {
		String querySql = "select * from act_module";
		return jdbcTemplate.query(querySql, new BeanPropertyRowMapper<Module>(
				Module.class));
	}

}

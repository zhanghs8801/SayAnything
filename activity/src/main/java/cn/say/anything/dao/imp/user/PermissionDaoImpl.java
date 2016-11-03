package cn.say.anything.dao.imp.user;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.stereotype.Repository;

import cn.say.anything.bean.Permission;
import cn.say.anything.dao.user.PermissionDao;

@Repository
public class PermissionDaoImpl implements PermissionDao {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public List<String> getAllPermissions() {
		String sql = "select module_id from act_permission";
		return jdbcTemplate.queryForList(sql, String.class);
	}

	@Override
	public Permission getPermission(String username, String moduleId) {
		String sql = "select * from act_permission where username=? and module_id=?";
		return jdbcTemplate.queryForObject(sql, new Object[] { username, moduleId }, new BeanPropertyRowMapper<Permission>(Permission.class));
	}

	@Override
	public List<String> getPermissions(String username) {
		String sql = "select module_id from act_permission where username=?";
		return jdbcTemplate.queryForList(sql, String.class, new Object[] { username });
	}

	@Override
	public void addPermission(final String username, final String moudle_id) {
		final String sql = "INSERT INTO act_permission(username,module_id,createtime) VALUES(?,?,now())";
		jdbcTemplate.update(new PreparedStatementCreator() {
			@Override
			public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
				PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
				ps.setString(1, username);
				ps.setString(2, moudle_id);
				return ps;
			}
		});
	}

	@Override
	public void deletePermission(String username, String moduleId) {
		String sql = "delete from act_permission where username=? and module_id = ?";
		jdbcTemplate.update(sql, new Object[] { username, moduleId });
	}

	@Override
	public void deletePermissionByUser(String username) {
		String sql = "delete from act_permission where username=?";
		jdbcTemplate.update(sql, new Object[] { username });
	}

}

package cn.say.anything.dao.imp.user;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import cn.say.anything.bean.BackendUser;
import cn.say.anything.dao.user.BackendUserDao;

@Repository
public class BackendUserDaoImpl extends BaseDaoImpl<BackendUser> implements BackendUserDao {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Override
	protected String getTableName() {
		return "act_sys_user";
	}
	
	@Override
	protected Map<String, String> getConditionMap(BackendUser user) {
		Map<String, String> conditionsMap = new HashMap<String, String>();
		if (StringUtils.isNotEmpty(user.getUsername())) {
			conditionsMap.put("u.username LIKE ?", "%" + user.getUsername() + "%");
		}
		return conditionsMap;
	}
	
	@Override
	public List<BackendUser> queryAllUser() {
		String querySql = "select * from " + getTableName();
		List<BackendUser> users = jdbcTemplate.query(querySql, new BeanPropertyRowMapper<BackendUser>(BackendUser.class));
		return users;
	}

	@Override
	public BackendUser queryUser(String userName, String password) {
		return null;
	}

	@Override
	public List<BackendUser> queryUserByName(String username) {
		String querySql = "select * from " + getTableName() + " where username=?";
		List<BackendUser> users = jdbcTemplate.query(querySql, new Object[] { username }, new BeanPropertyRowMapper<BackendUser>(BackendUser.class));
		return users;
	}
	
	@Override
	public long addUser(final BackendUser user) {
		KeyHolder keyHolder = new GeneratedKeyHolder();
		final String sql = "INSERT INTO " + getTableName() + "(username,password,role_id,updatetime,createtime) VALUES(?,?,?,now(),now())";
		jdbcTemplate.update(new PreparedStatementCreator() {
			@Override
			public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
				PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
				ps.setString(1, user.getUsername());
				ps.setString(2, toMd5(user.getPassword()));
				ps.setInt(3, user.getRoleId());
				return ps;
			}
		}, keyHolder);
		return keyHolder.getKey().intValue();
	}
	
	@Override
	public void updateUser(BackendUser user) {
		String sql = "UPDATE " + getTableName() + " set username = ?, password=?, role_id = ?,updatetime = ? WHERE id = ?";
		jdbcTemplate.update(sql, new Object[]{user.getUsername(), toMd5(user.getPassword()), user.getRoleId(), new Date(), user.getId()});
	}
	
	private String toMd5(String password) {
		Md5Hash md5Hash = new Md5Hash(password);
		String tokenCredentials = md5Hash.toString();
		return tokenCredentials;
	}

}

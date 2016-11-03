package cn.say.anything.dao.imp.user;

import java.lang.reflect.ParameterizedType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import cn.say.anything.bean.QueryPageInfo;
import cn.say.anything.bean.QueryPageResult;
import cn.say.anything.dao.user.BaseDao;
import cn.say.anything.tool.SqlHelper;

public abstract class BaseDaoImpl<T> implements BaseDao<T>{
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Override
	public QueryPageResult<T> queryPageInfo(QueryPageInfo queryPageInfo, T bean) {
		Map<String, String> conditionsMap = getConditionMap(bean);
		SqlHelper sqlHelper = new SqlHelper("FROM "+getTableName(), "u");
		for (Map.Entry<String, String> entry : conditionsMap.entrySet()) {
			sqlHelper.addWhereCondition(true, entry.getKey(), entry.getValue());
		}

		sqlHelper.addOrderCondition(true, "u.createtime DESC");
		sqlHelper.addLimitCondition(" LIMIT ?, ?", queryPageInfo.getStartIndex(), queryPageInfo.getPageSize());

		List<T> logisticsInfoList = jdbcTemplate.query("SELECT * " + sqlHelper.getSqlList(), sqlHelper.getListParameters().toArray(), new BeanPropertyRowMapper<T>(getParamedClass()));
		int count = jdbcTemplate.queryForObject(sqlHelper.getSqlCount(), sqlHelper.getCountParameters().toArray(), Integer.class);

		return new QueryPageResult<T>(logisticsInfoList, count);
	}

	@Override
	public T getBeanById(int id) {
		return jdbcTemplate.queryForObject("SELECT * FROM " + getTableName() + " WHERE id = ?", new Object[] { id }, new BeanPropertyRowMapper<T>(getParamedClass()));
	}

	@Override
	public void deleteBeanById(int id) {
		String sql = "delete from " + getTableName() + " where id=?";
		jdbcTemplate.update(sql, new Object[] { id });
	}

	@SuppressWarnings("unchecked")
	public final Class<T> getParamedClass(){
        Class<T> entityClass = (Class<T>) ((ParameterizedType) this.getClass().getGenericSuperclass()).getActualTypeArguments()[0];
        return entityClass;
    }
	
	protected String getTableName(){
		return null;
	}
	
	protected Map<String, String> getConditionMap(T bean){
		return new HashMap<String, String>();
	}
}

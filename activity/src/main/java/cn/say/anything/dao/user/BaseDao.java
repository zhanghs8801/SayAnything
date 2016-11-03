package cn.say.anything.dao.user;

import cn.say.anything.bean.QueryPageInfo;
import cn.say.anything.bean.QueryPageResult;

public interface BaseDao<T> {
	/**
	 * 分页查询
	 * 
	 * @param queryPageInfo
	 * @param bean
	 * @return
	 */
	public QueryPageResult<T> queryPageInfo(QueryPageInfo queryPageInfo, T bean);

	/**
	 * 根据id查询实体对象
	 * 
	 * @param id
	 * @return
	 */
	public T getBeanById(int id);

	/**
	 * 删除实体对象
	 * 
	 * @param id
	 */
	public void deleteBeanById(int id);
}

package cn.say.anything.service;

import cn.say.anything.bean.QueryPageBean;
import cn.say.anything.bean.QueryPageInfo;

public interface BaseService<T> {
	/**
	 * 分页查询
	 * 
	 * @param queryPageInfo
	 * @param t
	 * @return
	 */
	public QueryPageBean<T> queryPageInfo(QueryPageInfo queryPageInfo, T bean);

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

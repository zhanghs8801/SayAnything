package cn.say.anything.service.impl.user;


import org.springframework.stereotype.Service;

import cn.say.anything.bean.QueryPageBean;
import cn.say.anything.bean.QueryPageInfo;
import cn.say.anything.bean.QueryPageResult;
import cn.say.anything.dao.user.BaseDao;
import cn.say.anything.service.BaseService;

@Service
public abstract class BaseServiceImpl<T> implements BaseService<T> {
	protected abstract BaseDao<T> getBaseDao();

	@Override
	public QueryPageBean<T> queryPageInfo(QueryPageInfo queryPageInfo,  T bean) {
		int startIndex = queryPageInfo.getStartIndex();
		int pageSize = queryPageInfo.getPageSize();

		QueryPageResult<T> queryResult = getBaseDao().queryPageInfo(queryPageInfo, bean);
		QueryPageBean<T> queryPageBean = new QueryPageBean<T>();
		queryPageBean.setCurrentPage(queryPageInfo.getCurrentPage());
		queryPageBean.setStartIndex(startIndex);
		queryPageBean.setPageSize(pageSize);

		queryPageBean.setList(queryResult.getList());
		queryPageBean.setTotalRecord(queryResult.getCount());
		return queryPageBean;
	}

	@Override
	public T getBeanById(int id) {
		return getBaseDao().getBeanById(id);
	}

	@Override
	public void deleteBeanById(int id) {
		getBaseDao().deleteBeanById(id);
	}

}

package cn.say.anything.bean;

import java.util.List;

public class QueryPageResult<T> {
	private List<T> list;

	private int count;

	public QueryPageResult(List<T> list, int count) {
		super();
		this.list = list;
		this.count = count;
	}

	public List<T> getList() {
		return list;
	}

	public void setList(List<T> list) {
		this.list = list;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

}

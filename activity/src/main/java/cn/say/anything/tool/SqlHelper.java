package cn.say.anything.tool;

import java.util.ArrayList;
import java.util.List;

public class SqlHelper {
	private String formClause = "";
	private String whereClause = "";
	private String orderClause = "";
	private String limitClause = "";
	private List<Object> listParameters = new ArrayList<Object>();
	private List<Object> countParameters = new ArrayList<Object>();

	public SqlHelper() {}
	
	public SqlHelper(String fromClause, String alias) {
		this.formClause = fromClause + " " + alias;
	}

	public SqlHelper addWhereCondition(boolean append, String condition,
			Object... params) {
		if (append) {
			this.addWhereCondition(condition, params);
		}
		return this;
	}

	public void addWhereCondition(String condition, Object... params) {
		if (this.whereClause.length() == 0) {
			this.whereClause = " WHERE " + condition;
		} else {
			this.whereClause = this.whereClause + " AND " + condition;
		}
		for (int i = 0; params != null && i < params.length; i++) {
			this.listParameters.add(params[i]);
		}
		for (int i = 0; params != null && i < params.length; i++) {
			this.countParameters.add(params[i]);
		}
	}

	public SqlHelper addOrderCondition(boolean append, String condition,
			Object... params) {
		if (append) {
			this.addOrderCondition(condition, params);
		}
		return this;
	}

	public void addOrderCondition(String condition, Object... params) {
		if (this.orderClause.length() == 0) {
			this.orderClause = " ORDER BY " + condition;
		} else {
			this.orderClause = this.orderClause + ", " + condition;
		}
		for (int i = 0; params != null && i < params.length; i++) {
			this.listParameters.add(params[i]);
		}
		for (int i = 0; params != null && i < params.length; i++) {
			this.countParameters.add(params[i]);
		}
	}

	public SqlHelper addLimitCondition(String condition, Object... params) {
		this.limitClause = this.limitClause + condition;
		for (int i = 0; params != null && i < params.length; i++) {
			this.listParameters.add(params[i]);
		}
		return this;
	}

	public String getSqlList() {
		return this.formClause + this.whereClause + this.orderClause + this.limitClause;
	}

	public String getSqlCount() {
		return "SELECT COUNT(*) " + this.formClause + this.whereClause;
	}

	public List<Object> getListParameters() {
		return listParameters;
	}

	public List<Object> getCountParameters() {
		return countParameters;
	}

}

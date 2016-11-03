package cn.say.anything.bean;

import java.io.Serializable;
import java.util.Date;

public class Permission implements Serializable {
	private static final long serialVersionUID = -2241912598821488253L;
	private int id;
	private String username;
	private String moduleId;
	private Date createtime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getModuleId() {
		return moduleId;
	}

	public void setModuleId(String moduleId) {
		this.moduleId = moduleId;
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
}

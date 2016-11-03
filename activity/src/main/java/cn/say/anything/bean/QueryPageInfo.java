package cn.say.anything.bean;

public class QueryPageInfo {
	private int currentPage;
	private int pageSize;
	private int startIndex;

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getStartIndex() {
		this.startIndex = (this.currentPage - 1) * this.pageSize;
		if(startIndex < 0) {
			startIndex = 0;
		}
		return startIndex;
	}
   }

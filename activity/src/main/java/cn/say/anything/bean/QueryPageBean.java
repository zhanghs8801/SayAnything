package cn.say.anything.bean;

import java.util.List;

public class QueryPageBean<T> {
	private List<T> list;
	private int totalRecord;
	private int currentPage;
	private int pageSize;
	private int startIndex;
	private int totalPage;
	private int previousPage;
	private int nextPage;
	private int[] pageBar;

	public List<T> getList() {
		return list;
	}

	public void setList(List<T> list) {
		this.list = list;
	}

	public int getTotalRecord() {
		return totalRecord;
	}

	public void setTotalRecord(int totalRecord) {
		this.totalRecord = totalRecord;
	}

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
		return startIndex;
	}

	public void setStartIndex(int startIndex) {
		this.startIndex = startIndex;
	}

	public int getTotalPage() {
		if(this.totalRecord % this.pageSize == 0) {
			this.totalPage = this.totalRecord / this.pageSize;
		}else {
			this.totalPage = this.totalRecord / this.pageSize + 1;
		}
		return totalPage;
	}

	public int getPreviousPage() {
		if(this.currentPage - 1 < 1) {
			this.previousPage = 1;
		}else {
			this.previousPage = this.currentPage - 1;
		}
		return previousPage;
	}

	public int getNextPage() {
		if(this.currentPage + 1 > this.totalPage) {
			this.nextPage = this.totalPage;
		}else {
			this.nextPage = this.currentPage + 1;
		}
		return nextPage;
	}

	public int[] getPageBar() {
		if(this.totalPage <= 10) {
			this.pageBar = new int[this.totalPage];
			for(int i=1; i<=this.totalPage; i++) {
				this.pageBar[i-1] = i;
			}
		}else {
			this.pageBar = new int[10];
			int startIndex = this.currentPage - 4;
			int endIndex = this.currentPage + 5;
			if(startIndex < 1) {
				startIndex = 1;
				endIndex = 10;
			}
			if(endIndex > this.totalPage) {
				endIndex = this.totalPage;
				startIndex = this.totalPage - 9;
			}
			for(int i=startIndex; i<=endIndex; i++) {
				this.pageBar[i-startIndex] = i;
			}
		}
		return pageBar;
	}
  }

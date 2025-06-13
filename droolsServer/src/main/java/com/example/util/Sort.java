package com.example.util;

public class Sort {

    public enum SortBy {
        PRIORITY,
        ASSIGNEDSHIFTINWEEK
    }

    public enum SortType {
        ASCENDING,
        DESCENDING
    }

    private boolean sortEnabled;
    private SortBy sortBy;
    private SortType sortType;

    public Sort() {
        this.sortEnabled = false;
        this.sortBy = SortBy.PRIORITY;
        this.sortType = SortType.ASCENDING;
    }

    public Sort(boolean sortEnabled, SortBy sortBy, SortType sortType) {
        this.sortEnabled = sortEnabled;
        this.sortBy = sortBy;
        this.sortType = sortType;
    }

    public boolean getSortEnabled() {
        return sortEnabled;
    }

    public void setSortEnabled(boolean sortEnabled) {
        this.sortEnabled = sortEnabled;
    }

    public SortBy getSortBy() {
        return sortBy;
    }

    public void setSortBy(SortBy sortBy) {
        this.sortBy = sortBy;
    }

    public SortType getSortType() {
        return sortType;
    }

    public void setSortType(SortType sortType) {
        this.sortType = sortType;
    }
}

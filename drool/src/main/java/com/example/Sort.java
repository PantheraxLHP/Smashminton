package com.example;

import com.smashminton.rule_engine.entities.DroolsSort;

public class Sort extends DroolsSort {
    public static enum SortType {
        ASCENDING,
        DESCENDING
    }

    public static enum SortBy {
        PRIORITY,
        ASSIGNEDSHIFTINWEEK
    }

    private Sort() {
        super();
    }
} 
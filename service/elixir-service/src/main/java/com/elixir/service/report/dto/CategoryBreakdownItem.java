package com.elixir.service.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryBreakdownItem {

    private Long categoryId;

    private String categoryName;

    private BigDecimal revenue;

    private Long unitsSold;

    private Double revenuePercentage;
}

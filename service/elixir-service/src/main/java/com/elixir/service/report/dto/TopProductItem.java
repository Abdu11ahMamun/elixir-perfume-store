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
public class TopProductItem {

    private Integer rank;

    private String productName;

    private String categoryName;

    private Long unitsSold;

    private BigDecimal revenue;
}

package com.example.Jay_Lighting_Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;

import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String item_code;
    private String item_name;
    private int quantity;
    private int rest_quantity;
    private double unit_price_per_day;
    private Long barcode;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItem_code() {
        return item_code;
    }

    public void setItem_code(String item_code) {
        this.item_code = item_code;
    }

    public String getItem_name() {
        return item_name;
    }

    public void setItem_name(String item_name) {
        this.item_name = item_name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getRest_quantity() {
        return rest_quantity;
    }

    public void setRest_quantity(int rest_quantity) {
        this.rest_quantity = rest_quantity;
    }

    public double getUnit_price_per_day() {
        return unit_price_per_day;
    }

    public void setUnit_price_per_day(double unit_price_per_day) {
        this.unit_price_per_day = unit_price_per_day;
    }

    public Long getBar_code() {
        return barcode;
    }

    public void setBar_code(Long barcode) {
        this.barcode = barcode;
    }

}

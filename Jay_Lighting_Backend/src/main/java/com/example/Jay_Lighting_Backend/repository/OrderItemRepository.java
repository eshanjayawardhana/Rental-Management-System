package com.example.Jay_Lighting_Backend.repository;

import com.example.Jay_Lighting_Backend.model.OrderItem;
import com.example.Jay_Lighting_Backend.model.RentalOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Modifying
    @Query("DELETE FROM OrderItem o WHERE o.rentalOrder = :rentalOrder")
    void deleteByRentalOrder(@Param("rentalOrder") RentalOrder rentalOrder);

}

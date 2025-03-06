package com.example.Jay_Lighting_Backend.service;

import com.example.Jay_Lighting_Backend.exception.RentalOrderNotFoundException;
import com.example.Jay_Lighting_Backend.model.OrderItem;
import com.example.Jay_Lighting_Backend.model.Product;
import com.example.Jay_Lighting_Backend.model.RentalOrder;
import com.example.Jay_Lighting_Backend.repository.OrderItemRepository;
import com.example.Jay_Lighting_Backend.repository.ProductRepository;
import com.example.Jay_Lighting_Backend.repository.RentalOrderRepository;
//import jakarta.persistence.EntityManager;
//import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
//import jdk.dynalink.Operation;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
//import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class RentalOrderService {

    private final RentalOrderRepository rentalOrderRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

//    @PersistenceContext
//    private EntityManager entityManager;

//    private List<Operation> operationQueue; // ✅ Initialize it properly
//
//    // Example method using operationQueue
//    public void processOperationQueue() {
//        if (operationQueue == null) {
//            throw new RuntimeException("Operation queue is null!"); // Debugging
//        }
//        System.out.println("Operation queue size: " + operationQueue.size());
//        return;
//    }

    public RentalOrderService(RentalOrderRepository rentalOrderRepository, ProductRepository productRepository, OrderItemRepository orderItemRepository) {
        this.rentalOrderRepository = rentalOrderRepository;
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
//        this.operationQueue = new ArrayList<>(); // ✅ Correctly initialize it

    }

    // Save the rental order first
    @Transactional
    public RentalOrder createRentalOrder(RentalOrder rentalOrder) {
        // Set the order date
        rentalOrder.setDate(LocalDateTime.now());

        // Calculate total price
        double totalPrice = 0;
        for (OrderItem item : rentalOrder.getOrderItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Check product quantity
            if(product.getRest_quantity() < item.getQuantity()){
                throw new RuntimeException("Insufficient quantity for product: " + product.getItem_name());
            }

            // Update product quantity
            product.setRest_quantity(product.getRest_quantity() - item.getQuantity());
            productRepository.save(product);

            // Set unit price from product
            item.setUnit_price_per_day(product.getUnit_price_per_day());

            // Calculate item price
            double itemPrice = ((product.getUnit_price_per_day() * item.getQuantity()) * rentalOrder.getRentalPeriod());
            totalPrice += itemPrice;

            // Link order item to rental order
            item.setRentalOrder(rentalOrder);
        }



        // Set total price
        rentalOrder.setTotalPrice(totalPrice);

        // Save rental order and order items
        return rentalOrderRepository.save(rentalOrder);
    }

    // Get all rental orders
    public List<RentalOrder> getAllRentalOrders() {
        return rentalOrderRepository.findAll();
    }

    // Get a rental order by ID
    public RentalOrder getRentalOrderById(Long id){
        return rentalOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("RentalOrder not found with id: " + id));
    }

    // update RentalOrder by ID
    @Transactional
    public RentalOrder updateRentalOrderById(Long id, RentalOrder updatedOrder) {
        Optional<RentalOrder> existingOrderOptional = rentalOrderRepository.findById(id);

        if (existingOrderOptional.isPresent()) {
            RentalOrder existingOrder = existingOrderOptional.get();

            // Clear existing order items properly before setting new ones
            existingOrder.getOrderItems().clear();
            rentalOrderRepository.save(existingOrder);  // Save to remove old items

            // Now set updated data
            existingOrder.setDate(updatedOrder.getDate());
            existingOrder.setCustomerName(updatedOrder.getCustomerName());
            existingOrder.setAddress(updatedOrder.getAddress());
            existingOrder.setNicNo(updatedOrder.getNicNo());
            existingOrder.setEmail(updatedOrder.getEmail());
            existingOrder.setPhoneNumber(updatedOrder.getPhoneNumber());
            existingOrder.setRentalPeriod(updatedOrder.getRentalPeriod());
            existingOrder.setTotalPrice(updatedOrder.getTotalPrice());

            // Set the new order items
            double totalPrice = 0;
            for (OrderItem item : updatedOrder.getOrderItems()) {

                Product product = productRepository.findById(item.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                // Check product quantity
                if(product.getRest_quantity() < item.getQuantity()){
                    throw new RuntimeException("Insufficient quantity for product: " + product.getItem_name());
                }

                // Update product quantity
                product.setRest_quantity(product.getRest_quantity() - item.getQuantity());
                productRepository.save(product);

                item.setRentalOrder(existingOrder);  // Ensure proper linkage
                totalPrice += item.getQuantity() * item.getUnit_price_per_day() * updatedOrder.getRentalPeriod();
            }
            existingOrder.getOrderItems().addAll(updatedOrder.getOrderItems());
            existingOrder.setTotalPrice(totalPrice);


//            RentalOrder mergedOrder = entityManager.merge(existingOrder);
            return rentalOrderRepository.save(existingOrder);
        } else {
            throw new RuntimeException("Rental Order with ID " + id + " not found.");
        }
    }



    public RentalOrder deleteRentalOrderById(Long id){
        RentalOrder rentalOrder = rentalOrderRepository.findById(id).get();
        rentalOrderRepository.delete(rentalOrder);
        return rentalOrder;
    }

}


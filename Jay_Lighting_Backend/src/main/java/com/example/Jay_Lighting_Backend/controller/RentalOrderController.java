package com.example.Jay_Lighting_Backend.controller;

import com.example.Jay_Lighting_Backend.model.OrderItem;
import com.example.Jay_Lighting_Backend.model.Product;
import com.example.Jay_Lighting_Backend.model.RentalOrder;
import com.example.Jay_Lighting_Backend.repository.RentalOrderRepository;
import com.example.Jay_Lighting_Backend.service.RentalOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from any origin
public class RentalOrderController {

    @Autowired
    private RentalOrderService rentalOrderService;

    //Make a Rental order
    @PostMapping("/add")
    public ResponseEntity<RentalOrder> createOrder(@RequestBody RentalOrder rentalOrder){
        RentalOrder savedOrder = rentalOrderService.createRentalOrder(rentalOrder);
        return ResponseEntity.ok(savedOrder);
    }

    //get all Rental orders
    @GetMapping("/getAll")
    public List<RentalOrder> getAllRentalOrders(){
        return rentalOrderService.getAllRentalOrders();
    }

   // Get a Rental order by ID
    @GetMapping("/get/{id}") //search By rental order ID
    public RentalOrder getRentalOrderById(@PathVariable Long id){
        return rentalOrderService.getRentalOrderById(id);
    }

//    @GetMapping("/queue")
//    public void getQueueSize() {
//        rentalOrderService.processOperationQueue();
//        return;
//    }

    //Update Rental order by ID
    @PutMapping("/updateById/{id}")
    public RentalOrder updateRentalOrder(@PathVariable Long id, @RequestBody RentalOrder updatedOrder) {
        return rentalOrderService.updateRentalOrderById(id, updatedOrder);
    }

//    Delete Rental Order By Id
    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<String> deleteRentalOrderById(@PathVariable Long id){
        rentalOrderService.deleteRentalOrderById(id);
        return ResponseEntity.ok("Rental Order with ID " + id + " has been deleted successfully.");

    }


}

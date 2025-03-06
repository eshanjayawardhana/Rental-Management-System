package com.example.Jay_Lighting_Backend.controller;

import com.example.Jay_Lighting_Backend.model.Product;

import com.example.Jay_Lighting_Backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from any origin
public class productController {

    private final ProductService productService;

    public productController(ProductService productService){
        this.productService=productService;
    }

    //add product
    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product){
        return productService.addProduct(product);
    }

    //get all product
    @GetMapping("/get")
    public List<Product> getProducts(){
        return productService.getProducts();
    }

    //get product by ID
    @GetMapping("/getById/{id}")
    public Product getProductById(@PathVariable Long id){
        return productService.getProductById(id);
    }

    @GetMapping("/getByBarCode/{barcode}")
    public Product getProductByBarCode(@PathVariable Long barcode){
        return productService.getProductByBarCode(barcode);
    }


    //update product by ID
    @PutMapping("/updateById/{id}")
    public Product updateProductById(@PathVariable Long id, @RequestBody Product productDetails){
        return productService.updateProductById(id,productDetails);
    }

    // Delete product by ID
    @DeleteMapping("/deleteById/{id}")
    public Product deleteProductById(@PathVariable Long id){
        return productService.deleteProductById(id);

    }


}

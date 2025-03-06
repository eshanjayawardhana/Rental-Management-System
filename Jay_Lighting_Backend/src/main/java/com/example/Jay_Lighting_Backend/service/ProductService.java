package com.example.Jay_Lighting_Backend.service;

import com.example.Jay_Lighting_Backend.model.Product;
import com.example.Jay_Lighting_Backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;

    }

    //add a product
    public Product addProduct(Product product){
        return productRepository.save(product);
    }

    //get all product
    public List<Product> getProducts(){
        return productRepository.findAll();
    }

    //get product by id
    public Product getProductById(Long id){
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found with ID: " + id)); // no product exists with that ID, it throws an exception.
    }

    //get product by barcode
    public Product getProductByBarCode(Long bar_code){
        Optional<Product> product = productRepository.findByBarcode(bar_code);

        if (product.isPresent()){
            return product.get();
        }else {
            throw new RuntimeException("Product not found with barcode: " + bar_code);
        }
    }

    //update product by ID
    public Product updateProductById(Long id, Product productDetails){
        Product product = productRepository.findById(id).get();

//            Product product = product.get();

            product.setItem_code(productDetails.getItem_code());
            product.setItem_name(productDetails.getItem_name());
            product.setQuantity(productDetails.getQuantity());
            product.setRest_quantity(productDetails.getRest_quantity());
            product.setUnit_price_per_day(productDetails.getUnit_price_per_day());
            product.setBar_code((productDetails.getBar_code()));

            return productRepository.save(product);



    }

    // Delete product by ID
    public Product deleteProductById(Long id){
        Product product = productRepository.findById(id).get();
        productRepository.delete(product);

        return product;
    }



}

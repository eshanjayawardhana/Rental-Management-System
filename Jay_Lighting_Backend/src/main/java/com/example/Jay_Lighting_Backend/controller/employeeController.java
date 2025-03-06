package com.example.Jay_Lighting_Backend.controller;

import com.example.Jay_Lighting_Backend.model.Employee;
import com.example.Jay_Lighting_Backend.model.Product;
import com.example.Jay_Lighting_Backend.service.EmployeeService;
import com.example.Jay_Lighting_Backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from any origin
public class employeeController {
    private final EmployeeService employeeService;

    public employeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    //add employee
    @PostMapping("/add")
    public Employee addEmployee(@RequestBody Employee employee){
        return employeeService.addEmployee(employee);
    }

    //get all employees
    @GetMapping("/get")
    public List<Employee> getEmployees(){
        return employeeService.getEmployees();
    }

    //get employee by ID
    @GetMapping("/getById/{id}")
    public Employee getEmployeeById(@PathVariable Long id){
        return employeeService.getEmployeeById(id);
    }

    //update employee by ID
    @PutMapping("/updateById/{id}")
    public Employee updateEmployeeById(@PathVariable Long id, @RequestBody Employee employeeDetails){
        return employeeService.updateEmployeeById(id,employeeDetails);
    }

    // Delete product by ID
    @DeleteMapping("/deleteById/{id}")
    public Employee deleteEmployeeById(@PathVariable Long id){
        return employeeService.deleteEmployeeById(id);

    }
}

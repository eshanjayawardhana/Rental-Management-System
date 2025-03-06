package com.example.Jay_Lighting_Backend.service;

import com.example.Jay_Lighting_Backend.model.Employee;
import com.example.Jay_Lighting_Backend.model.Product;
import com.example.Jay_Lighting_Backend.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    //add a employee
    public Employee addEmployee(Employee employee){
        return employeeRepository.save(employee);
    }

    //get all employees
    public List<Employee> getEmployees(){
        return employeeRepository.findAll();
    }

    //get employee by id
    public Employee getEmployeeById(Long id){
        return employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id)); // no employee exists with that ID, it throws an exception.
    }

    //update product by ID
    public Employee updateEmployeeById(Long id, Employee employeeDetails){
        Optional<Employee> employee = employeeRepository.findById(id); //isPresent() is a method in Java's Optional class
        if(employee.isPresent()){
            Employee existingEmployee = employee.get();

            existingEmployee.setName(employeeDetails.getName());
            existingEmployee.setAddress(employeeDetails.getAddress());
            existingEmployee.setEmail(employeeDetails.getEmail());
            existingEmployee.setId_number(employeeDetails.getId_number());
            existingEmployee.setPhone_no(employeeDetails.getPhone_no());

            return employeeRepository.save(existingEmployee);
        }else {
            throw new RuntimeException("Employee not found with ID: " + id);
        }
    }

    // Delete product by ID
    public Employee deleteEmployeeById(Long id){
        Employee employee = employeeRepository.findById(id).get();
        employeeRepository.delete(employee);

        return employee;
    }
}

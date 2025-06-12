package com.pizzadelivery.backend.repository;

import com.pizzadelivery.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, String> {
}
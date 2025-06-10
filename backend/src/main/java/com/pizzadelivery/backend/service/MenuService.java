package com.pizzadelivery.backend.service;

import com.pizzadelivery.backend.entity.PizzaExtra;
import com.pizzadelivery.backend.entity.PizzaFlavor;
import com.pizzadelivery.backend.entity.PizzaType;
import com.pizzadelivery.backend.repository.PizzaExtraRepository;
import com.pizzadelivery.backend.repository.PizzaFlavorRepository;
import com.pizzadelivery.backend.repository.PizzaTypeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final PizzaTypeRepository pizzaTypeRepo;
    private final PizzaFlavorRepository pizzaFlavorRepo;
    private final PizzaExtraRepository pizzaExtraRepo;

    public List<PizzaType> getAllTypes() { return pizzaTypeRepo.findAll(); }
    public List<PizzaFlavor> getAllFlavors() { return pizzaFlavorRepo.findAll(); }
    public List<PizzaExtra> getAllExtras() { return pizzaExtraRepo.findAll(); }

    @Transactional
    public PizzaType saveType(PizzaType type) { return pizzaTypeRepo.save(type); }

    @Transactional
    public PizzaType updateType(String id, PizzaType typeDetails) {
        PizzaType type = pizzaTypeRepo.findById(id).orElseThrow(() -> new RuntimeException("PizzaType not found"));
        type.setName(typeDetails.getName());
        type.setDescription(typeDetails.getDescription());
        type.setBasePrice(typeDetails.getBasePrice());
        return pizzaTypeRepo.save(type);
    }

    public void deleteType(String id) { pizzaTypeRepo.deleteById(id); }

    @Transactional
    public PizzaFlavor saveFlavor(PizzaFlavor flavor) {
        PizzaType type = pizzaTypeRepo.findById(flavor.getPizzaType().getId())
                .orElseThrow(() -> new RuntimeException("PizzaType not found for flavor"));
        flavor.setPizzaType(type);
        return pizzaFlavorRepo.save(flavor);
    }

    @Transactional
    public PizzaFlavor updateFlavor(String id, PizzaFlavor flavorDetails) {
        PizzaFlavor flavor = pizzaFlavorRepo.findById(id).orElseThrow(() -> new RuntimeException("PizzaFlavor not found"));
        PizzaType type = pizzaTypeRepo.findById(flavorDetails.getPizzaType().getId())
                .orElseThrow(() -> new RuntimeException("PizzaType not found for flavor update"));
        flavor.setName(flavorDetails.getName());
        flavor.setDescription(flavorDetails.getDescription());
        flavor.setPrice(flavorDetails.getPrice());
        flavor.setPizzaType(type);
        return pizzaFlavorRepo.save(flavor);
    }

    public void deleteFlavor(String id) { pizzaFlavorRepo.deleteById(id); }

    @Transactional
    public PizzaExtra saveExtra(PizzaExtra extra) { return pizzaExtraRepo.save(extra); }

    @Transactional
    public PizzaExtra updateExtra(String id, PizzaExtra extraDetails) {
        PizzaExtra extra = pizzaExtraRepo.findById(id).orElseThrow(() -> new RuntimeException("PizzaExtra not found"));
        extra.setName(extraDetails.getName());
        extra.setDescription(extraDetails.getDescription());
        extra.setPrice(extraDetails.getPrice());
        return pizzaExtraRepo.save(extra);
    }

    public void deleteExtra(String id) { pizzaExtraRepo.deleteById(id); }
}

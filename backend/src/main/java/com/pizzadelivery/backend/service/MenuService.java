package com.pizzadelivery.backend.service;

import com.pizzadelivery.backend.dto.MenuDtos;
import com.pizzadelivery.backend.entity.PizzaCrust;
import com.pizzadelivery.backend.entity.PizzaExtra;
import com.pizzadelivery.backend.entity.PizzaFlavor;
import com.pizzadelivery.backend.entity.PizzaType;
import com.pizzadelivery.backend.repository.PizzaCrustRepository;
import com.pizzadelivery.backend.repository.PizzaExtraRepository;
import com.pizzadelivery.backend.repository.PizzaFlavorRepository;
import com.pizzadelivery.backend.repository.PizzaTypeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final PizzaTypeRepository pizzaTypeRepo;
    private final PizzaFlavorRepository pizzaFlavorRepo;
    private final PizzaExtraRepository pizzaExtraRepo;
    private final PizzaCrustRepository pizzaCrustRepo;
    private final FileStorageService fileStorageService;


    public List<PizzaType> getAllTypes() { return pizzaTypeRepo.findAll(); }
    public List<PizzaFlavor> getAllFlavors() { return pizzaFlavorRepo.findAll(); }
    public List<PizzaExtra> getAllExtras() { return pizzaExtraRepo.findAll(); }
    public List<PizzaCrust> getAllCrusts() { return pizzaCrustRepo.findAll(); }

    @Transactional
    public PizzaType saveType(PizzaType type) {
        if (type.getAvailableExtras() != null && !type.getAvailableExtras().isEmpty()) {
            List<String> extraIds = type.getAvailableExtras().stream().map(PizzaExtra::getId).collect(Collectors.toList());
            List<PizzaExtra> extras = pizzaExtraRepo.findAllById(extraIds);
            type.setAvailableExtras(extras);
        } else {
            type.setAvailableExtras(Collections.emptyList());
        }

        if (type.getAvailableCrusts() != null && !type.getAvailableCrusts().isEmpty()) {
            List<String> crustIds = type.getAvailableCrusts().stream().map(PizzaCrust::getId).collect(Collectors.toList());
            List<PizzaCrust> crusts = pizzaCrustRepo.findAllById(crustIds);
            type.setAvailableCrusts(crusts);
        } else {
            type.setAvailableCrusts(Collections.emptyList());
        }

        return pizzaTypeRepo.save(type);
    }

    @Transactional
    public PizzaType updateType(String id, PizzaType typeDetails) {
        PizzaType type = pizzaTypeRepo.findById(id).orElseThrow(() -> new RuntimeException("PizzaType not found"));
        type.setName(typeDetails.getName());
        type.setDescription(typeDetails.getDescription());
        type.setBasePrice(typeDetails.getBasePrice());

        if (typeDetails.getAvailableExtras() != null) {
            List<String> extraIds = typeDetails.getAvailableExtras().stream().map(PizzaExtra::getId).collect(Collectors.toList());
            List<PizzaExtra> extras = pizzaExtraRepo.findAllById(extraIds);
            type.setAvailableExtras(extras);
        } else {
            type.setAvailableExtras(Collections.emptyList());
        }

        if (typeDetails.getAvailableCrusts() != null) {
            List<String> crustIds = typeDetails.getAvailableCrusts().stream().map(PizzaCrust::getId).collect(Collectors.toList());
            List<PizzaCrust> crusts = pizzaCrustRepo.findAllById(crustIds);
            type.setAvailableCrusts(crusts);
        } else {
            type.setAvailableCrusts(Collections.emptyList());
        }
        return pizzaTypeRepo.save(type);
    }

    @Transactional
    public PizzaType savePizzaTypeImage(String typeId, MultipartFile file) {
        PizzaType type = pizzaTypeRepo.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Tipo de Pizza não encontrado com o id: " + typeId));
        String imageUrl = fileStorageService.storeFile(file);
        type.setImageUrl(imageUrl);
        return pizzaTypeRepo.save(type);
    }

    public void deleteType(String id) {
        pizzaTypeRepo.deleteById(id);
    }

    @Transactional
    public List<PizzaExtra> getExtrasByTypeId(String typeId) {
        PizzaType type = pizzaTypeRepo.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Tipo de Pizza não encontrado com o id: " + typeId));
        return new ArrayList<>(type.getAvailableExtras());
    }

    @Transactional
    public List<PizzaCrust> getCrustsByTypeId(String typeId) {
        PizzaType type = pizzaTypeRepo.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Tipo de Pizza não encontrado com o id: " + typeId));
        return new ArrayList<>(type.getAvailableCrusts());
    }

    // --- MÉTODOS DE SABORES ---
    @Transactional
    public PizzaFlavor saveFlavor(MenuDtos.FlavorUpdateRequest dto) {
        List<PizzaType> typesToAssociate = pizzaTypeRepo.findAllById(dto.pizzaTypeIds());
        PizzaFlavor newFlavor = PizzaFlavor.builder()
                .name(dto.name())
                .description(dto.description())
                .price(dto.price())
                .pizzaTypes(typesToAssociate)
                .build();
        return pizzaFlavorRepo.save(newFlavor);
    }

    @Transactional
    public PizzaFlavor updateFlavor(String id, MenuDtos.FlavorUpdateRequest dto) {
        PizzaFlavor flavor = pizzaFlavorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("PizzaFlavor not found"));

        List<PizzaType> typesToAssociate = pizzaTypeRepo.findAllById(dto.pizzaTypeIds());

        flavor.setName(dto.name());
        flavor.setDescription(dto.description());
        flavor.setPrice(dto.price());
        flavor.setPizzaTypes(typesToAssociate);

        return pizzaFlavorRepo.save(flavor);
    }

    @Transactional
    public PizzaFlavor saveFlavorImage(String flavorId, MultipartFile file) {
        PizzaFlavor flavor = pizzaFlavorRepo.findById(flavorId)
                .orElseThrow(() -> new RuntimeException("Sabor não encontrado com o id: " + flavorId));
        String imageUrl = fileStorageService.storeFile(file);
        flavor.setImageUrl(imageUrl);
        return pizzaFlavorRepo.save(flavor);
    }

    public void deleteFlavor(String id) {
        pizzaFlavorRepo.deleteById(id);
    }

    // --- MÉTODOS DE ADICIONAIS ---
    @Transactional
    public PizzaExtra saveExtra(MenuDtos.ExtraUpdateRequest dto) {
        PizzaExtra newExtra = PizzaExtra.builder()
                .name(dto.name())
                .description(dto.description())
                .price(dto.price())
                .build();
        final PizzaExtra savedExtra = pizzaExtraRepo.save(newExtra);

        if (dto.pizzaTypeIds() != null && !dto.pizzaTypeIds().isEmpty()) {
            List<PizzaType> typesToAssociate = pizzaTypeRepo.findAllById(dto.pizzaTypeIds());
            typesToAssociate.forEach(type -> {
                if (type.getAvailableExtras() == null) {
                    type.setAvailableExtras(new ArrayList<>());
                }
                type.getAvailableExtras().add(savedExtra);
            });
        }
        return savedExtra;
    }

    @Transactional
    public PizzaExtra updateExtra(String id, MenuDtos.ExtraUpdateRequest dto) {
        PizzaExtra extra = pizzaExtraRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("PizzaExtra not found"));
        extra.setName(dto.name());
        extra.setDescription(dto.description());
        extra.setPrice(dto.price());

        List<PizzaType> oldAssociations = pizzaTypeRepo.findByAvailableExtrasId(id);
        oldAssociations.forEach(type -> type.getAvailableExtras().removeIf(e -> e.getId().equals(id)));

        if (dto.pizzaTypeIds() != null && !dto.pizzaTypeIds().isEmpty()) {
            List<PizzaType> newAssociations = pizzaTypeRepo.findAllById(dto.pizzaTypeIds());
            newAssociations.forEach(type -> {
                if (type.getAvailableExtras().stream().noneMatch(e -> e.getId().equals(id))) {
                    type.getAvailableExtras().add(extra);
                }
            });
        }
        return pizzaExtraRepo.save(extra);
    }

    @Transactional
    public void deleteExtra(String id) {
        List<PizzaType> associations = pizzaTypeRepo.findByAvailableExtrasId(id);
        associations.forEach(type -> type.getAvailableExtras().removeIf(e -> e.getId().equals(id)));
        pizzaTypeRepo.saveAll(associations);
        pizzaExtraRepo.deleteById(id);
    }

    // --- MÉTODOS PARA BORDAS ---
    @Transactional
    public PizzaCrust saveCrust(MenuDtos.CrustUpdateRequest dto) {
        PizzaCrust newCrust = PizzaCrust.builder()
                .name(dto.name())
                .description(dto.description())
                .price(dto.price())
                .build();
        final PizzaCrust savedCrust = pizzaCrustRepo.save(newCrust);

        if (dto.pizzaTypeIds() != null && !dto.pizzaTypeIds().isEmpty()) {
            List<PizzaType> typesToAssociate = pizzaTypeRepo.findAllById(dto.pizzaTypeIds());
            typesToAssociate.forEach(type -> {
                if (type.getAvailableCrusts() == null) {
                    type.setAvailableCrusts(new ArrayList<>());
                }
                type.getAvailableCrusts().add(savedCrust);
            });
        }
        return savedCrust;
    }

    @Transactional
    public PizzaCrust updateCrust(String id, MenuDtos.CrustUpdateRequest dto) {
        PizzaCrust crust = pizzaCrustRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("PizzaCrust not found"));
        crust.setName(dto.name());
        crust.setDescription(dto.description());
        crust.setPrice(dto.price());

        List<PizzaType> oldAssociations = pizzaTypeRepo.findByAvailableCrustsId(id);
        oldAssociations.forEach(type -> type.getAvailableCrusts().removeIf(c -> c.getId().equals(id)));

        if (dto.pizzaTypeIds() != null && !dto.pizzaTypeIds().isEmpty()) {
            List<PizzaType> newAssociations = pizzaTypeRepo.findAllById(dto.pizzaTypeIds());
            newAssociations.forEach(type -> {
                if (type.getAvailableCrusts().stream().noneMatch(c -> c.getId().equals(id))) {
                    type.getAvailableCrusts().add(crust);
                }
            });
        }
        return pizzaCrustRepo.save(crust);
    }

    @Transactional
    public void deleteCrust(String id) {
        List<PizzaType> associations = pizzaTypeRepo.findByAvailableCrustsId(id);
        associations.forEach(type -> type.getAvailableCrusts().removeIf(c -> c.getId().equals(id)));
        pizzaTypeRepo.saveAll(associations);
        pizzaCrustRepo.deleteById(id);
    }
}
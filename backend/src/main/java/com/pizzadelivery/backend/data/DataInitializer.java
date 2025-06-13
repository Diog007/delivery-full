//package com.pizzadelivery.backend.data;
//
//import com.pizzadelivery.backend.entity.*;
//import com.pizzadelivery.backend.repository.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Component
//@RequiredArgsConstructor
//public class DataInitializer implements CommandLineRunner {
//
//    private final PizzaTypeRepository pizzaTypeRepo;
//    private final PizzaFlavorRepository pizzaFlavorRepo;
//    private final PizzaExtraRepository pizzaExtraRepo;
//    private final OrderRepository orderRepo;
//    private final AdminRepository adminRepo;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) {
//        if (adminRepo.count() == 0) {
//            initializeData();
//        }
//    }
//
//    private void initializeData() {
//        // Admin User
//        adminRepo.save(Admin.builder()
//                .name("Administrador do Sistema")
//                .username("admin")
//                .password(passwordEncoder.encode("123456789teste"))
//                .build());
//
//        // Pizza Types
//        PizzaType grande = pizzaTypeRepo.save(PizzaType.builder().name("Pizza Grande").description("Pizza tradicional de 35cm, serve até 4 pessoas").basePrice(25.0).build());
//        PizzaType pequena = pizzaTypeRepo.save(PizzaType.builder().name("Pizza Pequena").description("Pizza individual de 25cm, serve até 2 pessoas").basePrice(18.0).build());
//        PizzaType doce = pizzaTypeRepo.save(PizzaType.builder().name("Pizza Doce").description("Pizza doce especial com massa açucarada").basePrice(22.0).build());
//
//        // Pizza Flavors
////        PizzaFlavor portuguesa = pizzaFlavorRepo.save(PizzaFlavor.builder().name("Portuguesa").description("Molho de tomate, mussarela, presunto, ovos e azeitonas").pizzaType(grande).price(5).build());
////        pizzaFlavorRepo.save(PizzaFlavor.builder().name("Calabresa").description("Molho de tomate, mussarela e calabresa").pizzaType(grande).price(3).build());
////        pizzaFlavorRepo.save(PizzaFlavor.builder().name("Margherita (Pequena)").description("Molho de tomate, mussarela e manjericão").pizzaType(pequena).price(0).build());
//
//        // Pizza Extras
//        PizzaExtra bordaCatupiry = pizzaExtraRepo.save(PizzaExtra.builder().name("Borda Recheada com Catupiry").description("Borda recheada com catupiry cremoso").price(8).build());
//        pizzaExtraRepo.save(PizzaExtra.builder().name("Extra Queijo").description("Dobro de queijo mussarela").price(5).build());
//
//        // Mock Order
////        OrderItem orderItem = OrderItem.builder()
////                .pizzaType(grande)
////                .flavor(portuguesa)
////                .extras(List.of(bordaCatupiry))
////                .observations("Sem cebola")
////                .quantity(1)
////                .totalPrice(38.0)
////                .build();
////
////
////    }
//}

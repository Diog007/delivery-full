package com.pizzadelivery.backend.service;

import com.pizzadelivery.backend.dto.CustomerDtos;
import com.pizzadelivery.backend.dto.CustomerDtos.AddressDto;
import com.pizzadelivery.backend.dto.CustomerDtos.RegisterRequest;
import com.pizzadelivery.backend.entity.Address;
import com.pizzadelivery.backend.entity.CustomerUser;
import com.pizzadelivery.backend.entity.Order;
import com.pizzadelivery.backend.repository.AddressRepository;
import com.pizzadelivery.backend.repository.CustomerUserRepository;
import com.pizzadelivery.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerUserRepository customerUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final EmailService emailService;


    public CustomerUser register(RegisterRequest req) {
        if (customerUserRepository.existsByEmail(req.email())) {
            throw new RuntimeException("Este e-mail já está em uso.");
        }
        CustomerUser newUser = CustomerUser.builder()
                .name(req.name())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .whatsapp(req.whatsapp())
                .cpf(req.cpf())
                .build();
        return customerUserRepository.save(newUser);
    }

    public List<Order> findOrdersForCustomer(String email) {
        CustomerUser customer = customerUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + email));

        return orderRepository.findByCustomerUser_IdOrderByCreatedAtDesc(customer.getId());
    }

    public List<CustomerDtos.CustomerResponseDto> getAllCustomers() {
        return customerUserRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CustomerDtos.CustomerResponseDto updateCustomer(String id, CustomerDtos.AdminCustomerUpdateRequest updateRequest) {
        CustomerUser customer = customerUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o id: " + id));

        customer.setName(updateRequest.name());
        customer.setEmail(updateRequest.email());
        customer.setWhatsapp(updateRequest.whatsapp());
        customer.setCpf(updateRequest.cpf());

        CustomerUser updatedCustomer = customerUserRepository.save(customer);
        return convertToDto(updatedCustomer);
    }

    public void deleteCustomerById(String id) {
        if (!customerUserRepository.existsById(id)) {
            throw new RuntimeException("Cliente não encontrado com o id: " + id);
        }
        customerUserRepository.deleteById(id);
    }

    @Transactional
    public AddressDto updateAddress(String addressId, AddressDto addressDto) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado com o id: " + addressId));

        address.setStreet(addressDto.street());
        address.setNumber(addressDto.number());
        address.setComplement(addressDto.complement());
        address.setNeighborhood(addressDto.neighborhood());
        address.setCity(addressDto.city());
        address.setZipCode(addressDto.zipCode());

        Address updatedAddress = addressRepository.save(address);
        return convertToDto(updatedAddress);
    }

    public void deleteAddress(String addressId) {
        addressRepository.deleteById(addressId);
    }

    private CustomerDtos.CustomerResponseDto convertToDto(CustomerUser user) {
        List<AddressDto> addressDtos = user.getAddresses() != null
                ? user.getAddresses().stream().map(this::convertToDto).collect(Collectors.toList())
                : List.of();

        boolean isEmailVerified = user.getEmailVerified() != null && user.getEmailVerified();

        // --- INÍCIO DA ALTERAÇÃO ---
        // Busca todos os pedidos do cliente para calcular os totais
        List<Order> orders = orderRepository.findByCustomerUser_IdOrderByCreatedAtDesc(user.getId());
        int totalOrders = orders.size();
        double totalSpent = orders.stream().mapToDouble(Order::getTotalAmount).sum();

        return new CustomerDtos.CustomerResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getWhatsapp(),
                user.getCpf(),
                addressDtos,
                user.getGoogleId(),
                user.getPictureUrl(),
                isEmailVerified,
                user.getLocale(),
                user.getLastLogin(),
                user.getCreatedAt(),
                totalOrders,
                totalSpent
        );
        // --- FIM DA ALTERAÇÃO ---
    }

    private AddressDto convertToDto(Address address) {
        return new AddressDto(
                address.getId(),
                address.getStreet(),
                address.getNumber(),
                address.getComplement(),
                address.getNeighborhood(),
                address.getCity(),
                address.getZipCode()
        );
    }

    @Transactional
    public void initiatePasswordReset(String email) {
        CustomerUser customer = customerUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Não foi encontrado um usuário com este e-mail."));

        // Garante que contas do Google não possam redefinir a senha
        if (customer.getPassword() == null || customer.getPassword().isEmpty()) {
            throw new RuntimeException("Contas criadas com o Google não podem ter a senha redefinida.");
        }

        String token = UUID.randomUUID().toString();
        customer.setPasswordResetToken(token);
        customer.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token válido por 1 hora
        customerUserRepository.save(customer);

        emailService.sendPasswordResetEmail(customer.getEmail(), token);
    }

    @Transactional
    public void completePasswordReset(String token, String newPassword) {
        CustomerUser customer = customerUserRepository.findAll().stream()
                .filter(c -> token.equals(c.getPasswordResetToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Token de redefinição inválido."));

        if (customer.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token de redefinição expirado.");
        }

        customer.setPassword(passwordEncoder.encode(newPassword));
        customer.setPasswordResetToken(null);
        customer.setPasswordResetTokenExpiry(null);
        customerUserRepository.save(customer);
    }
}
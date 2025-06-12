package com.pizzadelivery.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService() {
        // Define o diretório de upload. Isso pode ser movido para application.properties
        this.fileStorageLocation = Paths.get("./uploads/images").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Não foi possível criar o diretório para upload de arquivos.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Gera um nome de arquivo único para evitar conflitos
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        try {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        } catch (Exception e) {
            fileExtension = "";
        }
        String fileName = UUID.randomUUID().toString() + fileExtension;

        try {
            // Copia o arquivo para o local de destino
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Retorna o caminho para ser salvo no banco de dados
            return "/images/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Não foi possível armazenar o arquivo " + fileName + ". Tente novamente!", ex);
        }
    }
}
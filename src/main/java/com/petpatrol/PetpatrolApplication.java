package com.petpatrol;

import com.petpatrol.configuration.FileStorageProperties;
import com.petpatrol.configuration.StorageProperties;
import com.petpatrol.service.FileSystemStorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.context.annotation.Bean;

@EnableCircuitBreaker
@EnableConfigurationProperties({ StorageProperties.class, FileStorageProperties.class })
@SpringBootApplication
public class PetpatrolApplication
{
    public static void main(String[] args)
    {
        SpringApplication.run(PetpatrolApplication.class, args);
    }

    @Bean
    CommandLineRunner init(FileSystemStorageService storageService)
    {
        return (args) -> {
            storageService.deleteAll();
            storageService.init();
        };
    }
}

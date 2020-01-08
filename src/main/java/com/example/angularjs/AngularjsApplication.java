package com.example.angularjs;

import com.example.angularjs.configuration.FileStorageProperties;
import com.example.angularjs.configuration.StorageProperties;
import com.example.angularjs.service.FileSystemStorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.context.annotation.Bean;

@EnableCircuitBreaker
@EnableConfigurationProperties({ StorageProperties.class, FileStorageProperties.class })
@SpringBootApplication
public class AngularjsApplication
{
    public static void main(String[] args)
    {
        SpringApplication.run(AngularjsApplication.class, args);
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

package com.example.angularjs.configuration;

import com.example.angularjs.model.Event;
import com.example.angularjs.model.Picture;
import com.example.angularjs.model.User;
import com.example.angularjs.service.FileSystemStorageService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "database")
@JsonIgnoreProperties({ "$$beanFactory" })
public class DatabaseConfiguration
{
    private List<User> users;
    private List<Event> events;
    private List<Picture> pictures;
}

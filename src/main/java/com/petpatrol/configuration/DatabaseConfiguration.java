package com.petpatrol.configuration;

import com.petpatrol.model.Event;
import com.petpatrol.model.Picture;
import com.petpatrol.model.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

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

package com.example.angularjs.controller;

import com.example.angularjs.configuration.DatabaseConfiguration;
import com.example.angularjs.configuration.StorageProperties;
import com.example.angularjs.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class EventController
{
    private final DatabaseConfiguration configuration;

    @Autowired
    public EventController(DatabaseConfiguration configuration)
    {
        this.configuration = configuration;
    }

    @GetMapping("/getEventId")
    public Long getEventId()
    {
        return StorageProperties.createEventId();
    }

    @PostMapping("events")
    public void handleEvents(@RequestBody Event event)
    {
        configuration.getEvents().add(event);
    }

    @GetMapping("events")
    public List<Event> getEvents()
    {
        return configuration.getEvents();
    }
}
